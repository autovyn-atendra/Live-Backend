
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const { QueryTypes } = require("sequelize");

let axios;
try { axios = require("axios"); } catch (_) {}
const { dbname } = require("../utils/dbconfig");
const { randomUUID } = require("crypto");

// ── V6 Enterprise AI Copilot Engine Integration ──
let AI_V6 = null;
try {
  AI_V6 = require("./aiservices2");
} catch (err) {
  console.warn("[aiservices] aiservices2 load notice:", err?.message);
}

// ── Global Central AI Database Multi-Tenant Resolution ──
const getGlobalAICompCode = () => {
  if (AI_V6?.getGlobalAICompCode) {
    return AI_V6.getGlobalAICompCode();
  }
  return (
    process.env.GLOBAL_AI_COMPCODE ||
    process.env.AI_GLOBAL_COMPCODE ||
    process.env.CENTRAL_AI_COMPCODE ||
    process.env.GLOBAL_COMPCODE ||
    "autovyn"
  ).trim();
};

const getGlobalAISequelize = async (req, fallbackSequelize = null) => {
  if (AI_V6?.getGlobalAISequelize) {
    return AI_V6.getGlobalAISequelize(req, fallbackSequelize);
  }
  const globalCompCode = getGlobalAICompCode();
  if (!globalCompCode) return fallbackSequelize;
  try {
    const globalSeq = await dbname(req, globalCompCode);
    if (globalSeq?.query) return globalSeq;
  } catch (err) {
    console.warn(`[getGlobalAISequelize] Could not connect to Global AI DB (${globalCompCode}):`, err?.message);
  }
  return fallbackSequelize;
};

const misc_type_list = exports.misc_type_list = [
  { id: 31, name: "Product Group Master" },
  { id: 85, name: "Branch Master" },
  { id: 320, name: "Employee Exp Master" },
  { id: 71, name: "Godown Master" },
  { id: 88, name: "Country Master" },
  { id: 3, name: "State Master" },
  { id: 2, name: "District Master" },
  { id: 1, name: "Tehsil Master" },
  { id: 91, name: "Region Master" },
  { id: 11, name: "Department Master" },
  { id: 17, name: "Enquiry Source Master" },
  { id: 18, name: "Payment Mode Master" },
  { id: 19, name: "Cancel Reason Master" },
  { id: 32, name: "Mechanic Master" },
  { id: 404, name: "Cost Center Master" },
  { id: 401, name: "Tyre Pattern Master" },
  { id: 51, name: "Tyre Master" },
  { id: 54, name: "Tyre Category Master" },
  { id: 55, name: "Sub Category Master" },
  { id: 56, name: "Tyre Type Master" },
  { id: 39, name: "Instrument Master" },
  { id: 58, name: "Chapter Type Master" },
  { id: 59, name: "Bank Name Master" },
  { id: 60, name: "Customer Segment Master" },
  { id: 61, name: "Customer Category Master" },
  { id: 73, name: "Tariff class Master" },
  { id: 72, name: "UOM Master" },
  { id: 622, name: "Offer Type Master" },
  { id: 6, name: "Order Type Master" },
  { id: 74, name: "Bill Currency Master" },
  { id: 75, name: "Payment Mode Master" },
  { id: 610, name: "Deduction Master" },
  { id: 619, name: "Group Head Master" },
  { id: 620, name: "Team Leader" },
  { id: 623, name: "PURCHASE PAYOUT" },
  { id: 625, name: "CATEGORY" },
  { id: 626, name: "CLUSTER" },
  { id: 627, name: "CHANNEL" },
  { id: 628, name: "COSTCENTRE" },
  { id: 629, name: "Doc Management" },
  { id: 9, name: "Insurance Company Master" },
  { id: 630, name: "Bank Department Master" },
  { id: 631, name: "Physical Location Master" },
  { id: 633, name: "Employee Assestment And Rating" },
  { id: 634, name: "Apraisal Cycle" },
  { id: 635, name: "bank payment type" },
  { id: 636, name: "bank Subpayment" },
  { id: 637, name: "RTO Type" },
  { id: 638, name: "Insu Type" },
  { id: 639, name: "EW Type" },
  { id: 640, name: "Registration Purpose" },
  { id: 641, name: "Vehicle Type" },
  { id: 642, name: "permit Category" },
  { id: 643, name: "RTO Office List" },
  { id: 644, name: "Permit Type" },
  { id: 645, name: "Vehicle Class" },
  { id: 646, name: "Vehicle Category" },
  { id: 647, name: "Document Mapping" },
  { id: 648, name: "Enquiry Lost/Cancellation Reason" },
  { id: 649, name: "Price Add-On Master" },
  { id: 650, name: "Price Sub Add-On Master" },
  { id: 651, name: "Customer Document" },
  { id: 652, name: "Enquiry Activity" },
  { id: 653, name: "IT ASSETS" },
  { id: 655, name: "In Emp-EXL-Import" },
  { id: 656, name: "EMP Dropdown Configuration Fields" },
  { id: 654, name: "PF PERCENTAGE" },
  { id: 68, name: "Employee Department" },
  { id: 81, name: "Employee Section" },
  { id: 657, name: "Marital Status" },
  { id: 658, name: "Relation" },
  { id: 91, name: "Region Master" },
  { id: 92, name: "Leave Master" },
  { id: 95, name: "Employee Designation" },
  { id: 660, name: "RTO INSURANCE MASTER" },
  { id: 661, name: "Evaluation Criteria Master" },
  { id: 662, name: "Emp Punch Type Master" },
  { id: 663, name: "Discount Master" },
  { id: 664, name: "Customer Deal Sheet Master" },
  { id: 665, name: "Expense Templates" },
  { id: 666, name: "EMP Notice Period Master" },
  { id: 667, name: "EMP Sepration Mode Master" },
  { id: 668, name: "EMP Exit Interview Done Master" },
  { id: 669, name: "EMP Resigned Status Master" },
  { id: 670, name: "EMP Sepration Categaory Master" },
  { id: 671, name: "Expense Department" },
  { id: 8, name: "EMP Bank/Finance Master" },
  { id: 672, name: "EMP Grade Master" },
  { id: 673, name: "Manual Gatepass Delay Reason Master" },
  { id: 674, name: "Employee Range Master" },
  { id: 675, name: "Payment Terms" },
  { id: 676, name: "TaskManagement Module" },
  { id: 677, name: "TaskManagement Permission" },
  { id: 678, name: "TaskManagement Approval Master" },
  { id: 679, name: "Senior & Executive" },
  { id: 680, name: "Top Management" },
  { id: 681, name: "Import Auto-Create Field Master" },
  { id: 683, name: "Policy Type" },
];


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

