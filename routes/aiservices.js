
const fsPromises = require("fs").promises;
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");



let axios;
try { axios = require("axios"); } catch (_) {}
let z;
try { ({ z } = require("zod")); } catch (_) {}
const { dbname } = require("../utils/dbconfig");
const { randomUUID } = require("crypto");




const getOpenAISDK = () => {
  try {
    const mod = require("openai");
    return mod.OpenAI || mod.default || mod;
  } catch (_) {
    return null;
  }
};

const getQdrantSDK = () => {
  try {
    const mod = require("@qdrant/js-client-rest");
    return mod.QdrantClient || mod.default || mod;
  } catch (_) {
    return null;
  }
};

const zodTextFormat = (schema, name) => {
  try {
    const { zodResponseFormat } = require("openai/helpers/zod");
    return zodResponseFormat(schema, name);
  } catch (_) {
    return null;
  }
};




const asyncHandler = exports.asyncHandler = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};
class ApiError extends Error {
  constructor(statusCode = 500, message = "Internal server error", details = null) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.status = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }
}
exports.ApiError = ApiError;


const toPositiveInt = exports.toPositiveInt = (value, fallback, max = Number.MAX_SAFE_INTEGER) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.min(Math.floor(parsed), max);
};

const assertDocumentId = exports.assertDocumentId = (value) => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) throw new ApiError(400, "Valid documentId is required");
  return id;
};
/**
 * Answer Critic Service — AutoVyn ERP AI Copilot V3
 * Post-generation verification checking if generated answer claims are supported by database/document evidence.
 */

const verifyAnswerAgainstEvidence = exports.verifyAnswerAgainstEvidence = ({ answer = "", evidenceRows = [], documentHits = [] }) => {
  const criticResult = {
    supported: true,
    faithfulnessScore: 0.95,
    issues: [],
    requiresRegeneration: false,
  };

  if (!answer) return criticResult;

  // Check 1: If database evidence rows exist, verify codes/numbers present in answer
  if (Array.isArray(evidenceRows) && evidenceRows.length > 0) {
    const text = String(answer).toLowerCase();
    // Verify employee code if present in evidence
    const empCode = evidenceRows[0]?.EMPCODE || evidenceRows[0]?.Emp_Code || evidenceRows[0]?.EmployeeCode;
    if (empCode && !text.includes(String(empCode).toLowerCase())) {
      criticResult.issues.push(`Answer missing explicit reference to employee code ${empCode}`);
      criticResult.faithfulnessScore = Math.min(criticResult.faithfulnessScore, 0.85);
    }
  }

  return criticResult;
};

let client = null;

const getOpenAIClient = exports.getOpenAIClient = () => {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();

  if (!apiKey) {
    throw new ApiError(500, "OPENAI_API_KEY is not configured");
  }

  if (!client) {
    const OpenAIClass = getOpenAISDK();
    if (!OpenAIClass || typeof OpenAIClass !== "function") {
      throw new ApiError(500, "OpenAI SDK is not installed or available in the environment");
    }
    client = new OpenAIClass({ apiKey });
  }

  return client;
};

/**
 * Confidence Service — AutoVyn ERP AI Copilot V2
 * Calculates evidence confidence level (HIGH, MEDIUM, LOW) based on database hits & RAG quality.
 */

const calculateConfidence = exports.calculateConfidence = ({ databaseEvidence = null, documentHits = [] }) => {
  if (databaseEvidence?.canAnswer && databaseEvidence.rows?.length > 0) {
    const topScore = Number(databaseEvidence.rows[0]?.MatchScore ?? 100);
    if (topScore >= 85 || databaseEvidence.deterministic) {
      return { level: "HIGH", score: 0.95 };
    }
    return { level: "MEDIUM", score: 0.75 };
  }

  if (documentHits && documentHits.length > 0) {
    const bestSim = Math.max(...documentHits.map((d) => Number(d.score || d.sim || 0)));
    if (bestSim >= 0.85) {
      return { level: "HIGH", score: bestSim };
    }
    if (bestSim >= 0.65) {
      return { level: "MEDIUM", score: bestSim };
    }
  }

  return { level: "LOW", score: 0.40 };
};





const normalizeText = (
  value
) => {
  return String(
    value ?? ""
  )
    .replace(
      /\s+/g,
      " "
    )
    .trim();
};

const getEmbeddingModel =
  () => {
    return String(
      process.env
        .OPENAI_EMBEDDING_MODEL ||
        "text-embedding-3-small"
    ).trim();
  };

const generateEmbedding = exports.generateEmbedding =
  async (
    text
  ) => {
    const normalizedText =
      normalizeText(
        text
      );

    if (!normalizedText) {
      throw new ApiError(
        400,
        "Text is required for embedding generation"
      );
    }

    const model =
      getEmbeddingModel();

    try {
      const response =
        await getOpenAIClient()
          .embeddings.create({
            model,

            input:
              normalizedText,

            encoding_format:
              "float",
          });

      const embedding =
        response.data?.[0]
          ?.embedding;

      if (
        !Array.isArray(
          embedding
        ) ||
        embedding.length ===
          0
      ) {
        throw new ApiError(
          502,
          "AI provider returned an invalid embedding"
        );
      }

      return {
        embedding,
        model,

        usage:
          response.usage ||
          null,
      };
    } catch (error) {
      if (
        error instanceof
        ApiError
      ) {
        throw error;
      }

      if (
        error?.status ===
        429
      ) {
        throw new ApiError(
          429,
          "Embedding request limit exceeded"
        );
      }

      throw new ApiError(
        502,
        "Unable to generate embedding"
      );
    }
  };

const generateEmbeddingsBatch = exports.generateEmbeddingsBatch =
  async (
    texts = []
  ) => {
    if (
      !Array.isArray(texts) ||
      texts.length === 0
    ) {
      throw new ApiError(
        400,
        "Embedding texts are required"
      );
    }

    const normalizedTexts =
      texts.map(
        normalizeText
      );

    if (
      normalizedTexts.some(
        (text) => !text
      )
    ) {
      throw new ApiError(
        400,
        "Embedding text cannot be empty"
      );
    }

    const model =
      getEmbeddingModel();

    const batchSize =
      Math.max(
        1,
        Math.min(
          Number(
            process.env
              .AI_EMBEDDING_BATCH_SIZE ||
              64
          ),
          100
        )
      );

    const embeddings =
      [];

    let totalTokens =
      0;

    try {
      for (
        let offset = 0;
        offset <
        normalizedTexts.length;
        offset += batchSize
      ) {
        const batch =
          normalizedTexts.slice(
            offset,
            offset +
              batchSize
          );

        const response =
          await getOpenAIClient()
            .embeddings.create({
              model,

              input:
                batch,

              encoding_format:
                "float",
            });

        const orderedData =
          [
            ...(
              response.data ||
              []
            ),
          ].sort(
            (
              first,
              second
            ) =>
              first.index -
              second.index
          );

        if (
          orderedData.length !==
          batch.length
        ) {
          throw new ApiError(
            502,
            "AI provider returned an incomplete embedding batch"
          );
        }

        embeddings.push(
          ...orderedData.map(
            (item) =>
              item.embedding
          )
        );

        totalTokens +=
          Number(
            response.usage
              ?.total_tokens ||
              0
          );
      }

      return {
        embeddings,
        model,

        usage: {
          total_tokens:
            totalTokens,
        },
      };
    } catch (error) {
      if (
        error instanceof
        ApiError
      ) {
        throw error;
      }

      if (
        error?.status ===
        429
      ) {
        throw new ApiError(
          429,
          "Embedding request limit exceeded"
        );
      }

      throw new ApiError(
        502,
        "Unable to generate embedding batch"
      );
    }
  };


  /**
 * Evidence Service — AutoVyn ERP AI Copilot V2
 * Normalizes RAG document hits and SQL database rows into a unified evidence model.
 */

const normalizeEvidence = exports.normalizeEvidence = ({ databaseEvidence = null, documentHits = [] }) => {
  const evidenceList = [];

  if (databaseEvidence?.canAnswer && databaseEvidence.rows?.length > 0) {
    evidenceList.push({
      type: "DATABASE",
      source: databaseEvidence.sqlPlan?.explanation || "Database Query",
      rowCount: databaseEvidence.rowCount || databaseEvidence.rows.length,
      rows: databaseEvidence.rows,
    });
  }

  if (Array.isArray(documentHits) && documentHits.length > 0) {
    for (const doc of documentHits) {
      evidenceList.push({
        type: "DOCUMENT",
        source: doc.payload?.title || doc.payload?.sourceName || "Knowledge Document",
        section: doc.payload?.section || null,
        score: doc.score || doc.sim || null,
        content: doc.payload?.content || "",
      });
    }
  }

  return evidenceList;
};


















// ─── Helpers ──────────────────────────────────────────────────────────────────

const usageVal = (usage, ...keys) => {
  for (const k of keys) {
    const v = Number(usage?.[k]);
    if (Number.isFinite(v)) return v;
  }
  return null;
};

const buildSources = (docs = []) =>
  docs.map((item, i) => {
    const p = item?.payload || {};
    return {
      sourceNumber:    i + 1,
      documentId:      p.documentId   ?? null,
      title:           p.title        || "Knowledge document",
      section:         p.section      || null,
      pageNumber:      p.pageNumber   ?? null,
      moduleName:      p.moduleName   || null,
      sourceReference: p.sourceReference || p.filePath || null,
      score: Number(item.rerankScore ?? item.hybridScore ?? item.score ?? 0),
    };
  });

const buildQueryMeta = (dbEvidence) => {
  if (!dbEvidence) return null;
  return {
    canAnswer:         dbEvidence.canAnswer,
    intent:            dbEvidence.sqlPlan?.intent            || null,
    sensitivity:       dbEvidence.sqlPlan?.sensitivity       || null,
    explanation:       dbEvidence.sqlPlan?.explanation       || null,
    searchMeta:        dbEvidence.sqlPlan?.searchMeta        || null,
    reason:            dbEvidence.sqlPlan?.reason            || null,
    joinTables:        dbEvidence.sqlPlan?.joinTables        || [],
    requiresJoin:      dbEvidence.sqlPlan?.requiresJoin      || false,
    rowCount:          dbEvidence.rowCount                   || 0,
    totalRowsReturned: dbEvidence.totalRowsReturned          || 0,
    truncated:         Boolean(dbEvidence.truncated),
    executionTimeMs:   dbEvidence.executionTimeMs            || 0,
  };
};

// ─── Main Export ──────────────────────────────────────────────────────────────

const askERPAssistant = exports.askERPAssistant = async (req, payload = {}) => {

  payload = req.body
  const startedAt = Date.now();
  const trace = createTrace(req.headers?.["x-request-id"] || payload.conversationId || "");

  // ── Validate input ────────────────────────────────────────────────────────
  const message = normalizeValue(payload.message);
  if (!message) throw new ApiError(400, "message is required");

  // ── User context ──────────────────────────────────────────────────────────
  const userContext = buildUserContext(req);
  if (!userContext.numericUserId) {
    throw new ApiError(401, "Valid numeric user ID is unavailable");
  }

  // ── DB connection ─────────────────────────────────────────────────────────
  const sequelize = await dbname(req, userContext.compcode);
  if (!sequelize?.query) throw new ApiError(500, "Database connection failed");

  // ── Conversation ──────────────────────────────────────────────────────────
  const conv = await getOrCreateConversation({
    sequelize,
    conversationId:   payload.conversationId,
    userCode:         userContext.numericUserId,
    userName:         userContext.userName,
    compcode:         userContext.compcode,
    title:            payload.title || message.slice(0, 100),
    conversationType: "GENERAL",
  });
  const conversationId = conv.conversationId;

  // ── Save user message ─────────────────────────────────────────────────────
  await saveConversationMessage({
    sequelize,
    conversationId,
    role:      "user",
    content:   message,
    createdBy: String(userContext.numericUserId),
    metadata: {
      employeeCode: userContext.employeeCode,
      roleFlag:     userContext.roleFlag,
    },
  });

  // ── Load history ──────────────────────────────────────────────────────────
  const history = await loadConversationHistory({ sequelize, conversationId });

  // ── Classify request ──────────────────────────────────────────────────────
  const route = await classifyChatRequest({ message, history, userContext });
  trace.markStage("routing");

  // ── Evidence gathering ────────────────────────────────────────────────────
  let documents      = [];
  let databaseEvidence = null;

  // RAG retrieval
  if (["DOCUMENT_RAG", "HYBRID"].includes(route.mode)) {
    try {
      const found = await retrieveKnowledge({
        question:    message,
        searchQuery: route.searchQuery || message,
        userContext,
        moduleName:  route.moduleName,
      });
      documents = await rerankDocuments({ question: message, documents: found });
    } catch (error) {
      console.error("[Orchestrator] RAG failed:", error?.message);
      // Non-fatal: continue without docs
    }
  }

  // Database evidence
  if (["DATABASE", "HYBRID"].includes(route.mode)) {
    try {
      databaseEvidence = await getDatabaseEvidence({
        req,
        question: message,
        userContext,
        route,           // pass route for context
        history,         // pass session history for pronoun/follow-up resolution
      });

      console.log("databaseEvidence",databaseEvidence)
    } catch (error) {
      console.error("[Orchestrator] DB evidence failed:", error?.message);
      // Non-fatal: answer with what we have
      databaseEvidence = {
        canAnswer: false,
        sqlPlan: { reason: error?.message },
        rows: [],
        rowCount: 0,
        totalRowsReturned: 0,
        truncated: false,
        executionTimeMs: 0,
      };
    }
  }
  trace.markStage("evidence");

  // ── Generate answer ───────────────────────────────────────────────────────
  const generated = await generateUnifiedAnswer({
    message,
    mode:             route.mode,
    intent:           route.intent,
    history,
    userContext,
    documents,
    databaseEvidence,
    route,            // pass full route for richer context
  });
  trace.markStage("answer");

  // ── Build response ────────────────────────────────────────────────────────
  const sources            = buildSources(documents);
  const responseTimeMs     = Date.now() - startedAt;
  const usage              = generated.usage || {};
  const query              = buildQueryMeta(databaseEvidence);
  const confidence         = calculateConfidence({ databaseEvidence, documentHits: documents });
  const normalizedEvidence = normalizeEvidence({ databaseEvidence, documentHits: documents });
  const sqlValidation      = validateSQLResult({ sqlPlan: databaseEvidence?.sqlPlan, rows: databaseEvidence?.rows, requestedEntity: userContext });
  const criticResult       = verifyAnswerAgainstEvidence({ answer: generated.answer, evidenceRows: databaseEvidence?.rows, documentHits: documents });
  const ambiguity          = checkAmbiguity(databaseEvidence?.rows || []);
  const traceSummary       = trace.endTrace();

  // Record metrics
  recordQueryMetrics({ mode: route.mode, confidenceLevel: confidence.level, success: true });

  // ── Save assistant message ────────────────────────────────────────────────
  await saveConversationMessage({
    sequelize,
    conversationId,
    role:             "assistant",
    content:          generated.answer,
    routeType:        route.mode,
    modelName:        generated.model,
    promptTokens:     usageVal(usage, "input_tokens",  "prompt_tokens"),
    completionTokens: usageVal(usage, "output_tokens", "completion_tokens"),
    totalTokens:      usageVal(usage, "total_tokens"),
    responseTimeMs,
    metadata: {
      intent:        route.intent,
      routeReason:   route.reason,
      searchQuery:   route.searchQuery,
      moduleName:    route.moduleName,
      isSelfQuery:   route.isSelfQuery,
      sources,
      databaseQuery: query,
      confidence,
      evidence:      normalizedEvidence,
      sqlValidation,
      critic:        criticResult,
      isAmbiguous:   ambiguity.isAmbiguous,
      candidates:    ambiguity.candidates,
      telemetry:     traceSummary,
    },
    createdBy: String(userContext.numericUserId),
  });

  // ── Return ────────────────────────────────────────────────────────────────
  return {
    conversationId,
    answer:          generated.answer,
    mode:            route.mode,
    intent:          route.intent,
    isSelfQuery:     route.isSelfQuery,
    sources,
    query,
    confidence,
    evidence:        normalizedEvidence,
    sqlValidation,
    critic:          criticResult,
    isAmbiguous:     ambiguity.isAmbiguous,
    resolvedEntities: ambiguity.candidates,
    model:           generated.model,
    usage: {
      promptTokens:     usageVal(usage, "input_tokens",  "prompt_tokens"),
      completionTokens: usageVal(usage, "output_tokens", "completion_tokens"),
      totalTokens:      usageVal(usage, "total_tokens"),
    },
    responseTimeMs,
  };
};





// ─── Schema ──────────────────────────────────────────────────────────────────

const RouteSchema = z.object({
  mode: z.enum(["GENERAL", "DOCUMENT_RAG", "DATABASE", "HYBRID"]),
  intent: z.string().min(1),
  searchQuery: z.string().min(1),
  moduleName: z.string().nullable(),
  reason: z.string(),
  // New fields
  tables: z.array(z.string()).default([]),          // detected tables
  needsSalary: z.boolean().default(false),           // salary related
  needsPolicy: z.boolean().default(false),           // policy related
  needsReminder: z.boolean().default(false),         // reminder related
  isSelfQuery: z.boolean().default(false),           // "meri","mere","my"
  isCountQuery: z.boolean().default(false),          // count/kitne
  requestedLimit: z.number().int().min(1).max(500).default(100),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const normalize = (v) => String(v ?? "").replace(/\s+/g, " ").trim();

// ─── Keyword Detectors ────────────────────────────────────────────────────────

const PATTERNS = {
  salary:    /salary|salari|pay|payroll|ctc|वेतन|तनख्वाह|payscale|increment/i,
  hr:        /leave|attendance|policy|sop|hr|appraisal|छुट्टी|उपस्थिति|नीति/i,
  reminder:  /reminder|reminders|service due|follow.?up|remind|रिमाइंडर/i,
  vehicle:   /vehicle|vehi|car|reg|registration|गाड़ी|वाहन/i,
  employee:  /employee|emp|staff|कर्मचारी/i,
  self:      /\b(my|meri|mere|mera|apna|apni|khud|myself|i want|mujhe)\b/i,
  count:     /\b(count|total|kitne|kitni|how many|कितने|कितनी|कुल)\b/i,
  live:      /\b(top\s*\d+|list|records?|data|show|batao|do|dena|nikalo|chahiye)\b/i,
  schema:    /\b(columns?|schema|structure|fields?|table info|kya kya hai)\b/i,
  pending:   /\b(pending|open|due|unresolved|baki|baaki|pending hai)\b/i,
  mobile:    /(?:\+?91[\s-]?)?[6-9]\d{9}/,
  nameSearch:/\b(naam|name|find|dhundo|search|kaun|who)\b/i,
};

const detectTables = (text) => {
  const matches = [
    ...text.matchAll(
      /\b(?:dbo\.)?([A-Za-z_][A-Za-z0-9_]*(?:_(?:Tbl|Mst|Master|View|Vw)))\b/gi
    ),
  ];
  return [...new Set(matches.map((m) => m[1]))];
};

const detectLimit = (text) => {
  const patterns = [
    /\btop\s+(\d{1,3})\b/i,
    /\bfirst\s+(\d{1,3})\b/i,
    /\b(\d{1,3})\s+(?:records?|rows?|vehicles?|employees?|reminders?)\b/i,
    /\b(?:pehle|pahle)\s+(\d{1,3})\b/i,
  ];
  for (const p of patterns) {
    const m = text.match(p);
    if (m?.[1]) return Math.min(Math.max(Number(m[1]), 1), 500);
  }
  return 100;
};

// ─── Deterministic Router ─────────────────────────────────────────────────────

const deterministicRoute = (message) => {
  const text = normalize(message);

  // Mobile number lookup
  if (PATTERNS.mobile.test(text) && PATTERNS.employee.test(text)) {
    return {
      mode: "DATABASE",
      intent: "EMPLOYEE_MOBILE_LOOKUP",
      searchQuery: text,
      moduleName: "HR",
      reason: "Mobile number employee lookup",
      tables: ["EMPLOYEEMASTER"],
      needsSalary: false,
      needsPolicy: false,
      needsReminder: false,
      isSelfQuery: false,
      isCountQuery: false,
      requestedLimit: 10,
    };
  }

  // Schema/structure question
  if (PATTERNS.schema.test(text) && !PATTERNS.live.test(text)) {
    return {
      mode: "DOCUMENT_RAG",
      intent: "TABLE_SCHEMA_KNOWLEDGE",
      searchQuery: text,
      moduleName: null,
      reason: "Schema/structure question → indexed knowledge",
      tables: detectTables(text),
      needsSalary: false,
      needsPolicy: false,
      needsReminder: false,
      isSelfQuery: false,
      isCountQuery: false,
      requestedLimit: 10,
    };
  }

  // Policy/HR docs
  if (PATTERNS.hr.test(text) && !PATTERNS.live.test(text)) {
    return {
      mode: "DOCUMENT_RAG",
      intent: "HR_POLICY_QUERY",
      searchQuery: text,
      moduleName: "HR",
      reason: "HR policy/SOP question",
      tables: [],
      needsSalary: false,
      needsPolicy: true,
      needsReminder: false,
      isSelfQuery: PATTERNS.self.test(text),
      isCountQuery: false,
      requestedLimit: 10,
    };
  }

  return null;
};

// ─── GPT Router ───────────────────────────────────────────────────────────────

const ROUTER_INSTRUCTIONS = `
You are an ERP AI request classifier.

Classify the user message into one of these modes:
- GENERAL: greetings, coding help, no ERP data needed
- DOCUMENT_RAG: questions about indexed knowledge (schemas, policies, SOPs, table structure, column info)
- DATABASE: questions needing live SQL data (records, counts, lists, reports, salary, reminders)
- HYBRID: needs both indexed knowledge AND live data

Detect:
- tables: any DB table names mentioned
- needsSalary: salary/pay/payroll questions
- needsPolicy: HR policy/leave/SOP questions  
- needsReminder: service reminder questions
- isSelfQuery: "my","meri","mere","mera" → user wants their own data
- isCountQuery: count/total/kitne questions
- requestedLimit: number of records requested (default 100)

Rules:
- "salary kitni hai" → DATABASE + isSelfQuery=true
- "salary kyu kati" → HYBRID (needs policy + live data)
- "reminder kitne hain" → DATABASE + isCountQuery=true
- "leave policy" → DOCUMENT_RAG
- "meri attendance" → DATABASE + isSelfQuery=true
- "vehicle list do" → DATABASE
- Table name + "ke columns" → DOCUMENT_RAG
- Table name + "ke records" → DATABASE

Return structured classification only.
`.trim();

const classifyChatRequest = exports.classifyChatRequest = async ({ message, history = [], userContext }) => {
  const text = normalize(message);

  // Try deterministic first
  const fixed = deterministicRoute(text);
  if (fixed) {
    if (process.env.NODE_ENV === "development") {
      console.log("[Router] Deterministic:", fixed.intent);
    }
    return fixed;
  }

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model: String(process.env.OPENAI_ROUTER_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini"),
      messages: [
        {
          role: "system",
          content:
            ROUTER_INSTRUCTIONS +
            "\nReturn a valid JSON object matching fields: mode (GENERAL/DOCUMENT_RAG/DATABASE/HYBRID), intent, searchQuery, moduleName, reason, tables, needsSalary, needsPolicy, needsReminder, isSelfQuery, isCountQuery, requestedLimit.",
        },
        {
          role: "user",
          content: JSON.stringify({
            message: text,
            recentHistory: (history ?? []).slice(-4).map((h) => ({
              role: h.role,
              content: String(h.content || "").slice(0, 200),
            })),
            userContext: {
              role: userContext?.role,
              compcode: userContext?.compcode,
            },
          }),
        },
      ],
      response_format: { type: "json_object" },
      max_tokens: 500,
    });

    const parsedText = response.choices[0]?.message?.content || "{}";
    const result = JSON.parse(parsedText);
    if (result && result.mode) {
      if (process.env.NODE_ENV === "development") {
        console.log("[Router] GPT:", result.intent, result.mode);
      }
      return {
        mode: result.mode || "DATABASE",
        intent: result.intent || "GENERAL_QUERY",
        searchQuery: result.searchQuery || text,
        moduleName: result.moduleName || null,
        reason: result.reason || "GPT classified",
        tables: Array.isArray(result.tables) ? result.tables : [],
        needsSalary: Boolean(result.needsSalary),
        needsPolicy: Boolean(result.needsPolicy),
        needsReminder: Boolean(result.needsReminder),
        isSelfQuery: Boolean(result.isSelfQuery),
        isCountQuery: Boolean(result.isCountQuery),
        requestedLimit: typeof result.requestedLimit === "number" ? result.requestedLimit : 100,
      };
    }
  } catch (error) {
    console.error("[Router] GPT failed:", error?.message);
  }

  // Fallback
  return {
    mode: PATTERNS.live.test(text) ? "DATABASE" : "GENERAL",
    intent: "FALLBACK",
    searchQuery: text,
    moduleName: null,
    reason: "Fallback route",
    tables: detectTables(text),
    needsSalary: PATTERNS.salary.test(text),
    needsPolicy: PATTERNS.hr.test(text),
    needsReminder: PATTERNS.reminder.test(text),
    isSelfQuery: PATTERNS.self.test(text),
    isCountQuery: PATTERNS.count.test(text),
    requestedLimit: detectLimit(text),
  };
};




const listUserConversations = exports.listUserConversations = async ({ req, limit = 30 }) => {
  const user = buildUserContext(req);
  const sequelize = await dbname(req, user.compcode);

  const maxLimit = Math.max(1, Math.min(Number(limit) || 30, 100));

  const rows = await sequelize.query(
    `SELECT TOP (${maxLimit}) 
       [Conversation_Id],
       [Title],
       [Conversation_Type],
       [Status],
       [Last_Message_At],
       [Created_At],
       [Updated_At] 
     FROM [dbo].[AI_Conversation_Tbl] WITH (NOLOCK) 
     WHERE [Comp_Code] = :compCode 
       AND [User_Code] = :userCode 
       AND [Status] = 'ACTIVE' 
     ORDER BY ISNULL([Updated_At], [Created_At]) DESC`,
    {
      replacements: { compCode: user.compcode, userCode: user.numericUserId },
      type: QueryTypes.SELECT,
    }
  );

  return rows.map((r) => ({
    conversationId: String(r.Conversation_Id || r.conversationId || ""),
    title: String(r.Title || "Untitled Session"),
    conversationType: r.Conversation_Type || "GENERAL",
    status: r.Status || "ACTIVE",
    lastMessageAt: r.Last_Message_At || r.Updated_At || r.Created_At,
    createdAt: r.Created_At,
    updatedAt: r.Updated_At,
  }));
};

const getConversationMessages = exports.getConversationMessages = async ({ req, conversationId }) => {
  const user = buildUserContext(req);
  const sequelize = await dbname(req, user.compcode);

  const cleanConvId = String(conversationId || "").trim();

  const owner = await sequelize.query(
    `SELECT TOP 1 [Conversation_Id] 
     FROM [dbo].[AI_Conversation_Tbl] WITH (NOLOCK) 
     WHERE [Conversation_Id] = :conversationId 
       AND [Comp_Code] = :compCode 
       AND [User_Code] = :userCode 
       AND [Status] = 'ACTIVE'`,
    {
      replacements: { conversationId: cleanConvId, compCode: user.compcode, userCode: user.numericUserId },
      type: QueryTypes.SELECT,
    }
  );

  if (!owner.length) throw new ApiError(404, "Conversation was not found");

  const rows = await sequelize.query(
    `SELECT 
       [UTD],
       [Message_Id],
       [Role],
       [Message_Content],
       [Message_Type],
       [Route_Type],
       [Model_Name],
       [Prompt_Tokens],
       [Completion_Tokens],
       [Total_Tokens],
       [Response_Time_Ms],
       [Metadata],
       [Error_Message],
       [Created_At] 
     FROM [dbo].[AI_Message_Tbl] WITH (NOLOCK) 
     WHERE [Conversation_Id] = :conversationId 
     ORDER BY [UTD] ASC`,
    {
      replacements: { conversationId: cleanConvId },
      type: QueryTypes.SELECT,
    }
  );

  const messages = rows.map((row) => ({
    id: row.UTD,
    messageId: row.Message_Id,
    role: String(row.Role || "assistant").toLowerCase(),
    content: row.Message_Content || "",
    messageType: row.Message_Type,
    routeType: row.Route_Type,
    modelName: row.Model_Name,
    promptTokens: row.Prompt_Tokens,
    completionTokens: row.Completion_Tokens,
    totalTokens: row.Total_Tokens,
    responseTimeMs: row.Response_Time_Ms,
    metadata: row.Metadata
      ? (() => {
          try {
            return JSON.parse(row.Metadata);
          } catch {
            return row.Metadata;
          }
        })()
      : null,
    errorMessage: row.Error_Message,
    createdAt: row.Created_At,
  }));

  return {
    conversationId: cleanConvId,
    messages,
  };
};



const isUUID = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(value || ""));
// const normalizeValue = (value) => String(value ?? "").trim();
const validateSequelize = (sequelize) => {
  if (!sequelize || typeof sequelize.query !== "function") throw new ApiError(500, "Database connection is missing in conversation service");
};

const getOrCreateConversation = exports.getOrCreateConversation = async ({ sequelize, conversationId, userCode, userName, compcode, title, conversationType = "GENERAL" }) => {
  validateSequelize(sequelize);
  const numericUserCode = Number(userCode);
  if (!Number.isSafeInteger(numericUserCode) || numericUserCode <= 0) throw new ApiError(400, "Valid numeric userCode is required");
  const company = normalizeValue(compcode);
  if (!company) throw new ApiError(400, "compcode is required");

  let id = normalizeValue(conversationId);
  if (id && !isUUID(id)) throw new ApiError(400, "Invalid conversationId");
  if (id) {
    const rows = await sequelize.query(
      `SELECT TOP 1 [Conversation_Id] FROM [dbo].[AI_Conversation_Tbl]
       WHERE [Conversation_Id]=:id AND [User_Code]=:userCode AND [Comp_Code]=:compcode AND [Status]='ACTIVE'`,
      { replacements: { id, userCode: numericUserCode, compcode: company }, type: QueryTypes.SELECT }
    );
    if (!rows.length) throw new ApiError(404, "Conversation was not found");
    return { conversationId: id, created: false };
  }

  id = randomUUID();
  await sequelize.query(
    `INSERT INTO [dbo].[AI_Conversation_Tbl]
     ([Conversation_Id],[User_Code],[User_Name],[Title],[Conversation_Type],[Comp_Code],[Status],[Last_Message_At],[Created_By],[Created_At])
     VALUES (:id,:userCode,:userName,:title,:conversationType,:compcode,'ACTIVE',GETDATE(),:createdBy,GETDATE())`,
    { replacements: { id, userCode: numericUserCode, userName: normalizeValue(userName) || null, title: normalizeValue(title) || "New Conversation", conversationType: normalizeValue(conversationType) || "GENERAL", compcode: company, createdBy: String(numericUserCode) } }
  );
  return { conversationId: id, created: true };
};

const loadConversationHistory = exports.loadConversationHistory = async ({ sequelize, conversationId }) => {
  validateSequelize(sequelize);
  const limit = Math.max(1, Math.min(Number(process.env.AI_CHAT_HISTORY_LIMIT || 12), 30));
  const rows = await sequelize.query(
    `SELECT TOP (${limit}) [Message_Id],[Role],[Message_Content],[Message_Type],[Route_Type],[Model_Name],[Prompt_Tokens],[Completion_Tokens],[Total_Tokens],[Response_Time_Ms],[Metadata],[Error_Message],[Created_At]
     FROM [dbo].[AI_Message_Tbl] WHERE [Conversation_Id]=:conversationId ORDER BY [UTD] DESC`,
    { replacements: { conversationId }, type: QueryTypes.SELECT }
  );
  return rows.reverse().map(row => ({ messageId: row.Message_Id, role: row.Role, content: row.Message_Content, messageType: row.Message_Type, routeType: row.Route_Type, modelName: row.Model_Name, promptTokens: row.Prompt_Tokens, completionTokens: row.Completion_Tokens, totalTokens: row.Total_Tokens, responseTimeMs: row.Response_Time_Ms, metadata: row.Metadata ? (() => { try { return JSON.parse(row.Metadata) } catch { return row.Metadata } })() : null, errorMessage: row.Error_Message, createdAt: row.Created_At }));
};

const saveConversationMessage = exports.saveConversationMessage = async ({ sequelize, conversationId, role, content, messageType = "TEXT", routeType = null, modelName = null, promptTokens = null, completionTokens = null, totalTokens = null, responseTimeMs = null, metadata = null, errorMessage = null, createdBy = null }) => {
  validateSequelize(sequelize);
  const normalizedRole = normalizeValue(role).toLowerCase();
  if (!["user", "assistant", "system", "tool"].includes(normalizedRole)) throw new ApiError(400, `Invalid message role: ${normalizedRole}`);
  const normalizedContent = normalizeValue(content);
  if (!normalizedContent) throw new ApiError(400, "Message content is required");
  const messageId = randomUUID();
  await sequelize.query(
    `INSERT INTO [dbo].[AI_Message_Tbl]
     ([Message_Id],[Conversation_Id],[Role],[Message_Content],[Message_Type],[Route_Type],[Model_Name],[Prompt_Tokens],[Completion_Tokens],[Total_Tokens],[Response_Time_Ms],[Metadata],[Error_Message],[Created_By],[Created_At])
     VALUES (:messageId,:conversationId,:role,:content,:messageType,:routeType,:modelName,:promptTokens,:completionTokens,:totalTokens,:responseTimeMs,:metadata,:errorMessage,:createdBy,GETDATE())`,
    { replacements: { messageId, conversationId, role: normalizedRole, content: normalizedContent, messageType, routeType, modelName, promptTokens, completionTokens, totalTokens, responseTimeMs, metadata: metadata ? JSON.stringify(metadata) : null, errorMessage, createdBy } }
  );
  await sequelize.query(`UPDATE [dbo].[AI_Conversation_Tbl] SET [Last_Message_At]=GETDATE(),[Updated_By]=:updatedBy,[Updated_At]=GETDATE() WHERE [Conversation_Id]=:conversationId`, { replacements: { conversationId, updatedBy: createdBy } });
  return { messageId };
};





// ─── Document Context ─────────────────────────────────────────────────────────

const buildDocumentContext = (docs = []) =>
  docs.map((doc, i) => ({
    sourceNumber: i + 1,
    documentId:   doc.payload?.documentId,
    title:        doc.payload?.title,
    section:      doc.payload?.section    ?? null,
    pageNumber:   doc.payload?.pageNumber ?? null,
    content:      doc.payload?.content    ?? "",
  }));

// ─── Score Filter ─────────────────────────────────────────────────────────────

const filterBestMatches = (rows = [], maxRows = 25) => {
  const limit = typeof maxRows === "number" && Number.isFinite(maxRows) && maxRows > 0 ? maxRows : 25;
  if (!rows.length) return rows;

  const hasScore = "MatchScore" in rows[0];
  if (!hasScore) return rows.slice(0, limit);

  const scores    = rows.map((r) => Number(r.MatchScore ?? 0));
  const bestScore = Math.max(...scores);

  if (process.env.NODE_ENV === "development") {
    console.log(`[FinalAnswer] Best score: ${bestScore}, rows: ${rows.length}`);
  }

  if (bestScore === 0) return [];

  const threshold = bestScore >= 100 ? 100
    : bestScore >= 85  ? 85
    : bestScore >= 65  ? 65
    : bestScore >= 40  ? 40
    : 0;

  if (threshold === 0) return [];

  return rows
    .filter((r) => Number(r.MatchScore ?? 0) >= threshold)
    .slice(0, limit)
    .map((r) => {
      const clean = { ...r };
      delete clean.MatchScore;
      return clean;
    });
};

// ─── SYSTEM INSTRUCTIONS ──────────────────────────────────────────────────────

