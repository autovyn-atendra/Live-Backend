const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
require("dotenv").config();

// This file is intentionally self-contained and does NOT import from or
// modify utils/dbconfig.js. dbname() is used by 85+ other routes across the
// app — pool-caching there is a much bigger blast radius than attendance
// alone, so the same config-reading/decrypt logic is duplicated here on
// purpose to keep this change scoped to the attendance punch flow only.

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const CONFIG_PATH = path.join(__dirname, "../config/config.json");

function getGlobalKey() {
    const keyPath = process.env.SERVER_PRIVATE_KEY_PATH;
    if (!keyPath) {
        console.error("[attendancePool] FATAL: SERVER_PRIVATE_KEY_PATH is not set");
        process.exit(1);
    }
    return fs.readFileSync(keyPath, "utf8");
}

function decrypt(encryptedValue, entryKey) {
    let b64 = String(encryptedValue);
    if (b64.startsWith("RSA-OAEP:")) b64 = b64.slice("RSA-OAEP:".length);
    else if (b64.startsWith("ENC:")) b64 = b64.slice("ENC:".length);

    let keyPem;
    if (IS_PRODUCTION) {
        keyPem = getGlobalKey().trim();
    } else {
        if (!entryKey) {
            throw new Error("[attendancePool] No _key found in config entry — ensure the bundle file contains a privateKey field.");
        }
        keyPem = String(entryKey).trim();
    }

    if (!keyPem.includes("PRIVATE KEY")) {
        throw new Error("[attendancePool] Resolved private key is malformed — does not look like a PEM file.");
    }

    return crypto.privateDecrypt(
        { key: keyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
        Buffer.from(b64, "base64")
    ).toString("utf8");
}

// One Sequelize instance (= one connection pool) per compCode+year, reused
// across punch requests and worker runs instead of creating a brand-new
// pool every time. Scoped to this file only — dbname()'s pools are untouched.
const poolCache = new Map();

function buildSequelize(compCodeBase, year) {
    const databaseConfigs = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    const entry = databaseConfigs[compCodeBase];

    if (!entry) {
        throw new Error(`No configuration defined for dlrId -- ${compCodeBase} — contact admin`);
    }

    const { _key, ...dbConfig } = entry;
    const dbName = year ? `${dbConfig.database?.slice(0, 6)}${year}` : dbConfig.database;

    const sequelize = new Sequelize(dbName, dbConfig.username, decrypt(dbConfig.password, IS_PRODUCTION ? null : _key), {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: "mssql",
        // No `timezone` override here on purpose. Sequelize's DATE-type
        // stringify (used whenever a raw JS Date is passed as a `replacements`
        // value) always appends a zone-offset suffix to the literal regardless
        // of what `timezone` is set to — and every timestamp column this pool
        // writes to is smalldatetime, which rejects any offset suffix outright
        // with a conversion error. So attendanceFlushLogic.js formats capturedAt
        // into an explicit offset-free IST string itself (see istDate.js's
        // formatISTDateTime) before it ever reaches `replacements`, instead of
        // relying on this option. Leaving `timezone` at Sequelize's default
        // means if a raw Date ever gets passed through here by mistake, it
        // fails loudly (conversion error) instead of silently writing a
        // wrong/shifted time.
        // Not wired into logRequests.js's per-request query audit log on purpose
        // (that would mean touching dbname()/logRequests.js, which is out of
        // scope here). Set to a plain console logger if that trade-off ever
        // needs revisiting.
        logging: false,
        dialectOptions: {
            options: { connectTimeout: 30000, requestTimeout: 30000 },
            pool: { max: 50, min: 2, acquire: 30000, idle: 30000 },
        },
    });
    sequelize.config.password = "********";

    // Shared/reused across many callers — an individual caller's
    // `finally { sequelize.close() }` must not tear down the pool.
    // Use closeAllAttendancePools() for real shutdown.
    sequelize.close = async () => { };

    return sequelize;
}

// Unlike dbname(), errors are NOT swallowed here — they reject the returned
// promise so callers (the punch API precheck, the flush worker) can catch
// them and react (e.g. the worker leaves the file in pending/ for retry).
async function getAttendancePool(compcode) {
    const year = compcode?.split("-")[1];
    const compCodeBase = compcode?.split("-")[0]?.toUpperCase();
    if (!compCodeBase) {
        throw new Error("getAttendancePool: compcode is required");
    }
    const cacheKey = `${compCodeBase}::${year || ""}`;

    if (!poolCache.has(cacheKey)) {
        const creationPromise = Promise.resolve().then(() => buildSequelize(compCodeBase, year));
        // Cache the promise itself so concurrent first-callers for the same
        // compCode share one pool instead of racing to create two.
        poolCache.set(cacheKey, creationPromise);
        creationPromise.catch(() => poolCache.delete(cacheKey));
    }

    return poolCache.get(cacheKey);
}

// For graceful process shutdown only — bypasses the neutralized instance
// .close() to actually close every cached pool.
async function closeAllAttendancePools() {
    const pending = Array.from(poolCache.values());
    poolCache.clear();
    for (const pendingSequelize of pending) {
        try {
            const sequelize = await pendingSequelize;
            await Sequelize.prototype.close.call(sequelize);
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = { getAttendancePool, closeAllAttendancePools };