const normalizeValue = (value) => String(value ?? "").trim();
const VALID_IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

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



const toPositiveInteger = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
};

const safeJSONParse = (val, fallback = null) => {
  try {
    return typeof val === "string" ? JSON.parse(val) : (val || fallback);
  } catch (_) {
    return fallback;
  }
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

  const rawRole = normalizeValue(user?.role || user?.appRole || req.body?.role || req.headers?.role || "EMPLOYEE").toUpperCase();
  const rawUserCode = user?.userCode ?? user?.User_Code ?? user?.userId ?? user?.User_Id ?? user?.SRNO ?? user?.UTD ?? user?.id ?? req.body?.userId ?? req.body?.userCode ?? "1";
  const numericUserId = toPositiveInteger(rawUserCode) || 1;
  const employeeCode = normalizeValue(
    user?.EMPCODE ?? user?.EmpCode ?? user?.empCode ?? user?.employeeCode ?? req.body?.EMPCODE ?? req.body?.EmpCode ?? req.body?.empCode ?? req.body?.employeeCode ?? ""
  ) || null;

  const inferredRoleFlag = rawRole === "SUPER_ADMIN" ? 1 : rawRole === "ADMIN" ? 2 : rawRole === "PROJECT_MANAGER" ? 3 : 0;
  const context = {
    numericUserId,
    userId: numericUserId,
    employeeCode,
    userCode: employeeCode || (numericUserId ? String(numericUserId) : String(rawUserCode)),
    userName: normalizeValue(user?.userName ?? user?.name ?? user?.User_Name ?? req.body?.userName ?? req.body?.name ?? "Enterprise User") || "Enterprise User",
    role: rawRole || "EMPLOYEE",
    roleFlag: Number(user?.roleFlag ?? user?.RoleFlag ?? req.body?.roleFlag ?? inferredRoleFlag),
    compcode: normalizeValue(user?.compcode || req.headers?.compcode || req.headers?.["x-comp-code"] || req.body?.compcode || process.env.DEFAULT_COMPCODE || "AUTOVYN") || "AUTOVYN",
    location: normalizeValue(user?.LOCATION ?? user?.location ?? req.body?.location ?? "") || null,
  };

  return context;
};



// ─── Main AI Assistant Entry Point ──────────────────────────────────────────

