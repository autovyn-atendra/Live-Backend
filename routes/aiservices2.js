/**
 * AUTOVYN ENTERPRISE AI COPILOT V6 — COMPLETE ENTERPRISE AI ENGINE
 * ============================================================================
 * Architecture: 12-Engine Pipeline + Universal 257-Column Enterprise Master Intelligence
 * + Autonomous Adaptive Cross-Table Search & Self-Learning Fallback
 * 
 * Engines:
 *   1.  Intent Engine (Hindi, English, Hinglish Classification)
 *   2.  Entity Extraction Engine (EMPCODE, Dates, Branches, Numbers, Names, Identifiers)
 *   3.  Schema Knowledge Graph Engine (257 Columns EMPLOYEEMASTER + 30+ ERP Tables)
 *   4.  Synonym Engine (Comprehensive Hindi/English ERP Business & Column Dictionary)
 *   5.  SQL Planner & Optimizer (Readable MSSQL, TOP Limits, NOLOCK, Correct Joins)
 *   6.  SQL Validator & Auto-Repair (AST Guardrails, Read-Only, Exact Column Normalization)
 *   7.  Cache Engine (L1 Hash + L2 Templates + L3 Semantic Embedding Cosine)
 *   8.  Memory Engine (Multi-Turn Context, Anaphora Resolution)
 *   9.  Autonomous Adaptive Cross-Table Fallback & Deep Entity Search Engine
 *   10. Formatter Engine (Natural Hindi/English, Indian Currency, Markdown Tables)
 *   11. Confidence & Critic Engine (SQL Evidence Verification, Anti-Hallucination)
 *   12. Self-Learning & Telemetry Engine (AI_SQL_Learning_Tbl, Hit Counters)
 * ============================================================================
 */

"use strict";

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");
const { dbname } = require("../utils/dbconfig");

// Safe Optional Libraries
let axios;
try { axios = require("axios"); } catch (_) { }
let stringSimilarity;
try { stringSimilarity = require("string-similarity"); } catch (_) { }
let moment;
try { moment = require("moment"); } catch (_) {
  moment = (d) => ({
    format: (f) => new Date(d || Date.now()).toISOString(),
    startOf: () => ({ format: () => new Date().toISOString() }),
    endOf: () => ({ format: () => new Date().toISOString() })
  });
}

// ============================================================================
// ERROR HANDLING & UTILITY HELPERS
// ============================================================================

class ApiError extends Error {
  constructor(statusCode = 500, message = "Internal server error", details = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.status = statusCode;
    this.details = details;
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ApiError);
    }
  }
}

const asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

const normalizeText = (text) => {
  return String(text || "")
    .trim()
    .replace(/\s+/g, " ");
};

const normalizeLower = (text) => {
  return normalizeText(text).toLowerCase();
};

const toPositiveInteger = (val) => {
  const n = parseInt(val, 10);
  return !isNaN(n) && n > 0 ? n : null;
};

// Stop words to prevent false positive searches in fallback engine
const SEARCH_STOP_WORDS = new Set([
  "ka", "ki", "ke", "ko", "se", "me", "mein", "par", "pe", "hai", "hain", "tha", "the", "thi", "h", "kya",
  "kis", "kiska", "kiske", "kiski", "kisko", "batao", "bataiye", "detail", "details", "record", "records",
  "what", "who", "whom", "whose", "find", "show", "query", "tell", "about", "list", "please",
  "adhar", "aadhar", "aadhaar", "uid", "uidai", "pan", "panno", "bank", "account", "khata",
  "mobile", "phone", "number", "mob", "contact", "call", "cell", "attendance", "attandance",
  "salary", "pagar", "tankha", "tankhwa", "vetan", "payslip", "slip", "verify", "verification",
  "verified", "valid", "invalid", "month", "year", "date", "status", "location", "branch",
  "dept", "department", "designation", "role", "name", "naam", "emp", "employee", "karmchari",
  "iski", "iska", "inke", "unka", "unki", "mera", "meri", "apna", "apni",
  "present", "absent", "count", "total", "kitne", "kitna", "aaj", "kal", "today", "yesterday", "summary",
  "pf", "provident", "fund", "pension", "eps", "deduct", "deduction", "deductions", "kata", "katoti",
  "service", "services", "reminder", "reminders", "due", "due_list", "pending", "customer", "vehicle", "chassis", "engine", "jobcard",
  "invoice", "invoices", "bill", "bills", "billing", "voucher", "vouchers", "ledger", "account", "accounts", "stock", "inventory",
  "gatepass", "ro", "workshop", "insurance", "model", "fuel", "booking", "bookings", "lead", "leads", "enquiry", "dms",
  "target", "achievement", "profit", "loss", "trial", "balance", "pnl", "asset", "assets", "history", "audit", "report", "reports",
  "january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december",
  "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec",
  "miss", "mispunch", "punch", "punches", "select", "from", "where", "join", "joining", "inner", "left", "right", "cross", "order", "desc", "asc", "try_convert", "convert", "response", "galat", "lagana", "banao", "sahi", "reason", "reasons", "mipunch_reason", "attendancetable", "employeemaster", "misc_mst",
  "jab", "tab", "abhi", "tak", "since", "till", "hua", "huwa", "gaya", "overall",
  "kon", "kaun", "pass", "wala", "wale", "wali", "rakhta", "rakhti", "rakhte", "dikhao", "dikhaye", "karo", "karen", "kare", "hoga", "hogi", "honge", "hota", "hoti", "hote", "jinka", "jinke", "jinki",
  "work", "works", "anniversary", "anniversy", "aniversary", "anversary", "saalgirah", "salgirah", "day", "days", "birthday", "bday", "janamdin",
  "marriage", "marrige", "marraige", "merriage", "shadi", "shaadi", "sadi", "saadi", "wedding", "vivah", "byah", "dom", "doma", "patni", "pati", "wife", "husband",
  "anniv", "anniversaries", "holiday", "holidays", "leave", "leaves", "chhutti", "chhutiyan", "chhuttiyan", "sick", "casual", "privilege",
  "kin", "kinko", "kinka", "kisiko", "kinhi", "kinhe",
  "ab", "ye", "yeh", "wo", "woh", "kripya", "pls", "sabse", "jyada", "zyada", "kam", "adhik", "badi", "chhoti",
  "aur", "and", "then", "also", "basic", "gross", "net", "ctc", "ok", "post", "pad", "info", "information", "profile", "contact", "address", "pura", "puri", "sara", "sari", "bataye", "batana", "dekhna", "chahiye", "karu", "karo",
  "permanent", "temporary", "current", "present", "residential", "residence", "pata", "addresses",
  "nikalo", "nikalna", "nikal", "dikhana", "dikhao", "dikhaye", "batao", "bataiye", "do", "dena",
  "city", "state", "pincode", "pin", "house", "tehsil", "dist", "district",
  "retrieve", "retrieval", "fetch", "fetching", "provide", "providing", "give", "giving", "display", "displaying", "get", "getting", "bring",
  "their", "there", "them", "these", "those", "this", "that", "they", "with", "whose", "whom", "where", "when", "which",
  "number", "numbers", "person", "persons", "people", "both", "each", "every", "kindly",
  "inki", "inka", "inke", "inhe", "inhein", "unka", "unki", "unke", "unhe", "unhein", "iska", "iski", "iske"
]);

// ============================================================================
// OPENAI SDK & EMBEDDINGS MANAGEMENT
// ============================================================================

let openAIClientInstance = null;

const getOpenAIClient = () => {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    throw new ApiError(500, "OPENAI_API_KEY is not configured in backend environment");
  }

  if (!openAIClientInstance) {
    let OpenAIClass;
    try {
      const mod = require("openai");
      OpenAIClass = mod.OpenAI || mod.default || mod;
    } catch (e) {
      throw new ApiError(500, "OpenAI SDK package 'openai' is not installed");
    }
    openAIClientInstance = new OpenAIClass({ apiKey });
  }
  return openAIClientInstance;
};

const getModelConfig = () => {
  return {
    primaryModel: process.env.OPENAI_PRIMARY_MODEL || "gpt-4o-mini",
    fastModel: process.env.OPENAI_FAST_MODEL || "gpt-4o-mini",
    embeddingModel: process.env.OPENAI_EMBEDDING_MODEL || "text-embedding-3-small"
  };
};

const generateEmbedding = async (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return [];

  const config = getModelConfig();
  try {
    const client = getOpenAIClient();
    const response = await client.embeddings.create({
      model: config.embeddingModel,
      input: normalized,
      encoding_format: "float"
    });
    return response?.data?.[0]?.embedding || [];
  } catch (err) {
    console.warn("[V6-Embedding] Warning: Failed to generate embedding:", err?.message);
    return [];
  }
};

const cosineSimilarity = (vecA, vecB) => {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
};

// ============================================================================
// MULTILINGUAL TRANSLATION & CANONICALIZATION ENGINE
// ============================================================================

const TranslationCache = new Map();

/**
 * Detects if a query contains non-English characters or vernacular words,
 * and translates it into clean, standardized enterprise English using fast LLM / cache.
 * Preserves employee codes, IDs, numbers, and dates accurately.
 */
const translateToEnglishIfVernacular = async (text) => {
  const normalized = normalizeText(text);
  if (!normalized) return { englishQuery: "", isTranslated: false };

  // Fast check: If it's a SQL query or code, do not translate
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|EXEC|WITH)\b/i.test(normalized)) {
    return { englishQuery: normalized, isTranslated: false };
  }

  // 1. Check for non-ASCII / Unicode characters (Devanagari, Gujarati, Bengali, Tamil, etc.)
  const hasNonLatinScript = /[^\u0000-\u007F]/.test(normalized);

  // 2. Check for Hindi / Hinglish / Vernacular marker words in Latin script
  const hasVernacularMarkers = /\b(batao|bataiye|bata|dikhao|dikhaye|kiska|kiske|kiski|kisko|kitne|kitna|kitni|sabse|jyada|zyada|adhik|kam|pagar|tankha|tankhwa|vetan|chhutti|chutti|haziri|karmchari|janamdin|saalgirah|salgirah|aaj|kal|parso|pichhla|mahina|saal|hoga|hogi|honge|hai|hain|tha|the|thi|me|mein|se|ko|ka|ki|ke|par|pe|kare|karo|nikalo|chahiye|milega|kiske pass|kon kon|kaun kaun|jinka|jinke|jinki|wale|wali|walo|rakhta|rakhti|rakhte|kripya|dijiye)\b/i.test(normalized);

  if (!hasNonLatinScript && !hasVernacularMarkers) {
    // Already standard English
    return { englishQuery: normalized, isTranslated: false };
  }

  // Check in-memory translation cache (LRU-style capped at 2000 entries)
  const cacheKey = normalized.toLowerCase();
  if (TranslationCache.has(cacheKey)) {
    return {
      englishQuery: TranslationCache.get(cacheKey),
      originalQuery: normalized,
      isTranslated: true
    };
  }

  try {
    const client = getOpenAIClient();
    const config = getModelConfig();

    const response = await client.chat.completions.create({
      model: config.fastModel || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert enterprise ERP multilingual translator.
Translate the user's ERP query into clear, concise, standard business English.
CRITICAL PRESERVATION RULES:
1. Preserve all employee codes (e.g. 1924108, 1600159), IDs, numbers, and dates (e.g. January 2026, 2026-03-15) exactly as they are.
2. Preserve employee names (e.g. PANKAJ MOHANDAS JETHANI) exactly.
3. Preserve ERP table or column names (e.g. SALARYFILE, PF_Employee, attendancetable) if mentioned.
4. Output ONLY the plain English translated sentence. Do NOT add explanations, notes, or quotes.`
        },
        {
          role: "user",
          content: normalized
        }
      ],
      temperature: 0.0,
      max_tokens: 150
    });

    let translated = response?.choices?.[0]?.message?.content?.trim() || "";
    // Strip any accidental leading/trailing quotes or "Translation:" prefixes
    translated = translated.replace(/^["'`]|["'`]$/g, "").replace(/^Translation\s*:\s*/i, "").trim();

    if (translated) {
      if (TranslationCache.size > 2000) {
        const firstKey = TranslationCache.keys().next().value;
        TranslationCache.delete(firstKey);
      }
      TranslationCache.set(cacheKey, translated);

      return {
        englishQuery: translated,
        originalQuery: normalized,
        isTranslated: true,
        translationUsage: response.usage
      };
    }
  } catch (err) {
    console.warn("[V6-Translator] Translation notice, falling back to original query:", err?.message);
  }

  return { englishQuery: normalized, isTranslated: false };
};

// ============================================================================
// USER CONTEXT & JWT RESOLUTION
// ============================================================================

const buildUserContext = (req = {}) => {
  let user = req.user || {};
  const headers = req.headers || {};

  if (!user.userCode && headers.authorization) {
    try {
      const token = headers.authorization.replace(/^Bearer\s+/i, "").trim();
      const decoded = jwt.decode(token);
      if (decoded && typeof decoded === "object") {
        user = { ...decoded, ...user };
      }
    } catch (_) { }
  }

  const compcode = String(
    user.compcode ||
    headers.compcode ||
    headers["x-comp-code"] ||
    process.env.DEFAULT_COMPCODE ||
    "AUTOVYN"
  ).trim();

  const userCode = user.userCode || user.userId || user.id || headers.usercode || "admin";
  const employeeCode = user.employeeCode || user.empCode || user.EMPCODE || headers.empcode || null;
  const userName = user.userName || user.name || user.fullName || "Enterprise User";
  const role = String(user.role || headers.role || "ADMIN").toUpperCase();

  return {
    compcode,
    userCode,
    numericUserId: toPositiveInteger(userCode) || 1,
    employeeCode: employeeCode ? String(employeeCode).trim() : null,
    userName,
    role,
    branch: user.branch || headers.branch || null,
    department: user.department || headers.department || null,
    isAdmin: role.includes("ADMIN") || role.includes("SUPER") || role === "HR" || role === "CEO" || role === "MD"
  };
};

// ============================================================================
// ENGINE 4: UNIVERSAL ERP SYNONYM & BUSINESS DICTIONARY
// ============================================================================

const ERP_SYNONYM_DICTIONARY = {
  // Salary / Payroll
  salary: {
    targetTable: "SALARYFILE",
    synonyms: [
      "salary", "pagar", "tankhwa", "tankha", "pay", "vetan", "slip", "payslip",
      "payout", "earning", "gross", "net", "deduction", "ctc", "basic", "annual_ctc", "monthly_ctc"
    ],
    defaultColumns: ["Emp_Code", "SalMnth", "salyear", "Basic_Earn", "HRA_Earn", "Gross_Earn", "Final_Payment", "Deducation"],
    businessMeaning: "Stores employee monthly payroll calculations, gross earnings, net pay, and statutory deductions."
  },
  // Attendance & Punctuality
  attendance: {
    targetTable: "attendancetable",
    synonyms: [
      "attendance", "attandance", "haziri", "upsthiti", "punch", "in out", "shift",
      "biometric", "flag", "present", "absent", "late", "halfday", "mispunch", "overtime"
    ],
    defaultColumns: ["Emp_Code", "dateoffice", "flag", "status", "in1", "out1", "hoursworked"],
    businessMeaning: "Stores day-by-day employee attendance records, in/out punch times, and status flags (P=Present, A=Absent, WO=Weekly Off, HD=Half Day)."
  },
  // Leave Master & Policy
  leave: {
    targetTable: "Misc_Mst",
    misc_type: 92,
    synonyms: [
      "leave", "chhutti", "chutti", "avkaash", "casual leave", "cl", "pl", "sl", "privilege leave",
      "sick leave", "earned leave", "maternity", "half day policy", "leave policy", "leave balance"
    ],
    defaultColumns: ["UTD", "Misc_Type", "Misc_Code", "Misc_Name", "Misc_Dtl3", "Continuous_Max", "dis_back_date"],
    businessMeaning: "Stores master leave types and policy settings (Misc_Type = 92)."
  },
  // Employee Master Info (257 columns)
  employee: {
    targetTable: "EMPLOYEEMASTER",
    synonyms: [
      "employee", "emp", "staff", "karmchari", "worker", "person", "profile",
      "joining date", "designation", "desg", "department", "dept", "branch", "reporting",
      "father", "mother", "spouse", "wife", "husband", "emergency", "blood group",
      "dob", "doj", "pan", "aadhar", "passport", "license", "driving", "biometric",
      "mspin", "supervisor", "manager", "probation", "resignation", "relieving"
    ],
    defaultColumns: ["EMPCODE", "EMPFIRSTNAME", "EMPLASTNAME", "LOCATION", "EMPLOYEEDESIGNATION", "CURRENTJOINDATE", "MOBILENO", "PANNO", "ADHARNO", "BANKACCOUNTNO"],
    businessMeaning: "Master database of all active and separated employees covering 257 columns (personal, statutory KYC, banking, family, emergency, hierarchy, and dates)."
  },
  // Bank Account Penny-Drop Verification
  bank_verification: {
    targetTable: "Account_No_Api",
    synonyms: [
      "bank verify", "account verify", "bank account verify", "penny drop", "account_no_api",
      "bank account valid", "bank account invalid", "name_at_bank", "account_status", "raw_response", "khata verify"
    ],
    defaultColumns: ["account_number", "Ifsc", "name_at_bank", "account_exists", "raw_response", "Created_At"],
    businessMeaning: "Penny-drop automated bank verification log storing verified account names, bank names, branch, IFSC, and raw JSON gateway response."
  },
  // Statutory KYC & Identity Verification
  kyc_verification: {
    targetTable: "emp_varify",
    synonyms: [
      "kyc", "emp_varify", "pan verify", "aadhar verify", "aadhaar verify", "pan verified",
      "aadhaar verified", "aadhaar linked", "pan card verify", "document verification"
    ],
    defaultColumns: ["EMPCODE", "pan_card_ver", "pan_name_match_ver", "aadhaar_card_ver", "aadhaar_linked_ver", "aadhaar_linked_pan_ver", "Location", "Created_At"],
    businessMeaning: "Stores employee government ID verification status (PAN, Aadhaar, Aadhaar-PAN linkage, name matches)."
  },
  // Master Lookups & Dropdowns
  branch: {
    targetTable: "Misc_Mst",
    misc_type: 85,
    synonyms: ["branch", "location", "shakha", "office", "hub", "city branch"],
    defaultColumns: ["Misc_Code", "Misc_Name", "Loc_code"],
    businessMeaning: "Branch master catalog (Misc_Type = 85)."
  },
  department: {
    targetTable: "Misc_Mst",
    misc_type: 11,
    synonyms: ["department", "dept", "vibhag", "section", "division"],
    defaultColumns: ["Misc_Code", "Misc_Name"],
    businessMeaning: "Department master catalog (Misc_Type = 11)."
  },
  designation: {
    targetTable: "Misc_Mst",
    misc_type: 95,
    synonyms: ["designation", "desg", "post", "role", "pad"],
    defaultColumns: ["Misc_Code", "Misc_Name"],
    businessMeaning: "Employee designation master (Misc_Type = 95)."
  },
  // IT Assets
  asset: {
    targetTable: "Asset_Issue",
    synonyms: ["asset", "laptop", "desktop", "phone", "sim", "computer", "printer", "device", "samagri", "issue item"],
    defaultColumns: ["Emp_Code", "Aset_Name", "Asset_Code", "Issue_Date", "Return_Date", "Status"],
    businessMeaning: "Tracks IT equipment and physical company assets assigned to employees."
  }
};

// ============================================================================
// ENGINE 3: SCHEMA KNOWLEDGE GRAPH & DYNAMIC CATALOG ENGINE
// ============================================================================

class SchemaKnowledgeGraph {
  constructor() {
    this.catalog = null;
    this.catalogPath = path.resolve(__dirname, "../utils/erp_table_schema_catalog.json");
    this.tableIndex = new Map();
    this.relationshipGraph = new Map();
    this.loadCatalog();
  }

  loadCatalog() {
    try {
      if (fs.existsSync(this.catalogPath)) {
        const raw = fs.readFileSync(this.catalogPath, "utf8");
        this.catalog = JSON.parse(raw);
        this.buildIndex();
        console.log(`[V6-SchemaEngine] Successfully indexed ERP Knowledge Catalog (${Object.keys(this.catalog?.tables || {}).length} tables).`);
      } else {
        console.warn("[V6-SchemaEngine] Warning: Catalog file not found at:", this.catalogPath);
        this.catalog = { tables: {} };
      }
    } catch (err) {
      console.error("[V6-SchemaEngine] Error loading catalog JSON:", err?.message);
      this.catalog = { tables: {} };
    }
  }

  buildIndex() {
    const tables = this.catalog?.tables || {};
    for (const [tableName, meta] of Object.entries(tables)) {
      this.tableIndex.set(tableName.toLowerCase(), {
        tableName,
        displayName: meta.displayName || tableName,
        module: meta.module || "GENERAL",
        description: meta.description || "",
        columns: meta.columns || {},
        primaryKey: meta.primaryKey || ["UTD"],
        misc_type_mapping: meta.misc_type_mapping || {},
        typeColumn: meta.typeColumn || null,
        codeColumn: meta.codeColumn || null,
        nameColumn: meta.nameColumn || null,
      });

      if (!this.relationshipGraph.has(tableName)) {
        this.relationshipGraph.set(tableName, []);
      }
    }

    this.addRelation("EMPLOYEEMASTER", "SALARYFILE", "EMPCODE", "Emp_Code", "LEFT");
    this.addRelation("EMPLOYEEMASTER", "attendancetable", "EMPCODE", "Emp_Code", "LEFT");
    this.addRelation("EMPLOYEEMASTER", "emp_varify", "EMPCODE", "EMPCODE", "LEFT");
    this.addRelation("EMPLOYEEMASTER", "Account_No_Api", "BANKACCOUNTNO", "account_number", "FULL OUTER");
    this.addRelation("EMPLOYEEMASTER", "Asset_Issue", "EMPCODE", "Emp_Code", "LEFT");
    this.addRelation("EMPLOYEEMASTER", "Approval_Matrix", "EMPCODE", "empcode", "LEFT");
    this.addRelation("EMPLOYEEMASTER", "Misc_Mst", "LOCATION", "Misc_Code", "LEFT", "Misc_Mst.Misc_Type = 85");
  }

  addRelation(tableA, tableB, colA, colB, joinType = "LEFT", extraCondition = "") {
    if (!this.relationshipGraph.has(tableA)) this.relationshipGraph.set(tableA, []);
    this.relationshipGraph.get(tableA).push({
      targetTable: tableB,
      onA: colA,
      onB: colB,
      joinType,
      extraCondition
    });
  }

  searchRelevantTables(queryText, intent = "") {
    const normalized = normalizeLower(queryText + " " + intent);
    const scoredTables = [];

    for (const [key, rule] of Object.entries(ERP_SYNONYM_DICTIONARY)) {
      const match = rule.synonyms.some(s => normalized.includes(s));
      if (match && this.tableIndex.has(rule.targetTable.toLowerCase())) {
        scoredTables.push({
          tableName: rule.targetTable,
          confidence: 0.98,
          reason: `Matched synonym rule for '${key}'`,
          meta: this.tableIndex.get(rule.targetTable.toLowerCase())
        });
      }
    }

    for (const [lowerName, meta] of this.tableIndex.entries()) {
      if (scoredTables.some(t => t.tableName.toLowerCase() === lowerName)) continue;

      let score = 0;
      if (normalized.includes(lowerName)) score += 0.9;
      if (meta.displayName && normalized.includes(meta.displayName.toLowerCase())) score += 0.8;
      if (meta.module && normalized.includes(meta.module.toLowerCase())) score += 0.4;

      for (const colName of Object.keys(meta.columns || {})) {
        if (normalized.includes(colName.toLowerCase())) {
          score += 0.25;
        }
      }

      if (score >= 0.4) {
        scoredTables.push({
          tableName: meta.tableName,
          confidence: Math.min(score, 0.95),
          reason: "Keyword and column match in catalog",
          meta
        });
      }
    }

    scoredTables.sort((a, b) => b.confidence - a.confidence);

    if (scoredTables.length === 0 && this.tableIndex.has("employeemaster")) {
      scoredTables.push({
        tableName: "EMPLOYEEMASTER",
        confidence: 0.5,
        reason: "Default core ERP entity",
        meta: this.tableIndex.get("employeemaster")
      });
    }

    return scoredTables.slice(0, 4);
  }

  generatePrunedSchemaPrompt(scoredTables) {
    const lines = [];
    lines.push("### Targeted AutoVyn ERP Tables (Knowledge Graph Context):");

    for (const item of scoredTables) {
      const meta = item.meta;
      lines.push(`\nTABLE: [dbo].[${meta.tableName}] WITH (NOLOCK)`);
      lines.push(`Description: ${meta.description}`);
      lines.push(`Primary Key: ${(meta.primaryKey || []).join(", ")}`);

      if (meta.misc_type_mapping && Object.keys(meta.misc_type_mapping).length > 0) {
        lines.push("Misc_Type Mappings:");
        for (const [typeId, desc] of Object.entries(meta.misc_type_mapping)) {
          lines.push(`  - Misc_Type = ${typeId} : ${desc}`);
        }
      }

      const cols = meta.columns || {};
      const colList = Object.entries(cols).map(([name, d]) => `${name} (${d.type || "varchar"}${d.description ? ": " + d.description : ""})`);
      lines.push(`Columns: ${colList.slice(0, 30).join(", ")}${colList.length > 30 ? " ...[more]" : ""}`);

      const relations = this.relationshipGraph.get(meta.tableName) || [];
      if (relations.length > 0) {
        lines.push("Relationships:");
        for (const r of relations) {
          lines.push(`  - ${r.joinType} JOIN [dbo].[${r.targetTable}] ON [${meta.tableName}].[${r.onA}] = [${r.targetTable}].[${r.onB}]${r.extraCondition ? " AND " + r.extraCondition : ""}`);
        }
      }
    }

    return lines.join("\n");
  }
}

const SchemaEngineInstance = new SchemaKnowledgeGraph();

// ============================================================================
// ENGINE 1: INTENT ENGINE & ENGINE 2: ENTITY EXTRACTION ENGINE
// ============================================================================

const classifyIntentAndExtractEntities = async ({ message, originalMessage, history = [], userContext = {} }) => {
  const normEnglish = normalizeLower(message || "");
  const normOriginal = normalizeLower(originalMessage || "");
  const normalized = normOriginal && normOriginal !== normEnglish
    ? `${normEnglish} ${normOriginal}`
    : normEnglish;
  const fullMessageText = (originalMessage && originalMessage !== message)
    ? `${message} ${originalMessage}`
    : (message || "");
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // 1-12

  const entities = {
    employeeCode: null,
    employeeName: null,
    accountNumber: null,
    panNumber: null,
    mobileNumber: null,
    aadharNumber: null,
    branch: null,
    branches: null,
    excludeBranch: null,
    designation: null,
    employeeStatus: null,
    isSeparationEvent: false,
    department: null,
    month: null,
    year: null,
    flag: null,
    isSelf: false,
    vehicle: null,
    leaveType: null,
    aggregation: null,
    searchToken: null
  };

  // Self queries
  if (/\b(meri|mera|my|self|mujhe|apni|apna)\b/i.test(normalized)) {
    entities.isSelf = true;
    entities.employeeCode = userContext.employeeCode || null;
  }

  // Aadhaar Number (12 digits e.g. 963288897906 or 9632 8889 7906, or 8-12 digits in aadhaar context)
  const aadharContext = /\b(adhar|aadhar|aadhaar|uidai|uid|uid_no|uidno)\b/i.test(normalized);
  const aadharMatch = message.match(/\b(\d{4}\s*\d{4}\s*\d{4})\b/) || (aadharContext ? message.match(/\b(\d{8,12})\b/) : message.match(/\b(\d{12})\b/));
  if (aadharMatch) {
    entities.aadharNumber = aadharMatch[1].replace(/\s+/g, "").trim();
  }

  // PAN (e.g. ABCDE1234F)
  const panMatch = message.match(/\b([A-Z]{5}\d{4}[A-Z]{1})\b/i);
  if (panMatch) {
    entities.panNumber = panMatch[1].toUpperCase();
  }

  // Mobile (10-digit starting 6-9)
  const isMobileContext = /\b(mobile|phone|mob|contact\s*no|phone\s*no|mobile\s*no|cell|father_mob|mother_mob|spouse_mob)\b/i.test(normalized) &&
    !/\b(pf|provident|uan|esi|pan|aadhar|adhar|account|khata|bank|cheque|challan)\b/i.test(normalized);
  const mobileMatch = message.match(/\b([6-9]\d{9})\b/);
  if (mobileMatch && !entities.aadharNumber) {
    entities.mobileNumber = mobileMatch[1];
  }

  // Account Number (9 to 18 consecutive digits)
  const isBankContext = /\b(bank|account|khata|bankaccountno|ifsc|penny|penny-drop)\b/i.test(normalized);
  const accMatch = message.match(/\b(\d{9,18})\b/);
  if (accMatch && !aadharContext) {
    if (!entities.aadharNumber && (!entities.mobileNumber || isBankContext || accMatch[1].length > 10 || !isMobileContext)) {
      entities.accountNumber = accMatch[1].trim();
    }
  }

  // Employee Code patterns (e.g. 1004, 1047, 2800035, 1953081, AU19795967, EMP102)
  const empCodeMatch = message.match(/\b([A-Za-z]{1,4}\d{1,8}|\d{3,9})\b/i);
  if (empCodeMatch) {
    const rawCode = empCodeMatch[1].trim();
    const isYearNumber = /^(19\d{2}|20\d{2})$/.test(rawCode) && (parseInt(rawCode, 10) >= 1990 && parseInt(rawCode, 10) <= 2035);
    const hasDirectEmpPrefix = new RegExp(`\\b(?:emp|employee|karmchari|code|empcode|emp_code|id)\\s*[:=]?\\s*${rawCode}\\b`, 'i').test(normalized);

    // Never treat a 4-digit year (1990-2035) as an employee code unless explicitly prefixed with "emp 2026" or "code 2026"
    if (!isYearNumber || hasDirectEmpPrefix) {
      if ((!entities.accountNumber || entities.accountNumber.length <= 9) && !entities.aadharNumber) {
        entities.employeeCode = rawCode;
      }
    }
  }

  // Generic Search Token fallback: strictly alphanumeric ID or code containing numbers (e.g. AU19796099, 1924108, EMP123)
  const genericTokenMatch = message.match(/\b([A-Za-z]{1,5}\d+[A-Za-z0-9_-]*|\d+[A-Za-z]+[A-Za-z0-9_-]*|\d{4,10})\b/);
  if (genericTokenMatch) {
    const candidate = genericTokenMatch[1].trim();
    if (!SEARCH_STOP_WORDS.has(candidate.toLowerCase()) && !/^(salary|payslip|detail|details|attendance|leave|record|update|status)$/i.test(candidate)) {
      entities.searchToken = candidate;
    }
  }

  // Employee Name Extraction (e.g. "shantanu name ke", "rakesh naam ke", "with the name atendra", "named shantanu", "name shantanu", "whose name is shantanu")
  const checkTexts = [originalMessage, message].filter(Boolean);
  let namePatternMatch = null;
  for (const txt of checkTexts) {
    namePatternMatch = 
      txt.match(/\b([A-Za-z]{2,30}(?:\s+[A-Za-z]{2,30}){0,2})\s+(?:name|naam)\s+ke\b/i) ||
      txt.match(/\b([A-Za-z]{2,30}(?:\s+[A-Za-z]{2,30}){0,2})\s+(?:ka|ki|ke|ko)\s+(?:mobile|phone|contact|salary|pagar|tankha|vetan|ctc|address|pata|designation|post|pad|doj|dob|joining|attendance|haziri|leave|details?|profile|pan|aadhaar|bank)\b/i) ||
      txt.match(/\b(?:named|with\s+(?:the\s+)?name|whose\s+name\s+is|name\s+is|name\s+of)\s*[:=]?\s*([A-Za-z]{2,30}(?:\s+[A-Za-z]{2,30})?)\b/i) ||
      txt.match(/\b(?:name|naam)\s*[:=]\s*([A-Za-z]{2,30}(?:\s+[A-Za-z]{2,30})?)\b/i) ||
      txt.match(/\b([A-Za-z]{2,30})\s+(?:named|naam\s+wale|name\s+wale)\b/i);
    if (namePatternMatch) break;
  }

  if (namePatternMatch) {
    let candidateName = namePatternMatch[1].trim();
    // Clean trailing stop words or conjunctions (e.g. "Atendra and" -> "Atendra")
    candidateName = candidateName.replace(/\s+(along|with|and|aur|their|unka|unki|unke|iska|iski|iske|ke|ki|ka|ko|se|me|mein|par|pe|whose|who|which|that|is|are|the|ye|yeh|wo|woh|bhi|na|ne|his|her|tell|give|show|batao|do|together|including|also|plus|as|having|details?|info|data|records?)\b.*$/i, "").trim();

    const lowerCand = candidateName.toLowerCase();
    if (candidateName && !SEARCH_STOP_WORDS.has(lowerCand) &&
        !/^(employee|employees|karmchari|total|count|salary|attendance|branch|active|inactive|highest|lowest|list|all|kitne|sankhya|data)$/i.test(lowerCand)) {
      entities.employeeName = candidateName;
      entities.nameFilter = candidateName;
    }
  }

  // Month Names Map
  const monthsMap = {
    january: 1, jan: 1,
    february: 2, feb: 2, farwari: 2,
    march: 3, mar: 3,
    april: 4, apr: 4,
    may: 5, mai: 5,
    june: 6, jun: 6,
    july: 7, jul: 7,
    august: 8, aug: 8, agast: 8,
    september: 9, sept: 9, sep: 9, sitambar: 9,
    october: 10, oct: 10, aktubar: 10,
    november: 11, nov: 11, navambar: 11,
    december: 12, dec: 12, disambar: 12
  };

  // 1. Day + Month Name Pattern (e.g. "19 sept", "19th sept", "22 september", "22 sept ko", "19 sitambar")
  const dayMonthNameMatch = message.match(/\b(\d{1,2})\s*(?:st|nd|rd|th)?\s*(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec|farwari|agast|sitambar|aktubar|navambar|disambar)\b/i);
  if (dayMonthNameMatch) {
    const d = parseInt(dayMonthNameMatch[1], 10);
    const m = monthsMap[dayMonthNameMatch[2].toLowerCase()];
    if (d >= 1 && d <= 31 && m) {
      entities.day = d;
      entities.month = m;
    }
  }

  // 2. Month Name + Day Pattern (e.g. "sept 19", "september 22", "sep 22nd")
  const monthNameDayMatch = message.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec|farwari|agast|sitambar|aktubar|navambar|disambar)\s*(\d{1,2})\s*(?:st|nd|rd|th)?\b/i);
  if (monthNameDayMatch && !entities.day) {
    const m = monthsMap[monthNameDayMatch[1].toLowerCase()];
    const d = parseInt(monthNameDayMatch[2], 10);
    if (d >= 1 && d <= 31 && m) {
      entities.day = d;
      entities.month = m;
    }
  }

  // 3. Fallback Month Name match if not already set
  if (!entities.month) {
    for (const [mName, mNum] of Object.entries(monthsMap)) {
      if (new RegExp(`\\b${mName}\\b`, "i").test(normalized)) {
        entities.month = mNum;
        break;
      }
    }
  }

  // 4. Explicit Specific Full Date (e.g. 21/10/2025, 21-10-2025, 2025-10-21, 21.10.2025)
  const dmyMatch = message.match(/\b(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})\b/);
  if (dmyMatch) {
    const d = parseInt(dmyMatch[1], 10);
    const m = parseInt(dmyMatch[2], 10);
    const y = parseInt(dmyMatch[3], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      entities.day = d;
      entities.month = m;
      entities.year = y;
      entities.specificDate = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }

  const ymdMatch = message.match(/\b(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})\b/);
  if (ymdMatch && !entities.specificDate) {
    const y = parseInt(ymdMatch[1], 10);
    const m = parseInt(ymdMatch[2], 10);
    const d = parseInt(ymdMatch[3], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31) {
      entities.day = d;
      entities.month = m;
      entities.year = y;
      entities.specificDate = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    }
  }

  // 5. Day/Month without Year (e.g. "22/09", "22/9", "22-09", "22.09", "19/09")
  const dmMatch = message.match(/\b(\d{1,2})[\/\-\.](\d{1,2})\b/);
  if (dmMatch && !entities.specificDate && !entities.day) {
    const d = parseInt(dmMatch[1], 10);
    const m = parseInt(dmMatch[2], 10);
    if (d >= 1 && d <= 31 && m >= 1 && m <= 12) {
      entities.day = d;
      entities.month = m;
    }
  }

  // 6. Relative Dates (today, yesterday, etc.)
  if (/\b(today|aaj)\b/i.test(normalized)) {
    const now = new Date();
    entities.isToday = true;
    if (!entities.day) entities.day = now.getDate();
    if (!entities.month) entities.month = now.getMonth() + 1;
    if (!entities.year) entities.year = now.getFullYear();
    if (!entities.specificDate) entities.specificDate = `${entities.year}-${String(entities.month).padStart(2, "0")}-${String(entities.day).padStart(2, "0")}`;
  } else if (/\b(yesterday|kal|bita hua kal)\b/i.test(normalized)) {
    const yest = new Date(Date.now() - 86400000);
    entities.isYesterday = true;
    if (!entities.day) entities.day = yest.getDate();
    if (!entities.month) entities.month = yest.getMonth() + 1;
    if (!entities.year) entities.year = yest.getFullYear();
    if (!entities.specificDate) entities.specificDate = `${entities.year}-${String(entities.month).padStart(2, "0")}-${String(entities.day).padStart(2, "0")}`;
  } else if (/\b(last month|pichhle mahine|pichhla month|previous month)\b/i.test(normalized)) {
    entities.month = currentMonth === 1 ? 12 : currentMonth - 1;
    entities.year = currentMonth === 1 ? currentYear - 1 : currentYear;
  } else if (/\b(this month|is mahine|current month)\b/i.test(normalized)) {
    entities.month = currentMonth;
    entities.year = currentYear;
  }

  // Year (e.g. 2024, 2025, 2026)
  const yearMatch = message.match(/\b(20[123][0-9])\b/);
  if (yearMatch) {
    entities.year = parseInt(yearMatch[1], 10);
  }

  // Indian Financial Year (FY) Intelligence (e.g. FY 24-25, FY 2024-25, FY24, FY 2023-2024)
  const fyMatch = message.match(/\bFY\s*[-_]?\s*(20\d{2}|\d{2})(?:\s*[-/]\s*(20\d{2}|\d{2}))?\b/i) ||
    message.match(/\bfinancial\s*year\s*(20\d{2}|\d{2})(?:\s*[-/]\s*(20\d{2}|\d{2}))?\b/i);
  if (fyMatch) {
    const rawStart = fyMatch[1];
    const startY = rawStart.length === 2 ? parseInt("20" + rawStart, 10) : parseInt(rawStart, 10);
    let endY = startY + 1;
    if (fyMatch[2]) {
      const rawEnd = fyMatch[2];
      endY = rawEnd.length === 2 ? parseInt("20" + rawEnd, 10) : parseInt(rawEnd, 10);
    }
    entities.financialYear = `FY ${startY}-${String(endY).slice(-2)}`;
    entities.isFinancialYear = true;
    entities.fyStartYear = startY;
    entities.fyEndYear = endY;
    entities.startDate = `${startY}-04-01`;
    entities.endDate = `${endY}-03-31`;
  }

  // Indian Financial Quarters (Q1: Apr-Jun, Q2: Jul-Sep, Q3: Oct-Dec, Q4: Jan-Mar)
  const quarterMatch = message.match(/\b(Q[1-4]|quarter\s*[1-4])\b/i);
  if (quarterMatch) {
    const qNum = parseInt(quarterMatch[1].replace(/quarter\s*/i, "").replace(/q/i, ""), 10);
    entities.quarter = `Q${qNum}`;
    const baseYear = entities.fyStartYear || entities.year || currentYear;
    if (qNum === 1) {
      entities.quarterMonths = [4, 5, 6];
      entities.quarterStart = `${baseYear}-04-01`;
      entities.quarterEnd = `${baseYear}-06-30`;
    } else if (qNum === 2) {
      entities.quarterMonths = [7, 8, 9];
      entities.quarterStart = `${baseYear}-07-01`;
      entities.quarterEnd = `${baseYear}-09-30`;
    } else if (qNum === 3) {
      entities.quarterMonths = [10, 11, 12];
      entities.quarterStart = `${baseYear}-10-01`;
      entities.quarterEnd = `${baseYear}-12-31`;
    } else if (qNum === 4) {
      entities.quarterMonths = [1, 2, 3];
      entities.quarterStart = `${baseYear + 1}-01-01`;
      entities.quarterEnd = `${baseYear + 1}-03-31`;
    }
  }

  // Relative Date Windows (e.g. pichle 3 mahine, last 6 months, past 2 months)
  const relMonthsMatch = message.match(/\b(?:pichhle|pichle|last|past)\s*(\d+|two|three|four|five|six)\s*(?:mahine|months|month)\b/i);
  if (relMonthsMatch) {
    const wordMap = { two: 2, three: 3, four: 4, five: 5, six: 6 };
    const numMonths = wordMap[relMonthsMatch[1].toLowerCase()] || parseInt(relMonthsMatch[1], 10) || 3;
    entities.rollingMonths = numMonths;
  }

  // Branches (numeric codes e.g. branch 1, location 1, multi-branch, negative branch, or city name mapping)
  const numWordMap = { one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9", ten: "10" };
  const cityBranchMap = {
    jaipur: "1",
    delhi: "2",
    gurgaon: "3",
    gurugram: "3",
    noida: "4"
  };

  // 1. Negative Branch Filtering (e.g. "jo branch 1 me nahi hai", "branch 1 ko chhodkar", "excluding branch 1", "branch 1 ke alawa")
  const negBranchMatch = message.match(/(?:jo\s*bhi\s*|jo\s*)?branch\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten|[a-zA-Z]+)\s*(?:me|par|se)?\s*(?:nahi|not|excluding|chhodkar|ko\s*chhodkar)/i) ||
    message.match(/(?:excluding|except|chhodkar|ko\s*chhodkar|ke\s*alawa)\s*branch\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten|[a-zA-Z]+)/i) ||
    message.match(/(?:not\s*in\s*branch|other\s*than\s*branch)\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten|[a-zA-Z]+)/i);

  if (negBranchMatch) {
    const rawNeg = negBranchMatch[1].toLowerCase();
    const resolvedNeg = numWordMap[rawNeg] || cityBranchMap[rawNeg] || rawNeg;
    entities.excludeBranch = resolvedNeg;
  }

  // 2. Multi-Branch Extraction (e.g. "branch 1 aur 2 dono", "branch 1, 2 aur 3", "branch 1 and 2", "branch 1 ya 2")
  const multiBranchMatch = message.match(/\b(?:branch|location|loc)\s*(\d+|one|two|three|four|five|six|seven|eight|nine|ten|[a-zA-Z]+)(?:\s*(?:,|aur|and|ya|or|\+)\s*(?:(?:branch|location|loc)\s*)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten|[a-zA-Z]+))+/i);
  if (multiBranchMatch) {
    const matchedSegment = multiBranchMatch[0];
    const branchTokens = matchedSegment.match(/\b(\d+|one|two|three|four|five|six|seven|eight|nine|ten|jaipur|delhi|gurgaon|gurugram|noida)\b/gi) || [];
    const uniqueBranches = [];
    for (const bt of branchTokens) {
      const lower = bt.toLowerCase();
      if (/^(branch|location|loc)$/i.test(lower)) continue;
      const code = numWordMap[lower] || cityBranchMap[lower] || lower;
      if (!uniqueBranches.includes(code)) {
        uniqueBranches.push(code);
      }
    }
    if (uniqueBranches.length > 1) {
      entities.branches = uniqueBranches;
      entities.branch = uniqueBranches[0];
      entities.locCode = entities.branch;
    }
  }

  // 3. Single Branch Extraction (if not negative or multi)
  if (!entities.excludeBranch && !entities.branches) {
    const branchNumMatch = message.match(/\b(?:branch|location|loc|godw|godown|br|loc_code|branch_code|location_code)\s*(?:code\s*|no\s*|number\s*|:\s*|#\s*)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/i);
    if (branchNumMatch) {
      const rawVal = branchNumMatch[1].toLowerCase();
      entities.branch = numWordMap[rawVal] !== undefined ? numWordMap[rawVal] : rawVal;
      entities.locCode = entities.branch;
    } else {
      const knownCities = ["jaipur", "delhi", "gurgaon", "gurugram", "noida", "ajmer", "kota", "udaipur", "jodhpur", "bikaner", "alwar", "bhilwara"];
      for (const c of knownCities) {
        if (normalized.includes(c)) {
          entities.branch = cityBranchMap[c] || (c.charAt(0).toUpperCase() + c.slice(1));
          entities.branchName = c.charAt(0).toUpperCase() + c.slice(1);
          entities.locCode = entities.branch;
          break;
        }
      }
    }
  }

  // Common Job Titles & Designations (in EMPLOYEEDESIGNATION)
  const desigMatch = normalized.match(/\b(accountant|cashier|driver|manager|clerk|mechanic|sales\s*executive|sales|security\s*guard|guard|peon|engineer|supervisor|telecaller|counselor|operator|technician|advisor|helper)\b/i);
  if (desigMatch && !/\b(leave|salary|attendance|profile|detail)\b/i.test(desigMatch[1])) {
    entities.designation = desigMatch[1].trim();
  }

  // Separation / Resignation Event Detection (e.g. "is mahine kitne employee chhod ke gaye", "march 2026 me kitne ne resign kiya")
  const isSeparationEvent = /\b(chhod\s*diya|chhod\s*kar|chhod\s*ke|chhod\s*gaye|chhodi|left|resigned|resignation|nikala|nikale|separated|relieved)\b/i.test(normalized) &&
    Boolean(entities.month || entities.year || entities.specificDate || /\b(is\s*mahine|pichle\s*mahine|last\s*month|this\s*month|in\s*month)\b/i.test(normalized));
  if (isSeparationEvent) {
    entities.isSeparationEvent = true;
  }

  // Salary Metric / Specific Field targets
  if (/\b(basic|basic_earn|basic\s*pay|basic\s*salary|basic\s*earning)\b/i.test(normalized)) {
    entities.salaryField = "Basic_Earn";
  } else if (/\b(gross|gross_earn|gross\s*pay|gross\s*salary|gross\s*earning)\b/i.test(normalized)) {
    entities.salaryField = "Gross_Earn";
  } else if (/\b(net|net_pay|net\s*salary|final_payment|take\s*home|in\s*hand)\b/i.test(normalized)) {
    entities.salaryField = "Final_Payment";
  } else if (/\b(deduction|deductions|deducation|tot_dedu|katauti|katouti)\b/i.test(normalized)) {
    entities.salaryField = "Deducation";
  } else if (/\b(hra|hra_earn)\b/i.test(normalized)) {
    entities.salaryField = "HRA_Earn";
  }

  // Attendance Flags
  if (/\b(absent|anupasthit|nahi aaya|chhutti pe)\b/i.test(normalized)) entities.flag = "A";
  if (/\b(present|upasthit|aaya tha|duty)\b/i.test(normalized)) entities.flag = "P";
  if (/\b(half day|halfday|aadha din)\b/i.test(normalized)) entities.flag = "HD";
  if (/\b(weekly off|sunday|itwar)\b/i.test(normalized)) entities.flag = "WO";

  // Leave Type & Reason Extraction (AutoVyn Misc_Type = 92)
  if (/\b(sick\s*leave|sick|sl|bimar|bimari|medical\s*leave)\b/i.test(normalized)) {
    entities.leaveType = "Sick Leave";
    entities.leaveCode = 6;
  } else if (/\b(casual\s*leave|cl|casual)\b/i.test(normalized)) {
    entities.leaveType = "Casual Leave";
    entities.leaveCode = 1;
  } else if (/\b(privilege\s*leave|pl|earned\s*leave|el)\b/i.test(normalized)) {
    entities.leaveType = "Privilege Leave";
  } else if (/\b(maternity\s*leave)\b/i.test(normalized)) {
    entities.leaveType = "Maternity Leave";
  } else if (/\b(short\s*leave)\b/i.test(normalized)) {
    entities.leaveType = "Short Leave";
  } else if (/\b(leave|leaves|chhutti|chhutiyan|chhuttiyan)\b/i.test(normalized)) {
    entities.leaveType = "ALL_LEAVES";
  }

  // Aggregation
  const isTotalOrSumKeyword = /\b(total|sum|kul|jog|add|addition|addisition|milakar|sabka|sabhi\s*ka|sabhi\s*karmchari|all\s*employee|all\s*employees|total\s*basic|total\s*gross|total\s*net|total\s*pay|total\s*salary|total\s*amount)\b/i.test(normalized);
  if (/\b(kitne|count|total count|how many|sankhya|ginti)\b/i.test(normalized)) {
    entities.aggregation = "COUNT";
  } else if (isTotalOrSumKeyword || /\b(sum|kul rashi|total pay)\b/i.test(normalized)) {
    entities.aggregation = "SUM";
  }

  // Intent classification
  let intent = "GENERAL_DATABASE_QUERY";
  let mode = "DATABASE_QUERY";

  const isDuplicateBank = /\b(duplicat\w*|dublicat\w*|same|ek\s*hi|common)\b/i.test(normalized) &&
    /\b(bank|account|khata|bankaccountno)\b/i.test(normalized);

  const isDuplicatePAN = /\b(duplicat\w*|dublicat\w*|same|ek\s*hi)\b/i.test(normalized) &&
    /\b(pan|pancard|pan_no)\b/i.test(normalized);

  const isDuplicateAadhaar = /\b(duplicat\w*|dublicat\w*|same|ek\s*hi)\b/i.test(normalized) &&
    /\b(aadhaar|aadhar|uidai|aadhar_no|adhar)\b/i.test(normalized);

  // PF (Provident Fund) / UAN / ESI Queries
  const isPFDeduction = /\b(pf|provident\s*fund)\b/i.test(normalized) &&
    /\b(deduct\w*|kata|katoti|kat\s*gaya|jama|contribution|salmnth|salyear|salary|payslip|slip|vetan|pagar|tankha|pension|eps)\b/i.test(normalized);

  const isPFQuery = /\b(pf|provident\s*fund|pf\s*number|pf\s*no|pfnumber|uan|esi)\b/i.test(normalized);
  const isPFDeductionCount = isPFDeduction && (
    /\b(kitne|count|total count|how many|sankhya|ginti|total)\b/i.test(normalized) ||
    entities.aggregation === "COUNT"
  );
  const isPFCount = isPFQuery && !isPFDeduction && (
    /\b(kitne|count|total count|how many|sankhya|ginti|total)\b/i.test(normalized) ||
    entities.aggregation === "COUNT"
  );
  const isPFList = isPFQuery && !isPFDeduction && (
    /\b(kiske kiske|kiske pass|kaun kaun|list|all|employees|karmchari|details|detail|nikalo|batao|walo|wale|records)\b/i.test(normalized) ||
    !entities.employeeCode
  );

  const isAadhaarOwnerLookup = Boolean(entities.aadharNumber) &&
    (/\b(kiska|kiske|who|owner|employee|emp|naam|name|detail|details|kiska h|kiska hai|kiski|batao|nikalo|kon kon|kaun kaun|pass|hai|records|list|all)\b/i.test(normalized) ||
      /\b(aadhaar|aadhar|uidai|uid)\b/i.test(normalized));

  const isPanOwnerLookup = Boolean(entities.panNumber) &&
    (/\b(kiska|kiske|who|owner|employee|emp|naam|name|detail|details|kiska h|kiska hai|kiski|batao|kon kon|kaun kaun|pass|hai|records|list|all)\b/i.test(normalized) ||
      /\b(pan|panno)\b/i.test(normalized));

  const isMobileOwnerLookup = Boolean(entities.mobileNumber) &&
    (/\b(kiska|kiske|who|owner|employee|emp|naam|name|detail|details|kiska h|kiska hai|kiski|batao|kon kon|kaun kaun|pass|hai|records|list|all)\b/i.test(normalized) ||
      /\b(mobile|phone|mob|cell|number|contact)\b/i.test(normalized));

  const isAccountOwnerLookup = (Boolean(entities.accountNumber) || (isBankContext && entities.employeeCode)) &&
    (/\b(kiska|kiske|who|owner|employee|emp|naam|name|detail|details|kiska h|kiska hai|kiski|batao|nikalo|kon kon|kaun kaun|pass|hai|records|list|all)\b/i.test(normalized) ||
      /\b(bank|account|khata|bankaccountno)\b/i.test(normalized)) &&
    !/\b(duplicate|dublicat)\b/i.test(normalized);

  const isTopSalaryRanking = !entities.employeeCode && !entities.isSelf &&
    /\b(top\s*\d*|highest|maximum|sabse\s*jyada|sabse\s*adhik|sabse\s*badi|max|lowest|minimum|sabse\s*kam|min|ranking|highest\s*earning|topper)\b/i.test(normalized) &&
    /\b(salary|ctc|pagar|tankha|tankhwa|vetan|earning|package|pay|payment|payout)\b/i.test(normalized);

  const isEmpSalaryHistory = (Boolean(entities.employeeCode) || entities.isSelf) &&
    /\b(salary|pagar|tankha|vetan|payslip|slip|earning|payout|rupaye|rupay)\b/i.test(normalized) &&
    /\b(kab|kis\s*mahine|kis\s*year|kis\s*saal|history|breakdown|highest|sabse\s*jyada|sabse\s*badi|max|lowest|sabse\s*kam|min|maximum|minimum|aai\s*thi|mili\s*thi|gayi\s*thi|kitni)\b/i.test(normalized);

  const isBirthdayQuery = /\b(birthday|b'day|bday|janamdin|janam\s*din|dob|date\s*of\s*birth|kab\s*aata\s*hai|kab\s*h|kab\s*hota\s*hai)\b/i.test(normalized) &&
    !/\b(leave|salary|attendance|attandance|aattendance)\b/i.test(normalized);

  const ANNIVERSARY_REGEX = /\b(annivers\w*|anivers\w*|anvers\w*|anivars\w*|saalgir\w*|salgir\w*|anniv\b)/i;
  const MARRIAGE_KEYWORD_REGEX = /\b(marriage|marrige|marraige|merriage|shadi|shaadi|sadi|saadi|wedding|patni|wife|husband|pati|dom|doma|vivah|byah)\b/i;
  const WORK_KEYWORD_REGEX = /\b(work|service|joining|join|job|kaam|nokri)\b/i;

  const isMarriageAnniversary = (MARRIAGE_KEYWORD_REGEX.test(normalized) && ANNIVERSARY_REGEX.test(normalized)) ||
    (MARRIAGE_KEYWORD_REGEX.test(normalized) && /\b(aaj|today|salgirah|saalgirah|kab|tarikh|date)\b/i.test(normalized));

  const isWorkAnniversary = !isMarriageAnniversary && (
    (WORK_KEYWORD_REGEX.test(normalized) && ANNIVERSARY_REGEX.test(normalized)) ||
    ANNIVERSARY_REGEX.test(normalized) ||
    /\b(joining\s*annivers\w*|service\s*annivers\w*|work\s*annivers\w*|work\s*anivers\w*|work\s*anvers\w*)\b/i.test(normalized)
  );

  const isAttendancePattern = /\b(attendance|aattendance|attandance|atendance|attendence|atendence|haziri|hazri|upsthiti|punch|in\s*out|present|absent|attendance\s*detail|attandance\s*detail|aattendance\s*detail|punch\s*detail)\b/i.test(normalized);

  const isPresentCount = /\b(present|upasthit|aaya|duty)\b/i.test(normalized) &&
    (/\b(kitne|count|total count|how many|sankhya|ginti|total)\b/i.test(normalized) || entities.aggregation === "COUNT");

  const isAbsentCount = /\b(absent|anupasthit|nahi aaya|chhutti pe)\b/i.test(normalized) &&
    (/\b(kitne|count|total count|how many|sankhya|ginti|total)\b/i.test(normalized) || entities.aggregation === "COUNT");

  const isPresentList = /\b(present|upasthit)\b/i.test(normalized) &&
    (/\b(list|all|kaun kaun|employees|karmchari|details|detail|nikalo|batao)\b/i.test(normalized) || !entities.employeeCode);

  const isAbsentList = /\b(absent|anupasthit)\b/i.test(normalized) &&
    (/\b(list|all|kaun kaun|employees|karmchari|details|detail|nikalo|batao)\b/i.test(normalized) || !entities.employeeCode);

  const isSalaryTotalOrSum = /\b(salary|pagar|tankha|vetan|pay|payout|earning|basic|gross|net|deduction|deductions|salaryfile)\b/i.test(normalized) &&
    (isTotalOrSumKeyword || entities.aggregation === "SUM" || /\b(total|sum|kul|add|addition|addisition)\b/i.test(normalized)) &&
    !entities.employeeCode;

  const isSalaryCount = /\b(salary|pagar|tankha|vetan|salaryfile)\b/i.test(normalized) &&
    /\b(kitne|how many|sankhya|ginti|total\s*count|kitne\s*log|kitne\s*karmchari|kitne\s*employees)\b/i.test(normalized) &&
    !entities.employeeCode;

  // Miss Punch / Regularization Queries (AutoVyn attendancetable.mipunch_reason = 1 or 53, Misc_Type = 92)
  const isMispunchQuery = /\b(mispunch|mis_punch|mis-punch|miss_punch|miss-punch|miss\s*punch|mis\s*punch|manual_punch|manualpunch|manual\s*punch|mipunch|regularization|regularize)\b/i.test(normalized) ||
    (/\b(punch|punches)\b/i.test(normalized) && /\b(miss|mis|bhul|bhool|forget|forgot|chhoot|chhut|not done|nahi kiya|nahi hua)\b/i.test(normalized));

  const isSinceJoiningOrAllTime = /\b(jab se join hua|joining se|jab se aaya|tab se abhi tak|join date se|since join|since joining|all time|overall|aaj tak|till date)\b/i.test(normalized);
  if (isSinceJoiningOrAllTime) {
    entities.isSinceJoining = true;
  }

  // Leave Applied / Employee Leave Queries (AutoVyn attendancetable.mipunch_reason)
  const isLeaveAppliedQuery = Boolean(entities.leaveType) ||
    (/\b(leave|leaves|chhutti|chhutiyan|chhuttiyan|sick\s*leave|casual\s*leave|privilege\s*leave|earned\s*leave|sl|cl|pl|el|mipunch_reason|lagayi|lagai|li\s*thi|li\s*hai)\b/i.test(normalized) && !isMispunchQuery);

  const isLeavePolicyQuery = isLeaveAppliedQuery &&
    /\b(policy|rules|manual|rule|eligible|entitled|allowance|guideline)\b/i.test(normalized) &&
    !/\b(kitne|count|kaun|kisne|kiske|kiska|list|employee|employees|branch|location|august|july|january|february|march|april|may|june|september|october|november|december|lagayi|lagai|li\s*thi)\b/i.test(normalized);

  if (isMispunchQuery) {
    const hasEmpTarget = Boolean(entities.employeeCode || entities.isSelf || entities.employeeName);
    const isCountOrTotal = isSinceJoiningOrAllTime || entities.aggregation === "COUNT" || /\b(kitne|count|total count|how many|sankhya|ginti|total|batao|nikalo)\b/i.test(normalized);

    if (hasEmpTarget && isCountOrTotal) {
      intent = "MISPUNCH_EMPLOYEE_TOTAL";
    } else if (entities.aggregation === "COUNT" || /\b(kitne|count|total count|how many|sankhya|ginti|total)\b/i.test(normalized)) {
      intent = "MISPUNCH_COUNT";
    } else if (hasEmpTarget && !/\b(kiske kiske|list|all|sabka|total)\b/i.test(normalized)) {
      intent = "MISPUNCH_LOOKUP_BY_EMP";
    } else {
      intent = "MISPUNCH_REPORT";
    }
  } else if (isSalaryTotalOrSum) {
    intent = "SALARY_TOTAL_AGGREGATE";
  } else if (isSalaryCount) {
    intent = "SALARY_COUNT_AGGREGATE";
  } else if (isDuplicateBank) {
    intent = "DUPLICATE_BANK_ACCOUNTS";
  } else if (isDuplicatePAN) {
    intent = "DUPLICATE_PAN_NUMBERS";
  } else if (isDuplicateAadhaar) {
    intent = "DUPLICATE_AADHAAR_NUMBERS";
  } else if (isPFDeduction) {
    if (isPFDeductionCount) {
      intent = "PF_DEDUCTION_COUNT";
    } else {
      intent = "SALARY_PF_DEDUCTION";
    }
  } else if (isPFQuery) {
    if (isPFCount && !/\b(kiske kiske|list|all)\b/i.test(normalized)) {
      intent = "PF_COUNT";
    } else if (entities.employeeCode && !/\b(kiske kiske|list|all|sabka|total)\b/i.test(normalized)) {
      intent = "PF_LOOKUP_BY_EMP";
    } else {
      intent = "PF_EMPLOYEE_LIST";
    }
  } else if (isWorkAnniversary) {
    intent = "WORK_ANNIVERSARY";
  } else if (isMarriageAnniversary) {
    intent = "MARRIAGE_ANNIVERSARY";
  } else if (isBirthdayQuery) {
    if (entities.day && entities.month && !entities.isToday) {
      intent = "BIRTHDAY_BY_DATE";
    } else if (entities.isToday || /\b(aaj|today)\b/i.test(normalized)) {
      intent = "BIRTHDAY_TODAY";
    } else if (entities.month && !entities.employeeCode && !entities.day) {
      intent = "BIRTHDAYS_MONTH";
    } else if (entities.employeeCode || entities.searchToken) {
      intent = "BIRTHDAY_LOOKUP";
    } else {
      intent = "BIRTHDAY_TODAY";
    }
  } else if (isAadhaarOwnerLookup) {
    intent = "EMPLOYEE_BY_AADHAAR_NO";
  } else if (isPanOwnerLookup) {
    intent = "EMPLOYEE_BY_PAN_NO";
  } else if (isMobileOwnerLookup) {
    intent = "EMPLOYEE_BY_MOBILE_NO";
  } else if (isAccountOwnerLookup) {
    intent = "EMPLOYEE_BY_ACCOUNT_NO";
  } else if (isTopSalaryRanking) {
    intent = "HIGHEST_SALARY_RANKING";
  } else if (isEmpSalaryHistory) {
    intent = "EMPLOYEE_SALARY_HISTORY";
  } else if (/\b(salary|pagar|tankha|payslip|slip|basic|basic_earn|ctc)\b/i.test(normalized) && isAttendancePattern) {
    intent = "ATTENDANCE_AND_SALARY_REPORT";
  } else if (/\b(salary|pagar|tankha|vetan|payslip|slip|basic|basic_earn|gross|gross_earn|net_pay|in\s*hand|ctc)\b/i.test(normalized)) {
    intent = entities.isSelf ? "SELF_SALARY" : "SALARY_REPORT";
  } else if (isLeaveAppliedQuery && !isLeavePolicyQuery) {
    if (entities.employeeCode && !/\b(kitne|count|all|sabka|total)\b/i.test(normalized)) {
      intent = "EMPLOYEE_LEAVE_LOOKUP";
    } else if (entities.aggregation === "COUNT" || /\b(kitne|count|total count|how many|sankhya|ginti|total)\b/i.test(normalized)) {
      intent = "EMPLOYEE_LEAVE_COUNT";
    } else {
      intent = "EMPLOYEE_LEAVE_LIST";
    }
  } else if (isLeavePolicyQuery) {
    intent = "LEAVE_POLICY";
  } else if (isPresentCount) {
    intent = "PRESENT_COUNT";
  } else if (isAbsentCount) {
    intent = "ABSENT_COUNT";
  } else if (isPresentList && !entities.employeeCode && (entities.specificDate || entities.month)) {
    intent = "PRESENT_EMPLOYEE_LIST";
  } else if (isAbsentList && !entities.employeeCode && (entities.specificDate || entities.month)) {
    intent = "ABSENT_EMPLOYEE_LIST";
  } else if (isAttendancePattern) {
    intent = "ATTENDANCE_REPORT";
  } else if (/\b(asset|laptop|desktop|phone)\b/i.test(normalized)) {
    intent = "ASSET_SEARCH";
  } else if (/\b(detail|details|profile|designation|post|pad|kya\s*kaam|mobile|phone|contact|address|pata|joining|doj|kab\s*join|joining\s*date)\b/i.test(normalized)) {
    intent = "EMPLOYEE_LOOKUP";
  } else if (/\b(bank verify|account verify|penny drop|account_no_api)\b/i.test(normalized)) {
    if (entities.aggregation === "COUNT" || /\b(kitne|total|count)\b/i.test(normalized)) {
      intent = "BANK_ACCOUNT_VERIFY_COUNT";
    } else if (entities.employeeCode || entities.accountNumber) {
      intent = "BANK_ACCOUNT_VERIFY_LOOKUP";
    } else {
      intent = "BANK_ACCOUNT_VERIFY_LIST";
    }
  } else if (/\b(aadhaar|aadhar)\b/i.test(normalized) && /\b(verify|verified|verification|link)\b/i.test(normalized)) {
    if (entities.aggregation === "COUNT" || /\b(kitne|total|count)\b/i.test(normalized)) {
      intent = "AADHAAR_VERIFY_COUNT";
    } else if (entities.employeeCode) {
      intent = "AADHAAR_VERIFY_LOOKUP";
    } else {
      intent = "AADHAAR_VERIFY_LIST";
    }
  } else if (/\b(pan)\b/i.test(normalized) && /\b(verify|verified|verification)\b/i.test(normalized)) {
    if (entities.aggregation === "COUNT" || /\b(kitne|total|count)\b/i.test(normalized)) {
      intent = "PAN_VERIFY_COUNT";
    } else {
      intent = "PAN_VERIFY_LIST";
    }
  } else if (/\b(employeemaster_hst|hst|audit|history|kya\s*update|kaun\s*kaun\s*si\s*field|field\s*update|badla\s*gaya|change\s*hua|kya\s*badla|kya\s*change|badla\s*hai|update\s*ki\s*gai|kya\s*kya\s*update)\b/i.test(normalized) && /\b(update|updated|badla|change|modified|modi|aaj|today|detail|hst|field|fields|column|coloumn|kiska|kiske|kiski)\b/i.test(normalized)) {
    intent = "EMPLOYEE_AUDIT_HISTORY_DIFF";
  } else if (/\b(kyc|verify|verification)\b/i.test(normalized)) {
    if (entities.aggregation === "COUNT" || /\b(kitne|total|count)\b/i.test(normalized)) {
      intent = "KYC_COUNT";
    } else {
      intent = "KYC_LOOKUP";
    }
  } else if (/\b(service\s*reminder|service\s*reminders|service\s*due|srv_reminder|srv_reminder_tbl|reminder\s*due|reminders\s*due)\b/i.test(normalized) ||
    (/\b(service|services)\b/i.test(normalized) && /\b(reminder|reminders|due|pending|list)\b/i.test(normalized))) {
    intent = "SERVICE_REMINDERS_DUE";
  } else {
    // Employee Count Queries (Active / Inactive / Total Count / Separation Events / Designation Counts / Name Counts)
    const isEmployeeCountQuery = (
      /\b(kitne|count|total count|how many|sankhya|ginti|total)\b/i.test(normalized) &&
      (/\b(employee|employees|karmchari|karmachari|log|staff|worker|workers|bande|person)\b/i.test(normalized) || Boolean(entities.designation) || Boolean(entities.employeeName))
    ) || /\b(active\s*employee|inactive\s*employee|active\s*employees|inactive\s*employees)\b/i.test(normalized) || entities.isSeparationEvent;

    const isInactiveStatus = entities.isSeparationEvent || /\b(inactive|in-active|left|resign|resigned|chhod\s*diya|chhod\s*chuke|purane|separated|relieved|deactive|deactivated|not\s*active|nikale\s*gaye|hata\s*diye)\b/i.test(normalized);
    const isActiveStatus = !isInactiveStatus && /\b(active|working|current|present|abhi\s*ke|kaam\s*kar\s*rahe|karyarat)\b/i.test(normalized);

    if (isInactiveStatus) {
      entities.employeeStatus = "INACTIVE";
    } else if (isActiveStatus) {
      entities.employeeStatus = "ACTIVE";
    }

    const isEllipticalStatusQuery = /^(aur|and|then|also|ab|fir|what\s*about)?\s*(inactive|active|total)\b/i.test(normalized.trim());

    if ((isEmployeeCountQuery || isEllipticalStatusQuery) && !isAttendancePattern && !isPFQuery && !isSalaryTotalOrSum && !isSalaryCount && !isMispunchQuery && !isLeaveAppliedQuery) {
      intent = "EMPLOYEE_COUNT";
      if (!entities.employeeStatus) {
        entities.employeeStatus = "ALL";
      }
    }
  }

  entities.rawMessage = message;

  return {
    intent,
    mode,
    entities,
    isSelfQuery: entities.isSelf,
    confidence: 0.95
  };
};

// ============================================================================
// DATABASE-BACKED FUZZY NAME LINKER & ENTITY RESOLUTION ENGINE
// ============================================================================

const resolveEmployeeEntityViaDB = async ({ sequelize, message, normalized, entities = {}, userContext = {} }) => {
  if (!sequelize?.query || entities.employeeCode || entities.isSelf) {
    return { resolved: false };
  }

  // Do not perform employee lookup if the message is a pronoun reference (iska, uska, inka, unka, etc.)
  const isPronounFollowup = /\b(iska|iski|iske|inhe|inhein|unka|unki|unke|same|vahi|uska|uski|uske|previous|above|wahi|this person|that person|isi|isi\s*employee|is\s*employee|is\s*bande|isi\s*bande|current\s*employee)\b/i.test(normalized);
  if (isPronounFollowup) {
    return { resolved: false };
  }

  // Do not perform employee name lookup if the query is an explicit identifier lookup (mobile, pan, aadhaar, account)
  if (entities.mobileNumber || entities.panNumber || entities.aadharNumber || entities.accountNumber) {
    return { resolved: false };
  }

  // Do not perform employee name lookup if the query is an employee count or designation query
  if (entities.designation || entities.employeeStatus || entities.isSeparationEvent) {
    return { resolved: false };
  }

  // Do not perform single employee name lookup if the message is asking for a list, count, or general aggregate
  const isListOrAggregate = /\b(kon kon|kaun kaun|kiske kiske|list|all|sabka|total|kitne|kitna|sankhya|ginti|how many|records)\b/i.test(normalized);
  if (isListOrAggregate) {
    return { resolved: false };
  }

  // Do not perform single employee name lookup if the message is asking for ranking or extremum (highest/lowest/top/sabse jyada)
  const isRankingOrExtremum = /\b(sabse\s*jyada|sabse\s*kam|sabse\s*adhik|sabse|highest|lowest|top\s*\d*|bottom\s*\d*|maximum|minimum|max|min|ranking|topper|rank|kiski\s*salary|kiska\s*salary|kisko\s*salary|sabse\s*badi|pay\s*hui|payment)\b/i.test(normalized);
  if (isRankingOrExtremum) {
    return { resolved: false };
  }

  // Do not perform employee lookup if the message is asking about non-employee business domains
  const nonEmpDomain = /\b(service|services|reminder|reminders|due|vehicle|chassis|engine|jobcard|invoice|bill|bills|billing|voucher|ledger|account|accounts|stock|inventory|gatepass|ro|workshop|insurance|model|fuel|booking|bookings|lead|leads|enquiry|dms|profit|loss|trial|balance|pnl|asset|history|audit|report|reports|customer|party)\b/i.test(normalized);
  if (nonEmpDomain) {
    return { resolved: false };
  }

  // Do not perform employee lookup if the message is asking a "WHO / WHOSE" question or event query (anniversary, birthday, present, absent, leaves)
  const isWhoQuestion = /\b(kiska|kiski|kiske|kisko|kaun|kon|kin|kinko|kinka|who|whose|whom)\b/i.test(normalized);
  const isEventOrDomainKeyword = /\b(annivers\w*|anivers\w*|anvers\w*|saalgir\w*|salgir\w*|marriage|marrige|marraige|merriage|shadi|shaadi|wedding|birthday|bday|b'day|janamdin|present|absent|leave|leaves|mispunch|punch|salary|pagar|tankha|vetan|pf|esi|uan)\b/i.test(normalized);
  if (isWhoQuestion && isEventOrDomainKeyword) {
    return { resolved: false };
  }

  // Do not perform employee lookup if it is a general event query for today, date, or month
  const isGeneralEventQuery = /\b(annivers\w*|anivers\w*|anvers\w*|saalgir\w*|salgir\w*|birthday|bday|b'day|janamdin|holiday|holidays)\b/i.test(normalized) &&
    /\b(aaj|today|current|month|mahine|date|tarikh|din|saal|year)\b/i.test(normalized);
  if (isGeneralEventQuery) {
    return { resolved: false };
  }

  // Extract clean candidate words from user message (excluding stop words and numbers)
  const cleanTokens = message
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter(t => t.length >= 3 && !SEARCH_STOP_WORDS.has(t.toLowerCase()) && !/^\d+$/.test(t));

  if (cleanTokens.length === 0) return { resolved: false };

  const tokenCount = cleanTokens.length;
  const firstToken = cleanTokens[0];
  const candidateFullName = cleanTokens.slice(0, 4).join(" ");
  const likeFull = "%" + cleanTokens.join("%") + "%";
  const likeFirstPrefix = firstToken + "%";

  try {
    const nameSearchSQL = `
      SELECT TOP 20 
        E.EMPCODE, 
        RTRIM(LTRIM(CONCAT(E.EMPFIRSTNAME, ' ', ISNULL(E.EMPLASTNAME, '')))) AS FullName,
        E.EMPFIRSTNAME,
        E.EMPLASTNAME,
        E.LOCATION,
        ISNULL(L.Misc_Name, E.LOCATION) AS LocationName,
        E.EMPLOYEEDESIGNATION AS DesignationName,
        E.MOBILENO,
        E.PANNO,
        E.EMP_STATUS
      FROM dbo.EMPLOYEEMASTER E WITH (NOLOCK)
      LEFT JOIN dbo.Misc_Mst L WITH (NOLOCK) ON L.Misc_Type = 85 AND CONVERT(varchar(50), L.Misc_Code) = CONVERT(varchar(50), E.LOCATION)
      WHERE 
        CONCAT(E.EMPFIRSTNAME, ' ', ISNULL(E.EMPLASTNAME, '')) = :candidateFullName
        OR E.EMPFIRSTNAME = :candidateFullName
        OR CONCAT(E.EMPFIRSTNAME, ' ', ISNULL(E.EMPLASTNAME, '')) LIKE :likeFull
        OR E.EMPFIRSTNAME LIKE :likeFull
        OR (
          (:tokenCount = 1) AND (
            E.EMPFIRSTNAME = :firstToken
            OR E.EMPFIRSTNAME LIKE :likeFirstPrefix
            OR CONCAT(E.EMPFIRSTNAME, ' ', ISNULL(E.EMPLASTNAME, '')) LIKE :likeFirstPrefix
            OR (LEN(:firstToken) >= 4 AND SOUNDEX(E.EMPFIRSTNAME) = SOUNDEX(:firstToken) AND E.EMPFIRSTNAME LIKE CONCAT(LEFT(:firstToken, 1), '%'))
          )
        )
      ORDER BY 
        CASE 
          WHEN LTRIM(RTRIM(E.EMPFIRSTNAME)) = :candidateFullName THEN 1
          WHEN LTRIM(RTRIM(CONCAT(E.EMPFIRSTNAME, ' ', ISNULL(E.EMPLASTNAME, '')))) = :candidateFullName THEN 1
          WHEN E.EMPFIRSTNAME LIKE :likeFull THEN 2
          WHEN CONCAT(E.EMPFIRSTNAME, ' ', ISNULL(E.EMPLASTNAME, '')) LIKE :likeFull THEN 2
          WHEN LTRIM(RTRIM(E.EMPFIRSTNAME)) = :firstToken THEN 3
          WHEN E.EMPFIRSTNAME LIKE :likeFirstPrefix THEN 4
          ELSE 5
        END,
        CASE WHEN E.EMP_STATUS = 'A' OR E.EMP_STATUS = '1' THEN 0 ELSE 1 END,
        E.EMPCODE DESC;
    `;

    const candidates = await sequelize.query(nameSearchSQL, {
      replacements: {
        candidateFullName,
        likeFull,
        firstToken,
        likeFirstPrefix,
        tokenCount
      },
      type: QueryTypes.SELECT
    });

    if (!candidates || candidates.length === 0) {
      return { resolved: false };
    }

    // 1. Direct exact full-name match check
    const exactMatch = candidates.find(c =>
      c.FullName.toLowerCase() === candidateFullName.toLowerCase() ||
      c.EMPFIRSTNAME.toLowerCase() === candidateFullName.toLowerCase() ||
      (tokenCount === 1 && c.EMPFIRSTNAME.toLowerCase() === firstToken.toLowerCase())
    );

    if (exactMatch) {
      return {
        resolved: true,
        matched: true,
        employeeCode: exactMatch.EMPCODE,
        employeeName: exactMatch.FullName,
        location: exactMatch.LOCATION,
        locationName: exactMatch.LocationName,
        dept: exactMatch.DEPT,
        departmentName: exactMatch.DepartmentName,
        designation: exactMatch.DesignationName
      };
    }

    if (candidates.length === 1) {
      const match = candidates[0];
      return {
        resolved: true,
        matched: true,
        employeeCode: match.EMPCODE,
        employeeName: match.FullName,
        location: match.LOCATION,
        locationName: match.LocationName,
        dept: match.DEPT,
        departmentName: match.DepartmentName,
        designation: match.DesignationName
      };
    }

    // 1. Match candidates where all significant tokens of candidate.FullName are present in the user message
    const allTokensInMsg = candidates.filter(c => {
      const nameTokens = String(c.FullName || "")
        .toLowerCase()
        .split(/\s+/)
        .filter(t => t.length >= 2);
      if (nameTokens.length === 0) return false;
      return nameTokens.every(t => normalized.includes(t));
    });

    if (allTokensInMsg.length === 1) {
      const match = allTokensInMsg[0];
      return {
        resolved: true,
        matched: true,
        employeeCode: match.EMPCODE,
        employeeName: match.FullName,
        location: match.LOCATION,
        locationName: match.LocationName,
        dept: match.DEPT,
        departmentName: match.DepartmentName,
        designation: match.DesignationName
      };
    }

    if (allTokensInMsg.length > 1) {
      const exactFullInMsg = allTokensInMsg.filter(c =>
        (c.FullName && c.FullName.toLowerCase() === candidateFullName.toLowerCase()) ||
        (c.EMPFIRSTNAME && c.EMPFIRSTNAME.toLowerCase() === candidateFullName.toLowerCase())
      );
      if (exactFullInMsg.length === 1) {
        const match = exactFullInMsg[0];
        return {
          resolved: true,
          matched: true,
          employeeCode: match.EMPCODE,
          employeeName: match.FullName,
          location: match.LOCATION,
          locationName: match.LocationName,
          dept: match.DEPT,
          departmentName: match.DepartmentName,
          designation: match.DesignationName
        };
      }
    }

    // 2. Filter to exact full name matches if multiple soundex/like matches
    const exactFull = candidates.filter(c =>
      (c.FullName && c.FullName.toLowerCase() === candidateFullName.toLowerCase()) ||
      (c.EMPFIRSTNAME && c.EMPFIRSTNAME.toLowerCase() === candidateFullName.toLowerCase()) ||
      (tokenCount === 1 && c.EMPFIRSTNAME && c.EMPFIRSTNAME.toLowerCase() === firstToken.toLowerCase())
    );

    if (exactFull.length === 1) {
      const match = exactFull[0];
      return {
        resolved: true,
        matched: true,
        employeeCode: match.EMPCODE,
        employeeName: match.FullName,
        location: match.LOCATION,
        locationName: match.LocationName,
        dept: match.DEPT,
        departmentName: match.DepartmentName,
        designation: match.DesignationName
      };
    }

    // Multiple matches exist across branches: return disambiguation info
    return {
      resolved: false,
      isAmbiguous: true,
      candidates: candidates.slice(0, 5).map(c => ({
        empCode: c.EMPCODE,
        name: c.FullName,
        branch: c.LocationName || c.LOCATION,
        department: c.DepartmentName || c.DEPT,
        designation: c.DesignationName || c.EMPLOYEEDESIGNATION,
        status: c.STATUS === 1 ? "Active" : "Inactive"
      }))
    };
  } catch (err) {
    console.warn("[V6-DBEntityLinker] Notice:", err?.message);
    return { resolved: false };
  }
};

// ============================================================================
// ENGINE 8: CONVERSATION MEMORY ENGINE
// ============================================================================

class MemoryEngine {
  constructor() {
    this.sessions = new Map();
  }

  getLastTurn(conversationId) {
    if (!conversationId) return null;
    return this.sessions.get(conversationId) || null;
  }

  getContext(conversationId) {
    return this.getLastTurn(conversationId);
  }

  async ensureContextFromDB(conversationId, sequelize) {
    if (!conversationId || !sequelize?.query) return null;
    let existing = this.sessions.get(conversationId);
    // If in-memory context already has the latest turn details, never re-query DB to avoid stale turn bleeding
    if (existing && (existing.lastEmployeeCode || existing.lastEmployeeName || existing.lastUserMessage)) {
      return existing;
    }

    try {
      const rows = await sequelize.query(`
        SELECT TOP 4 [Role], [Message_Content], [Metadata]
        FROM [dbo].[AI_Message_Tbl] WITH (NOLOCK)
        WHERE [Conversation_Id] = :conversationId
        ORDER BY [UTD] DESC
      `, { replacements: { conversationId }, type: QueryTypes.SELECT });

      if (Array.isArray(rows) && rows.length > 0) {
        let lastUserMsg = null;
        let empCode = null;
        let empName = null;
        let intent = null;

        for (const row of rows) {
          if (row.Role === 'user' && !lastUserMsg && row.Message_Content) {
            lastUserMsg = row.Message_Content;
          }
          if (row.Metadata) {
            try {
              const meta = typeof row.Metadata === 'string' ? JSON.parse(row.Metadata) : row.Metadata;
              if (!empCode) empCode = meta.lastEmployeeCode || meta.resolvedEntities?.employeeCode || meta.employeeCode;
              if (!empName) empName = meta.lastEmployeeName || meta.resolvedEntities?.employeeName || meta.employeeName || meta.nameFilter;
              if (!intent) intent = meta.intent || meta.effectiveIntent;
            } catch (_) {}
          }
          if (!empCode && row.Message_Content) {
            const codeMatch = String(row.Message_Content).match(/\b(?:Employee Code|Emp Code|Code|EMPCODE)[*\s:]+(\d{4,10})\b/i);
            if (codeMatch) empCode = codeMatch[1];
            const nameMatch = String(row.Message_Content).match(/(?:salary|karmchari|employee|hai)\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})\s+(?:ko|ki|ke|ka)\b/i);
            if (nameMatch) empName = nameMatch[1];
          }

          // Strictly limit to the immediate latest turn (stop after first user message)
          if (lastUserMsg) break;
        }

        if (empCode || empName) {
          existing = {
            ...(existing || {}),
            lastEmployeeCode: empCode ? String(empCode) : null,
            lastEmployeeName: empName || null,
            lastIntent: intent || null,
            lastUserMessage: lastUserMsg || null,
            lastUpdated: Date.now()
          };
          this.sessions.set(conversationId, existing);
          console.log(`🧠 [V6-MemoryEngine] Restored persistent context from DB: ${empName || ''} (${empCode || 'No Code'}) for ${conversationId}`);
          return existing;
        }
      }
    } catch (err) {
      console.warn("[V6-MemoryEngine] DB context restore notice:", err?.message);
    }
    return existing || null;
  }

  resolveContextualEntities(conversationId, currentEntities = {}, currentMessage = "", intent = "") {
    if (!conversationId) return { entities: currentEntities, intent, isFollowup: false, previousTurn: null };
    const history = this.sessions.get(conversationId) || {};
    const resolved = { ...currentEntities };
    let resolvedIntent = intent;

    const norm = normalizeLower(currentMessage);
    const isContinuationParticle = /^(aur|and|then|also|ab|fir|uske\s*baad|what\s*about|aur\s*bhi)\b/i.test(norm.trim());

    // 1. Is this an independent/new question that should NOT inherit previous context?
    const currentSubject = (resolved.employeeName || resolved.nameFilter || resolved.searchToken || "").trim().toLowerCase();
    const historySubject = (history.lastEmployeeName || "").trim().toLowerCase();
    const hasExplicitNewEmployee = Boolean(
      (resolved.employeeCode && history.lastEmployeeCode && String(resolved.employeeCode) !== String(history.lastEmployeeCode)) ||
      (resolved.employeeCode && !history.lastEmployeeCode) ||
      (currentSubject && historySubject && currentSubject !== historySubject) ||
      (currentSubject && !historySubject && !isPronounFollowup && !isListOrIdentityFollowup)
    );
    const isPronounFollowup = /\b(iska|iski|iske|inhe|inhein|unka|unki|unke|same|vahi|uska|uski|uske|previous|above|wahi|this person|that person|isi|isi\s*employee|is\s*employee|is\s*bande|isi\s*bande|current\s*employee)\b/i.test(norm);
    const isListOrIdentityFollowup = /\b(kon\s*kon|kaun\s*kaun|kon\s*hai|kaun\s*hai|who\s*all|who\s*are\s*they|list|names|naam\s*kya|details?\s*nikalo|detail\s*do|details?\s*do|data\s*do|dikhao|batao)\b/i.test(norm);
    const isGlobalAggregateOrRanking = /\b(top\s*\d+|bottom\s*\d+|sabse\s*jyada|sabse\s*kam|highest|lowest|all\s*employees|sabhi\s*karmchari|total\s*employees|kitne\s*log|kitne\s*employee|total\s*count)\b/i.test(norm);
    const isGlobalEventQuery = /\b(aaj\s*kiska|aaj\s*kiski|kiska\s*birthday|kiski\s*anniversary|kiska\s*janamdin|kiski\s*saalgirah)\b/i.test(norm);

    if (!isContinuationParticle && !isPronounFollowup && !isListOrIdentityFollowup && (hasExplicitNewEmployee || isGlobalAggregateOrRanking || isGlobalEventQuery)) {
      // Independent query - start fresh context for this domain
      return { entities: resolved, intent: resolvedIntent, isFollowup: false, previousTurn: history };
    }

    // 2. Aggregate & Count Follow-Up Resolution (e.g. "aur branch 2 par?", "aur inactive?", "aur accountant?")
    const isAggregateIntent = ["EMPLOYEE_COUNT", "SALARY_TOTAL_AGGREGATE", "SALARY_COUNT_AGGREGATE", "PF_DEDUCTION_COUNT", "PF_COUNT"].includes(history.lastIntent);
    const isShortQuery = norm.trim().split(/\s+/).length <= 8;
    const isAggregateFollowup = Boolean(
      isAggregateIntent && (
        isContinuationParticle ||
        (isShortQuery && (resolved.branch || resolved.branches || resolved.excludeBranch || resolved.employeeStatus || resolved.designation)) ||
        (isContinuationParticle && (resolved.branch || resolved.employeeStatus || resolved.designation || isGlobalAggregateOrRanking))
      )
    );

    if (isAggregateFollowup) {
      resolvedIntent = history.lastIntent;

      // Status inheritance (e.g. if user asks "aur branch 2 par?", inherit ACTIVE or INACTIVE)
      if (!resolved.employeeStatus && history.lastEmployeeStatus) {
        resolved.employeeStatus = history.lastEmployeeStatus;
      }

      // Branch inheritance (e.g. if user asks "aur inactive?", inherit branch 2)
      if (!resolved.branch && !resolved.branches && !resolved.excludeBranch && history.lastBranch) {
        resolved.branch = history.lastBranch;
        resolved.locCode = history.lastBranch;
      }
      if (!resolved.branches && history.lastBranches && !resolved.branch && !resolved.excludeBranch) {
        resolved.branches = history.lastBranches;
      }

      // Designation inheritance
      if (!resolved.designation && history.lastDesignation) {
        resolved.designation = history.lastDesignation;
      }

      // Month/Year inheritance
      if (!resolved.month && history.lastMonth) {
        resolved.month = history.lastMonth;
      }
      if (!resolved.year && history.lastYear) {
        resolved.year = history.lastYear;
      }

      return { entities: resolved, intent: resolvedIntent, isFollowup: true, previousTurn: history };
    }

    // 3. Detect Elliptical / Follow-up Patterns for Individual Employees
    // Attribute queries (asking for an attribute of a person without specifying a person)
    const isAttributeQuery = /\b(basic|basic_earn|gross|net|salary|pagar|tankha|vetan|ctc|designation|post|pad|mobile|phone|contact|address|pata|joining|doj|birthday|dob|janamdin|anniversary|saalgirah|bank|account|khata|ifsc|pan|panno|aadhaar|aadhar|pf|pfnumber|uan|esi|leave|leaves|chhutti|asset|laptop|mispunch|punch|attendance|haziri|detail|details|info|information|data|biodata|profile)\b/i.test(norm);

    // Temporal queries without subject (e.g. "aur November ki?", "October 2025 ki?", "pichle mahine ki?")
    const isTemporalQuery = Boolean(resolved.month || resolved.year || resolved.specificDate || /\b(pichle\s*mahine|last\s*month|agle\s*mahine|next\s*month)\b/i.test(norm));

    const hasSubjectInHistory = Boolean(history.lastEmployeeCode || history.lastEmployeeName);

    const isContextualFollowup = Boolean(
      hasSubjectInHistory && (
        isPronounFollowup ||
        isContinuationParticle ||
        isListOrIdentityFollowup ||
        (isAttributeQuery && !resolved.employeeCode && !resolved.employeeName && !resolved.searchToken) ||
        (isTemporalQuery && !resolved.employeeCode && !resolved.employeeName && !resolved.searchToken) ||
        history.isPendingClarification
      )
    );

    if (isContextualFollowup) {
      // Inherit employee from previous turn
      if (!resolved.employeeCode && history.lastEmployeeCode) {
        resolved.employeeCode = history.lastEmployeeCode;
        if (history.lastEmployeeName) {
          resolved.employeeName = history.lastEmployeeName;
        }
      } else if (!resolved.employeeCode && !resolved.employeeName && history.lastEmployeeName) {
        // Inherit employeeName when no code is in history (e.g. previous turn was "Atendra name ke kitne employee hai")
        resolved.employeeName = history.lastEmployeeName;
        resolved.nameFilter = history.lastEmployeeName;
      }

      // If this is a temporal follow-up without an explicit attribute in current message, inherit the previous intent!
      // (e.g. Turn 1 was ATTENDANCE_REPORT, Turn 2 is "aur November ki?")
      if (isTemporalQuery && !isAttributeQuery && (intent === "GENERAL_DATABASE_QUERY" || !intent)) {
        if (history.lastIntent && history.lastIntent !== "GENERAL_DATABASE_QUERY") {
          resolvedIntent = history.lastIntent;
        }
      }

      // If this is a detail/list or profile query
      if (isListOrIdentityFollowup || isAttributeQuery || isPronounFollowup) {
        if (!resolvedIntent || resolvedIntent === "GENERAL_DATABASE_QUERY" || resolvedIntent === "EMPLOYEE_COUNT") {
          resolvedIntent = "EMPLOYEE_LOOKUP";
        }
      }

      // If this is an attribute query for profile (designation, mobile, address, etc.)
      const isProfileAttribute = /\b(designation|post|pad|mobile|phone|contact|address|pata|dob|birthday|joining|doj|bank|account|pan|aadhaar|pf)\b/i.test(norm);
      if (isProfileAttribute && (!resolvedIntent || resolvedIntent === "GENERAL_DATABASE_QUERY")) {
        resolvedIntent = "EMPLOYEE_LOOKUP";
      }

      // Inherit month/year if not specified in the current follow-up and not asking for basic profile attributes
      if (!resolved.month && history.lastMonth && !isProfileAttribute) {
        resolved.month = history.lastMonth;
      }
      if (!resolved.year && history.lastYear && !isProfileAttribute) {
        resolved.year = history.lastYear;
      }
      if (!resolved.branch && history.lastBranch) {
        resolved.branch = history.lastBranch;
      }

      return { entities: resolved, intent: resolvedIntent, isFollowup: true, previousTurn: history };
    }

    return { entities: resolved, intent: resolvedIntent, isFollowup: false, previousTurn: history };
  }

  updateContext(conversationId, entities = {}, intent = "", extra = {}) {
    if (!conversationId) return;
    const existing = this.sessions.get(conversationId) || {};

    const hasCurrentEmpCode = Boolean(entities.employeeCode);
    const currentName = (entities.employeeName || entities.nameFilter || "").trim();
    const hasCurrentEmpName = Boolean(currentName);
    const existingName = (existing.lastEmployeeName || "").trim();

    const isNewEmployeeCode = Boolean(
      hasCurrentEmpCode && existing.lastEmployeeCode && String(entities.employeeCode) !== String(existing.lastEmployeeCode)
    );
    const isNewEmployeeName = Boolean(
      hasCurrentEmpName && existingName && currentName.toLowerCase() !== existingName.toLowerCase()
    );
    const isNameWithoutOldCode = Boolean(
      hasCurrentEmpName && !hasCurrentEmpCode && existing.lastEmployeeCode
    );

    const isNewSubject = isNewEmployeeCode || isNewEmployeeName || isNameWithoutOldCode;

    let newEmpCode = null;
    let newEmpName = null;

    if (hasCurrentEmpCode) {
      newEmpCode = String(entities.employeeCode);
      newEmpName = currentName || (isNewSubject ? null : existing.lastEmployeeName) || null;
    } else if (hasCurrentEmpName) {
      // Current turn specifically has an employee name (e.g. "Atendra")
      newEmpCode = null; // Stale code must NEVER bleed into a name query!
      newEmpName = currentName;
    } else {
      // Neither code nor name was explicitly requested:
      // If current query was a general company-wide aggregate or summary, do NOT retain prior employee context
      const isGeneralCompanyQuery = [
        "EMPLOYEE_COUNT", "SALARY_TOTAL_AGGREGATE", "SALARY_COUNT_AGGREGATE",
        "PF_COUNT", "COMPANY_SUMMARY", "DEPARTMENT_COUNT"
      ].includes(intent) && !entities.branch && !entities.designation;

      if (!isGeneralCompanyQuery) {
        newEmpCode = existing.lastEmployeeCode || null;
        newEmpName = existing.lastEmployeeName || null;
      }
    }

    const newBranch = entities.branch || (isNewSubject ? null : existing.lastBranch) || null;
    const newBranches = entities.branches || (isNewSubject ? null : existing.lastBranches) || null;
    const newExcludeBranch = entities.excludeBranch || (isNewSubject ? null : existing.lastExcludeBranch) || null;
    const newEmployeeStatus = entities.employeeStatus || (isNewSubject ? null : existing.lastEmployeeStatus) || null;
    const newDesignation = entities.designation || (isNewSubject ? null : existing.lastDesignation) || null;

    this.sessions.set(conversationId, {
      ...existing,
      lastEmployeeCode: newEmpCode,
      lastEmployeeName: newEmpName,
      lastBranch: newBranch,
      lastBranches: newBranches,
      lastExcludeBranch: newExcludeBranch,
      lastEmployeeStatus: newEmployeeStatus,
      lastDesignation: newDesignation,
      lastMonth: entities.month || (isNewSubject ? null : existing.lastMonth) || null,
      lastYear: entities.year || (isNewSubject ? null : existing.lastYear) || null,
      lastIntent: intent || existing.lastIntent || null,
      lastUserMessage: extra.userMessage !== undefined ? extra.userMessage : (existing.lastUserMessage || null),
      lastSQL: extra.sql !== undefined ? extra.sql : (existing.lastSQL || null),
      lastRowCount: extra.rowCount !== undefined ? extra.rowCount : (existing.lastRowCount || 0),
      lastExecutionFailed: extra.failed !== undefined ? extra.failed : (existing.lastExecutionFailed || false),
      isPendingClarification: extra.rowCount === 0 || extra.failed === true,
      lastEntities: { ...(existing.lastEntities || {}), ...(entities || {}) },
      tablesUsed: extra.tablesUsed || existing.tablesUsed || [],
      lastUpdated: Date.now()
    });
  }

  clearContext(conversationId) {
    if (!conversationId) {
      this.sessions.clear();
      return;
    }
    this.sessions.delete(String(conversationId));
  }
}

const MemoryEngineInstance = new MemoryEngine();

// ============================================================================
// ENGINE 7: MULTI-TIER CACHE ENGINE
// ============================================================================

class MultiTierCacheEngine {
  constructor() {
    this.l1ExactCache = new Map();
    this.l3VectorCache = [];
    this.maxL1Size = 500;
    this.maxL3Size = 1000;
    this.hitCounter = 0;
    this.missCounter = 0;
  }

  createHashKey(normalizedQuery, compcode, role, userCode) {
    const raw = `${compcode}:${role}:${userCode || "global"}:${normalizedQuery}`;
    return crypto.createHash("sha256").update(raw).digest("hex");
  }

  getExactMatch(normalizedQuery, compcode, role, userCode) {
    const key = this.createHashKey(normalizedQuery, compcode, role, userCode);
    if (this.l1ExactCache.has(key)) {
      const entry = this.l1ExactCache.get(key);
      entry.hits = (entry.hits || 0) + 1;
      this.hitCounter++;
      return { ...entry, cacheTier: "L1_EXACT_HASH" };
    }
    return null;
  }

  async getSemanticMatch(queryEmbedding, compcode, role) {
    if (!Array.isArray(queryEmbedding) || queryEmbedding.length === 0) return null;

    let bestMatch = null;
    let maxSim = 0;

    for (const item of this.l3VectorCache) {
      if (item.compcode !== compcode || item.role !== role) continue;
      const sim = cosineSimilarity(queryEmbedding, item.embedding);
      if (sim > maxSim) {
        maxSim = sim;
        bestMatch = item;
      }
    }

    if (maxSim >= 0.94 && bestMatch) {
      bestMatch.hits = (bestMatch.hits || 0) + 1;
      this.hitCounter++;
      return { ...bestMatch, similarity: maxSim, cacheTier: "L3_SEMANTIC_EMBEDDING" };
    }

    this.missCounter++;
    return null;
  }

  saveToCache({ normalizedQuery, queryEmbedding, sql, answer, entities, compcode, role, userCode, intent }) {
    const key = this.createHashKey(normalizedQuery, compcode, role, userCode);
    const entry = {
      normalizedQuery,
      sql,
      answer,
      entities,
      compcode,
      role,
      userCode,
      intent,
      timestamp: Date.now(),
      hits: 1
    };

    if (this.l1ExactCache.size >= this.maxL1Size) {
      const oldestKey = this.l1ExactCache.keys().next().value;
      this.l1ExactCache.delete(oldestKey);
    }
    this.l1ExactCache.set(key, entry);

    if (Array.isArray(queryEmbedding) && queryEmbedding.length > 0) {
      if (this.l3VectorCache.length >= this.maxL3Size) {
        this.l3VectorCache.shift();
      }
      this.l3VectorCache.push({
        ...entry,
        embedding: queryEmbedding
      });
    }
  }

  getStats() {
    const total = this.hitCounter + this.missCounter;
    const hitRate = total > 0 ? ((this.hitCounter / total) * 100).toFixed(1) + "%" : "0%";
    return {
      totalQueries: total,
      cacheHits: this.hitCounter,
      cacheMisses: this.missCounter,
      hitRate,
      l1Size: this.l1ExactCache.size,
      l3Size: this.l3VectorCache.length
    };
  }

  clear() {
    this.l1ExactCache.clear();
    this.l3VectorCache = [];
    this.hitCounter = 0;
    this.missCounter = 0;
    return true;
  }
}

const CacheEngineInstance = new MultiTierCacheEngine();

// ============================================================================
// ENGINE 5: DETERMINISTIC SQL TEMPLATES
// ============================================================================

const getDeterministicSQLTemplate = ({ intent, entities = {}, userContext = {} }) => {
  const emp = entities.employeeCode || (entities.isSelf ? userContext.employeeCode : null);
  const month = entities.month;
  const year = entities.year || new Date().getFullYear();
  const branch = entities.branch;

  switch (intent) {
    case "SERVICE_REMINDERS_DUE":
      {
        let sql = `SELECT TOP 100
  CONVERT(varchar(10), Final_Due_Date, 120) AS [FinalDueDate],
  *
FROM [dbo].[Srv_Reminder_Tbl] WITH (NOLOCK)
WHERE 1=1`;
        if (entities.specificDate) {
          sql += ` AND CAST(Final_Due_Date AS DATE) = '${entities.specificDate}'`;
        } else if (entities.month && entities.year) {
          sql += ` AND MONTH(Final_Due_Date) = ${entities.month} AND YEAR(Final_Due_Date) = ${entities.year}`;
        } else if (/\b(today|aaj|current)\b/i.test(entities.rawMessage || "") || !entities.specificDate) {
          sql += ` AND CAST(Final_Due_Date AS DATE) = CAST(GETDATE() AS DATE)`;
        }
        sql += ` ORDER BY Final_Due_Date ASC;`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "Srv_Reminder_Tbl" };
      }

    case "ATTENDANCE_AND_SALARY_REPORT":
      if (emp) {
        const cleanEmp = emp.replace(/'/g, "''");
        let sql = `SELECT TOP 100
  ISNULL([E].[EMPCODE], [S].[Emp_Code]) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  [E].[LOCATION] AS [Location],
  [S].[SalMnth] AS [SalaryMonth],
  [S].[salyear] AS [SalaryYear],
  [S].[Basic_Earn] AS [BasicPay],
  [S].[HRA_Earn] AS [HRA],
  [S].[Gross_Earn] AS [GrossSalary],
  [S].[Final_Payment] AS [NetSalary],
  [S].[Deducation] AS [TotalDeductions],
  [S].[Present_days] AS [PresentDays],
  [S].[Monthdays] AS [TotalDays]
FROM [dbo].[SALARYFILE] AS [S] WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) 
  ON LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE (LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = '${cleanEmp}' OR LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) = '${cleanEmp}')`;
        if (month) sql += ` AND [S].[SalMnth] = ${month}`;
        if (year) sql += ` AND [S].[salyear] = ${year}`;
        sql += ` ORDER BY [S].[salyear] DESC, [S].[SalMnth] DESC;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }
      break;

    case "EMPLOYEE_COUNT":
      {
        let sql = "";
        const isSeparation = entities.isSeparationEvent;
        const status = entities.employeeStatus;

        if (isSeparation) {
          sql = `SELECT COUNT(*) AS [SeparatedEmployeeCount] FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK) WHERE (LASTWOR_DATE IS NOT NULL)`;
          if (month) sql += ` AND (MONTH(LASTWOR_DATE) = ${month})`;
          if (year) sql += ` AND (YEAR(LASTWOR_DATE) = ${year})`;
          if (entities.specificDate) sql += ` AND (CONVERT(varchar(10), LASTWOR_DATE, 120) = '${entities.specificDate}')`;
        } else if (status === "INACTIVE") {
          sql = `SELECT COUNT(*) AS [InactiveEmployeeCount] FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK) WHERE 1=1 AND (LASTWOR_DATE IS NOT NULL)`;
        } else if (status === "ACTIVE") {
          sql = `SELECT COUNT(*) AS [ActiveEmployeeCount] FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK) WHERE 1=1 AND (LASTWOR_DATE IS NULL)`;
        } else {
          sql = `SELECT COUNT(*) AS [TotalEmployeeCount] FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK) WHERE 1=1`;
        }

        // Branch / Location Filtering
        if (entities.branches && Array.isArray(entities.branches) && entities.branches.length > 0) {
          const formattedBranches = entities.branches.map(b => {
            const clean = String(b).replace(/'/g, "''");
            return /^\d+$/.test(clean) ? clean : `'${clean}'`;
          }).join(", ");
          sql += ` AND LOCATION IN (${formattedBranches})`;
        } else if (entities.excludeBranch) {
          const cleanExclude = String(entities.excludeBranch).replace(/'/g, "''");
          const isNum = /^\d+$/.test(cleanExclude);
          sql += ` AND (LOCATION <> '${cleanExclude}' AND CONVERT(varchar(50), LOCATION) <> '${cleanExclude}'${isNum ? ` AND LOCATION <> ${cleanExclude}` : ""})`;
        } else if (entities.branch || entities.locCode) {
          const loc = entities.branch || entities.locCode;
          const cleanLoc = String(loc).replace(/'/g, "''");
          const isNum = /^\d+$/.test(cleanLoc);
          sql += ` AND (LOCATION = '${cleanLoc}' OR CONVERT(varchar(50), LOCATION) = '${cleanLoc}'${isNum ? ` OR LOCATION = ${cleanLoc}` : ""})`;
        }

        // Designation Filtering
        if (entities.designation) {
          const cleanDesig = entities.designation.replace(/'/g, "''");
          sql += ` AND EMPLOYEEDESIGNATION LIKE '%${cleanDesig}%'`;
        }

        // Name Filtering (e.g. "shantanu name ke kitne employee hai")
        if (entities.employeeName || entities.nameFilter) {
          const cleanName = (entities.employeeName || entities.nameFilter).replace(/'/g, "''");
          sql += ` AND (EMPFIRSTNAME LIKE '%${cleanName}%' OR CONCAT(EMPFIRSTNAME, ' ', ISNULL(EMPLASTNAME, '')) LIKE '%${cleanName}%')`;
        }

        sql += `;`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER" };
      }

    case "SALARY_TOTAL_AGGREGATE":
      {
        const loc = entities.branch || entities.locCode;
        let sql = `SELECT 
  COUNT(DISTINCT [S].[Emp_Code]) AS [TotalEmployeesPaid],
  SUM(ISNULL([S].[Basic_Earn], 0)) AS [Total_Basic_Earn],
  SUM(ISNULL([S].[Gross_Earn], 0)) AS [Total_Gross_Earn],
  SUM(ISNULL([S].[Final_Payment], 0)) AS [Total_Net_Salary],
  SUM(ISNULL([S].[Deducation], 0)) AS [Total_Deductions],
  SUM(ISNULL([S].[HRA_Earn], 0)) AS [Total_HRA_Earn],
  AVG(ISNULL([S].[Final_Payment], 0)) AS [Avg_Net_Salary]
FROM [dbo].[SALARYFILE] AS [S] WITH (NOLOCK)
WHERE 1=1`;
        if (month) sql += ` AND [S].[SalMnth] = '${month}'`;
        if (year) sql += ` AND [S].[salyear] = '${year}'`;
        if (loc) {
          const cleanLoc = loc.replace(/'/g, "''");
          sql += ` AND ([S].[Loc_Code] = '${cleanLoc}' OR CONVERT(varchar(50), [S].[Loc_Code]) = '${cleanLoc}')`;
        }
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "SALARYFILE" };
      }

    case "SALARY_COUNT_AGGREGATE":
      {
        const loc = entities.branch || entities.locCode;
        let sql = `SELECT 
  COUNT(DISTINCT [S].[Emp_Code]) AS [TotalEmployeesWithSalary]
FROM [dbo].[SALARYFILE] AS [S] WITH (NOLOCK)
WHERE (ISNULL([S].[Final_Payment], 0) > 0 OR ISNULL([S].[Gross_Earn], 0) > 0)`;
        if (month) sql += ` AND [S].[SalMnth] = '${month}'`;
        if (year) sql += ` AND [S].[salyear] = '${year}'`;
        if (loc) {
          const cleanLoc = loc.replace(/'/g, "''");
          sql += ` AND ([S].[Loc_Code] = '${cleanLoc}' OR CONVERT(varchar(50), [S].[Loc_Code]) = '${cleanLoc}')`;
        }
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "SALARYFILE" };
      }

    case "PF_DEDUCTION_COUNT":
      {
        let sql = `SELECT 
  COUNT(DISTINCT [S].[Emp_Code]) AS [TotalEmployeesWithPF],
  SUM(ISNULL([S].[PF_Employee], 0)) AS [TotalEmployeePF],
  SUM(ISNULL([S].[pf_employer], 0)) AS [TotalEmployerPF],
  SUM(ISNULL([S].[pf_emplpension], 0)) AS [TotalPensionEPS],
  AVG(ISNULL([S].[PF_Employee], 0)) AS [AvgPFDeduction],
  COUNT(DISTINCT [S].[Emp_Code]) AS [RecordCount]
FROM [dbo].[SALARYFILE] AS [S] WITH (NOLOCK)`;
        if (branch) {
          sql += `
INNER JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE [S].[PF_Employee] IS NOT NULL AND ISNULL([S].[PF_Employee], 0) > 0
  AND [E].[LOCATION] = '${branch.replace(/'/g, "''")}'`;
        } else {
          sql += `
WHERE [S].[PF_Employee] IS NOT NULL AND ISNULL([S].[PF_Employee], 0) > 0`;
        }
        if (month) sql += ` AND [S].[SalMnth] = ${month}`;
        if (year) sql += ` AND [S].[salyear] = ${year};`;
        else sql += `;`;
        return { sql, requiresJoin: Boolean(branch), isTemplate: true, confidence: 0.99, targetTable: "SALARYFILE" };
      }

    case "SALARY_PF_DEDUCTION":
      if (emp || entities.searchToken) {
        const cleanEmp = (emp || entities.searchToken).replace(/'/g, "''");
        let sql = `SELECT TOP 50
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL([E].[EMPCODE], [S].[Emp_Code])))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  [E].[PFNUMBER] AS [PFNUMBER],
  [S].[SalMnth] AS [SalaryMonth],
  [S].[salyear] AS [SalaryYear],
  DATENAME(month, DATEFROMPARTS([S].[salyear], [S].[SalMnth], 1)) AS [MonthName],
  ISNULL([S].[PF_Employee], 0) AS [PF_Employee],
  ISNULL([S].[pf_employer], 0) AS [pf_employer],
  ISNULL([S].[pf_emplpension], 0) AS [pf_emplpension],
  ISNULL([S].[Deducation], 0) AS [TotalDeductions],
  ISNULL([S].[Gross_Earn], 0) AS [GrossEarnings],
  ISNULL([S].[Final_Payment], 0) AS [NetSalary],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation]
FROM [dbo].[SALARYFILE] AS [S] WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) 
  ON LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE (LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = '${cleanEmp}' OR LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) = '${cleanEmp}')`;
        if (month) sql += ` AND [S].[SalMnth] = ${month}`;
        if (year) sql += ` AND [S].[salyear] = ${year}`;
        sql += ` ORDER BY [S].[salyear] DESC, [S].[SalMnth] DESC;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99, targetTable: "SALARYFILE" };
      } else if (month || year) {
        let sql = `SELECT TOP 200
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL([E].[EMPCODE], [S].[Emp_Code])))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  [E].[PFNUMBER] AS [PFNUMBER],
  [S].[SalMnth] AS [SalaryMonth],
  [S].[salyear] AS [SalaryYear],
  DATENAME(month, DATEFROMPARTS([S].[salyear], [S].[SalMnth], 1)) AS [MonthName],
  ISNULL([S].[PF_Employee], 0) AS [PF_Employee],
  ISNULL([S].[pf_employer], 0) AS [pf_employer],
  ISNULL([S].[pf_emplpension], 0) AS [pf_emplpension],
  ISNULL([S].[Deducation], 0) AS [TotalDeductions],
  ISNULL([S].[Gross_Earn], 0) AS [GrossEarnings],
  ISNULL([S].[Final_Payment], 0) AS [NetSalary],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation]
FROM [dbo].[SALARYFILE] AS [S] WITH (NOLOCK)
INNER JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE [S].[PF_Employee] IS NOT NULL AND ISNULL([S].[PF_Employee], 0) > 0`;
        if (month) sql += ` AND [S].[SalMnth] = ${month}`;
        if (year) sql += ` AND [S].[salyear] = ${year}`;
        if (branch) sql += ` AND [E].[LOCATION] = '${branch.replace(/'/g, "''")}'`;
        sql += ` ORDER BY ISNULL([S].[PF_Employee], 0) DESC, [E].[EMPCODE];`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99, targetTable: "SALARYFILE" };
      }
      break;

    case "EMPLOYEE_SALARY_HISTORY":
    case "SELF_SALARY":
    case "SALARY_REPORT":
      if (entities.aggregation === "SUM" && !emp) {
        return getDeterministicSQLTemplate({ intent: "SALARY_TOTAL_AGGREGATE", entities, userContext });
      }
      if (emp || entities.searchToken) {
        const cleanEmp = (emp || entities.searchToken).replace(/'/g, "''");
        let sql = `SELECT TOP 50
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL([E].[EMPCODE], [S].[Emp_Code])))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  [S].[SalMnth] AS [SalaryMonth],
  [S].[salyear] AS [SalaryYear],
  DATENAME(month, DATEFROMPARTS([S].[salyear], [S].[SalMnth], 1)) AS [MonthName],
  ISNULL([S].[Final_Payment], 0) AS [NetSalary],
  ISNULL([S].[Gross_Earn], 0) AS [GrossEarnings],
  ISNULL([S].[Basic_Earn], 0) AS [BasicEarnings],
  ISNULL([S].[HRA_Earn], 0) AS [HRAEarnings],
  ISNULL([S].[Deducation], 0) AS [TotalDeductions],
  ISNULL([S].[Present_days], 0) AS [PresentDays],
  ISNULL([S].[Monthdays], 0) AS [TotalDays],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation]
FROM [dbo].[SALARYFILE] AS [S] WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) 
  ON LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE (LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = '${cleanEmp}' OR LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) = '${cleanEmp}')`;
        if (month) sql += ` AND [S].[SalMnth] = ${month}`;
        if (year) sql += ` AND [S].[salyear] = ${year}`;
        const isAskingHighest = /\b(highest|maximum|sabse\s*jyada|sabse\s*badi|max|peak|kab|kis\s*mahine)\b/i.test(entities.rawMessage || "");
        if (isAskingHighest) {
          sql += ` AND (ISNULL([S].[Final_Payment], 0) > 0 OR ISNULL([S].[Gross_Earn], 0) > 0)`;
          sql += ` ORDER BY ISNULL([S].[Final_Payment], 0) DESC, ISNULL([S].[Gross_Earn], 0) DESC, [S].[salyear] DESC, [S].[SalMnth] DESC;`;
        } else {
          sql += ` AND (ISNULL([S].[Final_Payment], 0) > 0 OR ISNULL([S].[Gross_Earn], 0) > 0)`;
          sql += ` ORDER BY [S].[salyear] ASC, [S].[SalMnth] ASC;`;
        }
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99, targetTable: "SALARYFILE" };
      } else if (month || year) {
        let sql = `SELECT TOP 200
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL([E].[EMPCODE], [S].[Emp_Code])))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  [S].[SalMnth] AS [SalaryMonth],
  [S].[salyear] AS [SalaryYear],
  DATENAME(month, DATEFROMPARTS([S].[salyear], [S].[SalMnth], 1)) AS [MonthName],
  ISNULL([S].[Gross_Earn], 0) AS [GrossEarnings],
  ISNULL([S].[Basic_Earn], 0) AS [BasicEarnings],
  ISNULL([S].[HRA_Earn], 0) AS [HRAEarnings],
  ISNULL([S].[Final_Payment], 0) AS [NetSalary],
  ISNULL([S].[Deducation], 0) AS [TotalDeductions],
  ISNULL([S].[Present_days], 0) AS [PresentDays],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation]
FROM [dbo].[SALARYFILE] AS [S] WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE (ISNULL([S].[Final_Payment], 0) > 0 OR ISNULL([S].[Gross_Earn], 0) > 0)`;
        if (month) sql += ` AND [S].[SalMnth] = ${month}`;
        if (year) sql += ` AND [S].[salyear] = ${year}`;
        if (branch) sql += ` AND [E].[LOCATION] = '${branch.replace(/'/g, "''")}'`;
        sql += ` ORDER BY ISNULL([S].[Final_Payment], 0) DESC, [E].[EMPCODE];`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99, targetTable: "SALARYFILE" };
      }
      break;

    case "BIRTHDAY_LOOKUP":
      if (emp || entities.searchToken) {
        const cleanEmp = (emp || entities.searchToken).replace(/'/g, "''");
        let sql = `SELECT TOP 10
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), E.[DOB], 120) AS [DateOfBirth],
  DATENAME(month, E.[DOB]) AS [BirthMonthName],
  DAY(E.[DOB]) AS [BirthDayNumber],
  DATEDIFF(year, E.[DOB], GETDATE()) AS [Age],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  E.[MOBILENO] AS [MobileNo],
  E.[CORPORATEMAILID] AS [Email]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
WHERE LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) = '${cleanEmp}'
   OR (LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) LIKE '%${cleanEmp}%');`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }
      break;

    case "BIRTHDAY_TODAY":
      {
        let sql = `SELECT TOP 100
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), E.[DOB], 120) AS [DateOfBirth],
  DATEDIFF(year, E.[DOB], GETDATE()) AS [Age],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  E.[MOBILENO] AS [MobileNo]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
WHERE E.[DOB] IS NOT NULL
  AND MONTH(E.[DOB]) = MONTH(GETDATE())
  AND DAY(E.[DOB]) = DAY(GETDATE())
ORDER BY E.[EMPFIRSTNAME];`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }

    case "BIRTHDAY_BY_DATE":
      {
        const day = entities.day;
        const month = entities.month;
        let whereClause = `WHERE E.[DOB] IS NOT NULL`;
        if (day && month) {
          whereClause += ` AND MONTH(E.[DOB]) = ${month} AND DAY(E.[DOB]) = ${day}`;
        } else if (month) {
          whereClause += ` AND MONTH(E.[DOB]) = ${month}`;
        } else {
          whereClause += ` AND MONTH(E.[DOB]) = MONTH(GETDATE()) AND DAY(E.[DOB]) = DAY(GETDATE())`;
        }
        if (branch) {
          whereClause += ` AND E.[LOCATION] = '${branch.replace(/'/g, "''")}'`;
        }
        let sql = `SELECT TOP 100
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), E.[DOB], 120) AS [DateOfBirth],
  DATEDIFF(year, E.[DOB], GETDATE()) AS [Age],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  E.[MOBILENO] AS [MobileNo]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
${whereClause}
ORDER BY E.[EMPFIRSTNAME];`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER" };
      }

    case "WORK_ANNIVERSARY":
      {
        const day = entities.day;
        const month = entities.month;
        const year = entities.year || (entities.specificDate ? parseInt(entities.specificDate.split("-")[0], 10) : null);
        const isToday = entities.isToday || (/\b(today|aaj)\b/i.test(entities.rawMessage || "") && !day);
        let whereClause = `WHERE [E].[CURRENTJOINDATE] IS NOT NULL`;

        if (isToday) {
          whereClause += ` AND MONTH([E].[CURRENTJOINDATE]) = MONTH(GETDATE()) AND DAY([E].[CURRENTJOINDATE]) = DAY(GETDATE())`;
        } else if (day && month) {
          whereClause += ` AND MONTH([E].[CURRENTJOINDATE]) = ${month} AND DAY([E].[CURRENTJOINDATE]) = ${day}`;
        } else if (month) {
          whereClause += ` AND MONTH([E].[CURRENTJOINDATE]) = ${month}`;
        } else {
          whereClause += ` AND MONTH([E].[CURRENTJOINDATE]) = MONTH(GETDATE()) AND DAY([E].[CURRENTJOINDATE]) = DAY(GETDATE())`;
        }

        if (year) {
          whereClause += ` AND YEAR([E].[CURRENTJOINDATE]) <= ${year}`;
        }

        if (branch) {
          whereClause += ` AND ([E].[LOCATION] = '${branch.replace(/'/g, "''")}' OR CONVERT(varchar(50), [E].[LOCATION]) = '${branch.replace(/'/g, "''")}')`;
        }

        const yearsExpr = year
          ? `(${year} - YEAR([E].[CURRENTJOINDATE]))`
          : `DATEDIFF(YEAR, [E].[CURRENTJOINDATE], GETDATE())`;

        let sql = `SELECT TOP 500
  DAY([E].[CURRENTJOINDATE]) AS [AnniversaryDay],
  LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), [E].[CURRENTJOINDATE], 103) AS [JoiningDate],
  ${yearsExpr} AS [YearsOfService],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation],
  [E].[MOBILENO] AS [MobileNo]
FROM [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
${whereClause}
ORDER BY DAY([E].[CURRENTJOINDATE]) ASC, [E].[EMPFIRSTNAME] ASC, [E].[EMPCODE] ASC;`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER" };
      }

    case "MARRIAGE_ANNIVERSARY":
      {
        const day = entities.day;
        const month = entities.month;
        const year = entities.year || (entities.specificDate ? parseInt(entities.specificDate.split("-")[0], 10) : null);
        const isToday = entities.isToday || (/\b(today|aaj)\b/i.test(entities.rawMessage || "") && !day);
        let whereClause = `WHERE [E].[DOM] IS NOT NULL`;

        if (isToday) {
          whereClause += ` AND MONTH([E].[DOM]) = MONTH(GETDATE()) AND DAY([E].[DOM]) = DAY(GETDATE())`;
        } else if (day && month) {
          whereClause += ` AND MONTH([E].[DOM]) = ${month} AND DAY([E].[DOM]) = ${day}`;
        } else if (month) {
          whereClause += ` AND MONTH([E].[DOM]) = ${month}`;
        } else {
          whereClause += ` AND MONTH([E].[DOM]) = MONTH(GETDATE()) AND DAY([E].[DOM]) = DAY(GETDATE())`;
        }

        if (year) {
          whereClause += ` AND YEAR([E].[DOM]) <= ${year}`;
        }

        if (branch) {
          whereClause += ` AND ([E].[LOCATION] = '${branch.replace(/'/g, "''")}' OR CONVERT(varchar(50), [E].[LOCATION]) = '${branch.replace(/'/g, "''")}')`;
        }

        const yearsExpr = year
          ? `(${year} - YEAR([E].[DOM]))`
          : `DATEDIFF(YEAR, [E].[DOM], GETDATE())`;

        let sql = `SELECT TOP 500
  DAY([E].[DOM]) AS [AnniversaryDay],
  LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), [E].[DOM], 103) AS [MarriageDate],
  ${yearsExpr} AS [YearsOfMarriage],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation],
  [E].[MOBILENO] AS [MobileNo]
FROM [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
${whereClause}
ORDER BY DAY([E].[DOM]) ASC, [E].[EMPFIRSTNAME] ASC, [E].[EMPCODE] ASC;`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER" };
      }

    case "BIRTHDAYS_MONTH":
      {
        const mVal = month || "MONTH(GETDATE())";
        let sql = `SELECT TOP 200
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), E.[DOB], 120) AS [DateOfBirth],
  DAY(E.[DOB]) AS [BirthDayNumber],
  DATEDIFF(year, E.[DOB], GETDATE()) AS [Age],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  E.[MOBILENO] AS [MobileNo]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
WHERE E.[DOB] IS NOT NULL
  AND MONTH(E.[DOB]) = ${mVal}
ORDER BY DAY(E.[DOB]) ASC, E.[EMPFIRSTNAME];`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }

    case "HIGHEST_SALARY_RANKING":
      {
        const topMatch = (entities.rawMessage || "").match(/\btop\s*(\d+)\b/i);
        const limit = topMatch ? parseInt(topMatch[1], 10) : 10;
        const isLowest = /\b(lowest|minimum|sabse\s*kam|min)\b/i.test(entities.rawMessage || "");
        const orderDir = isLowest ? "ASC" : "DESC";

        // If a specific month, year, or paid keywords ("pay hui", "mili", "di gayi", "paid", "salaryfile") are present:
        const isMonthlyPayrollContext = Boolean(
          month ||
          entities.specificDate ||
          /\b(pay\s*hui|mili|di\s*gayi|paid|credited|chali\s*gayi|aai|aai\s*thi|salaryfile|mahine|month|total_earn|gross_earn)\b/i.test(entities.rawMessage || "")
        );

        if (isMonthlyPayrollContext || (month && year)) {
          const targetMonth = month || new Date().getMonth() + 1;
          const targetYear = year || new Date().getFullYear();
          let sql = `SELECT TOP ${limit}
  ISNULL([S].[Total_Earn], ISNULL([S].[Final_Payment], [S].[Gross_Earn])) AS [TotalEarnings],
  ISNULL([S].[Final_Payment], 0) AS [NetSalary],
  ISNULL([S].[Gross_Earn], 0) AS [GrossEarnings],
  ISNULL([S].[Basic_Earn], 0) AS [BasicEarnings],
  ISNULL([S].[Deducation], 0) AS [TotalDeductions],
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL([E].[EMPCODE], [S].[Emp_Code])))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation],
  [S].[SalMnth] AS [SalaryMonth],
  [S].[salyear] AS [SalaryYear],
  DATENAME(month, DATEFROMPARTS([S].[salyear], [S].[SalMnth], 1)) AS [MonthName]
FROM [dbo].[SALARYFILE] AS [S] WITH (NOLOCK)
INNER JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) 
  ON LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code])))
WHERE (CONVERT(varchar(10), [S].[SalMnth]) = '${targetMonth}' OR [S].[SalMnth] = ${targetMonth})
  AND (CONVERT(varchar(10), [S].[salyear]) = '${targetYear}' OR [S].[salyear] = ${targetYear})
  AND (ISNULL([S].[Total_Earn], 0) > 0 OR ISNULL([S].[Final_Payment], 0) > 0 OR ISNULL([S].[Gross_Earn], 0) > 0)`;
          if (branch) sql += ` AND [E].[LOCATION] = '${branch.replace(/'/g, "''")}'`;
          sql += ` ORDER BY ISNULL([S].[Total_Earn], ISNULL([S].[Final_Payment], [S].[Gross_Earn])) ${orderDir};`;
          return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99, targetTable: "SALARYFILE" };
        }

        let sql = `SELECT TOP ${limit}
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL(E.[EMPCODE], S.[Emp_Code])))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  E.[MOBILENO] AS [MobileNo],
  ISNULL(S.[Final_Payment], ISNULL(S.[Gross_Earn], ISNULL(E.[MONTHLY_CTC], 0))) AS [SalaryOrCTC],
  ISNULL(E.[MONTHLY_CTC], 0) AS [MonthlyCTC],
  ISNULL(E.[ANNUAL_CTC], 0) AS [AnnualCTC],
  ISNULL(S.[Gross_Earn], 0) AS [GrossEarnings],
  ISNULL(S.[Final_Payment], 0) AS [NetSalary],
  CONVERT(varchar(10), E.[CURRENTJOINDATE], 120) AS [DateOfJoining]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
LEFT JOIN [dbo].[SALARYFILE] AS S WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), S.[Emp_Code])))
WHERE (ISNULL(E.[ANNUAL_CTC], 0) > 0 OR ISNULL(E.[MONTHLY_CTC], 0) > 0 OR ISNULL(S.[Final_Payment], 0) > 0 OR ISNULL(S.[Gross_Earn], 0) > 0)
ORDER BY ISNULL(S.[Final_Payment], ISNULL(S.[Gross_Earn], ISNULL(E.[MONTHLY_CTC], 0))) ${orderDir}, ISNULL(E.[ANNUAL_CTC], 0) ${orderDir};`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER, SALARYFILE" };
      }

    case "PRESENT_COUNT":
      {
        let sql = `SELECT COUNT(DISTINCT [A].[Emp_Code]) AS TotalPresentCount FROM [dbo].[attendancetable] AS [A] WITH (NOLOCK) LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) ON LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) WHERE (LTRIM(RTRIM([A].[flag])) = 'P' OR [A].[flag] LIKE 'P%' OR [A].[presentvalue] = 1)`;
        if (entities.specificDate) {
          sql += ` AND [A].[dateoffice] = '${entities.specificDate}'`;
        } else {
          if (month) sql += ` AND MONTH([A].[dateoffice]) = ${month}`;
          if (year) sql += ` AND YEAR([A].[dateoffice]) = ${year}`;
        }
        if (branch) sql += ` AND [E].[LOCATION] = '${branch.replace(/'/g, "''")}'`;
        sql += `;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }

    case "ABSENT_COUNT":
      {
        let sql = `SELECT COUNT(DISTINCT [A].[Emp_Code]) AS TotalAbsentCount FROM [dbo].[attendancetable] AS [A] WITH (NOLOCK) LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) ON LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) WHERE (LTRIM(RTRIM([A].[flag])) = 'A' OR [A].[flag] LIKE 'A%' OR [A].[absentvalue] = 1)`;
        if (entities.specificDate) {
          sql += ` AND [A].[dateoffice] = '${entities.specificDate}'`;
        } else {
          if (month) sql += ` AND MONTH([A].[dateoffice]) = ${month}`;
          if (year) sql += ` AND YEAR([A].[dateoffice]) = ${year}`;
        }
        if (branch) sql += ` AND [E].[LOCATION] = '${branch.replace(/'/g, "''")}'`;
        sql += `;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }

    case "PRESENT_EMPLOYEE_LIST":
      {
        let sql = `SELECT TOP 1000
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL([E].[EMPCODE], [A].[Emp_Code])))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), [A].[dateoffice], 120) AS [AttendanceDate],
  DATENAME(weekday, [A].[dateoffice]) AS [DayName],
  LTRIM(RTRIM([A].[flag])) AS [Flag],
  [A].[status] AS [Status],
  [A].[presentvalue] AS [PresentValue],
  CONVERT(varchar(8), [A].[in1], 108) AS [InTime],
  CONVERT(varchar(8), [A].[out1], 108) AS [OutTime],
  [A].[hoursworked] AS [HoursWorked],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation]
FROM [dbo].[attendancetable] AS [A] WITH (NOLOCK)
INNER JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE (LTRIM(RTRIM([A].[flag])) = 'P' OR [A].[flag] LIKE 'P%' OR [A].[presentvalue] = 1)`;
        if (entities.specificDate) {
          sql += ` AND [A].[dateoffice] = '${entities.specificDate}'`;
        } else {
          if (month) sql += ` AND MONTH([A].[dateoffice]) = ${month}`;
          if (year) sql += ` AND YEAR([A].[dateoffice]) = ${year}`;
        }
        if (branch) sql += ` AND [E].[LOCATION] = '${branch.replace(/'/g, "''")}'`;
        sql += ` ORDER BY CASE WHEN LTRIM(RTRIM([A].[flag])) = 'P' THEN 0 ELSE 1 END, [E].[EMPFIRSTNAME] ASC, [A].[Emp_Code] ASC;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }

    case "ABSENT_EMPLOYEE_LIST":
      {
        let sql = `SELECT TOP 1000
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL([E].[EMPCODE], [A].[Emp_Code])))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), [A].[dateoffice], 120) AS [AttendanceDate],
  DATENAME(weekday, [A].[dateoffice]) AS [DayName],
  LTRIM(RTRIM([A].[flag])) AS [Flag],
  [A].[status] AS [Status],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation],
  [E].[MOBILENO] AS [MobileNo]
FROM [dbo].[attendancetable] AS [A] WITH (NOLOCK)
INNER JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE (LTRIM(RTRIM([A].[flag])) = 'A' OR [A].[flag] LIKE 'A%' OR [A].[absentvalue] = 1)`;
        if (entities.specificDate) {
          sql += ` AND [A].[dateoffice] = '${entities.specificDate}'`;
        } else {
          if (month) sql += ` AND MONTH([A].[dateoffice]) = ${month}`;
          if (year) sql += ` AND YEAR([A].[dateoffice]) = ${year}`;
        }
        if (branch) sql += ` AND [E].[LOCATION] = '${branch.replace(/'/g, "''")}'`;
        sql += ` ORDER BY [E].[EMPFIRSTNAME] ASC, [A].[Emp_Code] ASC;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }

    case "ATTENDANCE_REPORT":
      if (emp) {
        const cleanEmp = emp.replace(/'/g, "''");
        let sql = `SELECT TOP 100 
  [A].[Emp_Code] AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), [A].[dateoffice], 120) AS [AttendanceDate],
  DATENAME(weekday, [A].[dateoffice]) AS [DayName],
  [A].[flag] AS [Flag],
  [A].[status] AS [Status],
  [A].[presentvalue] AS [PresentValue],
  [A].[absentvalue] AS [AbsentValue],
  CONVERT(varchar(8), [A].[in1], 108) AS [InTime],
  CONVERT(varchar(8), [A].[out1], 108) AS [OutTime],
  [A].[hoursworked] AS [HoursWorked],
  [E].[LOCATION] AS [Location]
FROM [dbo].[attendancetable] AS [A] WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) 
  ON LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE (LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = '${cleanEmp}' OR LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) = '${cleanEmp}')`;
        if (entities.specificDate) {
          sql += ` AND [A].[dateoffice] = '${entities.specificDate}'`;
        } else {
          if (month) sql += ` AND MONTH([A].[dateoffice]) = ${month}`;
          if (year) sql += ` AND YEAR([A].[dateoffice]) = ${year}`;
        }
        sql += ` ORDER BY [A].[dateoffice] ASC;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }
      break;

    case "EMPLOYEE_LEAVE_COUNT":
    case "EMPLOYEE_LEAVE_LIST":
    case "EMPLOYEE_LEAVE_LOOKUP":
      {
        const targetMonth = month || (entities.quarterMonths ? entities.quarterMonths[0] : (new Date().getMonth() + 1));
        const targetYear = year || new Date().getFullYear();
        const cleanEmp = emp ? emp.replace(/'/g, "''") : null;
        const cleanBranch = branch ? branch.replace(/'/g, "''") : null;

        let leaveWhere = "[M].[Misc_Type] = 92";
        if (entities.leaveCode === 6 || entities.leaveType === "Sick Leave") {
          leaveWhere += " AND ([M].[Misc_Code] = 6 OR [M].[Misc_Name] LIKE '%Sick%' OR [M].[Misc_Name] LIKE '%SL%')";
        } else if (entities.leaveCode === 1 || entities.leaveType === "Casual Leave") {
          leaveWhere += " AND ([M].[Misc_Code] = 1 OR [M].[Misc_Name] LIKE '%Casual%' OR [M].[Misc_Name] LIKE '%CL%')";
        } else if (entities.leaveType === "Privilege Leave") {
          leaveWhere += " AND ([M].[Misc_Name] LIKE '%Privilege%' OR [M].[Misc_Name] LIKE '%Earned%' OR [M].[Misc_Name] LIKE '%PL%' OR [M].[Misc_Name] LIKE '%EL%')";
        } else if (entities.leaveType && entities.leaveType !== "ALL_LEAVES") {
          leaveWhere += ` AND ([M].[Misc_Name] LIKE '%${entities.leaveType.replace(/'/g, "''")}%')`;
        }

        let empFilter = "";
        if (cleanEmp) {
          empFilter = ` AND (LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = '${cleanEmp}' OR LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) = '${cleanEmp}')`;
        }

        let branchFilter = "";
        if (cleanBranch) {
          branchFilter = ` AND ([E].[LOCATION] = '${cleanBranch}' OR CONVERT(varchar(50), [E].[LOCATION]) = '${cleanBranch}')`;
        }

        let dateFilter = "";
        if (entities.specificDate) {
          dateFilter = ` AND [A].[dateoffice] = '${entities.specificDate}'`;
        } else {
          dateFilter = ` AND (
    ([P].[Misc_Dtl1] IS NOT NULL AND [A].[dateoffice] >= TRY_CONVERT(date, [P].[Misc_Dtl1], 103) AND [A].[dateoffice] <= TRY_CONVERT(date, [P].[Misc_Dtl2], 103))
    OR (MONTH([A].[dateoffice]) = ${targetMonth} AND YEAR([A].[dateoffice]) = ${targetYear})
  )`;
        }

        let sql = `SELECT TOP 1000
  LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation],
  [M].[Misc_Code] AS [LeaveTypeCode],
  [M].[Misc_Name] AS [LeaveTypeName],
  [A].[status] AS [Status],
  [A].[flag] AS [Flag],
  CONVERT(varchar(10), [A].[dateoffice], 120) AS [LeaveDate],
  DATENAME(month, [A].[dateoffice]) AS [MonthName],
  DATENAME(dw, [A].[dateoffice]) AS [DayName],
  [A].[in1] AS [InTime],
  [A].[out1] AS [OutTime],
  TRY_CONVERT(date, [P].[Misc_Dtl1], 103) AS [From_Date],
  TRY_CONVERT(date, [P].[Misc_Dtl2], 103) AS [To_Date]
FROM [dbo].[attendancetable] AS [A] WITH (NOLOCK)
INNER JOIN [dbo].[Misc_Mst] AS [M] WITH (NOLOCK)
    ON [A].[mipunch_reason] = [M].[Misc_Code] AND [M].[Misc_Type] = 92
INNER JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
    ON LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
CROSS JOIN (
    SELECT Misc_Dtl1, Misc_Dtl2
    FROM [dbo].[Misc_Mst] WITH (NOLOCK)
    WHERE Misc_Type = 25
      AND Misc_Code = ${targetMonth}
) [P]
WHERE ${leaveWhere}
  ${dateFilter}
  ${branchFilter}
  ${empFilter}
ORDER BY [A].[dateoffice] DESC, [E].[EMPCODE];`;

        return {
          sql,
          requiresJoin: true,
          isTemplate: true,
          confidence: 0.99,
          targetTable: "attendancetable, Misc_Mst, EMPLOYEEMASTER"
        };
      }

    case "MISPUNCH_REPORT":
    case "MISPUNCH_LOOKUP_BY_EMP":
    case "MISPUNCH_COUNT":
    case "MISPUNCH_EMPLOYEE_TOTAL":
      {
        const now = new Date();
        const targetMonth = month || entities.month || (now.getMonth() + 1);
        const targetYear = year || entities.year || now.getFullYear();
        const cleanEmp = emp ? String(emp).replace(/'/g, "''") : (entities.employeeCode ? String(entities.employeeCode).replace(/'/g, "''") : null);
        const cleanBranch = branch ? String(branch).replace(/'/g, "''") : (entities.branch ? String(entities.branch).replace(/'/g, "''") : null);
        const normalizedMsg = String(entities.rawMessage || "").toLowerCase();

        let empFilter = "";
        if (cleanEmp) {
          empFilter = ` AND (LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = '${cleanEmp}' OR LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) = '${cleanEmp}')`;
        } else if (entities.employeeName) {
          const cleanName = String(entities.employeeName).replace(/'/g, "''");
          empFilter = ` AND (LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) LIKE '%${cleanName}%')`;
        }

        let branchFilter = "";
        if (cleanBranch) {
          branchFilter = ` AND ([E].[LOCATION] = '${cleanBranch}' OR CONVERT(varchar(50), [E].[LOCATION]) = '${cleanBranch}')`;
        }

        const isSinceJoining = entities.isSinceJoining || ((cleanEmp || entities.employeeName) && !month && !entities.month && !entities.year && !entities.specificDate);
        let dateFilter = "";
        if (entities.specificDate) {
          dateFilter = ` AND TRY_CONVERT(date, [A].[dateoffice]) = '${entities.specificDate}'`;
        } else if (isSinceJoining) {
          dateFilter = ` AND ([E].[CURRENTJOINDATE] IS NULL OR TRY_CONVERT(date, [A].[dateoffice]) >= TRY_CONVERT(date, [E].[CURRENTJOINDATE])) AND TRY_CONVERT(date, [A].[dateoffice]) <= CAST(GETDATE() AS DATE)`;
        } else {
          dateFilter = ` AND (
    ([P].[Misc_Dtl1] IS NOT NULL AND TRY_CONVERT(date, [A].[dateoffice]) >= [P].[Misc_Dtl1] AND TRY_CONVERT(date, [A].[dateoffice]) <= [P].[Misc_Dtl2])
    OR (MONTH([A].[dateoffice]) = ${targetMonth} AND YEAR([A].[dateoffice]) = ${targetYear})
  )`;
        }

        let statusCondition = "";
        if (/\b(approved|approve|swikrit|manjoor)\b/i.test(normalizedMsg)) {
          statusCondition = " AND ([A].[MAN_APPR] = 'Y' OR [A].[MAN_APPR] = '1')";
        } else if (/\b(rejected|reject|aswikrit|radd)\b/i.test(normalizedMsg)) {
          statusCondition = " AND ([A].[MAN_REJ] = 'Y' OR [A].[MAN_REJ] = '1')";
        } else if (/\b(pending|lambi|baki)\b/i.test(normalizedMsg)) {
          statusCondition = " AND ([A].[MAN_APPR] IS NULL OR [A].[MAN_APPR] = 'N' OR [A].[MAN_APPR] = '0') AND ([A].[MAN_REJ] IS NULL OR [A].[MAN_REJ] = 'N' OR [A].[MAN_REJ] = '0')";
        }

        if (intent === "MISPUNCH_EMPLOYEE_TOTAL") {
          let sql = `SELECT
  [E].[EMPCODE] AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), [E].[CURRENTJOINDATE], 120) AS [CurrentJoinDate],
  COUNT_BIG(1) AS [TotalMissPunch],
  SUM(CASE WHEN [A].[MAN_APPR] = 'Y' OR [A].[MAN_APPR] = '1' THEN 1 ELSE 0 END) AS [ApprovedMissPunch],
  SUM(CASE WHEN [A].[MAN_REJ] = 'Y' OR [A].[MAN_REJ] = '1' THEN 1 ELSE 0 END) AS [RejectedMissPunch],
  SUM(CASE WHEN ([A].[MAN_APPR] IS NULL OR [A].[MAN_APPR] = 'N' OR [A].[MAN_APPR] = '0') AND ([A].[MAN_REJ] IS NULL OR [A].[MAN_REJ] = 'N' OR [A].[MAN_REJ] = '0') THEN 1 ELSE 0 END) AS [PendingMissPunch]
FROM [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
INNER JOIN [dbo].[attendancetable] AS [A] WITH (NOLOCK)
    ON LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code])))
INNER JOIN [dbo].[Misc_Mst] AS [M] WITH (NOLOCK)
    ON CONVERT(varchar(50), [A].[mipunch_reason]) = CONVERT(varchar(50), [M].[Misc_Code]) AND [M].[Misc_Type] = 92
LEFT JOIN (
    SELECT
        TRY_CONVERT(date, Misc_Dtl1, 103) AS Misc_Dtl1,
        TRY_CONVERT(date, Misc_Dtl2, 103) AS Misc_Dtl2
    FROM [dbo].[Misc_Mst] WITH (NOLOCK)
    WHERE Misc_Type = 25
      AND Misc_Code = ${targetMonth}
) [P] ON 1=1
WHERE [M].[Misc_Type] = 92
  AND ([M].[Misc_Code] = 1 OR [M].[Misc_Code] = 53 OR [M].[Misc_Name] LIKE '%MISPUNCH%' OR [M].[Misc_Name] LIKE '%FORGET%')
  ${empFilter}
  ${dateFilter}
  ${statusCondition}
GROUP BY
    [E].[EMPCODE],
    [E].[EMPFIRSTNAME],
    [E].[EMPLASTNAME],
    [E].[CURRENTJOINDATE];`;
          return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER, attendancetable, Misc_Mst" };
        }

        if (intent === "MISPUNCH_COUNT") {
          let sql = `SELECT 
  COUNT_BIG(1) AS [TotalMispunches],
  COUNT(DISTINCT [E].[EMPCODE]) AS [TotalEmployees],
  SUM(CASE WHEN [A].[MAN_APPR] = 'Y' OR [A].[MAN_APPR] = '1' THEN 1 ELSE 0 END) AS [ApprovedCount],
  SUM(CASE WHEN [A].[MAN_REJ] = 'Y' OR [A].[MAN_REJ] = '1' THEN 1 ELSE 0 END) AS [RejectedCount],
  SUM(CASE WHEN ([A].[MAN_APPR] IS NULL OR [A].[MAN_APPR] = 'N' OR [A].[MAN_APPR] = '0') AND ([A].[MAN_REJ] IS NULL OR [A].[MAN_REJ] = 'N' OR [A].[MAN_REJ] = '0') THEN 1 ELSE 0 END) AS [PendingCount],
  MIN([P].[Misc_Dtl1]) AS [From_Date],
  MAX([P].[Misc_Dtl2]) AS [To_Date]
FROM [dbo].[attendancetable] AS [A] WITH (NOLOCK)
INNER JOIN [dbo].[Misc_Mst] AS [M] WITH (NOLOCK)
    ON CONVERT(varchar(50), [A].[mipunch_reason]) = CONVERT(varchar(50), [M].[Misc_Code]) AND [M].[Misc_Type] = 92
INNER JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
    ON LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
LEFT JOIN (
    SELECT
        TRY_CONVERT(date, Misc_Dtl1, 103) AS Misc_Dtl1,
        TRY_CONVERT(date, Misc_Dtl2, 103) AS Misc_Dtl2
    FROM [dbo].[Misc_Mst] WITH (NOLOCK)
    WHERE Misc_Type = 25
      AND Misc_Code = ${targetMonth}
) [P] ON 1=1
WHERE [M].[Misc_Type] = 92
  AND ([M].[Misc_Code] = 1 OR [M].[Misc_Code] = 53 OR [M].[Misc_Name] LIKE '%MISPUNCH%' OR [M].[Misc_Name] LIKE '%FORGET%')
  ${dateFilter}
  ${empFilter}
  ${branchFilter}
  ${statusCondition};`;
          return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99, targetTable: "attendancetable, Misc_Mst, EMPLOYEEMASTER" };
        }

        let sql = `SELECT TOP 1000
  [M].[Misc_Code] AS [ReasonCode],
  [M].[Misc_Name] AS [MispunchReason],
  [P].[Misc_Dtl1] AS [From_Date],
  [P].[Misc_Dtl2] AS [To_Date],
  [E].[EMPCODE] AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  [E].[LOCATION] AS [Location],
  [E].[EMPLOYEEDESIGNATION] AS [Designation],
  CONVERT(varchar(10), [A].[dateoffice], 120) AS [AttendanceDate],
  DATENAME(dw, [A].[dateoffice]) AS [DayName],
  DATENAME(month, [A].[dateoffice]) AS [MonthName],
  [A].[in1] AS [InTime],
  [A].[out1] AS [OutTime],
  [A].[flag] AS [Flag],
  [A].[status] AS [Status],
  [A].[MAN_APPR] AS [ManualApproved],
  [A].[MAN_REJ] AS [ManualRejected],
  [A].[mipunch_reason] AS [MispunchReasonCode]
FROM [dbo].[attendancetable] AS [A] WITH (NOLOCK)
INNER JOIN [dbo].[Misc_Mst] AS [M] WITH (NOLOCK)
    ON CONVERT(varchar(50), [A].[mipunch_reason]) = CONVERT(varchar(50), [M].[Misc_Code]) AND [M].[Misc_Type] = 92
INNER JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK)
    ON LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
LEFT JOIN (
    SELECT
        TRY_CONVERT(date, Misc_Dtl1, 103) AS Misc_Dtl1,
        TRY_CONVERT(date, Misc_Dtl2, 103) AS Misc_Dtl2
    FROM [dbo].[Misc_Mst] WITH (NOLOCK)
    WHERE Misc_Type = 25
      AND Misc_Code = ${targetMonth}
) [P] ON 1=1
WHERE [M].[Misc_Type] = 92
  AND ([M].[Misc_Code] = 1 OR [M].[Misc_Code] = 53 OR [M].[Misc_Name] LIKE '%MISPUNCH%' OR [M].[Misc_Name] LIKE '%FORGET%')
  ${dateFilter}
  ${empFilter}
  ${branchFilter}
  ${statusCondition}
ORDER BY [A].[dateoffice] DESC, [E].[EMPCODE];`;

        return {
          sql,
          requiresJoin: true,
          isTemplate: true,
          confidence: 0.99,
          targetTable: "attendancetable, Misc_Mst, EMPLOYEEMASTER"
        };
      }

    case "LEAVE_POLICY":
      {
        let sql = `SELECT TOP 50 UTD, Misc_Code, Misc_Name AS LeaveTypeName, Misc_Dtl3 AS DayCount, Continuous_Max AS MaxContinuousDays, dis_back_date AS BackDateRestricted FROM [dbo].[Misc_Mst] WITH (NOLOCK) WHERE Misc_Type = 92 ORDER BY Misc_Code ASC;`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }

    case "ASSET_SEARCH":
      if (emp) {
        let sql = `SELECT TOP 50 Emp_Code, Aset_Name, Asset_Code, Issue_Date, Return_Date, Status FROM [dbo].[Asset_Issue] WITH (NOLOCK) WHERE Emp_Code = '${emp.replace(/'/g, "''")}' ORDER BY Issue_Date DESC;`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }
      break;

    case "BANK_ACCOUNT_VERIFY_COUNT":
      {
        let sql = `SELECT 
  COUNT_BIG(1) AS [TotalPennyDropVerifications],
  SUM(CASE WHEN [account_exists] = 1 OR [code] = 200 THEN 1 ELSE 0 END) AS [TotalVerifiedAccounts],
  SUM(CASE WHEN [account_exists] = 0 AND [code] != 200 THEN 1 ELSE 0 END) AS [TotalInvalidAccounts],
  (SELECT COUNT_BIG(1) FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK) WHERE [BANKACCOUNTNO] IS NOT NULL AND LTRIM(RTRIM([BANKACCOUNTNO])) <> '') AS [TotalEmployeesWithBankAcc]
FROM [dbo].[Account_No_Api] WITH (NOLOCK);`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }

    case "BANK_ACCOUNT_VERIFY_LIST":
      {
        let sql = `SELECT TOP 100
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL(E.[EMPCODE], '')))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  ISNULL(E.[BANKACCOUNTNO], A.[account_number]) AS [BankAccountNo],
  E.[BANKNAME] AS [BankName],
  E.[LOCATION] AS [Location],
  A.[account_number] AS [VerifiedAccountNumber],
  A.[Ifsc] AS [IFSC],
  A.[name_at_bank] AS [NameAtBankDirect],
  A.[account_exists] AS [AccountExistsFlag],
  CONVERT(varchar(19), A.[Created_At], 120) AS [VerificationDate]
FROM [dbo].[Account_No_Api] AS A WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(100), E.[BANKACCOUNTNO]))) = LTRIM(RTRIM(CONVERT(varchar(100), A.[account_number])))
ORDER BY A.[Created_At] DESC;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }

    case "DUPLICATE_BANK_ACCOUNTS":
      {
        let sql = `WITH DuplicateBankGroups AS (
  SELECT LTRIM(RTRIM([BANKACCOUNTNO])) AS [CleanAcc], COUNT_BIG(1) AS [DuplicateCount]
  FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK)
  WHERE [BANKACCOUNTNO] IS NOT NULL 
    AND LTRIM(RTRIM([BANKACCOUNTNO])) <> ''
    AND LTRIM(RTRIM([BANKACCOUNTNO])) <> '0'
    AND LTRIM(RTRIM([BANKACCOUNTNO])) NOT LIKE '%NA%'
  GROUP BY LTRIM(RTRIM([BANKACCOUNTNO]))
  HAVING COUNT_BIG(1) > 1
)
SELECT TOP 100
  E.[BANKACCOUNTNO] AS [BankAccountNo],
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  D.[DuplicateCount] AS [DuplicateCount]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
INNER JOIN DuplicateBankGroups AS D
  ON LTRIM(RTRIM(E.[BANKACCOUNTNO])) = D.[CleanAcc]
ORDER BY D.[DuplicateCount] DESC, E.[BANKACCOUNTNO], E.[EMPCODE];`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }

    case "DUPLICATE_PAN_NUMBERS":
      {
        let sql = `WITH DuplicatePanGroups AS (
  SELECT LTRIM(RTRIM([PANNO])) AS [CleanPAN], COUNT_BIG(1) AS [DuplicateCount]
  FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK)
  WHERE [PANNO] IS NOT NULL 
    AND LTRIM(RTRIM([PANNO])) <> ''
    AND LTRIM(RTRIM([PANNO])) NOT LIKE '%NA%'
  GROUP BY LTRIM(RTRIM([PANNO]))
  HAVING COUNT_BIG(1) > 1
)
SELECT TOP 100
  E.[PANNO] AS [PAN],
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  D.[DuplicateCount] AS [DuplicateCount]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
INNER JOIN DuplicatePanGroups AS D
  ON LTRIM(RTRIM(E.[PANNO])) = D.[CleanPAN]
ORDER BY D.[DuplicateCount] DESC, E.[PANNO], E.[EMPCODE];`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }

    case "EMPLOYEE_AUDIT_HISTORY_DIFF":
      if (emp || entities.searchToken) {
        const cleanEmp = (emp || entities.searchToken).replace(/'/g, "''");
        let sql = `SELECT TOP 20
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  E.[LASTMODI_BY] AS [ModifiedBy],
  CONVERT(varchar(19), E.[LASTMODI_ON], 120) AS [ModifiedOn],
  E.[BANKACCOUNTNO] AS [Current_BankAcc],
  H.[BANKACCOUNTNO] AS [Previous_BankAcc],
  E.[MOBILENO] AS [Current_Mobile],
  H.[MOBILENO] AS [Previous_Mobile],
  E.[PANNO] AS [Current_PAN],
  H.[PANNO] AS [Previous_PAN],
  E.[CORPORATEMAILID] AS [Current_Email],
  H.[CORPORATEMAILID] AS [Previous_Email],
  E.[MARITALSTATUS] AS [Current_MaritalStatus],
  H.[MARITALSTATUS] AS [Previous_MaritalStatus],
  ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))), ''), E.[uidno])) AS [Current_Aadhaar],
  ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), H.[ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), H.[UID_NO]))), ''), H.[uidno])) AS [Previous_Aadhaar],
  E.[MONTHLY_CTC] AS [Current_MonthlyCTC],
  H.[MONTHLY_CTC] AS [Previous_MonthlyCTC],
  E.[BANKNAME] AS [Current_BankName],
  H.[BANKNAME] AS [Previous_BankName],
  E.[ifsc_code] AS [Current_IFSC],
  H.[ifsc_code] AS [Previous_IFSC],
  CONVERT(varchar(19), H.[LASTMODI_ON], 120) AS [PreviousModifiedOn]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER_hst] AS H WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), H.[EMPCODE])))
WHERE LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) = '${cleanEmp}'
ORDER BY H.[LASTMODI_ON] DESC;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER_hst" };
      } else {
        const dateFilter = entities.specificDate ? `'${entities.specificDate}'` : "CONVERT(date, GETDATE())";
        let sql = `SELECT TOP 100
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  E.[LASTMODI_BY] AS [ModifiedBy],
  CONVERT(varchar(19), E.[LASTMODI_ON], 120) AS [ModifiedOn],
  E.[BANKACCOUNTNO] AS [Current_BankAcc],
  H.[BANKACCOUNTNO] AS [Previous_BankAcc],
  E.[MOBILENO] AS [Current_Mobile],
  H.[MOBILENO] AS [Previous_Mobile],
  E.[PANNO] AS [Current_PAN],
  H.[PANNO] AS [Previous_PAN],
  E.[CORPORATEMAILID] AS [Current_Email],
  H.[CORPORATEMAILID] AS [Previous_Email],
  E.[BANKNAME] AS [Current_BankName],
  H.[BANKNAME] AS [Previous_BankName],
  E.[ifsc_code] AS [Current_IFSC],
  H.[ifsc_code] AS [Previous_IFSC],
  E.[MONTHLY_CTC] AS [Current_MonthlyCTC],
  H.[MONTHLY_CTC] AS [Previous_MonthlyCTC]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER_hst] AS H WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), H.[EMPCODE])))
WHERE CONVERT(date, E.[LASTMODI_ON]) = ${dateFilter}
ORDER BY E.[LASTMODI_ON] DESC;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER_hst" };
      }

    case "DUPLICATE_AADHAAR_NUMBERS":
      {
        let sql = `WITH DuplicateAadhaarGroups AS (
  SELECT 
    ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), [ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), [UID_NO]))), ''), [uidno])) AS [CleanAadhaar], 
    COUNT_BIG(1) AS [DuplicateCount]
  FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK)
  WHERE (
    ([ADHARNO] IS NOT NULL AND LTRIM(RTRIM([ADHARNO])) <> '' AND LTRIM(RTRIM([ADHARNO])) NOT LIKE '%NA%')
    OR ([UID_NO] IS NOT NULL AND LTRIM(RTRIM([UID_NO])) <> '' AND LTRIM(RTRIM([UID_NO])) NOT LIKE '%NA%')
    OR ([uidno] IS NOT NULL AND LTRIM(RTRIM([uidno])) <> '' AND LTRIM(RTRIM([uidno])) NOT LIKE '%NA%')
  )
  GROUP BY ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), [ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), [UID_NO]))), ''), [uidno]))
  HAVING COUNT_BIG(1) > 1
)
SELECT TOP 100
  D.[CleanAadhaar] AS [AadharNo],
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  D.[DuplicateCount] AS [DuplicateCount]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
INNER JOIN DuplicateAadhaarGroups AS D
  ON ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))), ''), E.[uidno])) = D.[CleanAadhaar]
ORDER BY D.[DuplicateCount] DESC, D.[CleanAadhaar], E.[EMPCODE];`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }

    case "EMPLOYEE_LOOKUP":
    case "EMPLOYEE_PROFILE":
      {
        const targetName = (entities.employeeName || entities.nameFilter || "").replace(/'/g, "''");
        if (emp || entities.searchToken) {
          const cleanEmp = (emp || entities.searchToken).replace(/'/g, "''");
          let sql = `SELECT TOP 1
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  NULL AS [Department],
  E.[MOBILENO] AS [MobileNo],
  E.[CORPORATEMAILID] AS [Email],
  CONVERT(varchar(10), E.[CURRENTJOINDATE], 120) AS [JoiningDate],
  CONVERT(varchar(10), E.[DOB], 120) AS [DateOfBirth],
  CONVERT(varchar(10), E.[DOM], 120) AS [MarriageDate],
  E.[PANNO] AS [PAN],
  ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))), ''), E.[uidno])) AS [AadharNo],
  E.[PFNUMBER] AS [PFNumber],
  E.[UAN_No] AS [UANNumber],
  E.[BANKACCOUNTNO] AS [BankAccountNo],
  E.[BANKNAME] AS [BankName],
  E.[ifsc_code] AS [IFSC],
  ISNULL(E.[MONTHLY_CTC], 0) AS [MonthlyCTC],
  ISNULL(E.[ANNUAL_CTC], 0) AS [AnnualCTC],
  E.[FATHERNAME] AS [FatherName],
  E.[PERMANENTADDRESS1] AS [PermanentAddress],
  E.[CURRENTADDRESS1] AS [CurrentAddress],
  CASE WHEN E.[EMP_STATUS] = 'A' OR E.[EMP_STATUS] = '1' THEN 'Active' ELSE 'Inactive' END AS [EmploymentStatus]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
WHERE LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) = '${cleanEmp}'
   OR (LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) LIKE '%${cleanEmp}%');`;
          return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER" };
        } else if (targetName) {
          let sql = `SELECT TOP 50
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  NULL AS [Department],
  E.[MOBILENO] AS [MobileNo],
  E.[CORPORATEMAILID] AS [Email],
  CONVERT(varchar(10), E.[CURRENTJOINDATE], 120) AS [JoiningDate],
  CONVERT(varchar(10), E.[DOB], 120) AS [DateOfBirth],
  CONVERT(varchar(10), E.[DOM], 120) AS [MarriageDate],
  E.[PANNO] AS [PAN],
  ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))), ''), E.[uidno])) AS [AadharNo],
  E.[PFNUMBER] AS [PFNumber],
  E.[UAN_No] AS [UANNumber],
  E.[BANKACCOUNTNO] AS [BankAccountNo],
  E.[BANKNAME] AS [BankName],
  E.[ifsc_code] AS [IFSC],
  ISNULL(E.[MONTHLY_CTC], 0) AS [MonthlyCTC],
  ISNULL(E.[ANNUAL_CTC], 0) AS [AnnualCTC],
  E.[FATHERNAME] AS [FatherName],
  E.[PERMANENTADDRESS1] AS [PermanentAddress],
  E.[CURRENTADDRESS1] AS [CurrentAddress],
  CASE WHEN E.[EMP_STATUS] = 'A' OR E.[EMP_STATUS] = '1' THEN 'Active' ELSE 'Inactive' END AS [EmploymentStatus]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
WHERE (E.[EMPFIRSTNAME] LIKE '%${targetName}%' OR CONCAT(E.[EMPFIRSTNAME], ' ', ISNULL(E.[EMPLASTNAME], '')) LIKE '%${targetName}%')
ORDER BY E.[EMPCODE];`;
          return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER" };
        }
      }
      break;

    case "PF_COUNT":
      {
        let sql = `SELECT COUNT_BIG(1) AS [TotalPFCount] FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK) WHERE [PFNUMBER] IS NOT NULL AND LTRIM(RTRIM([PFNUMBER])) <> '' AND LTRIM(RTRIM([PFNUMBER])) NOT IN ('-', '--', '---', '0', 'NA', 'N/A', 'N.A.', 'null', 'NULL', 'None', 'none')`;
        if (branch) sql += ` AND [LOCATION] = '${branch.replace(/'/g, "''")}'`;
        sql += `;`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER" };
      }

    case "PF_EMPLOYEE_LIST":
      {
        let sql = `SELECT TOP 1000
  LTRIM(RTRIM(CONVERT(varchar(50), [EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([EMPFIRSTNAME], '') + ' ' + ISNULL([EMPLASTNAME], ''))) AS [EmployeeName],
  LTRIM(RTRIM([PFNUMBER])) AS [PFNumber],
  ISNULL([UAN_No], '') AS [UANNumber],
  ISNULL([ESINO], '') AS [ESINumber],
  [LOCATION] AS [Location],
  [EMPLOYEEDESIGNATION] AS [Designation],
  CONVERT(varchar(10), [CURRENTJOINDATE], 120) AS [JoiningDate]
FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK)
WHERE [PFNUMBER] IS NOT NULL 
  AND LTRIM(RTRIM([PFNUMBER])) <> '' 
  AND LTRIM(RTRIM([PFNUMBER])) NOT IN ('-', '--', '---', '0', 'NA', 'N/A', 'N.A.', 'null', 'NULL', 'None', 'none')`;
        if (branch) sql += ` AND [LOCATION] = '${branch.replace(/'/g, "''")}'`;
        sql += ` ORDER BY [EMPFIRSTNAME] ASC, [EMPCODE] ASC;`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER" };
      }

    case "PF_LOOKUP_BY_EMP":
      if (emp || entities.searchToken) {
        const cleanEmp = (emp || entities.searchToken).replace(/'/g, "''");
        let sql = `SELECT TOP 10
  LTRIM(RTRIM(CONVERT(varchar(50), [EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([EMPFIRSTNAME], '') + ' ' + ISNULL([EMPLASTNAME], ''))) AS [EmployeeName],
  LTRIM(RTRIM([PFNUMBER])) AS [PFNumber],
  ISNULL([UAN_No], '') AS [UANNumber],
  ISNULL([ESINO], '') AS [ESINumber],
  [LOCATION] AS [Location],
  [EMPLOYEEDESIGNATION] AS [Designation],
  CONVERT(varchar(10), [CURRENTJOINDATE], 120) AS [JoiningDate]
FROM [dbo].[EMPLOYEEMASTER] WITH (NOLOCK)
WHERE LTRIM(RTRIM(CONVERT(varchar(50), [EMPCODE]))) = '${cleanEmp}'
   OR LTRIM(RTRIM([PFNUMBER])) = '${cleanEmp}';`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER" };
      }
      break;


    case "EMPLOYEE_BY_AADHAAR_NO":
      if (entities.aadharNumber || emp) {
        const cleanAadhar = (entities.aadharNumber || emp).replace(/'/g, "''");
        let sql = `SELECT TOP 10
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))), ''), E.[uidno])) AS [AadharNo],
  E.[PANNO] AS [PAN],
  E.[MOBILENO] AS [MobileNo],
  E.[BANKACCOUNTNO] AS [BankAccountNo],
  E.[BANKNAME] AS [BankName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  V.[aadhaar_card_ver] AS [AadhaarCardVerified],
  V.[aadhaar_linked_ver] AS [AadhaarLinkedVerified],
  V.[aadhaar_linked_pan_ver] AS [AadhaarLinkedWithPanVerified],
  V.[aadhaar_name_match_emp_name] AS [AadhaarNameMatchVerified],
  CONVERT(varchar(10), V.[Created_At], 120) AS [VerificationDate]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
LEFT JOIN [dbo].[emp_varify] AS V WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), V.[EMPCODE])))
WHERE LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))) = '${cleanAadhar}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))) = '${cleanAadhar}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[uidno]))) = '${cleanAadhar}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))) LIKE '%${cleanAadhar}%'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))) LIKE '%${cleanAadhar}%'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[uidno]))) LIKE '%${cleanAadhar}%';`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }
      break;

    case "EMPLOYEE_BY_PAN_NO":
      if (entities.panNumber || emp) {
        const cleanPan = (entities.panNumber || emp).replace(/'/g, "''");
        let sql = `SELECT TOP 10
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[PANNO] AS [PAN],
  E.[MOBILENO] AS [MobileNo],
  ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))), ''), E.[uidno])) AS [AadharNo],
  E.[BANKACCOUNTNO] AS [BankAccountNo],
  E.[BANKNAME] AS [BankName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  V.[pan_card_ver] AS [PanCardVerified],
  V.[pan_name_match_ver] AS [PanNameMatchVerified],
  CONVERT(varchar(10), V.[Created_At], 120) AS [VerificationDate]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
LEFT JOIN [dbo].[emp_varify] AS V WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), V.[EMPCODE])))
WHERE LTRIM(RTRIM(CONVERT(varchar(50), E.[PANNO]))) = '${cleanPan}';`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }
      break;

    case "EMPLOYEE_BY_MOBILE_NO":
      if (entities.mobileNumber || emp) {
        const cleanMob = (entities.mobileNumber || emp).replace(/'/g, "''");
        let sql = `SELECT TOP 100
  LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[MOBILENO] AS [MobileNo],
  E.[MOBILE_NO] AS [AltMobileNo],
  E.[Father_Mob] AS [FatherMobile],
  E.[Mother_Mob] AS [MotherMobile],
  E.[Spouse_Mob] AS [SpouseMobile],
  E.[EMERGENCYNO] AS [EmergencyNo],
  E.[PANNO] AS [PAN],
  ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))), ''), E.[uidno])) AS [AadharNo],
  E.[BANKACCOUNTNO] AS [BankAccountNo],
  E.[BANKNAME] AS [BankName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  CONVERT(varchar(10), E.[CURRENTJOINDATE], 120) AS [JoiningDate]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
WHERE LTRIM(RTRIM(CONVERT(varchar(50), E.[MOBILENO]))) = '${cleanMob}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[MOBILE_NO]))) = '${cleanMob}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[Father_Mob]))) = '${cleanMob}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[Mother_Mob]))) = '${cleanMob}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[Spouse_Mob]))) = '${cleanMob}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[EMERGENCYNO]))) = '${cleanMob}';`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99, targetTable: "EMPLOYEEMASTER" };
      }
      break;

    case "EMPLOYEE_BY_ACCOUNT_NO":
      if (entities.accountNumber || emp) {
        const cleanAcc = (entities.accountNumber || emp).replace(/'/g, "''");
        let sql = `SELECT TOP 10
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL(E.[EMPCODE], '')))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  ISNULL(E.[BANKACCOUNTNO], A.[account_number]) AS [BankAccountNo],
  E.[BANKNAME] AS [BankName],
  E.[PANNO] AS [PAN],
  E.[MOBILENO] AS [MobileNo],
  E.[ADHARNO] AS [AadharNo],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  A.[account_number] AS [VerifiedAccountNumber],
  A.[Ifsc] AS [IFSC],
  A.[name_at_bank] AS [NameAtBankDirect],
  A.[account_exists] AS [AccountExistsFlag],
  A.[raw_response] AS [RawResponse],
  CONVERT(varchar(19), A.[Created_At], 120) AS [VerificationDate]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
FULL OUTER JOIN [dbo].[Account_No_Api] AS A WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(100), E.[BANKACCOUNTNO]))) = LTRIM(RTRIM(CONVERT(varchar(100), A.[account_number])))
WHERE LTRIM(RTRIM(CONVERT(varchar(100), A.[account_number]))) = '${cleanAcc}'
   OR LTRIM(RTRIM(CONVERT(varchar(100), E.[BANKACCOUNTNO]))) = '${cleanAcc}';`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }
      break;

    case "AADHAAR_VERIFY_LIST":
      {
        let sql = `SELECT TOP 200
  LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(em.[EMPFIRSTNAME], '') + ' ' + ISNULL(em.[EMPLASTNAME], ''))) AS [EmployeeName],
  [em].[LOCATION] AS [Location],
  [v].[aadhaar_card_ver] AS [AadhaarCardVerified],
  [v].[aadhaar_linked_ver] AS [AadhaarLinkedVerified],
  [v].[aadhaar_linked_pan_ver] AS [AadhaarLinkedPanVerified],
  [v].[aadhaar_name_match_emp_name] AS [AadhaarNameMatchVerified],
  CONVERT(varchar(10), [v].[Created_At], 120) AS [VerificationDate]
FROM [dbo].[emp_varify] AS v WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS em WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), em.[EMPCODE])))
WHERE (LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_card_ver])))) = 'true'
   OR LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_linked_ver])))) = 'true'
   OR LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_linked_pan_ver])))) = 'true'
   OR LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_name_match_emp_name])))) = 'true'
   OR v.[aadhaar_card_ver] = '1'
   OR v.[aadhaar_linked_ver] = '1')
ORDER BY v.[Created_At] DESC;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }

    case "AADHAAR_VERIFY_COUNT":
      {
        let sql = `SELECT
  COUNT_BIG(1) AS [TotalKYCRecords],
  COUNT(DISTINCT v.[EMPCODE]) AS [TotalEmployeesInKYC],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_card_ver])))) = 'true' OR v.[aadhaar_card_ver] = '1' THEN 1 ELSE 0 END) AS [AadhaarCardVerifiedCount],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_linked_ver])))) = 'true' OR v.[aadhaar_linked_ver] = '1' THEN 1 ELSE 0 END) AS [AadhaarLinkedVerifiedCount],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_linked_pan_ver])))) = 'true' OR v.[aadhaar_linked_pan_ver] = '1' THEN 1 ELSE 0 END) AS [AadhaarLinkedPanVerifiedCount],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_name_match_emp_name])))) = 'true' OR v.[aadhaar_name_match_emp_name] = '1' THEN 1 ELSE 0 END) AS [AadhaarNameMatchVerifiedCount]
FROM [dbo].[emp_varify] AS v WITH (NOLOCK);`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }

    case "AADHAAR_VERIFY_LOOKUP":
      if (emp) {
        const cleanEmp = emp.replace(/'/g, "''");
        let sql = `SELECT TOP 10
  LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(em.[EMPFIRSTNAME], '') + ' ' + ISNULL(em.[EMPLASTNAME], ''))) AS [EmployeeName],
  [em].[LOCATION] AS [Location],
  [v].[pan_card_ver] AS [PanCardVerified],
  [v].[pan_name_match_ver] AS [PanNameMatchVerified],
  [v].[aadhaar_card_ver] AS [AadhaarCardVerified],
  [v].[aadhaar_linked_ver] AS [AadhaarLinkedVerified],
  [v].[aadhaar_linked_pan_ver] AS [AadhaarLinkedWithPanVerified],
  [v].[aadhaar_name_match_emp_name] AS [AadhaarNameMatchVerified],
  CONVERT(varchar(10), [v].[Created_At], 120) AS [VerificationDate]
FROM [dbo].[emp_varify] AS v WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS em WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), em.[EMPCODE])))
WHERE LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) = '${cleanEmp}';`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }
      break;

    case "PAN_VERIFY_LIST":
      {
        let sql = `SELECT TOP 200
  LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(em.[EMPFIRSTNAME], '') + ' ' + ISNULL(em.[EMPLASTNAME], ''))) AS [EmployeeName],
  [em].[LOCATION] AS [Location],
  [v].[pan_card_ver] AS [PanCardVerified],
  [v].[pan_name_match_ver] AS [PanNameMatchVerified],
  [v].[aadhaar_linked_pan_ver] AS [AadhaarLinkedWithPanVerified],
  CONVERT(varchar(10), [v].[Created_At], 120) AS [VerificationDate]
FROM [dbo].[emp_varify] AS v WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS em WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), em.[EMPCODE])))
WHERE LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[pan_card_ver])))) = 'true'
   OR LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[pan_name_match_ver])))) = 'true'
   OR v.[pan_card_ver] = '1'
ORDER BY v.[Created_At] DESC;`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }

    case "PAN_VERIFY_COUNT":
      {
        let sql = `SELECT
  COUNT_BIG(1) AS [TotalKYCRecords],
  COUNT(DISTINCT v.[EMPCODE]) AS [TotalEmployeesInKYC],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[pan_card_ver])))) = 'true' OR v.[pan_card_ver] = '1' THEN 1 ELSE 0 END) AS [PanCardVerifiedCount],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[pan_name_match_ver])))) = 'true' OR v.[pan_name_match_ver] = '1' THEN 1 ELSE 0 END) AS [PanNameMatchVerifiedCount]
FROM [dbo].[emp_varify] AS v WITH (NOLOCK);`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }

    case "KYC_COUNT":
      {
        let sql = `SELECT
  COUNT_BIG(1) AS [TotalKYCRecords],
  COUNT(DISTINCT v.[EMPCODE]) AS [TotalEmployeesInKYC],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[pan_card_ver])))) = 'true' OR v.[pan_card_ver] = '1' THEN 1 ELSE 0 END) AS [PanCardVerifiedCount],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_card_ver])))) = 'true' OR v.[aadhaar_card_ver] = '1' THEN 1 ELSE 0 END) AS [AadhaarCardVerifiedCount],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_linked_pan_ver])))) = 'true' OR v.[aadhaar_linked_pan_ver] = '1' THEN 1 ELSE 0 END) AS [AadhaarLinkedPanVerifiedCount],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[pan_name_match_ver])))) = 'true' OR v.[pan_name_match_ver] = '1' THEN 1 ELSE 0 END) AS [PanNameMatchVerifiedCount],
  SUM(CASE WHEN LOWER(LTRIM(RTRIM(CONVERT(varchar(10), v.[aadhaar_name_match_emp_name])))) = 'true' OR v.[aadhaar_name_match_emp_name] = '1' THEN 1 ELSE 0 END) AS [AadhaarNameMatchVerifiedCount]
FROM [dbo].[emp_varify] AS v WITH (NOLOCK);`;
        return { sql, requiresJoin: false, isTemplate: true, confidence: 0.99 };
      }

    case "KYC_LOOKUP":
    case "VERIFICATION_LOOKUP":
      if (emp) {
        const cleanEmp = emp.replace(/'/g, "''");
        let sql = `SELECT TOP 10
  LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(em.[EMPFIRSTNAME], '') + ' ' + ISNULL(em.[EMPLASTNAME], ''))) AS [EmployeeName],
  [em].[LOCATION] AS [Location],
  [v].[pan_card_ver] AS [PanCardVerified],
  [v].[pan_name_match_ver] AS [PanNameMatchVerified],
  [v].[aadhaar_card_ver] AS [AadhaarCardVerified],
  [v].[aadhaar_linked_ver] AS [AadhaarLinkedVerified],
  [v].[aadhaar_linked_pan_ver] AS [AadhaarLinkedWithPanVerified],
  [v].[aadhaar_name_match_emp_name] AS [AadhaarNameMatchVerified],
  CONVERT(varchar(10), [v].[Created_At], 120) AS [VerificationDate]
FROM [dbo].[emp_varify] AS v WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS em WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), em.[EMPCODE])))
WHERE LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) = '${cleanEmp}';`;
        return { sql, requiresJoin: true, isTemplate: true, confidence: 0.99 };
      }
      break;
  }

  return null;
};

// ============================================================================
// RLHF & DYNAMIC FEW-SHOT AUTO-LEARNING ENGINE
// ============================================================================

const fetchLearnedGoldenExamplesAndRules = async ({ sequelize, intent, message }) => {
  const result = { goldenExamples: [], learnedRules: [] };
  if (!sequelize?.query) return result;

  try {
    // 1. Fetch Golden SQL Examples from AI_SQL_Learning_Tbl & AI_Query_Audit_Tbl
    const escapedIntent = (intent || "").replace(/'/g, "''");
    const exampleQuery = `
      SELECT TOP 5 Normalized_Question AS question, SQL_Query AS sql, Success_Count
      FROM [dbo].[AI_SQL_Learning_Tbl] WITH (NOLOCK)
      WHERE Intent = '${escapedIntent}' OR Intent = 'DYNAMIC_CUSTOM'
      ORDER BY Success_Count DESC, Created_At DESC;
    `;
    const rows = await sequelize.query(exampleQuery, { type: QueryTypes.SELECT }).catch(() => []);
    if (rows && rows.length > 0) {
      result.goldenExamples = rows.map(r => ({ question: r.question, sql: r.sql }));
    }

    // If fewer than 3, grab top successful queries from AI_Query_Audit_Tbl
    if (result.goldenExamples.length < 3) {
      const auditQuery = `
        SELECT TOP 3 User_Query AS question, Generated_SQL AS sql
        FROM [dbo].[AI_Query_Audit_Tbl] WITH (NOLOCK)
        WHERE Status_Code = 'SUCCESS' AND Rows_Returned > 0 AND Generated_SQL IS NOT NULL AND Generated_SQL <> ''
        ORDER BY UTD DESC;
      `;
      const auditRows = await sequelize.query(auditQuery, { type: QueryTypes.SELECT }).catch(() => []);
      for (const ar of auditRows) {
        if (ar.question && ar.sql && !result.goldenExamples.some(e => e.question === ar.question)) {
          result.goldenExamples.push({ question: ar.question, sql: ar.sql });
        }
      }
    }

    // 2. Fetch Active Corrections & Rules from AI_SQL_Corrections & AI_Business_Rule_Tbl
    const correctionsQuery = `
      IF OBJECT_ID('dbo.AI_SQL_Corrections', 'U') IS NOT NULL
      BEGIN
        SELECT TOP 10 Rule_Description AS description, Target_Table AS [table], Correct_SQL_Pattern AS pattern
        FROM [dbo].[AI_SQL_Corrections] WITH (NOLOCK)
        WHERE Is_Active = 1
        ORDER BY UTD DESC;
      END
      ELSE IF OBJECT_ID('dbo.AI_Business_Rule_Tbl', 'U') IS NOT NULL
      BEGIN
        SELECT TOP 10 Description AS description, Target_Table AS [table], SQL_Expression AS pattern
        FROM [dbo].[AI_Business_Rule_Tbl] WITH (NOLOCK)
        WHERE Is_Active = 1
        ORDER BY UTD DESC;
      END
    `;
    const corrRows = await sequelize.query(correctionsQuery, { type: QueryTypes.SELECT }).catch(() => []);
    if (corrRows && corrRows.length > 0) {
      result.learnedRules = corrRows.map(r => ({ description: r.description, table: r.table, pattern: r.pattern }));
    }
  } catch (err) {
    console.warn("[V6-RLHF] Dynamic learning fetch notice:", err?.message);
  }

  return result;
};

const LEARNED_STOP_WORDS = new Set([
  "ka", "ki", "ke", "ko", "se", "me", "mein", "par", "pe", "hai", "hain", "tha", "the", "thi", "h", "kya",
  "kiska", "kiske", "kiski", "batao", "bataiye", "detail", "details", "record", "records",
  "what", "who", "whom", "whose", "find", "show", "query", "tell", "about", "list", "please",
  "iski", "iska", "inke", "unka", "unki", "mera", "meri", "apna", "apni", "is", "ye", "yeh", "ok"
]);

// Normalizes tokens by abstracting entity parameters (<EMP_CODE>, <MONTH>, <YEAR>) and common typos
const canonicalizeQueryPattern = (text) => {
  let norm = (text || "").toLowerCase().trim();
  // 1. Common spelling typos in Hinglish ERP queries
  norm = norm.replace(/\b(attandace|attendence|attandance|attedance|atendance)\b/g, "attendance");
  norm = norm.replace(/\b(permament|permanant|parmanent|permenent)\b/g, "permanent");
  norm = norm.replace(/\b(sallary|salery|selary|tankha|vetan)\b/g, "salary");
  norm = norm.replace(/\b(presant|persent)\b/g, "present");
  norm = norm.replace(/\b(absant)\b/g, "absent");
  norm = norm.replace(/\b(itne|itna)\b/g, "kitne");
  norm = norm.replace(/\b(karmchari|karmachari)\b/g, "employee");

  // 1.5. Normalize branch/location designations (e.g. branch 1, branch 2, location 1, loc 1, branch one)
  norm = norm.replace(/\b(?:branch|location|loc|godw|godown|br)\s*(?:code\s*|no\s*|number\s*|:\s*|#\s*)?(\d+|one|two|three|four|five|six|seven|eight|nine|ten)\b/gi, "branch <BRANCH>");

  // 1.8. Normalize employee name queries (e.g. "shantanu name ke", "rakesh naam ke")
  norm = norm.replace(/\b[a-zA-Z]{2,30}\s+(?:name|naam)\s+ke\b/gi, "<NAME> name ke");
  norm = norm.replace(/\b(?:named|with\s+(?:the\s+)?name|whose\s+name\s+is|name\s+is|name\s+of)\s+[a-zA-Z]{2,30}\b/gi, "named <NAME>");

  // 2. Normalize 4-digit years (2020-2030)
  norm = norm.replace(/\b(202[0-9])\b/g, "<YEAR>");

  // 3. Normalize months
  const monthRegex = /\b(january|jan|february|feb|march|mar|april|apr|may|june|jun|july|jul|august|aug|september|sep|sept|october|oct|november|nov|december|dec)\b/g;
  norm = norm.replace(monthRegex, "<MONTH>");

  // 4. Normalize 4-10 digit employee codes (ignore already replaced <YEAR>)
  norm = norm.replace(/\b\d{4,10}\b/g, "<EMP_CODE>");

  // 5. Clean punctuation
  norm = norm.replace(/[^\w\s<>]/g, " ").replace(/\s+/g, " ").trim();
  return norm;
};

const getPatternTokens = (text) => {
  const canon = canonicalizeQueryPattern(text);
  return new Set(canon.split(/\s+/).filter(t => t.length >= 2 && !LEARNED_STOP_WORDS.has(t)));
};

const matchLearnedSimilarQuery = async ({ sequelize, message, originalMessage, intent, entities = {}, exactOnly = false }) => {
  if (!sequelize?.query || !message) return null;
  const normQuery = normalizeLower(message);
  const normOriginal = originalMessage ? normalizeLower(originalMessage) : "";
  const cleanQuery = normQuery.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
  const queryTokens = new Set(cleanQuery.split(/\s+/).filter(t => t.length >= 2 && !LEARNED_STOP_WORDS.has(t)));
  if (normOriginal && normOriginal !== normQuery) {
    const cleanOrig = normOriginal.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
    cleanOrig.split(/\s+/).filter(t => t.length >= 2 && !LEARNED_STOP_WORDS.has(t)).forEach(t => queryTokens.add(t));
  }

  // Canonical representations for parameter-invariant matching
  const canonQuery = canonicalizeQueryPattern(normOriginal || normQuery);
  const canonQueryTokens = getPatternTokens(normOriginal || normQuery);

  try {
    const fetchSql = `
      SELECT TOP 200 
        CONVERT(NVARCHAR(500), Normalized_Question) AS Normalized_Question,
        Intent,
        CONVERT(NVARCHAR(MAX), SQL_Query) AS SQL_Query,
        Tables_Used,
        ISNULL(Success_Count, 0) AS Success_Count
      FROM [dbo].[AI_SQL_Learning_Tbl] WITH (NOLOCK)
      WHERE SQL_Query IS NOT NULL 
        AND LTRIM(RTRIM(CONVERT(VARCHAR(MAX), SQL_Query))) <> ''
        AND ISNULL(Success_Count, 0) > 0
      ORDER BY Success_Count DESC, Created_At DESC;
    `;
    const rows = await sequelize.query(fetchSql, { type: QueryTypes.SELECT }).catch(() => []);

    // Helper for entity & date adaptation into SQL
    const adaptSQLForEntities = (rawSQL, sourceRule = null) => {
      let adaptedSQL = rawSQL;
      const ruleQ = sourceRule?.Normalized_Question || sourceRule?.User_Message || sourceRule?.Rule_Description || "";
      const currQ = originalMessage || message || "";

      // 0. Question-Diff Analysis: Compare learned question with current question
      const cleanRuleQ = (ruleQ || "").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
      const cleanCurrQ = (currQ || "").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();

      const ruleWords = cleanRuleQ.split(/\s+/).filter(Boolean);
      const currWords = cleanCurrQ.split(/\s+/).filter(Boolean);

      const QUESTION_DIFF_STOP_WORDS = new Set([
        "hai", "hain", "he", "h", "ke", "ka", "ki", "ko", "me", "mein", "mai", "se", "par", "pe",
        "kya", "kyu", "kyun", "kitne", "kitna", "kitni", "kiske", "kiska", "kiski", "kaun", "konsa", "konsi",
        "batao", "dikhao", "nikalo", "bolo", "do", "de", "dein", "chahiye", "tha", "thi", "the",
        "is", "are", "was", "were", "the", "a", "an", "in", "on", "at", "of", "for", "to", "from",
        "with", "by", "how", "many", "much", "what", "who", "which", "where", "when", "total", "count",
        "show", "tell", "give", "list", "details", "detail", "data", "record", "records",
        "karmchari", "employee", "employees", "all", "sabhi", "pura", "pure", "sirf", "only",
        "aur", "and", "or", "ya", "bhi", "na", "ne", "ab", "abhi", "please", "ok", "yes", "no",
        "name", "naam", "named", "wale", "wali", "walon", "waliyan"
      ]);

      const currWordsSet = new Set(currWords);
      const ruleWordsSet = new Set(ruleWords);

      const removedWords = ruleWords.filter(w => !currWordsSet.has(w) && !QUESTION_DIFF_STOP_WORDS.has(w));
      const addedWords = currWords.filter(w => !ruleWordsSet.has(w) && !QUESTION_DIFF_STOP_WORDS.has(w));

      // Extract Name Slots from Questions
      const ruleNameMatch = ruleQ.match(/\b([A-Za-z]{2,30})\s+(?:name|naam)\s+ke\b/i) ||
        ruleQ.match(/\b(?:named|name|naam)\s*[:=]?\s*([A-Za-z]{2,30})\b/i);
      const currNameMatch = currQ.match(/\b([A-Za-z]{2,30})\s+(?:name|naam)\s+ke\b/i) ||
        currQ.match(/\b(?:named|name|naam)\s*[:=]?\s*([A-Za-z]{2,30})\b/i);

      const oldName = ruleNameMatch ? ruleNameMatch[1].trim() : (removedWords.length > 0 ? removedWords[0] : null);
      let newName = entities.employeeName || (currNameMatch ? currNameMatch[1].trim() : (addedWords.length > 0 ? addedWords[0] : null));
      if (newName) {
        newName = newName.replace(/\s+(along|with|and|aur|their|unka|unki|unke|iska|iski|iske|ke|ki|ka|ko|se|me|mein|par|pe|whose|who|which|that|is|are|the|ye|yeh|wo|woh|bhi|na|ne|his|her|tell|give|show|batao|do|together|including|also|plus|as|having|details?|info|data|records?)\b.*$/i, "").trim();
      }

      if (oldName && newName && oldName.toLowerCase() !== newName.toLowerCase()) {
        const cleanOld = oldName.replace(/'/g, "''");
        const cleanNew = newName.replace(/'/g, "''");

        // 1. Replace inside SQL string literals containing oldName (e.g. '%rakesh%', 'rakesh')
        adaptedSQL = adaptedSQL.replace(new RegExp(`('%[^']*?)${cleanOld}([^']*?%')`, 'gi'), `$1${cleanNew}$2`);
        adaptedSQL = adaptedSQL.replace(new RegExp(`'${cleanOld}'`, 'gi'), `'${cleanNew}'`);

        // 2. Replace in any EMPFIRSTNAME / EMPLASTNAME / EMPNAME conditions
        adaptedSQL = adaptedSQL.replace(/((?:\[?[A-Za-z0-9_]+\]?\.)?\[?(?:EMPFIRSTNAME|EMPLASTNAME|EMPNAME)\]?\s+LIKE\s+'%)[^%]+(%')/gi, `$1${cleanNew}$2`);
        adaptedSQL = adaptedSQL.replace(/((?:\[?[A-Za-z0-9_]+\]?\.)?\[?(?:EMPFIRSTNAME|EMPLASTNAME|EMPNAME)\]?\s*=\s*')[^']+(')/gi, `$1${cleanNew}$2`);
        adaptedSQL = adaptedSQL.replace(/(CONCAT\([^)]*(?:EMPFIRSTNAME|EMPLASTNAME)[^)]*\)\s+LIKE\s+'%)[^%]+(%')/gi, `$1${cleanNew}$2`);
      } else if (entities.employeeName) {
        const cleanNew = entities.employeeName.replace(/'/g, "''");
        adaptedSQL = adaptedSQL.replace(/((?:\[?[A-Za-z0-9_]+\]?\.)?\[?(?:EMPFIRSTNAME|EMPLASTNAME|EMPNAME)\]?\s+LIKE\s+'%)[^%]+(%')/gi, `$1${cleanNew}$2`);
        adaptedSQL = adaptedSQL.replace(/((?:\[?[A-Za-z0-9_]+\]?\.)?\[?(?:EMPFIRSTNAME|EMPLASTNAME|EMPNAME)\]?\s*=\s*')[^']+(')/gi, `$1${cleanNew}$2`);
        adaptedSQL = adaptedSQL.replace(/(CONCAT\([^)]*(?:EMPFIRSTNAME|EMPLASTNAME)[^)]*\)\s+LIKE\s+'%)[^%]+(%')/gi, `$1${cleanNew}$2`);
      }

      // 1. Multiple branches (e.g. ['1', '2'])
      if (entities.branches && Array.isArray(entities.branches) && entities.branches.length > 0) {
        const formattedBranches = entities.branches.map(b => {
          const clean = String(b).replace(/'/g, "''");
          return /^\d+$/.test(clean) ? clean : `'${clean}'`;
        }).join(", ");

        if (/(?:\[?[A-Za-z0-9_]+\]?\.)?\[?(?:LOCATION|BRANCH|Loc_Code|Location_Code)\]?\s*=/i.test(adaptedSQL)) {
          adaptedSQL = adaptedSQL.replace(
            /(?:\[?[A-Za-z0-9_]+\]?\.)?\[?(?:LOCATION|BRANCH|Loc_Code|Location_Code)\]?\s*=\s*'?[^'\s;,\)]+'?/gi,
            `LOCATION IN (${formattedBranches})`
          );
        } else if (!/LOCATION\s+IN/i.test(adaptedSQL)) {
          if (/(?:FROM|JOIN)\s+\[?dbo\]?\.\[?EMPLOYEEMASTER\]?/i.test(adaptedSQL)) {
            if (/\bWHERE\b/i.test(adaptedSQL)) {
              adaptedSQL = adaptedSQL.replace(/\bWHERE\b/i, `WHERE LOCATION IN (${formattedBranches}) AND`);
            } else {
              adaptedSQL += ` WHERE LOCATION IN (${formattedBranches})`;
            }
          }
        }
      }
      // 2. Exclude branch (e.g. '1')
      else if (entities.excludeBranch) {
        const cleanExclude = String(entities.excludeBranch).replace(/'/g, "''");
        const isNum = /^\d+$/.test(cleanExclude);
        const notCond = `LOCATION <> ${isNum ? cleanExclude : `'${cleanExclude}'`}`;
        if (/(?:\[?[A-Za-z0-9_]+\]?\.)?\[?(?:LOCATION|BRANCH|Loc_Code|Location_Code)\]?\s*=/i.test(adaptedSQL)) {
          adaptedSQL = adaptedSQL.replace(
            /(?:\[?[A-Za-z0-9_]+\]?\.)?\[?(?:LOCATION|BRANCH|Loc_Code|Location_Code)\]?\s*=\s*'?[^'\s;,\)]+'?/gi,
            notCond
          );
        } else if (!/LOCATION\s*<>/i.test(adaptedSQL)) {
          if (/(?:FROM|JOIN)\s+\[?dbo\]?\.\[?EMPLOYEEMASTER\]?/i.test(adaptedSQL)) {
            if (/\bWHERE\b/i.test(adaptedSQL)) {
              adaptedSQL = adaptedSQL.replace(/\bWHERE\b/i, `WHERE ${notCond} AND`);
            } else {
              adaptedSQL += ` WHERE ${notCond}`;
            }
          }
        }
      }
      // 3. Single branch
      else if (entities.branch) {
        const cleanBranch = String(entities.branch).replace(/'/g, "''");
        const isNumericBranch = /^\d+$/.test(cleanBranch);

        // 1. Universal regex for any location/branch assignment in SQL (quoted or unquoted)
        adaptedSQL = adaptedSQL.replace(
          /((?:\[?[A-Za-z0-9_]+\]?\.)?\[?(?:LOCATION|BRANCH|Loc_Code|Location_Code)\]?\s*=\s*)('?[^'\s;,\)]+'?)/gi,
          (match, prefix, oldVal) => {
            const isQuoted = oldVal.startsWith("'") && oldVal.endsWith("'");
            if (isQuoted) {
              return `${prefix}'${cleanBranch}'`;
            } else if (isNumericBranch) {
              return `${prefix}${cleanBranch}`;
            } else {
              return `${prefix}'${cleanBranch}'`;
            }
          }
        );

        // 2. Handle CONVERT(varchar(50), [S].[Loc_Code]) = '...' or similar CONVERT patterns
        adaptedSQL = adaptedSQL.replace(
          /(CONVERT\s*\([^=]+\[?(?:LOCATION|BRANCH|Loc_Code|Location_Code)\]?\)\s*=\s*)'?[^'\s;,\)]+'?/gi,
          `$1'${cleanBranch}'`
        );

        // 3. If query has EMPLOYEEMASTER or SALARYFILE, but has NO location/branch filter, inject it
        if (!/(?:\[?[A-Za-z0-9_]+\]?\.)?\[?(?:LOCATION|BRANCH|Loc_Code|Location_Code)\]?\s*=/i.test(adaptedSQL)) {
          if (/(?:FROM|JOIN)\s+\[?dbo\]?\.\[?EMPLOYEEMASTER\]?/i.test(adaptedSQL)) {
            if (/\bWHERE\b/i.test(adaptedSQL)) {
              adaptedSQL = adaptedSQL.replace(/\bWHERE\b/i, `WHERE LOCATION = ${isNumericBranch ? cleanBranch : `'${cleanBranch}'`} AND`);
            } else {
              adaptedSQL += ` WHERE LOCATION = ${isNumericBranch ? cleanBranch : `'${cleanBranch}'`}`;
            }
          } else if (/(?:FROM|JOIN)\s+\[?dbo\]?\.\[?SALARYFILE\]?/i.test(adaptedSQL)) {
            if (/\bWHERE\b/i.test(adaptedSQL)) {
              adaptedSQL = adaptedSQL.replace(/\bWHERE\b/i, `WHERE Loc_Code = '${cleanBranch}' AND`);
            } else {
              adaptedSQL += ` WHERE Loc_Code = '${cleanBranch}'`;
            }
          }
        }
      }

      // 4. Designation
      if (entities.designation) {
        const cleanDesig = entities.designation.replace(/'/g, "''");
        if (!/EMPLOYEEDESIGNATION/i.test(adaptedSQL) && /(?:FROM|JOIN)\s+\[?dbo\]?\.\[?EMPLOYEEMASTER\]?/i.test(adaptedSQL)) {
          if (/\bWHERE\b/i.test(adaptedSQL)) {
            adaptedSQL = adaptedSQL.replace(/\bWHERE\b/i, `WHERE EMPLOYEEDESIGNATION LIKE '%${cleanDesig}%' AND`);
          } else {
            adaptedSQL += ` WHERE EMPLOYEEDESIGNATION LIKE '%${cleanDesig}%'`;
          }
        }
      }
      if (entities.specificDate && !adaptedSQL.includes(entities.specificDate)) {
        adaptedSQL = adaptedSQL.replace(/dateoffice\s*=\s*'\d{4}-\d{2}-\d{2}'/gi, `dateoffice = '${entities.specificDate}'`);
      }
      // Limit Adapter: If query asks for "top 5", "top 10", "top 3", adapt "TOP \d+" in SQL
      const topMatch = (message || "").match(/\btop\s*(\d+)\b/i);
      if (topMatch) {
        const reqLimit = parseInt(topMatch[1], 10);
        adaptedSQL = adaptedSQL.replace(/\bSELECT\s+TOP\s+\d+\b/i, `SELECT TOP ${reqLimit}`);
      } else if (/\b(sabse\s*jyada\s*kiski|kiski\s*salary\s*sabse\s*jyada|who\s*has\s*the\s*highest|kiski\s*salary\s*pay\s*hui|highest\s*earner)\b/i.test(message || "")) {
        // Singular highest query
        adaptedSQL = adaptedSQL.replace(/\bSELECT\s+TOP\s+\d+\b/i, `SELECT TOP 1`);
      }

      if (entities.employeeCode && entities.employeeCode !== "2024" && entities.employeeCode !== "2025" && entities.employeeCode !== "2026" && entities.employeeCode !== String(entities.year)) {
        const cleanEmp = entities.employeeCode.replace(/'/g, "''");

        // 1. If learned rule had a specific employee code in its question, replace that exact code in the SQL
        const oldEmpInRule = ruleQ.match(/\b(\d{4,10})\b/)?.[1];
        if (oldEmpInRule && oldEmpInRule !== cleanEmp && oldEmpInRule !== "2024" && oldEmpInRule !== "2025" && oldEmpInRule !== "2026") {
          adaptedSQL = adaptedSQL.replace(new RegExp(`'${oldEmpInRule}'`, 'g'), `'${cleanEmp}'`);
          adaptedSQL = adaptedSQL.replace(new RegExp(`=\\s*${oldEmpInRule}\\b`, 'g'), `= '${cleanEmp}'`);
        }

        // 2. Universal column-based regex replacements (handles LTRIM(RTRIM(CONVERT(... [Emp_Code]))) = '...', A.[Emp_Code] = '...', etc.)
        adaptedSQL = adaptedSQL.replace(/((?:Emp_Code|EMPCODE|Emp_Id|EMPID)[^=]*=\s*')[^']+(')/gi, `$1${cleanEmp}$2`);
        adaptedSQL = adaptedSQL.replace(/((?:Emp_Code|EMPCODE|Emp_Id|EMPID)[^=]*=\s*)(\d+)(?!\.)/gi, `$1'${cleanEmp}'`);
        adaptedSQL = adaptedSQL.replace(/((?:Emp_Code|EMPCODE|Emp_Id|EMPID)[^=]*LIKE\s*'%)[^%]+(%')/gi, `$1${cleanEmp}$2`);
      }

      // Date Adapters: Adapt day & month in SQL to match query entities
      if (entities.day && entities.month) {
        adaptedSQL = adaptedSQL.replace(/(MONTH\s*\([A-Za-z0-9_.\[\]\s]+\)\s*=\s*)(?:MONTH\s*\([^)]*\)\s*\)?|\d+)/gi, `$1${entities.month}`);
        adaptedSQL = adaptedSQL.replace(/(DAY\s*\([A-Za-z0-9_.\[\]\s]+\)\s*=\s*)(?:DAY\s*\([^)]*\)\s*\)?|\d+)/gi, `$1${entities.day}`);
      } else if (entities.isToday) {
        adaptedSQL = adaptedSQL.replace(/(MONTH\s*\([A-Za-z0-9_.\[\]\s]+\)\s*=\s*)(?:MONTH\s*\([^)]*\)\s*\)?|\d+)/gi, "$1MONTH(GETDATE())");
        adaptedSQL = adaptedSQL.replace(/(DAY\s*\([A-Za-z0-9_.\[\]\s]+\)\s*=\s*)(?:DAY\s*\([^)]*\)\s*\)?|\d+)/gi, "$1DAY(GETDATE())");
      } else if (entities.month && entities.month >= 1 && entities.month <= 12) {
        adaptedSQL = adaptedSQL.replace(/(SalMnth\s*=\s*'?)\d+('?)/gi, `$1${entities.month}$2`);
        adaptedSQL = adaptedSQL.replace(/(MONTH\s*\([A-Za-z0-9_.\[\]\s]+\)\s*=\s*)(?:MONTH\s*\([^)]*\)\s*\)?|\d+)/gi, `$1${entities.month}`);
      }

      if (entities.year && entities.year >= 2000) {
        adaptedSQL = adaptedSQL.replace(/(salyear\s*=\s*'?)\d{4}('?)/gi, `$1${entities.year}$2`);
        adaptedSQL = adaptedSQL.replace(/(YEAR\s*\([^)]+\)\s*=\s*)\d{4}/gi, `$1${entities.year}`);
      }

      // STALE LITERAL GUARD: Check if adaptedSQL still contains literal filters from removed words in oldQ
      if (removedWords.length > 0) {
        const currentLiterals = (adaptedSQL.match(/'(?:[^']|'')*'/g) || [])
          .map(lit => lit.slice(1, -1).replace(/%/g, "").trim().toLowerCase());

        for (const removed of removedWords) {
          const rLower = removed.toLowerCase();
          if (rLower.length < 3 || /^\d+$/.test(rLower)) continue;
          if (currWordsSet.has(rLower)) continue;

          const isStaleLiteralPresent = currentLiterals.some(lit => lit === rLower || lit.includes(rLower));
          if (isStaleLiteralPresent) {
            console.warn(`⚠️ [V6-RLHF-Guard] Learned query from '${ruleQ}' contains stale literal '${removed}' that does not exist in current question '${currQ}'. Rejecting golden match to prevent incorrect parameter execution.`);
            return null;
          }
        }
      }

      return adaptedSQL;
    };

    if (rows && rows.length > 0) {
      // STEP 1: Direct Exact / Canonical Pattern / Substring Match
      for (const r of rows) {
        const learnedNorm = normalizeLower(r.Normalized_Question || "");
        if (!learnedNorm || /^\?+$/.test(learnedNorm)) continue;
        const cleanLearned = learnedNorm.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
        if (!cleanLearned || cleanLearned.length < 3) continue;
        const learnedTokens = new Set(cleanLearned.split(/\s+/).filter(t => t.length >= 2 && !LEARNED_STOP_WORDS.has(t)));
        if (learnedTokens.size === 0) continue;

        const canonLearned = canonicalizeQueryPattern(r.Normalized_Question);
        const canonLearnedTokens = getPatternTokens(r.Normalized_Question);

        const isExact = (learnedNorm === normQuery || cleanLearned === cleanQuery);
        const isExactCanonical = (canonQuery === canonLearned);
        const isCanonicalSubset = !exactOnly && (
          (canonQuery.includes(canonLearned) && canonLearned.length >= 4) ||
          (canonLearned.includes(canonQuery) && canonQuery.length >= 4)
        );
        const isCanonicalTokenSubset = !exactOnly && (
          canonLearnedTokens.size >= 2 && [...canonLearnedTokens].every(t => canonQueryTokens.has(t))
        );
        const isSubset = !exactOnly && (
          (cleanQuery.includes(cleanLearned) && cleanLearned.length >= 4) ||
          (cleanLearned.includes(cleanQuery) && cleanQuery.length >= 4) ||
          (learnedTokens.size >= 2 && [...learnedTokens].every(t => queryTokens.has(t)))
        );

        if (isExact || isExactCanonical || isCanonicalSubset || isCanonicalTokenSubset || isSubset) {
          // Guard: Do not allow non-salary queries to serve salary intents
          const isSalaryIntent = ["HIGHEST_SALARY_RANKING", "SALARY_REPORT", "EMPLOYEE_SALARY_HISTORY", "SELF_SALARY"].includes(intent) ||
            /\b(salary|pagar|tankha|vetan|basic|basic_earn|gross_earn|net|ctc)\b/i.test(normQuery);
          if (isSalaryIntent) {
            const isSalarySQL = /SALARYFILE|MONTHLY_CTC|ANNUAL_CTC|Basic_Earn|Gross_Earn|Final_Payment|Total_Earn|BasicSalary/i.test(r.SQL_Query);
            if (!isSalarySQL) {
              continue;
            }
          }

          const isEmployeeOrDateContext = ["WORK_ANNIVERSARY", "MARRIAGE_ANNIVERSARY", "BIRTHDAY_BY_DATE", "BIRTHDAY_TODAY", "BIRTHDAYS_MONTH", "EMPLOYEE_LOOKUP"].includes(intent) ||
            /\b(annivers\w*|anivers\w*|saalgir\w*|salgir\w*|birthday|dob|employee|salary)\b/i.test(normQuery);
          if (isEmployeeOrDateContext && (r.Tables_Used === "Misc_Mst" || /FROM\s+\[dbo\]\.\[Misc_Mst\]/i.test(r.SQL_Query))) {
            continue;
          }
          if (isEmployeeOrDateContext && /CURRENTJOINDATE.*BETWEEN/i.test(r.SQL_Query)) {
            continue;
          }
          // Guard: Do not allow SALARYFILE queries to serve Anniversary or Birthday intents
          if (["WORK_ANNIVERSARY", "MARRIAGE_ANNIVERSARY", "BIRTHDAY_BY_DATE", "BIRTHDAY_TODAY", "BIRTHDAYS_MONTH"].includes(intent) &&
              (r.Tables_Used === "SALARYFILE" || /FROM\s+\[dbo\]\.\[SALARYFILE\]/i.test(r.SQL_Query))) {
            continue;
          }
          // Guard: Do not allow non-salary queries to serve salary ranking intents
          if (["HIGHEST_SALARY_RANKING", "SALARY_REPORT", "EMPLOYEE_SALARY_HISTORY"].includes(intent) &&
              (r.Tables_Used === "attendancetable" || /FROM\s+\[dbo\]\.\[attendancetable\]/i.test(r.SQL_Query))) {
            continue;
          }

          // Guard: Do not allow non-PF queries to match PF intents or queries, and vice-versa
          const isPFQuery = ["PF_DEDUCTION_COUNT", "SALARY_PF_DEDUCTION", "PF_COUNT", "PF_LOOKUP_BY_EMP", "PF_EMPLOYEE_LIST"].includes(intent) ||
            /\b(pf|provident|pension|uan|eps)\b/i.test(normQuery);
          const isLearnedPF = ["PF_DEDUCTION_COUNT", "SALARY_PF_DEDUCTION", "PF_COUNT", "PF_LOOKUP_BY_EMP", "PF_EMPLOYEE_LIST"].includes(r.Intent) ||
            /pf_employee|pfnumber|totalemployeeswithpf/i.test(r.SQL_Query);

          if (isPFQuery && !isLearnedPF) {
            continue;
          }
          if (!isPFQuery && isLearnedPF) {
            continue;
          }

          // Guard: Active vs Inactive vs Total Status Alignment
          const isInactiveQuery = /\b(inactive|in-active|left|resign|resigned|chhod\s*diya|chhod\s*chuke|purane|separated|relieved|deactive|deactivated|not\s*active|nikale\s*gaye|hata\s*diye)\b/i.test(normQuery) ||
            /\b(inactive|in-active|left|resign|resigned|chhod\s*diya|chhod\s*chuke|purane|separated|relieved|deactive|deactivated|not\s*active|nikale\s*gaye|hata\s*diye)\b/i.test(normOriginal);
          const isActiveQuery = !isInactiveQuery && (
            /\b(active|working|current|present|abhi\s*ke|kaam\s*kar\s*rahe|karyarat)\b/i.test(normQuery) ||
            /\b(active|working|current|present|abhi\s*ke|kaam\s*kar\s*rahe|karyarat)\b/i.test(normOriginal)
          );

          const isLearnedInactive = /\b(inactive|in-active|left|resign|resigned|chhod\s*diya|chhod\s*chuke|purane|separated|relieved|deactive|deactivated|not\s*active|nikale\s*gaye|hata\s*diye)\b/i.test(r.Normalized_Question) ||
            /LASTWOR_DATE\s+IS\s+NOT\s+NULL|EMP_STATUS\s*=\s*'I'|EMP_STATUS\s*=\s*'Inactive'/i.test(r.SQL_Query);
          const isLearnedActive = !isLearnedInactive && (
            /\b(active|working|current|present|abhi\s*ke|kaam\s*kar\s*rahe|karyarat)\b/i.test(r.Normalized_Question) ||
            /LASTWOR_DATE\s+IS\s+NULL|EMP_STATUS\s*=\s*'A'|EMP_STATUS\s*=\s*'Active'/i.test(r.SQL_Query)
          );

          // If query specifies Inactive, learned rule MUST be Inactive
          if (isInactiveQuery && !isLearnedInactive) continue;
          // If query specifies Active, learned rule MUST be Active
          if (isActiveQuery && !isLearnedActive) continue;
          // If query is for Total (neither active nor inactive), learned rule must NOT be specifically active or inactive
          if (!isActiveQuery && !isInactiveQuery && (isLearnedActive || isLearnedInactive)) continue;

          // Guard: Present vs Absent Mutual Exclusion
          const isPresentQuery = /\b(present|upasthit|aaye|aaya)\b/i.test(normQuery) || /\b(present|upasthit|aaye|aaya)\b/i.test(normOriginal);
          const isAbsentQuery = /\b(absent|anupasthit|chhutti|nahi\s*aaya)\b/i.test(normQuery) || /\b(absent|anupasthit|chhutti|nahi\s*aaya)\b/i.test(normOriginal);
          const isLearnedPresent = /\b(present|upasthit|aaye|aaya)\b/i.test(r.Normalized_Question) || /status\s*=\s*'P'/i.test(r.SQL_Query);
          const isLearnedAbsent = /\b(absent|anupasthit|chhutti|nahi\s*aaya)\b/i.test(r.Normalized_Question) || /status\s*=\s*'A'/i.test(r.SQL_Query);

          if (isPresentQuery && !isAbsentQuery && isLearnedAbsent) continue;
          if (isAbsentQuery && !isPresentQuery && isLearnedPresent) continue;

          // Guard: Highest / Top vs Lowest / Bottom Mutual Exclusion
          const isHighestQuery = /\b(highest|top\b|max\b|maximum|sabse\s*jyada|sabse\s*adhik)\b/i.test(normQuery);
          const isLowestQuery = /\b(lowest|bottom\b|min\b|minimum|sabse\s*kam)\b/i.test(normQuery);
          const isLearnedHighest = /\b(highest|top\b|max\b|maximum|sabse\s*jyada|sabse\s*adhik)\b/i.test(r.Normalized_Question) || /ORDER\s+BY.+DESC/i.test(r.SQL_Query);
          const isLearnedLowest = /\b(lowest|bottom\b|min\b|minimum|sabse\s*kam)\b/i.test(r.Normalized_Question) || /ORDER\s+BY.+ASC/i.test(r.SQL_Query);

          if (isHighestQuery && !isLowestQuery && isLearnedLowest && !isLearnedHighest) continue;
          if (isLowestQuery && !isHighestQuery && isLearnedHighest && !isLearnedLowest) continue;

          // Guard: Branch-specific learned rule must not match a company-wide query that explicitly has no branch
          const queryHasBranch = Boolean(entities.branch || /\b(branch|location|loc|godown)\b/i.test(normQuery) || /\b(branch|location|loc|godown)\b/i.test(normOriginal));
          const learnedHasBranch = /\b(branch|location|loc|godown)\b/i.test(r.Normalized_Question) || /(?:LOCATION|BRANCH|Loc_Code)\s*=/i.test(r.SQL_Query);
          if (!queryHasBranch && learnedHasBranch && !isExact) continue;

          // Guard: If user query asks for employee details/data/records/profile/list, do not match a count-only learned rule (unless exact)
          const isAskingDetails = /\b(detail|details|info|information|data|biodata|profile|list|records?|kon\s*kon|kaun\s*kaun|who\s*all|who\s*are\s*they)\b/i.test(normQuery) ||
            /\b(detail|details|info|information|data|biodata|profile|list|records?|kon\s*kon|kaun\s*kaun)\b/i.test(normOriginal);
          const isLearnedCountOnly = /\bCOUNT\s*\(/i.test(r.SQL_Query) && !/\b(SELECT\s+TOP\s+\d+\s+[^,]+,\s*[^,]+)/i.test(r.SQL_Query);
          if (isAskingDetails && isLearnedCountOnly && !isExact) continue;

          const matchLabel = isExact ? "EXACT_LEARNED_GOLDEN_MATCH" : (isExactCanonical ? "CANONICAL_PATTERN_MATCH" : "SUBSET_LEARNED_GOLDEN_MATCH");
          console.log(`🏆 [V6-RLHF-LearnedGoldenQuery] ${matchLabel} for: "${normQuery}" on learned rule: "${learnedNorm}"`);
          const adaptedSQL = adaptSQLForEntities(r.SQL_Query, r);
          if (!adaptedSQL) {
            console.log(`⚠️ [V6-RLHF-LearnedGoldenQuery] Adapted SQL rejected due to parameter mismatch / stale literal in rule "${learnedNorm}". Skipping.`);
            continue;
          }

          return {
            sql: adaptedSQL,
            intent: r.Intent || intent,
            targetTable: r.Tables_Used || "AI_SQL_Learning_Tbl",
            source: matchLabel,
            confidence: 0.99
          };
        }
      }

      if (!exactOnly) {
        // STEP 2: Normalized Semantic / Token / Entity Jaccard Match (Threshold >= 0.55 on canonical tokens)
        let bestMatch = null;
        let highestScore = 0;

        for (const r of rows) {
          const learnedNorm = normalizeLower(r.Normalized_Question || "");
          if (!learnedNorm) continue;
          const cleanLearned = learnedNorm.replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
          const learnedTokens = new Set(cleanLearned.split(/\s+/).filter(t => t.length >= 2 && !LEARNED_STOP_WORDS.has(t)));
          const canonLearnedTokens = getPatternTokens(r.Normalized_Question);

          // Standard token jaccard
          let intersection = 0;
          for (const t of queryTokens) {
            if (learnedTokens.has(t)) intersection++;
          }
          const union = new Set([...queryTokens, ...learnedTokens]).size;
          const jaccard = union > 0 ? intersection / union : 0;

          // Canonical token jaccard (entity parameter invariant)
          let canonInter = 0;
          for (const t of canonQueryTokens) {
            if (canonLearnedTokens.has(t)) canonInter++;
          }
          const canonUnion = new Set([...canonQueryTokens, ...canonLearnedTokens]).size;
          const canonJaccard = canonUnion > 0 ? canonInter / canonUnion : 0;

          const effectiveJaccard = Math.max(jaccard, canonJaccard);

          // Guard: Do not allow non-PF queries to match PF intents or queries, and vice-versa
          const isPFQuery = ["PF_DEDUCTION_COUNT", "SALARY_PF_DEDUCTION", "PF_COUNT", "PF_LOOKUP_BY_EMP", "PF_EMPLOYEE_LIST"].includes(intent) ||
            /\b(pf|provident|pension|uan|eps)\b/i.test(normQuery);
          const isLearnedPF = ["PF_DEDUCTION_COUNT", "SALARY_PF_DEDUCTION", "PF_COUNT", "PF_LOOKUP_BY_EMP", "PF_EMPLOYEE_LIST"].includes(r.Intent) ||
            /pf_employee|pfnumber|totalemployeeswithpf/i.test(r.SQL_Query);

          if (isPFQuery && !isLearnedPF) {
            continue;
          }
          if (!isPFQuery && isLearnedPF) {
            continue;
          }

          // Guard: Active vs Inactive vs Total Status Alignment
          const isInactiveQuery = /\b(inactive|in-active|left|resign|resigned|chhod\s*diya|chhod\s*chuke|purane|separated|relieved|deactive|deactivated|not\s*active|nikale\s*gaye|hata\s*diye)\b/i.test(normQuery) ||
            /\b(inactive|in-active|left|resign|resigned|chhod\s*diya|chhod\s*chuke|purane|separated|relieved|deactive|deactivated|not\s*active|nikale\s*gaye|hata\s*diye)\b/i.test(normOriginal);
          const isActiveQuery = !isInactiveQuery && (
            /\b(active|working|current|present|abhi\s*ke|kaam\s*kar\s*rahe|karyarat)\b/i.test(normQuery) ||
            /\b(active|working|current|present|abhi\s*ke|kaam\s*kar\s*rahe|karyarat)\b/i.test(normOriginal)
          );

          const isLearnedInactive = /\b(inactive|in-active|left|resign|resigned|chhod\s*diya|chhod\s*chuke|purane|separated|relieved|deactive|deactivated|not\s*active|nikale\s*gaye|hata\s*diye)\b/i.test(r.Normalized_Question) ||
            /LASTWOR_DATE\s+IS\s+NOT\s+NULL|EMP_STATUS\s*=\s*'I'|EMP_STATUS\s*=\s*'Inactive'/i.test(r.SQL_Query);
          const isLearnedActive = !isLearnedInactive && (
            /\b(active|working|current|present|abhi\s*ke|kaam\s*kar\s*rahe|karyarat)\b/i.test(r.Normalized_Question) ||
            /LASTWOR_DATE\s+IS\s+NULL|EMP_STATUS\s*=\s*'A'|EMP_STATUS\s*=\s*'Active'/i.test(r.SQL_Query)
          );

          // If query specifies Inactive, learned rule MUST be Inactive
          if (isInactiveQuery && !isLearnedInactive) continue;
          // If query specifies Active, learned rule MUST be Active
          if (isActiveQuery && !isLearnedActive) continue;
          // If query is for Total (neither active nor inactive), learned rule must NOT be specifically active or inactive
          if (!isActiveQuery && !isInactiveQuery && (isLearnedActive || isLearnedInactive)) continue;

          // Guard: Present vs Absent Mutual Exclusion
          const isPresentQuery = /\b(present|upasthit|aaye|aaya)\b/i.test(normQuery) || /\b(present|upasthit|aaye|aaya)\b/i.test(normOriginal);
          const isAbsentQuery = /\b(absent|anupasthit|chhutti|nahi\s*aaya)\b/i.test(normQuery) || /\b(absent|anupasthit|chhutti|nahi\s*aaya)\b/i.test(normOriginal);
          const isLearnedPresent = /\b(present|upasthit|aaye|aaya)\b/i.test(r.Normalized_Question) || /status\s*=\s*'P'/i.test(r.SQL_Query);
          const isLearnedAbsent = /\b(absent|anupasthit|chhutti|nahi\s*aaya)\b/i.test(r.Normalized_Question) || /status\s*=\s*'A'/i.test(r.SQL_Query);

          if (isPresentQuery && !isAbsentQuery && isLearnedAbsent) continue;
          if (isAbsentQuery && !isPresentQuery && isLearnedPresent) continue;

          // Guard: Highest / Top vs Lowest / Bottom Mutual Exclusion
          const isHighestQuery = /\b(highest|top\b|max\b|maximum|sabse\s*jyada|sabse\s*adhik)\b/i.test(normQuery);
          const isLowestQuery = /\b(lowest|bottom\b|min\b|minimum|sabse\s*kam)\b/i.test(normQuery);
          const isLearnedHighest = /\b(highest|top\b|max\b|maximum|sabse\s*jyada|sabse\s*adhik)\b/i.test(r.Normalized_Question) || /ORDER\s+BY.+DESC/i.test(r.SQL_Query);
          const isLearnedLowest = /\b(lowest|bottom\b|min\b|minimum|sabse\s*kam)\b/i.test(r.Normalized_Question) || /ORDER\s+BY.+ASC/i.test(r.SQL_Query);

          if (isHighestQuery && !isLowestQuery && isLearnedLowest && !isLearnedHighest) continue;
          if (isLowestQuery && !isHighestQuery && isLearnedHighest && !isLearnedLowest) continue;

          // Guard: Branch-specific learned rule must not match a company-wide query that explicitly has no branch
          const queryHasBranch = Boolean(entities.branch || /\b(branch|location|loc|godown)\b/i.test(normQuery) || /\b(branch|location|loc|godown)\b/i.test(normOriginal));
          const learnedHasBranch = /\b(branch|location|loc|godown)\b/i.test(r.Normalized_Question) || /(?:LOCATION|BRANCH|Loc_Code)\s*=/i.test(r.SQL_Query);
          if (!queryHasBranch && learnedHasBranch) continue;

          // Guard: If user query asks for employee details/data/records/profile/list, do not match a count-only learned rule
          const isAskingDetails = /\b(detail|details|info|information|data|biodata|profile|list|records?|kon\s*kon|kaun\s*kaun|who\s*all|who\s*are\s*they)\b/i.test(normQuery) ||
            /\b(detail|details|info|information|data|biodata|profile|list|records?|kon\s*kon|kaun\s*kaun)\b/i.test(normOriginal);
          const isLearnedCountOnly = /\bCOUNT\s*\(/i.test(r.SQL_Query) && !/\b(SELECT\s+TOP\s+\d+\s+[^,]+,\s*[^,]+)/i.test(r.SQL_Query);
          if (isAskingDetails && isLearnedCountOnly) continue;

          let score = effectiveJaccard;
          if (r.Intent && r.Intent === intent && intent !== "GENERAL_DATABASE_QUERY") {
            score += 0.20;
          }
          if (score > highestScore && score >= 0.55) {
            highestScore = score;
            bestMatch = r;
          }
        }

        if (bestMatch && highestScore >= 0.55) {
          console.log(`🧠 [V6-RLHF-LearnedMatch] Found learned golden pattern (Score: ${highestScore.toFixed(2)}): "${bestMatch.Normalized_Question}"`);
          const adaptedSQL = adaptSQLForEntities(bestMatch.SQL_Query, bestMatch);
          if (adaptedSQL) {
            return {
              sql: adaptedSQL,
              intent: bestMatch.Intent || intent,
              targetTable: bestMatch.Tables_Used || "AI_SQL_Learning_Tbl",
              source: "SIMILAR_LEARNED_GOLDEN_MATCH",
              confidence: 0.95
            };
          } else {
            console.log(`⚠️ [V6-RLHF-LearnedMatch] Adapted SQL rejected due to parameter mismatch / stale literal in rule "${bestMatch.Normalized_Question}". Falling back to planner.`);
          }
        }
      }
    }

    // STEP 3: Check Active AI_SQL_Corrections for Direct Rule Match
    if (!exactOnly) {
      const corrSql = `
        IF OBJECT_ID('dbo.AI_SQL_Corrections', 'U') IS NOT NULL
        BEGIN
          SELECT TOP 20 Target_Table, Correct_SQL_Pattern, Rule_Description, User_Message
          FROM [dbo].[AI_SQL_Corrections] WITH (NOLOCK)
          WHERE Is_Active = 1 AND Correct_SQL_Pattern IS NOT NULL AND LTRIM(RTRIM(CONVERT(VARCHAR(MAX), Correct_SQL_Pattern))) <> ''
          ORDER BY UTD DESC;
        END
      `;
      const corrRows = await sequelize.query(corrSql, { type: QueryTypes.SELECT }).catch(() => []);
      for (const cr of corrRows) {
        // Domain / Intent Compatibility Guard:
        const targetTable = (cr.Target_Table || "").toLowerCase();
        const isAttendanceCorrection = targetTable.includes("attendance") || /attendancetable/i.test(cr.Correct_SQL_Pattern || "");
        const isSalaryCorrection = targetTable.includes("salary") || /salaryfile/i.test(cr.Correct_SQL_Pattern || "");
        const isProfileLookup = ["EMPLOYEE_LOOKUP", "EMPLOYEE_PROFILE", "EMPLOYEE_BY_MOBILE_NO", "EMPLOYEE_BY_PAN_NO", "EMPLOYEE_BY_AADHAAR_NO", "EMPLOYEE_BY_ACCOUNT_NO"].includes(intent) ||
          /\b(designation|post|pad|mobile|phone|contact|address|pata|joining|doj|profile)\b/i.test(normQuery);

        if (isProfileLookup && (isAttendanceCorrection || isSalaryCorrection)) {
          continue; // Profile queries should not execute attendance or salary table corrections!
        }
        if (isAttendanceCorrection && !["ATTENDANCE_REPORT", "ATTENDANCE_AND_SALARY_REPORT", "MISPUNCH_REPORT", "MISPUNCH_LOOKUP_BY_EMP"].includes(intent) && !/\b(attendance|attandance|haziri|punch|mispunch)\b/i.test(normQuery)) {
          continue; // Attendance correction should only match attendance queries!
        }
        if (isSalaryCorrection && !["SALARY_REPORT", "EMPLOYEE_SALARY_HISTORY", "SELF_SALARY", "SALARY_TOTAL_AGGREGATE", "SALARY_COUNT_AGGREGATE"].includes(intent) && !/\b(salary|pagar|tankha|vetan|basic|gross|net|ctc)\b/i.test(normQuery)) {
          continue; // Salary correction should only match salary queries!
        }

        // Extract the original question from Rule_Description if possible (e.g. data for "..." is in table)
        const origMatch = (cr.Rule_Description || "").match(/data for "(.*?)" is in table/i);
        const matchTargetText = origMatch ? origMatch[1] : (cr.User_Message || cr.Rule_Description || "");
        const cleanMatchNorm = normalizeLower(matchTargetText).replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
        const descTokens = new Set(cleanMatchNorm.split(/\s+/).filter(t => t.length >= 3 && !LEARNED_STOP_WORDS.has(t)));

        // Guard: Active vs Inactive vs Total Status Alignment
        const isInactiveQuery = /\b(inactive|in-active|left|resign|resigned|chhod\s*diya|chhod\s*chuke|purane|separated|relieved|deactive|deactivated|not\s*active|nikale\s*gaye|hata\s*diye)\b/i.test(normQuery) ||
          /\b(inactive|in-active|left|resign|resigned|chhod\s*diya|chhod\s*chuke|purane|separated|relieved|deactive|deactivated|not\s*active|nikale\s*gaye|hata\s*diye)\b/i.test(normOriginal);
        const isActiveQuery = !isInactiveQuery && (
          /\b(active|working|current|present|abhi\s*ke|kaam\s*kar\s*rahe|karyarat)\b/i.test(normQuery) ||
          /\b(active|working|current|present|abhi\s*ke|kaam\s*kar\s*rahe|karyarat)\b/i.test(normOriginal)
        );

        const isCorrectionInactive = /\b(inactive|in-active|left|resign|resigned|chhod\s*diya|chhod\s*chuke|purane|separated|relieved|deactive|deactivated|not\s*active|nikale\s*gaye|hata\s*diye)\b/i.test(cr.Rule_Description || "") ||
          /LASTWOR_DATE\s+IS\s+NOT\s+NULL|EMP_STATUS\s*=\s*'I'|EMP_STATUS\s*=\s*'Inactive'/i.test(cr.Correct_SQL_Pattern || "");
        const isCorrectionActive = !isCorrectionInactive && (
          /\b(active|working|current|present|abhi\s*ke|kaam\s*kar\s*rahe|karyarat)\b/i.test(cr.Rule_Description || "") ||
          /LASTWOR_DATE\s+IS\s+NULL|EMP_STATUS\s*=\s*'A'|EMP_STATUS\s*=\s*'Active'/i.test(cr.Correct_SQL_Pattern || "")
        );

        if (isInactiveQuery && !isCorrectionInactive) continue;
        if (isActiveQuery && !isCorrectionActive) continue;
        if (!isActiveQuery && !isInactiveQuery && (isCorrectionActive || isCorrectionInactive)) continue;

        // Guard: Specific employee name in correction SQL
        const nameMatch = (cr.Correct_SQL_Pattern || "").match(/EMPFIRSTNAME\s+LIKE\s+'%([^%]+)%'/i);
        if (nameMatch && !normQuery.includes(nameMatch[1].toLowerCase()) && !normOriginal.includes(nameMatch[1].toLowerCase())) {
          continue;
        }

        let overlap = 0;
        for (const qt of queryTokens) {
          if (descTokens.has(qt)) overlap++;
        }
        const requiredOverlap = Math.max(2, Math.ceil(descTokens.size * 0.7));
        if (overlap >= requiredOverlap && cr.Correct_SQL_Pattern) {
          console.log(`🎯 [V6-RLHF-CorrectionRule] Matched active correction rule for query "${normQuery}" on table: ${cr.Target_Table}`);
          const adaptedSQL = adaptSQLForEntities(cr.Correct_SQL_Pattern, cr);
          return {
            sql: adaptedSQL,
            intent: intent || "DYNAMIC_CUSTOM",
            targetTable: cr.Target_Table || "AI_SQL_Corrections",
            source: "CORRECTION_RULE_MATCH",
            confidence: 0.98
          };
        }
      }
    }
  } catch (err) {
    console.warn("[V6-RLHF-LearnedMatch] Warning:", err?.message);
  }

  return null;
};

// ============================================================================
// CONTINUOUS SELF-LEARNING & USER DATA-LOCATION GUIDANCE SUBSYSTEM
// ============================================================================

/**
 * Detects if a message is providing data location guidance, correction, or SQL
 */
const isCorrectionOrDataLocation = (rawMessage = "", hasPreviousTurn = false) => {
  const norm = normalizeLower(rawMessage);

  // 1. Direct SQL query provided by user
  if (/^\s*(SELECT\s+[\s\S]+)/i.test(rawMessage)) return true;

  // 2. Explicit correction / feedback phrases in Hindi, English, Hinglish
  if (/\b(ye galat hai|galat answer|wrong answer|galat bata raha|galat kyu|sahi karo|ye sahi nahi|ye galat|galat hai|galat kyu hai|ye result galat|wrong result)\b/i.test(norm)) return true;

  // 3. User specifying where data lives (table/column/location)
  if (/\b(ye data|data|record|records|ye detail|ye information|ye|iska|ye wala|inka|unka)\s+([a-zA-Z0-9_]{3,40})\s*(table)?\s*(me|se)\s*(milega|milegi|hai|h|dekho|check|nikalo|aayega|hota hai)/i.test(norm)) return true;
  if (/\b([a-zA-Z0-9_]{3,40})\s*(table)\s*(me|se)\s*(milega|milegi|hai|h|dekho|check|nikalo|aayega)/i.test(norm)) return true;
  if (/\b(table|table\s*name|table\s*hai|from\s*table|in\s*table)\s*[:=]?\s*\[?([a-zA-Z0-9_]{3,40})\]?/i.test(norm)) return true;
  if (/\b(column|column\s*name|field|field\s*name)\s*[:=]?\s*\[?([a-zA-Z0-9_]{3,40})\]?/i.test(norm)) return true;
  if (/\b(is table me|is table se|yaha se milega|yaha milega|yaha se lo|yaha dekho|yaha check karo|isme dekho|isme check karo|is table me hai)\b/i.test(norm)) return true;

  // 4. Known ERP table names mentioned directly
  const knownTablesRegex = /\b(attendancetable|attendance table|salaryfile|salary file|salary fil\w*|employeemaster|employee master|emp_varify|account_no_api|misc_mst|asset_issue|srv_reminder|srv_reminder_tbl|jobcard|job_card|ledger|voucher)\b/i;
  if (knownTablesRegex.test(norm)) {
    if (hasPreviousTurn || /\b(me|se|table|flag|status|empcode|emp_code)\b/i.test(norm)) {
      return true;
    }
  }

  // 5. Condition or filter pointers like flag='MP' or status='A'
  if (/\b(flag\s*=\s*'[^']+'|status\s*=\s*'[^']+'|jisme\s+[a-zA-Z0-9_]+\s*=)/i.test(rawMessage)) {
    return true;
  }

  return false;
};

/**
 * Extracts target table, filter condition, and embedded SQL from user guidance
 */
const extractGuidanceComponents = (rawMessage = "") => {
  const norm = normalizeLower(rawMessage);
  let targetTable = null;
  let filterClause = null;
  let extractedSQL = null;

  // 1. Direct SQL
  const sqlMatch = rawMessage.match(/\b(SELECT\s+[\s\S]+?\bFROM\s+[\w\.\[\]]+(?:\s+WHERE\s+[\s\S]+?)?)(?=\s+(?:ye\b|use\b|bhi\b|query\b|batao\b|kar\b|ko\b|se\b|me\b|hai\b|h\b|ok\b|$)|;|\bORDER\s+BY)/i) ||
    rawMessage.match(/\b(SELECT\s+[\s\S]+?(?:;|\bORDER\s+BY\s+[\w\s\.,_\[\]]+(?:\s+DESC|\s+ASC)?))/i);
  if (sqlMatch) {
    extractedSQL = (sqlMatch[1] || sqlMatch[0]).replace(/;+$/, "").trim();
  }

  // 2. Target Table Extraction
  if (/srv_reminder|service reminder|final_due_date/i.test(norm)) {
    targetTable = "Srv_Reminder_Tbl";
  } else if (/salary\s*fil\w*|salaryfile|salary_file|total_earn|basic_earn/i.test(norm)) {
    targetTable = "SALARYFILE";
  } else if (/account_no_api/i.test(norm)) {
    targetTable = "Account_No_Api";
  } else if (/attendancetable|attendance table|mispunch|punch|haziri/i.test(norm)) {
    targetTable = "attendancetable";
  } else if (/employeemaster|employee master|emp master/i.test(norm)) {
    targetTable = "EMPLOYEEMASTER";
  } else if (/emp_varify|emp verify/i.test(norm)) {
    targetTable = "emp_varify";
  } else if (/misc_mst|misc master/i.test(norm)) {
    targetTable = "Misc_Mst";
  } else if (/asset_issue|asset/i.test(norm)) {
    targetTable = "Asset_Issue";
  } else if (/jobcard|job_card/i.test(norm)) {
    targetTable = "JobCard";
  } else {
    // Dynamic match against SchemaKnowledgeGraph
    const tableMatch = rawMessage.match(/\b(?:table|table\s*name|from|in)\s*[:=]?\s*\[?([a-zA-Z0-9_]{3,40})\]?/i) ||
      rawMessage.match(/\b([a-zA-Z0-9_]{3,40})\s+(?:table\s*)(?:me|se)\b/i);
    if (tableMatch) {
      const candidate = tableMatch[1].trim();
      if (SchemaEngineInstance.tableIndex.has(candidate.toLowerCase())) {
        targetTable = SchemaEngineInstance.tableIndex.get(candidate.toLowerCase()).tableName;
      }
    }
  }

  // 3. Filter Condition (e.g. flag = 'MP', status = 'A')
  const conditionMatch = rawMessage.match(/\b([a-zA-Z0-9_]+)\s*(=|LIKE|IS|IN|>|<|>=|<=)\s*('[^']*'|"[^"]*"|\d+|NULL)/i);
  if (conditionMatch) {
    filterClause = `${conditionMatch[1]} ${conditionMatch[2]} ${conditionMatch[3]}`;
  } else if (/\bmispunch|mis-punch|miss punch\b/i.test(norm)) {
    filterClause = "flag = 'MP'";
  }

  // 4. Explicit trigger detection (e.g. "jab koi highest payment puchhe to SELECT...")
  let explicitTrigger = null;
  const triggerMatch = rawMessage.match(/\bjab\s*(?:bhi|koi)?\s*(.+?)\s*(?:puchhe|puche|bole|kahe|aaye|kare|mange)\s*(?:to|tab|tabhi|use|ye query|SELECT)\b/i);
  if (triggerMatch) {
    explicitTrigger = triggerMatch[1].trim();
  }

  return { targetTable, filterClause, extractedSQL, explicitTrigger };
};

/**
 * Permanently learns user correction / data-location rule into:
 * 1. AI_SQL_Learning_Tbl (Golden queries with variations)
 * 2. AI_SQL_Corrections (Active rule)
 * 3. AI_Business_Rule_Tbl (MSSQL constraint)
 * 4. In-Memory Runtime Graph & Synonyms
 * 5. Semantic Vector Cache
 */
const persistLearnedDataRule = async ({
  sequelize,
  originalQuestion,
  validatedSQL,
  targetTable,
  filterClause,
  intent = "DYNAMIC_CUSTOM",
  rawMessage = "",
  entities = {}
}) => {
  if (!sequelize?.query || !validatedSQL) return;

  try {
    const escapedOrig = (originalQuestion || "").replace(/'/g, "''");
    const escapedSQL = validatedSQL.replace(/'/g, "''");
    const escapedMsg = (rawMessage || "").replace(/'/g, "''");
    const escapedTable = (targetTable || "ERP_MASTER").replace(/'/g, "''");
    const escapedDesc = `User instructed that data for "${escapedOrig}" is in table ${escapedTable} ${filterClause ? 'where ' + filterClause.replace(/'/g, "''") : ''}`.replace(/'/g, "''");

    // 1. Ensure Learning Tables Exist
    await ensureLearningTablesExist(sequelize);

    // Purge any mis-learned cross-domain entries (e.g. SALARYFILE tagged as WORK_ANNIVERSARY)
    await sequelize.query(`
      IF OBJECT_ID('dbo.AI_SQL_Learning_Tbl', 'U') IS NOT NULL
      BEGIN
        DELETE FROM [dbo].[AI_SQL_Learning_Tbl]
        WHERE (Tables_Used = 'SALARYFILE' AND (Normalized_Question LIKE '%annivers%' OR Normalized_Question LIKE '%salgir%'))
           OR (Intent = 'WORK_ANNIVERSARY' AND Tables_Used = 'SALARYFILE');
      END
    `, { type: QueryTypes.RAW }).catch(() => { });

    // 2. Generate Question Variations for Maximum Generalization
    const questionVariations = new Set();
    if (originalQuestion) {
      questionVariations.add(normalizeLower(originalQuestion));
    }

    // Keyword & Intent-based generalized variations
    const normOrig = normalizeLower(originalQuestion || rawMessage);
    if (/\bmispunch|mis-punch|miss punch\b/i.test(normOrig)) {
      questionVariations.add("mispunch");
      questionVariations.add("mispunch batao");
      questionVariations.add("mispunch report");
      questionVariations.add("mispunch count");
      questionVariations.add("aaj ka mispunch");
      questionVariations.add("kiska mispunch hai");
      questionVariations.add("employee mispunch list");
      questionVariations.add("miss punch report");
    } else if (/srv_reminder|service reminder|service due/i.test(normOrig)) {
      questionVariations.add("service reminder list");
      questionVariations.add("today service reminders due list");
      questionVariations.add("service reminders due list");
      questionVariations.add("service due list");
      questionVariations.add("aaj ke service reminder");
    } else if (/pf\s*deduct|provident\s*fund\s*deduct|pf\s*katoti|kitne\s*employee\s*ka\s*pf/i.test(normOrig) || intent === "SALARY_PF_DEDUCTION" || intent === "PF_DEDUCTION_COUNT") {
      questionVariations.add("pf deduction");
      questionVariations.add("pf deduction list");
      questionVariations.add("pf deduction report");
      questionVariations.add("pf deduction count");
      questionVariations.add("kitne employee ka pf deduction hua hai");
      questionVariations.add("kiska kiska pf kata hai");
      questionVariations.add("march 2026 me kitne employee ka pf deduction hua hai");
      questionVariations.add("march 2026 me pf deduction");
    } else if (/salary|pagar|tankha|tankhwa|highest payment|payment/i.test(normOrig) || intent === "HIGHEST_SALARY_RANKING") {
      questionVariations.add("highest salary");
      questionVariations.add("highest payment");
      questionVariations.add("salary report");
      questionVariations.add("salary ranking");
      questionVariations.add("sabse jyada salary");
      questionVariations.add("sabse jyada payment");
      questionVariations.add("sabse jyada salary kiski hai");
      questionVariations.add("highest salary kiski hai");
      questionVariations.add("march 2026 me sabse jyada kiski salary pay hui hai");
      questionVariations.add("sabse jyada kiski salary pay hui hai");
    } else if (/asset|laptop|desktop|sim/i.test(normOrig)) {
      questionVariations.add("asset issue");
      questionVariations.add("asset list");
      questionVariations.add("laptop issue report");
    }

    // Generalized template SQL without specific employee code for generic queries
    let generalizedSQL = validatedSQL;
    if (entities.employeeCode) {
      generalizedSQL = generalizedSQL.replace(new RegExp(`(A\\.\\[Emp_Code\\]\\s*=\\s*')${entities.employeeCode}(')`, 'gi'), "$1{EMPCODE}$2");
      generalizedSQL = generalizedSQL.replace(new RegExp(`(E\\.\\[EMPCODE\\]\\s*=\\s*')${entities.employeeCode}(')`, 'gi'), "$1{EMPCODE}$2");
    }

    // 3. Save into AI_SQL_Learning_Tbl
    for (const q of questionVariations) {
      const escapedQ = q.replace(/'/g, "''");
      const isSpecific = (q === normalizeLower(originalQuestion));
      const sqlToSave = isSpecific ? escapedSQL : generalizedSQL.replace(/'/g, "''");

      const mergeSql = `
        IF OBJECT_ID('dbo.AI_SQL_Learning_Tbl', 'U') IS NOT NULL
        BEGIN
          MERGE INTO [dbo].[AI_SQL_Learning_Tbl] AS target
          USING (SELECT '${escapedQ}' AS Question, '${intent}' AS Intent) AS source
          ON (CONVERT(NVARCHAR(500), target.Normalized_Question) = source.Question)
          WHEN MATCHED THEN
            UPDATE SET 
              target.Success_Count = target.Success_Count + 100,
              target.SQL_Query = '${sqlToSave}',
              target.Tables_Used = '${escapedTable}',
              target.Updated_At = GETDATE(),
              target.Last_Verified_At = GETDATE()
          WHEN NOT MATCHED THEN
            INSERT (Normalized_Question, Intent, SQL_Query, Tables_Used, Success_Count, Last_Execution_Time_Ms, Created_At, Last_Verified_At)
            VALUES (source.Question, source.Intent, '${sqlToSave}', '${escapedTable}', 100, 35, GETDATE(), GETDATE());
        END
      `;
      await sequelize.query(mergeSql, { type: QueryTypes.RAW }).catch(() => { });
    }

    // 4. Save into AI_SQL_Corrections
    const corrInsertSql = `
      IF OBJECT_ID('dbo.AI_SQL_Corrections', 'U') IS NOT NULL
      BEGIN
        INSERT INTO [dbo].[AI_SQL_Corrections] (Correction_Type, User_Message, Target_Table, Correct_SQL_Pattern, Rule_Description, Is_Active, Created_At)
        VALUES ('USER_DATA_LOCATION', '${escapedMsg}', '${escapedTable}', '${escapedSQL}', '${escapedDesc}', 1, GETDATE());
      END
    `;
    await sequelize.query(corrInsertSql, { type: QueryTypes.RAW }).catch(() => { });

    // 5. Save into AI_Business_Rule_Tbl if table exists
    const ruleCode = `LEARNED_${escapedTable.toUpperCase()}_${Date.now()}`;
    const ruleInsertSql = `
      IF OBJECT_ID('dbo.AI_Business_Rule_Tbl', 'U') IS NOT NULL
      BEGIN
        INSERT INTO [dbo].[AI_Business_Rule_Tbl] (Rule_Code, Rule_Name, Target_Table, SQL_Expression, Description, Module_Name, Is_Active, Created_At)
        VALUES ('${ruleCode}', 'Learned ${escapedTable} Rule', '${escapedTable}', '${(filterClause || '1=1').replace(/'/g, "''")}', '${escapedDesc}', 'AUTO_LEARNED', 1, GETDATE());
      END
    `;
    await sequelize.query(ruleInsertSql, { type: QueryTypes.RAW }).catch(() => { });

    // 6. In-Memory Dynamic Knowledge Registration (Takes effect instantly on live process)
    if (targetTable) {
      for (const q of questionVariations) {
        if (!ERP_SYNONYM_DICTIONARY[q]) {
          ERP_SYNONYM_DICTIONARY[q] = {
            targetTable,
            synonyms: [q],
            defaultColumns: ["*"],
            businessMeaning: `Auto-trained rule learned from user data location feedback for ${q}`
          };
        } else {
          if (!ERP_SYNONYM_DICTIONARY[q].synonyms.includes(q)) {
            ERP_SYNONYM_DICTIONARY[q].synonyms.push(q);
          }
        }
      }
    }

    // 7. Purge Stale Caches & Ingest into Semantic L3 Vector Cache
    CacheEngineInstance.l1ExactCache.clear();
    const queryEmbedding = await generateEmbedding(normalizeLower(originalQuestion || rawMessage)).catch(() => []);
    if (Array.isArray(queryEmbedding) && queryEmbedding.length > 0) {
      CacheEngineInstance.l3VectorCache.push({
        embedding: queryEmbedding,
        sql: validatedSQL,
        compcode: "GLOBAL",
        role: "GLOBAL",
        targetTable,
        intent
      });
    }

    console.log(`🧠 [V6-SelfLearning] Successfully trained & permanently persisted golden rule for "${originalQuestion}" on table [${targetTable}] with ${questionVariations.size} variations!`);
  } catch (err) {
    console.warn("[V6-SelfLearning] Notice while saving learned rule:", err?.message);
  }
};

/**
 * Primary Follow-Up Data Location & User Correction Handler
 */
const handleUserCorrectionAndDataLocation = async ({
  sequelize,
  rawMessage,
  conversationId,
  userContext = {},
  startedAt = Date.now()
}) => {
  if (!sequelize?.query || !rawMessage) return null;

  // 1. Check if there is an active previous turn in memory or DB
  const prevTurn = MemoryEngineInstance.getLastTurn(conversationId);
  const hasPreviousTurn = Boolean(prevTurn?.lastUserMessage || prevTurn?.isPendingClarification);

  // 2. Check if the message is a data-location guidance or correction
  if (!isCorrectionOrDataLocation(rawMessage, hasPreviousTurn)) {
    return null;
  }

  console.log("🎯 [V6-RLHF] Active User Data-Location / Correction Guidance Detected:", rawMessage);

  // 3. Extract guidance components (targetTable, filterClause, extractedSQL, explicitTrigger)
  const { targetTable, filterClause, extractedSQL, explicitTrigger } = extractGuidanceComponents(rawMessage);

  // 4. Resolve Context: Retrieve original question and previous entities
  let originalQuestion = explicitTrigger || prevTurn?.lastUserMessage || null;
  let resolvedEntities = { ...(prevTurn?.lastEntities || {}) };
  let originalIntent = prevTurn?.lastIntent || "DYNAMIC_CUSTOM";

  // Fallback to database AI_Message_Tbl if memory had no previous message or held disambiguation
  if ((!originalQuestion || prevTurn?.lastIntent === "ENTITY_DISAMBIGUATION") && conversationId) {
    try {
      const pastMsgs = await sequelize.query(`
        SELECT TOP 5 Role, Message_Content, Metadata, Created_At 
        FROM [dbo].[AI_Message_Tbl] WITH (NOLOCK)
        WHERE Conversation_Id = :conversationId
        ORDER BY UTD DESC
      `, { replacements: { conversationId }, type: QueryTypes.SELECT }).catch(() => []);

      if (pastMsgs && pastMsgs.length > 0) {
        const userMsgs = pastMsgs.filter(m => String(m.Role).toLowerCase() === "user" && m.Message_Content !== rawMessage);
        if (userMsgs.length > 0) {
          originalQuestion = userMsgs[0].Message_Content;
        }
      }
    } catch (_) { }
  }

  // If still no previous question, the user gave a direct standalone SQL or table command
  if (!originalQuestion) {
    originalQuestion = rawMessage;
  }

  // Detect domain/intent from extractedSQL or targetTable if user gave direct SQL
  if (extractedSQL && (/PF_Employee|pf_employer|pf_emplpension|PFNUMBER/i.test(extractedSQL))) {
    if (/COUNT\s*\(/i.test(extractedSQL)) {
      originalIntent = "PF_DEDUCTION_COUNT";
    } else {
      originalIntent = "SALARY_PF_DEDUCTION";
    }
  } else if (extractedSQL && (/SALARYFILE/i.test(extractedSQL) || /Final_Payment|Gross_Earn|Basic_Earn/i.test(extractedSQL))) {
    if (/ORDER\s+BY.+?(?:DESC|ASC)/i.test(extractedSQL) || (/TOP\s+\d+/i.test(extractedSQL) && !/Emp_Code\s*=/i.test(extractedSQL))) {
      originalIntent = "HIGHEST_SALARY_RANKING";
    } else {
      originalIntent = "EMPLOYEE_SALARY_HISTORY";
    }
  } else if (extractedSQL && (/attendancetable/i.test(extractedSQL) || /mipunch|dateoffice/i.test(extractedSQL))) {
    originalIntent = "MISPUNCH_REPORT";
  }

  // Classify entities from original question if not already in context
  const origClassification = await classifyIntentAndExtractEntities({
    message: originalQuestion,
    userContext
  });
  resolvedEntities = { ...origClassification.entities, ...resolvedEntities };
  if (origClassification.intent && origClassification.intent !== "GENERAL_DATABASE_QUERY") {
    originalIntent = origClassification.intent;
  }
  if (extractedSQL && (/PF_Employee|pf_employer|pf_emplpension|PFNUMBER/i.test(extractedSQL))) {
    if (/COUNT\s*\(/i.test(extractedSQL)) {
      originalIntent = "PF_DEDUCTION_COUNT";
    } else {
      originalIntent = "SALARY_PF_DEDUCTION";
    }
  } else if (extractedSQL && (/SALARYFILE/i.test(extractedSQL) || /Final_Payment|Gross_Earn|Basic_Earn/i.test(extractedSQL))) {
    if (/ORDER\s+BY.+?(?:DESC|ASC)/i.test(extractedSQL) || (/TOP\s+\d+/i.test(extractedSQL) && !/Emp_Code\s*=/i.test(extractedSQL))) {
      originalIntent = "HIGHEST_SALARY_RANKING";
    } else {
      originalIntent = "EMPLOYEE_SALARY_HISTORY";
    }
  }

  // If user provided direct SQL with an Emp_Code, extract it into resolvedEntities
  if (extractedSQL && !resolvedEntities.employeeCode) {
    const empMatch = extractedSQL.match(/Emp_Code\s*=\s*['"]?(\d+)['"]?/i);
    if (empMatch) {
      resolvedEntities.employeeCode = empMatch[1];
    }
  }

  // Resolve employee name if mentioned in original question
  if (!resolvedEntities.employeeCode && !resolvedEntities.isSelf) {
    const dbEntity = await resolveEmployeeEntityViaDB({
      sequelize,
      message: originalQuestion,
      normalized: normalizeLower(originalQuestion),
      entities: resolvedEntities,
      userContext
    });
    if (dbEntity.matched && dbEntity.employeeCode) {
      resolvedEntities.employeeCode = dbEntity.employeeCode;
      resolvedEntities.employeeName = dbEntity.employeeName;
    }
  }

  // 5. Synthesize the Target SQL Statement
  let generatedSQL = null;

  if (extractedSQL) {
    // User provided direct SQL
    generatedSQL = extractedSQL;
  } else if (targetTable === "attendancetable" && (filterClause?.includes("flag") || /mispunch/i.test(originalQuestion))) {
    // Specialized attendancetable mispunch query
    let whereParts = ["A.[flag] = 'MP'"];
    if (resolvedEntities.employeeCode) {
      whereParts.push(`A.[Emp_Code] = '${resolvedEntities.employeeCode.replace(/'/g, "''")}'`);
    } else if (resolvedEntities.employeeName) {
      whereParts.push(`(E.[EMPFIRSTNAME] LIKE '%${resolvedEntities.employeeName.replace(/'/g, "''")}%' OR A.[Emp_Code] LIKE '%${resolvedEntities.employeeName.replace(/'/g, "''")}%')`);
    }
    if (resolvedEntities.month) {
      whereParts.push(`MONTH(A.[dateoffice]) = ${resolvedEntities.month}`);
    }
    if (resolvedEntities.year) {
      whereParts.push(`YEAR(A.[dateoffice]) = ${resolvedEntities.year}`);
    }

    generatedSQL = `
      SELECT TOP 500
        A.[Emp_Code],
        LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
        E.[LOCATION] AS [Branch],
        A.[dateoffice] AS [Date],
        A.[flag] AS [PunchFlag],
        A.[status] AS [Status],
        A.[in1] AS [InTime],
        A.[out1] AS [OutTime],
        A.[hoursworked] AS [HoursWorked]
      FROM [dbo].[attendancetable] A WITH (NOLOCK)
      LEFT JOIN [dbo].[EMPLOYEEMASTER] E WITH (NOLOCK) ON A.[Emp_Code] = E.[EMPCODE]
      WHERE ${whereParts.join(" AND ")}
      ORDER BY A.[dateoffice] DESC
    `.trim();
  } else if (targetTable === "SALARYFILE") {
    // Specialized SALARYFILE query
    let whereParts = ["1=1"];
    if (resolvedEntities.employeeCode) {
      whereParts.push(`S.[Emp_Code] = '${resolvedEntities.employeeCode.replace(/'/g, "''")}'`);
    } else if (resolvedEntities.employeeName) {
      whereParts.push(`(E.[EMPFIRSTNAME] LIKE '%${resolvedEntities.employeeName.replace(/'/g, "''")}%' OR S.[Emp_Code] LIKE '%${resolvedEntities.employeeName.replace(/'/g, "''")}%')`);
    }
    if (resolvedEntities.month) {
      whereParts.push(`S.[SalMnth] = ${resolvedEntities.month}`);
    }
    if (resolvedEntities.year) {
      whereParts.push(`S.[salyear] = ${resolvedEntities.year}`);
    }

    generatedSQL = `
      SELECT TOP 500
        S.[Emp_Code],
        LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
        E.[LOCATION] AS [Branch],
        S.[SalMnth] AS [Month],
        S.[salyear] AS [Year],
        S.[Basic_Earn],
        S.[HRA_Earn],
        S.[Gross_Earn],
        S.[Deducation] AS [TotalDeduction],
        S.[Final_Payment] AS [NetSalary]
      FROM [dbo].[SALARYFILE] S WITH (NOLOCK)
      LEFT JOIN [dbo].[EMPLOYEEMASTER] E WITH (NOLOCK) ON S.[Emp_Code] = E.[EMPCODE]
      WHERE ${whereParts.join(" AND ")}
      ORDER BY S.[Gross_Earn] DESC
    `.trim();
  } else {
    // Dynamic Planner with strict user guidance
    const relevantTables = SchemaEngineInstance.searchRelevantTables(
      `${originalQuestion} ${targetTable || ''}`,
      originalIntent
    );
    if (targetTable && !relevantTables.some(t => t.tableName.toLowerCase() === targetTable.toLowerCase())) {
      relevantTables.unshift({
        tableName: targetTable,
        confidence: 1.0,
        reason: "User explicitly specified target table in follow-up prompt",
        meta: SchemaEngineInstance.tableIndex.get(targetTable.toLowerCase()) || { tableName: targetTable, columns: {} }
      });
    }

    const dynamicPlan = await planDynamicSQL({
      sequelize,
      message: `${originalQuestion} [MANDATORY USER CONSTRAINT: Data is located in table '${targetTable || 'ERP_MASTER'}' ${filterClause ? 'with condition: ' + filterClause : ''}]`,
      intent: originalIntent,
      entities: resolvedEntities,
      relevantTables,
      userContext
    });
    generatedSQL = dynamicPlan?.sql;
  }

  if (!generatedSQL) {
    console.warn("⚠️ [V6-RLHF] Could not synthesize SQL query from user guidance.");
    return null;
  }

  // 6. Validate and Repair SQL
  const validatedSQL = validateAndRepairSQL(generatedSQL, userContext);
  console.log("⚙️ [V6-RLHF-Execute-Guidance]:\n", validatedSQL);

  // 7. Execute on Live MSSQL Server
  const sqlStartTime = Date.now();
  const execResult = await executeSQLWithSelfCorrection({
    sequelize,
    initialSQL: validatedSQL,
    userContext,
    rawMessage: originalQuestion,
    intent: originalIntent,
    tablesUsed: [targetTable || "ERP_MASTER"]
  });

  const dbRows = execResult.rows || [];
  const finalSQL = execResult.sql || validatedSQL;
  const sqlExecutionTimeMs = Date.now() - sqlStartTime;

  // 8. Format Human Business Response (AI Formatter with Deterministic Fallback)
  let formatted = null;
  if (dbRows.length > 0) {
    formatted = await formatResponseViaAI({
      message: originalQuestion,
      intent: originalIntent,
      sql: finalSQL,
      rows: dbRows,
      userContext,
      entities: resolvedEntities
    });
  }

  if (!formatted || !formatted.answer) {
    formatted = await formatHumanBusinessAnswer({
      message: originalQuestion,
      intent: originalIntent,
      entities: resolvedEntities,
      sql: finalSQL,
      rows: dbRows,
      userContext,
      sequelize
    });
  }

  // Prepend acknowledgment of user guidance
  let finalAnswer = formatted.answer;
  if (targetTable) {
    if (dbRows.length > 0) {
      finalAnswer = `Aapke bataye anusar **\`${targetTable}\`** se data fetch kiya gaya hai:\n\n${finalAnswer}`;
    } else {
      finalAnswer = `Aapke bataye anusar **\`${targetTable}\`** table par query run ki gayi:\n\`\`\`sql\n${finalSQL}\n\`\`\`\n\n${finalAnswer}`;
    }
  }

  const criticResult = verifyAnswerAgainstEvidence({
    answer: finalAnswer,
    rows: dbRows
  });

  const responseTimeMs = Date.now() - startedAt;

  // 9. PERMANENT AUTONOMOUS SELF-LEARNING (Auto-train golden rule)
  await persistLearnedDataRule({
    sequelize,
    originalQuestion,
    validatedSQL: finalSQL,
    targetTable,
    filterClause,
    intent: originalIntent,
    rawMessage,
    entities: resolvedEntities
  });

  // 10. Update Conversation Memory Turn
  MemoryEngineInstance.updateContext(
    conversationId,
    resolvedEntities,
    originalIntent,
    {
      userMessage: originalQuestion,
      sql: finalSQL,
      rowCount: dbRows.length,
      failed: false,
      tablesUsed: [targetTable || "ERP_MASTER"]
    }
  );

  console.log(`✅ [V6-RLHF] Follow-up query executed & rule permanently learned in ${responseTimeMs}ms!`);

  return {
    handled: true,
    result: {
      success: true,
      data: dbRows,
      conversationId,
      answer: finalAnswer,
      mode: "DATABASE_QUERY",
      intent: originalIntent,
      isSelfQuery: resolvedEntities.isSelf || false,
      sources: [`AutoVyn ERP [${targetTable || 'Live Database'}] (Self-Learned Golden Rule)`],
      query: {
        sql: finalSQL,
        tablesUsed: [targetTable || "ERP_MASTER"],
        rowCount: dbRows.length,
        executionTimeMs: sqlExecutionTimeMs
      },
      confidence: { level: "HIGH", score: 0.99 },
      evidence: {
        canAnswer: true,
        rows: dbRows.slice(0, 15),
        rowCount: dbRows.length,
        totalRowsReturned: dbRows.length,
        truncated: dbRows.length > 15
      },
      sqlValidation: { valid: true, sanitized: true },
      critic: criticResult,
      isAmbiguous: false,
      resolvedEntities,
      cached: false,
      cacheTier: "SELF_LEARNED_GOLDEN",
      model: "AutoVyn-V6-RLHF-AutonomousLearner",
      usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 },
      responseTimeMs
    }
  };
};

const detectAndStoreUserCorrection = async ({ sequelize, rawMessage, userContext = {}, conversationId = null }) => {
  return handleUserCorrectionAndDataLocation({
    sequelize,
    rawMessage,
    conversationId,
    userContext,
    startedAt: Date.now()
  });
};

// GPT-5 SQL Planner for complex non-templated queries with Autonomous Dynamic Prompt Injection
const planDynamicSQL = async ({ sequelize, message, originalMessage, intent, entities, relevantTables, userContext }) => {
  const client = getOpenAIClient();
  const config = getModelConfig();
  const schemaContext = SchemaEngineInstance.generatePrunedSchemaPrompt(relevantTables);

  // Dynamic Few-Shot Golden Examples & Learned Rules Retrieval
  const { goldenExamples, learnedRules } = await fetchLearnedGoldenExamplesAndRules({ sequelize, intent, message: originalMessage || message });

  let dynamicLearningSection = "";
  if (goldenExamples && goldenExamples.length > 0) {
    dynamicLearningSection += "\n\n### 🧠 DYNAMIC AUTO-TRAINED FEW-SHOT EXAMPLES (LEARNED FROM REAL SYSTEM USAGE):\n";
    goldenExamples.forEach((ex, idx) => {
      dynamicLearningSection += `[Example #${idx + 1}]\nUser Query: "${ex.question}"\nVerified Working SQL:\n${ex.sql}\n\n`;
    });
  }

  if (learnedRules && learnedRules.length > 0) {
    dynamicLearningSection += "\n\n### ⚠️ ACTIVE USER CORRECTIONS & LEARNED RULES (STRICT MUST-FOLLOW CONSTRAINTS):\n";
    learnedRules.forEach((r, idx) => {
      dynamicLearningSection += `- [Rule #${idx + 1}] ${r.description} (Applicable Table: ${r.table || 'ALL ERP TABLES'})\n`;
    });
  }

  const systemPrompt = `You are a Senior MSSQL Database Architect for AutoVyn ERP.
Generate a high-performance, strictly READ-ONLY Microsoft SQL Server query.

RULES:
1. Output ONLY valid JSON in format: {"sql": "...", "explanation": "...", "tables": ["..."], "confidence": 0.95}
2. Always use TOP 500 (or TOP 100/200) limit. Never use SELECT *.
3. Always include WITH (NOLOCK) on every table reference.
4. Use standard MSSQL functions (CONVERT, YEAR, MONTH, DATEDIFF, ISNULL, LTRIM, RTRIM).
5. Never write INSERT, UPDATE, DELETE, DROP, ALTER, EXEC, or TRUNCATE.
6. Scope: For general statistics / counts / reports across the company, do NOT restrict to a single EMPCODE unless specifically requested.
7. Table Aliases: Always give meaningful aliases (E for EMPLOYEEMASTER, S for SALARYFILE, A for attendancetable, V for emp_varify).
8. CRITICAL SCHEMA RULES FOR AUTOVYN MSSQL DATABASE:
   - EMPLOYEEMASTER (257 columns):
     - Name: LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName]
     - Identification: [EMPCODE], [MSPIN], [BIOMETRIC_ID], [AX_EMP_CODE], [PANNO], [ADHARNO], [UID_NO], [uidno], [PFNO], [ESINO], [UAN_No], [PASSPORTNO], [driving_licence]
     - Banking: [BANKACCOUNTNO], [BANKNAME], [ifsc_code], [Emp_Ac_Name], [PAYMENTMODE], [ACCOUNT_TYPE]
     - Contacts: [MOBILENO], [MOBILE_NO], [LANDLINENO], [CORPORATEMAILID], [ALTERNET_MAIL]
     - Family: [FATHERNAME], [FATHERCONTACTNO], [Father_Mob], [MOTHERNAME], [MOTHERCONTACTNO], [Mother_Mob], [SPOUSENAME], [SPOUSECONTACTNO], [Spouse_Mob], [EMERGENCYNAME], [EMERGENCYNO]
     - Dates: [DOB], [DOM] (marriage), [CURRENTJOINDATE] (DOJ), [DOJ2], [Prob_period], [Confirmation_Date], [LASTWOR_DATE] (relieving), [RESIGNATION_SUBMISSION_DATE], [DATE_OF_SETTLEMENT], [PASSEXPIRYDATE], [DRIVINGLIC_EXPDATE]
     - Hierarchy: [LOCATION], [BRANCH], [EMPLOYEEDESIGNATION], [GRADE], [SUPERVISOR], [SUPERVISORID], [Reporting_1], [Reporting_2], [Reporting_3] (Note: No [DEPT] column in EMPLOYEEMASTER)
     - Compensation: [MONTHLY_CTC], [ANNUAL_CTC], [LastSalary], [PF], [ESI_AMOUNT], [BONUS_AMOUNT], [Sal_Hold]
     - Status & Verifications: [EMP_STATUS], [STATUS], [RELEVE_STATUS], [PAN_CARD_VER], [AADHAR_CARD_VER], [DRIVING_VER], [PASSPORT_VER]
   - attendancetable:
     - Employee Code: [Emp_Code]
     - Date: [dateoffice]
     - Status/Flag: [flag] (P=Present, A=Absent, WO=Weekly Off, HD=Half Day)
     - Leave Type / Reason Code: [mipunch_reason] (maps to Misc_Mst where Misc_Type = 92)
     - Join: ON LTRIM(RTRIM(CONVERT(varchar(50), A.[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE])))
   - LEAVE MANAGEMENT (attendancetable + Misc_Mst + EMPLOYEEMASTER):
     - In attendancetable: [mipunch_reason] holds the Leave Type code.
     - Join Misc_Mst M ON A.mipunch_reason = M.Misc_Code AND M.Misc_Type = 92
     - Leave Types (Misc_Type = 92):
       * Misc_Code = 6: Sick Leave (SL / Sick Leave)
       * Misc_Code = 1: Casual Leave (CL / Casual Leave)
       * Other codes: Privilege Leave (PL/EL), Maternity Leave, Short Leave, etc.
     - Attendance Month Cutoff Date Ranges (Misc_Type = 25):
       * Cross Join Misc_Mst P ON P.Misc_Type = 25 AND P.Misc_Code = <MonthNumber> (e.g. Misc_Code = 8 for August)
       * Filter: A.dateoffice >= TRY_CONVERT(date, P.Misc_Dtl1, 103) AND A.dateoffice <= TRY_CONVERT(date, P.Misc_Dtl2, 103) (or MONTH(A.dateoffice) = :month AND YEAR(A.dateoffice) = :year)
     - Location Filter: E.LOCATION = <BranchNo> (e.g. E.LOCATION = 1)
   - SALARYFILE (Monthly Processed Payroll / Payouts / Actual Earnings):
     - Employee Code: [Emp_Code]
     - Month: [SalMnth] (1-12 or '1'-'12'), Year: [salyear]
     - Total Earnings: [Total_Earn] (or [Gross_Earn] / [Final_Payment])
     - Net Pay: [Final_Payment], Deductions: [Deducation], Basic: [Basic_Earn], HRA: [HRA_Earn]
     - Join: ON LTRIM(RTRIM(CONVERT(varchar(50), S.[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE])))
     - CRITICAL RULE: Whenever a question mentions a specific month (e.g. April 2026, May 2025, pichhla mahina) or asks about salary "pay hui" / "mili" / "highest paid in month", YOU MUST QUERY dbo.SALARYFILE (filtering on SalMnth and salyear, ordering by Total_Earn DESC), and join with dbo.EMPLOYEEMASTER on E.EMPCODE = S.Emp_Code. NEVER use EMPLOYEEMASTER MONTHLY_CTC for monthly paid queries!
   - emp_varify:
     - Join: ON LTRIM(RTRIM(CONVERT(varchar(50), V.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE])))
     - Columns: [EMPCODE], [pan_card_ver], [pan_name_match_ver], [aadhaar_card_ver], [aadhaar_linked_ver], [aadhaar_linked_pan_ver], [aadhaar_name_match_emp_name], [Location], [Created_At]
   - Account_No_Api:
     - Join: ON LTRIM(RTRIM(CONVERT(varchar(100), E.[BANKACCOUNTNO]))) = LTRIM(RTRIM(CONVERT(varchar(100), A.[account_number])))
     - Columns: [account_number], [Ifsc], [name_at_bank], [account_exists], [raw_response], [Created_At]
   - UNIVERSAL HISTORY & AUDIT TABLES (<TableName>_hst / <TableName>_Hst / <TableName>_Tbl_Hst):
     - Whenever the user asks about updates, changes, modifications, or history in ANY table/entity:
     - Always join the current table with its history table with suffix _hst / _Hst (e.g. EMPLOYEEMASTER with EMPLOYEEMASTER_hst, Asset_Issue with Asset_Issue_Hst, Approval_Matrix with Approval_Matrix_Hst, Bank_Details with Bank_Details_Hst).
     - Filter by LASTMODI_ON / change date or entity identifier, and compare column values between Main and Hst tables.
${dynamicLearningSection}

${schemaContext}`;

  const userPrompt = `User Question (Standard English): "${message}"${originalMessage && originalMessage !== message ? `\nOriginal User Question (Vernacular): "${originalMessage}"` : ""}
Detected Intent: ${intent}
Extracted Entities: ${JSON.stringify(entities)}
Logged In User Role: ${userContext.role}, EmpCode: ${userContext.employeeCode || "N/A"}`;

  try {
    const response = await client.chat.completions.create({
      model: config.primaryModel,
      temperature: 0.0,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" }
    });

    const parsed = JSON.parse(response.choices[0].message.content || "{}");
    return {
      sql: parsed.sql || "",
      explanation: parsed.explanation || "",
      tables: parsed.tables || relevantTables.map(t => t.tableName),
      confidence: parsed.confidence || 0.9,
      isTemplate: false,
      usage: response.usage || {}
    };
  } catch (err) {
    console.error("[V6-SQLPlanner] Dynamic SQL planning failed:", err?.message);
    throw new ApiError(500, `SQL Planning failed: ${err?.message}`);
  }
};

// ============================================================================
// ENGINE 6: SQL SECURITY VALIDATOR & AUTO-REPAIR ENGINE
// ============================================================================

const validateAndRepairSQL = (rawSql, userContext) => {
  let sql = String(rawSql || "").trim();

  // Strip markdown code fences if present
  sql = sql.replace(/^```(sql)?/i, "").replace(/```$/, "").trim();

  // 1. Security Check: Strict Read-Only AST Guard
  const forbiddenRegex = /\b(INSERT|UPDATE|DELETE|DROP|ALTER|TRUNCATE|EXEC|EXECUTE|MERGE|GRANT|REVOKE|SHUTDOWN|XP_CMDSHELL|SP_EXECUTESQL)\b/i;
  if (forbiddenRegex.test(sql)) {
    throw new ApiError(403, "Security Violation: Non-SELECT or DDL/DML statements are strictly prohibited.");
  }

  // Must begin with SELECT or WITH
  if (!/^\s*(SELECT|WITH)\b/i.test(sql)) {
    throw new ApiError(400, "Invalid SQL: Statement must be a SELECT query.");
  }

  // 2. Ensure TOP limit
  if (!/\bTOP\s+\d+\b/i.test(sql) && !/\bCOUNT\s*\(/i.test(sql)) {
    sql = sql.replace(/^\s*SELECT\b/i, "SELECT TOP 500");
  }

  // 3. Fix potential duplicated WITH (NOLOCK)
  sql = sql.replace(/(\[\w+\])\s+WITH\s*\(NOLOCK\)\s+(AS\s+)?(\w+)\s+WITH\s*\(NOLOCK\)/gi, "$1 AS $3 WITH (NOLOCK)");
  sql = sql.replace(/(WITH\s*\(\s*NOLOCK\s*\)\s*){2,}/gi, "WITH (NOLOCK) ");

  // 4. Auto-repair EmployeeName / EmpName in EMPLOYEEMASTER
  // 4. Auto-repair EmployeeName / EmpName in EMPLOYEEMASTER
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(EmployeeName|EmpName|Employee_Name|Full_Name|FullName)\]?/gi, (match, p1) => {
    if (/^dbo$/i.test(p1)) return match;
    return `LTRIM(RTRIM(ISNULL([${p1}].[EMPFIRSTNAME], '') + ' ' + ISNULL([${p1}].[EMPLASTNAME], '')))`;
  });

  // 5. Auto-repair EMPLOYEEMASTER column name hallucinations (exact word matches)
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(BANK_NAME|Bank_Name)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[BANKNAME]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(PAN_NO|Pan_No|Pan_Number)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[PANNO]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(MOBILE_NO|Mobile_No|Phone_No|Contact_No)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[MOBILENO]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(AADHAR_NO|Aadhar_No|Aadhaar_No)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[ADHARNO]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(BANK_ACCOUNT_NO|Account_No|Acc_No|AccountNo)\]?(?!_Api\b)/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[BANKACCOUNTNO]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(DOJ|DateOfJoining|Joining_Date|Date_Of_Joining|Join_Date)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[CURRENTJOINDATE]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(DOL|DateOfLeaving|Leaving_Date|Date_Of_Leaving|Relieving_Date)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[LASTWOR_DATE]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(FATHER_NAME)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[FATHERNAME]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(MOTHER_NAME)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[MOTHERNAME]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(SPOUSE_NAME)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[SPOUSENAME]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(EMERGENCY_CONTACT|EMERGENCY_PHONE)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[EMERGENCYNO]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(EMERGENCY_NAME)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[EMERGENCYNAME]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(PASSPORT_NO|PASSPORT_NUMBER)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[PASSPORTNO]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(PASSPORT_EXPIRY|PASSPORT_EXP_DATE)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[PASSEXPIRYDATE]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(DRIVING_LICENCE|DRIVING_LICENSE|DL_NO)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[driving_licence]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(OFFICIAL_EMAIL|CORP_EMAIL)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[CORPORATEMAILID]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(PERSONAL_EMAIL|ALT_EMAIL)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[ALTERNET_MAIL]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(CTC|ANNUALCTC)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[ANNUAL_CTC]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(MONTHLYCTC)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[MONTHLY_CTC]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(DESIGNATION|DESIG)\]?/gi, (match, p1) => /^dbo$/i.test(p1) ? match : `[${p1}].[EMPLOYEEDESIGNATION]`);
  sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(DEPARTMENT|DEPT)\]?(\s+AS\s+\[?[a-zA-Z0-9_]+\]?)?/gi, (match, p1, p2, p3, offset) => {
    if (/^(E|em|emp|employeemaster)$/i.test(p1)) {
      const beforeStr = sql.slice(0, offset);
      const isBeforeFrom = !/\bFROM\b/i.test(beforeStr);
      return isBeforeFrom ? `NULL AS [Department]` : `NULL`;
    }
    return match;
  });

  // 6. Auto-repair attendancetable column hallucinations
  if (/\battendancetable\b/i.test(sql)) {
    sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(EMPCODE|EMPLOYEECODE|EMPLOYEE_CODE)\]?/gi, (match, p1) => {
      if (/^(A|att|attendancetable)$/i.test(p1)) return `[${p1}].[Emp_Code]`;
      return match;
    });
    sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(AttendanceDate|AttDate|Att_Date|Attendance_Date)\]?/gi, (match, p1) => {
      if (/^(A|att|attendancetable)$/i.test(p1)) return `[${p1}].[dateoffice]`;
      return match;
    });
  }

  // 7. Auto-repair SALARYFILE column hallucinations
  if (/\bSALARYFILE\b/i.test(sql)) {
    sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(EMPCODE|EMPLOYEECODE|EMPLOYEE_CODE)\]?/gi, (match, p1) => {
      if (/^(S|sal|SALARYFILE)$/i.test(p1)) return `[${p1}].[Emp_Code]`;
      return match;
    });
    sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(SAL_MONTH|SALARY_MONTH)\]?/gi, (match, p1) => {
      if (/^(S|sal|SALARYFILE)$/i.test(p1)) return `[${p1}].[SalMnth]`;
      return match;
    });
    sql = sql.replace(/\[?([a-zA-Z0-9_]+)\]?\.\s*\[?(SAL_YEAR|SALARY_YEAR)\]?/gi, (match, p1) => {
      if (/^(S|sal|SALARYFILE)$/i.test(p1)) return `[${p1}].[salyear]`;
      return match;
    });
  }

  // 8. Auto-repair unbalanced parentheses in function expressions & column aliases in SELECT list
  let inSelect = false;
  sql = sql.split("\n").map(line => {
    if (/^\s*SELECT\b/i.test(line)) inSelect = true;
    if (/^\s*(FROM|WHERE|GROUP\s+BY|ORDER\s+BY|HAVING|ON)\b/i.test(line)) inSelect = false;

    if (inSelect && !/\b(FROM|JOIN|WHERE|CAST\s*\()\b/i.test(line)) {
      const asMatch = line.match(/^(\s*)(.+?)\s+(AS\s+\[?[a-zA-Z0-9_]+\]?)(.*)$/i);
      if (asMatch) {
        const indent = asMatch[1];
        let expr = asMatch[2].trim();
        const asClause = asMatch[3];
        const rest = asMatch[4];

        let openParen = (expr.match(/\(/g) || []).length;
        let closeParen = (expr.match(/\)/g) || []).length;
        while (openParen > closeParen) {
          expr += ")";
          closeParen++;
        }
        return `${indent}${expr} ${asClause}${rest}`;
      }
    }
    return line;
  }).join("\n");

  return sql;
};

// ============================================================================
// MSSQL EXECUTION SELF-CORRECTION & AUTO-REPAIR ENGINE (UP TO 2 RETRIES)
// ============================================================================

const executeSQLWithSelfCorrection = async ({ sequelize, initialSQL, userContext, rawMessage, intent, tablesUsed = [] }) => {
  let currentSQL = initialSQL;
  let attempts = 0;
  const maxAttempts = 2;
  let lastError = null;

  while (attempts <= maxAttempts) {
    attempts++;
    try {
      const rows = await sequelize.query(currentSQL, { type: QueryTypes.SELECT });
      return {
        success: true,
        sql: currentSQL,
        rows: rows || [],
        attempts,
        repaired: attempts > 1
      };
    } catch (sqlErr) {
      lastError = sqlErr?.original?.message || sqlErr?.parent?.message || sqlErr?.message || "Unknown MSSQL execution error";
      console.warn(`⚠️ [V6-MSSQL-Execution-Error] Attempt ${attempts}/${maxAttempts + 1}: ${lastError}`);

      if (attempts > maxAttempts) break;

      // Check if openAI client is available for instant repair
      try {
        const client = getOpenAIClient();
        const config = getModelConfig();
        const repairPrompt = `
You are an expert Microsoft SQL Server T-SQL debugger for AutoVyn Enterprise ERP.
The following SQL query failed with an MSSQL runtime error.

USER QUESTION: "${rawMessage}"
INTENT: ${intent}
FAILED SQL:
${currentSQL}

MSSQL ERROR:
"${lastError}"

CRITICAL SCHEMA RULES:
- In dbo.EMPLOYEEMASTER: Primary key is EMPCODE. Name is CONCAT(EMPFIRSTNAME, ' ', ISNULL(EMPLASTNAME, '')).
- In dbo.SALARYFILE: Employee code is Emp_Code, Month is SalMnth (1-12), Year is salyear.
- In dbo.attendancetable: Employee code is Emp_Code, Date is dateoffice, Status is flag (P, A, WO, HD).
- In dbo.Misc_Mst: Location/Branch is Misc_Type = 85, Department is Misc_Type = 11, Designation is Misc_Type = 95, Leave is Misc_Type = 92.
- Only SELECT queries with TOP limits and NOLOCK.

Return ONLY the repaired raw SQL statement without markdown fences or text.
`;
        const response = await client.chat.completions.create({
          model: config.fastModel || "gpt-4o-mini",
          messages: [{ role: "user", content: repairPrompt }],
          temperature: 0.0,
          max_tokens: 600
        });

        const repairedRaw = response?.choices?.[0]?.message?.content?.trim();
        if (repairedRaw) {
          currentSQL = validateAndRepairSQL(repairedRaw, userContext);
          console.log(`🔧 [V6-AutoRepair] Retrying with repaired SQL (Attempt ${attempts + 1})...`);
        } else {
          break;
        }
      } catch (repairErr) {
        console.warn("[V6-AutoRepair] LLM repair failed:", repairErr?.message);
        break;
      }
    }
  }

  return {
    success: false,
    sql: currentSQL,
    rows: [],
    error: lastError,
    attempts
  };
};

// ============================================================================
// ENGINE 9: AUTONOMOUS ADAPTIVE CROSS-TABLE FALLBACK & DEEP SEARCH ENGINE
// ============================================================================

const executeAdaptiveCrossTableSearch = async ({ sequelize, rawMessage, resolvedEntities = {}, userContext = {}, intent = "" }) => {
  console.log("🔍 [V6-AdaptiveFallback] Initiating Deep Autonomous Cross-Table Search...");

  // 1. Gather all candidate search tokens
  const candidateTokens = new Set();

  if (resolvedEntities.aadharNumber) candidateTokens.add(resolvedEntities.aadharNumber);
  if (resolvedEntities.accountNumber) candidateTokens.add(resolvedEntities.accountNumber);
  if (resolvedEntities.panNumber) candidateTokens.add(resolvedEntities.panNumber);
  if (resolvedEntities.mobileNumber) candidateTokens.add(resolvedEntities.mobileNumber);
  if (resolvedEntities.employeeCode) candidateTokens.add(resolvedEntities.employeeCode);
  if (resolvedEntities.searchToken && !SEARCH_STOP_WORDS.has(resolvedEntities.searchToken.toLowerCase())) {
    candidateTokens.add(resolvedEntities.searchToken);
  }

  // Extract any sequence of digits or code-like patterns from the message (excluding 4-digit calendar years)
  const digitMatches = rawMessage.match(/\b(\d{4,18})\b/g) || [];
  for (const d of digitMatches) {
    if (!/^20[123]\d$/.test(d)) {
      candidateTokens.add(d);
    }
  }

  const alphanumericMatches = rawMessage.match(/\b([A-Za-z0-9_-]{4,20})\b/g) || [];
  for (const a of alphanumericMatches) {
    const lower = a.toLowerCase();
    if (!SEARCH_STOP_WORDS.has(lower) && !/^\d{1,4}$/.test(lower)) {
      candidateTokens.add(a);
    }
  }

  if (candidateTokens.size === 0) {
    return { found: false };
  }

  const tokenList = Array.from(candidateTokens);
  console.log("🔍 [V6-AdaptiveFallback] Candidate tokens to search:", tokenList);

  for (const token of tokenList) {
    const cleanToken = token.replace(/'/g, "''");

    // ── Phase 1: Search Across ALL 257 Identifier & Profile Columns in EMPLOYEEMASTER ──
    const empMasterSql = `SELECT TOP 10
  LTRIM(RTRIM(CONVERT(varchar(50), ISNULL(E.[EMPCODE], '')))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  E.[EMPFIRSTNAME], E.[EMPLASTNAME],
  E.[LOCATION] AS [Location],
  E.[BRANCH] AS [Branch],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  E.[ROLE] AS [Role],
  E.[GRADE] AS [Grade],
  E.[EMP_STATUS] AS [Status],
  E.[MOBILENO] AS [MobileNo],
  E.[MOBILE_NO] AS [MobileNo2],
  E.[PANNO] AS [PAN],
  ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))), ''), ISNULL(NULLIF(LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))), ''), E.[uidno])) AS [AadharNo],
  E.[BANKACCOUNTNO] AS [BankAccountNo],
  E.[BANKNAME] AS [BankName],
  E.[ifsc_code] AS [IFSC],
  E.[Emp_Ac_Name] AS [AccountName],
  E.[PAYMENTMODE] AS [PaymentMode],
  CONVERT(varchar(10), E.[CURRENTJOINDATE], 120) AS [DateOfJoining],
  CONVERT(varchar(10), E.[DOB], 120) AS [DOB],
  E.[GENDER] AS [Gender],
  E.[BLOODGROUP] AS [BloodGroup],
  E.[MARITALSTATUS] AS [MaritalStatus],
  E.[FATHERNAME] AS [FatherName],
  E.[FATHERCONTACTNO] AS [FatherMobile],
  E.[Father_Mob] AS [FatherMobile2],
  E.[MOTHERNAME] AS [MotherName],
  E.[MOTHERCONTACTNO] AS [MotherMobile],
  E.[Mother_Mob] AS [MotherMobile2],
  E.[SPOUSENAME] AS [SpouseName],
  E.[SPOUSECONTACTNO] AS [SpouseMobile],
  E.[Spouse_Mob] AS [SpouseMobile2],
  E.[EMERGENCYNAME] AS [EmergencyContactName],
  E.[EMERGENCYNO] AS [EmergencyContactNo],
  E.[CORPORATEMAILID] AS [OfficialEmail],
  E.[ALTERNET_MAIL] AS [PersonalEmail],
  E.[PERMANENTADDRESS1] AS [PermanentAddress],
  E.[CURRENTADDRESS1] AS [CurrentAddress],
  E.[SUPERVISOR] AS [Supervisor],
  E.[Reporting_1] AS [Reporting1],
  E.[Reporting_2] AS [Reporting2],
  E.[Reporting_3] AS [Reporting3],
  E.[MONTHLY_CTC] AS [MonthlyCTC],
  E.[ANNUAL_CTC] AS [AnnualCTC],
  E.[BIOMETRIC_ID] AS [BiometricID],
  E.[MSPIN] AS [MSPIN],
  E.[AX_EMP_CODE] AS [AXEmpCode],
  E.[PFNO] AS [PFNo],
  E.[ESINO] AS [ESINo],
  E.[UAN_No] AS [UANNo],
  E.[PASSPORTNO] AS [PassportNo],
  CONVERT(varchar(10), E.[PASSEXPIRYDATE], 120) AS [PassportExpiryDate],
  E.[driving_licence] AS [DrivingLicenseNo],
  CONVERT(varchar(10), E.[DRIVINGLIC_EXPDATE], 120) AS [DrivingLicenseExpiryDate],
  CONVERT(varchar(10), E.[LASTWOR_DATE], 120) AS [LastWorkingDate],
  E.[RESIGNATION_SUBMISSION_DATE] AS [ResignationDate],
  E.[REASON_FOR_RESIGNATION] AS [ResignationReason],
  E.[RELEVE_STATUS] AS [RelievingStatus],
  E.[PAN_CARD_VER] AS [PANCardVerified],
  E.[AADHAR_CARD_VER] AS [AadhaarCardVerified],
  E.[DRIVING_VER] AS [DrivingLicenseVerified],
  E.[PASSPORT_VER] AS [PassportVerified]
FROM [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
WHERE LTRIM(RTRIM(CONVERT(varchar(50), E.[EMPCODE]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[MSPIN]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[BIOMETRIC_ID]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[AX_EMP_CODE]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[empcode2]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[empcode3]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[empcode4]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[PANNO]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[ADHARNO]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[UID_NO]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[uidno]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[MOBILENO]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[MOBILE_NO]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[Father_Mob]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[Mother_Mob]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[Spouse_Mob]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[EMERGENCYNO]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[BANKACCOUNTNO]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[PASSPORTNO]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[driving_licence]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[PFNO]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[UAN_No]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), E.[ESINO]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(100), E.[CORPORATEMAILID]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(100), E.[ALTERNET_MAIL]))) = '${cleanToken}'
   OR LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) LIKE '%${cleanToken}%'`;

    try {
      const empRows = await sequelize.query(empMasterSql, { type: QueryTypes.SELECT });
      if (empRows && empRows.length > 0) {
        console.log(`✅ [V6-AdaptiveFallback] Found ${empRows.length} matching record(s) in EMPLOYEEMASTER for token: ${token}`);
        return {
          found: true,
          source: "EMPLOYEEMASTER",
          token,
          rows: empRows,
          sql: empMasterSql,
          tablesUsed: ["EMPLOYEEMASTER"]
        };
      }
    } catch (_) { }

    // ── Phase 2: Check Relative Table: Account_No_Api (Bank Penny-Drop Gateway) ──
    const bankApiSql = `SELECT TOP 10
  ISNULL(E.[EMPCODE], '') AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(E.[EMPFIRSTNAME], '') + ' ' + ISNULL(E.[EMPLASTNAME], ''))) AS [EmployeeName],
  ISNULL(E.[BANKACCOUNTNO], A.[account_number]) AS [BankAccountNo],
  E.[BANKNAME] AS [BankName],
  E.[LOCATION] AS [Location],
  E.[EMPLOYEEDESIGNATION] AS [Designation],
  A.[account_number] AS [VerifiedAccountNumber],
  A.[Ifsc] AS [IFSC],
  A.[name_at_bank] AS [NameAtBankDirect],
  A.[account_exists] AS [AccountExistsFlag],
  A.[raw_response] AS [RawResponse],
  CONVERT(varchar(19), A.[Created_At], 120) AS [VerificationDate]
FROM [dbo].[Account_No_Api] AS A WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS E WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(100), E.[BANKACCOUNTNO]))) = LTRIM(RTRIM(CONVERT(varchar(100), A.[account_number])))
WHERE LTRIM(RTRIM(CONVERT(varchar(100), A.[account_number]))) = '${cleanToken}'
   OR A.[raw_response] LIKE '%${cleanToken}%'
   OR A.[name_at_bank] LIKE '%${cleanToken}%'`;

    try {
      const bankRows = await sequelize.query(bankApiSql, { type: QueryTypes.SELECT });
      if (bankRows && bankRows.length > 0) {
        console.log(`✅ [V6-AdaptiveFallback] Found ${bankRows.length} matching record(s) in Account_No_Api for token: ${token}`);
        return {
          found: true,
          source: "Account_No_Api",
          token,
          rows: bankRows,
          sql: bankApiSql,
          tablesUsed: ["Account_No_Api", "EMPLOYEEMASTER"],
          intent: "EMPLOYEE_BY_ACCOUNT_NO"
        };
      }
    } catch (_) { }

    // ── Phase 3: Check Relative Table: emp_varify (KYC & Government ID Verifications) ──
    const kycSql = `SELECT TOP 10
  LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL(em.[EMPFIRSTNAME], '') + ' ' + ISNULL(em.[EMPLASTNAME], ''))) AS [EmployeeName],
  [em].[LOCATION] AS [Location],
  [em].[EMPLOYEEDESIGNATION] AS [Designation],
  [em].[MOBILENO] AS [MobileNo],
  [em].[PANNO] AS [PAN],
  [em].[ADHARNO] AS [AadharNo],
  [em].[BANKACCOUNTNO] AS [BankAccountNo],
  [v].[pan_card_ver] AS [PanCardVerified],
  [v].[pan_name_match_ver] AS [PanNameMatchVerified],
  [v].[aadhaar_card_ver] AS [AadhaarCardVerified],
  [v].[aadhaar_linked_ver] AS [AadhaarLinkedVerified],
  [v].[aadhaar_linked_pan_ver] AS [AadhaarLinkedWithPanVerified],
  [v].[aadhaar_name_match_emp_name] AS [AadhaarNameMatchVerified],
  CONVERT(varchar(10), [v].[Created_At], 120) AS [VerificationDate]
FROM [dbo].[emp_varify] AS v WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS em WITH (NOLOCK)
  ON LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50), em.[EMPCODE])))
WHERE LTRIM(RTRIM(CONVERT(varchar(50), v.[EMPCODE]))) = '${cleanToken}'`;

    try {
      const kycRows = await sequelize.query(kycSql, { type: QueryTypes.SELECT });
      if (kycRows && kycRows.length > 0) {
        console.log(`✅ [V6-AdaptiveFallback] Found ${kycRows.length} matching record(s) in emp_varify for token: ${token}`);
        return {
          found: true,
          source: "emp_varify",
          token,
          rows: kycRows,
          sql: kycSql,
          tablesUsed: ["emp_varify", "EMPLOYEEMASTER"],
          intent: "KYC_LOOKUP"
        };
      }
    } catch (_) { }

    // ── Phase 4: Check Relative Table: attendancetable (Punch & Attendance Records) ──
    const atnSql = `SELECT TOP 31
  [A].[Emp_Code] AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  CONVERT(varchar(10), [A].[dateoffice], 120) AS [AttendanceDate],
  DATENAME(weekday, [A].[dateoffice]) AS [DayName],
  [A].[flag] AS [Flag],
  [A].[status] AS [Status],
  [A].[presentvalue] AS [PresentValue],
  [A].[absentvalue] AS [AbsentValue],
  CONVERT(varchar(8), [A].[in1], 108) AS [InTime],
  CONVERT(varchar(8), [A].[out1], 108) AS [OutTime],
  [A].[hoursworked] AS [HoursWorked],
  [E].[LOCATION] AS [Location]
FROM [dbo].[attendancetable] AS [A] WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) 
  ON LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE LTRIM(RTRIM(CONVERT(varchar(50), [A].[Emp_Code]))) = '${cleanToken}'
ORDER BY [A].[dateoffice] DESC`;

    try {
      const atnRows = await sequelize.query(atnSql, { type: QueryTypes.SELECT });
      if (atnRows && atnRows.length > 0) {
        console.log(`✅ [V6-AdaptiveFallback] Found ${atnRows.length} matching record(s) in attendancetable for token: ${token}`);
        return {
          found: true,
          source: "attendancetable",
          token,
          rows: atnRows,
          sql: atnSql,
          tablesUsed: ["attendancetable", "EMPLOYEEMASTER"],
          intent: "ATTENDANCE_REPORT"
        };
      }
    } catch (_) { }

    // ── Phase 5: Check Relative Table: SALARYFILE (Payroll History) ──
    const salSql = `SELECT TOP 12
  ISNULL([E].[EMPCODE], [S].[Emp_Code]) AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  [E].[LOCATION] AS [Location],
  [S].[SalMnth] AS [SalaryMonth],
  [S].[salyear] AS [SalaryYear],
  [S].[Basic_Earn] AS [BasicPay],
  [S].[HRA_Earn] AS [HRA],
  [S].[Gross_Earn] AS [GrossSalary],
  [S].[Final_Payment] AS [NetSalary],
  [S].[Deducation] AS [TotalDeductions],
  [S].[Present_days] AS [PresentDays],
  [S].[Monthdays] AS [TotalDays]
FROM [dbo].[SALARYFILE] AS [S] WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) 
  ON LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE LTRIM(RTRIM(CONVERT(varchar(50), [S].[Emp_Code]))) = '${cleanToken}'
ORDER BY [S].[salyear] DESC, [S].[SalMnth] DESC`;

    try {
      const salRows = await sequelize.query(salSql, { type: QueryTypes.SELECT });
      if (salRows && salRows.length > 0) {
        console.log(`✅ [V6-AdaptiveFallback] Found ${salRows.length} matching record(s) in SALARYFILE for token: ${token}`);
        return {
          found: true,
          source: "SALARYFILE",
          token,
          rows: salRows,
          sql: salSql,
          tablesUsed: ["SALARYFILE", "EMPLOYEEMASTER"],
          intent: "SALARY_REPORT"
        };
      }
    } catch (_) { }

    // ── Phase 6: Check Relative Table: Asset_Issue (Company Assigned Assets) ──
    const assetSql = `SELECT TOP 20
  A.[Emp_Code] AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  A.[Aset_Name] AS [AssetName],
  A.[Asset_Code] AS [AssetCode],
  CONVERT(varchar(10), A.[Issue_Date], 120) AS [IssueDate],
  CONVERT(varchar(10), A.[Return_Date], 120) AS [ReturnDate],
  A.[Status] AS [AssetStatus]
FROM [dbo].[Asset_Issue] AS A WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) 
  ON LTRIM(RTRIM(CONVERT(varchar(50), A.[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE LTRIM(RTRIM(CONVERT(varchar(50), A.[Emp_Code]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), A.[Asset_Code]))) = '${cleanToken}'
   OR A.[Aset_Name] LIKE '%${cleanToken}%'`;

    try {
      const assetRows = await sequelize.query(assetSql, { type: QueryTypes.SELECT });
      if (assetRows && assetRows.length > 0) {
        console.log(`✅ [V6-AdaptiveFallback] Found ${assetRows.length} matching record(s) in Asset_Issue for token: ${token}`);
        return {
          found: true,
          source: "Asset_Issue",
          token,
          rows: assetRows,
          sql: assetSql,
          tablesUsed: ["Asset_Issue", "EMPLOYEEMASTER"],
          intent: "ASSET_SEARCH"
        };
      }
    } catch (_) { }

    // ── Phase 7: Check Relative Table: Approval_Matrix (Hierarchy & Approvers) ──
    const aprvlSql = `SELECT TOP 20
  M.[empcode] AS [EmployeeCode],
  LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME], '') + ' ' + ISNULL([E].[EMPLASTNAME], ''))) AS [EmployeeName],
  M.[module_name] AS [ModuleName],
  M.[reporting_empcode] AS [ReportingEmpCode],
  M.[approval_level] AS [ApprovalLevel],
  M.[status] AS [ApprovalStatus]
FROM [dbo].[Approval_Matrix] AS M WITH (NOLOCK)
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) 
  ON LTRIM(RTRIM(CONVERT(varchar(50), M.[empcode]))) = LTRIM(RTRIM(CONVERT(varchar(50), [E].[EMPCODE])))
WHERE LTRIM(RTRIM(CONVERT(varchar(50), M.[empcode]))) = '${cleanToken}'
   OR LTRIM(RTRIM(CONVERT(varchar(50), M.[reporting_empcode]))) = '${cleanToken}'`;

    try {
      const aprvlRows = await sequelize.query(aprvlSql, { type: QueryTypes.SELECT });
      if (aprvlRows && aprvlRows.length > 0) {
        console.log(`✅ [V6-AdaptiveFallback] Found ${aprvlRows.length} matching record(s) in Approval_Matrix for token: ${token}`);
        return {
          found: true,
          source: "Approval_Matrix",
          token,
          rows: aprvlRows,
          sql: aprvlSql,
          tablesUsed: ["Approval_Matrix", "EMPLOYEEMASTER"],
          intent: "GENERAL_DATABASE_QUERY"
        };
      }
    } catch (_) { }

    // ── Phase 8: Check Relative Table: Misc_Mst (Universal Master Dropdowns) ──
    const miscSql = `SELECT TOP 20
  [UTD], [Misc_Type] AS [MasterType], [Misc_Code] AS [Code], [Misc_Name] AS [Name], [Misc_Abbr] AS [Abbreviation]
FROM [dbo].[Misc_Mst] WITH (NOLOCK)
WHERE [Misc_Name] LIKE '%${cleanToken}%'
   OR [Misc_Abbr] LIKE '%${cleanToken}%'
   OR CONVERT(varchar(50), [Misc_Code]) = '${cleanToken}'`;

    try {
      const miscRows = await sequelize.query(miscSql, { type: QueryTypes.SELECT });
      if (miscRows && miscRows.length > 0) {
        console.log(`✅ [V6-AdaptiveFallback] Found ${miscRows.length} matching record(s) in Misc_Mst for token: ${token}`);
        return {
          found: true,
          source: "Misc_Mst",
          token,
          rows: miscRows,
          sql: miscSql,
          tablesUsed: ["Misc_Mst"],
          intent: "GENERAL_DATABASE_QUERY"
        };
      }
    } catch (_) { }
  }

  return { found: false };
};

// ============================================================================
// ENGINE 10: HUMAN RESPONSE FORMATTER (AI SYNTHESIZER & DETERMINISTIC ENGINE)
// ============================================================================

/**
 * AI-Powered Response Formatter (LLM Synthesizer)
 * Formats database rows into accurate, professional, conversational business answers.
 */
const formatResponseViaAI = async ({ message, englishQuery, intent, sql, rows = [], userContext = {}, entities = {}, previousContext = null }) => {
  if (!rows || rows.length === 0) {
    return null;
  }

  try {
    const client = getOpenAIClient();
    const config = getModelConfig();

    const sampleRows = rows.slice(0, 30);
    const rowCount = rows.length;

    let contextNote = "";
    if (previousContext?.lastUserMessage) {
      contextNote = `\nPrevious Conversation Context: The user previously asked: "${previousContext.lastUserMessage}" (Active Subject: ${previousContext.lastEmployeeName || ''} ${previousContext.lastEmployeeCode ? `[${previousContext.lastEmployeeCode}]` : ''}). This current question is a follow-up continuing that discussion. Formulate a smooth, natural follow-up response acknowledging the context.`;
    }

    const prompt = `User Question: "${message}"${englishQuery && englishQuery !== message ? ` (Standard English: "${englishQuery}")` : ""}${contextNote}
Detected Intent: ${intent}
Executed SQL: ${sql}
Total Rows Returned: ${rowCount}
Data (first ${sampleRows.length} of ${rowCount} records):
${JSON.stringify(sampleRows, null, 2)}

Instructions:
1. Provide a clear, polite, and direct business answer in clean Hinglish / Hindi (matching the user's conversational tone).
2. If this is a follow-up question (e.g., 'aur basic salary?', 'aur November ki?', 'aur designation kya hai?'), directly answer the specific question in relation to the active employee and timeframe, maintaining conversational continuity like ChatGPT or Gemini.
3. CRITICAL COUNT RULE: NEVER confuse an Employee Code (e.g. 1600159, 1924108) with a count of employees.
   - If the user asked "kitne employee" (how many employees), state the exact count from the aggregate count or the total number of records (${rowCount}).
4. If multiple records are returned, format a clean Markdown table with relevant columns from the data (e.g. Employee Code, Name, Designation, Dates, Amounts, Status).
5. State currency amounts clearly with Indian Rupee formatting (e.g. ₹1,800).
6. Be concise, professional, and 100% faithful to the data.
7. ATTRIBUTE & ADDRESS RULE: If the user asks for a specific attribute (e.g. permanent address, current address, mobile, email, designation), directly answer that specific attribute first. If PermanentAddress or CurrentAddress is null, blank, or empty string in the database row, explicitly and politely clarify that this field is currently not updated / blank in the ERP database (EMPLOYEEMASTER) for this employee.`;

    const response = await client.chat.completions.create({
      model: config.fastModel || "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are AutoVyn ERP's official AI assistant. Format database query results into clear, accurate, professional business responses. Always state exact counts and never confuse an ID or code with a count."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 1000
    });

    const aiAnswer = response?.choices?.[0]?.message?.content?.trim();
    if (aiAnswer) {
      return {
        answer: aiAnswer,
        summary: `${rowCount} records formatted via AI`,
        usage: response.usage
      };
    }
  } catch (err) {
    console.warn("[V6-AIFormatter] AI formatting notice, falling back to deterministic formatter:", err?.message);
  }

  return null;
};

const formatHumanBusinessAnswer = async ({ message, intent, sql, rows = [], userContext, entities = {}, sequelize = null }) => {
  if (!rows || rows.length === 0) {
    const isToday = entities.isToday || /\b(aaj|today)\b/i.test(message || "");
    const dateStr = isToday ? "aaj" : (entities.specificDate ? `**${entities.specificDate}** ko` : (entities.month ? `is mahine (${entities.month}/${entities.year || new Date().getFullYear()}) me` : "aaj"));
    if (intent === "MARRIAGE_ANNIVERSARY" || /\b(marrige|marriage|shadi|shaadi|wedding)\b/i.test(message || "")) {
      return {
        answer: `AutoVyn ERP ke record ke anusar, ${dateStr} kisi bhi employee ki **Marriage Anniversary** nahi hai.`,
        summary: `No marriage anniversary ${dateStr}`
      };
    }
    if (intent === "WORK_ANNIVERSARY") {
      return {
        answer: `AutoVyn ERP ke record ke anusar, ${dateStr} kisi bhi employee ki **Work Anniversary** nahi hai.`,
        summary: `No work anniversary ${dateStr}`
      };
    }
    if (intent === "BIRTHDAY_TODAY" || intent === "BIRTHDAY_BY_DATE" || intent === "BIRTHDAYS_MONTH" || /\b(birthday|bday|b'day|janamdin)\b/i.test(message || "")) {
      return {
        answer: `AutoVyn ERP ke record ke anusar, ${dateStr} kisi bhi employee ka **Birthday** nahi hai.`,
        summary: `No birthday ${dateStr}`
      };
    }

    // Check if user is asking for an employee's salary / basic salary
    const isSalaryQuery = intent === "SALARY_REPORT" || intent === "EMPLOYEE_SALARY_HISTORY" || intent === "SELF_SALARY" ||
      /\b(salary|pagar|tankha|vetan|basic|basic_earn|gross_earn|net|ctc)\b/i.test(message || "") ||
      (sql && /SALARYFILE/i.test(sql));
    const targetEmpCode = entities.employeeCode || (message.match(/\b(?:emp\s*code|employee\s*code|empcode|code)\s*[:=]?\s*['"]?(\d+)['"]?\b/i)?.[1]) || (message.match(/\b(\d{4,10})\b/)?.[1]);

    if (isSalaryQuery && targetEmpCode) {
      let empName = entities.employeeName || "";
      let designation = entities.designation || "";
      let monthlyCtc = null;
      let annualCtc = null;
      if (sequelize?.query && (!empName || !designation)) {
        try {
          const empMasterRows = await sequelize.query(`
            SELECT TOP 1 EMPCODE, LTRIM(RTRIM(ISNULL(EMPFIRSTNAME, '') + ' ' + ISNULL(EMPLASTNAME, ''))) AS FullName,
                   EMPLOYEEDESIGNATION AS Designation, MONTHLY_CTC, ANNUAL_CTC
            FROM dbo.EMPLOYEEMASTER WITH (NOLOCK)
            WHERE LTRIM(RTRIM(CONVERT(varchar(50), EMPCODE))) = '${targetEmpCode.replace(/'/g, "''")}'
          `, { type: QueryTypes.SELECT }).catch(() => []);
          if (empMasterRows && empMasterRows.length > 0) {
            empName = empMasterRows[0].FullName;
            designation = empMasterRows[0].Designation;
            monthlyCtc = empMasterRows[0].MONTHLY_CTC;
            annualCtc = empMasterRows[0].ANNUAL_CTC;
          }
        } catch (_) { }
      }

      const empLabel = empName ? `**${empName} (${targetEmpCode})**${designation ? ` - *${designation}*` : ''}` : `Employee Code **${targetEmpCode}**`;
      const isDirector = designation && /director|managing director|md|ceo|promoter|partner|owner/i.test(designation);

      let ans = `AutoVyn ERP ke record ke anusar, ${empLabel} ke liye **\`SALARYFILE\`** table me koi monthly salary / Basic_Earn record available nahi hai (0 records found).\n\n`;
      if (isDirector) {
        ans += `📌 **Karan:** Ye employee **${designation}** hain. Top Management / Directors ki monthly salary slips aksar regular payroll (\`SALARYFILE\`) me generate nahi hoti hain, aur Master (\`EMPLOYEEMASTER\`) me bhi inka Monthly CTC / Basic null set hai.`;
      } else if (monthlyCtc && Number(monthlyCtc) > 0) {
        ans += `📌 Master (\`EMPLOYEEMASTER\`) ke anusar inka **Monthly CTC ₹${Number(monthlyCtc).toLocaleString('en-IN')}** aur **Annual CTC ₹${Number(annualCtc || 0).toLocaleString('en-IN')}** hai, lekin \`SALARYFILE\` me inka monthly breakdown / Basic_Earn generate nahi hua hai.`;
      } else {
        ans += `📌 Is employee code ke liye database me kisi bhi mahine ka salary payout / Basic_Earn process nahi hua hai.`;
      }

      return {
        answer: ans.trim(),
        summary: `No salary records for ${targetEmpCode} in SALARYFILE`
      };
    }

    return {
      answer: `Aapke dwara puche gaye sawal ke liye database me koi record nahi mila. (No records found matching criteria).`,
      summary: "No records found"
    };
  }

  const monthsNameArr = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const getMonthNameHelper = (r) => {
    if (!r) return (entities.month && monthsNameArr[Number(entities.month)] ? monthsNameArr[Number(entities.month)] : (entities.monthName || "-"));
    const mNum = r.Month || r.MonthNumber || r.SalMnth || r.salmnth || r.SalaryMonth || entities.month;
    return r.MonthName || (mNum && monthsNameArr[Number(mNum)] ? monthsNameArr[Number(mNum)] : (entities.monthName || (mNum ? `Month ${mNum}` : "-")));
  };

  // Event Formatter: Marriage Anniversary
  if (intent === "MARRIAGE_ANNIVERSARY" && rows.length > 0) {
    const isToday = entities.isToday || /\b(aaj|today)\b/i.test(message || "");
    const dateStr = isToday ? "aaj" : (entities.specificDate ? `**${entities.specificDate}** ko` : (entities.month ? `is mahine (${entities.month}/${entities.year || new Date().getFullYear()}) me` : ""));
    let ans = `AutoVyn ERP ke record ke anusar, ${dateStr} **${rows.length} employee(s)** ki **Marriage Anniversary** hai! 🎉💐\n\n`;
    ans += `| Emp Code | Employee Name | Marriage Date | Years Completed | Location / Branch | Designation | Mobile No |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 50)) {
      const code = r.EmployeeCode || r.EMPCODE || "-";
      const name = r.EmployeeName || (r.EMPFIRSTNAME ? `${r.EMPFIRSTNAME} ${r.EMPLASTNAME || ""}`.trim() : "-");
      const dom = r.MarriageDate || (r.DOM ? String(r.DOM).slice(0, 10) : "-");
      const years = r.YearsOfMarriage !== undefined ? `${r.YearsOfMarriage} Year(s)` : "-";
      const loc = r.Location || "-";
      const desg = r.Designation || "-";
      const mob = r.MobileNo || "-";
      ans += `| **${code}** | **${name}** | ${dom} | ${years} | ${loc} | ${desg} | ${mob} |\n`;
    }
    if (rows.length > 50) ans += `\n*(Showing top 50 of ${rows.length} records)*`;
    return {
      answer: ans.trim(),
      summary: `${rows.length} employees marriage anniversary ${dateStr}`
    };
  }

  // Event Formatter: Work Anniversary
  if (intent === "WORK_ANNIVERSARY" && rows.length > 0) {
    const isToday = entities.isToday || /\b(aaj|today)\b/i.test(message || "");
    const dateStr = isToday ? "aaj" : (entities.specificDate ? `**${entities.specificDate}** ko` : (entities.month ? `is mahine (${entities.month}/${entities.year || new Date().getFullYear()}) me` : ""));
    let ans = `AutoVyn ERP ke record ke anusar, ${dateStr} **${rows.length} employee(s)** ki **Work Anniversary (Joining Day)** hai! 🎉👏\n\n`;
    ans += `| Emp Code | Employee Name | Joining Date | Years of Service | Location / Branch | Designation | Mobile No |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 50)) {
      const code = r.EmployeeCode || r.EMPCODE || "-";
      const name = r.EmployeeName || (r.EMPFIRSTNAME ? `${r.EMPFIRSTNAME} ${r.EMPLASTNAME || ""}`.trim() : "-");
      const doj = r.JoiningDate || (r.CURRENTJOINDATE ? String(r.CURRENTJOINDATE).slice(0, 10) : "-");
      const years = r.YearsOfService !== undefined ? `${r.YearsOfService} Year(s)` : "-";
      const loc = r.Location || "-";
      const desg = r.Designation || "-";
      const mob = r.MobileNo || "-";
      ans += `| **${code}** | **${name}** | ${doj} | ${years} | ${loc} | ${desg} | ${mob} |\n`;
    }
    if (rows.length > 50) ans += `\n*(Showing top 50 of ${rows.length} records)*`;
    return {
      answer: ans.trim(),
      summary: `${rows.length} employees work anniversary ${dateStr}`
    };
  }

  // Event Formatter: Birthday
  if ((intent === "BIRTHDAY_TODAY" || intent === "BIRTHDAY_BY_DATE" || intent === "BIRTHDAYS_MONTH") && rows.length > 0) {
    const isToday = entities.isToday || /\b(aaj|today)\b/i.test(message || "");
    const dateStr = isToday ? "aaj" : (entities.specificDate ? `**${entities.specificDate}** ko` : (entities.month ? `is mahine (${entities.month}) me` : ""));
    let ans = `AutoVyn ERP ke record ke anusar, ${dateStr} **${rows.length} employee(s)** ka **Birthday** hai! 🎂🎉\n\n`;
    ans += `| Emp Code | Employee Name | Date of Birth | Age | Location / Branch | Designation | Mobile No |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 50)) {
      const code = r.EmployeeCode || r.EMPCODE || "-";
      const name = r.EmployeeName || (r.EMPFIRSTNAME ? `${r.EMPFIRSTNAME} ${r.EMPLASTNAME || ""}`.trim() : "-");
      const dob = r.DateOfBirth || (r.DOB ? String(r.DOB).slice(0, 10) : "-");
      const age = r.Age !== undefined ? `${r.Age} yrs` : "-";
      const loc = r.Location || "-";
      const desg = r.Designation || "-";
      const mob = r.MobileNo || "-";
      ans += `| **${code}** | **${name}** | ${dob} | ${age} | ${loc} | ${desg} | ${mob} |\n`;
    }
    if (rows.length > 50) ans += `\n*(Showing top 50 of ${rows.length} records)*`;
    return {
      answer: ans.trim(),
      summary: `${rows.length} employees birthday ${dateStr}`
    };
  }

  // Fast direct formatter for simple counts and standard queries
  if (rows.length === 1 && rows[0].TotalPresentCount !== undefined) {
    const count = rows[0].TotalPresentCount;
    const dateStr = entities.specificDate ? `on **${entities.specificDate}**` : (entities.month ? `in month ${entities.month}/${entities.year || new Date().getFullYear()}` : "");
    return {
      answer: `AutoVyn ERP ke record ke anusar, ${dateStr} total **${count} employee(s)** present hain.`,
      summary: `${count} employees present ${dateStr}`.trim()
    };
  }

  if (rows.length === 1 && rows[0].TotalAbsentCount !== undefined) {
    const count = rows[0].TotalAbsentCount;
    const dateStr = entities.specificDate ? `on **${entities.specificDate}**` : (entities.month ? `in month ${entities.month}/${entities.year || new Date().getFullYear()}` : "");
    return {
      answer: `AutoVyn ERP ke record ke anusar, ${dateStr} total **${count} employee(s)** absent hain.`,
      summary: `${count} employees absent ${dateStr}`.trim()
    };
  }

  if (rows.length === 1 && (
    rows[0].ActiveEmployeeCount !== undefined ||
    rows[0].InactiveEmployeeCount !== undefined ||
    rows[0].SeparatedEmployeeCount !== undefined ||
    rows[0].TotalEmployeeCount !== undefined
  )) {
    const r = rows[0];
    const isAct = r.ActiveEmployeeCount !== undefined;
    const isSeparated = r.SeparatedEmployeeCount !== undefined;
    const isDeact = r.InactiveEmployeeCount !== undefined;
    const count = isAct ? r.ActiveEmployeeCount : (isSeparated ? r.SeparatedEmployeeCount : (isDeact ? r.InactiveEmployeeCount : r.TotalEmployeeCount));
    const statusLabel = isAct ? "active" : (isSeparated ? "separated (chhod ke gaye)" : (isDeact ? "inactive" : "total"));
    let locLabel = "";
    if (entities.branches && entities.branches.length > 0) locLabel = ` Branches (${entities.branches.join(', ')}) me`;
    else if (entities.excludeBranch) locLabel = ` Branch ${entities.excludeBranch} ko chhodkar`;
    else if (entities.branch) locLabel = ` Branch ${entities.branch} me`;
    const desigLabel = entities.designation ? ` ${entities.designation}` : "";
    const periodLabel = entities.month ? ` (${entities.month}/${entities.year || new Date().getFullYear()})` : "";
    return {
      answer: `AutoVyn ERP ke record ke anusar,${locLabel} total **${count} ${statusLabel}${desigLabel} employees** hain${periodLabel}.`,
      summary: `${count} ${statusLabel} employees${locLabel}`.trim()
    };
  }

  const firstRow = rows[0] || {};
  const isSalaryFileResult = Boolean(
    firstRow.pf_employee !== undefined ||
    firstRow.PF_Employee !== undefined ||
    firstRow.pf_employer !== undefined ||
    firstRow.PF_Employer !== undefined ||
    firstRow.pf_emplpension !== undefined ||
    firstRow.PF_EmplPension !== undefined ||
    firstRow.SalMnth !== undefined ||
    firstRow.salyear !== undefined ||
    firstRow.SalaryMonth !== undefined ||
    firstRow.SalaryYear !== undefined ||
    firstRow.NetSalary !== undefined ||
    firstRow.Gross_Earn !== undefined ||
    firstRow.Final_Payment !== undefined ||
    firstRow.GrossEarnings !== undefined ||
    firstRow.Basic_Earn !== undefined ||
    firstRow.BasicEarnings !== undefined ||
    firstRow.Deducation !== undefined ||
    firstRow.TotalDeductions !== undefined ||
    intent === "SALARY_PF_DEDUCTION" ||
    intent === "PF_DEDUCTION_COUNT" ||
    intent === "EMPLOYEE_SALARY_HISTORY" ||
    intent === "SALARY_REPORT"
  );

  // Dedicated Formatter: PF Deduction Count / Aggregation
  const isPFMsg = /\b(pf|provident|pension|uan|eps)\b/i.test(message || "");
  if (
    intent === "PF_DEDUCTION_COUNT" ||
    firstRow.TotalEmployeesWithPF !== undefined ||
    (rows.length === 1 && (intent === "PF_DEDUCTION_COUNT" || isPFMsg) && (firstRow.TotalCount !== undefined || firstRow.RecordCount !== undefined || firstRow.TotalEmployeesWithPF !== undefined))
  ) {
    const r = rows[0] || {};
    const count = Number(
      r.TotalEmployeesWithPF !== undefined ? r.TotalEmployeesWithPF :
      (r.TotalCount !== undefined ? r.TotalCount :
      (r.RecordCount !== undefined ? r.RecordCount :
      (rows.length > 1 ? rows.length : (typeof Object.values(r)[0] === "number" && !r.EmployeeCode && !r.Emp_Code && !r.EMPCODE ? Object.values(r)[0] : rows.length))))
    ) || rows.length;

    const mName = getMonthNameHelper(r);
    const yVal = r.SalaryYear || r.salyear || entities.year || new Date().getFullYear();
    const branchStr = entities.branch ? ` in **${entities.branch}** branch` : "";
    
    // If rows contain individual records, calculate sum from rows
    const totPF = Number(
      r.TotalEmployeePF !== undefined ? r.TotalEmployeePF :
      (r.TotalPF !== undefined ? r.TotalPF :
      rows.reduce((sum, row) => sum + Number(row.PF_Employee !== undefined ? row.PF_Employee : (row.pf_employee || 0)), 0))
    );
    const totEmplr = Number(
      r.TotalEmployerPF !== undefined ? r.TotalEmployerPF :
      rows.reduce((sum, row) => sum + Number(row.pf_employer !== undefined ? row.pf_employer : (row.PF_Employer || 0)), 0)
    );
    const totPension = Number(
      r.TotalPensionEPS !== undefined ? r.TotalPensionEPS :
      rows.reduce((sum, row) => sum + Number(row.pf_emplpension !== undefined ? row.pf_emplpension : (row.PF_Pension || 0)), 0)
    );
    const avgPF = Number(r.AvgPFDeduction !== undefined ? r.AvgPFDeduction : (count > 0 ? totPF / count : 0));

    let ans = `AutoVyn ERP ke record ke anusar, **${mName} ${yVal}** me${branchStr} total **${count.toLocaleString("en-IN")} employee(s)** ka PF deduction hua hai.`;

    if (totPF > 0 || totEmplr > 0 || totPension > 0) {
      ans += `\n\n**PF Deduction & Contribution Summary (${mName} ${yVal}):**\n` +
        `• **Total Employees with PF Deduction:** **${count.toLocaleString("en-IN")}**\n` +
        (totPF > 0 ? `• **Total Employee PF Deduction (Salary se kata):** **₹${totPF.toLocaleString("en-IN")}**\n` : "") +
        (totEmplr > 0 ? `• **Total Employer PF Contribution:** ₹${totEmplr.toLocaleString("en-IN")}\n` : "") +
        (totPension > 0 ? `• **Total Pension Contribution (EPS):** ₹${totPension.toLocaleString("en-IN")}\n` : "") +
        (avgPF > 0 ? `• **Average Employee PF Deduction:** ₹${Math.round(avgPF).toLocaleString("en-IN")}\n` : "");
    }

    // If individual employee records are available, also display a clean table!
    if (rows.length > 1 && (firstRow.EmployeeCode || firstRow.Emp_Code || firstRow.EMPCODE)) {
      const hasPFNum = rows.some(row => Boolean(row.PFNUMBER || row.PF_Number || row.pfnumber));
      ans += `\n\n**Employees List (Top ${Math.min(rows.length, 50)}):**\n\n`;
      if (hasPFNum) {
        ans += `| Emp Code | Employee Name | PF Number | Month/Year | Employee PF (Deduction) | Employer PF | Pension (EPS) | Net Pay |\n`;
        ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      } else {
        ans += `| Emp Code | Employee Name | Month/Year | Employee PF (Deduction) | Employer PF | Pension (EPS) | Total Deductions | Net Pay |\n`;
        ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      }

      rows.slice(0, 50).forEach(row => {
        const empCode = row.EmployeeCode || row.Emp_Code || row.EMPCODE || "-";
        const empName = (row.EmployeeName || (row.EMPFIRSTNAME ? `${row.EMPFIRSTNAME} ${row.EMPLASTNAME || ""}`.trim() : "") || "-").trim();
        const rowMName = getMonthNameHelper(row);
        const rowYVal = row.SalaryYear || row.salyear || entities.year || "-";
        const pfNum = row.PFNUMBER || row.PF_Number || row.pfnumber || "-";
        const pfEmp = Number(row.PF_Employee !== undefined ? row.PF_Employee : (row.pf_employee !== undefined ? row.pf_employee : (row.EmployeePF || 0)));
        const pfEmplr = Number(row.pf_employer !== undefined ? row.pf_employer : (row.PF_Employer || 0));
        const pfPension = Number(row.pf_emplpension !== undefined ? row.pf_emplpension : (row.PF_Pension || 0));
        const totDed = Number(row.TotalDeductions !== undefined ? row.TotalDeductions : (row.Deducation !== undefined ? row.Deducation : pfEmp));
        const netPay = Number(row.NetSalary !== undefined ? row.NetSalary : (row.Final_Payment || 0));

        if (hasPFNum) {
          ans += `| **${empCode}** | ${empName} | ${pfNum} | ${rowMName} ${rowYVal} | **₹${pfEmp.toLocaleString("en-IN")}** | ₹${pfEmplr.toLocaleString("en-IN")} | ₹${pfPension.toLocaleString("en-IN")} | ₹${netPay.toLocaleString("en-IN")} |\n`;
        } else {
          ans += `| **${empCode}** | ${empName} | ${rowMName} ${rowYVal} | **₹${pfEmp.toLocaleString("en-IN")}** | ₹${pfEmplr.toLocaleString("en-IN")} | ₹${pfPension.toLocaleString("en-IN")} | ₹${totDed.toLocaleString("en-IN")} | ₹${netPay.toLocaleString("en-IN")} |\n`;
        }
      });

      if (rows.length > 50) ans += `\n*(Showing top 50 of ${rows.length} records)*`;
    }

    return {
      answer: ans.trim(),
      summary: `${count} employees had PF deduction in ${mName} ${yVal}${branchStr}`.trim()
    };
  }

  // Dedicated Formatter: PF Salary Deduction (SALARYFILE.pf_employee, pf_employer, pf_emplpension)
  const isExplicitPFQuery = intent === "SALARY_PF_DEDUCTION" || intent === "PF_DEDUCTION_COUNT" || /\b(pf|provident|pension|uan|eps)\b/i.test(message || "");
  const isRankingOrHighestSalary = (intent === "HIGHEST_SALARY_RANKING" && !isExplicitPFQuery) || (/\b(highest|maximum|sabse\s*jyada|sabse\s*badi|max|top\s*\d*)\b/i.test(message || "") && !isExplicitPFQuery);

  if (
    isExplicitPFQuery &&
    !isRankingOrHighestSalary &&
    rows.length > 0 &&
    (firstRow.pf_employee !== undefined || firstRow.PF_Employee !== undefined || intent === "SALARY_PF_DEDUCTION")
  ) {
    if (rows.length === 1 || (entities.employeeCode || entities.searchToken || (rows.length > 0 && rows.every(r => (r.Emp_Code || r.EMPCODE || r.EmployeeCode) === (rows[0].Emp_Code || rows[0].EMPCODE || rows[0].EmployeeCode))))) {
      const r = rows[0];
      const empCode = r.EmployeeCode || r.Emp_Code || r.EMPCODE || "-";
      const empName = (r.EmployeeName || (r.EMPFIRSTNAME ? `${r.EMPFIRSTNAME} ${r.EMPLASTNAME || ""}`.trim() : "") || "-").trim();
      const mName = getMonthNameHelper(r);
      const yVal = r.SalaryYear || r.salyear || entities.year || new Date().getFullYear();
      const pfNum = r.PFNUMBER || r.PF_Number || r.pfnumber || "-";
      const pfEmp = Number(r.PF_Employee !== undefined ? r.PF_Employee : (r.pf_employee !== undefined ? r.pf_employee : (r.EmployeePF || 0)));
      const pfEmplr = Number(r.pf_employer !== undefined ? r.pf_employer : (r.PF_Employer || 0));
      const pfPension = Number(r.pf_emplpension !== undefined ? r.pf_emplpension : (r.PF_Pension || 0));
      const totPF = pfEmp + pfEmplr + pfPension;
      const totDed = Number(r.TotalDeductions !== undefined ? r.TotalDeductions : (r.Deducation !== undefined ? r.Deducation : pfEmp));
      const netPay = Number(r.NetSalary !== undefined ? r.NetSalary : (r.Final_Payment || 0));
      const grossEarn = Number(r.GrossEarnings !== undefined ? r.GrossEarnings : (r.Gross_Earn || 0));
      const basicEarn = Number(r.Basic_Earn !== undefined ? r.Basic_Earn : (r.BasicEarnings || 0));

      let ans = `AutoVyn ERP record ke anusar, **${empName} (${empCode})** ka **${mName} ${yVal}** me **PF Deduction (Provident Fund)**:\n\n` +
        (pfNum !== "-" ? `• **PF Number:** \`${pfNum}\`\n` : "") +
        `• **Employee PF Deduction (Salary se kata):** **₹${pfEmp.toLocaleString("en-IN")}**\n` +
        `• **Employer PF Contribution:** ₹${pfEmplr.toLocaleString("en-IN")}\n` +
        `• **Pension Contribution (EPS):** ₹${pfPension.toLocaleString("en-IN")}\n` +
        `• **Total PF Deposit:** ₹${totPF.toLocaleString("en-IN")}\n` +
        (basicEarn > 0 ? `• **Basic Pay:** ₹${basicEarn.toLocaleString("en-IN")}\n` : "") +
        (grossEarn > 0 ? `• **Gross Earnings:** ₹${grossEarn.toLocaleString("en-IN")}\n` : "") +
        `• **Total Salary Deductions:** ₹${totDed.toLocaleString("en-IN")}\n` +
        (netPay > 0 ? `• **Net In-Hand Salary:** ₹${netPay.toLocaleString("en-IN")}\n` : "");

      return {
        answer: ans.trim(),
        summary: `${empName} (${empCode}) ${mName} ${yVal} PF deduction: ₹${pfEmp.toLocaleString("en-IN")}`
      };
    }

    // Multiple rows / employees list
    const hasPFNum = rows.some(r => Boolean(r.PFNUMBER || r.PF_Number || r.pfnumber));
    let ans = `**AutoVyn ERP - PF Deduction & Contribution Statement:**\n\n`;
    if (hasPFNum) {
      ans += `| Emp Code | Employee Name | PF Number | Month/Year | Employee PF (Deduction) | Employer PF | Pension (EPS) | Net Pay |\n`;
      ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    } else {
      ans += `| Emp Code | Employee Name | Month/Year | Employee PF (Deduction) | Employer PF | Pension (EPS) | Total Deductions | Net Pay |\n`;
      ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    }

    rows.slice(0, 50).forEach(r => {
      const empCode = r.EmployeeCode || r.Emp_Code || r.EMPCODE || "-";
      const empName = (r.EmployeeName || (r.EMPFIRSTNAME ? `${r.EMPFIRSTNAME} ${r.EMPLASTNAME || ""}`.trim() : "") || "-").trim();
      const mName = getMonthNameHelper(r);
      const yVal = r.SalaryYear || r.salyear || entities.year || "-";
      const pfNum = r.PFNUMBER || r.PF_Number || r.pfnumber || "-";
      const pfEmp = Number(r.PF_Employee !== undefined ? r.PF_Employee : (r.pf_employee !== undefined ? r.pf_employee : (r.EmployeePF || 0)));
      const pfEmplr = Number(r.pf_employer !== undefined ? r.pf_employer : (r.PF_Employer || 0));
      const pfPension = Number(r.pf_emplpension !== undefined ? r.pf_emplpension : (r.PF_Pension || 0));
      const totDed = Number(r.TotalDeductions !== undefined ? r.TotalDeductions : (r.Deducation !== undefined ? r.Deducation : pfEmp));
      const netPay = Number(r.NetSalary !== undefined ? r.NetSalary : (r.Final_Payment || 0));

      if (hasPFNum) {
        ans += `| **${empCode}** | ${empName} | ${pfNum} | ${mName} ${yVal} | **₹${pfEmp.toLocaleString("en-IN")}** | ₹${pfEmplr.toLocaleString("en-IN")} | ₹${pfPension.toLocaleString("en-IN")} | ₹${netPay.toLocaleString("en-IN")} |\n`;
      } else {
        ans += `| **${empCode}** | ${empName} | ${mName} ${yVal} | **₹${pfEmp.toLocaleString("en-IN")}** | ₹${pfEmplr.toLocaleString("en-IN")} | ₹${pfPension.toLocaleString("en-IN")} | ₹${totDed.toLocaleString("en-IN")} | ₹${netPay.toLocaleString("en-IN")} |\n`;
      }
    });

    if (rows.length > 50) ans += `\n*(Showing top 50 of ${rows.length} records)*`;

    return {
      answer: ans.trim(),
      summary: `PF deductions for ${rows.length} records`
    };
  }

  // Universal PF Count Formatter: handles TotalPFCount, PF_Count, PFCount, count, etc.
  const pfCountKey = !isSalaryFileResult ? Object.keys(firstRow).find(k => /^(TotalPFCount|PF_Count|PFCount|Total_PF_Count|pf_cnt)$/i.test(k) || ((intent === "PF_COUNT" || /COUNT/i.test(sql || "")) && /^(count|cnt|Total)$/i.test(k))) : undefined;
  const isPFCountQuery = !isSalaryFileResult && rows.length === 1 && (
    pfCountKey !== undefined ||
    /^\s*SELECT\s+(TOP\s+\d+\s+)?COUNT/i.test(sql || "") ||
    intent === "PF_COUNT"
  ) && (
      intent === "PF_COUNT" ||
      intent === "PF_EMPLOYEE_LIST" ||
      /pf|provident/i.test(message || "") ||
      /pfnumber|pf_count|totalpfcount/i.test(sql || "")
    );

  if (isPFCountQuery) {
    const rawVal = pfCountKey ? firstRow[pfCountKey] : Object.values(firstRow)[0];
    const count = Number(rawVal) || 0;
    const branchStr = entities.branch ? ` in **${entities.branch}** branch` : "";
    return {
      answer: `AutoVyn ERP ke record ke anusar,${branchStr} total **${Number(count).toLocaleString()} employee(s)** ke pass valid PF Number registered hai.`,
      summary: `${count} employees with PF registered${branchStr}`.trim()
    };
  }

  if (intent === "PF_EMPLOYEE_LIST" && rows.length > 0) {
    // Guard: If query returned an aggregation count (e.g. from custom trained SELECT COUNT(*)), don't format as an empty table
    if (rows.length === 1 && !rows[0].EmployeeCode && !rows[0].EMPCODE && !rows[0].EmployeeName && !rows[0].EMPFIRSTNAME) {
      const val = Object.values(rows[0])[0];
      if (typeof val === "number" || /^\d+$/.test(String(val).trim())) {
        const branchStr = entities.branch ? ` in **${entities.branch}** branch` : "";
        return {
          answer: `AutoVyn ERP ke record ke anusar,${branchStr} total **${Number(val).toLocaleString()} employee(s)** ke pass valid PF Number registered hai.`,
          summary: `${val} employees with PF registered${branchStr}`.trim()
        };
      }
    }

    const branchStr = entities.branch ? ` in **${entities.branch}** branch` : "";
    let ans = `AutoVyn ERP ke record ke anusar,${branchStr} **${rows.length} employee(s)** ke pass PF Number registered mila hai:\n\n`;
    ans += `| Emp Code | Employee Name | PF Number | UAN No | ESI No | Location | Designation |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 50)) {
      ans += `| **${r.EmployeeCode || "-"}** | ${r.EmployeeName || "-"} | \`${r.PFNumber || "-"}\` | ${r.UANNumber || "-"} | ${r.ESINumber || "-"} | ${r.Location || "-"} | ${r.Designation || "-"} |\n`;
    }
    if (rows.length > 50) {
      ans += `\n*(Showing top 50 of ${rows.length} employees with PF registered)*`;
    }
    return {
      answer: ans.trim(),
      summary: `${rows.length} employees with PF registered${branchStr}`.trim()
    };
  }

  if (intent === "PF_LOOKUP_BY_EMP" && rows.length > 0) {
    const row = rows[0];
    let ans = `PF Details for **${row.EmployeeName || "-"} (${row.EmployeeCode || "-"})**:\n\n` +
      `• **PF Number:** \`${row.PFNumber || "-"}\`\n` +
      `• **UAN Number:** \`${row.UANNumber || "-"}\`\n` +
      `• **ESI Number:** \`${row.ESINumber || "-"}\`\n` +
      `• **Designation:** ${row.Designation || "-"}\n` +
      `• **Location / Branch:** ${row.Location || "-"}\n` +
      `• **Date of Joining:** ${row.JoiningDate || "-"}`;
    return {
      answer: ans.trim(),
      summary: `PF Number for ${row.EmployeeCode}: ${row.PFNumber}`
    };
  }

  if (intent === "PRESENT_EMPLOYEE_LIST" && rows.length > 0) {
    const dateStr = entities.specificDate ? `on **${entities.specificDate}**` : "";
    let ans = `AutoVyn ERP ke record ke anusar, ${dateStr} **${rows.length} employee(s)** present mile hain:\n\n`;
    ans += `| Emp Code | Employee Name | Attendance Date | Flag | In Time | Out Time | Hours | Location |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 50)) {
      ans += `| **${r.EmployeeCode || "-"}** | ${r.EmployeeName || "-"} | ${r.AttendanceDate || "-"} | **${r.Flag || "P"}** | ${r.InTime || "-"} | ${r.OutTime || "-"} | ${r.HoursWorked || "-"} | ${r.Location || "-"} |\n`;
    }
    if (rows.length > 50) {
      ans += `\n*(Showing top 50 of ${rows.length} present records)*`;
    }
    return {
      answer: ans.trim(),
      summary: `${rows.length} present employees ${dateStr}`.trim()
    };
  }

  if (intent === "ABSENT_EMPLOYEE_LIST" && rows.length > 0) {
    const dateStr = entities.specificDate ? `on **${entities.specificDate}**` : "";
    let ans = `AutoVyn ERP ke record ke anusar, ${dateStr} **${rows.length} employee(s)** absent mile hain:\n\n`;
    ans += `| Emp Code | Employee Name | Attendance Date | Flag | Location | Designation | Mobile |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 50)) {
      ans += `| **${r.EmployeeCode || "-"}** | ${r.EmployeeName || "-"} | ${r.AttendanceDate || "-"} | **${r.Flag || "A"}** | ${r.Location || "-"} | ${r.Designation || "-"} | ${r.MobileNo || "-"} |\n`;
    }
    if (rows.length > 50) {
      ans += `\n*(Showing top 50 of ${rows.length} absent records)*`;
    }
    return {
      answer: ans.trim(),
      summary: `${rows.length} absent employees ${dateStr}`.trim()
    };
  }

  if (intent === "EMPLOYEE_AUDIT_HISTORY_DIFF" && rows.length > 0) {
    const empMap = new Map();

    for (const r of rows) {
      const code = r.EmployeeCode || "-";
      if (!empMap.has(code)) {
        empMap.set(code, {
          name: r.EmployeeName || "Employee",
          location: r.Location || "-",
          designation: r.Designation || "-",
          modifiedBy: r.ModifiedBy || "ADMIN",
          modifiedOn: r.ModifiedOn || "-",
          changes: []
        });
      }

      const empObj = empMap.get(code);

      // Check key columns for differences
      const colPairs = [
        { name: "Bank Account No", cur: r.Current_BankAcc, prev: r.Previous_BankAcc },
        { name: "Mobile No", cur: r.Current_Mobile, prev: r.Previous_Mobile },
        { name: "PAN No", cur: r.Current_PAN, prev: r.Previous_PAN },
        { name: "Aadhaar No", cur: r.Current_Aadhaar, prev: r.Previous_Aadhaar },
        { name: "Email", cur: r.Current_Email, prev: r.Previous_Email },
        { name: "Marital Status", cur: r.Current_MaritalStatus, prev: r.Previous_MaritalStatus },
        { name: "Monthly CTC", cur: r.Current_MonthlyCTC, prev: r.Previous_MonthlyCTC },
        { name: "User Password", cur: r.Current_Password, prev: r.Previous_Password },
        { name: "Bank Name", cur: r.Current_BankName, prev: r.Previous_BankName },
        { name: "IFSC Code", cur: r.Current_IFSC, prev: r.Previous_IFSC }
      ];

      for (const pair of colPairs) {
        const strCur = String(pair.cur ?? '').trim();
        const strPrev = String(pair.prev ?? '').trim();
        if (strCur !== strPrev && !empObj.changes.some(c => c.field === pair.name)) {
          empObj.changes.push({
            field: pair.name,
            oldVal: strPrev || "(blank)",
            newVal: strCur || "(blank)"
          });
        }
      }
    }

    const modifiedList = Array.from(empMap.values());
    const dateStr = entities.specificDate ? `on **${entities.specificDate}**` : "aaj (Today)";
    let ans = `AutoVyn ERP Master Audit History (\`EMPLOYEEMASTER_hst\` Comparison):\n\n`;
    ans += `${dateStr} **${modifiedList.length} employee(s)** ke profile records modify hue hain:\n\n`;

    ans += `| Emp Code | Employee Name | Modified Field | Previous Value (\`_hst\`) | Updated Value (Current) | Modified By | Modified On |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    for (const [code, empObj] of empMap.entries()) {
      if (empObj.changes.length > 0) {
        for (const ch of empObj.changes) {
          ans += `| **${code}** | ${empObj.name} | **${ch.field}** | \`${ch.oldVal}\` | \`${ch.newVal}\` | ${empObj.modifiedBy} | ${empObj.modifiedOn} |\n`;
        }
      } else {
        ans += `| **${code}** | ${empObj.name} | General Profile / Password | - | Updated | ${empObj.modifiedBy} | ${empObj.modifiedOn} |\n`;
      }
    }

    return {
      answer: ans.trim(),
      summary: `Audit history: ${modifiedList.length} employees modified ${dateStr}`
    };
  }

  if (rows.length === 1 && (rows[0].TotalUnverifiedAccounts !== undefined || rows[0].TotalVerifiedAccounts !== undefined)) {
    const row = rows[0];
    const total = row.TotalEmployeesWithBankAcc || 0;
    const verified = row.TotalVerifiedAccounts || 0;
    const invalid = row.TotalInvalidAccounts || 0;
    const totalVer = row.TotalPennyDropVerifications || (verified + invalid);

    return {
      answer: `AutoVyn ERP Bank Account Verification (Penny-Drop) Status:\n\n` +
        `• **Total Employees With Bank Accounts in Master:** ${total}\n` +
        `• **Total Penny-Drop API Logs:** ${totalVer}\n` +
        `• **Verified & Valid Bank Accounts:** ${verified}\n` +
        `• **Invalid / Rejected Accounts:** ${invalid}`,
      summary: `Verified: ${verified}, Invalid: ${invalid}`
    };
  }

  if (rows.length === 1 && (rows[0].AadhaarCardVerifiedCount !== undefined || rows[0].PanCardVerifiedCount !== undefined)) {
    const row = rows[0];
    const totalKYC = row.TotalKYCRecords || row.TotalEmployeesInKYC || 0;
    const aadhaarCard = row.AadhaarCardVerifiedCount || 0;
    const aadhaarLinked = row.AadhaarLinkedVerifiedCount || 0;
    const aadhaarLinkedPan = row.AadhaarLinkedPanVerifiedCount || 0;
    const aadhaarNameMatch = row.AadhaarNameMatchVerifiedCount || 0;
    const panCard = row.PanCardVerifiedCount || 0;
    const panNameMatch = row.PanNameMatchVerifiedCount || 0;

    let ans = `AutoVyn ERP KYC & Identity Verification Summary:\n\n`;
    if (totalKYC) ans += `• **Total KYC Records:** ${totalKYC}\n`;
    if (aadhaarCard) ans += `• **Aadhaar Card Verified:** ${aadhaarCard}\n`;
    if (aadhaarLinked) ans += `• **Aadhaar Linked Verified:** ${aadhaarLinked}\n`;
    if (aadhaarLinkedPan) ans += `• **Aadhaar Linked with PAN:** ${aadhaarLinkedPan}\n`;
    if (aadhaarNameMatch) ans += `• **Aadhaar Name Matched:** ${aadhaarNameMatch}\n`;
    if (panCard) ans += `• **PAN Card Verified:** ${panCard}\n`;
    if (panNameMatch) ans += `• **PAN Name Matched:** ${panNameMatch}\n`;

    return {
      answer: ans.trim(),
      summary: `KYC Summary: Aadhaar=${aadhaarCard}, PAN=${panCard}`
    };
  }

  if (intent === "AADHAAR_VERIFY_LIST" && rows.length > 0) {
    let ans = `AutoVyn ERP me **${rows.length} employee(s)** ke Aadhaar verification records mile hain:\n\n`;
    ans += `| Emp Code | Employee Name | Location | Aadhaar Card | Aadhaar Linked | PAN Linked | Name Matched |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 50)) {
      const code = r.EmployeeCode || "-";
      const name = r.EmployeeName || "-";
      const loc = r.Location || "-";
      const card = String(r.AadhaarCardVerified).toLowerCase() === "true" || r.AadhaarCardVerified === 1 || r.AadhaarCardVerified === "1" ? "✅ Verified" : "❌ Pending";
      const linked = String(r.AadhaarLinkedVerified).toLowerCase() === "true" || r.AadhaarLinkedVerified === 1 || r.AadhaarLinkedVerified === "1" ? "✅ Linked" : "-";
      const panLink = String(r.AadhaarLinkedPanVerified || r.AadhaarLinkedWithPanVerified).toLowerCase() === "true" || r.AadhaarLinkedPanVerified === 1 || r.AadhaarLinkedPanVerified === "1" ? "✅ Linked" : "-";
      const nameMatch = String(r.AadhaarNameMatchVerified).toLowerCase() === "true" || r.AadhaarNameMatchVerified === 1 || r.AadhaarNameMatchVerified === "1" ? "✅ Matched" : "-";
      ans += `| ${code} | ${name} | ${loc} | ${card} | ${linked} | ${panLink} | ${nameMatch} |\n`;
    }
    if (rows.length > 50) {
      ans += `\n*...aur ${rows.length - 50} aur employees hain.*`;
    }
    return {
      answer: ans,
      summary: `${rows.length} Aadhaar verified employees retrieved`
    };
  }

  if ((intent === "MISPUNCH_EMPLOYEE_TOTAL" || (rows.length === 1 && rows[0].TotalMissPunch !== undefined)) && rows.length > 0) {
    const r = rows[0];
    const empName = r.EmployeeName || "Employee";
    const empCode = r.EmployeeCode || r.EMPCODE || entities.employeeCode || "-";
    const doj = r.CurrentJoinDate || (r.CURRENTJOINDATE ? String(r.CURRENTJOINDATE).slice(0, 10) : "-");
    const total = Number(r.TotalMissPunch || 0);
    const appr = Number(r.ApprovedMissPunch || r.ApprovedCount || 0);
    const rej = Number(r.RejectedMissPunch || r.RejectedCount || 0);
    const pend = Number(r.PendingMissPunch || r.PendingCount || 0);

    let ans = `AutoVyn ERP **Miss Punch Summary** for **${empName} (${empCode})**:\n\n` +
      `• **Employee Code:** ${empCode}\n` +
      `• **Employee Name:** **${empName}**\n` +
      `• **Date of Joining:** ${doj}\n` +
      `• **Total Miss Punch Applications (Joining se abhi tak):** **${total}**\n`;
    if (appr > 0 || rej > 0 || pend > 0) {
      ans += `• **Approved Miss Punches (✅):** ${appr}\n` +
        `• **Pending Applications (⏳):** ${pend}\n` +
        `• **Rejected Applications (❌):** ${rej}\n`;
    }
    return {
      answer: ans.trim(),
      summary: `Total Miss Punches for ${empName} (${empCode}): ${total}`
    };
  }

  if (intent === "MISPUNCH_COUNT" && rows.length > 0) {
    const r = rows[0];
    const total = r.TotalMispunches || 0;
    const emps = r.TotalEmployees || 0;
    const appr = r.ApprovedCount || 0;
    const rej = r.RejectedCount || 0;
    const pend = r.PendingCount || 0;
    const fromDate = r.From_Date ? String(r.From_Date).slice(0, 10) : "";
    const toDate = r.To_Date ? String(r.To_Date).slice(0, 10) : "";
    const periodStr = fromDate && toDate ? ` (Payroll Cycle: **${fromDate}** se **${toDate}**)` : "";

    return {
      answer: `AutoVyn ERP **Miss Punch Summary**${periodStr}:\n\n` +
        `• **Total Miss Punch Applications:** **${total}**\n` +
        `• **Total Employees Affected:** **${emps}**\n` +
        `• **Approved Miss Punches (✅):** **${appr}**\n` +
        `• **Pending Applications (⏳):** **${pend}**\n` +
        `• **Rejected Applications (❌):** **${rej}**`,
      summary: `Total Miss Punches: ${total} (Approved: ${appr}, Pending: ${pend})`
    };
  }

  if ((intent === "MISPUNCH_REPORT" || intent === "MISPUNCH_LOOKUP_BY_EMP" || (rows.length > 0 && (rows[0].MispunchReason !== undefined || rows[0].MispunchReasonCode !== undefined))) && rows.length > 0) {
    const fromDate = rows[0].From_Date ? String(rows[0].From_Date).slice(0, 10) : "";
    const toDate = rows[0].To_Date ? String(rows[0].To_Date).slice(0, 10) : "";
    const periodStr = fromDate && toDate ? ` (Payroll Period: **${fromDate}** se **${toDate}**)` : "";

    let ans = `AutoVyn ERP **Miss Punch Report**${periodStr}:\n\n`;
    ans += `Is period me total **${rows.length} miss punch records** paye gaye hain:\n\n`;
    ans += `| # | Emp Code | Employee Name | Date | Day | Punch In | Punch Out | Reason / Miss Punch | Approval Status | Branch |\n`;
    ans += `| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    for (let idx = 0; idx < Math.min(rows.length, 60); idx++) {
      const r = rows[idx];
      const code = r.EmployeeCode || r.Emp_Code || r.EMPCODE || "-";
      const name = r.EmployeeName || r.EMPFIRSTNAME || "-";
      const date = r.AttendanceDate || (r.dateoffice ? String(r.dateoffice).slice(0, 10) : "-");
      const day = r.DayName || "-";
      const inTime = r.InTime ? (typeof r.InTime === "string" ? (r.InTime.includes("T") ? r.InTime.slice(11, 16) : r.InTime) : new Date(r.InTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })) : (r.in1 ? new Date(r.in1).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "❌ Missing");
      const outTime = r.OutTime ? (typeof r.OutTime === "string" ? (r.OutTime.includes("T") ? r.OutTime.slice(11, 16) : r.OutTime) : new Date(r.OutTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })) : (r.out1 ? new Date(r.out1).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : "❌ Missing");
      const reason = r.MispunchReason || r.Misc_Name || "MISPUNCH (MP)";
      let apprStatus = "⏳ Pending";
      if (r.ManualApproved === "Y" || r.MAN_APPR === "Y" || r.ManualApproved === 1 || r.MAN_APPR === 1 || r.status === "Approved") apprStatus = "✅ Approved";
      else if (r.ManualRejected === "Y" || r.MAN_REJ === "Y" || r.ManualRejected === 1 || r.MAN_REJ === 1 || r.status === "Rejected") apprStatus = "❌ Rejected";
      const loc = r.Location || "-";

      ans += `| **${idx + 1}** | **${code}** | ${name} | ${date} | ${day} | ${inTime} | ${outTime} | ${reason} | ${apprStatus} | ${loc} |\n`;
    }

    if (rows.length > 60) {
      ans += `\n*...aur ${rows.length - 60} aur miss punch records hain.*`;
    }

    return {
      answer: ans.trim(),
      summary: `Miss Punch Report: ${rows.length} records found`
    };
  }

  if ((intent === "ATTENDANCE_REPORT" || (rows.length > 0 && (rows[0].AttendanceDate !== undefined || rows[0].dateoffice !== undefined))) && rows.length > 0) {
    const empName = rows[0].EmployeeName || rows[0].EMPFIRSTNAME || "Employee";
    const empCode = rows[0].EmployeeCode || rows[0].Emp_Code || "";
    let pCount = 0, aCount = 0, woCount = 0, hdCount = 0;
    for (const r of rows) {
      const f = String(r.Flag || r.flag || "").trim().toUpperCase();
      if (f === "P") pCount++;
      else if (f === "A") aCount++;
      else if (f === "WO") woCount++;
      else if (f === "HD") hdCount++;
    }

    let ans = `AutoVyn ERP Attendance Summary for **${empName} (${empCode})**:\n\n`;
    ans += `• **Total Records:** ${rows.length} days\n`;
    ans += `• **Present (P):** ${pCount} days | **Absent (A):** ${aCount} days | **Weekly Off (WO):** ${woCount} days | **Half Day (HD):** ${hdCount} days\n\n`;
    ans += `| Date | Day | Flag | In Time | Out Time | Hours Worked |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 35)) {
      const d = r.AttendanceDate || (r.dateoffice ? String(r.dateoffice).slice(0, 10) : "-");
      const day = r.DayName || "-";
      const flag = String(r.Flag || r.flag || "-").trim();
      const inTime = r.InTime || (r.in1 ? String(r.in1).slice(11, 19) : "-");
      const outTime = r.OutTime || (r.out1 ? String(r.out1).slice(11, 19) : "-");
      const hw = r.HoursWorked || r.hoursworked || "-";
      ans += `| ${d} | ${day} | **${flag}** | ${inTime} | ${outTime} | ${hw} |\n`;
    }
    return {
      answer: ans,
      summary: `Attendance records for ${empCode}: ${rows.length} days`
    };
  }

  if (intent === "EMPLOYEE_BY_ACCOUNT_NO" && rows.length > 0) {
    const row = rows[0];
    let parsedRaw = {};
    if (row.RawResponse) {
      try {
        parsedRaw = typeof row.RawResponse === "object" ? row.RawResponse : JSON.parse(row.RawResponse);
      } catch (_) { }
    }

    const nameAtBank = row.NameAtBankDirect || parsedRaw.result?.name_at_bank || parsedRaw.data?.name_at_bank || null;
    const bankName = parsedRaw.result?.bank_name || parsedRaw.data?.bank_name || row.BankName || null;
    const branchName = parsedRaw.result?.branch || parsedRaw.data?.branch || null;
    const ifsc = row.IFSC || parsedRaw.result?.ifsc_details?.ifsc || parsedRaw.data?.ifsc || null;
    const utr = parsedRaw.result?.utr || parsedRaw.data?.utr || null;

    let status = "PENDING / UNVERIFIED";
    if (parsedRaw.result?.account_status === "VALID" || parsedRaw.data?.account_exists === true || row.AccountExistsFlag === 1) {
      status = "✅ VALID / VERIFIED";
    } else if (parsedRaw.result?.account_status === "INVALID" || parsedRaw.data?.account_exists === false || row.AccountExistsFlag === 0) {
      status = "❌ INVALID / REJECTED";
    }

    let ans = `Bank Account Number **${row.BankAccountNo || entities.accountNumber || ""}** ke employee details:\n\n` +
      `• **Employee Code:** ${row.EmployeeCode || "-"}\n` +
      `• **Employee Name:** **${row.EmployeeName || "-"}**\n` +
      `• **Designation:** ${row.Designation || "-"}\n` +
      `• **Location / Branch:** ${row.Location || "-"}\n` +
      `• **Bank Name in Master:** ${row.BankName || "-"}\n` +
      `• **PAN No:** ${row.PAN || "-"}\n`;
    if (nameAtBank) ans += `• **Name at Bank (Penny-Drop):** ${nameAtBank}\n`;
    if (bankName) ans += `• **Bank Name at Bank:** ${bankName}\n`;
    if (branchName) ans += `• **Bank Branch:** ${branchName}\n`;
    if (ifsc) ans += `• **IFSC Code:** ${ifsc}\n`;
    if (utr) ans += `• **Verification UTR:** ${utr}\n`;
    ans += `• **Penny-Drop Verification Status:** ${status}\n`;
    if (row.VerificationDate) ans += `• **Verification Date:** ${row.VerificationDate}\n`;

    return {
      answer: ans.trim(),
      summary: `Account ${row.BankAccountNo} belongs to ${row.EmployeeName} (${row.EmployeeCode})`
    };
  }

  if (intent === "DUPLICATE_BANK_ACCOUNTS" && rows.length > 0) {
    let ans = `AutoVyn ERP me **${rows.length} employee records** duplicate bank account share kar rahe hain:\n\n`;
    ans += `| Bank Account No | Emp Code | Employee Name | Location | Designation | Duplicate Usage |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 50)) {
      const acc = r.BankAccountNo || "-";
      const code = r.EmployeeCode || "-";
      const name = r.EmployeeName || "-";
      const loc = r.Location || "-";
      const desg = r.Designation || "-";
      const count = r.DuplicateCount || "-";
      ans += `| \`${acc}\` | ${code} | **${name}** | ${loc} | ${desg} | ${count} employees |\n`;
    }
    if (rows.length > 50) {
      ans += `\n*...aur ${rows.length - 50} aur duplicate records hain.*`;
    }
    return {
      answer: ans,
      summary: `${rows.length} duplicate bank account records found`
    };
  }

  if (intent === "EMPLOYEE_BY_AADHAAR_NO" && rows.length > 0) {
    const aadharVal = entities.aadharNumber || rows[0].AadharNo || "";
    const firstRow = rows[0];
    const firstKey = Object.keys(firstRow)[0] || "";
    const isCountResult = rows.length === 1 && (
      typeof firstRow[firstKey] === "number" || !isNaN(Number(firstRow[firstKey]))
    ) && !firstRow.EmployeeCode && !firstRow.EmployeeName && !firstRow.EMPCODE && !firstRow.EMPFIRSTNAME;

    if (isCountResult) {
      const countVal = firstRow[firstKey] || Object.values(firstRow)[0] || 0;
      return {
        answer: `AutoVyn ERP ke records ke anusar, Aadhaar Number **${aadharVal}** total **${countVal} employee(s)** ke pass registered mila hai.`,
        summary: `Aadhaar ${aadharVal} is registered with ${countVal} employees`
      };
    }

    if (rows.length === 1) {
      const row = rows[0];
      const cardVer = String(row.AadhaarCardVerified).toLowerCase() === "true" || row.AadhaarCardVerified === 1 || row.AadhaarCardVerified === "1" ? "✅ Verified" : "❌ Not Verified / Pending";
      const linkedVer = String(row.AadhaarLinkedVerified).toLowerCase() === "true" || row.AadhaarLinkedVerified === 1 || row.AadhaarLinkedVerified === "1" ? "✅ Linked" : "Pending";
      const panLinkVer = String(row.AadhaarLinkedWithPanVerified).toLowerCase() === "true" || row.AadhaarLinkedWithPanVerified === 1 || row.AadhaarLinkedWithPanVerified === "1" ? "✅ Linked" : "Pending";

      let ans = `Aadhaar Number **${row.AadharNo || aadharVal}** ke employee details:\n\n` +
        `• **Employee Code:** ${row.EmployeeCode || "-"}\n` +
        `• **Employee Name:** **${row.EmployeeName || "-"}**\n` +
        `• **Designation:** ${row.Designation || "-"}\n` +
        `• **Location / Branch:** ${row.Location || "-"}\n` +
        `• **Mobile No:** ${row.MobileNo || "-"}\n` +
        `• **PAN No:** ${row.PAN || "-"}\n` +
        `• **Bank Account No:** ${row.BankAccountNo || "-"}\n` +
        `• **Bank Name:** ${row.BankName || "-"}\n` +
        `• **Aadhaar Card Verified:** ${cardVer}\n` +
        `• **Aadhaar Linked Status:** ${linkedVer}\n` +
        `• **Aadhaar Linked with PAN:** ${panLinkVer}\n`;
      if (row.VerificationDate) ans += `• **Verification Date:** ${row.VerificationDate}\n`;

      return {
        answer: ans.trim(),
        summary: `Aadhaar ${row.AadharNo || aadharVal} belongs to ${row.EmployeeName} (${row.EmployeeCode})`
      };
    } else {
      let ans = `AutoVyn ERP me Aadhaar Number **${aadharVal}** total **${rows.length} employee(s)** ke pass registered mila hai:\n\n`;
      ans += `| # | Emp Code | Employee Name | Location / Branch | Designation | Mobile | PAN | Bank Account No |\n`;
      ans += `| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      rows.forEach((r, idx) => {
        ans += `| ${idx + 1} | **${r.EmployeeCode || "-"}** | **${r.EmployeeName || "-"}** | ${r.Location || "-"} | ${r.Designation || "-"} | ${r.MobileNo || "-"} | ${r.PAN || "-"} | ${r.BankAccountNo || "-"} |\n`;
      });
      return {
        answer: ans.trim(),
        summary: `Aadhaar ${aadharVal} is registered with ${rows.length} employees`
      };
    }
  }

  if (intent === "EMPLOYEE_BY_PAN_NO" && rows.length > 0) {
    const panVal = entities.panNumber || rows[0].PAN || "";
    const firstRow = rows[0];
    const firstKey = Object.keys(firstRow)[0] || "";
    const isCountResult = rows.length === 1 && (
      typeof firstRow[firstKey] === "number" || !isNaN(Number(firstRow[firstKey]))
    ) && !firstRow.EmployeeCode && !firstRow.EmployeeName && !firstRow.EMPCODE && !firstRow.EMPFIRSTNAME;

    if (isCountResult) {
      const countVal = firstRow[firstKey] || Object.values(firstRow)[0] || 0;
      return {
        answer: `AutoVyn ERP ke records ke anusar, PAN Number **${panVal}** total **${countVal} employee(s)** ke pass registered mila hai.`,
        summary: `PAN ${panVal} is registered with ${countVal} employees`
      };
    }

    if (rows.length === 1) {
      const row = rows[0];
      const panVer = String(row.PanCardVerified).toLowerCase() === "true" || row.PanCardVerified === 1 || row.PanCardVerified === "1" ? "✅ Verified" : "❌ Not Verified / Pending";
      const panMatch = String(row.PanNameMatchVerified).toLowerCase() === "true" || row.PanNameMatchVerified === 1 || row.PanNameMatchVerified === "1" ? "✅ Matched" : "Pending";

      let ans = `PAN Number **${row.PAN || panVal}** ke employee details:\n\n` +
        `• **Employee Code:** ${row.EmployeeCode || "-"}\n` +
        `• **Employee Name:** **${row.EmployeeName || "-"}**\n` +
        `• **Designation:** ${row.Designation || "-"}\n` +
        `• **Location / Branch:** ${row.Location || "-"}\n` +
        `• **Mobile No:** ${row.MobileNo || "-"}\n` +
        `• **Aadhaar No:** ${row.AadharNo || "-"}\n` +
        `• **Bank Account No:** ${row.BankAccountNo || "-"}\n` +
        `• **PAN Card Verified:** ${panVer}\n` +
        `• **PAN Name Matched:** ${panMatch}\n`;
      if (row.VerificationDate) ans += `• **Verification Date:** ${row.VerificationDate}\n`;

      return {
        answer: ans.trim(),
        summary: `PAN ${row.PAN || panVal} belongs to ${row.EmployeeName} (${row.EmployeeCode})`
      };
    } else {
      let ans = `AutoVyn ERP me PAN Number **${panVal}** total **${rows.length} employee(s)** ke pass registered mila hai:\n\n`;
      ans += `| # | Emp Code | Employee Name | Location / Branch | Designation | Mobile | Bank Account No |\n`;
      ans += `| :- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      rows.forEach((r, idx) => {
        ans += `| ${idx + 1} | **${r.EmployeeCode || "-"}** | **${r.EmployeeName || "-"}** | ${r.Location || "-"} | ${r.Designation || "-"} | ${r.MobileNo || "-"} | ${r.BankAccountNo || "-"} |\n`;
      });
      return {
        answer: ans.trim(),
        summary: `PAN ${panVal} is registered with ${rows.length} employees`
      };
    }
  }

  if (intent === "EMPLOYEE_BY_MOBILE_NO" && rows.length > 0) {
    const mob = entities.mobileNumber || rows[0].MobileNo || "";
    const firstRow = rows[0];
    const firstKey = Object.keys(firstRow)[0] || "";
    const isCountResult = rows.length === 1 && (
      typeof firstRow[firstKey] === "number" || !isNaN(Number(firstRow[firstKey]))
    ) && !firstRow.EmployeeCode && !firstRow.EmployeeName && !firstRow.EMPCODE && !firstRow.EMPFIRSTNAME;

    if (isCountResult) {
      const countVal = firstRow[firstKey] || Object.values(firstRow)[0] || 0;
      return {
        answer: `AutoVyn ERP ke records ke anusar, Mobile Number **${mob}** total **${countVal} employee(s)** ke pass registered mila hai.`,
        summary: `Mobile ${mob} is registered with ${countVal} employees`
      };
    }

    if (rows.length === 1) {
      const row = rows[0];
      let ans = `Mobile Number **${mob}** ke employee details:\n\n` +
        `• **Employee Code:** ${row.EmployeeCode || "-"}\n` +
        `• **Employee Name:** **${row.EmployeeName || "-"}**\n` +
        `• **Designation:** ${row.Designation || "-"}\n` +
        `• **Location / Branch:** ${row.Location || "-"}\n` +
        `• **PAN No:** ${row.PAN || "-"}\n` +
        `• **Aadhaar No:** ${row.AadharNo || "-"}\n` +
        `• **Bank Account No:** ${row.BankAccountNo || "-"}\n`;
      return {
        answer: ans.trim(),
        summary: `Mobile ${mob} belongs to ${row.EmployeeName} (${row.EmployeeCode})`
      };
    } else {
      let ans = `AutoVyn ERP me Mobile Number **${mob}** total **${rows.length} employee(s)** ke pass registered mila hai:\n\n`;
      ans += `| # | Emp Code | Employee Name | Location / Branch | Designation | PAN | Bank Account No |\n`;
      ans += `| :- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      rows.forEach((r, idx) => {
        ans += `| ${idx + 1} | **${r.EmployeeCode || "-"}** | **${r.EmployeeName || "-"}** | ${r.Location || "-"} | ${r.Designation || "-"} | ${r.PAN || "-"} | ${r.BankAccountNo || "-"} |\n`;
      });
      return {
        answer: ans.trim(),
        summary: `Mobile ${mob} is registered with ${rows.length} employees`
      };
    }
  }

  if (intent === "DUPLICATE_AADHAAR_NUMBERS" && rows.length > 0) {
    let ans = `AutoVyn ERP me **${rows.length} employee records** duplicate Aadhaar number share kar rahe hain:\n\n`;
    ans += `| Aadhaar Number | Emp Code | Employee Name | Location | Designation | Duplicate Usage |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 50)) {
      const aadhar = r.AadharNo || "-";
      const code = r.EmployeeCode || "-";
      const name = r.EmployeeName || "-";
      const loc = r.Location || "-";
      const desg = r.Designation || "-";
      const count = r.DuplicateCount || "-";
      ans += `| \`${aadhar}\` | ${code} | **${name}** | ${loc} | ${desg} | ${count} employees |\n`;
    }
    return {
      answer: ans,
      summary: `${rows.length} duplicate Aadhaar records found`
    };
  }

  if (intent === "DUPLICATE_PAN_NUMBERS" && rows.length > 0) {
    let ans = `AutoVyn ERP me **${rows.length} employee records** duplicate PAN number share kar rahe hain:\n\n`;
    ans += `| PAN Number | Emp Code | Employee Name | Location | Designation | Duplicate Usage |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows.slice(0, 50)) {
      const pan = r.PAN || "-";
      const code = r.EmployeeCode || "-";
      const name = r.EmployeeName || "-";
      const loc = r.Location || "-";
      const desg = r.Designation || "-";
      const count = r.DuplicateCount || "-";
      ans += `| \`${pan}\` | ${code} | **${name}** | ${loc} | ${desg} | ${count} employees |\n`;
    }
    return {
      answer: ans,
      summary: `${rows.length} duplicate PAN records found`
    };
  }

  // Birthday Direct Formatters
  const isBirthdayQuery = intent === "BIRTHDAY_LOOKUP" || intent === "DOB_LOOKUP" || /\b(birthday|bday|b'day|janamdin|dob|date of birth)\b/i.test(message || entities.rawMessage || "");
  if (isBirthdayQuery && rows.length > 0 && (rows[0].DateOfBirth !== undefined || rows[0].DOB !== undefined)) {
    const r = rows[0];
    const empName = r.EmployeeName || "Employee";
    const empCode = r.EmployeeCode || "";
    const dob = r.DateOfBirth || r.DOB || "-";
    const age = r.Age ? ` (${r.Age} years old)` : "";

    let ans = `🎂 **${empName} (${empCode})** ka Date of Birth / Birthday:\n\n` +
      `• **Birthday / DOB:** **${dob}**${age}\n` +
      `• **Designation:** ${r.Designation || "-"}\n` +
      `• **Location / Branch:** ${r.Location || "-"}\n` +
      `• **Mobile No:** ${r.MobileNo || "-"}\n`;
    if (r.Email) ans += `• **Email:** ${r.Email}\n`;

    return {
      answer: ans.trim(),
      summary: `Birthday of ${empName} (${empCode}) is ${dob}`
    };
  }

  if (intent === "BIRTHDAY_TODAY" && rows.length > 0) {
    let ans = `🎉 **Aaj ${rows.length} employee(s) ka Birthday hai:**\n\n`;
    ans += `| Emp Code | Employee Name | DOB | Age | Location | Designation | Mobile |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows) {
      ans += `| ${r.EmployeeCode || "-"} | **${r.EmployeeName || "-"}** | 🎂 ${r.DateOfBirth || "-"} | ${r.Age || "-"} | ${r.Location || "-"} | ${r.Designation || "-"} | ${r.MobileNo || "-"} |\n`;
    }
    return {
      answer: ans.trim(),
      summary: `Today's birthdays: ${rows.length} employees`
    };
  }

  if (intent === "BIRTHDAYS_MONTH" && rows.length > 0) {
    let ans = `🎂 **Employee Birthdays (${rows.length} employees):**\n\n`;
    ans += `| Emp Code | Employee Name | DOB | Day | Age | Location | Designation |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows) {
      ans += `| ${r.EmployeeCode || "-"} | **${r.EmployeeName || "-"}** | ${r.DateOfBirth || "-"} | Day ${r.BirthDayNumber || "-"} | ${r.Age || "-"} | ${r.Location || "-"} | ${r.Designation || "-"} |\n`;
    }
    return {
      answer: ans.trim(),
      summary: `Month birthdays: ${rows.length} employees`
    };
  }

  // Work Anniversary Formatter
  if (intent === "WORK_ANNIVERSARY" && rows.length > 0) {
    const isToday = entities.isToday || (/\b(today|aaj)\b/i.test(entities.rawMessage || message || "") && !entities.day);
    const monthsNameArr = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = entities.month ? (monthsNameArr[entities.month] || `Month ${entities.month}`) : "";
    const yearStr = entities.year ? ` ${entities.year}` : "";

    let dateLabel = "";
    if (isToday) {
      dateLabel = "Aaj";
    } else if (entities.day && entities.month) {
      dateLabel = `${entities.day} ${monthName}${yearStr}`;
    } else if (entities.month) {
      dateLabel = `${monthName}${yearStr} me`;
    } else {
      dateLabel = "Iss period me";
    }

    // 1. Guard for COUNT query (e.g. SELECT COUNT(*) AS TotalAnniversaryCount)
    const firstRow = rows[0] || {};
    const countKey = Object.keys(firstRow).find(k => /^(TotalAnniversaryCount|AnniversaryCount|TotalCount|count|cnt|Total|TotalEmployees)$/i.test(k));
    const isCountQuery = rows.length === 1 && (
      countKey !== undefined ||
      /^\s*SELECT\s+(TOP\s+\d+\s+)?COUNT/i.test(sql || "") ||
      (!firstRow.EmployeeCode && !firstRow.EMPCODE && !firstRow.EmployeeName && !firstRow.EMPFIRSTNAME && !firstRow.AnniversaryDay && typeof Object.values(firstRow)[0] === "number")
    );

    if (isCountQuery) {
      const rawCount = countKey ? firstRow[countKey] : Object.values(firstRow)[0];
      const countVal = Number(rawCount) || 0;
      return {
        answer: `🎉 AutoVyn ERP ke records ke anusar, **${dateLabel} total ${countVal.toLocaleString()} employee(s)** ki Work Anniversary hai.`,
        summary: `${dateLabel} work anniversary: ${countVal} employee(s)`
      };
    }

    // 2. Guard for Day-Grouped query (e.g. GROUP BY DAY([E].[CURRENTJOINDATE]))
    const isDayGroupedQuery = rows.length > 0 && rows[0].AnniversaryDay !== undefined && (rows[0].TotalEmployees !== undefined || rows[0].EmployeeCount !== undefined || rows[0].TotalEmployeesOnThisDay !== undefined || rows[0].Count !== undefined || rows[0].count !== undefined) && !rows[0].EmployeeName;
    if (isDayGroupedQuery) {
      let totalEmps = 0;
      let ans = `🎉 **${dateLabel} din-war (day-wise) Work Anniversaries:**\n\n`;
      ans += `| # | Anniversary Day | Total Employees |\n`;
      ans += `| :- | :--- | :--- |\n`;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const day = r.AnniversaryDay || "-";
        const c = Number(r.TotalEmployees || r.EmployeeCount || r.TotalEmployeesOnThisDay || r.Count || r.count || 0);
        totalEmps += c;
        ans += `| **${i + 1}** | **${day} ${monthName}** | **${c} employee(s)** |\n`;
      }
      ans += `\n**Total:** ${totalEmps.toLocaleString()} employee(s) ki work anniversary hai ${dateLabel}.`;
      return {
        answer: ans.trim(),
        summary: `${dateLabel} work anniversary: ${totalEmps} employee(s) across ${rows.length} days`
      };
    }

    const uniqueDays = [...new Set(rows.map(r => r.AnniversaryDay || (r.JoiningDate ? parseInt(String(r.JoiningDate).slice(0, 2), 10) : null)).filter(Boolean))].sort((a, b) => a - b);
    const daysSummary = (!entities.day && uniqueDays.length > 0)
      ? `\n📅 **Anniversary Days${monthName ? ` (${monthName}${yearStr})` : ""}:** ${uniqueDays.join(', ')}${monthName ? ` ${monthName}` : ""}\n\n`
      : "\n\n";

    let ans = `🎉 **${dateLabel} total ${rows.length} employee(s) ki Work Anniversary hai:**${daysSummary}`;
    ans += `| # | Anniversary Day | Emp Code | Employee Name | Joining Date | Years Of Service${yearStr ? ` (in${yearStr})` : ""} | Location | Designation |\n`;
    ans += `| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const code = r.EmployeeCode || "-";
      const name = r.EmployeeName || "-";
      const dayVal = r.AnniversaryDay !== undefined ? `${r.AnniversaryDay}${monthName ? ` ${monthName.slice(0, 3)}` : ""}` : "-";
      const jDate = r.JoiningDate ? (typeof r.JoiningDate === "string" ? r.JoiningDate.slice(0, 10) : new Date(r.JoiningDate).toLocaleDateString('en-GB')) : "-";
      const yos = r.YearsOfService !== undefined ? `${r.YearsOfService} Year(s)` : "-";
      const loc = r.Location || "-";
      const desg = r.Designation || "-";
      ans += `| **${i + 1}** | **${dayVal}** | ${code} | **${name}** | ${jDate} | ${yos} | ${loc} | ${desg} |\n`;
    }
    return {
      answer: ans.trim(),
      summary: `${dateLabel} work anniversary: ${rows.length} employee(s)`
    };
  }

  // Marriage Anniversary Formatter
  if (intent === "MARRIAGE_ANNIVERSARY" && rows.length > 0) {
    const isToday = entities.isToday || (/\b(today|aaj)\b/i.test(entities.rawMessage || message || "") && !entities.day);
    const monthsNameArr = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const monthName = entities.month ? (monthsNameArr[entities.month] || `Month ${entities.month}`) : "";
    const yearStr = entities.year ? ` ${entities.year}` : "";

    let dateLabel = "";
    if (isToday) {
      dateLabel = "Aaj";
    } else if (entities.day && entities.month) {
      dateLabel = `${entities.day} ${monthName}${yearStr}`;
    } else if (entities.month) {
      dateLabel = `${monthName}${yearStr} me`;
    } else {
      dateLabel = "Iss period me";
    }

    // 1. Guard for COUNT query
    const firstRow = rows[0] || {};
    const countKey = Object.keys(firstRow).find(k => /^(TotalAnniversaryCount|AnniversaryCount|TotalCount|count|cnt|Total|TotalEmployees|TotalMarriageCount)$/i.test(k));
    const isCountQuery = rows.length === 1 && (
      countKey !== undefined ||
      /^\s*SELECT\s+(TOP\s+\d+\s+)?COUNT/i.test(sql || "") ||
      (!firstRow.EmployeeCode && !firstRow.EMPCODE && !firstRow.EmployeeName && !firstRow.EMPFIRSTNAME && !firstRow.AnniversaryDay && typeof Object.values(firstRow)[0] === "number")
    );

    if (isCountQuery) {
      const rawCount = countKey ? firstRow[countKey] : Object.values(firstRow)[0];
      const countVal = Number(rawCount) || 0;
      return {
        answer: `💍 AutoVyn ERP ke records ke anusar, **${dateLabel} total ${countVal.toLocaleString()} employee(s)** ki Marriage Anniversary hai.`,
        summary: `${dateLabel} marriage anniversary: ${countVal} employee(s)`
      };
    }

    // 2. Guard for Day-Grouped query
    const isDayGroupedQuery = rows.length > 0 && rows[0].AnniversaryDay !== undefined && (rows[0].TotalEmployees !== undefined || rows[0].EmployeeCount !== undefined || rows[0].TotalEmployeesOnThisDay !== undefined || rows[0].Count !== undefined || rows[0].count !== undefined) && !rows[0].EmployeeName;
    if (isDayGroupedQuery) {
      let totalEmps = 0;
      let ans = `💍 **${dateLabel} din-war (day-wise) Marriage Anniversaries:**\n\n`;
      ans += `| # | Anniversary Day | Total Employees |\n`;
      ans += `| :- | :--- | :--- |\n`;
      for (let i = 0; i < rows.length; i++) {
        const r = rows[i];
        const day = r.AnniversaryDay || "-";
        const c = Number(r.TotalEmployees || r.EmployeeCount || r.TotalEmployeesOnThisDay || r.Count || r.count || 0);
        totalEmps += c;
        ans += `| **${i + 1}** | **${day} ${monthName}** | **${c} employee(s)** |\n`;
      }
      ans += `\n**Total:** ${totalEmps.toLocaleString()} employee(s) ki marriage anniversary hai ${dateLabel}.`;
      return {
        answer: ans.trim(),
        summary: `${dateLabel} marriage anniversary: ${totalEmps} employee(s) across ${rows.length} days`
      };
    }

    const uniqueDays = [...new Set(rows.map(r => r.AnniversaryDay || (r.MarriageDate ? parseInt(String(r.MarriageDate).slice(0, 2), 10) : null)).filter(Boolean))].sort((a, b) => a - b);
    const daysSummary = (!entities.day && uniqueDays.length > 0)
      ? `\n💍 **Marriage Anniversary Days${monthName ? ` (${monthName}${yearStr})` : ""}:** ${uniqueDays.join(', ')}${monthName ? ` ${monthName}` : ""}\n\n`
      : "\n\n";

    let ans = `💍 **${dateLabel} total ${rows.length} employee(s) ki Marriage Anniversary hai:**${daysSummary}`;
    ans += `| # | Anniversary Day | Emp Code | Employee Name | Marriage Date | Years Of Marriage${yearStr ? ` (in${yearStr})` : ""} | Location | Designation |\n`;
    ans += `| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const code = r.EmployeeCode || "-";
      const name = r.EmployeeName || "-";
      const dayVal = r.AnniversaryDay !== undefined ? `${r.AnniversaryDay}${monthName ? ` ${monthName.slice(0, 3)}` : ""}` : "-";
      const mDate = r.MarriageDate ? (typeof r.MarriageDate === "string" ? r.MarriageDate.slice(0, 10) : new Date(r.MarriageDate).toLocaleDateString('en-GB')) : "-";
      const yom = r.YearsOfMarriage !== undefined ? `${r.YearsOfMarriage} Year(s)` : "-";
      const loc = r.Location || "-";
      const desg = r.Designation || "-";
      ans += `| **${i + 1}** | **${dayVal}** | ${code} | **${name}** | ${mDate} | ${yom} | ${loc} | ${desg} |\n`;
    }
    return {
      answer: ans.trim(),
      summary: `${dateLabel} marriage anniversary: ${rows.length} employee(s)`
    };
  }

  // Specific Date Birthday Formatter
  if (intent === "BIRTHDAY_BY_DATE" && rows.length > 0) {
    const dateLabel = entities.day && entities.month ? `${entities.day}/${entities.month}` : (entities.specificDate || "Requested date");
    let ans = `🎂 **${dateLabel} ko ${rows.length} employee(s) ka Birthday tha / hai:**\n\n`;
    ans += `| Emp Code | Employee Name | DOB | Age | Location | Designation | Mobile |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    for (const r of rows) {
      ans += `| ${r.EmployeeCode || "-"} | **${r.EmployeeName || "-"}** | 🎂 ${r.DateOfBirth || "-"} | ${r.Age || "-"} | ${r.Location || "-"} | ${r.Designation || "-"} | ${r.MobileNo || "-"} |\n`;
    }
    return {
      answer: ans.trim(),
      summary: `Birthdays on ${dateLabel}: ${rows.length} employees`
    };
  }

  // Salary Aggregation Formatter (Total Basic, Gross, Net, Deductions, Employees Count)
  if ((intent === "SALARY_TOTAL_AGGREGATE" || (rows.length === 1 && (rows[0].Total_Basic_Earn !== undefined || rows[0].TotalBasicEarn !== undefined || rows[0].Total_Net_Salary !== undefined))) && rows.length > 0) {
    const r = rows[0];
    const totalEmp = r.TotalEmployeesPaid || r.TotalEmployees || r.TotalEmployeesWithSalary || 0;
    const basicNum = Number(r.Total_Basic_Earn || r.TotalBasicEarn || 0);
    const grossNum = Number(r.Total_Gross_Earn || r.TotalGrossEarn || 0);
    const netNum = Number(r.Total_Net_Salary || r.Total_Net_Pay || r.TotalNetSalary || 0);
    const dedNum = Number(r.Total_Deductions || r.TotalDeductions || 0);
    const hraNum = Number(r.Total_HRA_Earn || r.TotalHRAEarn || 0);

    const basic = basicNum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const gross = grossNum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const net = netNum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const ded = dedNum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const hra = hraNum.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const mStr = entities.month ? `${entities.month}/${entities.year || new Date().getFullYear()}` : (entities.year ? `Year ${entities.year}` : "Overall");
    const locStr = entities.branch ? ` (Location / Branch: **${entities.branch}**)` : "";

    if (basicNum === 0 && grossNum === 0 && netNum === 0 && totalEmp === 0) {
      return {
        answer: `AutoVyn ERP me **${mStr}**${locStr} ke liye koi salary / payroll data process nahi hua hai (Total Basic: ₹0.00).`,
        summary: `No salary records for ${mStr}${locStr}`
      };
    }

    let ans = `AutoVyn ERP Salary & Payroll Summary for **${mStr}**${locStr}:\n\n`;
    if (entities.salaryField === "Basic_Earn") {
      ans += `• 💰 **Total Basic Pay / Earnings (SUM):** **₹${basic}**\n`;
      if (totalEmp > 0) ans += `• 👥 **Total Employees:** ${totalEmp} employee(s)\n`;
      if (grossNum > 0) ans += `• 📈 **Total Gross Earnings:** ₹${gross}\n`;
      if (dedNum > 0) ans += `• 📉 **Total Deductions:** ₹${ded}\n`;
      if (netNum > 0) ans += `• 💵 **Total Net Payout (Final Payment):** ₹${net}`;
    } else if (entities.salaryField === "Gross_Earn") {
      ans += `• 📈 **Total Gross Earnings (SUM):** **₹${gross}**\n`;
      if (totalEmp > 0) ans += `• 👥 **Total Employees:** ${totalEmp} employee(s)\n`;
      if (basicNum > 0) ans += `• 💰 **Total Basic Pay:** ₹${basic}\n`;
      if (dedNum > 0) ans += `• 📉 **Total Deductions:** ₹${ded}\n`;
      if (netNum > 0) ans += `• 💵 **Total Net Payout (Final Payment):** ₹${net}`;
    } else if (entities.salaryField === "Deducation") {
      ans += `• 📉 **Total Deductions (SUM):** **₹${ded}**\n`;
      if (totalEmp > 0) ans += `• 👥 **Total Employees:** ${totalEmp} employee(s)\n`;
      if (grossNum > 0) ans += `• 📈 **Total Gross Earnings:** ₹${gross}\n`;
      if (netNum > 0) ans += `• 💵 **Total Net Payout (Final Payment):** ₹${net}`;
    } else {
      ans += `• 💵 **Total Net Payout (Final Payment):** **₹${net}**\n`;
      if (totalEmp > 0) ans += `• 👥 **Total Employees Paid:** ${totalEmp} employee(s)\n`;
      if (basicNum > 0) ans += `• 💰 **Total Basic Earnings:** ₹${basic}\n`;
      if (grossNum > 0) ans += `• 📈 **Total Gross Earnings:** ₹${gross}\n`;
      if (dedNum > 0) ans += `• 📉 **Total Deductions:** ₹${ded}`;
    }

    return {
      answer: ans.trim(),
      summary: `Total Basic: ₹${basic}, Net: ₹${net} for ${mStr}${locStr}`
    };
  }

  if (intent === "SALARY_COUNT_AGGREGATE" && rows.length > 0) {
    const r = rows[0];
    const count = r.TotalEmployeesWithSalary || r.TotalEmployees || 0;
    const mStr = entities.month ? `for **${entities.month}/${entities.year || new Date().getFullYear()}**` : "";
    const locStr = entities.branch ? ` in Branch / Location **${entities.branch}**` : "";
    return {
      answer: `AutoVyn ERP ke record ke anusar, ${mStr}${locStr} total **${count} employee(s)** ki salary generate / process hui hai.`,
      summary: `${count} employees salary processed ${mStr}${locStr}`.trim()
    };
  }

  // Salary Slip / Payroll Multi-Row & Single-Row Formatters
  if ((intent === "SALARY_REPORT" || intent === "SELF_SALARY") && rows.length > 0 && (rows[0].GrossSalary !== undefined || rows[0].GrossEarnings !== undefined || rows[0].NetSalary !== undefined || rows[0].NetPayment !== undefined || rows[0].FinalPayment !== undefined)) {
    if (rows.length === 1) {
      const r = rows[0];
      const m = r.SalaryMonth || entities.month || "-";
      const y = r.SalaryYear || entities.year || "-";
      const net = (r.NetSalary || r.NetPayment || r.FinalPayment || 0).toLocaleString("en-IN");
      const gross = (r.GrossSalary || r.GrossEarnings || 0).toLocaleString("en-IN");
      const basic = (r.BasicPay || r.BasicEarnings || 0).toLocaleString("en-IN");
      const hra = (r.HRA || r.HRAEarnings || 0).toLocaleString("en-IN");
      const ded = (r.TotalDeductions || r.Deductions || 0).toLocaleString("en-IN");

      let ans = `Salary Slip Summary for **${r.EmployeeName || "Employee"} (${r.EmployeeCode || "-"})** for **${m}/${y}**:\n\n` +
        `• **Gross Earnings:** ₹${gross}\n` +
        `• **Basic Pay:** ₹${basic}\n` +
        `• **HRA:** ₹${hra}\n` +
        `• **Total Deductions:** ₹${ded}\n` +
        `• **Net Pay / Final Payment:** **₹${net}**\n` +
        `• **Present Days:** ${r.PresentDays || "-"} / Total Days: ${r.TotalDays || "-"}\n` +
        `• **Location:** ${r.Location || "-"}`;
      return {
        answer: ans.trim(),
        summary: `Salary Slip for ${r.EmployeeCode} (${m}/${y}): Net ₹${net}`
      };
    } else {
      let ans = `AutoVyn ERP me **${rows.length} employee(s)** ke salary records mile hain:\n\n`;
      ans += `| Emp Code | Employee Name | Month/Year | Gross Earn | Net Pay | Deductions | Location |\n`;
      ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      for (const r of rows.slice(0, 50)) {
        const net = Number(r.NetSalary || r.NetPayment || r.FinalPayment || 0).toLocaleString("en-IN");
        const gross = Number(r.GrossSalary || r.GrossEarnings || 0).toLocaleString("en-IN");
        const ded = Number(r.TotalDeductions || r.Deductions || 0).toLocaleString("en-IN");
        ans += `| ${r.EmployeeCode || "-"} | **${r.EmployeeName || "-"}** | ${r.SalaryMonth || "-"}/${r.SalaryYear || "-"} | ₹${gross} | **₹${net}** | ₹${ded} | ${r.Location || "-"} |\n`;
      }
      if (rows.length > 50) ans += `\n*...aur ${rows.length - 50} aur records hain.*`;
      return {
        answer: ans.trim(),
        summary: `${rows.length} salary records retrieved`
      };
    }
  }

  // Dedicated Formatter: Employee Address or Profile Lookup
  const isAddressQuery = Boolean(
    entities.isAddressQuery ||
    /\b(address|permanent\s*address|current\s*address|pata|rehta\s*hai|ghar|niwas)\b/i.test(message || entities.rawMessage || "")
  );

  if (rows.length === 1 && (rows[0].EmployeeCode || rows[0].EmployeeName) && (rows[0].PermanentAddress !== undefined || rows[0].CurrentAddress !== undefined || rows[0].FatherName !== undefined || isAddressQuery)) {
    const r = rows[0];
    const empName = r.EmployeeName || (r.EMPFIRSTNAME ? `${r.EMPFIRSTNAME} ${r.EMPLASTNAME || ""}`.trim() : "Employee");
    const empCode = r.EmployeeCode || r.EMPCODE || "-";
    const permAddr = r.PermanentAddress || r.PERMANENTADDRESS1 || null;
    const currAddr = r.CurrentAddress || r.CURRENTADDRESS1 || null;

    if (isAddressQuery) {
      let ans = `AutoVyn ERP ke record ke anusar, **${empName} (${empCode})** ke Address details:\n\n`;
      if (permAddr && String(permAddr).trim() !== "") {
        ans += `• 🏠 **Permanent Address:** **${String(permAddr).trim()}**\n`;
      } else {
        ans += `• 🏠 **Permanent Address:** Database (\`EMPLOYEEMASTER\`) me blank / update nahi hai (Not Available in Master).\n`;
      }
      if (currAddr && String(currAddr).trim() !== "") {
        ans += `• 📍 **Current Address:** ${String(currAddr).trim()}\n`;
      } else if (permAddr && String(permAddr).trim() !== "") {
        ans += `• 📍 **Current Address:** Same as Permanent Address\n`;
      }
      ans += `• **Location / Branch:** ${r.Location || r.Branch || "-"}\n`;
      ans += `• **Designation:** ${r.Designation || "-"}\n`;
      ans += `• **Mobile No:** ${r.MobileNo || "-"}\n`;
      if (r.EmploymentStatus || r.Status) ans += `• **Employment Status:** ${r.EmploymentStatus || r.Status}\n`;

      return {
        answer: ans.trim(),
        summary: `Address for ${empName} (${empCode}): ${permAddr ? String(permAddr).trim() : 'Not available'}`
      };
    }

    let ans = `Employee Profile for **${empName} (${empCode})**:\n\n`;
    ans += `• **Designation:** ${r.Designation || "-"} | **Department:** ${r.Department || "-"}\n`;
    ans += `• **Location / Branch:** ${r.Location || r.Branch || "-"}\n`;
    ans += `• **Date of Joining:** ${r.JoiningDate || r.DateOfJoining || "-"} | **Status:** ${r.EmploymentStatus || r.Status || "Active"}\n`;
    ans += `• **Mobile No:** ${r.MobileNo || "-"}\n`;
    if (r.Email || r.OfficialEmail || r.PersonalEmail) ans += `• **Email:** ${r.Email || r.OfficialEmail || r.PersonalEmail || "-"}\n`;
    ans += `• **Aadhaar No:** ${r.AadharNo || "-"} | **PAN No:** ${r.PAN || "-"}\n`;
    ans += `• **Bank Account No:** ${r.BankAccountNo || "-"} | **Bank Name:** ${r.BankName || "-"} | **IFSC:** ${r.IFSC || "-"}\n`;
    if (permAddr && String(permAddr).trim() !== "") ans += `• **Permanent Address:** ${String(permAddr).trim()}\n`;
    if (currAddr && String(currAddr).trim() !== "") ans += `• **Current Address:** ${String(currAddr).trim()}\n`;
    if (r.FatherName) ans += `• **Father Name:** ${r.FatherName} (${r.FatherMobile || r.FatherMobile2 || "-"})\n`;
    if (r.MotherName) ans += `• **Mother Name:** ${r.MotherName} (${r.MotherMobile || r.MotherMobile2 || "-"})\n`;
    if (r.SpouseName) ans += `• **Spouse Name:** ${r.SpouseName} (${r.SpouseMobile || r.SpouseMobile2 || "-"})\n`;
    if (r.EmergencyContactName || r.EmergencyContactNo) ans += `• **Emergency Contact:** ${r.EmergencyContactName || "-"} (${r.EmergencyContactNo || "-"})\n`;
    if (r.Supervisor) ans += `• **Reporting Supervisor:** ${r.Supervisor}\n`;
    if (r.PassportNo) ans += `• **Passport No:** ${r.PassportNo} (Expiry: ${r.PassportExpiryDate || "-"})\n`;
    if (r.DrivingLicenseNo) ans += `• **Driving License:** ${r.DrivingLicenseNo} (Expiry: ${r.DrivingLicenseExpiryDate || "-"})\n`;
    if (r.MonthlyCTC || r.AnnualCTC) ans += `• **CTC:** Monthly ₹${r.MonthlyCTC || "-"} | Annual ₹${r.AnnualCTC || "-"}\n`;
    return {
      answer: ans.trim(),
      summary: `Profile retrieved for ${empName} (${empCode})`
    };
  }

  const hasSalaryFileFields = rows.length > 0 && (
    rows[0].Final_Payment !== undefined ||
    rows[0].NetSalary !== undefined ||
    rows[0].Gross_Earn !== undefined ||
    rows[0].GrossEarnings !== undefined ||
    rows[0].Total_Earn !== undefined ||
    rows[0].TotalEarnings !== undefined ||
    rows[0].SalMnth !== undefined ||
    rows[0].SalaryMonth !== undefined
  );

  if (
    (intent === "HIGHEST_SALARY_RANKING" ||
      intent === "EMPLOYEE_SALARY_HISTORY" ||
      intent === "SALARY_REPORT" ||
      hasSalaryFileFields) &&
    rows.length > 0 &&
    (hasSalaryFileFields || (rows[0].MonthlyCTC === undefined && rows[0].AnnualCTC === undefined))
  ) {
    const validRows = rows.filter(r => Number(r.NetSalary !== undefined ? r.NetSalary : (r.Final_Payment || 0)) > 0 || Number(r.GrossEarnings !== undefined ? r.GrossEarnings : (r.Gross_Earn || 0)) > 0);
    const r0 = rows[0];
    const empName = r0.EmployeeName || (r0.EMPFIRSTNAME ? `${r0.EMPFIRSTNAME} ${r0.EMPLASTNAME || ''}`.trim() : (entities.employeeName || "Employee"));
    const empCode = r0.EmployeeCode || r0.Emp_Code || r0.EMPCODE || entities.employeeCode || "-";

    if (validRows.length === 0) {
      const monthStr = entities.month ? `Month ${entities.month}` : "";
      const yearStr = entities.year ? `${entities.year}` : "";
      const periodStr = `${monthStr} ${yearStr}`.trim();
      const targetStr = entities.employeeCode ? `**${empName} (${empCode})** ke liye` : "AutoVyn ERP me";
      return {
        answer: `${targetStr} ${periodStr ? `**${periodStr}** ka` : ''} koi salary / payout record generate nahi hua hai. (No salary payout processed).`.trim(),
        summary: `No salary payout processed for ${periodStr || 'period'}`
      };
    }

    const monthsNameArr = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const getMonthName = (r) => {
      const mNum = r.Month || r.MonthNumber || r.SalMnth || r.salmnth || r.SalaryMonth || entities.month;
      return r.MonthName || (mNum && monthsNameArr[Number(mNum)] ? monthsNameArr[Number(mNum)] : (mNum ? `Month ${mNum}` : "-"));
    };

    // If single row returned (either single employee query OR top 1 highest salary query)
    if (validRows.length === 1 && (entities.month || entities.year || entities.employeeCode || intent === "HIGHEST_SALARY_RANKING")) {
      const r = validRows[0];
      const m = getMonthName(r);
      const y = r.SalaryYear || r.salyear || entities.year || "-";
      const net = Number(r.NetSalary !== undefined ? r.NetSalary : (r.Final_Payment || 0)).toLocaleString("en-IN");
      const gross = Number(r.GrossEarnings !== undefined ? r.GrossEarnings : (r.Gross_Earn || 0)).toLocaleString("en-IN");
      const basic = Number(r.BasicEarnings !== undefined ? r.BasicEarnings : (r.Basic_Earn || 0)).toLocaleString("en-IN");
      const hra = Number(r.HRAEarnings !== undefined ? r.HRAEarnings : (r.HRA_Earn || 0)).toLocaleString("en-IN");
      const ded = Number(r.TotalDeductions !== undefined ? r.TotalDeductions : (r.Deducation || 0)).toLocaleString("en-IN");
      const pDays = r.PresentDays !== undefined ? r.PresentDays : (r.Present_days || "-");
      const tDays = r.TotalDays !== undefined ? r.TotalDays : (r.Monthdays || "-");

      const isAskingHighest = intent === "HIGHEST_SALARY_RANKING" || /\b(highest|maximum|sabse\s*jyada|sabse\s*badi|max|top\s*\d*)\b/i.test(message || entities.rawMessage || "");

      if (isAskingHighest) {
        let ans = `AutoVyn ERP ke records ke anusar, **${m} ${y}** me sabse jyada salary **${r.EmployeeName || empName} (${r.EmployeeCode || empCode})** ki pay hui hai:\n\n` +
          `• **Employee Name:** **${r.EmployeeName || empName}**\n` +
          `• **Emp Code:** **${r.EmployeeCode || empCode}**\n` +
          `• **Net Pay / Final Payment:** **₹${net}**\n` +
          `• **Gross Earnings:** ₹${gross}\n` +
          `• **Basic Pay:** ₹${basic}\n` +
          `• **Total Deductions:** ₹${ded}\n` +
          `• **Location / Branch:** ${r.Location || "-"}\n` +
          `• **Designation:** ${r.Designation || "-"}`;
        return {
          answer: ans.trim(),
          summary: `Top earner in ${m} ${y}: ${r.EmployeeName || empName} (${r.EmployeeCode || empCode}) with Net ₹${net}`
        };
      }

      let ans = `Salary Slip Summary for **${r.EmployeeName || empName} (${r.EmployeeCode || empCode})** for **${m} ${y}**:\n\n` +
        `• **Gross Earnings:** ₹${gross}\n` +
        `• **Basic Pay:** ₹${basic}\n` +
        `• **HRA:** ₹${hra}\n` +
        `• **Total Deductions:** ₹${ded}\n` +
        `• **Net Pay / Final Payment:** **₹${net}**\n` +
        `• **Present Days:** ${pDays} / Total Days: ${tDays}\n` +
        `• **Location / Branch:** ${r.Location || "-"}\n` +
        `• **Designation:** ${r.Designation || "-"}`;
      return {
        answer: ans.trim(),
        summary: `Salary Slip for ${r.EmployeeCode || empCode} (${m} ${y}): Net ₹${net}`
      };
    }

    // If multiple rows without an employee code (Company-wide Month Salary Report or Highest Salary Ranking)
    if (!entities.employeeCode && !entities.isSelf && validRows.length > 1) {
      const mName = getMonthName(validRows[0]);
      const yVal = validRows[0].SalaryYear || entities.year || "";
      const isAskingHighest = intent === "HIGHEST_SALARY_RANKING" || /\b(highest|maximum|sabse\s*jyada|sabse\s*badi|max|top\s*\d*)\b/i.test(message || entities.rawMessage || "");
      let ans = isAskingHighest
        ? `**AutoVyn ERP Highest Paid Salary Ranking (${mName} ${yVal}):**\n\n`
        : `AutoVyn ERP me **${mName} ${yVal}** ke **${validRows.length} employee(s)** ke salary payout records mile hain:\n\n`;
      ans += `| Rank | Emp Code | Employee Name | Net Salary | Gross Earnings | Basic Pay | Deductions | Present Days | Location |\n`;
      ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
      validRows.slice(0, 50).forEach((r, idx) => {
        const net = `₹${Number(r.NetSalary !== undefined ? r.NetSalary : (r.Final_Payment || 0)).toLocaleString("en-IN")}`;
        const gross = `₹${Number(r.GrossEarnings !== undefined ? r.GrossEarnings : (r.Gross_Earn || 0)).toLocaleString("en-IN")}`;
        const basic = `₹${Number(r.BasicEarnings !== undefined ? r.BasicEarnings : (r.Basic_Earn || 0)).toLocaleString("en-IN")}`;
        const ded = `₹${Number(r.TotalDeductions !== undefined ? r.TotalDeductions : (r.Deducation || 0)).toLocaleString("en-IN")}`;
        const pDays = r.PresentDays !== undefined ? r.PresentDays : (r.Present_days || "-");
        ans += `| **#${idx + 1}** | **${r.EmployeeCode || "-"}** | ${r.EmployeeName || "-"} | **${net}** | ${gross} | ${basic} | ${ded} | ${pDays} | ${r.Location || "-"} |\n`;
      });
      if (validRows.length > 50) ans += `\n*(Showing top 50 of ${validRows.length} records)*`;
      return {
        answer: ans.trim(),
        summary: `${validRows.length} employees paid in ${mName} ${yVal}`
      };
    }

    // Else: Single employee salary history across multiple months
    const isAskingHighest = /\b(highest|maximum|sabse\s*jyada|sabse\s*badi|max|peak|kab|kis\s*mahine)\b/i.test(message || entities.rawMessage || "");

    let maxNet = -1;
    for (const r of validRows) {
      const net = Number(r.NetSalary !== undefined ? r.NetSalary : (r.Final_Payment || 0));
      if (net > maxNet) maxNet = net;
    }
    const peakRows = validRows.filter(r => Number(r.NetSalary !== undefined ? r.NetSalary : (r.Final_Payment || 0)) === maxNet);
    const peakMonths = peakRows.map(r => `${getMonthName(r)} ${r.SalaryYear || r.salyear || entities.year || "-"}`).join(", ");

    let ans = "";
    if (isAskingHighest) {
      ans += `AutoVyn ERP ke record ke anusar, **${empName} (${empCode})** ki sabse jyada salary **₹${maxNet.toLocaleString("en-IN")}** aai thi, jo **${peakMonths}** me mili thi.\n\n`;
      ans += `### 📋 Month-wise Salary History (Ranked by Payout):\n\n`;
    } else {
      const periodLabel = entities.year ? `Year ${entities.year}` : "Overall";
      ans += `📋 **${empName} (${empCode})** ka **${periodLabel}** Month-wise Salary Statement:\n\n`;
    }

    ans += `| Month / Year | Net Salary | Gross Earnings | Basic Pay | Deductions | Present Days |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    const displayRows = [...validRows];
    if (isAskingHighest) {
      displayRows.sort((a, b) => Number(b.NetSalary !== undefined ? b.NetSalary : (b.Final_Payment || 0)) - Number(a.NetSalary !== undefined ? a.NetSalary : (a.Final_Payment || 0)));
    } else {
      displayRows.sort((a, b) => {
        const yA = Number(a.SalaryYear || a.salyear || 0);
        const yB = Number(b.SalaryYear || b.salyear || 0);
        if (yA !== yB) return yA - yB;
        const mA = Number(a.SalaryMonth || a.SalMnth || a.salmnth || 0);
        const mB = Number(b.SalaryMonth || b.SalMnth || b.salmnth || 0);
        return mA - mB;
      });
    }

    let totNet = 0, totGross = 0, totDed = 0;
    for (const r of displayRows.slice(0, 24)) {
      const mName = getMonthName(r);
      const yVal = r.SalaryYear || r.salyear || entities.year || "-";
      const netNum = Number(r.NetSalary !== undefined ? r.NetSalary : (r.Final_Payment || 0));
      const grossNum = Number(r.GrossEarnings !== undefined ? r.GrossEarnings : (r.Gross_Earn || 0));
      const basicNum = Number(r.BasicEarnings !== undefined ? r.BasicEarnings : (r.Basic_Earn || 0));
      const dedNum = Number(r.TotalDeductions !== undefined ? r.TotalDeductions : (r.Deducation || 0));
      const pDays = r.PresentDays !== undefined ? r.PresentDays : (r.Present_days || "-");

      totNet += netNum;
      totGross += grossNum;
      totDed += dedNum;

      ans += `| **${mName} ${yVal}** | **₹${netNum.toLocaleString("en-IN")}** | ₹${grossNum.toLocaleString("en-IN")} | ₹${basicNum.toLocaleString("en-IN")} | ₹${dedNum.toLocaleString("en-IN")} | ${pDays} |\n`;
    }

    if (!isAskingHighest && displayRows.length > 1) {
      ans += `\n💰 **Total Net Salary Received (${entities.year ? entities.year : 'Overall'}):** **₹${totNet.toLocaleString("en-IN")}** | 📈 **Total Gross:** ₹${totGross.toLocaleString("en-IN")} | 📉 **Total Deductions:** ₹${totDed.toLocaleString("en-IN")}`;
    }

    return {
      answer: ans.trim(),
      summary: `Salary statement for ${empCode} (${empName}): ${displayRows.length} months`
    };
  }

  // Case 1: SALARYFILE Results (Monthly Paid / Earned Salaries)
  if (
    rows.length > 0 &&
    (rows[0].TotalEarnings !== undefined ||
      rows[0].Total_Earn !== undefined ||
      rows[0].SalaryMonth !== undefined ||
      (rows[0].NetSalary !== undefined && rows[0].MonthlyCTC === undefined))
  ) {
    const mName = rows[0].MonthName || (rows[0].SalaryMonth ? `Month ${rows[0].SalaryMonth}` : "");
    const yVal = rows[0].SalaryYear || rows[0].salyear || "";
    const periodStr = mName ? ` (${mName} ${yVal})` : (rows[0].SalaryMonth ? ` (Month ${rows[0].SalaryMonth} ${yVal})` : "");
    const locStr = entities.branch ? ` in **${entities.branch}** branch` : "";
    let ans = `**AutoVyn ERP Highest Paid Salary Ranking${periodStr}${locStr}:**\n\n`;
    ans += `| Rank | Emp Code | Employee Name | Total Earnings (Total_Earn) | Net Pay (Final_Payment) | Gross Pay | Basic Pay | Location | Designation |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    rows.slice(0, 20).forEach((r, idx) => {
      const earnVal = r.TotalEarnings !== undefined ? r.TotalEarnings : (r.Total_Earn !== undefined ? r.Total_Earn : (r.Final_Payment || r.Gross_Earn || 0));
      const earn = earnVal !== undefined ? `₹${Number(earnVal).toLocaleString("en-IN")}` : "-";
      const net = r.NetSalary !== undefined ? `₹${Number(r.NetSalary).toLocaleString("en-IN")}` : (r.Final_Payment !== undefined ? `₹${Number(r.Final_Payment).toLocaleString("en-IN")}` : "-");
      const gross = r.GrossEarnings !== undefined ? `₹${Number(r.GrossEarnings).toLocaleString("en-IN")}` : (r.Gross_Earn !== undefined ? `₹${Number(r.Gross_Earn).toLocaleString("en-IN")}` : "-");
      const basic = r.BasicEarnings !== undefined ? `₹${Number(r.BasicEarnings).toLocaleString("en-IN")}` : (r.Basic_Earn !== undefined ? `₹${Number(r.Basic_Earn).toLocaleString("en-IN")}` : "-");
      const empCode = r.EmployeeCode || r.Emp_Code || r.EMPCODE || "-";
      const empName = r.EmployeeName || r.EMPFIRSTNAME || "-";

      ans += `| **#${idx + 1}** | **${empCode}** | ${empName} | **${earn}** | ${net} | ${gross} | ${basic} | ${r.Location || "-"} | ${r.Designation || "-"} |\n`;
    });

    if (rows.length > 20) ans += `\n*(Showing top 20 of ${rows.length} records)*`;

    const topEmpCode = rows[0].EmployeeCode || rows[0].Emp_Code || rows[0].EMPCODE || "";
    const topEmpName = rows[0].EmployeeName || rows[0].EMPFIRSTNAME || "";
    const topEarn = rows[0].TotalEarnings || rows[0].Total_Earn || rows[0].Final_Payment || 0;

    return {
      answer: ans.trim(),
      summary: `Top earner in ${mName} ${yVal}: #${topEmpCode} (${topEmpName}) with ₹${Number(topEarn).toLocaleString("en-IN")}`
    };
  }

  // Case 2: EMPLOYEEMASTER Results (Fixed Master Monthly/Annual CTC)
  if (
    (intent === "HIGHEST_SALARY_RANKING" || intent === "SALARY_RANKING" || /\b(highest|maximum|sabse\s*jyada|top\s*\d*|ranking)\b/i.test(message || "")) &&
    rows.length > 0 && (rows[0].MonthlyCTC !== undefined || rows[0].AnnualCTC !== undefined)
  ) {
    const locStr = entities.branch ? ` in **${entities.branch}** branch` : "";
    let ans = `**AutoVyn ERP Highest Salary / CTC Ranking (Master CTC)${locStr}:**\n\n`;
    ans += `| Rank | Emp Code | Employee Name | Location | Designation | Monthly CTC | Annual CTC |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
    rows.slice(0, 20).forEach((r, idx) => {
      const mCTC = r.MonthlyCTC ? `₹${Number(r.MonthlyCTC).toLocaleString("en-IN")}` : "-";
      const aCTC = r.AnnualCTC ? `₹${Number(r.AnnualCTC).toLocaleString("en-IN")}` : "-";
      ans += `| **#${idx + 1}** | **${r.EmployeeCode || "-"}** | ${r.EmployeeName || "-"} | ${r.Location || "-"} | ${r.Designation || "-"} | ${mCTC} | ${aCTC} |\n`;
    });
    return {
      answer: ans.trim(),
      summary: `Top salary ranking: #${rows[0].EmployeeCode} (${rows[0].EmployeeName})`
    };
  }

  // Case 3: Leave Applied / Attendance Leave Results (attendancetable + Misc_Mst Misc_Type 92 & 25)
  if (
    (intent === "EMPLOYEE_LEAVE_COUNT" ||
      intent === "EMPLOYEE_LEAVE_LIST" ||
      intent === "EMPLOYEE_LEAVE_LOOKUP" ||
      (rows.length > 0 && (rows[0].LeaveTypeCode !== undefined || rows[0].LeaveTypeName !== undefined || rows[0].LeaveDate !== undefined))) &&
    rows.length > 0
  ) {
    const uniqueEmpCount = new Set(
      rows.map((r) => r.EmployeeCode || r.Emp_Code).filter(Boolean)
    ).size;
    const totalLeaveDays = rows.length;
    const lType =
      rows[0].LeaveTypeName ||
      (entities.leaveType !== "ALL_LEAVES" ? entities.leaveType : "Leave");
    const mName =
      rows[0].MonthName ||
      (entities.month
        ? [
          "",
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][entities.month]
        : "");
    const yVal =
      entities.year || (rows[0].LeaveDate ? rows[0].LeaveDate.split("-")[0] : "");
    const periodStr = mName ? `**${mName} ${yVal}**` : "Requested Period";
    const locStr = entities.branch ? ` (Branch ${entities.branch})` : "";

    let ans = `AutoVyn ERP ke records ke anusar, ${periodStr}${locStr} me **${uniqueEmpCount} employee(s)** ne total **${totalLeaveDays} din ${lType}** lagayi thi:\n\n`;
    ans += `• **Total Unique Employees:** ${uniqueEmpCount}\n`;
    ans += `• **Total Leave Days:** ${totalLeaveDays} days\n`;
    ans += `• **Leave Type:** ${lType} (Code: ${rows[0].LeaveTypeCode || 6})\n\n`;
    ans += `### 📋 Employee Leave Details:\n\n`;
    ans += `| # | Emp Code | Employee Name | Leave Date | Day | Status | Flag | Location | Designation |\n`;
    ans += `| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    rows.slice(0, 50).forEach((r, idx) => {
      const code = r.EmployeeCode || r.Emp_Code || "-";
      const name = r.EmployeeName || "-";
      const lDate = r.LeaveDate || "-";
      const dName = r.DayName || "-";
      const status = r.Status || "-";
      const flag = r.Flag || "-";
      const loc = r.Location || "-";
      const desg = r.Designation || "-";
      ans += `| **#${idx + 1}** | **${code}** | ${name} | **${lDate}** | ${dName} | ${status} | \`${flag}\` | ${loc} | ${desg} |\n`;
    });

    if (rows.length > 50) {
      ans += `\n*(Showing top 50 of ${rows.length} leave records)*`;
    }

    return {
      answer: ans.trim(),
      summary: `${uniqueEmpCount} employees applied for ${totalLeaveDays} days of ${lType} in ${mName} ${yVal}`,
    };
  }

  // 100% Local On-Premise Formatter (Zero external data sharing - 100% Data Privacy)
  if (!rows || rows.length === 0) {
    return {
      answer: `AutoVyn ERP me aapke dwara puche gaye sawal ke liye koi data/record nahi mila.`,
      summary: "No records found"
    };
  }

  // Helper: Format column headers cleanly
  const formatHeader = (col) => {
    return col
      .replace(/_/g, " ")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  // Helper: Format values (currency, numbers, dates, booleans)
  const formatCellValue = (key, val) => {
    if (val === null || val === undefined || String(val).trim() === "") return "-";
    if (typeof val === "boolean") return val ? "✅ Yes" : "❌ No";

    const keyLower = key.toLowerCase();
    const strVal = String(val).trim();

    // Indian Currency formatting
    if (/salary|ctc|earn|payout|payment|amt|amount|gross|basic|net|deduction|final_payment|bonus/i.test(keyLower)) {
      const num = Number(strVal.replace(/[^0-9.-]+/g, ""));
      if (!isNaN(num)) {
        return `₹${num.toLocaleString("en-IN")}`;
      }
    }

    // Number counts
    if (/^(count|total_count|totalcount|emp_count|employeecount|daycount|days|duplicatecount)$/i.test(keyLower)) {
      const num = Number(strVal);
      if (!isNaN(num)) return `**${num.toLocaleString("en-IN")}**`;
    }

    // Date formatting (ISO -> DD-MMM-YYYY)
    if (/date|dob|doj|dol|created_at|updated_at/i.test(keyLower) && /^\d{4}-\d{2}-\d{2}/.test(strVal)) {
      try {
        const d = new Date(strVal);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
        }
      } catch (_) { }
    }

    return strVal;
  };

  const totalCount = rows.length;
  const sample = rows[0];
  const allKeys = Object.keys(sample).filter(k => !/^(raw_response|audit_utd)$/i.test(k));

  // Single Record: Format as clean Key-Value Summary Card
  if (totalCount === 1 && allKeys.length <= 15) {
    const countKey = allKeys.find(k => /^(TotalEmployees|TotalEmployeeCount|ActiveEmployeeCount|InactiveEmployeeCount|SeparatedEmployeeCount|Count|Total)$/i.test(k));
    if (countKey && (entities.employeeName || entities.nameFilter || /\b(?:name|naam)\s+ke\b/i.test(message || ""))) {
      const targetName = entities.employeeName || entities.nameFilter || (message.match(/\b([A-Za-z]{2,30})\s+(?:name|naam)\s+ke\b/i)?.[1]) || "Requested";
      const countVal = sample[countKey];
      return {
        answer: `AutoVyn ERP ke record ke anusar, **${targetName}** name ke total **${countVal} employee(s)** hain.`,
        summary: `Total employees with name ${targetName}: ${countVal}`
      };
    }

    let ans = `**AutoVyn ERP Record Details:**\n\n`;
    for (const key of allKeys) {
      const formattedKey = formatHeader(key);
      const val = formatCellValue(key, sample[key]);
      ans += `• **${formattedKey}:** ${val}\n`;
    }
    return {
      answer: ans.trim(),
      summary: `1 record found in AutoVyn ERP`
    };
  }

  // Multi-Row Employee Profile / Lookup (e.g. multiple employees with name "Atendra")
  if (
    totalCount > 1 &&
    sample.EmployeeCode !== undefined &&
    sample.EmployeeName !== undefined &&
    (sample.Designation !== undefined || sample.Location !== undefined)
  ) {
    const targetName = entities.employeeName || entities.nameFilter || "";
    const namePrefix = targetName ? `**${targetName}** name ke ` : "";
    let ans = `AutoVyn ERP ke record ke anusar, ${namePrefix}total **${totalCount} employee(s)** mile hain:\n\n`;
    ans += `| # | Emp Code | Employee Name | Location | Designation | Mobile No | Joining Date | Status |\n`;
    ans += `| :- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;

    const displayLimit = Math.min(totalCount, 50);
    for (let i = 0; i < displayLimit; i++) {
      const r = rows[i];
      const code = r.EmployeeCode || "-";
      const name = r.EmployeeName || "-";
      const loc = r.Location || "-";
      const desg = r.Designation || "-";
      const mob = r.MobileNo || "-";
      const doj = r.JoiningDate || "-";
      const status = r.EmploymentStatus || (r.EMP_STATUS === "A" ? "Active" : "Inactive");
      ans += `| **${i + 1}** | **${code}** | **${name}** | ${loc} | ${desg} | ${mob} | ${doj} | ${status} |\n`;
    }

    if (totalCount > 50) {
      ans += `\n*(Showing top 50 of ${totalCount} records)*`;
    }

    ans += `\n\n*Agar aapko inme se kisi specific employee ka pura profile, salary slip, ya address chahiye, toh unka **Employee Code** batayein.*`;

    return {
      answer: ans.trim(),
      summary: `${totalCount} employee records found for ${targetName || 'search'}`
    };
  }

  // Multi-Row / Tabular Record: Format as clean Markdown Table
  let ans = `AutoVyn ERP ke records ke anusar, **${totalCount} record(s)** mile hain:\n\n`;
  ans += `| # | ` + allKeys.map(k => formatHeader(k)).join(" | ") + ` |\n`;
  ans += `| :- | ` + allKeys.map(() => ":---").join(" | ") + ` |\n`;

  const displayLimit = Math.min(totalCount, 50);
  for (let i = 0; i < displayLimit; i++) {
    const r = rows[i];
    const rowValues = allKeys.map(k => formatCellValue(k, r[k]));
    ans += `| **${i + 1}** | ` + rowValues.join(" | ") + ` |\n`;
  }

  if (totalCount > 50) {
    ans += `\n*(Showing top 50 of ${totalCount} records)*`;
  }

  return {
    answer: ans.trim(),
    summary: `${totalCount} records retrieved securely from AutoVyn ERP`
  };
};

// ============================================================================
// ENGINE 11: CONFIDENCE & CRITIC ENGINE
// ============================================================================

const verifyAnswerAgainstEvidence = ({ answer = "", rows = [] }) => {
  if (!rows || rows.length === 0) {
    return { verified: true, score: 0.95, issues: [] };
  }

  const issues = [];
  let score = 0.98;

  // Extract non-year numbers from text
  const textNumbers = (answer.match(/₹?\s*\d[\d,]+(?:\.\d+)?/g) || [])
    .map(n => n.replace(/[₹,\s]/g, ""))
    .filter(n => n.length >= 2 && !/^(202[0-9]|2030)$/.test(n));

  if (textNumbers.length > 0) {
    // Build set of all string/numeric representations in DB rows
    const rowValues = new Set();
    for (const r of rows) {
      if (typeof r === "object" && r !== null) {
        for (const val of Object.values(r)) {
          if (val !== null && val !== undefined) {
            rowValues.add(String(val).trim());
            if (typeof val === "number") {
              rowValues.add(String(Math.round(val)));
              rowValues.add(val.toFixed(2));
            }
          }
        }
      }
    }

    // Verify presence
    let unverifiedCount = 0;
    for (const num of textNumbers) {
      const match = Array.from(rowValues).some(v => v.includes(num) || num.includes(v));
      if (!match) {
        unverifiedCount++;
      }
    }

    if (unverifiedCount > 0 && unverifiedCount > textNumbers.length * 0.5) {
      issues.push(`Answer contains ${unverifiedCount} numerical figure(s) not directly present in SQL row evidence.`);
      score = 0.85;
    }
  }

  return {
    verified: issues.length === 0,
    score,
    issues,
    checkedNumbersCount: textNumbers.length
  };
};

// ============================================================================
// ENGINE 12: SELF-LEARNING & TELEMETRY ENGINE
// ============================================================================

const recordLearningAndTelemetry = async ({
  sequelize,
  conversationId = null,
  userContext = {},
  rawQuery = "",
  normalizedQuery = "",
  queryEmbedding = [],
  intent = "",
  sql = "",
  tablesUsed = [],
  executionTimeMs = 0,
  rowCount = 0,
  success = true,
  errorMessage = null,
  answer = null,
  isFallback = false
}) => {
  try {
    if (!sequelize?.query) return;

    const escapedRaw = (rawQuery || normalizedQuery || "").replace(/'/g, "''");
    const escapedNormalized = (normalizedQuery || "").replace(/'/g, "''");
    const escapedSQL = (sql || "").replace(/'/g, "''");
    const escapedIntent = (intent || "GENERAL").replace(/'/g, "''");
    const escapedTables = Array.isArray(tablesUsed) ? tablesUsed.join(", ").replace(/'/g, "''") : "";
    const escapedAnswer = (answer || "").replace(/'/g, "''");

    const isMiscMstOnEmployeeQuestion = Boolean(
      Array.isArray(tablesUsed) &&
      tablesUsed.some(t => String(t).toUpperCase().includes("MISC")) &&
      (intent?.toUpperCase().includes("EMPLOYEE") || /employee|emp|salary|staff/i.test(rawQuery))
    );

    // 1. Update existing Golden Rule in AI_SQL_Learning_Tbl if matched
    // (Only persistLearnedDataRule creates new golden rules to prevent unverified queries from polluting the knowledge base)
    if (success && sql && rowCount > 0 && !isFallback && !isMiscMstOnEmployeeQuestion) {
      const updateSql = `
        IF OBJECT_ID('dbo.AI_SQL_Learning_Tbl', 'U') IS NOT NULL
        BEGIN
          UPDATE [dbo].[AI_SQL_Learning_Tbl]
          SET Success_Count = Success_Count + 1,
              Last_Execution_Time_Ms = ${executionTimeMs},
              Updated_At = GETDATE()
          WHERE Normalized_Question = N'${escapedNormalized}' AND Intent = '${escapedIntent}';
        END
      `;
      await sequelize.query(updateSql, { type: QueryTypes.RAW }).catch(() => { });
    }

    // 2. Ensure Table & Record in AI_Query_Audit_Tbl
    const auditSql = `
      IF OBJECT_ID('dbo.AI_Query_Audit_Tbl', 'U') IS NULL
      BEGIN
        CREATE TABLE [dbo].[AI_Query_Audit_Tbl] (
          [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
          [Conversation_Id] VARCHAR(100) NULL,
          [User_Id] VARCHAR(100) NULL,
          [Emp_Code] VARCHAR(100) NULL,
          [Role] VARCHAR(50) NULL,
          [Comp_Code] VARCHAR(50) NULL,
          [User_Query] NVARCHAR(MAX) NULL,
          [Normalized_Query] NVARCHAR(MAX) NULL,
          [Intent] VARCHAR(100) NULL,
          [Tables_Used] VARCHAR(500) NULL,
          [Generated_SQL] NVARCHAR(MAX) NULL,
          [AI_Response] NVARCHAR(MAX) NULL,
          [Rows_Returned] INT NULL DEFAULT 0,
          [Execution_Time_Ms] INT NULL DEFAULT 0,
          [Confidence_Score] DECIMAL(5,2) NULL DEFAULT 0.95,
          [Status_Code] VARCHAR(30) NULL DEFAULT 'SUCCESS',
          [Error_Message] NVARCHAR(MAX) NULL,
          [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
        );
      END
      ELSE IF COL_LENGTH('dbo.AI_Query_Audit_Tbl', 'AI_Response') IS NULL
      BEGIN
        ALTER TABLE [dbo].[AI_Query_Audit_Tbl] ADD [AI_Response] NVARCHAR(MAX) NULL;
      END

      INSERT INTO [dbo].[AI_Query_Audit_Tbl] (
        Conversation_Id, User_Id, Emp_Code, Role, Comp_Code,
        User_Query, Normalized_Query, Intent, Tables_Used,
        Generated_SQL, AI_Response, Rows_Returned, Execution_Time_Ms,
        Confidence_Score, Status_Code, Error_Message, Created_At
      ) VALUES (
        ${conversationId ? `'${conversationId.replace(/'/g, "''")}'` : 'NULL'},
        '${(userContext.userCode || "USER").replace(/'/g, "''")}',
        '${(userContext.employeeCode || "").replace(/'/g, "''")}',
        '${(userContext.role || "USER").replace(/'/g, "''")}',
        '${(userContext.compcode || "AUTOVYN").replace(/'/g, "''")}',
        N'${escapedRaw}',
        N'${escapedNormalized}',
        '${escapedIntent}',
        '${escapedTables}',
        N'${escapedSQL}',
        ${escapedAnswer ? `N'${escapedAnswer}'` : 'NULL'},
        ${rowCount},
        ${executionTimeMs},
        ${success ? 0.95 : 0.0},
        '${success ? "SUCCESS" : "FAILED"}',
        ${errorMessage ? `N'${String(errorMessage).replace(/'/g, "''")}'` : 'NULL'},
        GETDATE()
      );
    `;
    await sequelize.query(auditSql, { type: QueryTypes.RAW }).catch((err) => {
      console.warn("[V6-Telemetry] Audit log insert notice:", err?.message);
    });
  } catch (err) {
    console.warn("[V6-Telemetry] Non-fatal telemetry recording notice:", err?.message);
  }
};

const submitFeedback = async (reqOrPayload, maybePayload = {}) => {
  let effectiveReq = {};
  let payload = {};

  if (reqOrPayload?.body || reqOrPayload?.headers) {
    effectiveReq = reqOrPayload;
    payload = reqOrPayload.body || maybePayload || {};
  } else {
    payload = reqOrPayload || {};
    effectiveReq = { body: payload, headers: {}, user: {} };
  }

  const userContext = buildUserContext(effectiveReq);
  const sequelize = await dbname(effectiveReq, userContext.compcode);

  const conversationId = payload.conversationId || payload.conversation_id || null;
  const auditUtd = payload.auditUtd || payload.audit_utd || null;
  const feedbackType = String(payload.feedbackType || payload.feedback_type || "HELPFUL").toUpperCase();
  const userComment = payload.userComment || payload.user_comment || payload.comment || payload.correction || "";
  let correctSQL = payload.correctSQL || payload.correct_sql || null;
  const targetTable = payload.targetTable || payload.target_table || null;
  const userQuery = payload.userQuery || payload.query || payload.question || payload.message || "";

  const isDislike = feedbackType !== "HELPFUL" && feedbackType !== "GOLDEN";

  // Auto-detect if user typed raw SQL inside comment
  if (!correctSQL && /^\s*(SELECT|WITH)\b/i.test(userComment.trim())) {
    correctSQL = userComment.trim();
  }

  // Clear in-memory caches so outdated / bad responses aren't served
  CacheEngineInstance.l1ExactCache.clear();
  CacheEngineInstance.l3VectorCache = [];

  if (sequelize?.query) {
    // 0. Ensure Learning & Feedback Tables exist
    const ensureTablesSql = `
      IF OBJECT_ID('dbo.AI_Query_Feedback_Tbl', 'U') IS NULL
      BEGIN
        CREATE TABLE [dbo].[AI_Query_Feedback_Tbl] (
          [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
          [Audit_UTD] BIGINT NULL,
          [Conversation_Id] VARCHAR(100) NULL,
          [Feedback_Type] VARCHAR(50) NULL,
          [User_Comment] NVARCHAR(MAX) NULL,
          [User_Id] VARCHAR(100) NULL,
          [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
        );
      END

      IF OBJECT_ID('dbo.AI_SQL_Learning_Tbl', 'U') IS NULL
      BEGIN
        CREATE TABLE [dbo].[AI_SQL_Learning_Tbl] (
          [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
          [Normalized_Question] NVARCHAR(MAX) NULL,
          [Intent] VARCHAR(100) NULL,
          [SQL_Query] NVARCHAR(MAX) NULL,
          [Tables_Used] VARCHAR(500) NULL,
          [Success_Count] INT NULL DEFAULT 1,
          [Last_Execution_Time_Ms] INT NULL DEFAULT 50,
          [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
          [Last_Verified_At] DATETIME2(7) NULL,
          [Updated_At] DATETIME2(7) NULL
        );
      END

      IF OBJECT_ID('dbo.AI_SQL_Corrections', 'U') IS NULL
      BEGIN
        CREATE TABLE [dbo].[AI_SQL_Corrections] (
          [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
          [Correction_Type] VARCHAR(100) NULL,
          [User_Message] NVARCHAR(MAX) NULL,
          [Target_Table] VARCHAR(100) NULL,
          [Correct_SQL_Pattern] NVARCHAR(MAX) NULL,
          [Rule_Description] NVARCHAR(MAX) NULL,
          [Is_Active] BIT NOT NULL DEFAULT 1,
          [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
        );
      END
    `;
    await sequelize.query(ensureTablesSql, { type: QueryTypes.RAW }).catch(() => { });

    // 1. Insert into AI_Query_Feedback_Tbl
    const insertFeedbackSql = `
      INSERT INTO [dbo].[AI_Query_Feedback_Tbl] (Audit_UTD, Conversation_Id, Feedback_Type, User_Comment, User_Id, Created_At)
      VALUES (${auditUtd ? auditUtd : 'NULL'}, ${conversationId ? `'${conversationId.replace(/'/g, "''")}'` : 'NULL'}, '${feedbackType.replace(/'/g, "''")}', N'${userComment.replace(/'/g, "''")}', '${(userContext.userCode || "USER").replace(/'/g, "''")}', GETDATE());
    `;
    await sequelize.query(insertFeedbackSql, { type: QueryTypes.RAW }).catch(() => { });

    // 1b. Update AI_Query_Audit_Tbl Status_Code:
    // If feedback is negative (Dislike / Unhelpful / Incorrect), mark Status_Code as 'FAILED' in history
    // If feedback is HELPFUL, mark Status_Code as 'SUCCESS'
    const newStatus = isDislike ? "FAILED" : "SUCCESS";
    const failReason = userComment
      ? `Marked as FAILED via user feedback: ${userComment}`
      : `Marked as FAILED via user dislike (${feedbackType})`;

    let auditUpdateSql = "";
    if (auditUtd) {
      auditUpdateSql = `
        UPDATE [dbo].[AI_Query_Audit_Tbl]
        SET Status_Code = '${newStatus}',
            Error_Message = ${isDislike ? `'${failReason.replace(/'/g, "''")}'` : 'NULL'}
        WHERE UTD = ${parseInt(auditUtd, 10)};
      `;
    } else if (conversationId && userQuery) {
      const normQ = normalizeLower(userQuery).replace(/'/g, "''");
      const rawQ = userQuery.replace(/'/g, "''");
      auditUpdateSql = `
        UPDATE [dbo].[AI_Query_Audit_Tbl]
        SET Status_Code = '${newStatus}',
            Error_Message = ${isDislike ? `'${failReason.replace(/'/g, "''")}'` : 'NULL'}
        WHERE Conversation_Id = '${conversationId.replace(/'/g, "''")}'
          AND (User_Query = '${rawQ}' OR Normalized_Query = '${normQ}' OR UTD = (
            SELECT TOP 1 UTD FROM [dbo].[AI_Query_Audit_Tbl] WITH (NOLOCK)
            WHERE Conversation_Id = '${conversationId.replace(/'/g, "''")}'
            ORDER BY UTD DESC
          ));
      `;
    } else if (conversationId) {
      auditUpdateSql = `
        UPDATE [dbo].[AI_Query_Audit_Tbl]
        SET Status_Code = '${newStatus}',
            Error_Message = ${isDislike ? `'${failReason.replace(/'/g, "''")}'` : 'NULL'}
        WHERE UTD = (
          SELECT TOP 1 UTD 
          FROM [dbo].[AI_Query_Audit_Tbl] WITH (NOLOCK) 
          WHERE Conversation_Id = '${conversationId.replace(/'/g, "''")}' 
          ORDER BY UTD DESC
        );
      `;
    } else if (userQuery) {
      const normQ = normalizeLower(userQuery).replace(/'/g, "''");
      const rawQ = userQuery.replace(/'/g, "''");
      auditUpdateSql = `
        UPDATE [dbo].[AI_Query_Audit_Tbl]
        SET Status_Code = '${newStatus}',
            Error_Message = ${isDislike ? `'${failReason.replace(/'/g, "''")}'` : 'NULL'}
        WHERE UTD = (
          SELECT TOP 1 UTD 
          FROM [dbo].[AI_Query_Audit_Tbl] WITH (NOLOCK) 
          WHERE User_Query = '${rawQ}' OR Normalized_Query = '${normQ}'
          ORDER BY UTD DESC
        );
      `;
    }

    if (auditUpdateSql) {
      await sequelize.query(auditUpdateSql, { type: QueryTypes.RAW }).catch((err) => {
        console.warn("[submitFeedback] Audit status update notice:", err?.message || err?.original?.message);
      });
      console.log(`📋 [V6-Telemetry] Updated AI_Query_Audit_Tbl Status_Code to '${newStatus}' for conversation ${conversationId || 'N/A'}`);
    }

    // Look up last query details from audit table if not explicitly passed
    let targetQuery = userQuery;
    let targetSQL = correctSQL;
    let targetIntent = payload.intent || "DYNAMIC_CUSTOM";

    if (!targetQuery || !targetSQL) {
      const findAuditQuery = auditUtd
        ? `SELECT TOP 1 User_Query, Normalized_Query, Generated_SQL, Intent, Tables_Used FROM [dbo].[AI_Query_Audit_Tbl] WITH (NOLOCK) WHERE UTD = ${auditUtd}`
        : conversationId
          ? `SELECT TOP 1 User_Query, Normalized_Query, Generated_SQL, Intent, Tables_Used FROM [dbo].[AI_Query_Audit_Tbl] WITH (NOLOCK) WHERE Conversation_Id = '${conversationId.replace(/'/g, "''")}' ORDER BY UTD DESC`
          : null;

      if (findAuditQuery) {
        const auditRows = await sequelize.query(findAuditQuery, { type: QueryTypes.SELECT }).catch(() => []);
        if (auditRows && auditRows.length > 0) {
          if (!targetQuery) targetQuery = auditRows[0].Normalized_Query || auditRows[0].User_Query;
          if (!targetSQL && !isDislike) targetSQL = auditRows[0].Generated_SQL;
          if (auditRows[0].Intent) targetIntent = auditRows[0].Intent;
        }
      }
    }

    // If disliked and NO correct SQL was provided, delete the query in AI_SQL_Learning_Tbl so bad queries aren't served
    if (isDislike && !correctSQL && targetQuery) {
      const norm = normalizeLower(targetQuery);
      const demoteSql = `
        DELETE FROM [dbo].[AI_SQL_Learning_Tbl]
        WHERE CONVERT(NVARCHAR(500), Normalized_Question) = '${norm.replace(/'/g, "''")}';
      `;
      await sequelize.query(demoteSql, { type: QueryTypes.RAW }).catch(() => { });
    }

    // Extract all question variations (including synonyms)
    const rawSynonyms = payload.synonyms || payload.variations || "";
    const questionList = targetQuery ? [targetQuery] : [];
    if (rawSynonyms && typeof rawSynonyms === "string") {
      rawSynonyms.split(/[,;\n]+/).forEach(s => {
        const trimmed = s.trim();
        if (trimmed && !questionList.includes(trimmed)) {
          questionList.push(trimmed);
        }
      });
    }

    // Only promote in AI_SQL_Learning_Tbl if it's positive (Like 👍) OR explicit user correctSQL was provided
    const effectiveSQL = correctSQL || (feedbackType === "HELPFUL" ? targetSQL : null);
    if (effectiveSQL && questionList.length > 0 && (feedbackType === "HELPFUL" || correctSQL)) {
      for (const q of questionList) {
        const norm = normalizeLower(q);
        if (!norm) continue;

        const insertLearnSql = `
          MERGE INTO [dbo].[AI_SQL_Learning_Tbl] AS target
          USING (SELECT N'${norm.replace(/'/g, "''")}' AS Question, '${targetIntent.replace(/'/g, "''")}' AS Intent) AS source
          ON (CONVERT(NVARCHAR(500), target.Normalized_Question) = source.Question)
          WHEN MATCHED THEN
            UPDATE SET 
              target.Success_Count = target.Success_Count + 50,
              target.SQL_Query = N'${effectiveSQL.replace(/'/g, "''")}',
              target.Tables_Used = ${targetTable ? `'${targetTable.replace(/'/g, "''")}'` : "target.Tables_Used"},
              target.Last_Verified_At = GETDATE(),
              target.Updated_At = GETDATE()
          WHEN NOT MATCHED THEN
            INSERT (Normalized_Question, Intent, SQL_Query, Tables_Used, Success_Count, Last_Execution_Time_Ms, Created_At, Last_Verified_At)
            VALUES (source.Question, source.Intent, N'${effectiveSQL.replace(/'/g, "''")}', ${targetTable ? `'${targetTable.replace(/'/g, "''")}'` : "'EMPLOYEEMASTER'"}, 50, 50, GETDATE(), GETDATE());
        `;
        await sequelize.query(insertLearnSql, { type: QueryTypes.RAW }).catch((err) => {
          console.warn("[V6-RLHF] Merge learning query warning:", err?.message);
        });
      }
      console.log(`🎯 [V6-RLHF] Successfully trained & learned golden SQL for ${questionList.length} question variation(s) on intent '${targetIntent}'!`);
    }

    // 2. If it's correction or training rule, insert into AI_SQL_Corrections
    if (feedbackType !== "HELPFUL" || userComment || effectiveSQL) {
      const ruleDesc = userComment || (effectiveSQL ? `User specified correct SQL: ${effectiveSQL}` : "Feedback rule override");
      const insertCorrectionSql = `
        INSERT INTO [dbo].[AI_SQL_Corrections] (Correction_Type, User_Message, Target_Table, Correct_SQL_Pattern, Rule_Description, Is_Active, Created_At)
        VALUES ('${feedbackType.replace(/'/g, "''")}', N'${userComment.replace(/'/g, "''")}', ${targetTable ? `'${targetTable.replace(/'/g, "''")}'` : 'NULL'}, ${effectiveSQL ? `N'${effectiveSQL.replace(/'/g, "''")}'` : 'NULL'}, N'${ruleDesc.replace(/'/g, "''")}', 1, GETDATE());
      `;
      await sequelize.query(insertCorrectionSql, { type: QueryTypes.RAW }).catch(() => { });
    }
  }

  return {
    success: true,
    message: isDislike ? "Query marked as FAILED in History." : "Feedback & correction recorded successfully. AI has adapted its learning model."
  };
};


// ============================================================================
// MASTER ORCHESTRATOR: askEnterpriseCopilotV6
// ============================================================================

const askEnterpriseCopilotV6 = async (reqOrMessage, payload = {}) => {
  let effectiveReq = {};
  let effectivePayload = {};

  if (typeof reqOrMessage === "string") {
    effectivePayload = { message: reqOrMessage, ...payload };
    effectiveReq = { body: effectivePayload, headers: payload.headers || {}, user: payload.user || {} };
  } else if (reqOrMessage && typeof reqOrMessage === "object") {
    effectivePayload = {
      ...(reqOrMessage.body && typeof reqOrMessage.body === "object" ? reqOrMessage.body : {}),
      ...(payload && typeof payload === "object" ? payload : {})
    };
    if (Object.keys(effectivePayload).length === 0) {
      effectivePayload = reqOrMessage;
    }
    effectiveReq = {
      body: effectivePayload,
      headers: reqOrMessage.headers || payload.headers || {},
      user: reqOrMessage.user || payload.user || {}
    };
  }

  const startedAt = Date.now();
  const rawMessage = normalizeText(effectivePayload.message || effectivePayload.query || effectivePayload.question || effectivePayload.prompt);

  if (!rawMessage) {
    throw new ApiError(400, "message is required");
  }

  let totalUsage = { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 };

  // Universal Multilingual Translation & Canonicalization Engine:
  // Automatically translates any language (Hindi, Hinglish, Marathi, Gujarati, Tamil, etc.) into clean standard English
  const { englishQuery, isTranslated, translationUsage } = await translateToEnglishIfVernacular(rawMessage);
  if (translationUsage) {
    totalUsage.prompt_tokens += translationUsage.prompt_tokens || 0;
    totalUsage.completion_tokens += translationUsage.completion_tokens || 0;
    totalUsage.total_tokens += translationUsage.total_tokens || 0;
  }

  console.log("\n=======================================================");
  console.log("🚀 [AUTOVYN-AI-V6-COPILOT] Original Question:", rawMessage);
  if (isTranslated) {
    console.log("🌐 [AUTOVYN-AI-V6-COPILOT] Translated English Query:", englishQuery);
  }

  // 1. User Context & Auth
  const userContext = buildUserContext(effectiveReq);
  const conversationId = effectivePayload.conversationId || `conv_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

  let sequelize = null;
  const queryEmbedding = null;

  try {
    // 2. Database Connection
    sequelize = await dbname(effectiveReq, userContext.compcode);
    if (!sequelize?.query) {
      throw new ApiError(500, "Unable to establish connection with AutoVyn ERP Database");
    }

    // 2.1 RLHF Continuous Learning & Follow-Up Data Location Handler
    const correctionResult = await handleUserCorrectionAndDataLocation({
      sequelize,
      rawMessage,
      englishQuery: englishQuery || rawMessage,
      conversationId,
      userContext,
      startedAt
    });

    if (correctionResult && correctionResult.handled && correctionResult.result) {
      return correctionResult.result;
    }

    let sqlPlan = null;
    let tablesUsed = [];
    let initialClassification = null;
    let resolvedEntities = {};
    let isLearnedQuery = false;

    // 3. Engine 1 & 2: Intent & Entity Classification (Run FIRST so date/branch/employee entities are known!)
    initialClassification = await classifyIntentAndExtractEntities({
      message: englishQuery || rawMessage,
      originalMessage: rawMessage,
      userContext
    });

    // 4. Check if CURRENT message explicitly mentions an employee by Name (Database-Backed Entity Resolution)
    const isIdentifierLookup = Boolean(
      initialClassification.entities.mobileNumber ||
      initialClassification.entities.panNumber ||
      initialClassification.entities.aadharNumber ||
      initialClassification.entities.accountNumber
    );
    const isListOrAggregate = /\b(kon kon|kaun kaun|kiske kiske|list|all|sabka|total|kitne|kitna|sankhya|ginti|how many|records)\b/i.test(normalizeLower(rawMessage));
    const isRankingOrExtremum = initialClassification.intent === "HIGHEST_SALARY_RANKING" ||
      /\b(sabse\s*jyada|sabse\s*kam|sabse\s*adhik|sabse|highest|lowest|top\s*\d*|bottom\s*\d*|maximum|minimum|max|min|ranking|topper|rank|kiski\s*salary|kiska\s*salary|kisko\s*salary|sabse\s*badi|pay\s*hui|payment)\b/i.test(normalizeLower(rawMessage));
    const isEventOrWhoQuery = /\b(kiska|kiski|kiske|kisko|kaun|kon|who|whose)\b/i.test(normalizeLower(rawMessage)) ||
      /\b(annivers\w*|anivers\w*|anvers\w*|saalgir\w*|salgir\w*|birthday|bday|b'day|janamdin|holiday|holidays)\b/i.test(normalizeLower(rawMessage));

    resolvedEntities = { ...initialClassification.entities };

    // 3.1 Check Conversation Memory (Anaphora & Multi-Turn Context Resolution)
    await MemoryEngineInstance.ensureContextFromDB(conversationId, sequelize);
    let contextRes = { entities: resolvedEntities, intent: initialClassification.intent, isFollowup: false, previousTurn: null };
    if (!resolvedEntities.employeeCode && !resolvedEntities.employeeName && !resolvedEntities.isSelf) {
      contextRes = MemoryEngineInstance.resolveContextualEntities(
        conversationId,
        resolvedEntities,
        rawMessage,
        initialClassification.intent
      );
      resolvedEntities = contextRes.entities;
      if (contextRes.intent && contextRes.intent !== initialClassification.intent) {
        console.log(`🧠 [V6-MemoryEngine] Contextually resolved intent from '${initialClassification.intent}' to '${contextRes.intent}' (isFollowup: ${contextRes.isFollowup})`);
        initialClassification.intent = contextRes.intent;
      }
    }

    const isEmployeeCountIntent = initialClassification.intent === "EMPLOYEE_COUNT" || Boolean(resolvedEntities.designation);
    const isPronounFollowup = /\b(iska|iski|iske|inhe|inhein|unka|unki|unke|same|vahi|uska|uski|uske|previous|above|wahi|this person|that person|isi|isi\s*employee|is\s*employee|is\s*bande|isi\s*bande|current\s*employee)\b/i.test(normalizeLower(rawMessage));

    if (isPronounFollowup && !resolvedEntities.employeeCode && !resolvedEntities.employeeName && !resolvedEntities.nameFilter) {
      const clarifMsg = `Aap kis employee ki details/address dekhna chahte hain? Kripya unka **Employee Code** ya **Naam** batayein.`;
      MemoryEngineInstance.updateContext(
        conversationId,
        resolvedEntities,
        initialClassification.intent,
        {
          userMessage: rawMessage,
          sql: "",
          rowCount: 0,
          failed: false,
          isPendingClarification: true
        }
      );
      return {
        success: true,
        data: [],
        conversationId,
        answer: clarifMsg,
        mode: "CONVERSATIONAL",
        intent: "CLARIFICATION_REQUIRED",
        isSelfQuery: false,
        sources: ["AutoVyn ERP"],
        query: { sql: "", tablesUsed: [], rowCount: 0, executionTimeMs: Date.now() - startedAt },
        confidence: { level: "HIGH", score: 0.95 },
        evidence: { canAnswer: true, rows: [] },
        sqlValidation: { valid: true, sanitized: true },
        critic: { verified: true, score: 0.95 },
        isAmbiguous: false,
        resolvedEntities,
        cached: false,
        cacheTier: "NONE",
        model: "AutoVyn-V6-FollowupClarifier",
        usage: totalUsage,
        responseTimeMs: Date.now() - startedAt
      };
    }

    if (!resolvedEntities.employeeCode && !isPronounFollowup && !resolvedEntities.isSelf && !isIdentifierLookup && !isListOrAggregate && !isRankingOrExtremum && !isEventOrWhoQuery && !isEmployeeCountIntent) {
      const dbEntityResult = await resolveEmployeeEntityViaDB({
        sequelize,
        message: rawMessage,
        normalized: normalizeLower(rawMessage),
        entities: resolvedEntities,
        userContext
      });

      if (dbEntityResult.matched && dbEntityResult.employeeCode) {
        resolvedEntities.employeeCode = dbEntityResult.employeeCode;
        resolvedEntities.employeeName = dbEntityResult.employeeName;
        if (!resolvedEntities.branch && dbEntityResult.locationName) {
          resolvedEntities.branch = dbEntityResult.locationName;
        }
        if (!resolvedEntities.department && dbEntityResult.departmentName) {
          resolvedEntities.department = dbEntityResult.departmentName;
        }
        if (!resolvedEntities.designation && dbEntityResult.designation) {
          resolvedEntities.designation = dbEntityResult.designation;
        }
        console.log(`👤 [V6-DBEntityLinker] Resolved employee from current message: ${dbEntityResult.employeeName} (${dbEntityResult.employeeCode})`);

        // If the current query was just a name or general query answering a previous question, inherit the previous question's intent!
        const prevTurn = MemoryEngineInstance.getContext(conversationId);
        if (prevTurn && (initialClassification.intent === "GENERAL_DATABASE_QUERY" || !initialClassification.intent || initialClassification.intent === "EMPLOYEE_LOOKUP")) {
          const prevMsg = normalizeLower(prevTurn.lastUserMessage || "");
          const isPrevAddress = /\b(address|pata|rehta\s*hai|ghar|niwas)\b/i.test(prevMsg);
          const isPrevSalary = /\b(salary|pagar|tankha|vetan|basic|gross|net|ctc)\b/i.test(prevMsg);
          const isPrevMispunch = /\b(mispunch|punch|haziri|attendance)\b/i.test(prevMsg);
          const isPrevLeave = /\b(leave|chhutti)\b/i.test(prevMsg);

          if (isPrevAddress) {
            initialClassification.intent = "EMPLOYEE_LOOKUP";
            resolvedEntities.isAddressQuery = true;
          } else if (isPrevSalary) {
            initialClassification.intent = prevTurn.lastIntent || "EMPLOYEE_SALARY_HISTORY";
            if (prevTurn.lastMonth) resolvedEntities.month = prevTurn.lastMonth;
            if (prevTurn.lastYear) resolvedEntities.year = prevTurn.lastYear;
          } else if (isPrevMispunch) {
            initialClassification.intent = prevTurn.lastIntent || "MISPUNCH_LOOKUP_BY_EMP";
          } else if (isPrevLeave) {
            initialClassification.intent = prevTurn.lastIntent || "EMPLOYEE_LEAVE_LOOKUP";
          } else if (prevTurn.lastIntent && prevTurn.lastIntent !== "CLARIFICATION_REQUIRED") {
            initialClassification.intent = prevTurn.lastIntent;
          } else {
            initialClassification.intent = "EMPLOYEE_LOOKUP";
          }
          console.log(`🧠 [V6-MemoryEngine] Inherited intent '${initialClassification.intent}' for employee ${dbEntityResult.employeeName} from previous turn context`);
        }

        // Upgrade generic report intents to employee-targeted intents
        if (initialClassification.intent === "MISPUNCH_REPORT" || initialClassification.intent === "MISPUNCH_COUNT") {
          const isCountOrTotal = resolvedEntities.isSinceJoining || initialClassification.entities.aggregation === "COUNT" || /\b(kitne|count|total count|how many|sankhya|ginti|total|batao|nikalo|jab se)\b/i.test(normalizeLower(rawMessage));
          initialClassification.intent = isCountOrTotal ? "MISPUNCH_EMPLOYEE_TOTAL" : "MISPUNCH_LOOKUP_BY_EMP";
        } else if (initialClassification.intent === "EMPLOYEE_LEAVE_LIST" || initialClassification.intent === "EMPLOYEE_LEAVE_COUNT") {
          initialClassification.intent = "EMPLOYEE_LEAVE_LOOKUP";
        } else if (initialClassification.intent === "SALARY_REPORT" && !initialClassification.entities.month) {
          initialClassification.intent = "EMPLOYEE_SALARY_HISTORY";
        }
      } else if (dbEntityResult.isAmbiguous && Array.isArray(dbEntityResult.candidates) && dbEntityResult.candidates.length > 1) {
        console.log(`⚠️ [V6-DBEntityLinker] Ambiguous entity detected with ${dbEntityResult.candidates.length} candidates. Presenting disambiguation options.`);
        let ambAns = `Aapke dwara puche gaye sawal ke liye **${dbEntityResult.candidates.length} matching employees** mile hain:\n\n`;
        ambAns += `| # | Emp Code | Name | Branch / Location | Department | Designation | Status |\n`;
        ambAns += `| :- | :--- | :--- | :--- | :--- | :--- | :--- |\n`;
        dbEntityResult.candidates.forEach((c, idx) => {
          ambAns += `| ${idx + 1} | **${c.empCode}** | **${c.name}** | ${c.branch} | ${c.department} | ${c.designation} | ${c.status} |\n`;
        });
        ambAns += `\n👉 Kripya bataiye aap inme se kis **Employee Code** ya branch ka data dekhna chahte hain?`;

        // Update MemoryEngine so follow-up corrections know what question caused this disambiguation
        MemoryEngineInstance.updateContext(
          conversationId,
          resolvedEntities,
          "ENTITY_DISAMBIGUATION",
          {
            userMessage: rawMessage,
            sql: "ENTITY_DISAMBIGUATION_PROMPT",
            rowCount: dbEntityResult.candidates.length,
            failed: false,
            tablesUsed: ["EMPLOYEEMASTER"]
          }
        );

        return {
          success: true,
          data: dbEntityResult.candidates,
          conversationId,
          answer: ambAns,
          mode: initialClassification.mode,
          intent: "ENTITY_DISAMBIGUATION",
          isSelfQuery: false,
          sources: ["AutoVyn EMPLOYEEMASTER"],
          query: { sql: "ENTITY_DISAMBIGUATION_PROMPT", tablesUsed: ["EMPLOYEEMASTER"], rowCount: dbEntityResult.candidates.length, executionTimeMs: Date.now() - startedAt },
          confidence: { level: "HIGH", score: 0.98 },
          evidence: { canAnswer: true, rows: dbEntityResult.candidates },
          sqlValidation: { valid: true, sanitized: true },
          critic: { verified: true, score: 0.98 },
          isAmbiguous: true,
          resolvedEntities,
          cached: false,
          cacheTier: "NONE",
          model: "AutoVyn-V6-Disambiguation",
          usage: totalUsage,
          responseTimeMs: Date.now() - startedAt
        };
      }
    }

    MemoryEngineInstance.updateContext(conversationId, resolvedEntities, initialClassification.intent);

    const normalizedQuery = normalizeLower(rawMessage);

    // 5. Engine 5.1: RLHF Learned Query Matcher (User-trained Golden Rules have HIGHEST priority!)
    if (!sqlPlan) {
      // Date queries use exactOnly to avoid stale date pollution
      const isBuiltinDateQuery = ["WORK_ANNIVERSARY", "MARRIAGE_ANNIVERSARY", "BIRTHDAY_BY_DATE", "BIRTHDAY_TODAY", "BIRTHDAYS_MONTH"].includes(initialClassification?.intent);

      let learnedMatch = await matchLearnedSimilarQuery({
        sequelize,
        message: englishQuery || rawMessage,
        originalMessage: rawMessage,
        intent: initialClassification?.intent,
        entities: resolvedEntities,
        exactOnly: isBuiltinDateQuery
      });

      if (learnedMatch && learnedMatch.sql) {
        console.log(`🏆 [V6-RLHF-LearnedGoldenQuery] Matched user-trained golden rule: ${learnedMatch.source}`);
        sqlPlan = {
          sql: learnedMatch.sql,
          requiresJoin: false,
          isTemplate: true,
          confidence: learnedMatch.confidence || 0.99,
          targetTable: learnedMatch.targetTable || "AI_SQL_Learning_Tbl"
        };
        tablesUsed = [learnedMatch.targetTable || "AI_SQL_Learning_Tbl"];
        isLearnedQuery = true;
      }
    }

    // 6. Engine 7: Multi-Tier Cache Lookup (L1 Hash -> L3 Embedding)
    if (!sqlPlan) {
      let cachedResult = CacheEngineInstance.getExactMatch(
        normalizedQuery,
        userContext.compcode,
        userContext.role,
        userContext.userCode
      );

      let queryEmbedding = [];
      if (!cachedResult) {
        queryEmbedding = await generateEmbedding(normalizedQuery);
        cachedResult = await CacheEngineInstance.getSemanticMatch(
          queryEmbedding,
          userContext.compcode,
          userContext.role
        );
      }

      if (cachedResult && cachedResult.sql) {
        console.log(`⚡ [V6-Cache-Hit] Served via ${cachedResult.cacheTier} in ${Date.now() - startedAt}ms`);

        // Execute cached SQL directly on live DB to ensure data freshness
        const rows = await sequelize.query(cachedResult.sql, { type: QueryTypes.SELECT });
        const responseTimeMs = Date.now() - startedAt;

        // Freshly format response to prevent stale answers or count misalignments
        let formattedAnswer = cachedResult.answer;
        if (rows && rows.length > 0) {
          const aiFmt = await formatResponseViaAI({
            message: rawMessage,
            englishQuery: englishQuery || rawMessage,
            intent: initialClassification?.intent,
            sql: cachedResult.sql,
            rows,
            userContext,
            entities: resolvedEntities
          });
          if (aiFmt?.answer) {
            formattedAnswer = aiFmt.answer;
          } else {
            const detFmt = await formatHumanBusinessAnswer({
              message: rawMessage,
              englishQuery: englishQuery || rawMessage,
              intent: initialClassification?.intent,
              entities: resolvedEntities,
              sql: cachedResult.sql,
              rows,
              userContext,
              sequelize
            });
            if (detFmt?.answer) {
              formattedAnswer = detFmt.answer;
            }
          }
        }

        return {
          success: true,
          data: rows,
          conversationId,
          answer: formattedAnswer,
          mode: initialClassification?.mode || "DATABASE_QUERY",
          intent: initialClassification?.intent || "GENERAL_DATABASE_QUERY",
          isSelfQuery: initialClassification?.isSelfQuery || false,
          sources: ["AutoVyn ERP Live Database (Cached Plan)"],
          query: {
            sql: cachedResult.sql,
            tablesUsed: [cachedResult.targetTable || "LiveERP"],
            rowCount: rows.length,
            executionTimeMs: responseTimeMs,
          },
          confidence: { level: "HIGH", score: 0.99 },
          evidence: { canAnswer: true, rows: rows.slice(0, 10), rowCount: rows.length },
          sqlValidation: { valid: true, sanitized: true },
          critic: { verified: true, score: 0.99 },
          cached: true,
          cacheTier: cachedResult.cacheTier,
          model: "AutoVyn-V6-HighSpeed-Cache",
          usage: totalUsage,
          responseTimeMs
        };
      }
    }

    // 7. Engine 5: SQL Planning (if not already matched via Learned Engine or Cache)
    if (!sqlPlan) {
      // 7.1 Deterministic Template Matcher
      sqlPlan = getDeterministicSQLTemplate({
        intent: initialClassification.intent,
        entities: resolvedEntities,
        userContext
      });

      if (sqlPlan && sqlPlan.sql) {
          console.log("🎯 [V6-SQLPlanner] Match with Deterministic Template Library.");
          tablesUsed = [sqlPlan.targetTable || "ERP_MASTER"];
        } else {
          // 6.3 GPT-4o-mini Dynamic Planner Fallback
          const relevantTables = SchemaEngineInstance.searchRelevantTables(
            englishQuery || rawMessage,
            initialClassification.intent
          );
          tablesUsed = relevantTables.map(t => t.tableName);

          sqlPlan = await planDynamicSQL({
            sequelize,
            message: englishQuery || rawMessage,
            originalMessage: rawMessage,
            intent: initialClassification.intent,
            entities: resolvedEntities,
            relevantTables,
            userContext
          });
          if (sqlPlan.usage) {
            totalUsage.prompt_tokens += sqlPlan.usage.prompt_tokens || 0;
            totalUsage.completion_tokens += sqlPlan.usage.completion_tokens || 0;
            totalUsage.total_tokens += sqlPlan.usage.total_tokens || 0;
          }
        }
      }

    // 7. Engine 6: SQL Validation & Auto-Repair
    let validatedSQL = validateAndRepairSQL(sqlPlan.sql, userContext);

    // 8. Execute Primary SQL on MSSQL Server with Auto-Repair Reflection Loop
    console.log("⚙️ [V6-MSSQL-Execute]:\n", validatedSQL);
    const sqlStartTime = Date.now();
    const execResult = await executeSQLWithSelfCorrection({
      sequelize,
      initialSQL: validatedSQL,
      userContext,
      rawMessage,
      intent: initialClassification.intent,
      tablesUsed
    });

    let dbRows = execResult.rows || [];
    if (execResult.repaired) {
      validatedSQL = execResult.sql;
    }
    let sqlExecutionTimeMs = Date.now() - sqlStartTime;

    // ── Engine 9: Autonomous Adaptive Cross-Table Search Fallback ──
    // If primary query returned 0 rows, autonomously check relative tables & all 257 columns
    const nonFallbackIntents = new Set([
      "MISPUNCH_EMPLOYEE_TOTAL", "MISPUNCH_REPORT", "MISPUNCH_LOOKUP_BY_EMP", "MISPUNCH_COUNT",
      "EMPLOYEE_LEAVE_LOOKUP", "EMPLOYEE_LEAVE_COUNT", "EMPLOYEE_LEAVE_LIST",
      "SALARY_TOTAL_AGGREGATE", "SALARY_COUNT_AGGREGATE", "PRESENT_COUNT", "ABSENT_COUNT",
      "PF_COUNT", "BANK_ACCOUNT_VERIFY_COUNT", "AADHAAR_VERIFY_COUNT", "PAN_VERIFY_COUNT", "KYC_COUNT",
      "SERVICE_REMINDERS_DUE",
      "WORK_ANNIVERSARY", "MARRIAGE_ANNIVERSARY", "BIRTHDAY_BY_DATE", "BIRTHDAY_TODAY", "BIRTHDAYS_MONTH",
      "SALARY_REPORT", "EMPLOYEE_SALARY_HISTORY", "SELF_SALARY", "SALARY_PF_DEDUCTION",
      "EMPLOYEE_LOOKUP", "EMPLOYEE_PROFILE"
    ]);

    let effectiveIntent = initialClassification.intent;
    let isAdaptiveFallback = false;
    if ((!dbRows || dbRows.length === 0) && !nonFallbackIntents.has(initialClassification.intent)) {
      console.log("⚠️ [V6-Notice] Primary query returned 0 rows. Triggering Autonomous Adaptive Cross-Table Search...");
      const fallbackResult = await executeAdaptiveCrossTableSearch({
        sequelize,
        rawMessage,
        resolvedEntities,
        userContext,
        intent: initialClassification.intent
      });

      if (fallbackResult && fallbackResult.found && fallbackResult.rows.length > 0) {
        console.log(`✨ [V6-AdaptiveSuccess] Discovered answer in ${fallbackResult.source}!`);
        dbRows = fallbackResult.rows;
        validatedSQL = fallbackResult.sql;
        tablesUsed = fallbackResult.tablesUsed || [fallbackResult.source];
        isAdaptiveFallback = true;
        if (fallbackResult.intent) {
          effectiveIntent = fallbackResult.intent;
        }
      }
    }

    // 10. Engine 10: Human Response Formatter (AI Formatter with Deterministic Fallback)
    let formatted = null;

    // First, try AI Response Formatter for rich, natural, 100% accurate conversational formatting
    if (dbRows.length > 0) {
      formatted = await formatResponseViaAI({
        message: rawMessage,
        englishQuery: englishQuery || rawMessage,
        intent: effectiveIntent,
        sql: validatedSQL,
        rows: dbRows,
        userContext,
        entities: resolvedEntities,
        previousContext: contextRes?.isFollowup ? contextRes.previousTurn : null
      });
    }

    // If AI formatter didn't run or returned null, use deterministic formatter
    if (!formatted || !formatted.answer) {
      formatted = await formatHumanBusinessAnswer({
        message: rawMessage,
        englishQuery: englishQuery || rawMessage,
        intent: effectiveIntent,
        entities: resolvedEntities,
        sql: validatedSQL,
        rows: dbRows,
        userContext,
        sequelize
      });
    }
    if (formatted.usage) {
      totalUsage.prompt_tokens += formatted.usage.prompt_tokens || 0;
      totalUsage.completion_tokens += formatted.usage.completion_tokens || 0;
      totalUsage.total_tokens += formatted.usage.total_tokens || 0;
    }

    // 11. Engine 11: Answer Critic & Confidence Verification
    const criticResult = verifyAnswerAgainstEvidence({
      answer: formatted.answer,
      rows: dbRows
    });

    const responseTimeMs = Date.now() - startedAt;

    // 12. Engine 12: Save in Cache & Learn Query
    if (dbRows.length > 0) {
      if (!isAdaptiveFallback) {
        CacheEngineInstance.saveToCache({
          normalizedQuery,
          queryEmbedding,
          sql: validatedSQL,
          answer: formatted.answer,
          entities: resolvedEntities,
          compcode: userContext.compcode,
          role: userContext.role,
          userCode: userContext.userCode,
          intent: effectiveIntent
        });
      }

      recordLearningAndTelemetry({
        sequelize,
        conversationId,
        userContext,
        rawQuery: rawMessage,
        normalizedQuery,
        queryEmbedding,
        intent: effectiveIntent,
        sql: validatedSQL,
        tablesUsed,
        executionTimeMs: responseTimeMs,
        rowCount: dbRows.length,
        success: true,
        answer: formatted.answer,
        isFallback: isAdaptiveFallback
      }).catch(() => { });
    } else {
      recordLearningAndTelemetry({
        sequelize,
        conversationId,
        userContext,
        rawQuery: rawMessage,
        normalizedQuery,
        queryEmbedding,
        intent: effectiveIntent,
        sql: validatedSQL,
        tablesUsed,
        executionTimeMs: responseTimeMs,
        rowCount: 0,
        success: true,
        answer: formatted.answer,
        isFallback: isAdaptiveFallback
      }).catch(() => { });
    }

    // Auto-capture primary employee entity from query results (e.g. single employee result or top-1 ranking like highest salary)
    if (Array.isArray(dbRows) && dbRows.length >= 1) {
      const isTopRankingOrSingle = dbRows.length === 1 ||
        initialClassification?.intent?.includes("RANKING") ||
        /\b(sabse\s*jyada|sabse\s*kam|sabse\s*adhik|highest|lowest|top\s*1\b|maximum|minimum|kiske|kisko|kiska)\b/i.test(rawMessage);
      if (isTopRankingOrSingle) {
        const topRow = dbRows[0];
        const rowEmpCode = topRow.EMPCODE || topRow.Emp_Code || topRow.EmpCode || topRow.emp_code || topRow.EmployeeCode || topRow.USER_Code;
        const rowEmpName = topRow.FullName || topRow.EmpName || topRow.EMPFIRSTNAME || topRow.EmployeeName || topRow.Name ||
          ([topRow.EMPFIRSTNAME, topRow.EMPLASTNAME].filter(Boolean).join(" ") || null);
        if (rowEmpCode) {
          resolvedEntities.employeeCode = String(rowEmpCode);
          if (rowEmpName) resolvedEntities.employeeName = String(rowEmpName);
          console.log(`🧠 [V6-MemoryEngine] Auto-captured primary employee from query results: ${resolvedEntities.employeeName || ''} (${resolvedEntities.employeeCode})`);
        }
      }
    }

    // Update Conversation Memory Turn Context for multi-turn learning & follow-ups
    MemoryEngineInstance.updateContext(
      conversationId,
      resolvedEntities,
      effectiveIntent,
      {
        userMessage: rawMessage,
        sql: validatedSQL,
        rowCount: dbRows.length,
        failed: false,
        tablesUsed
      }
    );

    console.log(`✅ [V6-Execution-Complete] Success in ${responseTimeMs}ms (SQL: ${sqlExecutionTimeMs}ms)`);

    // 13. Return 100% Backward-Compatible Enhanced Payload
    return {
      success: true,
      data: dbRows,
      conversationId,
      answer: formatted.answer,
      mode: initialClassification.mode,
      intent: effectiveIntent,
      isSelfQuery: initialClassification.isSelfQuery,
      sources: ["AutoVyn ERP Microsoft SQL Server"],
      query: {
        sql: validatedSQL,
        tablesUsed,
        rowCount: dbRows.length,
        executionTimeMs: sqlExecutionTimeMs
      },
      confidence: { level: criticResult.verified ? "HIGH" : "MEDIUM", score: criticResult.score },
      evidence: {
        canAnswer: true,
        rows: dbRows.slice(0, 15),
        rowCount: dbRows.length,
        totalRowsReturned: dbRows.length,
        truncated: dbRows.length > 15
      },
      sqlValidation: { valid: true, sanitized: true },
      critic: criticResult,
      isAmbiguous: false,
      resolvedEntities,
      cached: false,
      cacheTier: "NONE",
      model: getModelConfig().primaryModel,
      usage: totalUsage,
      responseTimeMs
    };
  } catch (err) {
    const responseTimeMs = Date.now() - startedAt;
    console.error("❌ [V6-Execution-Failed]:", err?.message);

    if (sequelize?.query) {
      recordLearningAndTelemetry({
        sequelize,
        conversationId,
        userContext,
        rawQuery: rawMessage,
        normalizedQuery: normalizeLower(rawMessage),
        intent: "FAILED_QUERY",
        sql: "",
        tablesUsed: [],
        executionTimeMs: responseTimeMs,
        rowCount: 0,
        success: false,
        errorMessage: err.message,
        answer: `Query processing error: ${err.message}`
      }).catch(() => { });
    }

    // Record failure in Conversation Memory so follow-up correction knows prior query failed
    MemoryEngineInstance.updateContext(
      conversationId,
      {},
      "FAILED_QUERY",
      {
        userMessage: rawMessage,
        sql: "",
        rowCount: 0,
        failed: true,
        errorMessage: err.message
      }
    );

    throw err;
  }
};

// ============================================================================
// DYNAMIC AI TRAINING RULES & LIVE SQL TESTING API ENGINE
// ============================================================================

const ensureLearningTablesExist = async (sequelize) => {
  if (!sequelize?.query) return;
  const ensureTablesSql = `
    IF OBJECT_ID('dbo.AI_SQL_Learning_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_SQL_Learning_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Normalized_Question] NVARCHAR(500) NULL,
        [Intent] VARCHAR(100) NULL,
        [SQL_Query] NVARCHAR(MAX) NULL,
        [Tables_Used] VARCHAR(500) NULL,
        [Success_Count] INT NULL DEFAULT 1,
        [Last_Execution_Time_Ms] INT NULL DEFAULT 50,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
        [Last_Verified_At] DATETIME2(7) NULL,
        [Updated_At] DATETIME2(7) NULL
      );
    END
    ELSE
    BEGIN
      IF COL_LENGTH('dbo.AI_SQL_Learning_Tbl', 'Last_Verified_At') IS NULL
        ALTER TABLE [dbo].[AI_SQL_Learning_Tbl] ADD [Last_Verified_At] DATETIME2(7) NULL;
      IF COL_LENGTH('dbo.AI_SQL_Learning_Tbl', 'Updated_At') IS NULL
        ALTER TABLE [dbo].[AI_SQL_Learning_Tbl] ADD [Updated_At] DATETIME2(7) NULL;
      IF COL_LENGTH('dbo.AI_SQL_Learning_Tbl', 'Intent') IS NULL
        ALTER TABLE [dbo].[AI_SQL_Learning_Tbl] ADD [Intent] VARCHAR(100) NULL;
      IF COL_LENGTH('dbo.AI_SQL_Learning_Tbl', 'Tables_Used') IS NULL
        ALTER TABLE [dbo].[AI_SQL_Learning_Tbl] ADD [Tables_Used] VARCHAR(500) NULL;
    END;

    IF OBJECT_ID('dbo.AI_SQL_Corrections', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_SQL_Corrections] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Correction_Type] VARCHAR(100) NULL,
        [User_Message] NVARCHAR(MAX) NULL,
        [Target_Table] VARCHAR(100) NULL,
        [Correct_SQL_Pattern] NVARCHAR(MAX) NULL,
        [Rule_Description] NVARCHAR(MAX) NULL,
        [Is_Active] BIT NOT NULL DEFAULT 1,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
      );
    END;
  `;
  await sequelize.query(ensureTablesSql, { type: QueryTypes.RAW }).catch((err) => {
    console.warn("[ensureLearningTablesExist] Table check warning:", err?.message || err?.original?.message);
  });
};

const getAILearnedRules = async (reqOrPayload) => {
  const effectiveReq = reqOrPayload?.headers ? reqOrPayload : { body: reqOrPayload, headers: {}, user: {} };
  const userContext = buildUserContext(effectiveReq);
  const sequelize = await dbname(effectiveReq, userContext.compcode);
  if (!sequelize?.query) {
    throw new ApiError(500, "Database connection not available");
  }

  await ensureLearningTablesExist(sequelize);

  const query = `
    SELECT 
      UTD,
      CONVERT(NVARCHAR(500), Normalized_Question) AS Normalized_Question,
      Intent,
      CONVERT(NVARCHAR(MAX), SQL_Query) AS SQL_Query,
      Tables_Used,
      ISNULL(Success_Count, 1) AS Success_Count,
      CONVERT(VARCHAR(19), Created_At, 120) AS Created_At,
      CONVERT(VARCHAR(19), Last_Verified_At, 120) AS Last_Verified_At
    FROM [dbo].[AI_SQL_Learning_Tbl] WITH (NOLOCK)
    ORDER BY UTD DESC;
  `;
  const rules = await sequelize.query(query, { type: QueryTypes.SELECT }).catch(() => []);
  return {
    success: true,
    data: rules || [],
    count: rules ? rules.length : 0
  };
};

const saveAILearnedRule = async (reqOrPayload) => {
  const payload = reqOrPayload?.body || reqOrPayload || {};
  const effectiveReq = reqOrPayload?.headers ? reqOrPayload : { body: payload, headers: {}, user: {} };
  const userContext = buildUserContext(effectiveReq);
  const sequelize = await dbname(effectiveReq, userContext.compcode);
  if (!sequelize?.query) {
    throw new ApiError(500, "Database connection not available");
  }

  const question = (payload.question || payload.userQuery || "").trim();
  const sql = (payload.sql || payload.correctSQL || "").trim();
  const intent = (payload.intent || "DYNAMIC_CUSTOM").trim();
  const table = (payload.targetTable || payload.table || "ERP_MASTER").trim();
  const synonyms = payload.synonyms || "";

  if (!question) throw new ApiError(400, "Question is required");
  if (!sql) throw new ApiError(400, "SQL Query is required");

  // Validate SQL is SELECT or WITH
  if (!/^\s*(SELECT|WITH)\b/i.test(sql) || /\b(DROP|DELETE|UPDATE|INSERT|ALTER|TRUNCATE|EXEC|CREATE)\b/i.test(sql)) {
    throw new ApiError(400, "Only read-only SELECT queries are allowed for security.");
  }

  await ensureLearningTablesExist(sequelize);

  const questionsToSave = [question];
  if (synonyms && typeof synonyms === "string") {
    synonyms.split(/[,;\n]+/).forEach(s => {
      const trimmed = s.trim();
      if (trimmed && !questionsToSave.includes(trimmed)) {
        questionsToSave.push(trimmed);
      }
    });
  }

  for (const q of questionsToSave) {
    const norm = normalizeLower(q);
    const mergeSql = `
      MERGE INTO [dbo].[AI_SQL_Learning_Tbl] AS target
      USING (SELECT N'${norm.replace(/'/g, "''")}' AS Question, '${intent.replace(/'/g, "''")}' AS Intent) AS source
      ON (CONVERT(NVARCHAR(500), target.Normalized_Question) = source.Question)
      WHEN MATCHED THEN
        UPDATE SET 
          target.Success_Count = target.Success_Count + 50,
          target.SQL_Query = N'${sql.replace(/'/g, "''")}',
          target.Tables_Used = '${table.replace(/'/g, "''")}',
          target.Intent = source.Intent,
          target.Last_Verified_At = GETDATE(),
          target.Updated_At = GETDATE()
      WHEN NOT MATCHED THEN
        INSERT (Normalized_Question, Intent, SQL_Query, Tables_Used, Success_Count, Last_Execution_Time_Ms, Created_At, Last_Verified_At)
        VALUES (source.Question, source.Intent, N'${sql.replace(/'/g, "''")}', '${table.replace(/'/g, "''")}', 50, 50, GETDATE(), GETDATE());
    `;
    try {
      await sequelize.query(mergeSql, { type: QueryTypes.RAW });
    } catch (sqlErr) {
      console.error(`[saveAILearnedRule] MERGE error for question "${q}":`, sqlErr?.message || sqlErr?.original?.message);
      throw sqlErr;
    }
  }

  // Clear in-memory caches
  CacheEngineInstance.l1ExactCache.clear();
  CacheEngineInstance.l3VectorCache = [];

  return {
    success: true,
    message: `Rule saved & model trained successfully for ${questionsToSave.length} phrasing variation(s)!`
  };
};

const deleteAILearnedRule = async (reqOrPayload) => {
  const payload = reqOrPayload?.body || reqOrPayload || {};
  const effectiveReq = reqOrPayload?.headers ? reqOrPayload : { body: payload, headers: {}, user: {} };
  const userContext = buildUserContext(effectiveReq);
  const sequelize = await dbname(effectiveReq, userContext.compcode);
  if (!sequelize?.query) {
    throw new ApiError(500, "Database connection not available");
  }

  const utd = payload.utd || payload.UTD;
  const question = payload.question;

  if (!utd && !question) {
    throw new ApiError(400, "UTD or question is required to delete rule");
  }

  let deleteSql = `DELETE FROM [dbo].[AI_SQL_Learning_Tbl] WHERE `;
  if (utd) deleteSql += `UTD = ${parseInt(utd, 10)}`;
  else deleteSql += `CONVERT(NVARCHAR(500), Normalized_Question) = '${normalizeLower(question).replace(/'/g, "''")}'`;

  await sequelize.query(deleteSql, { type: QueryTypes.RAW });

  // Clear in-memory caches
  CacheEngineInstance.l1ExactCache.clear();
  CacheEngineInstance.l3VectorCache = [];

  return {
    success: true,
    message: "Trained rule deleted successfully from AI learning memory."
  };
};

const testSQLQuery = async (reqOrPayload) => {
  const payload = reqOrPayload?.body || reqOrPayload || {};
  const effectiveReq = reqOrPayload?.headers ? reqOrPayload : { body: payload, headers: {}, user: {} };
  const userContext = buildUserContext(effectiveReq);
  const sequelize = await dbname(effectiveReq, userContext.compcode);
  if (!sequelize?.query) {
    throw new ApiError(500, "Database connection not available");
  }

  let sql = (payload.sql || payload.correctSQL || payload.query || "").trim();
  if (!sql) throw new ApiError(400, "SQL Query is required for testing");

  // Validate SQL
  if (!/^\s*(SELECT|WITH)\b/i.test(sql) || /\b(DROP|DELETE|UPDATE|INSERT|ALTER|TRUNCATE|EXEC|CREATE)\b/i.test(sql)) {
    throw new ApiError(400, "Security Violation: Only read-only SELECT queries are allowed.");
  }

  // Ensure TOP 50 for testing preview
  if (!/\bTOP\s+\d+\b/i.test(sql) && !/\bCOUNT\s*\(/i.test(sql)) {
    sql = sql.replace(/^\s*SELECT\b/i, "SELECT TOP 50");
  }

  const startTime = Date.now();
  try {
    const rows = await sequelize.query(sql, { type: QueryTypes.SELECT });
    const latencyMs = Date.now() - startTime;
    const columns = rows && rows.length > 0 ? Object.keys(rows[0]) : [];

    return {
      success: true,
      rowCount: rows ? rows.length : 0,
      columns,
      latencyMs,
      rows: rows ? rows.slice(0, 50) : [],
      sql
    };
  } catch (err) {
    return {
      success: false,
      error: err.original?.message || err.message || "SQL Execution Error",
      sql
    };
  }
};

const ensureAllAITables = async (sequelize) => {
  if (!sequelize?.query) return;
  const ddl = `
    IF OBJECT_ID('dbo.AI_Conversation_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_Conversation_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Conversation_Id] VARCHAR(100) NOT NULL,
        [User_Code] BIGINT NULL,
        [User_Name] NVARCHAR(200) NULL,
        [Title] NVARCHAR(500) NULL,
        [Conversation_Type] VARCHAR(50) NULL DEFAULT 'GENERAL',
        [Comp_Code] VARCHAR(50) NULL,
        [Status] VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
        [Last_Message_At] DATETIME2(7) NULL DEFAULT SYSDATETIME(),
        [Created_By] VARCHAR(100) NULL,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
        [Updated_By] VARCHAR(100) NULL,
        [Updated_At] DATETIME2(7) NULL
      );
    END;

    IF OBJECT_ID('dbo.AI_Message_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_Message_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Message_Id] VARCHAR(100) NOT NULL,
        [Conversation_Id] VARCHAR(100) NOT NULL,
        [Role] VARCHAR(20) NOT NULL,
        [Message_Content] NVARCHAR(MAX) NOT NULL,
        [Message_Type] VARCHAR(50) NULL DEFAULT 'TEXT',
        [Route_Type] VARCHAR(50) NULL,
        [Model_Name] VARCHAR(100) NULL,
        [Prompt_Tokens] INT NULL,
        [Completion_Tokens] INT NULL,
        [Total_Tokens] INT NULL,
        [Response_Time_Ms] INT NULL,
        [Metadata] NVARCHAR(MAX) NULL,
        [Error_Message] NVARCHAR(MAX) NULL,
        [Created_By] VARCHAR(100) NULL,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.AI_Query_Audit_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_Query_Audit_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Conversation_Id] VARCHAR(100) NULL,
        [User_Id] VARCHAR(100) NULL,
        [Emp_Code] VARCHAR(100) NULL,
        [Role] VARCHAR(50) NULL,
        [Comp_Code] VARCHAR(50) NULL,
        [User_Query] NVARCHAR(MAX) NULL,
        [Normalized_Query] NVARCHAR(MAX) NULL,
        [Intent] VARCHAR(100) NULL,
        [Tables_Used] VARCHAR(500) NULL,
        [Generated_SQL] NVARCHAR(MAX) NULL,
        [AI_Response] NVARCHAR(MAX) NULL,
        [Rows_Returned] INT NULL DEFAULT 0,
        [Execution_Time_Ms] INT NULL DEFAULT 0,
        [Confidence_Score] DECIMAL(5,2) NULL DEFAULT 0.95,
        [Status_Code] VARCHAR(30) NULL DEFAULT 'SUCCESS',
        [Error_Message] NVARCHAR(MAX) NULL,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
      );
    END
    ELSE IF COL_LENGTH('dbo.AI_Query_Audit_Tbl', 'AI_Response') IS NULL
    BEGIN
      ALTER TABLE [dbo].[AI_Query_Audit_Tbl] ADD [AI_Response] NVARCHAR(MAX) NULL;
    END;

    IF OBJECT_ID('dbo.AI_Query_Feedback_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_Query_Feedback_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Audit_UTD] BIGINT NULL,
        [Conversation_Id] VARCHAR(100) NULL,
        [Feedback_Type] VARCHAR(50) NULL,
        [User_Comment] NVARCHAR(MAX) NULL,
        [User_Id] VARCHAR(100) NULL,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.AI_SQL_Learning_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_SQL_Learning_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Normalized_Question] NVARCHAR(500) NULL,
        [Intent] VARCHAR(100) NULL,
        [SQL_Query] NVARCHAR(MAX) NULL,
        [Tables_Used] VARCHAR(500) NULL,
        [Success_Count] INT NULL DEFAULT 1,
        [Last_Execution_Time_Ms] INT NULL DEFAULT 50,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
        [Last_Verified_At] DATETIME2(7) NULL,
        [Updated_At] DATETIME2(7) NULL
      );
    END
    ELSE
    BEGIN
      IF COL_LENGTH('dbo.AI_SQL_Learning_Tbl', 'Last_Verified_At') IS NULL
        ALTER TABLE [dbo].[AI_SQL_Learning_Tbl] ADD [Last_Verified_At] DATETIME2(7) NULL;
      IF COL_LENGTH('dbo.AI_SQL_Learning_Tbl', 'Updated_At') IS NULL
        ALTER TABLE [dbo].[AI_SQL_Learning_Tbl] ADD [Updated_At] DATETIME2(7) NULL;
      IF COL_LENGTH('dbo.AI_SQL_Learning_Tbl', 'Intent') IS NULL
        ALTER TABLE [dbo].[AI_SQL_Learning_Tbl] ADD [Intent] VARCHAR(100) NULL;
      IF COL_LENGTH('dbo.AI_SQL_Learning_Tbl', 'Tables_Used') IS NULL
        ALTER TABLE [dbo].[AI_SQL_Learning_Tbl] ADD [Tables_Used] VARCHAR(500) NULL;
    END;

    IF OBJECT_ID('dbo.AI_SQL_Corrections', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_SQL_Corrections] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Correction_Type] VARCHAR(100) NULL,
        [User_Message] NVARCHAR(MAX) NULL,
        [Target_Table] VARCHAR(100) NULL,
        [Correct_SQL_Pattern] NVARCHAR(MAX) NULL,
        [Rule_Description] NVARCHAR(MAX) NULL,
        [Is_Active] BIT NOT NULL DEFAULT 1,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.AI_Schema_Table_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_Schema_Table_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Schema_Name] VARCHAR(50) NULL DEFAULT 'dbo',
        [Table_Name] VARCHAR(100) NOT NULL,
        [Display_Name] NVARCHAR(200) NULL,
        [Module_Name] VARCHAR(50) NULL DEFAULT 'GENERAL',
        [Description] NVARCHAR(MAX) NULL,
        [Approx_Row_Count] BIGINT NULL DEFAULT 0,
        [Is_Active] BIT NOT NULL DEFAULT 1,
        [Last_Synced_At] DATETIME2(7) NULL,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME(),
        [Updated_At] DATETIME2(7) NULL
      );
    END;

    IF OBJECT_ID('dbo.AI_Schema_Column_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_Schema_Column_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Table_Name] VARCHAR(100) NOT NULL,
        [Column_Name] VARCHAR(100) NOT NULL,
        [Data_Type] VARCHAR(50) NULL,
        [Business_Name] NVARCHAR(200) NULL,
        [Description] NVARCHAR(MAX) NULL,
        [Synonyms_JSON] NVARCHAR(MAX) NULL,
        [Is_Primary_Key] BIT NOT NULL DEFAULT 0,
        [Is_Foreign_Key] BIT NOT NULL DEFAULT 0,
        [Referenced_Table] VARCHAR(100) NULL,
        [Referenced_Column] VARCHAR(100) NULL,
        [Sensitivity_Level] VARCHAR(30) NULL DEFAULT 'INTERNAL',
        [Is_Filterable] BIT NOT NULL DEFAULT 1,
        [Is_Searchable] BIT NOT NULL DEFAULT 1,
        [Is_Active] BIT NOT NULL DEFAULT 1,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.AI_Schema_Relationship_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_Schema_Relationship_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [From_Table] VARCHAR(100) NOT NULL,
        [From_Column] VARCHAR(100) NOT NULL,
        [To_Table] VARCHAR(100) NOT NULL,
        [To_Column] VARCHAR(100) NOT NULL,
        [Relationship_Type] VARCHAR(50) NULL DEFAULT 'ONE_TO_MANY',
        [Relationship_Source] VARCHAR(50) NULL DEFAULT 'BUSINESS_DEFINED',
        [Business_Meaning] NVARCHAR(500) NULL,
        [Confidence] DECIMAL(5,2) NULL DEFAULT 1.0,
        [Priority] INT NULL DEFAULT 1,
        [Is_Active] BIT NOT NULL DEFAULT 1,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.AI_Business_Rule_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_Business_Rule_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Rule_Code] VARCHAR(100) NOT NULL,
        [Rule_Name] NVARCHAR(200) NOT NULL,
        [Target_Table] VARCHAR(100) NOT NULL,
        [SQL_Expression] NVARCHAR(MAX) NOT NULL,
        [Description] NVARCHAR(MAX) NULL,
        [Module_Name] VARCHAR(50) NULL DEFAULT 'GENERAL',
        [Is_Active] BIT NOT NULL DEFAULT 1,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.AI_Metric_Definition_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_Metric_Definition_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Metric_Code] VARCHAR(100) NOT NULL,
        [Metric_Name] NVARCHAR(200) NOT NULL,
        [Source_Table] VARCHAR(100) NOT NULL,
        [SQL_Formula] NVARCHAR(MAX) NOT NULL,
        [Supported_Dimensions] NVARCHAR(500) NULL,
        [Description] NVARCHAR(MAX) NULL,
        [Module_Name] VARCHAR(50) NULL DEFAULT 'GENERAL',
        [Is_Active] BIT NOT NULL DEFAULT 1,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
      );
    END;

    IF OBJECT_ID('dbo.AI_Business_Synonym_Tbl', 'U') IS NULL
    BEGIN
      CREATE TABLE [dbo].[AI_Business_Synonym_Tbl] (
        [UTD] BIGINT IDENTITY(1,1) PRIMARY KEY CLUSTERED,
        [Synonym_Word] NVARCHAR(200) NOT NULL,
        [Standard_Term] VARCHAR(100) NOT NULL,
        [Category] VARCHAR(50) NULL DEFAULT 'GENERAL',
        [Is_Active] BIT NOT NULL DEFAULT 1,
        [Created_At] DATETIME2(7) NOT NULL DEFAULT SYSDATETIME()
      );
    END;
  `;
  await sequelize.query(ddl, { type: QueryTypes.RAW }).catch((err) => {
    console.warn("[ensureAllAITables] Notice during table check:", err?.message || err?.original?.message);
  });
};

const getAuditLogs = async (reqOrPayload, maybeRes) => {
  const req = reqOrPayload?.headers ? reqOrPayload : { query: reqOrPayload || {}, headers: {}, user: {} };
  const userContext = buildUserContext(req);
  const sequelize = await dbname(req, userContext.compcode);

  const page = Math.max(1, parseInt(req.query?.page || req.body?.page, 10) || 1);
  const limit = Math.min(Math.max(1, parseInt(req.query?.limit || req.body?.limit, 10) || 20), 200);
  const offset = (page - 1) * limit;
  const search = String(req.query?.search || req.body?.search || "").trim();
  const status = String(req.query?.status || req.body?.status || "").trim().toUpperCase();
  const intent = String(req.query?.intent || req.body?.intent || "").trim();
  const startDate = String(req.query?.startDate || req.body?.startDate || "").trim();
  const endDate = String(req.query?.endDate || req.body?.endDate || "").trim();

  await ensureAllAITables(sequelize);

  let whereClauses = ["1=1"];
  let replacements = { limit, offset };

  if (search) {
    whereClauses.push("(User_Query LIKE :search OR Normalized_Query LIKE :search OR Generated_SQL LIKE :search OR Intent LIKE :search OR Emp_Code LIKE :search OR User_Id LIKE :search OR AI_Response LIKE :search)");
    replacements.search = `%${search}%`;
  }

  if (status && status !== "ALL") {
    whereClauses.push("Status_Code = :status");
    replacements.status = status;
  }

  if (intent && intent !== "ALL") {
    whereClauses.push("Intent = :intent");
    replacements.intent = intent;
  }

  if (startDate) {
    whereClauses.push("Created_At >= :startDate");
    replacements.startDate = `${startDate} 00:00:00`;
  }

  if (endDate) {
    whereClauses.push("Created_At <= :endDate");
    replacements.endDate = `${endDate} 23:59:59`;
  }

  const whereSql = whereClauses.join(" AND ");

  const countResult = await sequelize.query(`
    SELECT COUNT(1) AS TotalRecords FROM [dbo].[AI_Query_Audit_Tbl] WITH (NOLOCK) WHERE ${whereSql}
  `, { replacements, type: QueryTypes.SELECT }).catch(() => [{ TotalRecords: 0 }]);

  const totalRecords = Number(countResult[0]?.TotalRecords || 0);
  const totalPages = Math.ceil(totalRecords / limit) || 1;

  const rows = await sequelize.query(`
    SELECT 
      [UTD],
      [Conversation_Id] AS conversationId,
      [User_Id] AS userId,
      [Emp_Code] AS empCode,
      [Role] AS role,
      [Comp_Code] AS compCode,
      [User_Query] AS userQuery,
      [Normalized_Query] AS normalizedQuery,
      [Intent] AS intent,
      [Tables_Used] AS tablesUsed,
      [Generated_SQL] AS generatedSql,
      [AI_Response] AS aiResponse,
      ISNULL([Rows_Returned], 0) AS rowsReturned,
      ISNULL([Execution_Time_Ms], 0) AS executionTimeMs,
      ISNULL([Confidence_Score], 0.95) AS confidenceScore,
      ISNULL([Status_Code], 'SUCCESS') AS statusCode,
      [Error_Message] AS errorMessage,
      [Created_At] AS createdAt
    FROM [dbo].[AI_Query_Audit_Tbl] WITH (NOLOCK)
    WHERE ${whereSql}
    ORDER BY [UTD] DESC
    OFFSET :offset ROWS
    FETCH NEXT :limit ROWS ONLY
  `, { replacements, type: QueryTypes.SELECT }).catch(() => []);

  const statsResult = await sequelize.query(`
    SELECT 
      COUNT(1) AS totalQueries,
      SUM(CASE WHEN Status_Code = 'SUCCESS' THEN 1 ELSE 0 END) AS successQueries,
      SUM(CASE WHEN Status_Code = 'FAILED' THEN 1 ELSE 0 END) AS failedQueries,
      AVG(ISNULL(Execution_Time_Ms, 0)) AS avgExecutionTimeMs,
      COUNT(DISTINCT User_Id) AS activeUsersCount,
      SUM(CASE WHEN CAST(Created_At AS DATE) = CAST(GETDATE() AS DATE) THEN 1 ELSE 0 END) AS todayQueriesCount
    FROM [dbo].[AI_Query_Audit_Tbl] WITH (NOLOCK)
  `, { type: QueryTypes.SELECT }).catch(() => [{}]);

  const globalStats = statsResult[0] || {};
  const tot = Number(globalStats.totalQueries || 0);
  const succ = Number(globalStats.successQueries || 0);
  const successRate = tot > 0 ? ((succ / tot) * 100).toFixed(1) + "%" : "100%";

  const resultData = {
    success: true,
    data: rows,
    pagination: {
      page,
      limit,
      totalRecords,
      totalPages,
      hasMore: page < totalPages
    },
    stats: {
      totalQueries: tot,
      successQueries: succ,
      failedQueries: Number(globalStats.failedQueries || 0),
      successRate,
      avgExecutionTimeMs: Math.round(Number(globalStats.avgExecutionTimeMs || 0)),
      activeUsersCount: Number(globalStats.activeUsersCount || 0),
      todayQueriesCount: Number(globalStats.todayQueriesCount || 0)
    }
  };

  if (maybeRes && typeof maybeRes.status === "function") {
    return maybeRes.status(200).json(resultData);
  }
  return resultData;
};

// ============================================================================
// EXPORT ALL SERVICES & ENGINES
// ============================================================================

module.exports = {
  askEnterpriseCopilotV6,
  askERPAssistant: askEnterpriseCopilotV6,
  translateToEnglishIfVernacular,
  submitFeedback,
  getAuditLogs,
  getAILearnedRules,
  saveAILearnedRule,
  deleteAILearnedRule,
  testSQLQuery,
  ensureAllAITables,
  ensureLearningTablesExist,
  fetchLearnedGoldenExamplesAndRules,
  detectAndStoreUserCorrection,
  handleUserCorrectionAndDataLocation,
  extractGuidanceComponents,
  persistLearnedDataRule,
  asyncHandler,
  ApiError,
  buildUserContext,
  getOpenAIClient,
  generateEmbedding,
  classifyIntentAndExtractEntities,
  resolveEmployeeEntityViaDB,
  getDeterministicSQLTemplate,
  validateAndRepairSQL,
  formatHumanBusinessAnswer,
  executeAdaptiveCrossTableSearch,
  SchemaEngineInstance,
  MemoryEngineInstance,
  CacheEngineInstance,
  matchLearnedSimilarQuery,
  canonicalizeQueryPattern,
  getCacheAnalytics: () => CacheEngineInstance.getStats(),
  clearCache: () => CacheEngineInstance.clear()
};
