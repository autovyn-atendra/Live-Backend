const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");
require("dotenv").config();
const crypto = require("crypto");

const IS_PRODUCTION = process.env.NODE_ENV === "production";
const CONFIG_PATH = path.join(__dirname, "../config/config.json");

// Production-only: single secure key file, never embedded in config
let _globalKeyCache = null;

function getGlobalKey() {

  const keyPath = process.env.SERVER_PRIVATE_KEY_PATH;
  if (!keyPath) {
    console.error("[db] FATAL: SERVER_PRIVATE_KEY_PATH is not set");
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
    // Production: always use SERVER_PRIVATE_KEY_PATH — _key in config is intentionally ignored
    keyPem = getGlobalKey().trim();
  } else {
    // Local: key must be present in the config entry (_key from merged bundle)
    if (!entryKey) {
      throw new Error("[db] No _key found in config entry — ensure the bundle file contains a privateKey field.");
    }
    keyPem = String(entryKey).trim();
  }

  if (!keyPem.includes("PRIVATE KEY")) {
    throw new Error("[db] Resolved private key is malformed — does not look like a PEM file.");
  }

  return crypto.privateDecrypt(
    { key: keyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
    Buffer.from(b64, "base64")
  ).toString("utf8");
}

exports.dbname = async function (req, compCode) {
  try {
    const year = compCode?.split("-")[1];
    compCode = compCode?.split("-")[0];

    const databaseConfigs = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));
    const entry = databaseConfigs[compCode?.toUpperCase()];

    if (!entry) {
      throw new Error(`No configuration defined for dlrId -- ${compCode?.toUpperCase()} — contact admin`);
    }

    // Strip _key so it never reaches Sequelize; production ignores it entirely
    const { _key, ...dbConfig } = entry;
    const dbName = year ? `${dbConfig.database?.slice(0, 6)}${year}` : dbConfig.database;

    const sequelize = new Sequelize(dbName, dbConfig.username, decrypt(dbConfig.password, IS_PRODUCTION ? null : _key), {
      host: dbConfig.host,
      port: dbConfig.port,
      dialect: "mssql",
      logging: (query) => req?.logQuery?.(query.replace(/\s+/g, " ").trim()),
      dialectOptions: {
        options: { connectTimeout: 30000, requestTimeout: 30000 },
        pool: { max: 50, min: 2, acquire: 30000, idle: 30000 },
      },
    });
    // console.log(`Connected to database ${sequelize.config.database} -- ${sequelize.config.password}`);
    sequelize.config.password = "********";
    return sequelize;
  } catch (e) {
    console.log(e);
  }
};