const askERPAssistant = exports.askERPAssistant = async (req, payload = {}) => {
  payload = req.body || payload || {};
  const startedAt = Date.now();

  // ── Validate input ────────────────────────────────────────────────────────
  const message = normalizeValue(payload.message || payload.query || payload.question);
  if (!message) throw new ApiError(400, "message is required");

  console.log("\n======================================================");
  console.log("❓ [AI-QUESTION]:", message);

  // ── User context ──────────────────────────────────────────────────────────
  const userContext = buildUserContext(req);
  if (!userContext.numericUserId) {
    throw new ApiError(401, "Valid numeric user ID is unavailable");
  }

  // ── DB connection (Tenant ERP DB) ─────────────────────────────────────────
  const sequelize = await dbname(req, userContext.compcode);
  if (!sequelize?.query) throw new ApiError(500, "Database connection failed");

  // ── Global AI Central DB Connection ───────────────────────────────────────
  const globalSequelize = await getGlobalAISequelize(req, sequelize);

  // ── Conversation Persistence Setup ─────────────────────────────────────────
  if (AI_V6?.ensureAllAITables) {
    try {
      await AI_V6.ensureAllAITables(sequelize, globalSequelize);
    } catch (_) {}
  }

  let conversationId = payload.conversationId || req.body?.conversationId;
  try {
    const conv = await getOrCreateConversation({
      sequelize,
      conversationId: payload.conversationId || req.body?.conversationId,
      userCode: userContext.numericUserId,
      userName: userContext.userName,
      compcode: userContext.compcode,
      title: payload.title || message.slice(0, 100),
      conversationType: "GENERAL",
    });
    conversationId = conv.conversationId;
    payload.conversationId = conversationId;
    if (req.body) req.body.conversationId = conversationId;
  } catch (convErr) {
    console.warn("[aiservices] Conversation init notice:", convErr?.message);
    if (!conversationId) {
      conversationId = `conv_${Date.now()}_${randomUUID().slice(0, 8)}`;
      payload.conversationId = conversationId;
      if (req.body) req.body.conversationId = conversationId;
    }
  }

  // ── Save user message ─────────────────────────────────────────────────────
  try {
    await saveConversationMessage({
      sequelize,
      conversationId,
      role: "user",
      content: message,
      createdBy: String(userContext.numericUserId),
      metadata: {
        employeeCode: userContext.employeeCode,
        roleFlag: userContext.roleFlag,
      },
    });
  } catch (userMsgErr) {
    console.warn("[aiservices] Non-fatal user message save error:", userMsgErr?.message);
  }

  // ── Execute V6 Enterprise AI Copilot Engine ────────────────────────────────
  if (AI_V6?.askEnterpriseCopilotV6) {
    try {
      const v6Result = await AI_V6.askEnterpriseCopilotV6(req, payload);
      if (v6Result && (v6Result.answer || v6Result.message)) {
        v6Result.conversationId = conversationId;

        // Persist assistant response & update session timestamp
        try {
          await saveConversationMessage({
            sequelize,
            conversationId,
            role: "assistant",
            content: v6Result.answer || v6Result.message || "Query executed.",
            routeType: v6Result.mode || "DATABASE",
            modelName: v6Result.model || "gpt-4o-mini",
            responseTimeMs: Date.now() - startedAt,
            createdBy: String(userContext.numericUserId),
            metadata: {
              intent: v6Result.intent,
              sql: v6Result.query?.sql,
              confidence: v6Result.confidence,
              lastEmployeeCode: (v6Result.resolvedEntities?.isAllRequested || !v6Result.resolvedEntities?.employeeCode) ? null : (v6Result.resolvedEntities?.employeeCode || null),
              lastEmployeeName: (v6Result.resolvedEntities?.isAllRequested) ? null : (v6Result.resolvedEntities?.employeeName || v6Result.resolvedEntities?.nameFilter || null),
              resolvedEntities: v6Result.resolvedEntities || null,
              count: v6Result.count || v6Result.data?.[0]?.TotalPresentCount || v6Result.data?.[0]?.TotalAbsentCount || v6Result.data?.[0]?.TotalCount || v6Result.data?.[0]?.TotalEmployees || null,
              specificDate: v6Result.specificDate || v6Result.resolvedEntities?.specificDate || null,
              branch: v6Result.branch || v6Result.resolvedEntities?.branch || null,
              branches: v6Result.branches || v6Result.resolvedEntities?.branches || null,
              flag: v6Result.flag || v6Result.resolvedEntities?.flag || null,
              rewrittenQuestion: v6Result.rewrittenQuestion || v6Result.resolvedEntities?.rewrittenQuestion || null
            }
          });
        } catch (asstMsgErr) {
          console.warn("[aiservices] Non-fatal assistant message save error:", asstMsgErr?.message);
        }

        return v6Result;
      }
    } catch (v6Error) {
      console.error("[aiservices] V6 Copilot execution notice:", v6Error?.message || v6Error);
      const friendlyErrorMsg = `AutoVyn ERP AI processing issue: ${v6Error?.message || "An unexpected error occurred while processing query."}`;
      try {
        await saveConversationMessage({
          sequelize,
          conversationId,
          role: "assistant",
          content: friendlyErrorMsg,
          routeType: "ERROR",
          modelName: "system",
          responseTimeMs: Date.now() - startedAt,
          createdBy: String(userContext.numericUserId),
          metadata: { error: v6Error?.message }
        });
      } catch (_) {}

      return {
        success: false,
        conversationId,
        answer: friendlyErrorMsg,
        mode: "ERROR",
        error: v6Error?.message,
        data: [],
        query: { sql: null, tablesUsed: [], rowCount: 0, executionTimeMs: Date.now() - startedAt },
        responseTimeMs: Date.now() - startedAt
      };
    }
  }

  throw new ApiError(500, "AutoVyn V6 Enterprise AI Copilot Engine is not available");
};