const SYSTEM_INSTRUCTIONS = `
You are a helpful, secure AutoVyn ERP assistant. Always reply in the SAME language as the user's question (Hindi/Hinglish/English).

═══ DATA & EMPLOYEE SEARCH RULES ═══

1. WHEN SPECIFIC ATTRIBUTES ARE ASKED (e.g., "college kya hai", "kis college se pada hai", "blood group kya hai", "pan number kya hai", "dob aur skills batao"):
- Inspect the provided databaseEvidence rows carefully. If the column (such as Emp_College, Emp_Board, Emp_Degree, Emp_Passing_year, Emp_Percentage) exists in the database row, answer DIRECTLY with that value!
- Example: "KALURAM SARAN (Code: AU19795963) ne KKC COLLAGE SARDAR SHAHAR se padhai ki hai (Degree: MSI-IT, Passing Year: 2017, Score: 65%)."
- NEVER state that college/data is missing if the value is present in databaseEvidence rows!
- Answer CONCISELY and DIRECTLY with ONLY the asked attributes along with basic identifier info (Employee Name & Code).
- DO NOT dump all 200+ unrelated table columns when the user only asked for 1 or 2 specific attributes!

2. WHEN COMPLETE STRUCTURE / FULL DETAILS ARE ASKED (e.g., "complete structure do", "saari details do", "full record do"):
- Present all relevant non-null fields clearly using clean bullet points. Filter out raw internal system noise (like ServerId, UTD, Export_Type).

3. WHEN COUNT / LIST IS ASKED (e.g., "count batao", "kiske kiske pass hai", "how many", "total new joining"):
- State the EXACT total count at the beginning (e.g., "Total matching records found: 10") matching the total rows in the database.
- Present the matching list clearly row-wise.

4. WHEN NO RECORDS ARE FOUND (rowCount = 0 or canAnswer = false):
- For count/check queries: State total count 0 in a helpful, natural message.
- For single-entity search: State politely that no matching record was found in database.

═══ DATA FORMATTING RULES ═══
- Clean, concise bullet points for requested fields.
- Preserve exact codes and numbers as returned in database rows.
- Never expose raw SQL queries, technical schema definitions, or internal keys to the user.
`.trim();

// ─── Main Export ──────────────────────────────────────────────────────────────

const generateUnifiedAnswer = exports.generateUnifiedAnswer = async ({
  message,
  mode,
  intent,
  history,
  userContext,
  documents        = [],
  databaseEvidence = null,
  route            = null,
}) => {
  const model = String(process.env.OPENAI_MODEL || "gpt-4o-mini");

  let filteredEvidence = databaseEvidence;

  if (databaseEvidence?.canAnswer && databaseEvidence.rows?.length) {
    const isListOrCount = /\b(list|count|all|latest|recent|total|kitne|kaun)\b/i.test(message);
    const maxLimit = isListOrCount ? 50 : 25;
    const filtered = filterBestMatches(databaseEvidence.rows, maxLimit);

    filteredEvidence = {
      ...databaseEvidence,
      rows:             filtered,
      rowCount:         filtered.length,
      originalRowCount: databaseEvidence.rowCount,
    };
  }

  const payload = {
    userQuestion: message,
    mode,
    intent,

    searchContext: {
      isSelfQuery:   route?.isSelfQuery   ?? false,
      isCountQuery:  route?.isCountQuery  ?? false,
      needsSalary:   route?.needsSalary   ?? false,
      needsReminder: route?.needsReminder ?? false,
    },

    authenticatedUser: {
      userCode: userContext.userCode,
      userName: userContext.userName,
      role:     userContext.role,
      company:  userContext.compcode,
    },

    recentConversation: (history ?? []).slice(-10).map((h) => ({
      role:    h.role === "user" ? "user" : "assistant",
      content: String(h.content || "").trim(),
    })),
    documentContext:    buildDocumentContext(documents),

    databaseEvidence: filteredEvidence
      ? {
          canAnswer:         filteredEvidence.canAnswer,
          rows:              filteredEvidence.rows,
          rowCount:          filteredEvidence.rowCount,
          originalRowCount:  filteredEvidence.originalRowCount ?? filteredEvidence.rowCount,
          totalRowsReturned: filteredEvidence.totalRowsReturned,
          truncated:         filteredEvidence.truncated,
          intent:            filteredEvidence.sqlPlan?.intent      ?? null,
          explanation:       filteredEvidence.sqlPlan?.explanation ?? null,
          searchMeta:        filteredEvidence.sqlPlan?.searchMeta  ?? null,
          // AI_Knowledge_Document_Tbl metadata
          tableCategory:     filteredEvidence.sqlPlan?.knowledgeMeta?.category  ?? null,
          tableName:         filteredEvidence.sqlPlan?.knowledgeMeta?.sourceName ?? null,
        }
      : null,
  };

const formatDatabaseEvidence = (rows) => {
  if (!rows || rows.length === 0) return "No records found.";
  const displayRows = rows.slice(0, 20);
  const sampleRow = displayRows[0];

  // Filter out system/noisy columns
  const noisyKeys = new Set([
    "MatchScore",
    "row_num",
    "UTD",
    "ENTR_USER",
    "ENTR_PC",
    "ENTR_TIME",
    "MOD_TIME",
    "MOD_DATE",
    "Mod_User",
    "ENTR_DATE",
  ]);

  const allKeys = Object.keys(sampleRow).filter((k) => !noisyKeys.has(k));
  const activeKeys = allKeys.filter((k) =>
    displayRows.some((r) => r[k] !== null && r[k] !== undefined && r[k] !== "")
  );

  if (activeKeys.length === 0) return "No displayable columns found.";

  // Priority sorting for human readability
  const priorityOrder = [
    "Emp_Code",
    "EMPCODE",
    "Customer_Name",
    "Customer_Mobile",
    "EmployeeName",
    "User_Name",
    "Name",
    "Reminder_Date",
    "Reminder_Type",
    "Reminder_Status",
    "Final_Due_Date",
    "Vehicle_No",
    "MobileNo",
    "Basic",
    "Gross_Salary",
    "Loc_Code",
    "Effective_date",
    "Rec_date",
  ];

  const sortedKeys = [...activeKeys].sort((a, b) => {
    const aIdx = priorityOrder.findIndex((p) => p.toLowerCase() === a.toLowerCase());
    const bIdx = priorityOrder.findIndex((p) => p.toLowerCase() === b.toLowerCase());
    if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
    if (aIdx !== -1) return -1;
    if (bIdx !== -1) return 1;
    return 0;
  });

  // Limit to top 8 most important columns for clean table view
  const tableKeys = sortedKeys.slice(0, 8);

  let md = `### 📊 Matching Record(s) Found (${rows.length}):\n\n`;
  md += `| # | ${tableKeys.map((k) => k.replace(/_/g, " ")).join(" | ")} |\n`;
  md += `|---|${tableKeys.map(() => "---").join("|")}|\n`;

  displayRows.forEach((r, idx) => {
    const vals = tableKeys.map((k) => {
      const val = r[k];
      if (val === null || val === undefined || val === "") return "-";
      if (typeof val === "object") return JSON.stringify(val);
      return String(val).replace(/\|/g, "\\|");
    });
    md += `| ${idx + 1} | ${vals.join(" | ")} |\n`;
  });

  if (rows.length > 20) {
    md += `\n*Showing top 20 of ${rows.length} records.*`;
  }
  return md;
};

  try {
    const response = await getOpenAIClient().chat.completions.create({
      model,
      messages: [
        { role: "system", content: SYSTEM_INSTRUCTIONS },
        { role: "user", content: JSON.stringify(payload) },
      ],
      max_tokens: Number(process.env.AI_FINAL_ANSWER_MAX_TOKENS || 2000),
    });

    const answer = String(response.choices[0]?.message?.content ?? "").trim();
    if (!answer) throw new ApiError(502, "AI provider returned an empty answer");

    return {
      answer,
      providerResponseId: response.id || null,
      usage: response.usage || null,
      model,
    };

  } catch (error) {
    if (databaseEvidence?.rows?.length > 0) {
      return {
        answer: formatDatabaseEvidence(databaseEvidence.rows),
        providerResponseId: null,
        usage: null,
        model: "database-evidence-rule-engine",
      };
    }
    if (error instanceof ApiError) throw error;
    if (error?.status === 429)     throw new ApiError(429, "AI request limit exceeded");
    throw new ApiError(502, error?.message || "Unable to generate AI answer");
  }
};


/**
 * SQL Result Validator Service — AutoVyn ERP AI Copilot V3
 * Validates executed SQL query results to verify row limits, requested attributes,
 * entity matches, and prevents unexpected join row multiplication.
 */

const validateSQLResult = exports.validateSQLResult = ({ sqlPlan = {}, rows = [], requestedEntity = null }) => {
  const validation = {
    valid: true,
    confidence: 0.95,
    issues: [],
  };

  if (!Array.isArray(rows)) {
    return { valid: false, confidence: 0.0, issues: ["Result is not an array"] };
  }

  // 1. Check if 0 rows returned for exact entity query
  if (rows.length === 0 && requestedEntity?.employeeCode) {
    validation.issues.push(`No database records returned for requested employee ${requestedEntity.employeeCode}`);
    validation.confidence = 0.50;
  }

  // 2. Check for unexpected row multiplication
  if (rows.length > 200) {
    validation.issues.push("Query result size exceeds safe threshold (200 rows)");
    validation.confidence = Math.min(validation.confidence, 0.70);
  }

  // 3. Verify requested employee code exists in returned rows if single entity lookup
  if (requestedEntity?.employeeCode && rows.length > 0) {
    const code = String(requestedEntity.employeeCode).toUpperCase();
    const hasMatch = rows.some((r) => {
      const rowCode = String(r.EMPCODE || r.Emp_Code || r.EmployeeCode || "").toUpperCase();
      return rowCode === code;
    });
    if (!hasMatch) {
      validation.issues.push(`Returned rows do not match requested employee code ${code}`);
      validation.confidence = 0.60;
    }
  }

  return validation;
};





/**
 * SQL Self-Correction & Repair Service — AutoVyn ERP AI Copilot V2
 * Provides bounded (max 2 attempts) safe SQL error classification and repair.
 */

/**
 * Check if a SQL error is repairable (syntax, invalid column, table alias issue)
 */
const isRepairableSQLError = exports.isRepairableSQLError = (errorMessage = "") => {
  const msg = String(errorMessage || "").toLowerCase();
  const repairablePatterns = [
    /invalid column name/i,
    /invalid object name/i,
    /ambiguous column name/i,
    /incorrect syntax near/i,
    /conversion failed/i,
    /type mismatch/i,
  ];
  return repairablePatterns.some((pattern) => pattern.test(msg));
};

/**
 * Attempt to repair a SQL statement given the error details
 */
const repairSQLStatement = exports.repairSQLStatement = ({ sql = "", error = "", schemaCandidates = [] }) => {
  if (!sql) return null;

  let repaired = String(sql);

  // Common repair 1: Replace square bracket syntax issues or double quotes
  repaired = repaired.replace(/"([^"]+)"/g, "[$1]");

  // Validate repaired SQL against security rules
  const val = validateGeneratedSQL(repaired);
  if (!val.valid) {
    console.warn("[SQLRepair] Repaired SQL failed security validation:", val.reason);
    return null;
  }

  return repaired;
};







/**
 * Entity Resolution Service — AutoVyn ERP AI Copilot V3
 * Extracts ERP entities (Employee Code, Employee Name, Mobile, Date/Month, Branch, Department)
 * and handles candidate ambiguity resolution for follow-up turns.
 */

/**
 * Extract structured entities from user question
 */
const extractEntities = exports.extractEntities = (question = "") => {
  const q = String(question || "").trim();
  const entities = {
    employeeCode: null,
    mobile: null,
    monthNum: null,
    year: null,
    keywords: [],
  };

  // 1. Employee Code (e.g. AU19795963, 1701028, 7005089)
  const empCodeMatch = q.match(/\b([A-Z]{1,4}\d{4,12})\b/i) || q.match(/\b(\d{7,12})\b/);
  if (empCodeMatch) {
    entities.employeeCode = empCodeMatch[1].toUpperCase();
  }

  // 2. Mobile number (10 digits starting 6-9)
  const mobileMatch = q.match(/\b([6-9]\d{9})\b/);
  if (mobileMatch) {
    entities.mobile = mobileMatch[1];
  }

  // 3. Month & Year
  const yearMatch = q.match(/\b(20\d{2})\b/);
  if (yearMatch) {
    entities.year = yearMatch[1];
  }

  return entities;
};

/**
 * Check if candidate employee search results are ambiguous
 */
const checkAmbiguity = exports.checkAmbiguity = (candidateRows = []) => {
  if (!Array.isArray(candidateRows) || candidateRows.length <= 1) {
    return { isAmbiguous: false, candidates: [] };
  }

  // If top candidate score is 100 and second is lower, no ambiguity
  const score1 = Number(candidateRows[0]?.MatchScore ?? 100);
  const score2 = Number(candidateRows[1]?.MatchScore ?? 0);
  if (score1 === 100 && score2 < 100) {
    return { isAmbiguous: false, candidates: [] };
  }

  const candidates = candidateRows.slice(0, 5).map((r) => ({
    employeeCode: r.EMPCODE || r.EmployeeCode,
    name: [r.EMPFIRSTNAME || r.FirstName, r.EMPLASTNAME || r.LastName].filter(Boolean).join(" "),
    department: r.SECTION || r.Emp_Dept || null,
    designation: r.EMPLOYEEDESIGNATION || r.Designation || null,
  }));

  return {
    isAmbiguous: true,
    candidates,
  };
};

/**
 * Resolve entity context from conversation history for follow-up turns
 * e.g., "kis college se pada hai", "iska asset batao", "salaries?"
 */
const resolveWorkingMemoryEntity = exports.resolveWorkingMemoryEntity = ({ question = "", history = [], workingMemory = {} }) => {
  const currentEntities = extractEntities(question);

  // If question already contains explicit employeeCode or mobile, use it directly
  if (currentEntities.employeeCode || currentEntities.mobile) {
    return {
      ...currentEntities,
      fromHistory: false,
    };
  }

  // Check existing working memory first
  if (workingMemory.employeeCode) {
    return {
      ...currentEntities,
      employeeCode: workingMemory.employeeCode,
      fromHistory: true,
    };
  }

  // Check recent conversation history for last mentioned employeeCode
  if (Array.isArray(history) && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = String(history[i]?.content || "");
      const match = msg.match(/\b([A-Z]{1,4}\d{4,12})\b/i) || msg.match(/\b(\d{7,12})\b/);
      if (match) {
        return {
          ...currentEntities,
          employeeCode: match[1].toUpperCase(),
          fromHistory: true,
        };
      }
    }
  }

  return currentEntities;
};





/**
 * Conversation Context Service — AutoVyn ERP AI Copilot V2
 * Manages working memory context (active employeeCode, month, year, module) across turns.
 */

const updateWorkingMemory = exports.updateWorkingMemory = (currentMemory = {}, newEntities = {}) => {
  const memory = { ...currentMemory };

  if (newEntities.employeeCode) {
    memory.employeeCode = newEntities.employeeCode;
  }
  if (newEntities.mobile) {
    memory.mobile = newEntities.mobile;
  }
  if (newEntities.monthNum) {
    memory.monthNum = newEntities.monthNum;
  }
  if (newEntities.year) {
    memory.year = newEntities.year;
  }

  memory.lastUpdated = new Date().toISOString();
  return memory;
};





/**
 * Query Rewrite Service — AutoVyn ERP AI Copilot V2
 * Rewrites follow-up questions using conversation context into standalone search queries.
 */



/**
 * Rewrite a user question using conversation history into a standalone query
 */
const rewriteQuery = exports.rewriteQuery = ({ question = "", history = [], workingMemory = {} }) => {
  const q = String(question || "").trim();
  if (!q) return q;

  const resolved = resolveWorkingMemoryEntity({ question: q, history, workingMemory });

  // If query is a follow-up and we resolved an employeeCode from history
  if (resolved.fromHistory && resolved.employeeCode) {
    const isFollowup = /\b(iska|iski|usuka|uski|yahi|yhi|same|this|above|pada|padha|college|degree|asset|gadi|salary)\b/i.test(q);
    if (isFollowup) {
      return `Employee ${resolved.employeeCode}: ${q}`;
    }
  }

  return q;
};





const splitLargeBlock = (text, maxLength) => {
  const parts = [];
  let cursor = 0;
  while (cursor < text.length) {
    let end = Math.min(cursor + maxLength, text.length);
    if (end < text.length) {
      const boundary = Math.max(
        text.lastIndexOf(". ", end),
        text.lastIndexOf("\n", end),
        text.lastIndexOf(" ", end)
      );
      if (boundary > cursor + maxLength * 0.55) end = boundary + 1;
    }
    const part = text.slice(cursor, end).trim();
    if (part) parts.push(part);
    cursor = end;
  }
  return parts;
};

const looksLikeHeading = (line) => {
  const value = line.trim();
  if (!value || value.length > 160) return false;
  if (/^(chapter|section|policy|procedure|annexure|appendix)\b/i.test(value)) return true;
  if (/^\d+(\.\d+)*[.)]?\s+\S+/.test(value)) return true;
  if (value === value.toUpperCase() && /[A-Z]/.test(value)) return true;
  return false;
};

const createDocumentChunks = exports.createDocumentChunks = (content, options = {}) => {
  const chunkSize = Number(options.chunkSize || process.env.AI_CHUNK_SIZE || 1800);
  const overlap = Number(options.overlap || process.env.AI_CHUNK_OVERLAP || 250);
  const text = normalizeText(content);
  if (!text) return [];

  const lines = text.split("\n");
  const sections = [];
  let currentHeading = "Document";
  let currentBody = [];

  const flush = () => {
    const body = currentBody.join("\n").trim();
    if (body) sections.push({ heading: currentHeading, body });
    currentBody = [];
  };

  for (const line of lines) {
    if (looksLikeHeading(line)) {
      flush();
      currentHeading = line.trim();
    } else {
      currentBody.push(line);
    }
  }
  flush();

  const chunks = [];
  for (const section of sections) {
    const blocks = splitLargeBlock(section.body, chunkSize);
    for (let index = 0; index < blocks.length; index += 1) {
      const previous = index > 0 ? blocks[index - 1].slice(-overlap).trim() : "";
      const contentWithContext = [
        `Section: ${section.heading}`,
        previous ? `Previous context: ${previous}` : "",
        blocks[index],
      ].filter(Boolean).join("\n\n");

      chunks.push({
        index: chunks.length,
        section: section.heading,
        content: contentWithContext,
        characterCount: contentWithContext.length,
        tokenEstimate: Math.ceil(contentWithContext.length / 4),
      });
    }
  }

  return chunks;
};




const assertFileSize = (buffer) => {
  const maxMb = Math.max(1, Math.min(Number(process.env.AI_MAX_FILE_SIZE_MB || 25), 200));
  if (buffer.length > maxMb * 1024 * 1024) {
    throw new ApiError(413, `Document is too large. Maximum ${maxMb} MB is allowed`);
  }
};

const isInside = (root, target) => {
  const relative = path.relative(root, target);
  return relative && !relative.startsWith("..") && !path.isAbsolute(relative);
};

const loadExistingUploadedFile = exports.loadExistingUploadedFile = async ({ document, req }) => {
  const storedPath = String(document.File_Path || document.Source_Reference || "").trim();
  if (!storedPath) throw new ApiError(422, "Document file path is unavailable");

  const uploadRoot = path.resolve(process.env.FILE_UPLOAD_ROOT || process.cwd());
  const absolutePath = path.resolve(uploadRoot, storedPath.replace(/^[/\\]+/, ""));

  if (isInside(uploadRoot, absolutePath)) {
    try {
      const buffer = await fs.readFile(absolutePath);
      assertFileSize(buffer);
      return { buffer, filePath: absolutePath, source: "DISK" };
    } catch (error) {
      if (error instanceof ApiError) throw error;
    }
  }

  const baseURL = String(process.env.FILE_GET_API_BASE_URL || "").trim();
  if (!baseURL) throw new ApiError(404, "Uploaded document file was not found");

  const url = `${baseURL.replace(/\/$/, "")}/${encodeURIComponent(document.UTD)}`;
  try {
    const response = await axios.get(url, {
      responseType: "arraybuffer",
      headers: {
        compcode: req.user?.compcode || req.headers.compcode,
        authorization: req.headers.authorization,
      },
      timeout: Number(process.env.FILE_GET_API_TIMEOUT_MS || 30000),
      maxContentLength: Number(process.env.AI_MAX_FILE_SIZE_MB || 25) * 1024 * 1024,
    });
    const buffer = Buffer.from(response.data);
    assertFileSize(buffer);
    return { buffer, filePath: storedPath, source: "API" };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error?.response?.status === 404) throw new ApiError(404, "Uploaded document file was not found");
    throw new ApiError(502, "Unable to retrieve the uploaded document");
  }
};










const parsePDF = async (buffer) => {
  const module = await import("pdf-parse");
  const pdfParse = module.default || module;
  const result = await pdfParse(buffer);
  return { text: result.text || "", pageCount: result.numpages || null };
};

const parseDOCX = async (buffer) => {
  const mammoth = await import("mammoth");
  const result = await mammoth.extractRawText({ buffer });
  return { text: result.value || "", pageCount: null };
};

const parseXLSX = async (buffer) => {
  const XLSX = await import("xlsx");
  const workbook = XLSX.read(buffer, { type: "buffer", cellDates: true });
  const parts = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    const csv = XLSX.utils.sheet_to_csv(sheet, { blankrows: false });
    parts.push(`Sheet: ${sheetName}\n${csv}`);
  }
  return { text: parts.join("\n\n"), pageCount: workbook.SheetNames.length };
};

const parseHTML = async (buffer) => {
  const cheerio = await import("cheerio");
  const $ = cheerio.load(buffer.toString("utf8"));
  $("script, style, noscript").remove();
  return { text: $("body").text(), pageCount: null };
};

const parseDocumentBuffer = exports.parseDocumentBuffer = async ({ buffer, extension }) => {
  const ext = String(extension || "").toLowerCase().replace(/^\./, "");
  let result;

  switch (ext) {
    case "pdf": result = await parsePDF(buffer); break;
    case "docx": result = await parseDOCX(buffer); break;
    case "xlsx":
    case "xls": result = await parseXLSX(buffer); break;
    case "html":
    case "htm": result = await parseHTML(buffer); break;
    case "txt":
    case "csv":
    case "json": result = { text: buffer.toString("utf8"), pageCount: null }; break;
    default: throw new ApiError(415, `Unsupported document type: ${ext || "unknown"}`);
  }

  const text = normalizeText(result.text);
  if (!text) throw new ApiError(422, "No searchable text was found in the document");
  return { ...result, text };
};

const parseDocumentFile = exports.parseDocumentFile = async (filePath) => {
  const buffer = await fs.readFile(filePath);
  const extension = path.extname(filePath);
  return parseDocumentBuffer({ buffer, extension });
};





const NAMESPACE = "93f4188e-4fb3-47ec-9f5e-c0efc17768aa";

// const normalizeValue = (v) => String(v ?? "").trim();

const parseRoleFlags = (value) => {
  if (Array.isArray(value)) {
    return [...new Set(value.map((x) => Number(x)).filter(Number.isFinite))].sort((a, b) => a - b);
  }
  const str = normalizeValue(value);
  if (!str) return [];
  return [...new Set(
    str
      .split(",")
      .map((item) => Number(item.trim()))
      .filter(Number.isFinite)
  )].sort((a, b) => a - b);
};

const getDocumentMeta = (document) => {
  // Try common metadata columns; tolerate different schemas
  const raw =
    safeJSONParse(document?.Metadata_JSON, null) ||
    safeJSONParse(document?.metadata, null) ||
    safeJSONParse(document?.MetaData_JSON, null) ||
    {};

  return {
    primaryKey: normalizeValue(raw.primaryKey || raw.PrimaryKey || ""),
    joinKey: normalizeValue(raw.joinKey || raw.JoinKey || ""),
    category: normalizeValue(raw.category || raw.Category || ""),
  };
};

const resolveDocumentText = async ({ document, req }) => {
  // Prefer Content if present (helps TABLE_SCHEMA docs with no file)
  const inline = normalizeValue(document?.Content);
  if (inline) {
    return {
      text: inline,
      pageCount: null,
      extension: normalizeValue(document?.File_Extension || "").replace(/^\./, "").toLowerCase() || null,
      filePath: normalizeValue(document?.File_Path || document?.Source_Reference || "") || null,
      from: "INLINE_CONTENT",
    };
  }

  // Else fallback to uploaded file
  const { buffer, filePath } = await loadExistingUploadedFile({ document, req });

  const extension =
    normalizeValue(document?.File_Extension) ||
    path.extname(filePath || document?.File_Path || document?.Source_Reference || document?.Source_Name || "");

  const parsed = await parseDocumentBuffer({ buffer, extension });

  return {
    text: parsed.text || "",
    pageCount: parsed.pageCount ?? null,
    extension: String(extension || "").replace(/^\./, "").toLowerCase(),
    filePath: filePath || document?.File_Path || document?.Source_Reference || null,
    from: "FILE",
  };
};

/**
 * Index one existing document into Qdrant.
 * - Requires ADMIN (roleFlag 1/2)
 * - Reads SQL doc row
 * - Builds chunks
 * - Generates embeddings
 * - Upserts points to Qdrant
 * - Updates AI_Knowledge_Document_Tbl RAG fields
 */
const indexExistingDocument = exports.indexExistingDocument = async ({ req, documentId, force = false }) => {
  const user = buildUserContext(req);

  if (![1, 2].includes(Number(user.roleFlag))) {
    throw new ApiError(403, "Only administrators can index knowledge documents");
  }

  const docIdNum = Number(documentId);
  if (!Number.isInteger(docIdNum) || docIdNum <= 0) {
    throw new ApiError(400, "Valid documentId is required");
  }

  const sequelize = await dbname(req, user.compcode);
  if (!sequelize?.query) throw new ApiError(500, "Database connection failed");

  await ensureKnowledgeCollection();

  const documents = await sequelize.query(
    `
    SELECT TOP 1 *
    FROM [dbo].[AI_Knowledge_Document_Tbl]
    WHERE [UTD] = :documentId AND [Comp_Code] = :compCode
    `,
    {
      replacements: { documentId: docIdNum, compCode: user.compcode },
      type: QueryTypes.SELECT,
    }
  );

  const document = documents?.[0];
  if (!document) throw new ApiError(404, "Knowledge document was not found");

  const currentStatus = String(document.RAG_Status || "").toUpperCase();
  if (!force && currentStatus === "COMPLETED") {
    return { documentId: docIdNum, status: "COMPLETED", alreadyIndexed: true };
  }

  // Mark processing
  await sequelize.query(
    `
    UPDATE [dbo].[AI_Knowledge_Document_Tbl]
    SET [RAG_Status] = 'PROCESSING', [RAG_Error] = NULL
    WHERE [UTD] = :documentId
    `,
    { replacements: { documentId: docIdNum } }
  );

  try {
    // Load text (inline Content or file)
    const resolved = await resolveDocumentText({ document, req });

    // Auto-enrich TABLE_SCHEMA / VIEW documents with live database schema
    const isSchemaLike = ["TABLE_SCHEMA", "VIEW"].includes(String(document.Document_Type || "").toUpperCase());
    if (isSchemaLike && (document.Source_Reference || document.Source_Name)) {
      try {
        const ref = String(document.Source_Reference || document.Source_Name).replace(/[\[\]]/g, "").split(".").filter(Boolean);
        const schemaName = ref.length === 2 ? ref[0] : "dbo";
        const tableName = ref.length === 2 ? ref[1] : ref[0] || document.Source_Name;

        const { getDatabaseTables, buildTableSchemaContent } = await import("../schema/databaseSchemaService.js");
        const tables = await getDatabaseTables({ sequelize, tableNames: [tableName] });
        if (tables.length > 0) {
          const liveSchemaText = await buildTableSchemaContent({
            sequelize,
            schemaName: tables[0].TABLE_SCHEMA,
            tableName: tables[0].TABLE_NAME,
            tableType: tables[0].TABLE_TYPE,
          });

          const docMeta = getDocumentMeta(document);
          const metaInfo = [
            docMeta.primaryKey ? `Primary Key: ${docMeta.primaryKey}` : null,
            docMeta.joinKey ? `Join Key: ${docMeta.joinKey}` : null,
            docMeta.category ? `Category: ${docMeta.category}` : null,
          ].filter(Boolean).join(" | ");

          resolved.text = [
            `Title: ${document.Title || document.Source_Name}`,
            `Purpose/Description:\n${resolved.text || "Database table schema"}`,
            metaInfo ? `Metadata: ${metaInfo}` : null,
            liveSchemaText,
          ].filter(Boolean).join("\n\n---\n\n");
        }
      } catch (enrichErr) {
        console.warn("[Ingestion] Live schema auto-enrichment skipped:", enrichErr?.message);
      }
    }

    const text = normalizeValue(resolved.text);

    const chunks = createDocumentChunks(text);
    if (!chunks?.length) throw new ApiError(422, "No chunks were produced");

    // Embeddings
    const embeddingResult = await generateEmbeddingsBatch(chunks.map((item) => item.content));
    const embeddings = embeddingResult.embeddings;

    if (!Array.isArray(embeddings) || embeddings.length !== chunks.length) {
      throw new ApiError(502, "Embedding batch returned incomplete embeddings");
    }

    // Versioning (increment on force)
    const prevVersion = Number(document.RAG_Index_Version || 0);
    const indexVersion = Math.max(1, prevVersion + (force ? 1 : 0));

    const allowedRoleFlags = parseRoleFlags(document.Allowed_Role_Flags);

    // Optional: deactivate old points for this document
    if (force) {
      await deactivateDocumentPoints({ compCode: user.compcode, documentId: docIdNum });
    }

    const docMeta = getDocumentMeta(document);

    const moduleName = normalizeValue(document.Module_Name || "GENERAL");
    const documentType = normalizeValue(document.Document_Type || "DOCUMENT");
    const title = normalizeValue(document.Title || document.Source_Name || `Document ${docIdNum}`);

    const sourceName = normalizeValue(document.Source_Name || "") || null;
    const sourceReference = normalizeValue(document.Source_Reference || document.File_Path || "") || null;

    const fileExtension =
      normalizeValue(document.File_Extension || resolved.extension || "")
        .replace(/^\./, "")
        .toLowerCase() || null;

    const filePath =
      normalizeValue(document.File_Path || resolved.filePath || document.Source_Reference || "") || null;

    const branchCode = normalizeValue(document.Branch_Code || "") || null;

    // Build Qdrant points
    const points = chunks.map((chunk, index) => ({
      id: uuidv5(`${user.compcode}:${docIdNum}:${indexVersion}:${chunk.index}`, NAMESPACE),
      vector: { dense: embeddings[index] },
      payload: {
        // Required filters
        documentId: docIdNum,
        compCode: user.compcode,
        moduleName,
        documentType,
        branchCode,
        allowedRoleFlags,
        isActive: true,
        indexVersion,

        // Search/debug fields (make sure qdrant indexes exist)
        title,
        sourceName,
        sourceReference,
        category: docMeta.category || null,

        // File fields
        filePath,
        fileExtension,

        // Chunk fields
        section: chunk.section || null,
        chunkIndex: chunk.index,
        pageNumber: chunk.pageNumber ?? null,
        tokenEstimate: chunk.tokenEstimate ?? null,

        // Main content
        content: chunk.content,

        // Optional extra metadata (helps downstream SQL planner / UI)
        metadata: {
          primaryKey: docMeta.primaryKey || "",
          joinKey: docMeta.joinKey || "",
          category: docMeta.category || "",
          ingestedFrom: resolved.from,
          embeddingModel: embeddingResult.model || null,
        },
      },
    }));

    // Upsert in batches
    const batchSize = Math.max(20, Math.min(Number(process.env.QDRANT_UPSERT_BATCH_SIZE || 100), 300));
    for (let offset = 0; offset < points.length; offset += batchSize) {
      await upsertKnowledgePoints(points.slice(offset, offset + batchSize));
    }

    // Update document row
    await sequelize.query(
      `
      UPDATE [dbo].[AI_Knowledge_Document_Tbl]
      SET
        [RAG_Status]       = 'COMPLETED',
        [RAG_Error]        = NULL,
        [RAG_Chunk_Count]  = :chunkCount,
        [RAG_Processed_At] = SYSDATETIME(),
        [RAG_Index_Version]= :indexVersion
      WHERE [UTD] = :documentId
      `,
      {
        replacements: {
          documentId: docIdNum,
          chunkCount: chunks.length,
          indexVersion,
        },
      }
    );

    return {
      documentId: docIdNum,
      status: "COMPLETED",
      alreadyIndexed: false,
      chunkCount: chunks.length,
      pageCount: resolved.pageCount,
      indexVersion,
      embeddingModel: embeddingResult.model,
      embeddingTokens: embeddingResult.usage?.total_tokens || 0,
      source: resolved.from,
    };
  } catch (error) {
    await sequelize.query(
      `
      UPDATE [dbo].[AI_Knowledge_Document_Tbl]
      SET [RAG_Status] = 'FAILED', [RAG_Error] = :error
      WHERE [UTD] = :documentId
      `,
      {
        replacements: {
          documentId: docIdNum,
          error: String(error?.message || "Indexing failed").slice(0, 4000),
        },
      }
    );
    throw error;
  }
};






const getKnowledgeDocumentStatus = exports.getKnowledgeDocumentStatus = async ({ req, documentId }) => {
  const user = buildUserContext(req);
  const sequelize = await dbname(req, user.compcode);
  const rows = await sequelize.query(
    `SELECT TOP 1 [UTD], [Title], [Module_Name], [Document_Type], [Source_Name], [Source_Reference],
            [RAG_Status], [RAG_Error], [RAG_Chunk_Count], [RAG_Processed_At], [RAG_Index_Version], [Is_Active]
       FROM [dbo].[AI_Knowledge_Document_Tbl]
      WHERE [UTD] = :documentId AND [Comp_Code] = :compCode`,
    { replacements: { documentId, compCode: user.compcode }, type: QueryTypes.SELECT }
  );
  if (!rows.length) throw new ApiError(404, "Knowledge document was not found");
  return rows[0];
};

const deactivateKnowledgeDocument = exports.deactivateKnowledgeDocument = async ({ req, documentId, hardDelete = false }) => {
  const user = buildUserContext(req);
  if (![1, 2].includes(Number(user.roleFlag))) throw new ApiError(403, "Only administrators can deactivate knowledge documents");
  const sequelize = await dbname(req, user.compcode);

  const existing = await sequelize.query(
    `SELECT TOP 1 [UTD] FROM [dbo].[AI_Knowledge_Document_Tbl]
      WHERE [UTD] = :documentId AND [Comp_Code] = :compCode AND [Is_Active] = 1`,
    { replacements: { documentId, compCode: user.compcode }, type: QueryTypes.SELECT }
  );
  if (!existing.length) throw new ApiError(404, "Active knowledge document was not found");

  await sequelize.query(
    `UPDATE [dbo].[AI_Knowledge_Document_Tbl]
        SET [Is_Active] = 0, [RAG_Status] = 'INACTIVE', [Updated_By] = :updatedBy, [Updated_At] = SYSDATETIME()
      WHERE [UTD] = :documentId AND [Comp_Code] = :compCode`,
    { replacements: { documentId, compCode: user.compcode, updatedBy: user.userCode || String(user.userId || "") } }
  );
  if (hardDelete) await deleteDocumentPoints({ compCode: user.compcode, documentId });
  else await deactivateDocumentPoints({ compCode: user.compcode, documentId });
  return { documentId, status: "INACTIVE", vectorsDeleted: hardDelete };
};











const QDRANT_UUID_NAMESPACE = "2d597f81-745a-47c6-a714-98f548f8af57";

const ALLOWED_DOCUMENT_TYPES = new Set([
  "TABLE_SCHEMA",
  "STATUS_MAPPING",
  "DATABASE_RELATION",
  "BUSINESS_RULE",
  "VIEW",
  "STORED_PROCEDURE",
  "POLICY",
  "SOP",
  "MANUAL",
  "DOCUMENT",
]);

// const normalizeValue = (value) => String(value ?? "").trim();
const normalizeNullableValue = (value) => normalizeValue(value) || null;

const normalizeBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) return defaultValue;
  if (value === true || value === 1 || value === "1") return true;
  return String(value).trim().toLowerCase() === "true";
};

const normalizeRoleFlags = (value) => {
  const values = Array.isArray(value) ? value : String(value ?? "").split(",");
  return [
    ...new Set(
      values
        .map((item) => Number(String(item).trim()))
        .filter((item) => Number.isFinite(item))
    ),
  ];
};

const getLoginUser = (userContext) =>
  normalizeValue(userContext.numericUserId ?? userContext.userId ?? userContext.userCode);

const assertAdministrator = (userContext) => {
  const roleFlag = Number(userContext.roleFlag ?? 0);
  if (![1, 2].includes(roleFlag)) {
    throw new ApiError(403, "Only administrators can create AI knowledge");
  }
};

const validatePayload = (payload) => {
  const moduleName = normalizeValue(payload.moduleName).toUpperCase();
  const documentType = normalizeValue(payload.documentType).toUpperCase();
  const title = normalizeValue(payload.title);
  const sourceName = normalizeValue(payload.sourceName);
  const sourceReference = normalizeValue(payload.sourceReference);
  const content = normalizeValue(payload.content);

  if (!moduleName) throw new ApiError(400, "moduleName is required");
  if (!documentType) throw new ApiError(400, "documentType is required");
  if (!ALLOWED_DOCUMENT_TYPES.has(documentType))
    throw new ApiError(400, `Unsupported documentType: ${documentType}`);
  if (!title) throw new ApiError(400, "title is required");
  if (!sourceName) throw new ApiError(400, "sourceName is required");
  if (!sourceReference) throw new ApiError(400, "sourceReference is required");

  const isSchemaLike = ["TABLE_SCHEMA", "VIEW"].includes(documentType);
  if (!content && !isSchemaLike) {
    throw new ApiError(400, "content is required");
  }
  if (content.length > 500000) {
    throw new ApiError(400, "content is too large. Maximum 500000 characters are allowed");
  }

  return {
    moduleName,
    documentType,
    title,
    sourceName,
    sourceReference,
    content,
    replaceExisting: normalizeBoolean(payload.replaceExisting, true),
    branchCode: normalizeNullableValue(payload.branchCode),
    allowedRoleFlags: normalizeRoleFlags(payload.allowedRoleFlags),
    metadata:
      payload.metadata && typeof payload.metadata === "object" && !Array.isArray(payload.metadata)
        ? payload.metadata
        : {},
  };
};

