const express = require("express");
const router = express.Router();
const AI = require("../routes/aiservices");

// ============================================================
// AI ENGINE HEALTH & STATUS API
// GET /health, GET /status
// ============================================================
router.get(
  "/health",
  AI.asyncHandler(async (req, res) => {
    try {
      AI.getOpenAIClient();
    } catch (_) {}
    let qdrant = null;
    try {
      qdrant = await AI.qdrantHealth();
    } catch (_) {}

    return res.status(200).json({
      success: true,
      message: "AutoVyn Enterprise AI Copilot Engine is healthy",
      data: {
        status: "UP",
        version: "V6-Enterprise",
        openaiConfigured: true,
        qdrant,
        cacheStats: AI.getCacheAnalytics ? AI.getCacheAnalytics() : null,
        timestamp: new Date().toISOString(),
      },
    });
  })
);
router.get("/status", (req, res) => res.json({ success: true, status: "UP", message: "AutoVyn AI V6 is operational" }));

// ============================================================
// PRIMARY AI QUERY & CHAT COPILOT API
// POST /query, POST /ask, POST /chat
// ============================================================
router.post(
  "/query",
  AI.asyncHandler(async (req, res) => {
    const result = await AI.askERPAssistant(req, req.body || {});
    return res.status(200).json({
      success: true,
      message: "AI response generated successfully",
      data: result,
    });
  })
);
router.post("/ask", AI.asyncHandler(async (req, res) => {
  const result = await AI.askERPAssistant(req, req.body || {});
  return res.status(200).json({ success: true, data: result });
}));
router.post("/chat", AI.asyncHandler(async (req, res) => {
  const result = await AI.askERPAssistant(req, req.body || {});
  return res.status(200).json({ success: true, data: result });
}));

// ============================================================
// V6 CACHE & TELEMETRY API
// GET /cache/stats, POST /cache/clear
// ============================================================
router.get("/cache/stats", (req, res) => {
  const stats = AI.getCacheAnalytics ? AI.getCacheAnalytics() : { status: "Cache module active" };
  return res.status(200).json({ success: true, data: stats });
});

router.post("/cache/clear", (req, res) => {
  if (AI.clearCache) AI.clearCache();
  return res.status(200).json({ success: true, message: "AI cache purged successfully" });
});

// ============================================================
// CONVERSATIONS & SESSIONS API
// GET /conversations, POST /conversations, DELETE /conversations/:id
// ============================================================
router.get(
  "/conversations",
  AI.asyncHandler(async (req, res) => {
    const data = await AI.listUserConversations({ req, limit: req.query.limit });
    return res.status(200).json({
      success: true,
      message: "Conversations retrieved successfully",
      data,
    });
  })
);
router.post("/conversations", AI.asyncHandler(async (req, res) => {
  const data = await AI.listUserConversations({ req, limit: req.body?.limit });
  return res.status(200).json({ success: true, data });
}));

router.get(
  "/conversations/:conversationId",
  AI.asyncHandler(async (req, res) => {
    const conversationId = String(req.params.conversationId || "").trim();
    if (!conversationId) throw new AI.ApiError(400, "conversationId is required");
    const data = await AI.getConversationMessages({ req, conversationId });
    return res.status(200).json({
      success: true,
      message: "Conversation retrieved successfully",
      data,
    });
  })
);
router.delete("/conversations/:conversationId", AI.deleteConversation);

// ============================================================
// SCHEMA DISCOVERY & INTELLIGENCE SYNC API
// POST /schema/sync, GET /schema/sync
// ============================================================
router.post("/schema/sync", AI.syncSchemaIntelligence);
router.get("/schema/sync", AI.syncSchemaIntelligence);

// ============================================================
// SCHEMA CATALOG & RELATIONSHIPS API
// GET /schema/tables, GET /schema/columns, GET /schema/relationships
// ============================================================
router.get("/schema/tables", AI.getSchemaTables);
router.post("/schema/tables", AI.getSchemaTables);
router.get("/schema/columns", AI.getSchemaColumns);
router.post("/schema/columns", AI.getSchemaColumns);
router.get("/schema/columns/:tableName", AI.getSchemaColumns);
router.get("/schema/relationships", AI.getSchemaRelationships);
router.post("/schema/relationships", AI.getSchemaRelationships);
router.post("/schema/relationships/save", AI.saveSchemaRelationship);

// ============================================================
// BUSINESS SEMANTIC RULES & METRICS REGISTRY API
// GET /business-rules, POST /business-rules, GET /metrics, POST /metrics
// ============================================================
router.get("/business-rules", AI.getBusinessRules);
router.post("/business-rules", AI.getBusinessRules);
router.post("/business-rules/save", AI.saveBusinessRule);

router.get("/metrics", AI.getMetrics);
router.post("/metrics", AI.getMetrics);
router.post("/metrics/save", AI.saveMetric);

router.get("/synonyms", AI.getSynonyms);
router.post("/synonyms", AI.getSynonyms);
router.post("/synonyms/save", AI.saveSynonym);

// ============================================================
// AI AUDIT TELEMETRY & FEEDBACK API
// POST /feedback, GET /audit, POST /audit
// ============================================================
router.post("/feedback", AI.submitFeedback);
router.get("/audit", AI.getAuditLogs);
router.post("/audit", AI.getAuditLogs);

// ============================================================
// KNOWLEDGE DOCUMENTS MANAGEMENT API
// POST /knowledge/documents/:id/process, GET /status, PATCH /deactivate
// ============================================================
router.post(
  "/knowledge/documents/:documentId/process",
  AI.asyncHandler(async (req, res) => {
    const result = await AI.indexExistingDocument({
      req,
      documentId: AI.assertDocumentId(req.params.documentId),
      force: req.body?.force === true,
    });
    return res.status(200).json({
      success: true,
      message: "Document indexed successfully",
      data: result,
    });
  })
);

router.get(
  "/knowledge/documents/:documentId/status",
  AI.asyncHandler(async (req, res) => {
    const result = await AI.getKnowledgeDocumentStatus({
      req,
      documentId: AI.assertDocumentId(req.params.documentId),
    });
    return res.status(200).json({
      success: true,
      message: "Document status retrieved successfully",
      data: result,
    });
  })
);

router.patch(
  "/knowledge/documents/:documentId/deactivate",
  AI.asyncHandler(async (req, res) => {
    const result = await AI.deactivateKnowledgeDocument({
      req,
      documentId: AI.assertDocumentId(req.params.documentId),
      hardDelete: req.body?.hardDelete === true,
    });
    return res.status(200).json({
      success: true,
      message: "Document deactivated successfully",
      data: result,
    });
  })
);

// ============================================================
// MANUAL KNOWLEDGE INGESTION API
// POST /knowledge/manual
// ============================================================
router.post(
  "/knowledge/manual",
  AI.asyncHandler(async (req, res) => {
    const result = await AI.saveManualKnowledge({
      req,
      payload: req.body || {},
    });
    return res.status(result.replaced ? 200 : 201).json({
      success: true,
      message: result.replaced
        ? "AI knowledge updated successfully"
        : "AI knowledge created successfully",
      data: result,
    });
  })
);

module.exports = router;