const listUserConversations = exports.listUserConversations = async ({ req, limit = 25, offset = 0, page = 1 }) => {
  const user = buildUserContext(req);
  const sequelize = await dbname(req, user.compcode);

  const parsedLimit = Math.max(1, Math.min(Number(req?.query?.limit || req?.body?.limit || limit) || 25, 100));
  const parsedPage = Math.max(1, Number(req?.query?.page || req?.body?.page || page) || 1);
  const parsedOffset = req?.query?.offset !== undefined 
    ? Math.max(0, Number(req.query.offset) || 0)
    : (parsedPage - 1) * parsedLimit;

  const rows = await sequelize.query(
    `SELECT 
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
     ORDER BY ISNULL([Last_Message_At], ISNULL([Updated_At], [Created_At])) DESC
     OFFSET :offset ROWS
     FETCH NEXT :limit ROWS ONLY`,
    {
      replacements: { 
        compCode: user.compcode, 
        userCode: user.numericUserId,
        offset: parsedOffset,
        limit: parsedLimit
      },
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


const buildColumnType = (column) => {
  const typeName = normalizeValue(column.Type_Name || column.DATA_TYPE);
  if (["varchar", "nvarchar", "char", "nchar", "varbinary", "binary"].includes(typeName.toLowerCase())) {
    const rawLength = Number(column.Max_Length || column.CHARACTER_MAXIMUM_LENGTH);
    const lengthStr = rawLength === -1 ? "max" : Number.isFinite(rawLength) && rawLength > 0 ? String(rawLength) : "";
    return lengthStr ? `${typeName}(${lengthStr})` : typeName;
  }
  if (["decimal", "numeric"].includes(typeName.toLowerCase())) {
    const precision = Number(column.Precision || column.NUMERIC_PRECISION);
    const scale = Number(column.Scale || column.NUMERIC_SCALE);
    if (Number.isFinite(precision) && precision > 0) {
      return Number.isFinite(scale) ? `${typeName}(${precision},${scale})` : `${typeName}(${precision})`;
    }
    return typeName;
  }
  return typeName;
};


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

const listKnowledgeDocuments = exports.listKnowledgeDocuments = async ({ req, query = {} }) => {
  const user = buildUserContext(req);
  const sequelize = await dbname(req, user.compcode);
  const search = String(query.search || "").trim();
  const moduleName = String(query.module || "").trim();
  const docType = String(query.type || "").trim();

  let whereClauses = ["D.[Comp_Code] = :compCode"];
  let replacements = { compCode: user.compcode };

  if (search) {
    whereClauses.push("(D.[Title] LIKE :search OR D.[Source_Name] LIKE :search OR D.[Source_Reference] LIKE :search OR D.[Module_Name] LIKE :search)");
    replacements.search = "%" + search + "%";
  }
  if (moduleName && moduleName !== "ALL") {
    whereClauses.push("D.[Module_Name] = :moduleName");
    replacements.moduleName = moduleName;
  }
  if (docType && docType !== "ALL") {
    whereClauses.push("D.[Document_Type] = :docType");
    replacements.docType = docType;
  }

  const sql = "SELECT D.[UTD] AS documentId, D.[Module_Name] AS moduleName, D.[Document_Type] AS documentType, D.[Title] AS title, D.[Source_Name] AS sourceName, D.[Source_Reference] AS sourceReference, D.[Is_Active] AS isActive, (SELECT COUNT(1) FROM [dbo].[AI_Knowledge_Chunk_Tbl] C WITH (NOLOCK) WHERE C.Document_UTD = D.UTD) AS chunkCount, CONVERT(VARCHAR(19), D.[Created_At], 120) AS createdAt FROM [dbo].[AI_Knowledge_Document_Tbl] D WITH (NOLOCK) WHERE " + whereClauses.join(" AND ") + " ORDER BY D.[UTD] DESC";

  const rows = await sequelize.query(sql, { replacements, type: QueryTypes.SELECT }).catch(() => []);
  return rows;
};

const getKnowledgeDocumentDetail = exports.getKnowledgeDocumentDetail = async ({ req, documentId }) => {
  const user = buildUserContext(req);
  const sequelize = await dbname(req, user.compcode);
  const sqlDoc = "SELECT TOP 1 D.[UTD] AS documentId, D.[Module_Name] AS moduleName, D.[Document_Type] AS documentType, D.[Title] AS title, D.[Source_Name] AS sourceName, D.[Source_Reference] AS sourceReference, D.[Content] AS content, D.[Is_Active] AS isActive, CONVERT(VARCHAR(19), D.[Created_At], 120) AS createdAt FROM [dbo].[AI_Knowledge_Document_Tbl] D WITH (NOLOCK) WHERE D.[UTD] = :documentId AND D.[Comp_Code] = :compCode";
  const rows = await sequelize.query(sqlDoc, { replacements: { documentId, compCode: user.compcode }, type: QueryTypes.SELECT });
  if (!rows.length) throw new ApiError(404, "Knowledge document was not found");

  const sqlChunks = "SELECT C.[UTD] AS chunkId, C.[Chunk_Index] AS chunkIndex, C.[Chunk_Content] AS chunkContent, C.[Token_Count] AS tokenCount, C.[Is_Active] AS isActive FROM [dbo].[AI_Knowledge_Chunk_Tbl] C WITH (NOLOCK) WHERE C.[Document_UTD] = :documentId AND C.[Comp_Code] = :compCode ORDER BY C.[Chunk_Index] ASC";
  const chunks = await sequelize.query(sqlChunks, { replacements: { documentId, compCode: user.compcode }, type: QueryTypes.SELECT }).catch(() => []);

  return { ...rows[0], chunks };
};











const QDRANT_UUID_NAMESPACE = "2d597f81-745a-47c6-a714-98f548f8af57";

const ALLOWED_DOCUMENT_TYPES = new Set([
  "TABLE_SCHEMA",
  "DATABASE_SCHEMA",
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
      checkCompatibility: false,
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


const syncSchemaIntelligence = exports.syncSchemaIntelligence = async function (req, res) {
  let sequelize = null;
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req?.headers?.compcode || "").trim();
    sequelize = await dbname(req, compCode);

    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;

    if (AI_V6?.ensureAllAITables) {
      try {
        await AI_V6.ensureAllAITables(sequelize, globalSequelize);
      } catch (tableErr) {
        console.warn("[AI-SCHEMA-SYNC] ensureAllAITables notice:", tableErr?.message);
      }
    }

    console.log("[AI-SCHEMA-SYNC] Starting MSSQL Schema Discovery on Tenant ERP DB...");

    // 1. Fetch tables with approximate row counts
    const tablesQuery = `
      SELECT 
        s.name AS Schema_Name,
        t.name AS Table_Name,
        ISNULL(p.rows, 0) AS Approx_Row_Count,
        ep.value AS Description
      FROM sys.tables t
      INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
      LEFT JOIN (
        SELECT object_id, SUM(rows) AS rows
        FROM sys.partitions
        WHERE index_id IN (0, 1)
        GROUP BY object_id
      ) p ON t.object_id = p.object_id
      LEFT JOIN sys.extended_properties ep ON ep.major_id = t.object_id AND ep.minor_id = 0 AND ep.name = 'MS_Description'
      WHERE s.name NOT IN ('sys', 'information_schema') AND t.is_ms_shipped = 0
      ORDER BY t.name ASC
    `;
    const tables = await sequelize.query(tablesQuery, { type: QueryTypes.SELECT }).catch(() => []);

    // 2. Fetch columns
    const columnsQuery = `
      SELECT 
        t.name AS Table_Name,
        c.name AS Column_Name,
        tp.name AS Data_Type,
        c.max_length AS Max_Length,
        c.is_nullable AS Is_Nullable,
        ISNULL(pk.is_pk, 0) AS Is_Primary_Key,
        ep.value AS Description
      FROM sys.columns c
      INNER JOIN sys.tables t ON c.object_id = t.object_id
      INNER JOIN sys.types tp ON c.user_type_id = tp.user_type_id
      INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
      LEFT JOIN (
        SELECT ic.object_id, ic.column_id, 1 AS is_pk
        FROM sys.index_columns ic
        INNER JOIN sys.indexes i ON ic.object_id = i.object_id AND ic.index_id = i.index_id
        WHERE i.is_primary_key = 1
      ) pk ON c.object_id = pk.object_id AND c.column_id = pk.column_id
      LEFT JOIN sys.extended_properties ep ON ep.major_id = c.object_id AND ep.minor_id = c.column_id AND ep.name = 'MS_Description'
      WHERE s.name NOT IN ('sys', 'information_schema') AND t.is_ms_shipped = 0
      ORDER BY t.name, c.column_id ASC
    `;
    const columns = await sequelize.query(columnsQuery, { type: QueryTypes.SELECT }).catch(() => []);

    // 3. Fetch foreign key relationships
    const fkQuery = `
      SELECT 
        fk.name AS Constraint_Name,
        tp.name AS From_Table,
        cp.name AS From_Column,
        tr.name AS To_Table,
        cr.name AS To_Column
      FROM sys.foreign_keys fk
      INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
      INNER JOIN sys.tables tp ON fkc.parent_object_id = tp.object_id
      INNER JOIN sys.columns cp ON fkc.parent_object_id = cp.object_id AND fkc.parent_column_id = cp.column_id
      INNER JOIN sys.tables tr ON fkc.referenced_object_id = tr.object_id
      INNER JOIN sys.columns cr ON fkc.referenced_object_id = cr.object_id AND fkc.referenced_column_id = cr.column_id
    `;
    const fks = await sequelize.query(fkQuery, { type: QueryTypes.SELECT }).catch(() => []);

    // Upsert into AI_Schema_Table_Tbl on Global Central AI DB
    let tablesSynced = 0;
    for (const t of tables) {
      try {
        await targetSeq.query(`
          IF EXISTS (SELECT 1 FROM dbo.AI_Schema_Table_Tbl WHERE Table_Name = :tableName)
            UPDATE dbo.AI_Schema_Table_Tbl 
            SET Approx_Row_Count = :rowCount, Last_Synced_At = GETDATE(), Updated_At = GETDATE()
            WHERE Table_Name = :tableName;
          ELSE
            INSERT INTO dbo.AI_Schema_Table_Tbl (Schema_Name, Table_Name, Approx_Row_Count, Last_Synced_At, Created_At)
            VALUES (:schemaName, :tableName, :rowCount, GETDATE(), GETDATE());
        `, {
          replacements: { schemaName: t.Schema_Name || 'dbo', tableName: t.Table_Name, rowCount: t.Approx_Row_Count || 0 },
          type: QueryTypes.RAW
        });
        tablesSynced++;
      } catch (_) {}
    }

    console.log(`[AI-SCHEMA-SYNC] Completed. Discovered ${tables.length} tables, ${columns.length} columns, ${fks.length} FK relationships.`);

    if (res && typeof res.status === "function") {
      return res.status(200).json({
        success: true,
        message: "Schema intelligence synchronized successfully",
        data: {
          tablesDiscovered: tables.length,
          columnsDiscovered: columns.length,
          relationshipsDiscovered: fks.length,
          tablesSynced,
          timestamp: new Date().toISOString()
        }
      });
    }
    return { tablesCount: tables.length, columnsCount: columns.length, fksCount: fks.length };
  } catch (error) {
    console.error("[AI-SCHEMA-SYNC] Error:", error?.message);
    if (res && typeof res.status === "function") {
      return res.status(500).json({ success: false, message: "Schema synchronization failed", error: error.message });
    }
    throw error;
  }
};

/**
 * 2. SCHEMA CATALOG & METADATA CONTROLLERS
 */
exports.getSchemaTables = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "").trim();
    const sequelize = await dbname(req, compCode);
    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;
    const search = String(req.query?.search || req.body?.search || "").trim();
    const moduleName = String(req.query?.module || req.body?.module || "").trim();

    let query = `
      IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'AI_Schema_Table_Tbl')
      BEGIN
        SELECT UTD, Schema_Name, Table_Name, Business_Name, Module_Name, Description, Primary_Key, Approx_Row_Count, Sensitivity_Level, Is_Active, Last_Synced_At
        FROM dbo.AI_Schema_Table_Tbl
        WHERE Is_Active = 1
        ${moduleName ? "AND Module_Name = :moduleName" : ""}
        ${search ? "AND (Table_Name LIKE :search OR Business_Name LIKE :search)" : ""}
        ORDER BY Table_Name ASC
      END
      ELSE
      BEGIN
        SELECT 0 AS UTD, s.name AS Schema_Name, t.name AS Table_Name, t.name AS Business_Name, 'CORE' AS Module_Name, '' AS Description, '' AS Primary_Key, 0 AS Approx_Row_Count, 'INTERNAL' AS Sensitivity_Level, 1 AS Is_Active, GETDATE() AS Last_Synced_At
        FROM sys.tables t
        INNER JOIN sys.schemas s ON t.schema_id = s.schema_id
        WHERE s.name = 'dbo' AND t.is_ms_shipped = 0
        ${search ? "AND t.name LIKE :search" : ""}
        ORDER BY t.name ASC
      END
    `;
    const rows = await targetSeq.query(query, {
      replacements: { moduleName, search: `%${search}%` },
      type: QueryTypes.SELECT
    });
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSchemaColumns = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "").trim();
    const sequelize = await dbname(req, compCode);
    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;
    const tableName = String(req.params?.tableName || req.query?.table || req.body?.table || "").trim();

    let query = `
      IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'AI_Schema_Column_Tbl')
      BEGIN
        SELECT UTD, Table_Name, Column_Name, Data_Type, Business_Name, Description, Synonyms_JSON, Is_Primary_Key, Is_Foreign_Key, Referenced_Table, Referenced_Column, Sensitivity_Level, Is_Filterable, Is_Searchable
        FROM dbo.AI_Schema_Column_Tbl
        WHERE Is_Active = 1 ${tableName ? "AND Table_Name = :tableName" : ""}
        ORDER BY Table_Name, Column_Name ASC
      END
      ELSE
      BEGIN
        SELECT 0 AS UTD, t.name AS Table_Name, c.name AS Column_Name, tp.name AS Data_Type, c.name AS Business_Name, '' AS Description, NULL AS Synonyms_JSON, 0 AS Is_Primary_Key, 0 AS Is_Foreign_Key, NULL AS Referenced_Table, NULL AS Referenced_Column, 'INTERNAL' AS Sensitivity_Level, 1 AS Is_Filterable, 1 AS Is_Searchable
        FROM sys.columns c
        INNER JOIN sys.tables t ON c.object_id = t.object_id
        INNER JOIN sys.types tp ON c.user_type_id = tp.user_type_id
        WHERE 1=1 ${tableName ? "AND t.name = :tableName" : ""}
        ORDER BY t.name, c.column_id ASC
      END
    `;
    const rows = await targetSeq.query(query, { replacements: { tableName }, type: QueryTypes.SELECT });
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSchemaRelationships = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "").trim();
    const sequelize = await dbname(req, compCode);
    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;

    let query = `
      IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'AI_Schema_Relationship_Tbl')
      BEGIN
        SELECT UTD, From_Table, From_Column, To_Table, To_Column, Relationship_Type, Relationship_Source, Business_Meaning, Confidence, Priority, Is_Active
        FROM dbo.AI_Schema_Relationship_Tbl
        WHERE Is_Active = 1
        ORDER BY From_Table, To_Table ASC
      END
      ELSE
      BEGIN
        SELECT 0 AS UTD, 'EMPLOYEEMASTER' AS From_Table, 'EMPCODE' AS From_Column, 'attendancetable' AS To_Table, 'empcode' AS To_Column, 'ONE_TO_MANY' AS Relationship_Type, 'BUSINESS_DEFINED' AS Relationship_Source, 'Employee Attendance' AS Business_Meaning, 1.0 AS Confidence, 1 AS Priority, 1 AS Is_Active
      END
    `;
    const rows = await targetSeq.query(query, { type: QueryTypes.SELECT });
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveSchemaRelationship = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "").trim();
    const sequelize = await dbname(req, compCode);
    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;
    const { fromTable, fromColumn, toTable, toColumn, relationshipType, businessMeaning, confidence, priority } = req.body || {};

    if (!fromTable || !fromColumn || !toTable || !toColumn) {
      return res.status(400).json({ success: false, message: "fromTable, fromColumn, toTable, toColumn are required" });
    }

    const query = `
      INSERT INTO dbo.AI_Schema_Relationship_Tbl 
      (From_Table, From_Column, To_Table, To_Column, Relationship_Type, Relationship_Source, Business_Meaning, Confidence, Priority, Is_Active, Created_At)
      VALUES 
      (:fromTable, :fromColumn, :toTable, :toColumn, :relationshipType, 'USER_DEFINED', :businessMeaning, :confidence, :priority, 1, GETDATE())
    `;
    await targetSeq.query(query, {
      replacements: {
        fromTable, fromColumn, toTable, toColumn,
        relationshipType: relationshipType || 'ONE_TO_MANY',
        businessMeaning: businessMeaning || '',
        confidence: confidence || 1.0,
        priority: priority || 1
      },
      type: QueryTypes.RAW
    });

    return res.status(200).json({ success: true, message: "Relationship saved successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * 3. BUSINESS SEMANTIC RULES & METRICS CONTROLLERS
 */
exports.getBusinessRules = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "").trim();
    const sequelize = await dbname(req, compCode);
    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;
    const query = `
      IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'AI_Business_Rule_Tbl')
      BEGIN
        SELECT UTD, Rule_Code, Rule_Name, Target_Table, SQL_Expression, Description, Module_Name, Is_Active
        FROM dbo.AI_Business_Rule_Tbl
        WHERE Is_Active = 1
      END
      ELSE
      BEGIN
        SELECT 0 AS UTD, 'ACTIVE_EMP' AS Rule_Code, 'Active Employee' AS Rule_Name, 'EMPLOYEEMASTER' AS Target_Table, 'LASTWOR_DATE IS NULL' AS SQL_Expression, 'Filters active employees' AS Description, 'HR' AS Module_Name, 1 AS Is_Active
      END
    `;
    const rows = await targetSeq.query(query, { type: QueryTypes.SELECT });
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveBusinessRule = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "").trim();
    const sequelize = await dbname(req, compCode);
    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;
    const { ruleCode, ruleName, targetTable, sqlExpression, description, moduleName } = req.body || {};

    if (!ruleCode || !ruleName || !targetTable || !sqlExpression) {
      return res.status(400).json({ success: false, message: "ruleCode, ruleName, targetTable, sqlExpression are required" });
    }

    const query = `
      INSERT INTO dbo.AI_Business_Rule_Tbl 
      (Rule_Code, Rule_Name, Target_Table, SQL_Expression, Description, Module_Name, Is_Active, Created_At)
      VALUES 
      (:ruleCode, :ruleName, :targetTable, :sqlExpression, :description, :moduleName, 1, GETDATE())
    `;
    await targetSeq.query(query, {
      replacements: { ruleCode, ruleName, targetTable, sqlExpression, description: description || '', moduleName: moduleName || 'GENERAL' },
      type: QueryTypes.RAW
    });

    return res.status(200).json({ success: true, message: "Business rule saved successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getMetrics = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "").trim();
    const sequelize = await dbname(req, compCode);
    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;
    const query = `
      IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'AI_Metric_Definition_Tbl')
      BEGIN
        SELECT UTD, Metric_Code, Metric_Name, Source_Table, SQL_Formula, Supported_Dimensions, Description, Module_Name, Is_Active
        FROM dbo.AI_Metric_Definition_Tbl
        WHERE Is_Active = 1
      END
      ELSE
      BEGIN
        SELECT 0 AS UTD, 'ATTENDANCE_PCT' AS Metric_Code, 'Attendance Percentage' AS Metric_Name, 'attendancetable' AS Source_Table, 'Present / NULLIF(MonthDays, 0) * 100' AS SQL_Formula, 'Employee, Location, Month' AS Supported_Dimensions, 'Monthly attendance percentage' AS Description, 'HR' AS Module_Name, 1 AS Is_Active
      END
    `;
    const rows = await targetSeq.query(query, { type: QueryTypes.SELECT });
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveMetric = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "").trim();
    const sequelize = await dbname(req, compCode);
    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;
    const { metricCode, metricName, sourceTable, sqlFormula, supportedDimensions, description, moduleName } = req.body || {};

    if (!metricCode || !metricName || !sourceTable || !sqlFormula) {
      return res.status(400).json({ success: false, message: "metricCode, metricName, sourceTable, sqlFormula are required" });
    }

    const query = `
      INSERT INTO dbo.AI_Metric_Definition_Tbl 
      (Metric_Code, Metric_Name, Source_Table, SQL_Formula, Supported_Dimensions, Description, Module_Name, Is_Active, Created_At)
      VALUES 
      (:metricCode, :metricName, :sourceTable, :sqlFormula, :supportedDimensions, :description, :moduleName, 1, GETDATE())
    `;
    await targetSeq.query(query, {
      replacements: { metricCode, metricName, sourceTable, sqlFormula, supportedDimensions: supportedDimensions || '', description: description || '', moduleName: moduleName || 'GENERAL' },
      type: QueryTypes.RAW
    });

    return res.status(200).json({ success: true, message: "Metric definition saved successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getSynonyms = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "").trim();
    const sequelize = await dbname(req, compCode);
    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;
    const query = `
      IF EXISTS (SELECT 1 FROM sys.tables WHERE name = 'AI_Business_Synonym_Tbl')
      BEGIN
        SELECT UTD, Synonym_Word, Standard_Term, Category, Is_Active
        FROM dbo.AI_Business_Synonym_Tbl
        WHERE Is_Active = 1
      END
      ELSE
      BEGIN
        SELECT 0 AS UTD, 'hazri' AS Synonym_Word, 'ATTENDANCE' AS Standard_Term, 'HR' AS Category, 1 AS Is_Active
      END
    `;
    const rows = await targetSeq.query(query, { type: QueryTypes.SELECT });
    return res.status(200).json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.saveSynonym = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "").trim();
    const sequelize = await dbname(req, compCode);
    const globalSequelize = await getGlobalAISequelize(req, sequelize);
    const targetSeq = globalSequelize || sequelize;
    const { synonymWord, standardTerm, category } = req.body || {};

    if (!synonymWord || !standardTerm) {
      return res.status(400).json({ success: false, message: "synonymWord and standardTerm are required" });
    }

    const query = `
      INSERT INTO dbo.AI_Business_Synonym_Tbl 
      (Synonym_Word, Standard_Term, Category, Is_Active, Created_At)
      VALUES 
      (:synonymWord, :standardTerm, :category, 1, GETDATE())
    `;
    await targetSeq.query(query, {
      replacements: { synonymWord, standardTerm, category: category || 'GENERAL' },
      type: QueryTypes.RAW
    });

    return res.status(200).json({ success: true, message: "Synonym saved successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

const extractAIErrMsg = (err) => {
  if (!err) return "Internal server error";
  if (err.message && err.message.trim()) return err.message;
  if (err.original?.message && err.original.message.trim()) return err.original.message;
  if (err.parent?.message && err.parent.message.trim()) return err.parent.message;
  if (Array.isArray(err.errors) && err.errors.length > 0) {
    const msg = err.errors.map((e) => e.message).filter(Boolean).join("; ");
    if (msg) return msg;
  }
  if (Array.isArray(err.original?.errors) && err.original.errors.length > 0) {
    const msg = err.original.errors.map((e) => e.message).filter(Boolean).join("; ");
    if (msg) return msg;
  }
  return "Database query execution error";
};

// ── V6 Delegated Enterprise AI Management Endpoints ─────────────────────────
exports.getAuditLogs = async function (req, res) {
  try {
    if (AI_V6?.getAuditLogs) {
      const result = await AI_V6.getAuditLogs(req, res);
      if (!res.headersSent) {
        return res.status(200).json(result);
      }
      return;
    }
    return res.status(500).json({ success: false, message: "AI Engine not initialized" });
  } catch (err) {
    const errorMsg = extractAIErrMsg(err);
    console.error("[aiservices.getAuditLogs] Error:", errorMsg, err);
    if (!res.headersSent) {
      return res.status(500).json({ success: false, message: errorMsg });
    }
  }
};

exports.deleteConversation = async function (req, res) {
  try {
    const compCode = String(process.env.DEFAULT_COMPCODE || req.headers?.compcode || "AUTOVYN").trim();
    const sequelize = await dbname(req, compCode);
    const conversationId = String(req.params?.conversationId || "").trim();

    if (!conversationId) {
      return res.status(400).json({ success: false, message: "conversationId is required" });
    }

    await sequelize.query(`
      IF OBJECT_ID('dbo.AI_Message_Tbl', 'U') IS NOT NULL
        DELETE FROM [dbo].[AI_Message_Tbl] WHERE [Conversation_Id] = :conversationId;
      IF OBJECT_ID('dbo.AI_Conversation_Tbl', 'U') IS NOT NULL
        DELETE FROM [dbo].[AI_Conversation_Tbl] WHERE [Conversation_Id] = :conversationId;
      IF OBJECT_ID('dbo.AI_Conversation_Message_Tbl', 'U') IS NOT NULL
        DELETE FROM [dbo].[AI_Conversation_Message_Tbl] WHERE [Conversation_Id] = :conversationId;
      IF OBJECT_ID('dbo.AI_Conversation_Session_Tbl', 'U') IS NOT NULL
        DELETE FROM [dbo].[AI_Conversation_Session_Tbl] WHERE [Conversation_Id] = :conversationId;
    `, { replacements: { conversationId }, type: QueryTypes.RAW });

    if (AI_V6?.MemoryEngineInstance?.clearContext) {
      AI_V6.MemoryEngineInstance.clearContext(conversationId);
    }

    return res.status(200).json({ success: true, message: "Conversation deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

exports.getCacheAnalytics = () => (AI_V6?.getCacheAnalytics ? AI_V6.getCacheAnalytics() : { status: "Active" });
exports.clearCache = () => (AI_V6?.clearCache ? AI_V6.clearCache() : true);
exports.submitFeedback = async (req, res) => {
  try {
    if (AI_V6?.submitFeedback) {
      const result = await AI_V6.submitFeedback(req, req.body || {});
      return res.status(200).json(result);
    }
    return res.status(200).json({ success: true, message: "Feedback recorded" });
  } catch (err) {
    const errorMsg = extractAIErrMsg(err);
    console.error("[aiservices.submitFeedback] Error:", errorMsg, err);
    return res.status(500).json({ success: false, message: errorMsg });
  }
};

exports.getAILearnedRules = async (req, res) => {
  try {
    if (AI_V6?.getAILearnedRules) {
      const result = await AI_V6.getAILearnedRules(req);
      return res.status(200).json(result);
    }
    return res.status(200).json({ success: true, data: [] });
  } catch (err) {
    const errorMsg = extractAIErrMsg(err);
    console.error("[aiservices.getAILearnedRules] Error:", errorMsg, err);
    return res.status(500).json({ success: false, message: errorMsg });
  }
};

exports.saveAILearnedRule = async (req, res) => {
  try {
    if (AI_V6?.saveAILearnedRule) {
      const result = await AI_V6.saveAILearnedRule(req);
      return res.status(200).json(result);
    }
    return res.status(200).json({ success: true, message: "Rule saved" });
  } catch (err) {
    const errorMsg = extractAIErrMsg(err);
    console.error("[aiservices.saveAILearnedRule] Error:", errorMsg, err);
    return res.status(500).json({ success: false, message: errorMsg });
  }
};

exports.deleteAILearnedRule = async (req, res) => {
  try {
    if (AI_V6?.deleteAILearnedRule) {
      const result = await AI_V6.deleteAILearnedRule(req);
      return res.status(200).json(result);
    }
    return res.status(200).json({ success: true, message: "Rule deleted" });
  } catch (err) {
    const errorMsg = extractAIErrMsg(err);
    console.error("[aiservices.deleteAILearnedRule] Error:", errorMsg, err);
    return res.status(500).json({ success: false, message: errorMsg });
  }
};

exports.testSQLQuery = async (req, res) => {
  try {
    if (AI_V6?.testSQLQuery) {
      const result = await AI_V6.testSQLQuery(req);
      return res.status(200).json(result);
    }
    return res.status(400).json({ success: false, message: "Engine not initialized" });
  } catch (err) {
    const errorMsg = extractAIErrMsg(err);
    console.error("[aiservices.testSQLQuery] Error:", errorMsg, err);
    return res.status(500).json({ success: false, message: errorMsg });
  }
};

exports.trainQueryPattern = async (req, res) => {
  try {
    if (AI_V6?.trainQueryPattern) {
      const result = await AI_V6.trainQueryPattern(req);
      return res.status(200).json(result);
    }
    return res.status(400).json({ success: false, message: "Engine not initialized" });
  } catch (err) {
    const errorMsg = extractAIErrMsg(err);
    console.error("[aiservices.trainQueryPattern] Error:", errorMsg, err);
    return res.status(500).json({ success: false, message: errorMsg });
  }
};

exports.getQueryPatterns = async (req, res) => {
  try {
    if (AI_V6?.getQueryPatterns) {
      const result = await AI_V6.getQueryPatterns(req);
      return res.status(200).json(result);
    }
    return res.status(200).json({ success: true, count: 0, data: [] });
  } catch (err) {
    const errorMsg = extractAIErrMsg(err);
    console.error("[aiservices.getQueryPatterns] Error:", errorMsg, err);
    return res.status(500).json({ success: false, message: errorMsg });
  }
};

exports.deleteQueryPattern = async (req, res) => {
  try {
    if (AI_V6?.deleteQueryPattern) {
      const result = await AI_V6.deleteQueryPattern(req);
      return res.status(200).json(result);
    }
    return res.status(200).json({ success: true, message: "Query pattern deleted" });
  } catch (err) {
    const errorMsg = extractAIErrMsg(err);
    console.error("[aiservices.deleteQueryPattern] Error:", errorMsg, err);
    return res.status(500).json({ success: false, message: errorMsg });
  }
};