/**
 * Minimal input se live DB schema nikaal kar user ke content ke saath
 * merge karta hai. TABLE_SCHEMA / VIEW documentType ke liye hi chalta hai.
 */
const autoEnrichContentWithLiveSchema = async ({ sequelize, values }) => {
  const isSchemaLike = ["TABLE_SCHEMA", "VIEW"].includes(values.documentType);
  if (!isSchemaLike) return values.content;

  const parts = values.sourceReference.replace(/[\[\]]/g, "").split(".").filter(Boolean);
  const schemaName = parts.length === 2 ? parts[0] : "dbo";
  const tableName = parts.length === 2 ? parts[1] : parts[0] || values.sourceName;

  try {
    const tables = await getDatabaseTables({ sequelize, tableNames: [tableName] });
    if (!tables.length) {
      return (
        values.content ||
        `Table: ${values.sourceReference}\n\nNo live schema found. Manual description only.`
      );
    }

    const liveSchemaText = await buildTableSchemaContent({
      sequelize,
      schemaName: tables[0].TABLE_SCHEMA,
      tableName: tables[0].TABLE_NAME,
      tableType: tables[0].TABLE_TYPE,
    });

    const userPurpose = values.content ? `Business Purpose (user provided):\n${values.content}` : "";
    return [userPurpose, liveSchemaText].filter(Boolean).join("\n\n---\n\n");
  } catch (error) {
    console.error("Auto schema enrichment failed:", {
      table: values.sourceReference,
      message: error?.message,
    });
    return (
      values.content ||
      `Table: ${values.sourceReference}\n\nSchema auto-enrichment failed: ${error?.message || "unknown error"}`
    );
  }
};

const findExistingDocument = async ({
  sequelize, compCode, moduleName, documentType, sourceReference, transaction,
}) => {
  const rows = await sequelize.query(
    `SELECT TOP 1 [UTD],[Title],[Source_Name],[Source_Reference]
     FROM [dbo].[AI_Knowledge_Document_Tbl]
     WHERE [Comp_Code]=:compCode AND [Module_Name]=:moduleName AND [Document_Type]=:documentType
       AND [Source_Reference]=:sourceReference AND [Is_Active]=1
     ORDER BY [UTD] DESC`,
    { replacements: { compCode, moduleName, documentType, sourceReference }, type: QueryTypes.SELECT, transaction }
  );
  return rows?.[0] || null;
};

const insertKnowledgeDocument = async ({ sequelize, compCode, values, loginUser, transaction }) => {
  const result = await sequelize.query(
    `INSERT INTO [dbo].[AI_Knowledge_Document_Tbl]
     ([Comp_Code],[Module_Name],[Document_Type],[Title],[Source_Name],[Source_Reference],[Content],[Is_Active],[Created_By],[Created_At])
     OUTPUT INSERTED.[UTD] AS [DocumentId]
     VALUES (:compCode,:moduleName,:documentType,:title,:sourceName,:sourceReference,:content,1,:createdBy,GETDATE())`,
    {
      replacements: {
        compCode, moduleName: values.moduleName, documentType: values.documentType,
        title: values.title, sourceName: values.sourceName, sourceReference: values.sourceReference,
        content: values.content, createdBy: loginUser,
      },
      type: QueryTypes.SELECT, transaction,
    }
  );
  const documentId = Number(result?.[0]?.DocumentId);
  if (!Number.isSafeInteger(documentId) || documentId <= 0) {
    throw new ApiError(500, "Knowledge document could not be created");
  }
  return documentId;
};

const updateKnowledgeDocument = async ({ sequelize, documentId, values, loginUser, transaction }) => {
  await sequelize.query(
    `UPDATE [dbo].[AI_Knowledge_Document_Tbl]
     SET [Title]=:title,[Source_Name]=:sourceName,[Content]=:content,[Updated_By]=:updatedBy,[Updated_At]=GETDATE(),[Is_Active]=1
     WHERE [UTD]=:documentId`,
    { replacements: { documentId, title: values.title, sourceName: values.sourceName, content: values.content, updatedBy: loginUser }, transaction }
  );
  await sequelize.query(
    `UPDATE [dbo].[AI_Knowledge_Chunk_Tbl] SET [Is_Active]=0,[Updated_By]=:updatedBy,[Updated_At]=GETDATE()
     WHERE [Document_UTD]=:documentId AND [Is_Active]=1`,
    { replacements: { documentId, updatedBy: loginUser }, transaction }
  );
};

const insertKnowledgeChunks = async ({
  sequelize, documentId, compCode, values, chunks, embeddings, embeddingModel, loginUser, indexVersion, transaction,
}) => {
  for (let index = 0; index < chunks.length; index += 1) {
    const chunk = chunks[index];
    const embedding = embeddings[index];
    const metadata = {
      ...values.metadata, title: values.title, moduleName: values.moduleName, documentType: values.documentType,
      sourceName: values.sourceName, sourceReference: values.sourceReference, branchCode: values.branchCode,
      allowedRoleFlags: values.allowedRoleFlags, section: chunk.section, embeddingModel, indexVersion,
    };
    await sequelize.query(
      `INSERT INTO [dbo].[AI_Knowledge_Chunk_Tbl]
       ([Document_UTD],[Comp_Code],[Module_Name],[Chunk_Index],[Chunk_Content],[Embedding_JSON],[Token_Count],[Metadata_JSON],[Is_Active],[Created_By],[Created_At])
       VALUES (:documentId,:compCode,:moduleName,:chunkIndex,:chunkContent,:embeddingJSON,:tokenCount,:metadataJSON,1,:createdBy,GETDATE())`,
      {
        replacements: {
          documentId, compCode, moduleName: values.moduleName, chunkIndex: chunk.index, chunkContent: chunk.content,
          embeddingJSON: JSON.stringify(embedding), tokenCount: chunk.tokenEstimate, metadataJSON: JSON.stringify(metadata), createdBy: loginUser,
        },
        transaction,
      }
    );
  }
};

const buildQdrantPoints = ({ documentId, compCode, values, chunks, embeddings, indexVersion }) =>
  chunks.map((chunk, index) => ({
    id: uuidv5([compCode, documentId, indexVersion, chunk.index].join(":"), QDRANT_UUID_NAMESPACE),
    vector: { dense: embeddings[index] },
    payload: {
      documentId, compCode, moduleName: values.moduleName, documentType: values.documentType, title: values.title,
      sourceName: values.sourceName, sourceReference: values.sourceReference, section: chunk.section, chunkIndex: chunk.index,
      pageNumber: null, branchCode: values.branchCode, allowedRoleFlags: values.allowedRoleFlags, isActive: true,
      indexVersion, content: chunk.content, tokenEstimate: chunk.tokenEstimate, metadata: values.metadata,
    },
  }));

const saveManualKnowledge = exports.saveManualKnowledge = async ({ req, payload = {} }) => {
  const userContext = buildUserContext(req);
  assertAdministrator(userContext);

  const values = validatePayload(payload);
  const compCode = userContext.compcode;
  const loginUser = getLoginUser(userContext);
  const sequelize = await dbname(req, compCode);

  if (!sequelize || typeof sequelize.query !== "function") {
    throw new ApiError(500, "Database connection could not be created");
  }

  values.content = await autoEnrichContentWithLiveSchema({ sequelize, values });
  if (!values.content) {
    throw new ApiError(400, "content is required and could not be auto-generated");
  }

  try {
    await ensureKnowledgeCollection();
  } catch (qErr) {
    console.warn("Qdrant skipped in manualKnowledgeService:", qErr?.message);
  }

  const chunks = createDocumentChunks(values.content, {
    chunkSize: Number(process.env.AI_CHUNK_SIZE || 1800),
    overlap: Number(process.env.AI_CHUNK_OVERLAP || 250),
  });
  if (!Array.isArray(chunks) || chunks.length === 0) {
    throw new ApiError(422, "No searchable chunks could be created");
  }

  let embeddingResult = { embeddings: chunks.map(() => []), model: "fallback", usage: {} };
  try {
    embeddingResult = await generateEmbeddingsBatch(chunks.map((chunk) => chunk.content));
  } catch (eErr) {
    console.warn("Embeddings generation skipped:", eErr?.message);
  }
  const embeddings = embeddingResult.embeddings || chunks.map(() => []);

  const indexVersion = Date.now();
  const transaction = await sequelize.transaction();
  let documentId = null;
  let replaced = false;
  let qdrantUpdated = false;

  try {
    const existingDocument = await findExistingDocument({
      sequelize, compCode, moduleName: values.moduleName, documentType: values.documentType,
      sourceReference: values.sourceReference, transaction,
    });

    if (existingDocument && !values.replaceExisting) {
      throw new ApiError(409, "Knowledge document already exists. Use replaceExisting=true to update it");
    }

    if (existingDocument) {
      documentId = Number(existingDocument.UTD);
      replaced = true;
      await updateKnowledgeDocument({ sequelize, documentId, values, loginUser, transaction });
    } else {
      documentId = await insertKnowledgeDocument({ sequelize, compCode, values, loginUser, transaction });
    }

    await insertKnowledgeChunks({
      sequelize, documentId, compCode, values, chunks, embeddings,
      embeddingModel: embeddingResult.model, loginUser, indexVersion, transaction,
    });

    try {
      if (replaced) {
        await deactivateDocumentPoints({ compCode, documentId });
      }

      const qdrantPoints = buildQdrantPoints({ documentId, compCode, values, chunks, embeddings, indexVersion });
      const qdrantBatchSize = 100;
      for (let offset = 0; offset < qdrantPoints.length; offset += qdrantBatchSize) {
        await upsertKnowledgePoints(qdrantPoints.slice(offset, offset + qdrantBatchSize));
      }
      qdrantUpdated = true;
    } catch (qdrantErr) {
      console.warn("Qdrant point sync skipped:", qdrantErr?.message);
    }

    await transaction.commit();

    return {
      documentId, compCode, moduleName: values.moduleName, documentType: values.documentType, title: values.title,
      sourceName: values.sourceName, sourceReference: values.sourceReference, branchCode: values.branchCode,
      allowedRoleFlags: values.allowedRoleFlags, chunkCount: chunks.length, embeddingModel: embeddingResult.model,
      embeddingTokens: Number(embeddingResult.usage?.total_tokens || 0), indexVersion, replaced,
      vectorStore: "QDRANT", status: "COMPLETED",
      autoEnriched: ["TABLE_SCHEMA", "VIEW"].includes(values.documentType),
    };
  } catch (error) {
    if (!transaction.finished) await transaction.rollback();
    if (qdrantUpdated && documentId) {
      try {
        await deactivateDocumentPoints({ compCode, documentId });
      } catch (cleanupError) {
        console.error("Qdrant cleanup failed:", { documentId, message: cleanupError?.message });
      }
    }
    if (error instanceof ApiError) throw error;
    console.error("Manual knowledge save error:", { message: error?.message, name: error?.name, documentId });
    throw new ApiError(500, "Unable to save AI knowledge");
  }
};








let qdrantClientInstance = null;
let ready = false;
let initPromise = null;

const getQdrantClient = exports.getQdrantClient = () => {
  const url = String(process.env.QDRANT_URL || "").trim();
  const apiKey = String(process.env.QDRANT_API_KEY || "").trim();

  if (!url) throw new ApiError(500, "QDRANT_URL is not configured");
  if (!apiKey) throw new ApiError(500, "QDRANT_API_KEY is not configured");

  if (!qdrantClientInstance) {
    const QdrantClass = getQdrantSDK();
    if (!QdrantClass || typeof QdrantClass !== "function") {
      throw new ApiError(500, "Qdrant SDK is not installed or available in the environment");
    }
    qdrantClientInstance = new QdrantClass({
      url,
      apiKey,
      timeout: Number(process.env.QDRANT_TIMEOUT_MS || 30000),
    });
  }
  return qdrantClientInstance;
};

const getKnowledgeCollectionName = exports.getKnowledgeCollectionName = () =>
  String(process.env.QDRANT_COLLECTION || "autovyn_erp_knowledge").trim();

const getEmbeddingDimensions = exports.getEmbeddingDimensions = () =>
  toPositiveInt(process.env.OPENAI_EMBEDDING_DIMENSIONS, 1536, 4096);

const ensureKnowledgeCollection = exports.ensureKnowledgeCollection = async () => {
  if (ready) return getKnowledgeCollectionName();
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const q = getQdrantClient();
    const name = getKnowledgeCollectionName();
    const dims = getEmbeddingDimensions();

    const collections = await q.getCollections();

    if (!collections.collections?.some((x) => x.name === name)) {
      await q.createCollection(name, {
        vectors: {
          dense: { size: dims, distance: "Cosine", on_disk: true },
        },
        on_disk_payload: true,
      });
    } else {
      const info = await q.getCollection(name);
      const size = info?.config?.params?.vectors?.dense?.size;
      if (size && Number(size) !== dims) {
        throw new ApiError(
          500,
          `Qdrant collection vector size ${size} does not match OPENAI_EMBEDDING_DIMENSIONS ${dims}. ` +
            `Use a new collection name or re-create the collection.`
        );
      }
    }

    // Payload indexes for fast filtering + hint lookups
    const indexes = [
      ["compCode", "keyword"],
      ["moduleName", "keyword"],
      ["documentType", "keyword"],
      ["documentId", "integer"],
      ["branchCode", "keyword"],
      ["allowedRoleFlags", "integer"],
      ["isActive", "bool"],
      ["indexVersion", "integer"],

      // NEW (recommended): helps forced hint-table inclusion / debugging
      ["sourceReference", "keyword"],
      ["sourceName", "keyword"],
      ["title", "keyword"],
      ["category", "keyword"],
    ];

    for (const [field_name, field_schema] of indexes) {
      try {
        await q.createPayloadIndex(name, {
          field_name,
          field_schema,
          wait: true,
        });
      } catch (e) {
        const msg = String(e?.message || "");
        if (!/already exists|conflict/i.test(msg)) throw e;
      }
    }

    ready = true;
    return name;
  })();

  try {
    return await initPromise;
  } finally {
    initPromise = null;
  }
};

const upsertKnowledgePoints = exports.upsertKnowledgePoints = async (points) => {
  if (!points?.length) return;
  await ensureKnowledgeCollection();
  await getQdrantClient().upsert(getKnowledgeCollectionName(), { wait: true, points });
};

const deactivateDocumentPoints = exports.deactivateDocumentPoints = async ({ compCode, documentId }) => {
  await ensureKnowledgeCollection();
  await getQdrantClient().setPayload(getKnowledgeCollectionName(), {
    wait: true,
    payload: { isActive: false },
    filter: {
      must: [
        { key: "compCode", match: { value: compCode } },
        { key: "documentId", match: { value: Number(documentId) } },
      ],
    },
  });
};

const deleteDocumentPoints = exports.deleteDocumentPoints = async ({ compCode, documentId }) => {
  await ensureKnowledgeCollection();
  await getQdrantClient().delete(getKnowledgeCollectionName(), {
    wait: true,
    filter: {
      must: [
        { key: "compCode", match: { value: compCode } },
        { key: "documentId", match: { value: Number(documentId) } },
      ],
    },
  });
};

const qdrantHealth = exports.qdrantHealth = async () => {
  const start = Date.now();
  const collection = await ensureKnowledgeCollection();
  const info = await getQdrantClient().getCollection(collection);

  return {
    status: "UP",
    latencyMs: Date.now() - start,
    collection,
    pointsCount: info?.points_count ?? null,
    vectorSize: info?.config?.params?.vectors?.dense?.size ?? null,
  };
};















const normalizeValue = (
  value
) =>
  String(
    value ?? ""
  ).trim();

const positiveInt = (
  value,
  fallback,
  max = 100
) => {
  const parsed =
    Number(value);

  if (
    !Number.isInteger(parsed) ||
    parsed <= 0
  ) {
    return fallback;
  }

  return Math.min(
    parsed,
    max
  );
};

const lexicalTokens = (
  text
) =>
  new Set(
    normalizeValue(text)
      .toLowerCase()
      .match(
        /[\p{L}\p{N}_\-\.]+/gu
      ) || []
  );

const lexicalScore = (
  query,
  content
) => {
  const q =
    lexicalTokens(query);

  const c =
    lexicalTokens(content);

  if (!q.size) {
    return 0;
  }

  let matched = 0;

  for (
    const token
    of q
  ) {
    if (
      c.has(token)
    ) {
      matched += 1;
    }
  }

  return (
    matched /
    q.size
  );
};

const buildFilter = ({
  userContext,
  moduleName,
  documentTypes = [],
}) => {
  const currentComp = normalizeValue(userContext?.compcode || "GLOBAL").toUpperCase();

  const must = [
    {
      // Strict multi-tenant isolation: Match current tenant compCode OR shared 'GLOBAL' documents ONLY.
      should: [
        { key: "compCode", match: { value: currentComp } },
        { key: "compCode", match: { value: "GLOBAL" } },
      ],
    },
    {
      key: "isActive",
      match: { value: true },
    },
  ];

  if (
    normalizeValue(
      moduleName
    )
  ) {
    must.push({
      key:
        "moduleName",

      match: {
        value:
          normalizeValue(
            moduleName
          ).toUpperCase(),
      },
    });
  }

  /*
   * Multiple document types → OR.
   */
  if (
    Array.isArray(
      documentTypes
    ) &&
    documentTypes.length
  ) {
    must.push({
      should:
        documentTypes.map(
          (type) => ({
            key:
              "documentType",

            match: {
              value:
                String(type)
                  .trim()
                  .toUpperCase(),
            },
          })
        ),
    });
  }

  /*
   * Branch visibility.
   */
  const branchShould = [
    {
      is_empty: {
        key:
          "branchCode",
      },
    },

    {
      key:
        "branchCode",

      match: {
        value:
          "GLOBAL",
      },
    },
  ];

  if (
    normalizeValue(
      userContext.location
    )
  ) {
    branchShould.push({
      key:
        "branchCode",

      match: {
        value:
          String(
            userContext.location
          ),
      },
    });
  }

  must.push({
    should:
      branchShould,
  });

  /*
   * Role visibility.
   */
  must.push({
    should: [
      {
        is_empty: {
          key:
            "allowedRoleFlags",
        },
      },

      {
        key:
          "allowedRoleFlags",

        match: {
          value:
            Number(
              userContext.roleFlag ??
              0
            ),
        },
      },
    ],
  });

  return {
    must,
  };
};

const normalizeQueryResult = (
  response
) => {
  if (
    Array.isArray(response)
  ) {
    return response;
  }

  if (
    Array.isArray(
      response?.points
    )
  ) {
    return response.points;
  }

  if (
    Array.isArray(
      response?.result?.points
    )
  ) {
    return response
      .result
      .points;
  }

  if (
    Array.isArray(
      response?.result
    )
  ) {
    return response.result;
  }

  return [];
};

const retrieveKnowledge = exports.retrieveKnowledge =
  async ({
    question,
    searchQuery,
    userContext,
    moduleName = null,
    documentTypes = [],
    limit = null,
    scoreThreshold = null,
  }) => {
    const query =
      normalizeValue(
        searchQuery
      ) ||
      normalizeValue(
        question
      );

    if (!query) {
      throw new ApiError(
        400,
        "Search query is required"
      );
    }

    if (
      !userContext?.compcode
    ) {
      throw new ApiError(
        400,
        "Company code is required"
      );
    }

    await ensureKnowledgeCollection();

    const {
      embedding,
    } =
      await generateEmbedding(
        query
      );

    const finalLimit =
      positiveInt(
        limit ??
        process.env
          .AI_RAG_RETRIEVAL_LIMIT,
        15,
        50
      );

    const threshold =
      scoreThreshold ??
      Number(
        process.env
          .AI_RAG_MIN_SCORE ??
        0.20
      );

    const qdrant =
      getQdrantClient();

    const collection =
      getKnowledgeCollectionName();

    let response;

    if (
      typeof qdrant.query ===
      "function"
    ) {
      response =
        await qdrant.query(
          collection,
          {
            query:
              embedding,

            using:
              "dense",

            filter:
              buildFilter({
                userContext,
                moduleName,
                documentTypes,
              }),

            limit:
              finalLimit,

            score_threshold:
              threshold,

            with_payload:
              true,

            with_vector:
              false,
          }
        );
    } else {
      response =
        await qdrant.search(
          collection,
          {
            vector: {
              name:
                "dense",

              vector:
                embedding,
            },

            filter:
              buildFilter({
                userContext,
                moduleName,
                documentTypes,
              }),

            limit:
              finalLimit,

            score_threshold:
              threshold,

            with_payload:
              true,
          }
        );
    }

    return normalizeQueryResult(
      response
    )
      .map(
        (point) => {
          const semantic =
            Number(
              point.score ||
              0
            );

          const lexical =
            lexicalScore(
              query,
              [
                point.payload
                  ?.title,

                point.payload
                  ?.sourceName,

                point.payload
                  ?.sourceReference,

                point.payload
                  ?.content,
              ].join(" ")
            );

          return {
            id:
              point.id,

            score:
              semantic,

            lexicalScore:
              lexical,

            hybridScore:
              semantic * 0.90 +
              lexical * 0.10,

            payload:
              point.payload ||
              {},
          };
        }
      )
      .sort(
        (
          a,
          b
        ) =>
          b.hybridScore -
          a.hybridScore
      );
  };














const ResultSchema = z.object({
  results: z.array(z.object({ index: z.number().int().nonnegative(), score: z.number().min(0).max(1) })),
});

const rerankDocuments = exports.rerankDocuments = async ({ question, documents }) => {
  const finalLimit = Number(process.env.AI_RAG_RERANK_LIMIT || 6);
  const minScoreThreshold = Number(process.env.AI_RAG_MIN_RERANK_SCORE || 0.35);

  if (!documents || !documents.length) return [];

  // Filter out raw points with similarity < 0.20 right off the bat
  const validCandidates = documents.filter(
    (item) => Number(item.score ?? item.hybridScore ?? 0) >= 0.20
  );

  if (!validCandidates.length) return [];

  if (String(process.env.AI_RAG_ENABLE_LLM_RERANK || "true").toLowerCase() !== "true") {
    return balanceAndSelectTop3(validCandidates, finalLimit);
  }

  try {
    const response = await getOpenAIClient().responses.parse({
      model: String(process.env.OPENAI_ROUTER_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini"),
      instructions: `Rank candidate ERP documents/schemas by exact relevance for answering the user's question. Assign relevance score between 0.0 and 1.0. Ignore irrelevant chunks completely (assign score < 0.2). Return JSON list.`,
      input: JSON.stringify({
        question,
        chunks: validCandidates.map((item, index) => ({
          index,
          title: item.payload?.title || item.payload?.sourceName || "Document",
          documentType: item.payload?.documentType || "DOCUMENT",
          content: String(item.payload?.content || "").slice(0, 1500),
        })),
      }),
      reasoning: { effort: "low" },
      text: { format: zodTextFormat(ResultSchema, "rag_rerank") },
      max_output_tokens: 1000,
    });

    const ranked = response.output_parsed?.results || [];

    // Map ranked scores back to candidate documents
    const scoredDocs = ranked
      .map((item) => {
        const doc = validCandidates[item.index];
        if (!doc) return null;

        const rerankScore = Number(item.score || 0);
        const hybridScore = Number(doc.hybridScore || doc.score || 0);
        const combinedScore = rerankScore * 0.70 + hybridScore * 0.30;

        return {
          ...doc,
          rerankScore,
          finalScore: combinedScore,
        };
      })
      .filter((item) => item && item.rerankScore >= minScoreThreshold)
      .sort((a, b) => b.finalScore - a.finalScore);

    if (scoredDocs.length > 0) {
      return balanceAndSelectTop3(scoredDocs, finalLimit);
    }

    return balanceAndSelectTop3(validCandidates, finalLimit);
  } catch (error) {
    console.warn("[Rerank] LLM Reranking failed, using fallback similarity:", error?.message);
    return balanceAndSelectTop3(validCandidates, finalLimit);
  }
};

/**
 * Ensures HYBRID queries preserve up to Top-3 items per category (e.g. Policy vs Schema)
 */
const balanceAndSelectTop3 = (docs, limit) => {
  const schemaTypes = new Set(["TABLE_SCHEMA", "VIEW", "DATABASE_RELATION", "STATUS_MAPPING"]);
  const schemas = [];
  const policies = [];

  for (const doc of docs) {
    const docType = String(doc.payload?.documentType || doc.Document_Type || "").toUpperCase();
    if (schemaTypes.has(docType)) {
      schemas.push(doc);
    } else {
      policies.push(doc);
    }
  }

  // If we have both policy and schema matches (HYBRID scenario), select top 3 from each
  if (schemas.length > 0 && policies.length > 0) {
    const topSchemas = schemas.slice(0, 3);
    const topPolicies = policies.slice(0, 3);
    return [...topPolicies, ...topSchemas].slice(0, limit);
  }

  return docs.slice(0, limit);
};







// const normalizeValue = (value) => {
//   return String(value ?? "").trim();
// };

// const VALID_IDENTIFIER =
//   /^[A-Za-z_][A-Za-z0-9_]*$/;

// const buildColumnType = (
//   column
// ) => {
//   let dataType =
//     normalizeValue(
//       column.DATA_TYPE
//     );

//   if (
//     column.CHARACTER_MAXIMUM_LENGTH !==
//       null &&
//     column.CHARACTER_MAXIMUM_LENGTH !==
//       undefined
//   ) {
//     const length =
//       Number(
//         column
//           .CHARACTER_MAXIMUM_LENGTH
//       ) === -1
//         ? "MAX"
//         : column
//             .CHARACTER_MAXIMUM_LENGTH;

//     dataType +=
//       `(${length})`;
//   } else if (
//     [
//       "decimal",
//       "numeric",
//     ].includes(
//       dataType.toLowerCase()
//     ) &&
//     column.NUMERIC_PRECISION !==
//       null &&
//     column.NUMERIC_SCALE !==
//       null
//   ) {
//     dataType +=
//       `(${column.NUMERIC_PRECISION}, ${column.NUMERIC_SCALE})`;
//   }

//   return dataType;
// };

const getDatabaseTables = exports.getDatabaseTables =
  async ({
    sequelize,
    tableNames = [],
  }) => {
    if (
      !sequelize ||
      typeof sequelize.query !==
        "function"
    ) {
      throw new ApiError(
        500,
        "Database connection is required"
      );
    }

    const requestedTables =
      Array.isArray(tableNames)
        ? tableNames
            .map(normalizeValue)
            .filter(Boolean)
        : [];

    for (
      const tableName
      of requestedTables
    ) {
      if (
        !VALID_IDENTIFIER.test(
          tableName
        )
      ) {
        throw new ApiError(
          400,
          `Invalid table name: ${tableName}`
        );
      }
    }

    const replacements = {};

    let tableFilter = "";

    if (
      requestedTables.length > 0
    ) {
      const placeholders =
        requestedTables.map(
          (
            tableName,
            index
          ) => {
            const key =
              `table${index}`;

            replacements[key] =
              tableName;

            return `:${key}`;
          }
        );

      tableFilter = `
        AND T.[TABLE_NAME] IN
        (
          ${placeholders.join(", ")}
        )
      `;
    }

    return sequelize.query(
      `
      SELECT
        T.[TABLE_SCHEMA],
        T.[TABLE_NAME],
        T.[TABLE_TYPE]
      FROM
        [INFORMATION_SCHEMA].[TABLES] T
      WHERE
        T.[TABLE_SCHEMA] = 'dbo'
        AND T.[TABLE_TYPE] IN
        (
          'BASE TABLE',
          'VIEW'
        )
        ${tableFilter}
      ORDER BY
        T.[TABLE_NAME]
      `,
      {
        replacements,
        type:
          QueryTypes.SELECT,
      }
    );
  };

const getTableColumns = exports.getTableColumns =
  async ({
    sequelize,
    schemaName,
    tableName,
  }) => {
    return sequelize.query(
      `
      SELECT
        [ORDINAL_POSITION],
        [COLUMN_NAME],
        [DATA_TYPE],
        [CHARACTER_MAXIMUM_LENGTH],
        [NUMERIC_PRECISION],
        [NUMERIC_SCALE],
        [IS_NULLABLE],
        [COLUMN_DEFAULT]
      FROM
        [INFORMATION_SCHEMA].[COLUMNS]
      WHERE
        [TABLE_SCHEMA] =
          :schemaName
        AND [TABLE_NAME] =
          :tableName
      ORDER BY
        [ORDINAL_POSITION]
      `,
      {
        replacements: {
          schemaName,
          tableName,
        },

        type:
          QueryTypes.SELECT,
      }
    );
  };

const getTablePrimaryKeys = exports.getTablePrimaryKeys =
  async ({
    sequelize,
    schemaName,
    tableName,
  }) => {
    return sequelize.query(
      `
      SELECT
        C.[name]
          AS [Column_Name]
      FROM
        [sys].[key_constraints] KC

      INNER JOIN
        [sys].[index_columns] IC
          ON IC.[object_id] =
             KC.[parent_object_id]
          AND IC.[index_id] =
              KC.[unique_index_id]

      INNER JOIN
        [sys].[columns] C
          ON C.[object_id] =
             IC.[object_id]
          AND C.[column_id] =
              IC.[column_id]

      INNER JOIN
        [sys].[tables] T
          ON T.[object_id] =
             KC.[parent_object_id]

      INNER JOIN
        [sys].[schemas] S
          ON S.[schema_id] =
             T.[schema_id]

      WHERE
        KC.[type] = 'PK'
        AND S.[name] =
            :schemaName
        AND T.[name] =
            :tableName
      `,
      {
        replacements: {
          schemaName,
          tableName,
        },

        type:
          QueryTypes.SELECT,
      }
    );
  };

const getTableForeignKeys = exports.getTableForeignKeys =
  async ({
    sequelize,
    schemaName,
    tableName,
  }) => {
    return sequelize.query(
      `
      SELECT
        FK.[name]
          AS [Foreign_Key_Name],

        PC.[name]
          AS [Parent_Column],

        RS.[name]
          AS [Referenced_Schema],

        RT.[name]
          AS [Referenced_Table],

        RC.[name]
          AS [Referenced_Column]

      FROM
        [sys].[foreign_keys] FK

      INNER JOIN
        [sys].[foreign_key_columns] FKC
          ON FKC.[constraint_object_id] =
             FK.[object_id]

      INNER JOIN
        [sys].[tables] PT
          ON PT.[object_id] =
             FK.[parent_object_id]

      INNER JOIN
        [sys].[schemas] PS
          ON PS.[schema_id] =
             PT.[schema_id]

      INNER JOIN
        [sys].[columns] PC
          ON PC.[object_id] =
             FKC.[parent_object_id]
          AND PC.[column_id] =
              FKC.[parent_column_id]

      INNER JOIN
        [sys].[tables] RT
          ON RT.[object_id] =
             FK.[referenced_object_id]

      INNER JOIN
        [sys].[schemas] RS
          ON RS.[schema_id] =
             RT.[schema_id]

      INNER JOIN
        [sys].[columns] RC
          ON RC.[object_id] =
             FKC.[referenced_object_id]
          AND RC.[column_id] =
              FKC.[referenced_column_id]

      WHERE
        PS.[name] =
          :schemaName
        AND PT.[name] =
          :tableName
      `,
      {
        replacements: {
          schemaName,
          tableName,
        },

        type:
          QueryTypes.SELECT,
      }
    );
  };

const buildTableSchemaContent = exports.buildTableSchemaContent =
  async ({
    sequelize,
    schemaName,
    tableName,
    tableType,
  }) => {
    const [
      columns,
      primaryKeys,
      foreignKeys,
    ] =
      await Promise.all([
        getTableColumns({
          sequelize,
          schemaName,
          tableName,
        }),

        getTablePrimaryKeys({
          sequelize,
          schemaName,
          tableName,
        }),

        getTableForeignKeys({
          sequelize,
          schemaName,
          tableName,
        }),
      ]);

    const primaryKeyNames =
      new Set(
        primaryKeys.map(
          (item) =>
            normalizeValue(
              item.Column_Name
            )
        )
      );

    const columnLines =
      columns.map(
        (column) => {
          const columnName =
            normalizeValue(
              column.COLUMN_NAME
            );

          return [
            `- ${columnName}`,
            `Type: ${buildColumnType(column)}`,
            `Nullable: ${column.IS_NULLABLE}`,
            `Primary Key: ${
              primaryKeyNames.has(
                columnName
              )
                ? "YES"
                : "NO"
            }`,
            column.COLUMN_DEFAULT
              ? `Default: ${column.COLUMN_DEFAULT}`
              : null,
          ]
            .filter(Boolean)
            .join(" | ");
        }
      );

    const relationLines =
      foreignKeys.map(
        (relation) =>
          [
            `- ${relation.Parent_Column}`,
            "references",
            `${relation.Referenced_Schema}.${relation.Referenced_Table}.${relation.Referenced_Column}`,
          ].join(" ")
      );

    return `
Database object:
- Schema: ${schemaName}
- Name: ${tableName}
- Type: ${tableType}

Columns:
${columnLines.join("\n")}

Primary Keys:
${
  primaryKeys.length
    ? primaryKeys
        .map(
          (item) =>
            `- ${item.Column_Name}`
        )
        .join("\n")
    : "- None found"
}

Foreign Key Relationships:
${
  relationLines.length
    ? relationLines.join("\n")
    : "- None found"
}

SQL planning rules:
- Use exact table name: [${schemaName}].[${tableName}]
- Use only columns listed above.
- Never invent columns.
- Use parameterized SQL.
- Use SELECT-only queries.
`.trim();
  };
















const ADMIN_FLAGS = new Set([1, 2]);
const MANAGER_FLAGS = new Set([3]);

const getAccessScope = exports.getAccessScope = (userContext) => {
  const roleFlag = Number(userContext.roleFlag ?? 0);
  if (ADMIN_FLAGS.has(roleFlag)) return "COMPANY";
  if (MANAGER_FLAGS.has(roleFlag)) return "TEAM";
  return "SELF";
};

/**
 * SQL me authenticated identity parameter (:userCode / :userId) use ho
 * raha hai ya nahi, ye check karta hai.
 */
const usesAuthenticatedIdentityFilter = (sql = "", parameters = []) => {
  const paramNames = new Set(
    (parameters || []).map((p) => String(p?.name || "").replace(/^:+/, ""))
  );
  const hasParam = paramNames.has("userCode") || paramNames.has("userId");
  const hasPlaceholder = /:userCode\b|:userId\b/i.test(String(sql || ""));
  return hasParam && hasPlaceholder;
};

const assertSQLIntentAllowed = exports.assertSQLIntentAllowed = ({ userContext, sqlPlan }) => {
  const scope = getAccessScope(userContext);
  const intent = String(sqlPlan?.intent || "").toUpperCase();
  const sensitivity = String(sqlPlan?.sensitivity || "NORMAL").toUpperCase();

  const restrictedIntents = new Set([
    "SALARY_REPORT",
    "EMPLOYEE_REPORT",
    "PERSONAL_SALARY",
  ]);

  if (scope === "SELF") {
    if (restrictedIntents.has(intent) || sensitivity === "CONFIDENTIAL") {
      const isSelfFiltered = usesAuthenticatedIdentityFilter(sqlPlan?.sql, sqlPlan?.parameters);

      // PERSONAL_SALARY sirf tabhi allow, jab query authenticated user
      // ke apne userCode/userId se filtered ho — warna block.
      if (intent === "PERSONAL_SALARY" && isSelfFiltered) {
        return scope;
      }

      throw new ApiError(403, "You are not authorized to access this company-level information");
    }
  }

  return scope;
};














const toPositiveInteger = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

const buildUserContext = exports.buildUserContext = (req) => {
  let user = req.user;
  if (!user) {
    const rawToken = req.headers?.authorization || req.headers?.token || req.headers?.['x-access-token'];
    if (rawToken) {
      const token = String(rawToken).startsWith("Bearer ") ? String(rawToken).slice(7) : String(rawToken);
      try {
        user = jwt.verify(token, process.env.SECRET_KEY);
      } catch (_) {
        try {
          user = jwt.decode(token);
        } catch (_) {}
      }
    }
  }

  const rawRole = normalizeValue(user?.role || user?.appRole || req.body?.role || "EMPLOYEE").toUpperCase();
  const numericUserId = toPositiveInteger(
    user?.SRNO ?? user?.UTD ?? user?.userId ?? user?.User_Id ?? user?.User_Code ?? user?.id ?? user?.userCode ?? req.body?.userId ?? req.body?.userCode ?? req.body?.User_Code ?? req.body?.User_Id
  );
  const employeeCode = normalizeValue(
    user?.EMPCODE ?? user?.EmpCode ?? user?.empCode ?? user?.employeeCode ?? req.body?.EMPCODE ?? req.body?.EmpCode ?? req.body?.empCode ?? req.body?.employeeCode ?? ""
  ) || null;

  const inferredRoleFlag = rawRole === "SUPER_ADMIN" ? 1 : rawRole === "ADMIN" ? 2 : rawRole === "PROJECT_MANAGER" ? 3 : 0;
  const context = {
    numericUserId,
    userId: numericUserId,
    employeeCode,
    userCode: employeeCode || (numericUserId ? String(numericUserId) : null),
    userName: normalizeValue(user?.userName ?? user?.name ?? user?.User_Name ?? req.body?.userName ?? req.body?.name ?? "") || null,
    role: rawRole || "EMPLOYEE",
    roleFlag: Number(user?.roleFlag ?? user?.RoleFlag ?? req.body?.roleFlag ?? inferredRoleFlag),
    compcode: normalizeValue(user?.compcode || req.headers?.compcode || req.headers?.["x-comp-code"] || req.body?.compcode) || null,
    location: normalizeValue(user?.LOCATION ?? user?.location ?? req.body?.location ?? "") || null,
  };

  if (!context.compcode) throw new ApiError(400, "Company code is required");
  if (!context.numericUserId && !context.employeeCode) {
    throw new ApiError(401, "Authenticated user identity is unavailable");
  }
  return context;
};






/**
 * Business Dictionary Service — AutoVyn ERP AI Copilot V2
 * Maps business terminology (Hindi/English) to exact ERP database tables and columns.
 */

const BUSINESS_DICTIONARY = [
  {
    term: "net salary",
    synonyms: ["take home salary", "final salary", "net pay", "in hand salary", "netsal"],
    table: "SALARYFILE",
    column: "Final_Payment",
    module: "PAYROLL",
    description: "Employee final payable take-home salary",
  },
  {
    term: "gross salary",
    synonyms: ["total salary", "gross pay", "total earn", "grosssal"],
    table: "SALARYFILE",
    column: "Gross_Earn",
    module: "PAYROLL",
    description: "Employee total gross earnings before deductions",
  },
  {
    term: "deduction",
    synonyms: ["total deduction", "katoti", "deductions"],
    table: "SALARYFILE",
    column: "Deducation",
    module: "PAYROLL",
    description: "Total salary deductions",
  },
  {
    term: "mobile number",
    synonyms: ["phone number", "contact number", "mobile", "phone", "contact", "mobile_no"],
    table: "EMPLOYEEMASTER",
    column: "MOBILENO",
    module: "HR",
    description: "Employee primary contact mobile number",
  },
  {
    term: "education",
    synonyms: ["qualification", "college", "degree", "university", "board", "passing year", "score", "percentage", "marks"],
    table: "Employee_Education",
    column: "Emp_College",
    module: "HR",
    description: "Employee educational qualification and college details",
  },
  {
    term: "asset",
    synonyms: ["assets", "device", "laptop", "equipment", "issue", "allotted", "assigned"],
    table: "Asset_Issue",
    column: "Asset_Name",
    module: "ASSETS",
    description: "Company assets issued to employees",
  },
  {
    term: "joining date",
    synonyms: ["doj", "date of joining", "join date", "kab join kiya"],
    table: "EMPLOYEEMASTER",
    column: "CURRENTJOINDATE",
    module: "HR",
    description: "Employee current joining date",
  },
];

/**
 * Map business terms in text to ERP database tables & columns
 */
const mapBusinessTerms = exports.mapBusinessTerms = (text = "") => {
  const q = String(text).toLowerCase();
  const matched = [];

  for (const item of BUSINESS_DICTIONARY) {
    if (q.includes(item.term.toLowerCase())) {
      matched.push(item);
      continue;
    }
    for (const syn of item.synonyms) {
      if (q.includes(syn.toLowerCase())) {
        matched.push(item);
        break;
      }
    }
  }

  return matched;
};

/**
 * Get synonyms for a given business term
 */
const getTermSynonyms = exports.getTermSynonyms = (term = "") => {
  const found = BUSINESS_DICTIONARY.find(
    (d) => d.term.toLowerCase() === term.toLowerCase()
  );
  return found ? found.synonyms : [];
};












// const normalize = (v) => String(v ?? "").toLowerCase().trim();

// ─── Month Names ──────────────────────────────────────────────────────────────

const MONTH_NAMES = new Set([
  "january","february","march","april","may","june","july","august",
  "september","october","november","december",
  "jan","feb","mar","apr","jun","jul","aug","sep","oct","nov","dec",
  "janvari","fabrvari","maret","mai","juni","juli","agast",
  "sitambar","aktoobar","navambar","disambar",
]);

const MONTH_MAP = exports.MONTH_MAP = {
  january:"01", jan:"01", janvari:"01",
  february:"02", feb:"02", fabrvari:"02",
  march:"03", mar:"03", maret:"03",
  april:"04", apr:"04",
  may:"05", mai:"05",
  june:"06", jun:"06", juni:"06",
  july:"07", jul:"07", juli:"07",
  august:"08", aug:"08", agast:"08",
  september:"09", sep:"09", sitambar:"09",
  october:"10", oct:"10", aktoobar:"10",
  november:"11", nov:"11", navambar:"11",
  december:"12", dec:"12", disambar:"12",
};

const getMonthNumber = exports.getMonthNumber = (m) => MONTH_MAP[normalize(m || "")] || null;

// ─── Field hints ──────────────────────────────────────────────────────────────

const FIELD_HINTS = exports.FIELD_HINTS = {
  CODE:        ["empcode","emp_code","employee_code","employeecode","ecode"],
  MOBILE:      ["mobileno","mobile_no","mobile","moble","phone","phoneno","contactno","contact"],
  PAN:         ["pan","panno","pan_no","pan_number","pannumber","pancard"],
  PF:          ["pfno","pf_no","pf_number","pf_num","pf","pfd","pfdeduction","pf_deduction","provident_fund","providentfund"],
  SALARY:      ["gross_salary","grosssalary","gross","total_earn","totalearning","total_earning","basic","basicsal",
                 "basic_sal","basicsalary","basic_salary","hra","conveyance","medical","bonus_amount","netsal",
                 "net_sal","netsalary","net_salary","salary","ctc",
                 "totalsalary","total_salary","pf_deduction","pf_deduct","effective_date"],
  AADHAR:      ["aadhar","aadharno","aadhar_no","aadharnumber","uid"],
  UAN:         ["uan","uanno","uan_no","uan_number"],
  ESIC:        ["esic","esicno","esic_no","esi_no"],
  EMAIL:       ["email","email_id","emailid","mail"],
  DESIGNATION: ["designation","desig","post","position","jobtitle"],
  DEPARTMENT:  ["department","dept","dept_name","deptname","deptcode"],
  NAME:        ["empfirstname","first_name","fname","emp_name","firstname","name"],
  LASTNAME:    ["emplastname","last_name","lname","lastname"],
  DOB:         ["dob","date_of_birth","birthdate","birth_date"],
  DOJ:         ["doj","date_of_joining","joining_date","joindate"],
  GENDER:      ["gender","sex"],
  STATUS:      ["status","emp_status","is_active","empstatus"],
  MONTH:       ["salmnth","sal_month","salmonth","salary_month","paymonth",
                 "pay_month","sal_mon","monthno","month"],
  YEAR:        ["salyear","year","sal_year","payyear","pay_year","sal_yr"],
};

// ─── Stop words (field & domain keywords included so they don't leak into name) ────────

const FIELD_STOP_WORDS = new Set([
  "pan","panno","pancard","aadhar","uan","esic","email","salary","mobile",
  "phone","contact","code","empcode","designation","department","dept",
  "attendance","ctc","gross","net","basic","vetan","gender","dob","doj",
  "status","detail","details","info","information","number","no",
  "pf","pfno","pf_no","pf_deduction","provident_fund",
  "education","qualification","qualifications","degree","college","university",
  "board","passing","year","percentage","marks","school","course","skills","skill",
  "study","studied","master","entry","record","records","data","list","report","file",
  "asset","assets","aset","item","items","device","devices","laptop","laptops",
  "computer","equipment","issue","issued","revoke","revoked","allot","allotted",
  "assign","assigned","assignment","vehicle","vehicles","gadi","gaadi","car","bike",
  "service","servicing","repair","insurance","puc","fitness","permit",
  "birthday","birthdays","bday","bdays","janmdin","janamdin","coming","upcoming","monthdays",
  "mispunch","mis_punch","mis-punch","manualpunch","manual_punch","punch","punches","mispunches","pending","approved","rejected"
]);

const GENERAL_STOP_WORDS = new Set([
  "ka","ki","ke","kya","hai","hain","the","a","an","is","are","of","in",
  "and","or","for","to","do","de","dedo","me","mein","se","ko","ne","jo","wo","ye","ek",
  "batao","bata","dena","chahiye","nikalo","lekar","aao","la","lao","wala",
  "wali","wale","aur","give","get","fetch","find","show","tell","employee",
  "emp","name","naam","also","bhi","saath","with","ok","okk","okay",
  "please","plz","sir","ji","bhai","yaar","yar","dijiye","dijie","dedijiye",
  "dikhao","dikhaye","send","bhejo","provide",
  "kis","kisse","kiske","kisne","kaun","kaunsa","kaunsi","kaunse","kon","konsa","konsi",
  "kab","kaha","kahan","kahanse","kahase","pada","padha","padhi","padhe","kiya","kiye","kariya",
  "which","what","where","when","who","whom","whose","how","total",
  "chalo", "mujhe", "iska", "iski", "uska", "uski", "unka", "unki", "unke", "usne", "unhone", "isse", "usse",
  "pan", "card", "number", "no", "details", "detail", "info", "information",
  "sabse", "jyada", "zyada", "ziyada", "kiski", "kiska", "sabhi", "sab", "highest", "maximum", "max", "lowest", "minimum", "min", "top", "first",
  "be", "paid", "unpaid", "payable", "disbursed", "disburse", "month", "months", "mahine", "maheene", "maah",
  "mispunch", "mis_punch", "mis-punch", "manualpunch", "manual_punch", "punch", "punches", "mispunches", "pending", "approved", "rejected"
]);

const STOP_WORDS = exports.STOP_WORDS = new Set([...FIELD_STOP_WORDS, ...GENERAL_STOP_WORDS]);

const isDomainQuery = exports.isDomainQuery = (q) => {
  const text = String(q || "").toLowerCase();
  return /\b(education|qualification|qualifications|college|degree|board|university|passing\s*year|percentage|score|padh|padha|pada|padhai|siksha|shiksha|asset|assets|aset|item|items|device|devices|laptop|laptops|computer|equipment|issue|issued|revoke|revoked|allot|allotted|assign|assigned|assignment|vehicle|vehicles|gadi|gaadi|car|bike|service|servicing|repair|insurance|puc|fitness|permit|experience|previous\s*company|salary_file|salaryfile|payroll|mispunch|mis_punch|mis-punch|manualpunch|manual_punch)\b/i.test(text);
};

// ─── Trailing noise ───────────────────────────────────────────────────────────

const TRAILING_NOISE = new Set([
  "ok","okk","okay","please","plz","pls","bhai","sir","ji","yaar","yar",
  "na","re","ho","hoga","hain","hai","tha","thi","the","do","de","dedo","dena",
  "chahiye","batao","bata","nikalo","laao","lao","aao","aana","la","jaldi",
  "thanks","thank","help","karo","karna","dijiye","dijie","dedijiye",
  "dekhna","dekho","bhi","aur","also","dikhao","dikhaye","send","bhejo","provide",
  "sabse", "jyada", "zyada", "ziyada", "kiski", "kiska", "sabhi", "sab", "highest", "maximum", "max", "lowest", "minimum", "min", "top", "first",
  "be", "paid", "unpaid", "payable", "disbursed", "mispunch", "mis_punch", "mis-punch", "manualpunch", "manual_punch", "pending", "approved", "rejected"
]);

// ─── Name Variations ──────────────────────────────────────────────────────────

const getNameVariations = exports.getNameVariations = (token) => {
  const upper = token.toUpperCase();
  const vars  = new Set([upper]);
  const SUBS  = [
    [/V/g,"W"],[/W/g,"V"],[/OO/g,"U"],[/EE/g,"I"],
    [/SH/g,"S"],[/KH/g,"K"],[/AA/g,"A"],[/TH/g,"T"],
    [/ER$/g,"AR"],[/AR$/g,"ER"],[/AN$/g,"EN"],[/EN$/g,"AN"],
  ];
  for (const [p,r] of SUBS) {
    try {
      const v = upper.replace(p,r);
      if (v !== upper && v.length >= 2) vars.add(v);
    } catch(_) {}
  }
  return [...vars].slice(0,4);
};

// ─── Date Extractor ───────────────────────────────────────────────────────────

const extractAndRemoveDateInfo = (original) => {
  let text       = original;
  let monthFound = null;
  let yearFound  = null;

  const monthList = [...MONTH_NAMES].join("|");

  // "jun 2026" or "june-2026"
  const p1 = new RegExp(`\\b(${monthList})\\s*[-/]?\\s*(20\\d{2}|19\\d{2})\\b`, "gi");
  text = text.replace(p1, (_, month, year) => {
    monthFound = month; yearFound = year; return " ";
  });

  // "2026 june"
  const p2 = new RegExp(`\\b(20\\d{2}|19\\d{2})\\s*[-/]?\\s*(${monthList})\\b`, "gi");
  text = text.replace(p2, (_, year, month) => {
    if (!monthFound) monthFound = month;
    if (!yearFound)  yearFound  = year;
    return " ";
  });

  // Standalone month
  if (!monthFound) {
    const p3 = new RegExp(`\\b(${monthList})\\b`, "gi");
    text = text.replace(p3, (_, month) => { monthFound = month; return " "; });
  }

  // Standalone year
  const p4 = /\b(20\d{2}|19\d{2})\s*(ki|ka|ke|का|की|के)?\b/gi;
  text = text.replace(p4, (_, year) => { if (!yearFound) yearFound = year; return " "; });

  return {
    cleanQuestion: text.replace(/\s+/g," ").trim(),
    monthFound,
    yearFound,
  };
};

// ─── Remove field keywords from text ─────────────────────────────────────────

const FIELD_KEYWORD_RE = /\b(pan\s*(?:number|no|card)?|aadhar(?:\s*(?:no|number))?|uan(?:\s*(?:no|number))?|esic(?:\s*(?:no|number))?|email(?:\s*id)?|salary|vetan|mobile(?:\s*(?:no|number))?|phone(?:\s*(?:no|number))?|contact(?:\s*(?:no|number))?|employee\s*code|emp\s*code|empcode|designation|department|dept|attendance|ctc|gross|net|basic|gender|dob|doj|status|code|details?|info(?:rmation)?|number|no|pf\s*(?:no|number|deduction)?|pfdeduction|provident\s*fund|sabse|jyada|zyada|ziyada|kiski|kiska|sabhi|sab|highest|maximum|max|lowest|minimum|min|top|first)\b/gi;

const removeFieldKeywords = (text) =>
  text.replace(FIELD_KEYWORD_RE, " ").replace(/\s+/g," ").trim();

// ─── Name Cleaner ─────────────────────────────────────────────────────────────

const cleanExtractName = exports.cleanExtractName = (question) => {
  let text = String(question ?? "").trim();

  // Remove field keywords first
  text = removeFieldKeywords(text);

  // Remove trailing punctuation
  text = text.replace(/[?!.,;:]+$/, "").trim();

  // Remove trailing noise words
  let changed = true;
  let safety  = 0;
  while (changed && safety < 20) {
    changed = false; safety++;
    const words = text.split(/\s+/);
    if (words.length && TRAILING_NOISE.has(words[words.length-1].toLowerCase())) {
      words.pop();
      text    = words.join(" ").trim();
      changed = true;
    }
  }

  // Remove leading request words
  text = text
    .replace(/^(?:find|search|get|fetch|show|tell|batao|dhundo|mujhe|give)\s+/i,"")
    .trim();

  // Extract only alphabetic tokens that are not stop words
  const tokens = text
    .split(/\s+/)
    .filter((t) =>
      t.length >= 2 &&
      /^[A-Za-z.'-]+$/.test(t) &&
      !STOP_WORDS.has(t.toLowerCase()) &&
      !MONTH_NAMES.has(t.toLowerCase())
    )
    .slice(0, 5);

  if (!tokens.length) return null;
  const cleaned = tokens.join(" ").toUpperCase();
  return cleaned.length >= 2 ? cleaned : null;
};

// ─── Wanted Fields ────────────────────────────────────────────────────────────

const detectWantedFields = exports.detectWantedFields = (question) => {
  const q     = normalize(question);
  const wants = new Set();

  if (/\b(pan|pan\s*no|pan\s*number|pan\s*card)\b/i.test(q))            wants.add("PAN");
  if (/\b(pf|pf\s*no|pf\s*number|pf\s*deduction|pfdeduction|provident\s*fund)\b/i.test(q)) wants.add("PF");
  if (/\b(aadhar|uid)\b/i.test(q))                                       wants.add("AADHAR");
  if (/\b(uan)\b/i.test(q))                                              wants.add("UAN");
  if (/\b(esic|esi)\b/i.test(q))                                         wants.add("ESIC");
  if (/\b(mobile|moble|mob|mbl|phone|phon|phn|contact|cont|contactno)\b/i.test(q)) wants.add("MOBILE");
  if (/\b(salary|pay|ctc|gross|net|basic|vetan|वेतन|earn|structure|salarystructure)\b/i.test(q))  wants.add("SALARY");
  if (/\b(designation|post|position)\b/i.test(q))                        wants.add("DESIGNATION");
  if (/\b(department|dept)\b/i.test(q))                                  wants.add("DEPARTMENT");
  if (/\b(attendance|present|absent|leave)\b/i.test(q))                  wants.add("ATTENDANCE");
  if (/\b(detail|details|sab|all|info|puri|poori)\b/i.test(q))          wants.add("ALL");
  if (/\b(name|naam)\b/i.test(q))                                        wants.add("NAME");
  if (/\b(code|empcode|employee\s*code)\b/i.test(q))                     wants.add("CODE");

  // Default
  if (wants.size === 0) wants.add("CODE");

  return [...wants];
};

// ─── MAIN: detectFilterConditions ────────────────────────────────────────────

const detectFilterConditions = exports.detectFilterConditions = (question) => {
  const original = String(question ?? "").trim();
  const filters  = [];

  // Step 1: Extract date
  const { cleanQuestion, monthFound, yearFound } =
    extractAndRemoveDateInfo(original);

  if (process.env.NODE_ENV === "development") {
    console.log("[Filters] Original  :", original);
    console.log("[Filters] Clean     :", cleanQuestion);
    console.log("[Filters] Month     :", monthFound);
    console.log("[Filters] Year      :", yearFound);
  }

  const monthYearFilter = (monthFound || yearFound)
    ? {
        type:     "MONTH_YEAR",
        month:    monthFound || null,
        monthNum: monthFound ? getMonthNumber(monthFound) : null,
        year:     yearFound  || null,
        paramName:"monthYear",
      }
    : null;

  // Step 2: Mobile
  const mobileM = cleanQuestion.match(/(?:\+?91[\s-]?)?([6-9]\d{9})\b/);
  if (mobileM) {
    filters.push({ type:"MOBILE", value:mobileM[1], paramName:"mobileNumber" });
    if (monthYearFilter) filters.push(monthYearFilter);
    return filters;
  }

  // Step 3: Long numeric (7-12 digits) → EmpCode
  const longNumM = cleanQuestion.match(/\b(\d{7,12})\b/);
  if (longNumM) {
    filters.push({ type:"EMP_CODE", value:longNumM[1], paramName:"empCode" });
    if (monthYearFilter) filters.push(monthYearFilter);
    return filters;
  }

  // Step 4: Short numeric (4-6 digits) → EmpCode
  const shortNumM = cleanQuestion.match(/\b(\d{4,6})\b/);
  if (shortNumM) {
    filters.push({ type:"EMP_CODE", value:shortNumM[1], paramName:"empCode" });
    if (monthYearFilter) filters.push(monthYearFilter);
    return filters;
  }

  // Step 5: Alpha-numeric code
  const codeM = cleanQuestion.match(/\b([A-Z]{1,4}\d{4,12})\b/i);
  if (codeM) {
    filters.push({ type:"EMP_CODE", value:codeM[1].toUpperCase(), paramName:"empCode" });
    if (monthYearFilter) filters.push(monthYearFilter);
    return filters;
  }

  // Step 6: Name (remove field keywords first)
  const textForName = removeFieldKeywords(cleanQuestion);
  const cleanedName = cleanExtractName(textForName);

  if (cleanedName) {
    const tokens = cleanedName
      .split(/\s+/)
      .filter((t) =>
        t.length >= 2 &&
        !STOP_WORDS.has(t.toLowerCase()) &&
        !MONTH_NAMES.has(t.toLowerCase())
      );

    if (tokens.length >= 1) {
      filters.push({
        type:"NAME", value:tokens.join(" "),
        paramName:"nameSearch",
        tokenVariations: tokens.map((t) => ({
          token:t, variations:getNameVariations(t),
        })),
      });
    }
  }

  // Step 7: Month/Year
  if (monthYearFilter) filters.push(monthYearFilter);

  if (process.env.NODE_ENV === "development") {
    console.log("[Filters] Result:", filters);
  }

  return filters;
};

// ─── Token Extractor ──────────────────────────────────────────────────────────

const extractQuestionTokens = exports.extractQuestionTokens = (question) => {
  const text = normalize(question)
    .replace(/[^a-z0-9\s]/g," ")
    .replace(/\s+/g," ")
    .trim();
  return [
    ...new Set(
      text.split(" ").filter((t) => t.length >= 2 && !STOP_WORDS.has(t))
    ),
  ];
};

const scoreColumnRelevance = exports.scoreColumnRelevance = (column, questionTokens) => {
  const colName = normalize(column.name);
  let score     = 0;
  const SYNONYMS = {
    name:["empfirstname","emplastname","name","fullname"],
    code:["empcode","emp_code"],
    mobile:["mobileno","mobile_no","mobile","phone"],
    salary:["basic","gross","net","salary","pay","total_earn"],
    pan:["pan","panno","pan_no"],
  };
  for (const token of questionTokens) {
    if (colName === token)       { score += 100; continue; }
    if (colName.includes(token)) { score += 60;  continue; }
    if (token.includes(colName)) { score += 40;  continue; }
    for (const [concept, synonyms] of Object.entries(SYNONYMS)) {
      if (token.includes(concept) || concept.includes(token)) {
        if (synonyms.some((s) => colName.includes(s) || s.includes(colName))) {
          score += 80; break;
        }
      }
    }
  }
  return score;
};

// ─── Dynamic Join Key Resolution Helper ───────────────────────────────────────

const findJoinKeyInfo = exports.findJoinKeyInfo = (targetTable, masterTable) => {
  if (!targetTable || !masterTable) return null;

  const meta = targetTable.knowledgeMeta || {};
  const tCols = targetTable.columnsWithTypes || [];
  const mCols = masterTable.columnsWithTypes || [];

  const getColName = (c) => (typeof c === "object" ? c.name : c);
  const getColType = (c) => (typeof c === "object" ? (c.dataType || c.DATA_TYPE || "varchar") : "varchar");

  const tColNames = tCols.map(getColName);
  const mColNames = mCols.map(getColName);

  // 1. Explicit metadata joinKey or employeeCodeColumn
  const metaJoinKey = meta.joinKey || meta.employeeCodeColumn;
  if (metaJoinKey) {
    const matchTarget = tCols.find(c => getColName(c).toLowerCase() === metaJoinKey.toLowerCase());
    if (matchTarget) {
      // Find matching column in master (usually EMPCODE or Emp_Code)
      const matchMaster = mCols.find(c => {
        const name = getColName(c).toLowerCase();
        return name === metaJoinKey.toLowerCase() || name === "empcode" || name === "emp_code" || name === "usercode";
      }) || mCols.find(c => getColName(c).toLowerCase().includes("code"));

      if (matchMaster) {
        return {
          targetCol: getColName(matchTarget),
          targetType: getColType(matchTarget),
          masterCol: getColName(matchMaster),
          masterType: getColType(matchMaster),
          isSecondary: false,
        };
      }
    }
  }

  // 2. Secondary join key from metadata (e.g., Emp_Srno -> SRNO)
  const metaSecondaryKey = meta.secondaryJoinKey || meta.employeeSrnoColumn;
  if (metaSecondaryKey) {
    const matchTarget = tCols.find(c => getColName(c).toLowerCase() === metaSecondaryKey.toLowerCase());
    if (matchTarget) {
      const matchMaster = mCols.find(c => {
        const name = getColName(c).toLowerCase();
        return name === metaSecondaryKey.toLowerCase() || name === "srno" || name === "emp_srno" || name === "utd";
      }) || mCols.find(c => getColName(c).toLowerCase().includes("srno"));

      if (matchMaster) {
        return {
          targetCol: getColName(matchTarget),
          targetType: getColType(matchTarget),
          masterCol: getColName(matchMaster),
          masterType: getColType(matchMaster),
          isSecondary: true,
        };
      }
    }
  }

  // 3. Fallback to column matching via FIELD_HINTS.CODE
  for (const hint of FIELD_HINTS.CODE) {
    const targetMatch = tCols.find(c => getColName(c).toLowerCase() === hint.toLowerCase() || getColName(c).toLowerCase().includes(hint.toLowerCase()));
    if (targetMatch) {
      const masterMatch = mCols.find(c => {
        const name = getColName(c).toLowerCase();
        return name === "empcode" || name === "emp_code" || name.includes("code");
      });
      if (masterMatch) {
        return {
          targetCol: getColName(targetMatch),
          targetType: getColType(targetMatch),
          masterCol: getColName(masterMatch),
          masterType: getColType(masterMatch),
          isSecondary: false,
        };
      }
    }
  }

  return null;
};




const SCHEMA_LIMIT = Number(process.env.AI_SCHEMA_RETRIEVAL_LIMIT || 10);
const norm         = (v) => String(v ?? "").trim();

// ─── Empty result ─────────────────────────────────────────────────────────────

const emptyResult = (sqlPlan) => ({
  canAnswer:         false,
  sqlPlan,
  rows:              [],
  rowCount:          0,
  totalRowsReturned: 0,
  truncated:         false,
  executionTimeMs:   0,
});

// ─── Safe execute ─────────────────────────────────────────────────────────────

const safeExec = async ({ req, sql, params = {} }) => {
  try {
    if (process.env.NODE_ENV === "development") {
      console.log("[DB] SQL:", sql.replace(/\s+/g, " ").substring(0, 400));
      console.log("[DB] Params:", params);
    }
    const r = await executeReadOnlySQL({ req, sql, parameterMap: params });
    return { ok: true, rows: r.rows || [] };
  } catch (err) {
    console.warn("[DB] Exec error:", err?.message);
    return { ok: false, rows: [], error: err?.message };
  }
};

// ─── Convert parameters array → flat map ─────────────────────────────────────
// CRITICAL FIX: parameters array has {name, value, type} objects
// executeReadOnlySQL needs flat {name: value} map

const paramsToMap = (parameters = []) => {
  const map = {};
  for (const p of parameters) {
    if (!p || p.name == null) continue;
    // Extract raw value - handles both {name,value,type} and {name,value}
    map[p.name] = p.value ?? null;
  }
  return map;
};

// ─── Score filter for fuzzy name results ─────────────────────────────────────

const filterByScore = (rows) => {
  if (!rows.length || !("MatchScore" in rows[0])) return rows;
  const best = Math.max(...rows.map((r) => Number(r.MatchScore || 0)));
  if (best < 40) return [];
  const thr = best >= 100 ? 100 : best >= 85 ? 85 : best >= 65 ? 65 : 40;
  return rows
    .filter((r) => Number(r.MatchScore || 0) >= thr)
    .slice(0, 5);
};

// ─── Make result ──────────────────────────────────────────────────────────────

const makeResult = (rows, plan) => ({
  canAnswer:         true,
  sqlPlan:           plan,
  rows,
  rowCount:          rows.length,
  totalRowsReturned: rows.length,
  truncated:         false,
  executionTimeMs:   0,
});

// ─── Column finders ───────────────────────────────────────────────────────────

// const findCol = (columns, hints) => {
//   const getName = (c) => (typeof c === "object" ? c.name : c);
//   const cols    = columns.map(getName);
//   const lower   = cols.map((c) => c.toLowerCase());

//   for (const hint of hints) {
//     const idx = lower.findIndex((c) => c === hint.toLowerCase());
//     if (idx !== -1) return cols[idx];
//   }
//   for (const hint of hints) {
//     const idx = lower.findIndex((c) => c.includes(hint.toLowerCase()));
//     if (idx !== -1) return cols[idx];
//   }
//   return null;
// };

const findColWithType = (columnsWithTypes, hints) => {
  const hintList = Array.isArray(hints) ? hints : [];
  for (const hint of hintList) {
    for (const c of columnsWithTypes) {
      const name = (c.name || "").toLowerCase();
      if (name === hint.toLowerCase() || name.includes(hint.toLowerCase())) {
        return {
          name:     c.name,
          dataType: (c.dataType || c.DATA_TYPE || "varchar").toLowerCase(),
        };
      }
    }
  }
  return null;
};

const findEmpCodeColInfo = (cwt, knowledgeMeta = {}) => {
  const metaCode = knowledgeMeta?.joinKey || knowledgeMeta?.employeeCodeColumn;
  if (metaCode && cwt) {
    const found = cwt.find(c => (c.name || "").toLowerCase() === metaCode.toLowerCase());
    if (found) {
      return {
        name: found.name,
        dataType: (found.dataType || found.DATA_TYPE || "varchar").toLowerCase(),
      };
    }
  }
  return findColWithType(cwt, FIELD_HINTS.CODE);
};

const findNameCols = (columns) => ({
  firstCol: findCol(columns, FIELD_HINTS.NAME),
  lastCol:  findCol(columns, FIELD_HINTS.LASTNAME),
});

// ─── Table category ───────────────────────────────────────────────────────────

const getCategory = (tableName, knowledgeMeta, columnsWithTypes) => {
  const tbl  = tableName.toLowerCase();
  const cat  = norm(knowledgeMeta?.category || "").toLowerCase();
  const cols = columnsWithTypes.map((c) => (c.name || "").toLowerCase());

  if (
    cat === "employee_master" ||
    /employeemaster|emp_master/i.test(tbl) ||
    (cols.some((c) => /empfirstname|first_name/i.test(c)) &&
     cols.some((c) => /empcode|emp_code/i.test(c)))
  ) return "EMPLOYEE";

  if (
    cat === "salary" ||
    /salaryfile|salary_file|payroll/i.test(tbl) ||
    (cols.some((c) => /^basic$|^gross$|^net$|total_earn/i.test(c)) &&
     cols.some((c) => /empcode|emp_code/i.test(c)))
  ) return "SALARY";

  if (cat === "attendance" || /attendance/i.test(tbl)) return "ATTENDANCE";
  if (/^srv_/i.test(tbl)) return "SERVICE";
  return "OTHER";
};

// ─── Get columns with data types ──────────────────────────────────────────────

const getTableColumnsWithTypes = async ({ req, schemaName, tableName }) => {
  try {
    const r = await executeReadOnlySQL({
      req,
      sql: `
        SELECT COLUMN_NAME AS name, DATA_TYPE AS dataType
        FROM INFORMATION_SCHEMA.COLUMNS
        WHERE TABLE_SCHEMA = :sn AND TABLE_NAME = :tn
        ORDER BY ORDINAL_POSITION
      `,
      parameterMap: { sn: schemaName, tn: tableName },
    });
    if (r.rows?.length > 0) {
      return {
        columns:          r.rows.map((c) => c.name),
        columnsWithTypes: r.rows,
      };
    }
  } catch (err) {
    console.warn(`[DB] Schema fetch failed for ${tableName}:`, err?.message);
  }

  try {
    const r = await executeReadOnlySQL({
      req,
      sql:          `SELECT TOP 1 * FROM [${schemaName}].[${tableName}] WITH (NOLOCK)`,
      parameterMap: {},
    });
    if (r.rows?.length > 0) {
      const cols = Object.keys(r.rows[0]);
      return {
        columns:          cols,
        columnsWithTypes: cols.map((c) => ({ name: c, dataType: "varchar" })),
      };
    }
  } catch (err) {
    console.warn(`[DB] TOP 1 failed for ${tableName}:`, err?.message);
  }

  return { columns: [], columnsWithTypes: [] };
};

// ─── Month/Year WHERE condition ───────────────────────────────────────────────

const buildMonthYearCond = ({ tableName, columnsWithTypes, monthYearFilter }) => {
  if (!monthYearFilter) return { cond: "", params: {} };

  const conds  = [];
  const params = {};

  const monthColInfo = findColWithType(columnsWithTypes, FIELD_HINTS.MONTH);
  const yearColInfo  = findColWithType(columnsWithTypes, FIELD_HINTS.YEAR);

  if (monthColInfo && monthYearFilter.monthNum) {
    const isNum = /^(int|bigint|smallint|tinyint|numeric)$/i.test(monthColInfo.dataType);
    if (isNum) {
      conds.push(`[${tableName}].[${monthColInfo.name}] = :salMonth`);
      params.salMonth = parseInt(monthYearFilter.monthNum, 10);
    } else {
      conds.push(
        `LTRIM(RTRIM(CONVERT(varchar,[${tableName}].[${monthColInfo.name}]))) = :salMonth`
      );
      params.salMonth = monthYearFilter.monthNum;
    }
  }

  if (yearColInfo && monthYearFilter.year) {
    const isNum = /^(int|bigint|smallint|tinyint|numeric)$/i.test(yearColInfo.dataType);
    if (isNum) {
      conds.push(`[${tableName}].[${yearColInfo.name}] = :salYear`);
      params.salYear = parseInt(monthYearFilter.year, 10);
    } else {
      conds.push(`CONVERT(varchar,[${tableName}].[${yearColInfo.name}]) = :salYear`);
      params.salYear = String(monthYearFilter.year);
    }
  }

  return {
    cond:   conds.length ? " AND " + conds.join(" AND ") : "",
    params,
  };
};

// ─── Name WHERE builder ───────────────────────────────────────────────────────

const getVariations = (token) => {
  const upper = token.toUpperCase();
  const vars  = new Set([upper]);
  const SUBS  = [
    [/V/g, "W"], [/W/g, "V"], [/OO/g, "U"], [/EE/g, "I"],
    [/SH/g, "S"], [/KH/g, "K"], [/AA/g, "A"], [/TH/g, "T"],
    [/ER$/g, "AR"], [/AR$/g, "ER"], [/AN$/g, "EN"], [/EN$/g, "AN"],
  ];
  for (const [p, r] of SUBS) {
    try {
      const v = upper.replace(p, r);
      if (v !== upper && v.length >= 2) vars.add(v);
    } catch (_) {}
  }
  return [...vars].slice(0, 4);
};

const buildNameWhere = ({ firstCol, lastCol, nameValue, tableName }) => {
  const tokens = nameValue
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && !STOP_WORDS.has(t.toLowerCase()))
    .slice(0, 5);

  const params = { exactName: nameValue.toUpperCase() };

  const fullExp = lastCol
    ? `UPPER(LTRIM(RTRIM(ISNULL([${tableName}].[${firstCol}],'') + ' ' + ISNULL([${tableName}].[${lastCol}],''))))`
    : `UPPER(LTRIM(RTRIM(ISNULL([${tableName}].[${firstCol}],''))))`;

  if (!tokens.length) {
    return { where: `${fullExp} = :exactName`, params, score: "100" };
  }

  const tokenConds = [];
  tokens.forEach((token, i) => {
    const vars     = getVariations(token);
    const varConds = [];
    vars.forEach((v, vi) => {
      const key   = `t${i}v${vi}`;
      params[key] = `%${v}%`;
      varConds.push(`${fullExp} LIKE :${key}`);
    });
    tokenConds.push(`(${varConds.join(" OR ")})`);
  });

  const allCond = tokens.map((_, i) => `${fullExp} LIKE :t${i}v0`).join(" AND ");
  const lastIdx = tokens.length - 1;
  const flCond  = tokens.length > 1
    ? `${fullExp} LIKE :t0v0 AND ${fullExp} LIKE :t${lastIdx}v0`
    : `${fullExp} LIKE :t0v0`;

  const minCond = tokens.length >= 2
    ? `(${fullExp} LIKE :t0v0 AND ${fullExp} LIKE :t1v0)`
    : `${fullExp} LIKE :t0v0`;

  const where = `(${fullExp} = :exactName OR (${minCond}))`;
  const score = `CASE
  WHEN ${fullExp} = :exactName THEN 100
  WHEN (${allCond})            THEN 85
  WHEN (${flCond})             THEN 65
  WHEN ${fullExp} LIKE :t0v0   THEN 40
  ELSE 20
END`;

  return { where, params, score };
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PIPELINE
// ═══════════════════════════════════════════════════════════════════════════════

const getDatabaseEvidence = exports.getDatabaseEvidence = async ({
  req, question, userContext, route = null, history = [],
}) => {

  // ── Step 1: Vector search ─────────────────────────────────────────────────
  const schemaContext = await retrieveRelevantSchema({
    req,
    question,
    limit:      SCHEMA_LIMIT,
    hintTables: route?.tables || [],
  });

  if (process.env.NODE_ENV === "development") {
    console.log("[DB] Vector hits:", schemaContext.map((s) => ({
      table: s.Source_Reference,
      sim:   s.similarity?.toFixed(3),
    })));
  }

  if (!schemaContext.length)
    return emptyResult({ canAnswer: false, reason: "No schema found" });

  // ──────────────────────────────────────────────────────────────────────────
  // Step 2: generateSQLPlan() - deterministic first, then GPT
  // ──────────────────────────────────────────────────────────────────────────
  try {
    const plan = await generateSQLPlan({
      question,
      userContext,
      schemaContext,
      route,
      history,
    });

    if (plan?.canAnswer && plan?.sql) {
      if (process.env.NODE_ENV === "development") {
        console.log("[DB] Plan intent:", plan.intent);
        console.log("[DB] Plan SQL:", plan.sql.substring(0, 300));
      }

      // Security check
      try {
        assertSQLIntentAllowed({ userContext, sqlPlan: plan });
      } catch (secErr) {
        console.warn("[DB] Security check failed:", secErr?.message);
        return emptyResult({ canAnswer: false, reason: secErr?.message });
      }

      // ── CRITICAL: Convert parameters array to flat map ──────────────────
      // plan.parameters = [{name:"exactName", value:"NAGRATNA...", type:"string"}, ...]
      // We need: {exactName: "NAGRATNA...", ...}
      const rawParamMap = paramsToMap(plan.parameters || []);

      if (process.env.NODE_ENV === "development") {
        console.log("[DB] Raw param map:", rawParamMap);
      }

      // Validate SQL (remove unused params etc.)
      let execSQL    = plan.sql;
      let execParams = rawParamMap;

      try {
        const v = validateGeneratedSQL({
          sql:        plan.sql,
          parameters: plan.parameters || [],
        });
        execSQL    = v.sql;
        // validateGeneratedSQL returns parameterMap with raw values
        execParams = v.parameterMap || rawParamMap;

        if (process.env.NODE_ENV === "development") {
          console.log("[DB] Validated params:", execParams);
        }
      } catch (valErr) {
        console.warn("[DB] SQL validation warning (using raw):", valErr?.message);
        // Use rawParamMap directly
        execParams = rawParamMap;
      }

      // Execute
      const result = await safeExec({ req, sql: execSQL, params: execParams });

      if (result.ok) {
        let rows = result.rows;

        if (rows.length > 0) {
          // Filter fuzzy name results by score
          if ("MatchScore" in rows[0]) {
            rows = filterByScore(rows);
          }

          if (rows.length > 0) {
            if (process.env.NODE_ENV === "development") {
              console.log(`[DB] Plan rows: ${rows.length}`);
              console.log("[DB] Sample:", rows[0]);
            }
            return makeResult(rows, plan);
          }
        }

        // 0 rows - allow fall through for queries to fallback pipeline
        if (process.env.NODE_ENV === "development") {
          console.log("[DB] Plan returned 0 rows, running fallback pipeline");
        }
      }
    }
  } catch (planErr) {
    console.warn("[DB] generateSQLPlan error:", planErr?.message);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // Step 3: FALLBACK pipeline
  // ──────────────────────────────────────────────────────────────────────────

  const filters         = detectFilterConditions(question);
  const wantedFields    = detectWantedFields(question);
  const wantsAll        = wantedFields.includes("ALL");

  let monthYearFilter = filters.find((f) => f.type === "MONTH_YEAR") || null;
  let nameFilter      = filters.find((f) => f.type === "NAME");
  let exactFilter     = filters.find((f) =>
    ["MOBILE", "EMP_CODE", "NUMERIC_ID"].includes(f.type)
  );

  // If query is an aggregate, total, sum, or month summary (e.g. "total salary of jun month to be paid"),
  // discard false NAME filters caused by sentence noise words like "MONTH BE PAID"
  const isAggregateOrSummaryQuery = /\b(total|sum|aggregate|net|gross|overall|sab|saare|sare|all|count|kitne|kitna|kitni|to\s*be\s*paid|paid|unpaid|disburse|disbursed)\b/i.test(String(question));
  if (isAggregateOrSummaryQuery && nameFilter) {
    const nameVal = String(nameFilter.value || "").toUpperCase();
    if (/^(MONTH|BE|PAID|TO|BE|PAID|MONTH|TOTAL|SALARY|SUMMARY)+$/i.test(nameVal.replace(/\s+/g, "")) || !/[A-Za-z]{3,}/.test(nameVal)) {
      nameFilter = null;
      const idx = filters.findIndex(f => f.type === "NAME");
      if (idx !== -1) filters.splice(idx, 1);
    }
  }

  // ── History Employee Context Resolution for Follow-up Questions ───────────
  if (!nameFilter && !exactFilter && Array.isArray(history) && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const msg = String(history[i]?.content || "");
      const empCodeMatch = msg.match(/\b([A-Z]{1,4}\d{4,12})\b/i) || msg.match(/\b(\d{7,12})\b/);
      if (empCodeMatch) {
        exactFilter = { type: "EMP_CODE", value: empCodeMatch[1].toUpperCase(), paramName: "empCode", fromHistory: true };
        filters.unshift(exactFilter);
        if (process.env.NODE_ENV === "development") {
          console.log("[DB] Follow-up question detected: resolved employee code from history:", exactFilter.value);
        }
        break;
      }
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log("[DB] Fallback filters:", filters);
    console.log("[DB] Fallback wants:", wantedFields);
  }

  const isDomainQuery = /\b(salary|salaries|payroll|payslip|gross|net|basic|hra|ctc|tankhah|attendance|attendence|present|absent|leave|leaves|punch|shift|working\s*days|overtime|ot|education|qualification|qualifications|college|degree|board|university|passing\s*year|percentage|score|padh|padha|pada|padhai|siksha|shiksha|asset|assets|aset|item|items|device|devices|laptop|laptops|computer|equipment|issue|issued|revoke|revoked|allot|allotted|assign|assigned|assignment|vehicle|vehicles|gadi|gaadi|car|bike|service|servicing|repair|insurance|puc|fitness|permit|experience|previous\s*company|salary_file|salaryfile)\b/i.test(
    String(question)
  );
  const isListOrCountQuery = isDomainQuery || /\b(list|count|total|all|kitne|kitna|kitni|saare|sare|show|select|records|table|summary|top|highest|lowest|max|min|first|ranking|sort|order|batao|dikhao|give|get|fetch)\b/i.test(
    String(question)
  );

  if (!nameFilter && !exactFilter && !isListOrCountQuery)
    return emptyResult({ canAnswer: false, reason: "No search filter detected" });

  // ── Load tables ──────────────────────────────────────────────────────────
  const tables = [];

  for (const doc of schemaContext) {
    const ref    = norm(doc.Source_Reference || "");
    const src    = norm(doc.Source_Name      || "");
    if (!ref && !src) continue;

    const parts  = ref.includes(".") ? ref.split(".") : ["dbo", src];
    const schema = norm(parts[0] || "dbo");
    const table  = norm(parts[1] || src);
    if (!table) continue;

    const { columns, columnsWithTypes } = await getTableColumnsWithTypes({
      req, schemaName: schema, tableName: table,
    });
    if (!columns.length) continue;

    const category = getCategory(table, doc.knowledgeMeta || {}, columnsWithTypes);

    tables.push({
      schemaName: schema,
      tableName:  table,
      columns,
      columnsWithTypes,
      category,
      knowledgeMeta: doc.knowledgeMeta || {},
    });
  }

  // ── Auto-discover live attendance/payroll tables if not in registered schemaContext ──
  const isAttendanceRequested = /\b(attendance|attendence|present|absent|leave|leaves|punch|shift|working\s*days|overtime|ot)\b/i.test(String(question));
  const hasAttendanceTable = tables.some((t) => t.category === "ATTENDANCE" || /attendance/i.test(t.tableName));

  if (isAttendanceRequested && !hasAttendanceTable) {
    try {
      const liveRes = await executeReadOnlySQL({
        req,
        sql: `
          SELECT TABLE_SCHEMA AS schemaName, TABLE_NAME AS tableName
          FROM INFORMATION_SCHEMA.TABLES
          WHERE TABLE_TYPE = 'BASE TABLE'
            AND (TABLE_NAME LIKE '%ATTEND%' OR TABLE_NAME LIKE '%PUNCH%' OR TABLE_NAME LIKE '%ABSENT%')
        `,
        parameterMap: {},
      });
      if (liveRes.rows?.length > 0) {
        for (const row of liveRes.rows.slice(0, 5)) {
          const { columns, columnsWithTypes } = await getTableColumnsWithTypes({
            req, schemaName: row.schemaName, tableName: row.tableName,
          });
          if (columns.length > 0) {
            tables.push({
              schemaName: row.schemaName,
              tableName: row.tableName,
              columns,
              columnsWithTypes,
              category: "ATTENDANCE",
              knowledgeMeta: {},
            });
          }
        }
      }
    } catch (discErr) {
      console.warn("[DB] Live attendance table discovery skipped:", discErr?.message);
    }
  }

  const empTable = tables.find((t) => t.category === "EMPLOYEE") ||
                   tables.find((t) => /employeemaster|emp_master/i.test(t.tableName));

  if (process.env.NODE_ENV === "development") {
    console.log("[DB] Available tables:", tables.map(t => `${t.tableName} (${t.category})`));
  }

  // ── 0. Unfiltered List / Count / Domain queries (e.g. "total asset batao kitne hai") ─────
  if (!nameFilter && !exactFilter && isListOrCountQuery) {
    if (process.env.NODE_ENV === "development") {
      console.log("[DB] Unfiltered List/Count domain query — running strategyDynamicJoin/Single with allowUnfiltered");
    }

    if (empTable) {
      for (const targetTbl of tables) {
        if (targetTbl.tableName.toLowerCase() === empTable.tableName.toLowerCase()) continue;
        const r = await strategyDynamicJoin({
          req, masterTable: empTable, targetTable: targetTbl,
          exactFilter: null, nameFilter: null, monthYearFilter,
          wantedFields, wantsAll, allowUnfiltered: true,
        });
        if (r && r.rows?.length > 0) return r;
      }
    }

    for (const t of tables) {
      if (t.category === "SERVICE") continue;
      const r = await strategySingle({
        req, table: t,
        exactFilter: null, nameFilter: null,
        wantedFields, wantsAll, monthYearFilter, allowUnfiltered: true,
      });
      if (r && r.rows?.length > 0) return r;
    }

    return emptyResult({ canAnswer: false, reason: "No domain records found" });
  }

  // ── 1. Domain-specific queries (Asset, Education, Vehicle, etc.) with filter ──────────────
  if (isDomainQuery && empTable) {
    if (process.env.NODE_ENV === "development") {
      console.log("[DB] Domain query — running strategyDynamicJoin FIRST for domain tables");
    }
    for (const targetTbl of tables) {
      if (targetTbl.tableName.toLowerCase() === empTable.tableName.toLowerCase()) continue;
      // Only try tables that look like domain tables (not salary/attendance)
      if (["SALARY", "ATTENDANCE", "SERVICE"].includes(targetTbl.category)) continue;
      const r = await strategyDynamicJoin({
        req, masterTable: empTable, targetTable: targetTbl,
        exactFilter, nameFilter, monthYearFilter,
        wantedFields, wantsAll,
      });
      if (r && r.rows?.length > 0) return r;
    }

    // Try all non-EMPLOYEE target tables via strategyDynamicJoin
    for (const targetTbl of tables) {
      if (targetTbl.tableName.toLowerCase() === empTable.tableName.toLowerCase()) continue;
      const r = await strategyDynamicJoin({
        req, masterTable: empTable, targetTable: targetTbl,
        exactFilter, nameFilter, monthYearFilter,
        wantedFields, wantsAll,
      });
      if (r && r.rows?.length > 0) return r;
    }

    // Try target tables directly via strategySingle
    for (const t of tables) {
      if (t.tableName.toLowerCase() === empTable.tableName.toLowerCase()) continue;
      const r = await strategySingle({
        req, table: t,
        exactFilter, nameFilter,
        wantedFields, wantsAll,
        monthYearFilter,
      });
      if (r && r.rows?.length > 0) return r;
    }

    // Last resort: empTable directly
    const rEmp = await strategySingle({
      req, table: empTable,
      exactFilter, nameFilter,
      wantedFields, wantsAll,
      monthYearFilter: null,
    });
    if (rEmp && rEmp.rows?.length > 0) return rEmp;

    return emptyResult({ canAnswer: false, reason: "No domain records found" });
  }

  // 2. If Exact Employee Code or Mobile filter is provided:
  if (exactFilter) {
    for (const t of tables) {
      const r = await strategySingle({
        req, table: t,
        exactFilter, nameFilter: null,
        wantedFields, wantsAll,
        monthYearFilter,
      });
      if (r && r.rows?.length > 0) return r;
    }
  }

  // 3. If Name Filter or Exact Filter (when single table query returned 0 rows):
  if (empTable) {
    for (const targetTbl of tables) {
      if (targetTbl.tableName.toLowerCase() === empTable.tableName.toLowerCase()) continue;
      const r = await strategyDynamicJoin({
        req, masterTable: empTable, targetTable: targetTbl,
        exactFilter, nameFilter, monthYearFilter,
        wantedFields, wantsAll,
      });
      if (r && r.rows?.length > 0) return r;
    }

    const rEmp = await strategySingle({
      req, table: empTable,
      exactFilter, nameFilter,
      wantedFields, wantsAll,
      monthYearFilter: null,
    });
    if (rEmp && rEmp.rows?.length > 0) return rEmp;
  }

  // 4. Fallback: try strategySingle on all candidate tables
  for (const t of tables) {
    if (t.category === "SERVICE") continue;
    const r = await strategySingle({
      req, table: t,
      exactFilter, nameFilter,
      wantedFields, wantsAll,
      monthYearFilter,
    });
    if (r && r.rows?.length > 0) return r;
  }

  return emptyResult({ canAnswer: false, reason: "No matching records found" });
};

// ═══════════════════════════════════════════════════════════════════════════════
// STRATEGY: DYNAMIC JOIN (Generic for any domain table + Employee Master)
// ═══════════════════════════════════════════════════════════════════════════════

const strategyDynamicJoin = async ({
  req, masterTable, targetTable,
  exactFilter, nameFilter, monthYearFilter,
  wantedFields, wantsAll, allowUnfiltered = false,
}) => {
  if (!masterTable || !targetTable) return null;

  const joinInfo = findJoinKeyInfo(targetTable, masterTable);
  if (!joinInfo) return null;

  const {
    schemaName: mSchema, tableName: mTbl,
    columns: mCols, columnsWithTypes: mCWT,
  } = masterTable;
  const {
    schemaName: tSchema, tableName: tTbl,
    columns: tCols, columnsWithTypes: tCWT,
  } = targetTable;

  let mWhere, mParams, scoreExpr = null;

  if (exactFilter) {
    if (exactFilter.type === "MOBILE") {
      const col = findCol(mCols, FIELD_HINTS.MOBILE);
      if (!col) return null;
      mWhere  = `LTRIM(RTRIM([${mTbl}].[${col}])) = :fv`;
      mParams = { fv: String(exactFilter.value) };
    } else {
      const isNum = /^(int|bigint|smallint|tinyint|numeric|decimal)$/i.test(joinInfo.masterType);
      mWhere  = isNum
        ? `[${mTbl}].[${joinInfo.masterCol}] = :empCode`
        : `LTRIM(RTRIM([${mTbl}].[${joinInfo.masterCol}])) = :empCode`;
      mParams = {
        empCode: isNum ? Number(exactFilter.value) : String(exactFilter.value),
      };
    }
  } else if (nameFilter) {
    const { firstCol, lastCol } = findNameCols(mCols);
    if (!firstCol) return null;
    const built = buildNameWhere({
      firstCol, lastCol,
      nameValue: nameFilter.value,
      tableName: mTbl,
    });
    mWhere  = built.where;
    mParams = built.params;
    scoreExpr = built.score;
  } else if (allowUnfiltered) {
    mWhere = "1=1";
    mParams = {};
  } else {
    return null;
  }

  const mIsNum = /^(int|bigint|smallint|tinyint|numeric|decimal)$/i.test(joinInfo.masterType);
  const tIsNum = /^(int|bigint|smallint|tinyint|numeric|decimal)$/i.test(joinInfo.targetType);

  const joinOn = (mIsNum && tIsNum)
    ? `[${mTbl}].[${joinInfo.masterCol}] = [${tTbl}].[${joinInfo.targetCol}]`
    : mIsNum
    ? `CONVERT(varchar(50),[${mTbl}].[${joinInfo.masterCol}]) = LTRIM(RTRIM([${tTbl}].[${joinInfo.targetCol}]))`
    : tIsNum
    ? `LTRIM(RTRIM([${mTbl}].[${joinInfo.masterCol}])) = CONVERT(varchar(50),[${tTbl}].[${joinInfo.targetCol}])`
    : `LTRIM(RTRIM([${mTbl}].[${joinInfo.masterCol}])) = LTRIM(RTRIM([${tTbl}].[${joinInfo.targetCol}]))`;

  const { cond: dateCond, params: dateParams } = buildMonthYearCond({
    tableName: tTbl, columnsWithTypes: tCWT, monthYearFilter,
  });

  const parts = [];
  const added = new Set();

  const addCol = (tbl, col, alias) => {
    if (!col) return;
    const key = (alias || col).toLowerCase();
    if (added.has(key)) return;
    added.add(key);
    const expr = `[${tbl}].[${col}]`;
    parts.push(alias ? `  ${expr} AS [${alias}]` : `  ${expr}`);
  };

  const { firstCol: ef, lastCol: el } = findNameCols(mCols);
  addCol(mTbl, ef);
  addCol(mTbl, el);
  addCol(mTbl, joinInfo.masterCol);

  const noiseRegex = /password|token|hash|rights|secret|serverid|export_type/i;
  for (const c of tCols) {
    if (!noiseRegex.test(c)) {
      const alias = added.has(c.toLowerCase()) ? `${tTbl}_${c}` : null;
      addCol(tTbl, c, alias);
    }
  }

  if (scoreExpr) parts.push(`  ${scoreExpr} AS [MatchScore]`);
  if (!parts.length) return null;

  const allParams = { ...mParams, ...dateParams };
  const topLimit  = allowUnfiltered ? 50 : 15;

  let orderClause = scoreExpr ? "ORDER BY [MatchScore] DESC" : "";
  if (!orderClause) {
    const salCol = findCol(tCols, ["Gross_Salary", "Gross", "Basic", "Total_Earn", "Final_Payment"]);
    if (salCol && (wantedFields.includes("SALARY") || allowUnfiltered)) {
      orderClause = `ORDER BY [${tTbl}].[${salCol}] DESC`;
    }
  }

  const sql = `
SELECT TOP ${topLimit}
${parts.join(",\n")}
FROM [${mSchema}].[${mTbl}] WITH (NOLOCK)
INNER JOIN [${tSchema}].[${tTbl}] WITH (NOLOCK)
  ON ${joinOn}${dateCond}
WHERE ${mWhere}
${orderClause}
`.trim();

  const result = await safeExec({ req, sql, params: allParams });
  if (!result.ok) return null;

  let rows = result.rows;
  if (nameFilter && rows.length > 0) rows = filterByScore(rows);
  if (!rows.length) return null;

  return makeResult(rows, {
    canAnswer:   true,
    intent:      "GENERAL_DATABASE_QUERY",
    sensitivity: "NORMAL",
    explanation: `${mTbl}+${tTbl}`,
    sql,
    parameters:  Object.entries(allParams).map(([k, v]) => ({ name: k, value: v })),
  });
};

// ═══════════════════════════════════════════════════════════════════════════════
// STRATEGY: SINGLE TABLE
// ═══════════════════════════════════════════════════════════════════════════════

const strategySingle = async ({
  req, table,
  exactFilter, nameFilter,
  wantedFields, wantsAll,
  monthYearFilter, allowUnfiltered = false,
}) => {
  const { schemaName, tableName, columns, columnsWithTypes, knowledgeMeta = {} } = table;

  const parts = [];
  const added = new Set();

  const addCol = (col) => {
    if (!col) return;
    const key = col.toLowerCase();
    if (added.has(key)) return;
    added.add(key);
    parts.push(`  [${tableName}].[${col}]`);
  };

  const { firstCol, lastCol } = findNameCols(columns);
  addCol(firstCol);
  addCol(lastCol);

  const empCodeInfo = findEmpCodeColInfo(columnsWithTypes, knowledgeMeta);
  if (empCodeInfo) addCol(empCodeInfo.name);

  const noiseRegex = /password|token|hash|rights|secret|serverid|export_type/i;
  for (const c of columns) {
    if (!noiseRegex.test(c)) {
      addCol(c);
    }
  }

  let whereClause, whereParams, scoreExpr = null;

  if (exactFilter) {
    if (exactFilter.type === "MOBILE") {
      const col = findCol(columns, FIELD_HINTS.MOBILE);
      if (!col) return null;
      whereClause = `LTRIM(RTRIM([${tableName}].[${col}])) = :fv`;
      whereParams = { fv: String(exactFilter.value) };
    } else if (empCodeInfo) {
      const isNum = /^(int|bigint|smallint|tinyint|numeric|decimal)$/i.test(
        empCodeInfo.dataType
      );
      whereClause = isNum
        ? `[${tableName}].[${empCodeInfo.name}] = :empCode`
        : `LTRIM(RTRIM([${tableName}].[${empCodeInfo.name}])) = :empCode`;
      whereParams = {
        empCode: isNum ? Number(exactFilter.value) : String(exactFilter.value),
      };
    } else {
      return null;
    }
  } else if (nameFilter) {
    if (!firstCol) return null;
    const built = buildNameWhere({
      firstCol, lastCol,
      nameValue: nameFilter.value,
      tableName,
    });
    whereClause = built.where;
    whereParams = built.params;
    scoreExpr   = built.score;
    if (scoreExpr) parts.push(`  ${scoreExpr} AS [MatchScore]`);
  } else if (allowUnfiltered) {
    whereClause = "1=1";
    whereParams = {};
  } else {
    return null;
  }

  const { cond: myCond, params: myParams } = buildMonthYearCond({
    tableName, columnsWithTypes, monthYearFilter,
  });

  const allWhere  = whereClause + myCond;
  const allParams = { ...whereParams, ...myParams };
  const topLimit  = allowUnfiltered ? 50 : 10;

  let orderClause = scoreExpr ? "ORDER BY [MatchScore] DESC" : "";
  if (!orderClause) {
    const salCol = findCol(columns, ["Gross_Salary", "Gross", "Basic", "Total_Earn", "Final_Payment"]);
    if (salCol && (wantedFields.includes("SALARY") || allowUnfiltered)) {
      orderClause = `ORDER BY [${tableName}].[${salCol}] DESC`;
    }
  }

  const sql = [
    `SELECT TOP ${topLimit}`,
    parts.join(",\n"),
    `FROM [${schemaName}].[${tableName}] WITH (NOLOCK)`,
    `WHERE ${allWhere}`,
    orderClause,
  ].filter(Boolean).join("\n");

  if (process.env.NODE_ENV === "development") {
    console.log(`[DB] Single SQL (${tableName}):\n`, sql);
    console.log(`[DB] Params:`, allParams);
  }

  const result = await safeExec({ req, sql, params: allParams });
  if (!result.ok) return null;

  let rows = result.rows;
  if (nameFilter && rows.length > 0) rows = filterByScore(rows);

  if (process.env.NODE_ENV === "development") {
    console.log(`[DB] Single rows (${tableName}): ${rows.length}`);
    if (rows[0]) console.log("[DB] Sample:", rows[0]);
  }

  if (!rows.length) return null;

  return makeResult(rows, {
    canAnswer:   true,
    intent:      "GENERAL_DATABASE_QUERY",
    sensitivity: "NORMAL",
    explanation: tableName,
    sql,
    parameters:  Object.entries(allParams).map(([k, v]) => ({ name: k, value: v })),
  });
};









// import {
//   QueryTypes,
// } from "sequelize";

// import {
//   ApiError,
// } from "../../utils/ApiError.js";

// const VALID_IDENTIFIER =
//   /^[A-Za-z_][A-Za-z0-9_]*$/;

// const normalizeValue = (
//   value
// ) => {
//   return String(
//     value ?? ""
//   ).trim();
// };

const quoteIdentifier = (
  value
) => {
  const identifier =
    normalizeValue(value);

  if (
    !VALID_IDENTIFIER.test(
      identifier
    )
  ) {
    throw new ApiError(
      400,
      `Invalid SQL identifier: ${identifier}`
    );
  }

  return `[${identifier}]`;
};

/**
 * Supported:
 *
 * dbo.Srv_Reminder_Tbl
 * [dbo].[Srv_Reminder_Tbl]
 * Srv_Reminder_Tbl
 *
 * Not supported:
 *
 * dbo.Table WHERE ...
 * Table; DROP ...
 */
const parseTableReference = exports.parseTableReference = (
  sourceReference,
  sourceName
) => {
  const rawValue =
    normalizeValue(
      sourceReference ||
      sourceName
    )
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .split(":")[0]
      .trim();

  if (!rawValue) {
    return null;
  }

  const parts =
    rawValue
      .split(".")
      .map(normalizeValue)
      .filter(Boolean);

  let schemaName =
    "dbo";

  let tableName =
    null;

  if (
    parts.length === 1
  ) {
    tableName =
      parts[0];
  } else if (
    parts.length === 2
  ) {
    [
      schemaName,
      tableName,
    ] = parts;
  } else {
    return null;
  }

  if (
    !VALID_IDENTIFIER.test(
      schemaName
    ) ||
    !VALID_IDENTIFIER.test(
      tableName
    )
  ) {
    return null;
  }

  return {
    schemaName,
    tableName,

    fullName:
      `${schemaName}.${tableName}`,
  };
};

const buildColumnType = (
  column
) => {
  const typeName =
    normalizeValue(
      column.Type_Name
    );

  if (
    [
      "varchar",
      "nvarchar",
      "char",
      "nchar",
      "varbinary",
      "binary",
    ].includes(
      typeName.toLowerCase()
    )
  ) {
    const rawLength =
      Number(
        column.Max_Length
      );

    const adjustedLength =
      typeName
        .toLowerCase()
        .startsWith("n") &&
      rawLength > 0
        ? rawLength / 2
        : rawLength;

    return (
      adjustedLength === -1
        ? `${typeName}(MAX)`
        : `${typeName}(${adjustedLength})`
    );
  }

  if (
    [
      "decimal",
      "numeric",
    ].includes(
      typeName.toLowerCase()
    )
  ) {
    return `${typeName}(${column.Precision_Value}, ${column.Scale_Value})`;
  }

  return typeName;
};

const metadataCache = new Map();
const METADATA_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Table/view existence + complete columns (cached 10 min).
 */
const getObjectMetadata =
  async ({
    sequelize,
    schemaName,
    tableName,
  }) => {
    const dbName = sequelize?.config?.database || "default_db";
    const cacheKey = `${dbName}_${schemaName}_${tableName}`.toLowerCase();

    const cached = metadataCache.get(cacheKey);
    if (cached && Date.now() < cached.expiresAt) {
      return cached.data;
    }

    const rows =
      await sequelize.query(

        `
        SELECT
          O.[object_id]
            AS [Object_Id],

          S.[name]
            AS [Schema_Name],

          O.[name]
            AS [Object_Name],

          O.[type]
            AS [Object_Type],

          O.[type_desc]
            AS [Object_Type_Description],

          C.[column_id]
            AS [Ordinal_Position],

          C.[name]
            AS [Column_Name],

          T.[name]
            AS [Type_Name],

          C.[max_length]
            AS [Max_Length],

          C.[precision]
            AS [Precision_Value],

          C.[scale]
            AS [Scale_Value],

          C.[is_nullable]
            AS [Is_Nullable],

          C.[is_identity]
            AS [Is_Identity],

          C.[is_computed]
            AS [Is_Computed]

        FROM
          [sys].[objects] O

        INNER JOIN
          [sys].[schemas] S
            ON S.[schema_id] =
               O.[schema_id]

        INNER JOIN
          [sys].[columns] C
            ON C.[object_id] =
               O.[object_id]

        INNER JOIN
          [sys].[types] T
            ON T.[user_type_id] =
               C.[user_type_id]

        WHERE
          S.[name] =
            :schemaName

          AND O.[name] =
            :tableName

          AND O.[type] IN
          (
            'U',
            'V'
          )

        ORDER BY
          C.[column_id]
        `,
        {
          replacements: {
            schemaName,
            tableName,
          },

          type:
            QueryTypes.SELECT,
        }
      );

    if (
      !Array.isArray(rows) ||
      rows.length === 0
    ) {
      return null;
    }

    const result = {
      objectId:
        rows[0].Object_Id,

      objectType:
        rows[0]
          .Object_Type_Description,

      schemaName:
        rows[0].Schema_Name,

      tableName:
        rows[0].Object_Name,

      columns:
        rows.map(
          (column) => ({
            name:
              column.Column_Name,

            ordinalPosition:
              Number(
                column
                  .Ordinal_Position
              ),

            dataType:
              buildColumnType(
                column
              ),

            baseType:
              normalizeValue(
                column.Type_Name
              ).toLowerCase(),

            nullable:
              Boolean(
                column.Is_Nullable
              ),

            identity:
              Boolean(
                column.Is_Identity
              ),

            computed:
              Boolean(
                column.Is_Computed
              ),
          })
        ),
    };

    metadataCache.set(cacheKey, {
      data: result,
      expiresAt: Date.now() + METADATA_CACHE_TTL_MS,
    });

    return result;
  };

/**
 * Primary key columns.
 */
const getPrimaryKeys =
  async ({
    sequelize,
    schemaName,
    tableName,
  }) => {
    return sequelize.query(
      `
      SELECT
        C.[name]
          AS [Column_Name],

        IC.[key_ordinal]
          AS [Key_Order]

      FROM
        [sys].[key_constraints] KC

      INNER JOIN
        [sys].[tables] TB
          ON TB.[object_id] =
             KC.[parent_object_id]

      INNER JOIN
        [sys].[schemas] S
          ON S.[schema_id] =
             TB.[schema_id]

      INNER JOIN
        [sys].[index_columns] IC
          ON IC.[object_id] =
             KC.[parent_object_id]
          AND IC.[index_id] =
              KC.[unique_index_id]

      INNER JOIN
        [sys].[columns] C
          ON C.[object_id] =
             IC.[object_id]
          AND C.[column_id] =
              IC.[column_id]

      WHERE
        KC.[type] = 'PK'
        AND S.[name] =
            :schemaName
        AND TB.[name] =
            :tableName

      ORDER BY
        IC.[key_ordinal]
      `,
      {
        replacements: {
          schemaName,
          tableName,
        },

        type:
          QueryTypes.SELECT,
      }
    );
  };

/**
 * Low-cardinality/status-like columns identify karta hai.
 *
 * Example:
 * Reminder_Status
 * Status
 * Reminder_Type
 * Is_Active
 * Approval_Status
 */
const isProfileCandidate = (
  column
) => {
  const columnName =
    normalizeValue(
      column.name
    ).toLowerCase();

  const compatibleTypes =
    new Set([
      "varchar",
      "nvarchar",
      "char",
      "nchar",
      "tinyint",
      "smallint",
      "int",
      "bigint",
      "bit",
    ]);

  if (
    !compatibleTypes.has(
      column.baseType
    )
  ) {
    return false;
  }

  return (
    /status|state|type|category|flag|active|approved|approval|channel|priority/i
      .test(
        columnName
      )
  );
};

/**
 * Column values discover karta hai.
 *
 * Important:
 * - Identifier database metadata se verified hai.
 * - User input directly identifier nahi banta.
 * - Maximum 25 distinct values.
 */
const getDistinctColumnValues =
  async ({
    sequelize,
    schemaName,
    tableName,
    columnName,
  }) => {
    const safeSchema =
      quoteIdentifier(
        schemaName
      );

    const safeTable =
      quoteIdentifier(
        tableName
      );

    const safeColumn =
      quoteIdentifier(
        columnName
      );

    const rows =
      await sequelize.query(
        `
        SELECT TOP 25
          ${safeColumn}
            AS [Value],

          COUNT_BIG(1)
            AS [Record_Count]

        FROM
          ${safeSchema}.${safeTable}

        WHERE
          ${safeColumn}
            IS NOT NULL

        GROUP BY
          ${safeColumn}

        ORDER BY
          COUNT_BIG(1) DESC
        `,
        {
          type:
            QueryTypes.SELECT,

          timeout:
            Number(
              process.env
                .AI_SCHEMA_PROFILE_TIMEOUT_MS ||
              8000
            ),
        }
      );

    return rows.map(
      (row) => ({
        value:
          row.Value,

        count:
          Number(
            row.Record_Count ||
            0
          ),
      })
    );
  };

/**
 * Exact pending-like value detect karne ka deterministic helper.
 */
const detectPendingValues = (
  profiles = []
) => {
  const pendingWords =
    new Set([
      "pending",
      "open",
      "due",
      "new",
      "waiting",
      "in progress",
      "in_progress",
      "unresolved",
      "not completed",
    ]);

  const matches = [];

  for (
    const profile
    of profiles
  ) {
    for (
      const entry
      of profile.values
    ) {
      const normalized =
        normalizeValue(
          entry.value
        ).toLowerCase();

      if (
        pendingWords.has(
          normalized
        )
      ) {
        matches.push({
          column:
            profile.column,

          value:
            entry.value,

          count:
            entry.count,

          confidence:
            "EXACT_TEXT_MATCH",
        });
      }
    }
  }

  return matches;
};

const buildLiveSchemaText = ({
  metadata,
  primaryKeys,
  profiles,
  pendingCandidates,
}) => {
  const primaryKeySet =
    new Set(
      primaryKeys.map(
        (item) =>
          normalizeValue(
            item.Column_Name
          )
      )
    );

  const columnLines =
    metadata.columns.map(
      (column) => {
        return [
          `- ${column.name}`,
          `Type: ${column.dataType}`,
          `Nullable: ${
            column.nullable
              ? "YES"
              : "NO"
          }`,
          `Primary Key: ${
            primaryKeySet.has(
              column.name
            )
              ? "YES"
              : "NO"
          }`,
          `Identity: ${
            column.identity
              ? "YES"
              : "NO"
          }`,
          `Computed: ${
            column.computed
              ? "YES"
              : "NO"
          }`,
        ].join(" | ");
      }
    );

  const profileLines =
    profiles.length
      ? profiles.map(
          (profile) => {
            const values =
              profile.values
                .map(
                  (entry) =>
                    `${JSON.stringify(entry.value)} (${entry.count} rows)`
                )
                .join(", ");

            return (
              `- ${profile.column}: ${values}`
            );
          }
        )
      : [
          "- No status-like columns were profiled.",
        ];

  const pendingLines =
    pendingCandidates.length
      ? pendingCandidates.map(
          (item) =>
            `- Column ${item.column} uses value ${JSON.stringify(item.value)} and currently has ${item.count} matching rows.`
        )
      : [
          "- No exact textual pending value was automatically detected.",
        ];

  return `
Live Database Metadata:
- Object: ${metadata.schemaName}.${metadata.tableName}
- Object Type: ${metadata.objectType}

Live Columns:
${columnLines.join("\n")}

Observed Status/Category Values:
${profileLines.join("\n")}

Automatically Detected Pending Candidates:
${pendingLines.join("\n")}

Important SQL-planning rules:
- The live metadata above is the current source of truth.
- Use exact table and column names shown above.
- Do not invent columns.
- Status filters may use an observed value only.
- If exactly one pending candidate exists, it may be used directly.
- If multiple pending candidates exist, choose the one whose column meaning best matches the question.
- If no pending candidate exists, do not guess a numeric pending code.
- COUNT questions should use COUNT_BIG or COUNT.
- List questions should use TOP 100 unless fewer rows are requested.
`.trim();
};

/**
 * Public function.
 */
const inspectAuthorizedTable = exports.inspectAuthorizedTable =
  async ({
    sequelize,
    sourceReference,
    sourceName,
    includeValueProfiles = true,
  }) => {
    const tableReference =
      parseTableReference(
        sourceReference,
        sourceName
      );

    if (!tableReference) {
      throw new ApiError(
        422,
        "Knowledge document does not contain a valid database table reference"
      );
    }

    const metadata =
      await getObjectMetadata({
        sequelize,

        schemaName:
          tableReference
            .schemaName,

        tableName:
          tableReference
            .tableName,
      });

    if (!metadata) {
      throw new ApiError(
        404,
        `Authorized database object ${tableReference.fullName} was not found`
      );
    }

    const primaryKeys =
      await getPrimaryKeys({
        sequelize,

        schemaName:
          metadata.schemaName,

        tableName:
          metadata.tableName,
      });

    const profiles = [];

    if (
      includeValueProfiles
    ) {
      const candidates =
        metadata.columns
          .filter(
            isProfileCandidate
          )
          .slice(
            0,
            Number(
              process.env
                .AI_SCHEMA_PROFILE_MAX_COLUMNS ||
              8
            )
          );

      for (
        const column
        of candidates
      ) {
        try {
          const values =
            await getDistinctColumnValues({
              sequelize,

              schemaName:
                metadata.schemaName,

              tableName:
                metadata.tableName,

              columnName:
                column.name,
            });

          profiles.push({
            column:
              column.name,

            dataType:
              column.dataType,

            values,
          });
        } catch (error) {
          console.error(
            "Column profiling failed:",
            {
              table:
                tableReference
                  .fullName,

              column:
                column.name,

              message:
                error?.message,
            }
          );
        }
      }
    }

    const pendingCandidates =
      detectPendingValues(
        profiles
      );

    return {
      ...tableReference,

      metadata,
      primaryKeys,
      profiles,
      pendingCandidates,

      content:
        buildLiveSchemaText({
          metadata,
          primaryKeys,
          profiles,
          pendingCandidates,
        }),
    };
  };











// const DEV = process.env.NODE_ENV === "development";
// const normalizeValue = (v) => String(v ?? "").trim();

const SCHEMA_DOC_TYPES = ["TABLE_SCHEMA", "VIEW", "DATABASE_RELATION", "STATUS_MAPPING", "BUSINESS_RULE"];

const INTENT_PATTERNS = {
  SERVICE: [/\b(reminder|service|vehicle|insurance|fitness|permit|puc|expiry|due\s*date)\b/i],
  SALARY: [/\b(salary|payroll|payslip|gross|net|basic|hra|ctc|pf|esic)\b/i],
  ATTENDANCE: [/\b(attendance|present|absent|leave|ot\b|punch)\b/i],
  EMPLOYEE: [/\b(employee|emp|staff|empcode|employee\s*code|mobile|phone|pan\b|aadhar|uan\b|email|designation|department|joining|join|joiner|joiners|recruitment|candidate)\b/i],
};

const detectIntent = (q) => {
  const text = normalizeValue(q);
  for (const [intent, arr] of Object.entries(INTENT_PATTERNS)) {
    if (arr.some((re) => re.test(text))) return intent;
  }
  return "GENERAL";
};

const hasSalaryWords = (q) =>
  /\b(salary|payroll|payslip|gross|net|basic|hra|ctc|pf|esic|earn|income)\b/i.test(String(q || ""));

const hasEmpIdentity = (q) =>
  /\b(empcode|employee\s*code|employeecode|emp\s*code)\b/i.test(String(q || "")) ||
  /(?:\+?91[\s-]?)?[6-9]\d{9}\b/.test(String(q || "")) ||
  /\b([A-Z]{1,4}\d{4,12})\b/i.test(String(q || "")) ||
  /\b(\d{7,12})\b/.test(String(q || ""));

const getUserContextForRagFilter = (req) => {
  const compcode = normalizeValue(req.user?.compcode || req.headers?.compcode || req.headers?.["x-comp-code"]);
  if (!compcode) throw new ApiError(400, "Company code is required");
  return {
    compcode,
    roleFlag: Number(req.user?.roleFlag ?? req.user?.RoleFlag ?? 0),
    location: normalizeValue(req.user?.LOCATION ?? req.user?.location ?? "") || null,
  };
};

const mapLimit = async (items, limit, fn) => {
  const out = new Array(items.length);
  let idx = 0;
  const workers = Array.from({ length: Math.max(1, limit) }, async () => {
    while (true) {
      const i = idx++;
      if (i >= items.length) break;
      out[i] = await fn(items[i], i);
    }
  });
  await Promise.all(workers);
  return out;
};

const dedupeBySource = (docs = []) => {
  const map = new Map();
  for (const d of docs) {
    const key = String(d?.Source_Reference || d?.Source_Name || "");
    if (!key) continue;
    const prev = map.get(key);
    if (!prev || Number(d.similarity || 0) > Number(prev.similarity || 0)) map.set(key, d);
  }
  return [...map.values()];
};

// ─────────────────────────────────────────────────────────────────────────────
// Strict verifiers (reject wrong tables like Salary_Approver)
// ─────────────────────────────────────────────────────────────────────────────

// const findCol = (columns = [], patterns = []) => {
//   for (const c of columns) {
//     const n = String(c?.name || c?.Column_Name || c || "").trim();
//     if (!n) continue;
//     for (const re of patterns) if (re.test(n)) return n;
//   }
//   return null;
// };

const EMP_VERIFY = {
  empCode: [/^empcode$/i, /^emp_code$/i, /^empid$/i, /^emp_id$/i, /^employee_code$/i, /^code$/i],
  first: [/^empfirstname$/i, /^firstname$/i, /^first_name$/i, /^empname$/i, /^name$/i],
};

const SAL_VERIFY = {
  empCode: [/^emp_code$/i, /^empcode$/i, /^employee_code$/i],
  amount: [
    /^net_salary$/i, /^netsalary$/i, /^netpay$/i, /^net$/i,
    /^basic$/i, /^gross$/i, /^gross_salary$/i, /^total_earn$/i, /^totalearning$/i, /^hra$/i,
  ],
  month: [/^salary_month$/i, /^salmonth$/i, /^monthdays$/i, /^month$/i],
  year: [/^salyear$/i, /^year$/i, /^sal_year$/i],
  effectiveDate: [/^effective_date$/i, /^eff_date$/i, /^rec_date$/i, /^created_at$/i, /^utd$/i],
};

// Salary table must have empcode + amount + (month OR year OR effectiveDate) => prevents Salary_Approver
const looksLikeSalaryTable = (doc) => {
  const cols = doc?.liveInspection?.columns || [];
  if (!cols.length) return false;
  const emp = findCol(cols, SAL_VERIFY.empCode);
  const amt = findCol(cols, SAL_VERIFY.amount);
  const mon = findCol(cols, SAL_VERIFY.month);
  const yr  = findCol(cols, SAL_VERIFY.year);
  const eff = findCol(cols, SAL_VERIFY.effectiveDate);
  return Boolean(emp && amt && (mon || yr || eff));
};

const looksLikeEmployeeMaster = (doc) => {
  const ref = (doc?.Source_Reference || doc?.Source_Name || doc?.Title || "").toLowerCase();
  if (ref.includes("employeemaster")) return true;
  const cols = doc?.liveInspection?.columns || [];
  if (!cols.length) return false;
  const emp = findCol(cols, EMP_VERIFY.empCode);
  const first = findCol(cols, [/^empfirstname$/i, /^firstname$/i, /^first_name$/i]);
  return Boolean(emp && first);
};

// ─────────────────────────────────────────────────────────────────────────────
// sys.objects discovery (EMPLOYEEMASTER & SALARYFILE priority)
// ─────────────────────────────────────────────────────────────────────────────

const discoverEmployeeCandidates = async ({ sequelize, max = 60 }) => {
  const top = Math.max(10, Math.min(Number(max) || 60, 200));
  return sequelize.query(
    `
    SELECT TOP (${top})
      S.[name] AS [Schema_Name],
      O.[name] AS [Object_Name]
    FROM [sys].[objects] O
    INNER JOIN [sys].[schemas] S ON S.[schema_id] = O.[schema_id]
    WHERE O.[type] IN ('U','V')
      AND (O.[name] LIKE '%EMP%' OR O.[name] LIKE '%EMPLOYEE%' OR O.[name] LIKE '%STAFF%')
      AND (O.[name] LIKE '%MASTER%' OR O.[name] LIKE '%MST%' OR O.[name] LIKE '%EMPLOYEE%')
    ORDER BY
      CASE
        WHEN UPPER(O.[name]) = 'EMPLOYEEMASTER' THEN 0
        WHEN UPPER(O.[name]) LIKE '%EMPLOYEEMASTER%' THEN 1
        WHEN UPPER(O.[name]) LIKE '%EMP%MASTER%' THEN 2
        WHEN UPPER(O.[name]) LIKE '%STAFF%MASTER%' THEN 3
        ELSE 9
      END,
      O.[name] ASC
    `,
    { type: QueryTypes.SELECT }
  );
};

const discoverSalaryCandidates = async ({ sequelize, max = 120 }) => {
  const top = Math.max(10, Math.min(Number(max) || 120, 300));
  return sequelize.query(
    `
    SELECT TOP (${top})
      S.[name] AS [Schema_Name],
      O.[name] AS [Object_Name]
    FROM [sys].[objects] O
    INNER JOIN [sys].[schemas] S ON S.[schema_id] = O.[schema_id]
    WHERE O.[type] IN ('U','V')
      AND (
        O.[name] LIKE '%SALARY%'
        OR O.[name] LIKE '%PAYROLL%'
        OR O.[name] LIKE '%PAYSLIP%'
        OR O.[name] LIKE '%WAGES%'
      )
      AND (
        O.[name] NOT LIKE '%APPROV%'  -- IMPORTANT: reject approver/approval tables
        AND O.[name] NOT LIKE '%APPROVAL%'
      )
    ORDER BY
      CASE
        WHEN UPPER(O.[name]) = 'SALARYFILE' THEN 0
        WHEN UPPER(O.[name]) LIKE '%SALARYFILE%' THEN 1
        WHEN UPPER(O.[name]) LIKE '%SALARY%FILE%' THEN 2
        WHEN UPPER(O.[name]) LIKE '%PAYROLL%' THEN 3
        WHEN UPPER(O.[name]) LIKE '%PAYSLIP%' THEN 4
        ELSE 9
      END,
      O.[name] ASC
    `,
    { type: QueryTypes.SELECT }
  );
};

const buildSyntheticDoc = ({ schemaName, tableName, liveInspection, sim = 0.99, detectedIntent }) => ({
  Document_Type: "TABLE_SCHEMA",
  Module_Name: "HR",
  Title: `Auto Discovered: ${schemaName}.${tableName}`,
  Source_Name: tableName,
  Source_Reference: `${schemaName}.${tableName}`,
  Document_Content: null,
  Chunk_Content: liveInspection?.content || "",
  knowledgeMeta: { category: detectedIntent === "SALARY" ? "SALARY" : "EMPLOYEE" },
  similarity: sim,
  _forced: true,
  detectedIntent,
  liveSchemaAvailable: Boolean(liveInspection),
  liveInspection: liveInspection
    ? {
        fullName: liveInspection.fullName,
        pendingCandidates: liveInspection.pendingCandidates,
        profiledColumns: liveInspection.profiles?.map((p) => p.column) || [],
        columns: liveInspection.metadata?.columns || [],
      }
    : null,
  relationships: [],
});

const enrichLive = async ({ sequelize, doc }) => {
  const ref = parseTableReference(doc.Source_Reference, doc.Source_Name);
  if (!ref) return doc;

  let liveInspection = null;
  try {
    liveInspection = await inspectAuthorizedTable({
      sequelize,
      sourceReference: doc.Source_Reference,
      sourceName: doc.Source_Name,
      includeValueProfiles: true,
    });
  } catch {
    liveInspection = null;
  }

  const parts = [doc.Chunk_Content, liveInspection?.content || ""].map(normalizeValue).filter(Boolean);

  return {
    ...doc,
    Chunk_Content: [...new Set(parts)].join("\n\n"),
    liveSchemaAvailable: Boolean(liveInspection),
    liveInspection: liveInspection
      ? {
          fullName: liveInspection.fullName,
          pendingCandidates: liveInspection.pendingCandidates,
          profiledColumns: liveInspection.profiles?.map((p) => p.column) || [],
          columns: liveInspection.metadata?.columns || [],
        }
      : null,
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT
// ─────────────────────────────────────────────────────────────────────────────

const retrieveRelevantSchema = exports.retrieveRelevantSchema = async ({ req, question, limit = 12, hintTables = [] }) => {
  const q = normalizeValue(question);
  if (!q) throw new ApiError(400, "Question is required");

  const userContext = getUserContextForRagFilter(req);
  const intent = detectIntent(q);

  const wantSalary = hasSalaryWords(q);
  const wantEmployee = intent === "EMPLOYEE" || hasEmpIdentity(q) || wantSalary;

  const finalLimit = Math.max(8, Math.min(Number(limit) || 12, 40));
  const scoreThreshold = Number(process.env.AI_SCHEMA_MIN_SCORE ?? 0.18);

  let docs = [];

  // 1) Qdrant retrieval (best-effort)
  try {
    await ensureKnowledgeCollection();

    const baseHits = await retrieveKnowledge({
      question: q,
      searchQuery: q,
      userContext,
      moduleName: null,
      documentTypes: SCHEMA_DOC_TYPES,
      limit: finalLimit * 2,
      scoreThreshold,
    });

    const hits = [...baseHits];

    // extra: employee expansion if needed
    if (wantEmployee) {
      const extra = await retrieveKnowledge({
        question: q,
        searchQuery: `${q} employee master employeemaster empcode empfirstname emplastname staff hr pan mobile`,
        userContext,
        moduleName: "HR",
        documentTypes: ["TABLE_SCHEMA", "VIEW"],
        limit: finalLimit * 2,
        scoreThreshold: Math.min(scoreThreshold, 0.12),
      });
      hits.unshift(...extra);
    }

    // extra: salary expansion if needed
    if (wantSalary) {
      const extra = await retrieveKnowledge({
        question: q,
        searchQuery: `${q} salaryfile payroll payslip emp_code total_earn basic net salary monthdays salyear month year`,
        userContext,
        moduleName: "HR",
        documentTypes: ["TABLE_SCHEMA", "VIEW"],
        limit: finalLimit * 2,
        scoreThreshold: Math.min(scoreThreshold, 0.12),
      });
      hits.unshift(...extra);
    }

    // hint tables
    const hints = (Array.isArray(hintTables) ? hintTables : [])
      .map((h) => normalizeValue(h).toLowerCase())
      .filter(Boolean)
      .slice(0, 8);

    for (const h of hints) {
      const hh = await retrieveKnowledge({
        question: h,
        searchQuery: h,
        userContext,
        moduleName: null,
        documentTypes: SCHEMA_DOC_TYPES,
        limit: 5,
        scoreThreshold: 0.08,
      });
      hits.unshift(...hh);
    }

    // map hits -> docs
    const seen = new Set();
    for (const h of hits || []) {
      const p = h?.payload || {};
      const key = String(p.documentId ?? p.sourceReference ?? p.sourceName ?? "");
      if (!key || seen.has(key)) continue;
      seen.add(key);

      docs.push({
        Document_Type: p.documentType || "TABLE_SCHEMA",
        Module_Name: p.moduleName || "",
        Title: p.title || "",
        Source_Name: p.sourceName || "",
        Source_Reference: p.sourceReference || "",
        Document_Content: null,
        Chunk_Content: p.content || "",
        knowledgeMeta: p.metadata || {},
        similarity: Number(h.hybridScore ?? h.score ?? 0),
        detectedIntent: intent,
        liveSchemaAvailable: false,
        liveInspection: null,
      });
    }

    docs = dedupeBySource(docs).sort((a, b) => b.similarity - a.similarity).slice(0, finalLimit);
  } catch (e) {
    console.error("[Retrieval] Qdrant retrieval failed:", e?.message);
  }

  const sequelize = await dbname(req, userContext.compcode);

  // 1.5) SQL Server Database Fallback Search on dbo.AI_Knowledge_Document_Tbl
  if (!docs.length) {
    try {
      const keywords = q
        .split(/\s+/)
        .map(t => t.trim().toLowerCase())
        .filter(t => t.length >= 2);

      if (keywords.length) {
        const likeConds = keywords.slice(0, 5).map((_, i) =>
          `(LOWER(Title) LIKE :kw${i} OR LOWER(Source_Name) LIKE :kw${i} OR LOWER(Source_Reference) LIKE :kw${i} OR LOWER(CAST(Content AS varchar(max))) LIKE :kw${i})`
        ).join(" OR ");

        const replacements = keywords.slice(0, 5).reduce((acc, kw, i) => ({ ...acc, [`kw${i}`]: `%${kw}%` }), {});

        const [dbDocs] = await sequelize.query(`
          SELECT TOP 10
            Document_Type, Module_Name, Title, Source_Name, Source_Reference, CAST(Content AS varchar(max)) AS Content, Comp_Code
          FROM dbo.AI_Knowledge_Document_Tbl WITH (NOLOCK)
          WHERE Is_Active = 1 AND (${likeConds})
          ORDER BY UTD DESC
        `, { replacements });

        for (const row of dbDocs || []) {
          docs.push({
            Document_Type: row.Document_Type || "TABLE_SCHEMA",
            Module_Name: row.Module_Name || "",
            Title: row.Title || "",
            Source_Name: row.Source_Name || "",
            Source_Reference: row.Source_Reference || "",
            Document_Content: row.Content || "",
            Chunk_Content: row.Content || "",
            similarity: 0.95,
            detectedIntent: intent,
            liveSchemaAvailable: false,
            liveInspection: null,
          });
        }
      }
    } catch (dbErr) {
      console.error("[Retrieval] AI_Knowledge_Document_Tbl SQL fallback search error:", dbErr?.message);
    }
  }

  if (wantEmployee) {
    const empMasterIdx = docs.findIndex(d => {
      const r = (d?.Source_Reference || d?.Source_Name || d?.Title || "").toLowerCase();
      return r.includes("employeemaster");
    });
    if (empMasterIdx > 0) {
      const [empDoc] = docs.splice(empMasterIdx, 1);
      docs.unshift(empDoc);
    }
  }

  const inspectLimit = Math.max(1, Math.min(Number(process.env.AI_SCHEMA_LIVE_INSPECT_LIMIT || 8), docs.length));
  const concurrency = Math.max(1, Math.min(Number(process.env.AI_SCHEMA_LIVE_INSPECT_CONCURRENCY || 2), 5));

  const top = docs.slice(0, inspectLimit);
  const rest = docs.slice(inspectLimit);

  const enrichedTop = await mapLimit(top, concurrency, async (d) => enrichLive({ sequelize, doc: d }));
  docs = [...enrichedTop, ...rest];

  // 3) Guarantee EMPLOYEEMASTER if needed
  if (wantEmployee && !docs.some(looksLikeEmployeeMaster)) {
    if (DEV) console.warn("[Retrieval] No employee-master in KB/Qdrant. Discovering from sys.objects...");
    const candidates = await discoverEmployeeCandidates({ sequelize, max: 80 });

    for (const row of (candidates || []).slice(0, 25)) {
      const schemaName = String(row.Schema_Name || "dbo");
      const tableName = String(row.Object_Name || "");
      if (!tableName) continue;

      const sourceRef = `${schemaName}.${tableName}`;
      try {
        const live = await inspectAuthorizedTable({
          sequelize,
          sourceReference: sourceRef,
          sourceName: tableName,
          includeValueProfiles: false,
        });
        const syn = buildSyntheticDoc({ schemaName, tableName, liveInspection: live, sim: 0.99, detectedIntent: "EMPLOYEE" });
        if (looksLikeEmployeeMaster(syn)) {
          docs = dedupeBySource([syn, ...docs]).slice(0, finalLimit);
          break;
        }
      } catch {
        // ignore
      }
    }
  }

  const ATT_VERIFY = {
    empCode: [/^emp_code$/i, /^empcode$/i, /^employee_code$/i, /^user_code$/i, /^emp_id$/i],
    monthDays: [/^monthdays$/i, /^month_days$/i, /^present$/i, /^presentvalue$/i, /^dateoffice$/i, /^absent$/i, /^leave$/i, /^att_/i, /^workdays$/i],
  };

  const looksLikeAttendanceTable = (doc) => {
    const cols = doc?.liveInspection?.columns || [];
    if (!cols.length) return false;
    const emp = findCol(cols, ATT_VERIFY.empCode);
    const md = findCol(cols, ATT_VERIFY.monthDays);
    return Boolean(emp && md);
  };

const discoverAttendanceCandidates = async ({ sequelize, max = 100 }) => {
  const top = Math.max(10, Math.min(Number(max) || 100, 200));
  return sequelize.query(
    `
    SELECT TOP (${top})
      S.[name] AS [Schema_Name],
      O.[name] AS [Object_Name]
    FROM [sys].[objects] O
    INNER JOIN [sys].[schemas] S ON S.[schema_id] = O.[schema_id]
    WHERE O.[type] IN ('U','V')
      AND (
        O.[name] LIKE '%ATTENDANCE%'
        OR O.[name] LIKE '%ATT_%'
        OR O.[name] LIKE '%HAZRI%'
        OR O.[name] LIKE '%HAAZRI%'
      )
    ORDER BY
      CASE
        WHEN UPPER(O.[name]) = 'ATTENDANCETABLE' THEN 0
        WHEN UPPER(O.[name]) LIKE '%ATTENDANCETABLE%' THEN 1
        WHEN UPPER(O.[name]) LIKE '%ATTENDANCE%' THEN 2
        ELSE 9
      END,
      O.[name] ASC
    `,
    { type: QueryTypes.SELECT }
  );
};

// 4) Guarantee SALARYFILE / SALARYSTRUCTURE-like tables if salary requested
  if (wantSalary) {
    const existingSalaryCount = docs.filter(looksLikeSalaryTable).length;
    if (existingSalaryCount < 2) {
      if (DEV) console.warn("[Retrieval] Salary requested. Discovering additional salary tables from sys.objects...");

      const candidates = await discoverSalaryCandidates({ sequelize, max: 150 });
      let addedCount = 0;

      for (const row of (candidates || []).slice(0, 40)) {
        const schemaName = String(row.Schema_Name || "dbo");
        const tableName = String(row.Object_Name || "");
        if (!tableName) continue;

        const sourceRef = `${schemaName}.${tableName}`;
        try {
          const live = await inspectAuthorizedTable({
            sequelize,
            sourceReference: sourceRef,
            sourceName: tableName,
            includeValueProfiles: false,
          });
          const syn = buildSyntheticDoc({ schemaName, tableName, liveInspection: live, sim: 0.985, detectedIntent: "SALARY" });
          if (looksLikeSalaryTable(syn)) {
            const prevLen = docs.length;
            docs = dedupeBySource([syn, ...docs]);
            if (docs.length > prevLen) {
              addedCount++;
              if (addedCount + existingSalaryCount >= 3) break;
            }
          }
        } catch {
          // ignore
        }
      }
      docs = docs.slice(0, finalLimit);
    }
  }

  // 5) Guarantee ATTENDANCETABLE-like table if attendance requested
  const wantAttendance =
    intent === "ATTENDANCE" ||
    /\b(attendance|attendancetable|monthdays|month_days|present|absent|leave|ot|punch|haazri|hazri)\b/i.test(q);

  if (wantAttendance && !docs.some(looksLikeAttendanceTable)) {
    if (DEV) console.warn("[Retrieval] Attendance requested but no attendance table in KB/Qdrant. Discovering from sys.objects...");

    const candidates = await discoverAttendanceCandidates({ sequelize, max: 100 });

    for (const row of (candidates || []).slice(0, 30)) {
      const schemaName = String(row.Schema_Name || "dbo");
      const tableName = String(row.Object_Name || "");
      if (!tableName) continue;

      const sourceRef = `${schemaName}.${tableName}`;
      try {
        const live = await inspectAuthorizedTable({
          sequelize,
          sourceReference: sourceRef,
          sourceName: tableName,
          includeValueProfiles: false,
        });
        const syn = buildSyntheticDoc({ schemaName, tableName, liveInspection: live, sim: 0.985, detectedIntent: "ATTENDANCE" });
        if (looksLikeAttendanceTable(syn)) {
          docs = dedupeBySource([syn, ...docs]).slice(0, finalLimit);
          break;
        }
      } catch {
        // ignore
      }
    }
  }

  // 6) Guarantee REMINDER-like table if reminder requested
  const wantReminder =
    intent === "SERVICE" ||
    /\b(reminder|reminders|pending\s*reminder|srv_reminder|service\s*reminder|reminder_status)\b/i.test(q);

  const REM_VERIFY = {
    reminderDate: [/^reminder_date$/i, /^reminderdate$/i, /^due_date$/i, /^final_due_date$/i, /^created_at$/i, /^date$/i],
    status: [/^reminder_status$/i, /^status$/i, /^rem_status$/i, /^state$/i],
  };

  const looksLikeReminderTable = (doc) => {
    const cols = doc?.liveInspection?.columns || [];
    if (!cols.length) return false;
    return Boolean(findCol(cols, REM_VERIFY.reminderDate) || findCol(cols, REM_VERIFY.status));
  };

  if (wantReminder && !docs.some(looksLikeReminderTable)) {
    if (DEV) console.warn("[Retrieval] Reminder requested but no reminder table in KB/Qdrant. Discovering from sys.objects...");

    const candidates = await sequelize.query(
      `
      SELECT TOP 50
        S.[name] AS [Schema_Name],
        O.[name] AS [Object_Name]
      FROM [sys].[objects] O
      INNER JOIN [sys].[schemas] S ON S.[schema_id] = O.[schema_id]
      WHERE O.[type] IN ('U','V')
        AND (O.[name] LIKE '%REMINDER%' OR O.[name] LIKE '%SERVICE%' OR O.[name] LIKE '%SRV_%')
      ORDER BY
        CASE
          WHEN UPPER(O.[name]) = 'SRV_REMINDER_TBL' THEN 0
          WHEN UPPER(O.[name]) LIKE '%REMINDER%' THEN 1
          ELSE 9
        END,
        O.[name] ASC
      `,
      { type: QueryTypes.SELECT }
    );

    for (const row of (candidates || []).slice(0, 20)) {
      const schemaName = String(row.Schema_Name || "dbo");
      const tableName = String(row.Object_Name || "");
      if (!tableName) continue;

      const sourceRef = `${schemaName}.${tableName}`;
      try {
        const live = await inspectAuthorizedTable({
          sequelize,
          sourceReference: sourceRef,
          sourceName: tableName,
          includeValueProfiles: false,
        });
        const syn = buildSyntheticDoc({ schemaName, tableName, liveInspection: live, sim: 0.985, detectedIntent: "SERVICE" });
        if (looksLikeReminderTable(syn)) {
          docs = dedupeBySource([syn, ...docs]).slice(0, finalLimit);
          break;
        }
      } catch {
        // ignore
      }
    }
  }

  const wantEmpDoc =
    intent === "EMPLOYEE_LOOKUP" ||
    intent === "ATTENDANCE" ||
    intent === "SALARY" ||
    /\b(employee|emp|empcode|pan|salary|attendance|attendancetable|gross|net|basic|hra|ctc|monthdays|naam|name)\b/i.test(q);

  if (wantEmpDoc && !docs.some(d => (d?.Source_Name || d?.Source_Reference || "").toUpperCase().includes("EMPLOYEEMASTER"))) {
    try {
      const live = await inspectAuthorizedTable({
        sequelize,
        sourceReference: "dbo.EMPLOYEEMASTER",
        sourceName: "EMPLOYEEMASTER",
        includeValueProfiles: false,
      });
      const syn = buildSyntheticDoc({ schemaName: "dbo", tableName: "EMPLOYEEMASTER", liveInspection: live, sim: 0.999, detectedIntent: "EMPLOYEE_LOOKUP" });
      docs = dedupeBySource([syn, ...docs]).slice(0, finalLimit);
    } catch {
      // ignore
    }
  }

  if (DEV) {
    console.log(`[Retrieval] intent=${intent} docs=${docs.length}`);
    docs.slice(0, Math.min(8, docs.length)).forEach((d, i) => {
      console.log(
        `  [${i + 1}] ${(d.Source_Reference || d.Source_Name).padEnd(40)} sim=${Number(d.similarity || 0).toFixed(3)} live=${d.liveSchemaAvailable}`
      );
    });
  }

  return docs;
};















// const normalize = (v) => String(v ?? "").trim();

const EMPLOYEE_PARAMS = new Set([
  "userCode", "employeeCode", "empCode", "empcode", "employee_code",
]);

const authenticatedValues = (req) => {
  const userCode = normalize(req.user?.EMPCODE ?? req.user?.EmpCode ?? req.user?.empCode ?? req.user?.userCode);
  const userId = req.user?.SRNO ?? req.user?.UTD ?? req.user?.userId ?? null;

  return {
    userCode,
    userId,
    compCode: normalize(req.user?.compcode || req.headers.compcode || req.headers?.["x-comp-code"]),
    location: req.user?.LOCATION ?? req.user?.location ?? null,
  };
};

const detectType = (v) => {
  if (v === null || v === undefined) return "null";
  if (typeof v === "boolean") return "boolean";
  if (typeof v === "number") return "number";
  return "string";
};

// accept both:
// { p: 1 } and { p: {value:1,type:"number"} }
const normalizeParamObj = (param) => {
  if (param && typeof param === "object" && ("value" in param || "type" in param)) {
    return { value: param.value ?? null, type: normalize(param.type || detectType(param.value)).toLowerCase() };
  }
  return { value: param ?? null, type: detectType(param) };
};

const castParam = (name, parameter) => {
  const value = parameter?.value;
  const type = normalize(parameter?.type || "string").toLowerCase();

  // Authenticated employee params → always string
  if (EMPLOYEE_PARAMS.has(name)) return normalize(value);

  if (value === null || value === undefined || type === "null") return null;

  if (type === "number") {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) throw new ApiError(400, `Invalid numeric SQL parameter: ${name}`);
    return parsed;
  }

  if (type === "boolean") {
    if ([true, 1, "1", "true"].includes(value)) return true;
    if ([false, 0, "0", "false"].includes(value)) return false;
    throw new ApiError(400, `Invalid boolean SQL parameter: ${name}`);
  }

  if (type === "date" && !/^\d{4}-\d{2}-\d{2}$/.test(normalize(value))) {
    throw new ApiError(400, `Invalid date SQL parameter: ${name}`);
  }

  return normalize(value);
};

// If SQL has :userCode/:userId but parameterMap doesn't include it, inject placeholder
const injectAuthParamsIfMissing = (sql, parameterMap) => {
  const map = { ...(parameterMap || {}) };
  const s = String(sql || "");

  const needed = [];
  if (/:userCode\b/i.test(s) && !Object.prototype.hasOwnProperty.call(map, "userCode")) needed.push("userCode");
  if (/:userId\b/i.test(s) && !Object.prototype.hasOwnProperty.call(map, "userId")) needed.push("userId");
  if (/:location\b/i.test(s) && !Object.prototype.hasOwnProperty.call(map, "location")) needed.push("location");

  for (const k of needed) map[k] = { value: null, type: "string" };
  return map;
};

const executeReadOnlySQL = exports.executeReadOnlySQL = async ({ req, sql, parameterMap = {} }) => {
  const auth = authenticatedValues(req);
  if (!auth.compCode) throw new ApiError(400, "Company code is required");

  const finalParamMap = injectAuthParamsIfMissing(sql, parameterMap);

  // Build replacements
  const replacements = {};

  for (const [rawName, rawParam] of Object.entries(finalParamMap)) {
    const name = normalize(rawName);
    const paramObj = normalizeParamObj(rawParam);

    // Auth params override any AI/user supplied values
    if (Object.prototype.hasOwnProperty.call(auth, name)) {
      replacements[name] = auth[name];
    } else {
      replacements[name] = castParam(name, paramObj);
    }
  }

  // Validate - no undefined/empty employee params
  for (const [name, value] of Object.entries(replacements)) {
    if (value === undefined || (EMPLOYEE_PARAMS.has(name) && !normalize(value))) {
      throw new ApiError(400, `SQL parameter value is unavailable: ${name}`);
    }
  }

  const sequelize = await dbname(req, auth.compCode);
  const startedAt = Date.now();

  const maxRows = Math.max(1, Math.min(Number(process.env.AI_SQL_MAX_ROWS || 200), 500));

  try {
    const rows = await sequelize.query(sql, {
      replacements,
      type: QueryTypes.SELECT,
      raw: true,
      timeout: Number(process.env.AI_SQL_TIMEOUT_MS || 15000),
    });

    const list = Array.isArray(rows) ? rows : [];

    return {
      rows: list.slice(0, maxRows),
      rowCount: Math.min(list.length, maxRows),
      totalRowsReturned: list.length,
      truncated: list.length > maxRows,
      executionTimeMs: Date.now() - startedAt,
    };
  } catch (error) {
    const msg = normalize(error?.original?.message || error?.message || "");

    if (/timeout/i.test(msg)) throw new ApiError(504, "Database query timed out");

    if (/invalid column name/i.test(msg)) {
      const colMatch = msg.match(/invalid column name\s+'([^']+)'/i);
      const badCol = colMatch?.[1] || "unknown";
      throw new ApiError(500, `Generated query referenced an unavailable database column: ${badCol}`);
    }

    if (/invalid object name/i.test(msg)) {
      throw new ApiError(500, "Generated query referenced an unavailable database table");
    }

    if (/incorrect syntax/i.test(msg)) {
      throw new ApiError(500, "Generated query contains invalid SQL syntax");
    }

    throw new ApiError(500, "Unable to retrieve the requested database information");
  }
};













// ─── Schemas ──────────────────────────────────────────────────────────────────

const SQLParameterSchema = z.object({
  name: z.string().min(1),
  value: z.union([z.string(), z.number(), z.boolean(), z.null()]),
  type: z.enum(["string", "number", "boolean", "date", "null"]),
});

const SQLPlanSchema = z.object({
  canAnswer: z.boolean(),
  intent: z.enum([
    "PERSONAL_SALARY",
    "SALARY_REPORT",
    "EMPLOYEE_LOOKUP",
    "EMPLOYEE_REPORT",
    "ATTENDANCE_QUERY",
    "LEAVE_QUERY",
    "PAYROLL_POLICY",
    "BUSINESS_REPORT",
    "GENERAL_DATABASE_QUERY",
    "UNSUPPORTED",
  ]),
  sensitivity: z.enum(["NORMAL", "PERSONAL", "CONFIDENTIAL"]),
  sql: z.string().nullable(),
  parameters: z.array(SQLParameterSchema),
  explanation: z.string(),
  reason: z.string().nullable(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DEV = process.env.NODE_ENV === "development";
// const normalize = (v) => String(v ?? "").trim();
const normalizeQ = (v) => normalize(v).replace(/\s+/g, " ");

const VALID_IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;
const safeIdent = (name) => {
  const n = normalize(name).replace(/\[|\]/g, "");
  if (!VALID_IDENTIFIER.test(n)) return null;
  return n;
};
const qIdent = (name) => {
  const n = safeIdent(name);
  if (!n) throw new ApiError(400, `Unsafe SQL identifier: ${name}`);
  return `[${n}]`;
};

// ─── Stopwords / noise (IMPORTANT) ────────────────────────────────────────────

// ─── Stopwords / noise (IMPORTANT) ────────────────────────────────────────────



const cleanPossessivesAndNoise = (text) => {
  let s = String(text || "");
  s = s.replace(/\b(yahi|yhi|isi|isii|usi|usii|ussi|isay|usay|iska|iski|uska|uski|unka|unki|unke|mera|meri|mere|apna|apni|apne|iss|is|ise|inhe|same|this|above|ab|karo|kya|kla|complete|poori|poora|mah|maah|mahine|maheene|month|months|saal|year|lekar|aao|lao|la|batao|bata|dena|chahiye|nikalo|do|dijiye|de|number|no|mobile|phone|whatsapp|contact|address|email|pan|pf|salary|joining|candidate|new)\b/gi, " ");
  s = s.replace(/\s+/g, " ").trim();
  return s;
};

const extractName = (question) => {
  let s = String(question || "");

  // Strip conversation prefixes like "ab kya karo - Employee Name: VISHAL SHANKAR GADKARI"
  s = s.replace(/^(?:ab\s+kya\s+karo|ab\s+karo|kya\s+karo|karo|ab|batao|kripya|dhyan\s+dein|employee\s+name|emp\s+name|name\s*[:=-])\s*/gi, " ");

  s = s.replace(
    /\b(employee\s*code|emp\s*code|empcode|employee\s*name|emp\s*name|pan(\s*number|\s*no)?|salary|structure|salarystructure|mobile(\s*no|\s*number)?|phone|whatsapp|contact|details?|info(?:rmation)?|number|no|lekar|aao|lao|la|batao|bata|dena|chahiye|nikalo|karo|do|dijiye|de|iska|iski|uska|uski|unka|unki|is|ise|inhe|yahi|yhi|isi|usi|ka|ki|ke|ko|se|ne|me|mein|aur|bhi|saath|new\s*joining|joining|candidate|candidates|recruitment|complete|poori|poora|kla|ok|okk|attendance|attendancetable|january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sep|sept|oct|nov|dec|mah|maah|mahine|maheene|month|months|saal|year|years)\b/gi,
    " "
  );

  s = s.replace(/\s+/g, " ").trim();

  const tokens = s
    .split(/[\s:-]+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 2 && /^[A-Za-z.'-]+$/.test(t) && !STOP_WORDS.has(t.toLowerCase()))
    .slice(0, 5);

  return tokens.length ? tokens.join(" ").toUpperCase() : null;
};

const extractEmployeeCode = (question) => {
  const q = String(question || "");

  // Explicit label: EmployeeCode: 19012202 or EmpCode: AU19795986
  const labeled =
    q.match(/\b(?:employee\s*code|employeecode|emp\s*code|empcode)\s*[:=#-]?\s*([A-Za-z0-9]{4,14})\b/i);
  if (labeled?.[1]) return String(labeled[1]).trim();

  // If question explicitly mentions mobile/phone/service/customer, don't treat numeric as employee code
  if (/\b(mobile|phone|contact|service|reminder|vehicle|customer|cust|gaddi|car|bike|chassis|engine)\b/i.test(q)) {
    return null;
  }

  // 10-digit Indian mobile number starting with 6,7,8,9 => NOT an employee code
  if (/\b[6-9]\d{9}\b/.test(q)) {
    return null;
  }

  // Alphanumeric employee code (e.g. AU19796075, AU19795986, EMP1002)
  const alphaNum = q.match(/\b([A-Z]{1,4}\d{4,12})\b/i);
  if (alphaNum?.[1]) return String(alphaNum[1]).trim().toUpperCase();

  // plain numeric employee id (e.g. 19012202)
  const num = q.match(/\b(\d{7,12})\b/);
  if (num?.[1]) return String(num[1]).trim();

  return null;
};

const resolveEmployeeFromHistory = (history = []) => {
  if (!Array.isArray(history) || !history.length) return null;

  for (let i = history.length - 1; i >= 0; i--) {
    const item = history[i];
    if (!item) continue;

    // Check metadata searchMeta
    const metaCode =
      item.metadata?.databaseQuery?.searchMeta?.searchValue ||
      item.metadata?.searchMeta?.searchValue ||
      item.metadata?.employeeCode;

    if (metaCode && /^[A-Za-z0-9]{4,14}$/.test(String(metaCode)) && !/^[6-9]\d{9}$/.test(String(metaCode))) {
      return String(metaCode).trim();
    }

    const content = String(item.content || "");

    // 1. Explicit labeled employee code: Employee Code: 1600156
    const labeledMatch = content.match(/\b(?:employee\s*code|emp\s*code|empcode)\s*[:=#-]?\s*([A-Za-z0-9]{4,14})\b/i);
    if (labeledMatch?.[1] && !/^[6-9]\d{9}$/.test(labeledMatch[1])) {
      return String(labeledMatch[1]).trim().toUpperCase();
    }

    // 2. Alphanumeric employee code (e.g. AU19796075, EMP1002)
    const alphaMatch = content.match(/\b([A-Z]{1,4}\d{4,12})\b/i);
    if (alphaMatch?.[1]) {
      return String(alphaMatch[1]).trim().toUpperCase();
    }

    // 3. Numeric code BUT NOT 10-digit mobile number starting with 6-9
    const numMatches = content.matchAll(/\b(\d{7,12})\b/g);
    for (const m of numMatches) {
      const val = m[1];
      if (!/^[6-9]\d{9}$/.test(val)) {
        return val.trim();
      }
    }
  }

  return null;
};

// const detectWantedFields = (question) => {
//   const t = String(question || "").toLowerCase();
//   const set = new Set();

//   if (/\b(empcode|employee\s*code|code)\b/.test(t)) set.add("CODE");
//   if (/\b(pan|pan\s*no|pan\s*number)\b/.test(t)) set.add("PAN");
//   if (/\b(pf|pf\s*no|pf\s*number|pf\s*deduction)\b/.test(t)) set.add("PF");
//   if (/\b(mobile|moble|mob|mbl|phone|phon|phn|contact|cont|contactno)\b/.test(t)) set.add("MOBILE");
//   if (/\b(salary|payroll|payslip|gross|net|basic|hra|ctc|earn|income|structure|salarystructure)\b/.test(t)) set.add("SALARY");
//   if (/\b(attendance|attendancetable|monthdays|month_days|punch|present|absent|leave|ot)\b/.test(t)) set.add("ATTENDANCE");
//   if (/\b(all|complete|poori|sab|sabhi)\b/.test(t)) set.add("ALL");

//   if (set.size === 0) set.add("DETAILS");
//   return [...set];
// };

const detectEmployeeSearchIntent = (question, history = []) => {
  const q = normalizeQ(question);

  // If question contains non-employee module terms (service, reminder, vehicle, customer, etc.),
  // bypass single-employee lookup so GPT fallback handles SQL generation!
  if (/\b(service|reminder|vehicle|customer|cust|gaddi|car|bike|chassis|engine|insurance|jobcard|bill|invoice)\b/i.test(q)) {
    return null;
  }

  const wantedFields = detectWantedFields(q);

  // Direct 10-digit mobile number query (e.g. 9845678901, 9079782505)
  const mobMatch = q.match(/\b([6-9]\d{9})\b/);
  if (mobMatch?.[1]) {
    return { searchType: "MOBILE", searchValue: mobMatch[1], wantedFields };
  }

  // ── Birthday queries (e.g. "give me employee list of coming birthday", "upcoming birthdays", "janmdin")
  const isBirthdayRequested = /\b(birthday|birthdays|bday|bdays|janmdin|janamdin)\b/i.test(q) ||
                              (/\b(coming|upcoming|next|this\s*month|hal\s*hi\s*me)\b/i.test(q) && /\b(dob|birth|bday|janm)\b/i.test(q));

  if (isBirthdayRequested) {
    const parsedMQ = parseMonthAndYearFromQuery(q);
    return {
      searchType: "BIRTHDAY",
      searchValue: parsedMQ.monthNum ? String(parsedMQ.monthNum) : "UPCOMING",
      limit: 50,
      wantedFields: ["DOB", "DETAILS"]
    };
  }

  // ── Mispunch / Manual Punch queries (e.g. "give me pending mispunch list", "approved mispunch list")
  const isMispunchRequested = /\b(mispunch|mis_punch|mis-punch|manual_punch|manualpunch|mipunch)\b/i.test(q) ||
                              (/\b(pending|approved|rejected|manual)\b/i.test(q) && /\b(punch|punches|attendance|entry)\b/i.test(q));

  if (isMispunchRequested) {
    let mispunchStatus = "ALL";
    if (/\b(pending|unapproved|open|approval\s*pending|baki|baaki)\b/i.test(q)) {
      mispunchStatus = "PENDING";
    } else if (/\b(approved|accept|accepted|approved_list|pas|passed)\b/i.test(q)) {
      mispunchStatus = "APPROVED";
    } else if (/\b(rejected|reject|cancelled|denied|decline|declined)\b/i.test(q)) {
      mispunchStatus = "REJECTED";
    }

    const parsedMQ = parseMonthAndYearFromQuery(q);
    return {
      searchType: "MISPUNCH",
      searchValue: mispunchStatus,
      monthNum: parsedMQ.monthNum || null,
      yearNum: parsedMQ.year || null,
      limit: 50,
      wantedFields: ["ATTENDANCE", "DETAILS"]
    };
  }

  // ── Top / Highest / Lowest Salary queries (e.g. "Top 10 employee salary batao", "highest salary", "top salaries")
  const isSalaryMentioned = /\b(salary|salaries|ve\s*tan|tankhah|ctc|gross|net|basic|pay|payroll)\b/i.test(q);
  const isTopOrRanking = /\b(top|highest|max|maximum|lowest|min|minimum|sabse\s*(?:jyada|adhik|kam)|best|rank|ranking)\b/i.test(q);

  if (isSalaryMentioned && isTopOrRanking) {
    const limitMatch = q.match(/\btop\s*(\d{1,3})\b/i) || q.match(/\b(\d{1,3})\s*(?:employees?|log|people|salaries|records?)\b/i);
    const limit = limitMatch ? parseInt(limitMatch[1], 10) : 10;
    const isLowest = /\b(lowest|min|minimum|least|sabse\s*kam)\b/i.test(q);
    const salFields = wantedFields.includes("SALARY") ? wantedFields : [...wantedFields, "SALARY"];
    return {
      searchType: "TOP_SALARY",
      searchValue: isLowest ? "LOWEST" : "HIGHEST",
      limit: Math.min(limit, 100),
      sortOrder: isLowest ? "ASC" : "DESC",
      wantedFields: salFields
    };
  }

  // If question contains aggregate, count, sum, or ranking keywords NOT related to top salary, bypass single-employee name lookup
  if (!isSalaryMentioned && /\b(sabse|highest|lowest|max|maximum|min|minimum|top|bottom|least|highest_salary|lowest_salary|kitne|kitna|kitni|total|sum|count|avg|average)\b/i.test(q)) {
    return null;
  }

  let empCode = extractEmployeeCode(q);

  // If no explicit empcode in current question, but prompt has pronouns (yahi, isi, usi, iska, iski, same, etc.)
  // or is a follow-up asking for salary/attendance, resolve empCode from session history!
  const hasPronounOrFollowUp =
    /\b(yahi|yhi|isi|isii|usi|usii|ussi|isay|usay|iska|iski|usuka|uski|unka|unki|iss|is|ise|inhe|same|this|above)\b/i.test(q) ||
    (/\b(salary|attendance|monthdays|pan|detail|details)\b/i.test(q) && !extractName(q));

  if (!empCode && hasPronounOrFollowUp && Array.isArray(history) && history.length > 0) {
    const historicalCode = resolveEmployeeFromHistory(history);
    if (historicalCode) {
      empCode = historicalCode;
    }
  }

  if (empCode) return { searchType: "EMP_CODE", searchValue: empCode, wantedFields };

  const name = extractName(q);
  if (name) return { searchType: "NAME", searchValue: name, wantedFields };

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// schemaContext: find employee master + salary file strictly
// ─────────────────────────────────────────────────────────────────────────────

const findCol = (columns = [], patterns = []) => {
  if (!patterns) return null;
  const patList = Array.isArray(patterns) ? patterns : [patterns];
  for (const c of columns) {
    const n = String(c?.name || c?.Column_Name || c || "").trim();
    if (!n) continue;
    for (const re of patList) {
      if (!re) continue;
      if (typeof re === "string") {
        if (n.toLowerCase() === re.toLowerCase() || n.toLowerCase().includes(re.toLowerCase())) return n;
      } else if (typeof re.test === "function") {
        if (re.test(n)) return n;
      }
    }
  }
  return null;
};

const findAllCols = (columns = [], patterns = []) => {
  if (!patterns) return [];
  const patList = Array.isArray(patterns) ? patterns : [patterns];
  const matches = [];
  const added = new Set();
  for (const c of columns) {
    const n = String(c?.name || c?.Column_Name || c || "").trim();
    if (!n || added.has(n.toLowerCase())) continue;
    for (const re of patList) {
      if (!re) continue;
      if (typeof re === "string") {
        if (n.toLowerCase() === re.toLowerCase()) {
          matches.push(n);
          added.add(n.toLowerCase());
          break;
        }
      } else if (typeof re.test === "function") {
        if (re.test(n)) {
          matches.push(n);
          added.add(n.toLowerCase());
          break;
        }
      }
    }
  }
  return matches;
};

const buildColCoalesceExpr = (tableAlias, cols, fallbackLabel) => {
  if (!cols || !cols.length) return null;

  const sanitizeExpr = (col) => {
    const c = `[${tableAlias}].${qIdent(col)}`;
    if (/^(pfno|pf|location)$/i.test(col)) {
      return `CASE WHEN LTRIM(RTRIM(CONVERT(varchar(1000), ${c}))) IN ('0','1','2','3','-','') THEN NULL ELSE LTRIM(RTRIM(CONVERT(varchar(1000), ${c}))) END`;
    }
    return `NULLIF(NULLIF(NULLIF(NULLIF(LTRIM(RTRIM(CONVERT(varchar(1000), ${c}))), '0'), '-'), 'N/A'), '')`;
  };

  if (cols.length === 1) {
    return `${sanitizeExpr(cols[0])} AS [${fallbackLabel}]`;
  }

  const nullIfExprs = cols.map(sanitizeExpr);
  return `COALESCE(${nullIfExprs.join(", ")}) AS [${fallbackLabel}]`;
};

const parseSchemaTableFromDoc = (doc) => {
  const ref = normalize(doc?.Source_Reference || doc?.liveInspection?.fullName || doc?.Source_Name || "");
  const clean = ref.replace(/\[|\]/g, "").split(":")[0].trim();
  if (!clean) return null;
  const parts = clean.split(".").map((x) => x.trim()).filter(Boolean);
  if (parts.length === 1) return { schema: "dbo", table: parts[0] };
  if (parts.length === 2) return { schema: parts[0], table: parts[1] };
  return null;
};

const EMP = {
  empCode: [/^empcode$/i, /^emp_code$/i, /^employee_code$/i, /^employeecode$/i, /^emp_id$/i, /^empid$/i, /^empno$/i, /^emp_no$/i, /^user_code$/i, /^usercode$/i, /^staff_code$/i, /^staffcode$/i, /^code$/i],
  first: [/^empfirstname$/i, /^firstname$/i, /^first_name$/i, /^empname$/i, /^emp_name$/i, /^employee_name$/i, /^employeename$/i, /^full_name$/i, /^fullname$/i, /^name$/i],
  last: [/^emplastname$/i, /^lastname$/i, /^last_name$/i, /^surname$/i],
  pan: [/^panno$/i, /^pan$/i, /^pan_no$/i, /^pan_number$/i, /^pannumber$/i, /^pan_card$/i, /^pancard$/i],
  pf: [
    /^pfnumber$/i,
    /^pf_number$/i,
    /^providentfundno$/i,
    /^provident_fund_no$/i,
    /^pftrust_no$/i,
    /^pftrustno$/i,
    /^uan$/i,
    /^pfno$/i,
    /^pf_no$/i,
    /^pf$/i,
    /^pfd$/i,
  ],
  mobile: [
    /^mobileno$/i, /^mobile_no$/i, /^mobile$/i, /^moble$/i, /^phone$/i, /^phoneno$/i, /^contactno$/i, /^contact$/i,
    /^father_mob$/i, /^fathercontactno$/i, /^mother_mob$/i, /^mothercontactno$/i, /^spouse_mob$/i, /^spousecontactno$/i
  ],
  address: [
    /^permanentaddress1$/i, /^permanentaddress2$/i, /^permanentaddress$/i, /^permanent_address$/i,
    /^currentaddress1$/i, /^currentaddress2$/i, /^currentaddress$/i, /^current_address$/i,
    /^address1$/i, /^address2$/i, /^address$/i, /^addr$/i, /^emp_address$/i, /^empaddress$/i, /^location$/i
  ],
  email: [/^email$/i, /^email_id$/i, /^emailid$/i, /^mail$/i, /^mail_id$/i],
  department: [/^department$/i, /^dept$/i, /^dept_name$/i, /^department_name$/i],
  designation: [/^designation$/i, /^desig$/i, /^designation_name$/i, /^role$/i],
  bankAcc: [/^bankacc$/i, /^bank_acc$/i, /^bankaccountno$/i, /^accountno$/i, /^account_no$/i, /^acc_no$/i],
  aadhar: [/^aadhar$/i, /^aadharno$/i, /^aadhar_no$/i, /^aadhaar$/i, /^uid$/i],
  dob: [/^dob$/i, /^dateofbirth$/i, /^birthdate$/i, /^birth_date$/i],
  skills: [/^skills$/i, /^skill$/i, /^employee_skills$/i, /^empskills$/i],
  joiningDate: [
    /^currentjoindate$/i,
    /^joiningdate$/i,
    /^joining_date$/i,
    /^dateofjoining$/i,
    /^doj$/i,
    /^prejoiningdate$/i,
    /^rec_date$/i,
    /^doj2$/i
  ]
};

const SAL = {
  empCode: [/^emp_code$/i, /^empcode$/i, /^employee_code$/i, /^employeecode$/i, /^emp_id$/i, /^empid$/i, /^empno$/i, /^user_code$/i, /^usercode$/i],
  month: [/^salary_month$/i, /^salmonth$/i, /^sal_month$/i, /^salmnth$/i, /^paymonth$/i, /^pay_month$/i, /^sal_mon$/i, /^monthno$/i, /^month$/i],
  year: [/^salyear$/i, /^year$/i, /^sal_year$/i],
  basic: [/^basic$/i, /^basic_salary$/i, /^basicsalary$/i, /^basic_pay$/i],
  hra: [/^hra$/i, /^hraamount$/i, /^hra_amount$/i],
  gross: [/^gross_salary$/i, /^grosssalary$/i, /^gross$/i, /^total_earn$/i, /^totalearning$/i],
  net: [/^net_salary$/i, /^netsalary$/i, /^netpay$/i, /^net_pay$/i, /^net$/i, /^amount$/i],
  earn: [/^total_earn$/i, /^totalearning$/i, /^total_earning$/i, /^gross$/i, /^gross_salary$/i, /^grosssalary$/i],
  pfDeduction: [/^pf_deduction$/i, /^pfdeduction$/i, /^pf_deduct$/i, /^pf_amt$/i, /^pfamt$/i, /^pf_amount$/i, /^pf$/i, /^pfd$/i, /^provident_fund$/i, /^providentfund$/i],
  bonus: [/^bonus_amount$/i, /^bonusamount$/i, /^bonus$/i],
  effectiveDate: [/^effective_date$/i, /^effectivedate$/i, /^rec_date$/i],
  utd: [/^utd$/i, /^srno$/i, /^id$/i],
  createdAt: [/^created_at$/i, /^createdon$/i, /^created_on$/i, /^entr_date$/i],
};

const ATT = {
  empCode: [/^emp_code$/i, /^empcode$/i, /^employee_code$/i, /^employeecode$/i, /^emp_id$/i, /^empid$/i, /^empno$/i, /^user_code$/i, /^usercode$/i],
  monthDays: [/^monthdays$/i, /^month_days$/i, /^workdays$/i, /^working_days$/i, /^month$/i, /^total_days$/i, /^dateoffice$/i],
  present: [/^present$/i, /^present_days$/i, /^presentvalue$/i, /^tot_present$/i, /^total_present$/i, /^att_days$/i],
  absent: [/^absent$/i, /^absent_days$/i, /^absentvalue$/i, /^tot_absent$/i],
  leave: [/^leave$/i, /^leaves$/i, /^leavevalue$/i, /^tot_leave$/i],
  ot: [/^ot$/i, /^overtime$/i, /^otduration$/i, /^ot_hours$/i],
  month: [/^month$/i, /^att_month$/i, /^salmonth$/i, /^dateoffice$/i],
  year: [/^year$/i, /^att_year$/i, /^salyear$/i, /^dateoffice$/i],
  created: [/^created_at$/i, /^createdon$/i, /^dateoffice$/i, /^date$/i, /^utd$/i],
};

// employee master must have empcode + firstname/empname
const pickEmpDoc = (schemaContext = []) => {
  let masterDoc = null;
  for (const doc of schemaContext || []) {
    const ref = (doc?.Source_Reference || doc?.Source_Name || "").toLowerCase();
    const cols = doc?.liveInspection?.columns || [];
    if (!cols.length) continue;

    const hasEmpCode = findCol(cols, EMP.empCode);
    const hasFirst = findCol(cols, EMP.first);

    if (hasEmpCode && hasFirst) {
      if (ref.includes("employeemaster")) return doc;
      if (!masterDoc) masterDoc = doc;
    }
  }
  return masterDoc;
};

// salary tables must have empcode + (amount/gross/basic/net/pf/effectiveDate/month/year)
const pickAllSalaryDocs = (schemaContext = []) => {
  const docs = [];
  for (const doc of schemaContext || []) {
    const cols = doc?.liveInspection?.columns || [];
    if (!cols.length) continue;

    const emp = findCol(cols, SAL.empCode);
    const amt = findCol(cols, SAL.net) || findCol(cols, SAL.basic) || findCol(cols, SAL.gross) || findCol(cols, SAL.earn) || findCol(cols, SAL.pfDeduction);
    const mon = findCol(cols, SAL.month);
    const yr = findCol(cols, SAL.year);
    const eff = findCol(cols, SAL.effectiveDate);

    if (emp && (amt || mon || yr || eff)) {
      docs.push(doc);
    }
  }
  return docs;
};

// attendance table must have empcode + (monthdays OR present)
const pickAttendanceDoc = (schemaContext = []) => {
  for (const doc of schemaContext || []) {
    const cols = doc?.liveInspection?.columns || [];
    if (!cols.length) continue;

    const emp = findCol(cols, ATT.empCode);
    const md = findCol(cols, ATT.monthDays) || findCol(cols, ATT.present);

    if (emp && md) return doc;
  }
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic SQL: BestEmp + optional OUTER APPLY latest salary & attendance by Emp_Code
// ─────────────────────────────────────────────────────────────────────────────

const buildEmployeeAndSalarySQL = ({ question, schemaContext, searchType, searchValue, wantedFields, limit = 10, sortOrder = "DESC" }) => {
  const empDoc = pickEmpDoc(schemaContext);
  if (!empDoc?.liveInspection?.columns?.length) return null;
  const empRef = parseSchemaTableFromDoc(empDoc);
  if (!empRef) return null;

  const wantsSalary =
    wantedFields.includes("SALARY") ||
    wantedFields.includes("PF") ||
    wantedFields.includes("ALL") ||
    /\b(salary|payroll|payslip|gross|net|basic|hra|ctc|earn|income|pf|pf_deduction|deduction|structure|salarystructure)\b/i.test(question);

  const wantsAttendance =
    wantedFields.includes("ATTENDANCE") ||
    wantedFields.includes("ALL") ||
    /\b(attendance|attendancetable|monthdays|month_days|punch|present|absent|leave|ot|july|august|june|may|april|march|february|january)\b/i.test(question);

  const salDocs = wantsSalary ? pickAllSalaryDocs(schemaContext) : [];

  const attDoc = wantsAttendance ? pickAttendanceDoc(schemaContext) : null;
  const attRef = attDoc ? parseSchemaTableFromDoc(attDoc) : null;

  const empCols = empDoc.liveInspection.columns;
  const cEmpCode = findCol(empCols, EMP.empCode);
  const cFirst = findCol(empCols, EMP.first);
  const cLast = findCol(empCols, EMP.last);
  const allPanCols = findAllCols(empCols, EMP.pan);
  const allPfCols = findAllCols(empCols, EMP.pf);
  const allMobileCols = findAllCols(empCols, EMP.mobile);
  const allAddrCols = findAllCols(empCols, EMP.address);
  const allEmailCols = findAllCols(empCols, EMP.email);
  const allDeptCols = findAllCols(empCols, EMP.department);
  const allDesigCols = findAllCols(empCols, EMP.designation);
  const allBankCols = findAllCols(empCols, EMP.bankAcc);
  const allAadharCols = findAllCols(empCols, EMP.aadhar);
  const allDobCols = findAllCols(empCols, EMP.dob);
  const allDojCols = findAllCols(empCols, EMP.joiningDate);
  const allSkillsCols = findAllCols(empCols, EMP.skills);

  const panExpr = buildColCoalesceExpr("E", allPanCols, "_clean_PAN");
  const pfExpr = buildColCoalesceExpr("E", allPfCols, "_clean_PF_No");
  const mobileExpr = buildColCoalesceExpr("E", allMobileCols, "_clean_MobileNo");
  const addrExpr = buildColCoalesceExpr("E", allAddrCols, "_clean_Address");
  const emailExpr = buildColCoalesceExpr("E", allEmailCols, "_clean_Email");
  const deptExpr = buildColCoalesceExpr("E", allDeptCols, "_clean_Department");
  const desigExpr = buildColCoalesceExpr("E", allDesigCols, "_clean_Designation");
  const bankExpr = buildColCoalesceExpr("E", allBankCols, "_clean_BankAccountNo");
  const aadharExpr = buildColCoalesceExpr("E", allAadharCols, "_clean_AadharNo");
  const dobExpr = buildColCoalesceExpr("E", allDobCols, "_clean_DOB");
  const dojExpr = buildColCoalesceExpr("E", allDojCols, "_clean_DateOfJoining");
  const skillsExpr = buildColCoalesceExpr("E", allSkillsCols, "_clean_Skills");

  if (!cEmpCode || !cFirst) return null;

  const nameExpr = cLast
    ? `UPPER(LTRIM(RTRIM(ISNULL([E].${qIdent(cFirst)},'') + ' ' + ISNULL([E].${qIdent(cLast)},''))))`
    : `UPPER(LTRIM(RTRIM(ISNULL([E].${qIdent(cFirst)},''))))`;

  // params
  const params = [];

  // Candidate WHERE + MatchScore
  let whereClause = "";
  let scoreExpr = "0";

  if (searchType === "BIRTHDAY") {
    const cDob = allDobCols[0] || findCol(empCols, EMP.dob) || "DOB";
    const isNumMonth = /^\d{1,2}$/.test(String(searchValue));
    const monthCond = isNumMonth
      ? `AND MONTH([E].${qIdent(cDob)}) = ${parseInt(searchValue, 10)}`
      : `AND (MONTH([E].${qIdent(cDob)}) = MONTH(GETDATE()) OR MONTH([E].${qIdent(cDob)}) = MONTH(DATEADD(month, 1, GETDATE())))`;

    whereClause = `[E].${qIdent(cDob)} IS NOT NULL AND LTRIM(RTRIM(CONVERT(varchar(50),[E].${qIdent(cDob)}))) <> '' AND [E].${qIdent(cFirst)} IS NOT NULL ${monthCond}`;
    scoreExpr = "100";
  } else if (searchType === "MISPUNCH") {
    let statusFilter = "";
    if (searchValue === "PENDING") {
      statusFilter = "AND (ISNULL([A].[MAN_APPR], 0) = 0 OR [A].[MAN_APPR] = 0 OR [A].[MAN_APPR] = 2) AND ISNULL([A].[MAN_REJ], 0) = 0";
    } else if (searchValue === "APPROVED") {
      statusFilter = "AND ([A].[MAN_APPR] = 1 OR [A].[MAN_APPR] = '1' OR UPPER(CONVERT(varchar,[A].[MAN_APPR])) = 'Y')";
    } else if (searchValue === "REJECTED") {
      statusFilter = "AND ([A].[MAN_REJ] = 1 OR [A].[MAN_REJ] = '1' OR UPPER(CONVERT(varchar,[A].[MAN_REJ])) = 'Y')";
    }

    whereClause = `[E].${qIdent(cFirst)} IS NOT NULL AND EXISTS (
      SELECT 1 FROM [dbo].[attendancetable] AS [A] WITH (NOLOCK)
      WHERE LTRIM(RTRIM(CONVERT(varchar(50),[A].[Emp_Code]))) = LTRIM(RTRIM(CONVERT(varchar(50),[E].${qIdent(cEmpCode)})))
        AND ([A].[IsManual] = 1 OR [A].[IsManual] = '1' OR [A].[mipunch_reason] IS NOT NULL OR [A].[MAN_APPR] IS NOT NULL OR [A].[MAN_REJ] IS NOT NULL)
        ${statusFilter}
    )`;
    scoreExpr = "100";
  } else if (searchType === "TOP_SALARY" || searchType === "LATEST_JOINING") {
    whereClause = `[E].${qIdent(cFirst)} IS NOT NULL AND LTRIM(RTRIM(CONVERT(varchar(50),[E].${qIdent(cFirst)}))) <> ''`;
    scoreExpr = "100";
  } else if (searchType === "EMP_CODE") {
    params.push({ name: "empCode", value: String(searchValue), type: "string" });
    whereClause = `LTRIM(RTRIM(CONVERT(varchar(50),[E].${qIdent(cEmpCode)}))) = LTRIM(RTRIM(:empCode))`;
    scoreExpr = `CASE WHEN ${whereClause} THEN 100 ELSE 0 END`;
  } else if (searchType === "MOBILE") {
    params.push({ name: "mobileVal", value: `%${String(searchValue).trim()}%`, type: "string" });
    const mobCols = allMobileCols.length ? allMobileCols : ["MOBILENO"];
    const mobConds = mobCols.map(col => `LTRIM(RTRIM(CONVERT(varchar(50),[E].${qIdent(col)}))) LIKE :mobileVal`);
    whereClause = `(${mobConds.join(" OR ")})`;
    scoreExpr = `100`;
  } else {
    const exact = cleanPossessivesAndNoise(searchValue).toUpperCase();

    const tokens = exact
      .split(/\s+/)
      .map((t) => t.trim())
      .filter((t) => t.length >= 2 && !STOP_WORDS.has(t.toLowerCase()))
      .slice(0, 5);

    if (!tokens.length) return null;

    params.push({ name: "exactName", value: exact, type: "string" });
    tokens.forEach((t, i) => params.push({ name: `token${i}`, value: `%${t}%`, type: "string" }));

    const allCond = tokens.map((_, i) => `${nameExpr} LIKE :token${i}`).join(" AND ");
    const firstLastCond = tokens.length > 1
      ? `${nameExpr} LIKE :token0 AND ${nameExpr} LIKE :token${tokens.length - 1}`
      : `${nameExpr} LIKE :token0`;

    scoreExpr = `CASE
      WHEN ${nameExpr} = :exactName THEN 100
      WHEN (${allCond})             THEN 85
      WHEN (${firstLastCond})       THEN 65
      WHEN ${nameExpr} LIKE :token0 THEN 40
      ELSE 0
    END`;

    // broad filter to avoid 0 rows, requiring first and last name token if present
    const minCond = tokens.length >= 2
      ? `${nameExpr} LIKE :token0 AND ${nameExpr} LIKE :token${tokens.length - 1}`
      : `${nameExpr} LIKE :token0`;

    whereClause = `(${nameExpr} = :exactName OR (${minCond}))`;
  }

  // CTE select (includes ALL table columns [E].* dynamically plus synthesized coalesced fields)
  const cteSelect = [
    `[E].*`,
    `[E].${qIdent(cFirst)} AS [_clean_FirstName]`,
    ...(cLast ? [`[E].${qIdent(cLast)} AS [_clean_LastName]`] : []),
    `[E].${qIdent(cEmpCode)} AS [_clean_EmployeeCode]`,
    ...(panExpr ? [panExpr] : []),
    ...(pfExpr ? [pfExpr] : []),
    ...(mobileExpr ? [mobileExpr] : []),
    ...(addrExpr ? [addrExpr] : []),
    ...(emailExpr ? [emailExpr] : []),
    ...(deptExpr ? [deptExpr] : []),
    ...(desigExpr ? [desigExpr] : []),
    ...(bankExpr ? [bankExpr] : []),
    ...(aadharExpr ? [aadharExpr] : []),
    ...(dobExpr ? [dobExpr] : []),
    ...(dojExpr ? [dojExpr] : []),
    ...(skillsExpr ? [skillsExpr] : []),
  ];

  // Multi-table salary apply (latest row per table) with COALESCE fallback
  const salaryApplyBlocks = [];
  let finalSalaryCols = [];

  const salFieldsMap = {
    Salary_Month: [],
    Salary_Year: [],
    Gross_Salary: [],
    Basic: [],
    HRA: [],
    Total_Earn: [],
    PF_Deduction: [],
    Bonus_Amount: [],
    Effective_Date: [],
  };

  for (let idx = 0; idx < salDocs.length; idx++) {
    const salDoc = salDocs[idx];
    const salRef = parseSchemaTableFromDoc(salDoc);
    if (!salRef) continue;

    const salCols = salDoc?.liveInspection?.columns || [];
    const sEmp = findCol(salCols, SAL.empCode);
    if (!sEmp) continue;

    const alias = `S${idx + 1}`;
    const sMonth = findCol(salCols, SAL.month);
    const sYear = findCol(salCols, SAL.year);
    const sBasic = findCol(salCols, SAL.basic);
    const sHra = findCol(salCols, SAL.hra);
    const sGross = findCol(salCols, SAL.gross);
    const sEarn = findCol(salCols, SAL.earn);
    const sNet = findCol(salCols, SAL.net);
    const sPfD = findCol(salCols, SAL.pfDeduction);
    const sBonus = findCol(salCols, SAL.bonus);
    const sEff = findCol(salCols, SAL.effectiveDate);
    const sCreated = findCol(salCols, SAL.createdAt);

    const salSelect = [];
    if (sMonth) { salSelect.push(`[${alias}].${qIdent(sMonth)} AS [Salary_Month]`); salFieldsMap.Salary_Month.push(`[${alias}].[Salary_Month]`); }
    if (sYear) { salSelect.push(`[${alias}].${qIdent(sYear)} AS [Salary_Year]`); salFieldsMap.Salary_Year.push(`[${alias}].[Salary_Year]`); }
    if (sGross || sEarn) { salSelect.push(`[${alias}].${qIdent(sGross || sEarn)} AS [Gross_Salary]`); salFieldsMap.Gross_Salary.push(`[${alias}].[Gross_Salary]`); }
    if (sBasic) { salSelect.push(`[${alias}].${qIdent(sBasic)} AS [Basic]`); salFieldsMap.Basic.push(`[${alias}].[Basic]`); }
    if (sHra) { salSelect.push(`[${alias}].${qIdent(sHra)} AS [HRA]`); salFieldsMap.HRA.push(`[${alias}].[HRA]`); }
    if (sNet || sEarn || sGross) { salSelect.push(`[${alias}].${qIdent(sNet || sEarn || sGross)} AS [Total_Earn]`); salFieldsMap.Total_Earn.push(`[${alias}].[Total_Earn]`); }
    if (sPfD) { salSelect.push(`[${alias}].${qIdent(sPfD)} AS [PF_Deduction]`); salFieldsMap.PF_Deduction.push(`[${alias}].[PF_Deduction]`); }
    if (sBonus) { salSelect.push(`[${alias}].${qIdent(sBonus)} AS [Bonus_Amount]`); salFieldsMap.Bonus_Amount.push(`[${alias}].[Bonus_Amount]`); }
    if (sEff) { salSelect.push(`[${alias}].${qIdent(sEff)} AS [Effective_Date]`); salFieldsMap.Effective_Date.push(`[${alias}].[Effective_Date]`); }

    if (!salSelect.length) continue;

    let salOrder = "";
    if (sEff) salOrder = `ORDER BY [${alias}].${qIdent(sEff)} DESC`;
    else if (sYear && sMonth) salOrder = `ORDER BY TRY_CONVERT(int,[${alias}].${qIdent(sYear)}) DESC, TRY_CONVERT(int,[${alias}].${qIdent(sMonth)}) DESC`;
    else if (sCreated) salOrder = `ORDER BY [${alias}].${qIdent(sCreated)} DESC`;

    salaryApplyBlocks.push(`
OUTER APPLY (
  SELECT TOP 1
    ${salSelect.join(",\n    ")}
  FROM ${qIdent(salRef.schema)}.${qIdent(salRef.table)} AS [${alias}] WITH (NOLOCK)
  WHERE LTRIM(RTRIM(CONVERT(varchar(50),[${alias}].${qIdent(sEmp)}))) =
        LTRIM(RTRIM(CONVERT(varchar(50),ISNULL(BestEmp.[_clean_EmployeeCode], BestEmp.[EMPCODE]))))
  ${salOrder}
) AS [${alias}]
`.trim());
  }

  finalSalaryCols = Object.entries(salFieldsMap)
    .filter(([_, exprs]) => exprs.length > 0)
    .map(([fieldName, exprs]) => {
      if (exprs.length === 1) {
        return `${exprs[0]} AS [${fieldName}]`;
      }
      return `COALESCE(${exprs.join(", ")}) AS [${fieldName}]`;
    });

  // attendance apply (latest row or month aggregation) - ALWAYS by Emp_Code
  let attendanceApply = "";
  let finalAttCols = [];

  if (wantsAttendance && attDoc?.liveInspection?.columns?.length && attRef) {
    const attCols = attDoc.liveInspection.columns;

    const aEmp = findCol(attCols, ATT.empCode);
    const aMonthDays = findCol(attCols, ATT.monthDays);
    const aPresent = findCol(attCols, ATT.present);
    const aAbsent = findCol(attCols, ATT.absent);
    const aLeave = findCol(attCols, ATT.leave);
    const aOt = findCol(attCols, ATT.ot);
    const aMonth = findCol(attCols, ATT.month);
    const aYear = findCol(attCols, ATT.year);
    const aCreated = findCol(attCols, ATT.created);

    if (aEmp) {
      let attMonthNum = null;
      for (const [word, num] of Object.entries(MONTH_MAP)) {
        if (new RegExp(`\\b${word}\\b`, "i").test(question)) {
          attMonthNum = num;
          break;
        }
      }
      const attYearMatch = question.match(/\b(20\d{2})\b/);
      const attYearNum = attYearMatch ? parseInt(attYearMatch[1], 10) : null;

      const isDailyTable = aPresent === "presentvalue" || aMonthDays === "dateoffice" || attRef.table.toLowerCase() === "attendancetable";

      if (isDailyTable) {
        const dateConds = [];
        const dateColName = aMonthDays || aMonth || "dateoffice";
        if (attMonthNum) {
          params.push({ name: "attMonthNum", value: attMonthNum, type: "number" });
          dateConds.push(`MONTH([A].${qIdent(dateColName)}) = :attMonthNum`);
        }
        if (attYearNum) {
          params.push({ name: "attYearNum", value: attYearNum, type: "number" });
          dateConds.push(`YEAR([A].${qIdent(dateColName)}) = :attYearNum`);
        }

        const dateWhere = dateConds.length ? `AND ${dateConds.join(" AND ")}` : "";

        attendanceApply = `
OUTER APPLY (
  SELECT
    COUNT(*) AS [Monthdays],
    SUM(ISNULL([A].${qIdent(aPresent || "presentvalue")}, 0)) AS [Present],
    ${aAbsent ? `SUM(ISNULL([A].${qIdent(aAbsent)}, 0)) AS [Absent],` : "0 AS [Absent],"}
    ${aLeave ? `SUM(ISNULL([A].${qIdent(aLeave)}, 0)) AS [Leave],` : "0 AS [Leave],"}
    ${attMonthNum ? `${attMonthNum} AS [Att_Month],` : ""}
    ${attYearNum ? `${attYearNum} AS [Att_Year]` : `MAX(YEAR([A].${qIdent(dateColName)})) AS [Att_Year]`}
  FROM ${qIdent(attRef.schema)}.${qIdent(attRef.table)} AS [A] WITH (NOLOCK)
  WHERE LTRIM(RTRIM(CONVERT(varchar(50),[A].${qIdent(aEmp)}))) =
        LTRIM(RTRIM(CONVERT(varchar(50),ISNULL(BestEmp.[_clean_EmployeeCode], BestEmp.[EMPCODE]))))
  ${dateWhere}
) AS [A]
`.trim();

        finalAttCols = [
          "[A].[Monthdays]",
          "[A].[Present]",
          "[A].[Absent]",
          "[A].[Leave]",
          ...(attMonthNum ? ["[A].[Att_Month]"] : []),
          "[A].[Att_Year]",
        ];
      } else {
        const attSelect = [];
        if (aMonthDays) attSelect.push(`[A].${qIdent(aMonthDays)} AS [Monthdays]`);
        if (aPresent) attSelect.push(`[A].${qIdent(aPresent)} AS [Present]`);
        if (aAbsent) attSelect.push(`[A].${qIdent(aAbsent)} AS [Absent]`);
        if (aLeave) attSelect.push(`[A].${qIdent(aLeave)} AS [Leave]`);
        if (aOt) attSelect.push(`[A].${qIdent(aOt)} AS [OT]`);
        if (aMonth) attSelect.push(`[A].${qIdent(aMonth)} AS [Att_Month]`);
        if (aYear) attSelect.push(`[A].${qIdent(aYear)} AS [Att_Year]`);

        let attOrder = "";
        if (aYear && aMonth) attOrder = `ORDER BY TRY_CONVERT(int,[A].${qIdent(aYear)}) DESC, TRY_CONVERT(int,[A].${qIdent(aMonth)}) DESC`;
        else if (aCreated) attOrder = `ORDER BY [A].${qIdent(aCreated)} DESC`;

        attendanceApply = `
OUTER APPLY (
  SELECT TOP 1
    ${attSelect.length ? attSelect.join(",\n    ") : "1 AS [AttRow]"}
  FROM ${qIdent(attRef.schema)}.${qIdent(attRef.table)} AS [A] WITH (NOLOCK)
  WHERE LTRIM(RTRIM(CONVERT(varchar(50),[A].${qIdent(aEmp)}))) =
        LTRIM(RTRIM(CONVERT(varchar(50),ISNULL(BestEmp.[_clean_EmployeeCode], BestEmp.[EMPCODE]))))
  ${attOrder}
) AS [A]
`.trim();

        finalAttCols = attSelect
          .map((line) => {
            const m = line.match(/AS\s+\[(.+?)\]\s*$/i);
            return m?.[1] ? `[A].[${m[1]}]` : null;
          })
          .filter(Boolean);
      }
    }
  }

  const finalSelect = [
    "BestEmp.*",
    `ISNULL(BestEmp.[_clean_FirstName], BestEmp.${qIdent(cFirst)}) AS [FirstName]`,
    ...(cLast ? [`ISNULL(BestEmp.[_clean_LastName], BestEmp.${qIdent(cLast)}) AS [LastName]`] : []),
    `ISNULL(BestEmp.[_clean_EmployeeCode], BestEmp.${qIdent(cEmpCode)}) AS [EmployeeCode]`,
    ...(allPanCols.length ? ["BestEmp.[_clean_PAN] AS [PAN]"] : []),
    ...(allPfCols.length ? ["BestEmp.[_clean_PF_No] AS [PF_No]"] : []),
    ...(allMobileCols.length ? ["BestEmp.[_clean_MobileNo] AS [MobileNo]"] : []),
    ...(allAddrCols.length ? ["BestEmp.[_clean_Address] AS [Address]"] : []),
    ...(allEmailCols.length ? ["BestEmp.[_clean_Email] AS [Email]"] : []),
    ...(allDeptCols.length ? ["BestEmp.[_clean_Department] AS [Department]"] : []),
    ...(allDesigCols.length ? ["BestEmp.[_clean_Designation] AS [Designation]"] : []),
    ...(allBankCols.length ? ["BestEmp.[_clean_BankAccountNo] AS [BankAccountNo]"] : []),
    ...(allAadharCols.length ? ["BestEmp.[_clean_AadharNo] AS [AadharNo]"] : []),
    ...(allDobCols.length ? ["BestEmp.[_clean_DOB] AS [DOB]"] : []),
    ...(allDojCols.length ? ["BestEmp.[_clean_DateOfJoining] AS [DateOfJoining]"] : []),
    ...(allSkillsCols.length ? ["BestEmp.[_clean_Skills] AS [Skills]"] : []),
    ...finalSalaryCols,
    ...finalAttCols,
  ];

  const topLimit = (searchType === "BIRTHDAY" || searchType === "MISPUNCH") ? 50 : searchType === "TOP_SALARY" ? (limit || 10) : searchType === "LATEST_JOINING" ? 25 : searchType === "MOBILE" ? 50 : 1;
  const cteTopLimit = (searchType === "BIRTHDAY" || searchType === "MISPUNCH") ? 100 : searchType === "TOP_SALARY" ? Math.max((limit || 10) * 10, 100) : searchType === "LATEST_JOINING" ? 100 : topLimit;

  let empOrderBy = "";
  if (searchType === "BIRTHDAY") {
    const cDob = allDobCols[0] || findCol(empCols, EMP.dob) || "DOB";
    empOrderBy = `ORDER BY MONTH([E].${qIdent(cDob)}) ASC, DAY([E].${qIdent(cDob)}) ASC`;
  } else if (searchType === "MISPUNCH") {
    empOrderBy = `ORDER BY [E].${qIdent(cFirst)} ASC`;
  } else if (searchType === "LATEST_JOINING") {
    const candidateDateCols = ["CURRENTJOINDATE", "PREJOININGDATE", "Rec_Date", "DOJ2", "CREATED_ON", "APPLICATION_DATE", "Interview_Date"]
      .filter(col => empCols.some(ec => ec.name.toUpperCase() === col.toUpperCase()))
      .map(col => `[E].${qIdent(col)}`);

    const hasCurrentJoin = empCols.some(ec => ec.name.toUpperCase() === "CURRENTJOINDATE");
    const casePrefix = hasCurrentJoin ? "CASE WHEN [E].[CURRENTJOINDATE] IS NOT NULL THEN 0 ELSE 1 END, " : "";

    const dateCoalesce = candidateDateCols.length ? `COALESCE(${candidateDateCols.join(", ")}) DESC` : "";

    const utdCol = empCols.find(ec => /^utd$/i.test(ec.name) || /^srno$/i.test(ec.name) || /^tran_id$/i.test(ec.name));
    const tieBreaker = utdCol ? `, [E].${qIdent(utdCol.name)} DESC` : "";

    if (dateCoalesce) {
      empOrderBy = `ORDER BY ${casePrefix}${dateCoalesce}${tieBreaker}`;
    } else if (tieBreaker) {
      empOrderBy = `ORDER BY [E].${qIdent(utdCol.name)} DESC`;
    }
  }

  let salaryOrderBy = "";
  if (searchType === "TOP_SALARY") {
    const salColsForSort = [
      ...salFieldsMap.Gross_Salary,
      ...salFieldsMap.Total_Earn,
      ...salFieldsMap.Basic,
    ];
    if (salColsForSort.length > 0) {
      salaryOrderBy = `ORDER BY ISNULL(COALESCE(${salColsForSort.join(", ")}), 0) ${sortOrder || "DESC"}`;
    }
  }

  const sql = `
WITH EmpCandidates AS (
  SELECT TOP (${cteTopLimit})
    ${cteSelect.join(",\n    ")},
    ${scoreExpr} AS [MatchScore]
  FROM ${qIdent(empRef.schema)}.${qIdent(empRef.table)} AS [E] WITH (NOLOCK)
  WHERE ${whereClause}
  ${empOrderBy}
),
BestEmp AS (
  SELECT TOP (${cteTopLimit}) *
  FROM EmpCandidates
)
SELECT TOP (${topLimit})
  ${finalSelect.join(",\n  ")}
FROM BestEmp
${salaryApplyBlocks.join("\n")}
${attendanceApply}
${salaryOrderBy}
`.trim();

  return { sql, parameters: params };
};

// ─────────────────────────────────────────────────────────────────────────────
// Deterministic dispatcher
// ─────────────────────────────────────────────────────────────────────────────

// Reminder SQL Generator
// const MONTH_MAP = {
//   january: 1, jan: 1, february: 2, feb: 2, march: 3, mar: 3, april: 4, apr: 4,
//   may: 5, june: 6, jun: 6, july: 7, jul: 7, august: 8, aug: 8,
//   september: 9, sep: 9, sept: 9, october: 10, oct: 10, november: 11, nov: 11, december: 12, dec: 12,
// };

const buildReminderQuerySQL = ({ question, schemaContext = [] }) => {
  const q = normalizeQ(question);
  if (!/\b(reminder|reminders|pending\s*reminder|service\s*reminder|haazri|hazri)\b/i.test(q)) {
    return null;
  }

  let remDoc = (schemaContext || []).find((doc) =>
    /reminder/i.test(doc?.Source_Name || doc?.Source_Reference || "")
  );

  const ref = remDoc ? parseSchemaTableFromDoc(remDoc) : { schema: "dbo", table: "Srv_Reminder_Tbl" };

  const isCount = /\b(count|total|kitne|kitni|how\s*many|number\s*of|kul)\b/i.test(q);
  const isPending = /\b(pending|open|due|baki|baaki|unresolved)\b/i.test(q);

  let monthNum = null;
  for (const [word, num] of Object.entries(MONTH_MAP)) {
    if (new RegExp(`\\b${word}\\b`, "i").test(q)) {
      monthNum = num;
      break;
    }
  }

  const yearMatch = q.match(/\b(20\d{2})\b/);
  const yearNum = yearMatch ? parseInt(yearMatch[1], 10) : null;

  const whereConds = [];
  const params = [];

  if (isPending) {
    whereConds.push("UPPER(LTRIM(RTRIM([Reminder_Status]))) = 'PENDING'");
  }

  if (monthNum) {
    whereConds.push("(MONTH([Reminder_Date]) = :monthNum OR MONTH([Final_Due_Date]) = :monthNum OR MONTH([Created_At]) = :monthNum)");
    params.push({ name: "monthNum", value: monthNum, type: "number" });
  }

  if (yearNum) {
    whereConds.push("(YEAR([Reminder_Date]) = :yearNum OR YEAR([Final_Due_Date]) = :yearNum OR YEAR([Created_At]) = :yearNum)");
    params.push({ name: "yearNum", value: yearNum, type: "number" });
  }

  const whereClause = whereConds.length ? `WHERE ${whereConds.join(" AND ")}` : "";

  if (isCount) {
    const sql = `
SELECT COUNT_BIG(1) AS [ReminderCount]
FROM [${ref.schema}].[${ref.table}] AS [R] WITH (NOLOCK)
${whereClause.replace(/\[/g, "[R].[")}
`.trim();

    return {
      canAnswer: true,
      intent: "BUSINESS_REPORT",
      sensitivity: "NORMAL",
      sql,
      parameters: params,
      explanation: `Count ${isPending ? "pending " : ""}reminders for ${monthNum ? "month " + monthNum : "specified period"}.`,
      deterministic: true,
    };
  }

  const qualifiedWhere = whereClause
    ? whereClause
        .replace(/\[Reminder_Status\]/g, "[R].[Reminder_Status]")
        .replace(/\[Reminder_Date\]/g, "[R].[Reminder_Date]")
        .replace(/\[Final_Due_Date\]/g, "[R].[Final_Due_Date]")
        .replace(/\[Created_At\]/g, "[R].[Created_At]")
    : "";

  const sql = `
SELECT TOP 100
  [R].[UTD] AS [Reminder_UTD],
  [R].[Reminder_Date],
  [R].[Reminder_Type],
  [R].[Reminder_Status],
  [R].[Final_Due_Date],
  ISNULL([V].[Veh_Reg_No], 'N/A') AS [Vehicle_No],
  ISNULL([V].[Cust_Name], 'N/A') AS [Customer_Name],
  ISNULL([V].[Cust_Mob], 'N/A') AS [Customer_Mobile],
  ISNULL([V].[srv_exec_Emp_Code], [R].[Created_By]) AS [EmployeeCode],
  ISNULL([V].[srv_exec_name], LTRIM(RTRIM(ISNULL([E].[EMPFIRSTNAME],'') + ' ' + ISNULL([E].[EMPLASTNAME],'')))) AS [EmployeeName],
  ISNULL([V].[srv_exec_mobile], [E].[MOBILENO]) AS [MobileNo]
FROM [${ref.schema}].[${ref.table}] AS [R] WITH (NOLOCK)
LEFT JOIN [dbo].[Srv_Cust_Vehi_Tbl] AS [V] WITH (NOLOCK) ON [V].[UTD] = [R].[Cust_Vehi_UTD]
LEFT JOIN [dbo].[EMPLOYEEMASTER] AS [E] WITH (NOLOCK) ON LTRIM(RTRIM(CONVERT(varchar(50),[E].[EMPCODE]))) = LTRIM(RTRIM(CONVERT(varchar(50),ISNULL([V].[srv_exec_Emp_Code], [R].[Created_By]))))
${qualifiedWhere}
ORDER BY [R].[Reminder_Date] DESC
`.trim();

  return {
    canAnswer: true,
    intent: "BUSINESS_REPORT",
    sensitivity: "NORMAL",
    sql,
    parameters: params,
    explanation: `List ${isPending ? "pending " : ""}reminders with Executive (EmpCode, Mobile, Name) and Customer/Vehicle details.`,
    deterministic: true,
  };
};

const buildNewJoiningQuerySQL = ({ question, schemaContext }) => {
  const q = normalizeQ(question);

  const isNewJoining = /\b(new\s*joining|new_joining|joining\s*candidate|joining\s*table|candidate\s*joining)\b/i.test(q) ||
    (/\b(joining|joiner|joiners)\b/i.test(q) && /\b(table|schema|candidate|candidates|recruitment|count|total|kitne|kitna)\b/i.test(q));

  if (!isNewJoining) return null;

  // If question mentions a specific person name (e.g. Prashant Narahari Dawange),
  // DO NOT run candidate count/list plan; let single employee search handle it!
  const targetName = extractName(q);
  const isRealPersonName = targetName && targetName.length >= 3 && !/^(TOTAL|CANDIDATE|CANDIDATES|JOINING|EMPLOYEE|NEW|ALL|LIST|COUNT)$/i.test(targetName);
  if (isRealPersonName) {
    return null;
  }

  const isCountQuery = /\b(count|total|kitne|kitna|how\s*many|sum)\b/i.test(q) && !/\b(number|no|mobile|phone|whatsapp)\b/i.test(q);

  if (isCountQuery) {
    return {
      canAnswer: true,
      intent: "NEW_JOINING_COUNT",
      sensitivity: "NORMAL",
      sql: `SELECT
  COUNT(*) AS [Total_New_Joining_Count],
  SUM(CASE WHEN [EMPCODE] IS NOT NULL AND LTRIM(RTRIM(CONVERT(varchar(50), [EMPCODE]))) <> '' THEN 1 ELSE 0 END) AS [Joined_Employees_Count],
  SUM(CASE WHEN [EMPCODE] IS NULL OR LTRIM(RTRIM(CONVERT(varchar(50), [EMPCODE]))) = '' THEN 1 ELSE 0 END) AS [Pending_Candidates_Count]
FROM [dbo].[NEW_JOINING] WITH (NOLOCK)`.trim(),
      parameters: [],
      explanation: "Calculate total candidate and new joining counts from dbo.NEW_JOINING table",
      deterministic: true,
    };
  }

  return {
    canAnswer: true,
    intent: "NEW_JOINING_LIST",
    sensitivity: "NORMAL",
    sql: `SELECT TOP 50
  [TRAN_ID] AS [TransactionID],
  [NAME] AS [CandidateName],
  [MOB_NO] AS [MobileNo],
  [DESIGNATION] AS [Designation],
  [ADDRESS] AS [Address],
  [APPLICATION_DATE] AS [ApplicationDate],
  [HIGH_QUAL] AS [Qualification],
  [CURRENT_CTC] AS [CurrentCTC],
  [EXPECTED_CTC] AS [ExpectedCTC],
  [EMPCODE] AS [EmployeeCode]
FROM [dbo].[NEW_JOINING] WITH (NOLOCK)
ORDER BY [TRAN_ID] DESC`.trim(),
    parameters: [],
    explanation: "Fetch candidate recruitment details from dbo.NEW_JOINING table",
    deterministic: true,
  };
};

const buildDeterministicPlan = ({ question, schemaContext, history = [] }) => {
  const q = normalizeQ(question);

  // Check reminder plan first if reminder requested
  const remPlan = buildReminderQuerySQL({ question: q, schemaContext });
  if (remPlan) return remPlan;

  // Check new joining candidate plan if new joining requested
  const njPlan = buildNewJoiningQuerySQL({ question: q, schemaContext });
  if (njPlan) return njPlan;

  const isLatestJoining = /\b(latest|recent|new\s*join|new\s*joining|new\s*joiner|new\s*joiners|naye\s*emp|hal\s*hi\s*me|joining\s*list)\b/i.test(q);
  if (isLatestJoining) {
    const sqlObj = buildEmployeeAndSalarySQL({
      question: q,
      schemaContext: Array.isArray(schemaContext) ? schemaContext : [],
      searchType: "LATEST_JOINING",
      searchValue: "",
      wantedFields: ["DETAILS"]
    });
    if (sqlObj) {
      return {
        canAnswer: true,
        intent: "EMPLOYEE_RECORD",
        sensitivity: "NORMAL",
        sql: sqlObj.sql,
        parameters: sqlObj.parameters || [],
        explanation: "Fetch latest new joining employees list and details",
        deterministic: true
      };
    }
  }

  // ── Generic Dynamic Check: If vector retrieval returned any non-master domain table ──────
  // (e.g. Employee_Education, Asset_Issue, Employee_Training, Vendor_Invoice, etc.)
  // bypass deterministic master lookup so databaseEvidenceService queries the domain table dynamically.
  const isSalaryQuery = /\b(salary|salaries|payroll|payslip|gross|net|basic|hra|ctc|tankhah)\b/i.test(q);

  const hasCustomDomainTable = Array.isArray(schemaContext) && schemaContext.some((doc) => {
    const src = String(doc.Source_Name || doc.Source_Reference || "").toLowerCase();
    return src && !/employeemaster|shortlisted_candidate|salaryfile|salary_file|salarystructure|salary_structure|salary_prior|attendancetable/i.test(src);
  });

  const isDomainQuery = (hasCustomDomainTable && !isSalaryQuery) || /\b(education|qualification|qualifications|college|degree|board|university|passing\s*year|percentage|score|padh|padha|pada|padhai|siksha|shiksha|asset|assets|aset|item|items|device|devices|laptop|laptops|computer|equipment|issue|issued|revoke|revoked|allot|allotted|assign|assigned|assignment|vehicle|vehicles|gadi|gaadi|car|bike|service|servicing|repair|insurance|puc|fitness|permit|experience|previous\s*company)\b/i.test(q);

  if (isDomainQuery) {
    if (DEV) console.log("[SQLGen] Domain query / custom table detected — bypassing deterministic planner → databaseEvidenceService");
    return null;
  }

  // Only handle employee/pan/salary/attendance/mobile/address/dept/email/bank/aadhar/dob style queries deterministically here
  if (!/\b(employee|emp|empcode|employee\s*code|pan|pf|salary|gross|net|basic|hra|ctc|attendance|attendancetable|monthdays|address|permanentaddress|currentaddress|pata|location|email|department|dept|designation|role|bank|account|aadhar|uid|dob|joining|doj|naam|name|code|mobile|mobileno|phone|contact|yahi|yhi|iska|iski|usuka|uski|same|this|above)\b/i.test(q) && !/\b[A-Za-z0-9]{4,14}\b/.test(q)) {
    return null;
  }

  const intent = detectEmployeeSearchIntent(q, history);
  if (!intent) return null;

  const plan = buildEmployeeAndSalarySQL({
    question: q,
    schemaContext: Array.isArray(schemaContext) ? schemaContext : [],
    searchType: intent.searchType,
    searchValue: intent.searchValue,
    wantedFields: intent.wantedFields,
    limit: intent.limit || 10,
    sortOrder: intent.sortOrder || "DESC",
  });

  if (!plan?.sql) {
    return null;
  }

  if (DEV) {
    console.log("[SQLGen] Deterministic employee+salary:", {
      searchType: intent.searchType,
      searchValue: intent.searchValue,
      wantedFields: intent.wantedFields,
    });
  }

  return {
    canAnswer: true,
    intent: "EMPLOYEE_LOOKUP",
    sensitivity: "PERSONAL",
    sql: plan.sql,
    parameters: plan.parameters || [],
    explanation: `Employee lookup (${intent.searchType}) with optional latest salary (by Emp_Code).`,
    reason: null,
    deterministic: true,
    model: null,
    providerResponseId: null,
    usage: null,
    searchMeta: {
      searchType: intent.searchType,
      searchValue: intent.searchValue,
      wantedFields: intent.wantedFields,
    },
  };
};

// ─────────────────────────────────────────────────────────────────────────────
// GPT fallback
// ─────────────────────────────────────────────────────────────────────────────

const buildPrompt = ({ userContext, schemaContext, route, correctionHint }) => {
  const scope = getAccessScope(userContext);

  // Compact schema formatter to keep token count extremely low for 2000-5000 table DBs
  const schemaText = (schemaContext || [])
    .slice(0, 6) // Limit to top 6 relevant tables max
    .map((item, i) => {
      const ref = item?.Source_Reference || item?.Source_Name || `Table_${i + 1}`;
      const content = normalize(item?.Chunk_Content ?? item?.Document_Content ?? "");
      const liveCols = item?.liveInspection?.columns?.map((c) => `${c.name} (${c.dataType})`).join(", ");
      const meta = item?.knowledgeMeta || {};
      const joinMeta = meta.joinKey || meta.employeeCodeColumn;
      const metaText = joinMeta ? ` [Primary Join Key: ${joinMeta}${meta.secondaryJoinKey ? `, Secondary: ${meta.secondaryJoinKey}` : ""}]` : "";

      return `[Table ${i + 1}]: ${ref} (${item?.Module_Name || "ERP"})${metaText}
${liveCols ? `Columns: ${liveCols}` : content.slice(0, 1200)}`;
    })
    .join("\n\n");

  const routeHints = route
    ? `Router hints:
- Detected tables: ${(route.tables || []).join(", ") || "none"}
- Needs salary: ${Boolean(route.needsSalary)}`
    : "";

  const correctionText = correctionHint
    ? `⚠️ PREVIOUS SQL FAILED: Column(s) not found: ${correctionHint}
Re-check Live Columns carefully. Only use columns explicitly listed.`
    : "";

  return `You are a Microsoft SQL Server read-only query planner for an ERP system with 5000+ tables.

AUTHENTICATED USER:
- Company: ${userContext.compcode} | UserCode: ${userContext.employeeCode || userContext.userCode || "Unknown"} | Scope: ${scope}

${routeHints}
${correctionText}

AUTHORIZED DATABASE KNOWLEDGE:
${schemaText || "No schema provided."}

RULES:
1. Generate valid, efficient MSSQL SELECT queries ONLY.
2. Use parameter replacements (:paramName) for all filter values.
3. Use ONLY verified tables and columns listed above. If joining tables (e.g. EMPLOYEEMASTER with a domain table), use the table's indicated Primary Join Key (e.g. Emp_Code = EMPCODE).
4. Always include TOP clause (e.g. TOP 100).
5. Never execute dynamic SQL, sp_executesql, or DDL/DML statements.

Return structured SQL plan JSON.`.trim();
};

const openAISQLPlan = async ({ question, userContext, schemaContext, route, correctionHint }) => {
  const model = normalize(process.env.OPENAI_SQL_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini");

  const findRefusal = (response) =>
    response?.output?.flatMap((i) => i?.content || [])?.find((c) => c?.type === "refusal")?.refusal;

  try {
    const response = await getOpenAIClient().responses.parse({
      model,
      instructions: buildPrompt({ userContext, schemaContext, route, correctionHint }),
      input: [{ role: "user", content: [{ type: "input_text", text: normalizeQ(question) }] }],
      reasoning: { effort: "low" },
      text: { format: zodTextFormat(SQLPlanSchema, "erp_sql_plan") },
      max_output_tokens: Number(process.env.OPENAI_SQL_MAX_OUTPUT_TOKENS || 2500),
    });

    if (response.status === "incomplete") throw new ApiError(502, "AI could not complete the SQL plan");

    const refusal = findRefusal(response);
    if (refusal) throw new ApiError(422, refusal);

    const plan = response.output_parsed;
    if (!plan) throw new ApiError(502, "AI returned invalid SQL plan");

    return {
      ...plan,
      deterministic: false,
      model,
      providerResponseId: response.id || null,
      usage: response.usage || null,
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error?.status === 429) throw new ApiError(429, "AI request limit exceeded");
    throw new ApiError(502, "Unable to generate database query");
  }
};

// ─── Main Export ──────────────────────────────────────────────────────────────

const generateSQLPlan = exports.generateSQLPlan = async ({
  question,
  userContext,
  schemaContext = [],
  route = null,
  correctionHint = null,
  history = [],
}) => {
  const q = normalizeQ(question);

  if (!q) throw new ApiError(400, "Question is required");
  if (!userContext?.compcode) throw new ApiError(400, "User context required");

  if (!correctionHint) {
    const fixed = buildDeterministicPlan({
      question: q,
      schemaContext: Array.isArray(schemaContext) ? schemaContext : [],
      history,
    });

    if (fixed) return fixed;
  }

  if (!schemaContext.length) {
    return {
      canAnswer: false,
      intent: "UNSUPPORTED",
      sensitivity: "NORMAL",
      sql: null,
      parameters: [],
      explanation: "No authorized database schema found.",
      reason: "Schema not found",
      deterministic: false,
      model: null,
      providerResponseId: null,
      usage: null,
    };
  }

  return openAISQLPlan({ question: q, userContext, schemaContext, route, correctionHint });
};









// ─── Forbidden Patterns ───────────────────────────────────────────────────────

/** Destructive ya unsafe SQL operations */
const FORBIDDEN_SQL_PATTERN =
  /\b(INSERT|UPDATE|DELETE|DROP|ALTER|CREATE|TRUNCATE|MERGE|EXEC|EXECUTE|GRANT|REVOKE|DENY|DBCC|BACKUP|RESTORE|BULK|OPENROWSET|OPENDATASOURCE|WAITFOR|SHUTDOWN|KILL)\b/i;

/** SELECT ... INTO bhi database me object create kar sakta hai */
const SELECT_INTO_PATTERN = /\bSELECT\b[\s\S]*?\bINTO\b/i;

/** System objects direct query se block rahenge */
const SYSTEM_OBJECT_PATTERN =
  /\b(sys\.|information_schema|master\.|msdb\.|tempdb\.|model\.)/i;

// ─── Validation Rules ─────────────────────────────────────────────────────────

/**
 * Valid parameter names:
 * location | userCode | mobileNumber
 */
const VALID_PARAMETER_NAME = /^[A-Za-z][A-Za-z0-9_]*$/;

const ALLOWED_PARAMETER_TYPES = new Set([
  "string",
  "number",
  "boolean",
  "date",
  "null",
]);

// ─── Utility Helpers ──────────────────────────────────────────────────────────

// const normalizeValue = (value) => String(value ?? "").trim();

/**
 * SQL comments remove karta hai.
 * Supported: -- single-line | slash-star block star-slash
 */
const stripSQLComments = (sql) =>
  normalizeValue(sql)
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/--[^\r\n]*/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * AI kabhi parameter name mein ":location" bhej deta hai.
 * SQL placeholder mein colon required hai: WHERE Loc_Code = :location
 * Lekin parameter map key: location hona chahiye.
 */
const normalizeParameterName = (value) =>
  normalizeValue(value).replace(/^:+/, "").trim();

const normalizeParameterType = (value) => {
  const normalizedType = normalizeValue(value || "string").toLowerCase();
  return ALLOWED_PARAMETER_TYPES.has(normalizedType) ? normalizedType : "string";
};

const startsWithReadOnlySQL = (sql) => /^(SELECT|WITH)\b/i.test(sql);

const containsSelectStatement = (sql) => /\bSELECT\b/i.test(sql);

/**
 * Ending semicolon allowed hai.
 * Beech me semicolon = multiple statements.
 */
const containsMultipleStatements = (sql) => {
  const withoutFinalSemicolon = sql.endsWith(";") ? sql.slice(0, -1) : sql;
  return withoutFinalSemicolon.includes(";");
};

/**
 * SQL se named placeholders extract karta hai.
 *
 * Example:
 *   WHERE Loc_Code = :location AND EMPCODE = :employeeCode
 * Result:
 *   ["location", "employeeCode"]
 */
const extractSQLParameterNames = (sql) => {
  const matches = [...sql.matchAll(/:([A-Za-z][A-Za-z0-9_]*)\b/g)];
  return [...new Set(matches.map((match) => match[1]))];
};

// ─── Parameter Normalization ──────────────────────────────────────────────────

const normalizeParameters = (parameters = []) => {
  if (!Array.isArray(parameters)) {
    throw new ApiError(400, "SQL parameters must be an array");
  }

  const parameterMap = {};

  for (let index = 0; index < parameters.length; index += 1) {
    const parameter = parameters[index];
    const rawName   = normalizeValue(parameter?.name);
    const name      = normalizeParameterName(rawName);

    if (!name) {
      throw new ApiError(
        400,
        `SQL parameter name is required at index ${index}`
      );
    }

    if (!VALID_PARAMETER_NAME.test(name)) {
      throw new ApiError(400, `Invalid SQL parameter name: ${rawName}`);
    }

    if (Object.prototype.hasOwnProperty.call(parameterMap, name)) {
      throw new ApiError(400, `Duplicate SQL parameter: ${name}`);
    }

    parameterMap[name] = {
      value: parameter?.value ?? null,
      type:  normalizeParameterType(parameter?.type),
    };
  }

  return parameterMap;
};

// ─── Unsafe Syntax Checks ─────────────────────────────────────────────────────

const validateUnsafeSyntax = (sql) => {
  if (FORBIDDEN_SQL_PATTERN.test(sql)) {
    throw new ApiError(403, "Generated SQL contains a forbidden operation");
  }

  if (SELECT_INTO_PATTERN.test(sql)) {
    throw new ApiError(403, "SELECT INTO is not allowed");
  }

  if (SYSTEM_OBJECT_PATTERN.test(sql)) {
    throw new ApiError(403, "Access to database system objects is not allowed");
  }

  if (containsMultipleStatements(sql)) {
    throw new ApiError(403, "Multiple SQL statements are not allowed");
  }
};

// ─── Main Export ──────────────────────────────────────────────────────────────

/**
 * SQL aur structured parameter array validate karta hai.
 *
 * @param {string}   sql        - AI generated SQL query
 * @param {Array}    parameters - Named parameter array
 * @returns {{ sql, parameterMap, parameterNames }}
 */
const validateGeneratedSQL = exports.validateGeneratedSQL = ({ sql, parameters = [] }) => {

  // ── Step 1: Normalize SQL ────────────────────────────────────────────────
  const originalSQL = normalizeValue(sql);

  if (!originalSQL) {
    throw new ApiError(400, "Generated SQL is empty");
  }

  const normalizedSQL = stripSQLComments(originalSQL);

  if (!normalizedSQL) {
    throw new ApiError(400, "Generated SQL is empty after normalization");
  }

  if (normalizedSQL.length > 15000) {
    throw new ApiError(400, "Generated SQL is too large");
  }

  // ── Step 2: Read-only check ──────────────────────────────────────────────
  if (!startsWithReadOnlySQL(normalizedSQL)) {
    throw new ApiError(403, "Only SELECT queries are allowed");
  }

  if (!containsSelectStatement(normalizedSQL)) {
    throw new ApiError(403, "The query must contain a SELECT statement");
  }

  // ── Step 3: Unsafe syntax check ──────────────────────────────────────────
  validateUnsafeSyntax(normalizedSQL);

  // ── Step 4: Extract placeholders & build parameter map ──────────────────
  const sqlParameterNames = extractSQLParameterNames(normalizedSQL);
  const parameterMap      = normalizeParameters(parameters);

  // ── Step 5: Missing parameters check (strict) ────────────────────────────
  // SQL me use hua har placeholder parameter array me hona chahiye.
  for (const parameterName of sqlParameterNames) {
    if (!Object.prototype.hasOwnProperty.call(parameterMap, parameterName)) {
      throw new ApiError(
        400,
        `Missing value for SQL parameter: ${parameterName}`
      );
    }
  }

  // ── Step 6: Unused parameters (silently filter) ──────────────────────────
  // AI kabhi kabhi extra parameters bhejta hai jo SQL me use nahi hote.
  // Error throw karne ki jagah silently remove kar do.
  const filteredParameterMap = {};

  for (const parameterName of sqlParameterNames) {
    filteredParameterMap[parameterName] = parameterMap[parameterName];
  }

  // ── Step 7: Warn about removed params (dev log) ──────────────────────────
  const unusedParams = Object.keys(parameterMap).filter(
    (key) => !sqlParameterNames.includes(key)
  );

  if (unusedParams.length > 0) {
    console.warn(
      `[sqlValidator] Unused SQL parameters removed: ${unusedParams.join(", ")}`
    );
  }

  // ── Step 8: Return cleaned result ────────────────────────────────────────
  return {
    sql:            normalizedSQL.replace(/;$/, ""),
    parameterMap:   filteredParameterMap,
    parameterNames: sqlParameterNames,
  };
};









/**
 * AI Metrics Service — AutoVyn ERP AI Copilot V3
 * Aggregates AI observability metrics (latencies, token usage, confidence distribution).
 */

const metricsStore = {
  totalQueries: 0,
  successfulQueries: 0,
  failedQueries: 0,
  byMode: {
    GENERAL: 0,
    DOCUMENT_RAG: 0,
    DATABASE: 0,
    HYBRID: 0,
  },
  byConfidence: {
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0,
  },
};

const recordQueryMetrics = exports.recordQueryMetrics = ({ mode = "GENERAL", confidenceLevel = "HIGH", success = true }) => {
  metricsStore.totalQueries++;
  if (success) metricsStore.successfulQueries++;
  else metricsStore.failedQueries++;

  if (mode in metricsStore.byMode) {
    metricsStore.byMode[mode]++;
  }
  if (confidenceLevel in metricsStore.byConfidence) {
    metricsStore.byConfidence[confidenceLevel]++;
  }
};

const getMetricsSummary = exports.getMetricsSummary = () => {
  return { ...metricsStore };
};













/**
 * AI Trace Service — AutoVyn ERP AI Copilot V2
 * Provides stage-by-stage execution timing and telemetry tracking for AI requests.
 */

const createTrace = exports.createTrace = (requestId = "") => {
  const startTime = Date.now();
  const stages = {};

  return {
    requestId,
    startTime,
    markStage(stageName) {
      stages[stageName] = Date.now() - startTime;
    },
    endTrace() {
      const totalMs = Date.now() - startTime;
      return {
        totalMs,
        stages,
      };
    },
  };
};



























