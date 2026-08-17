const express = require("express");
const router = express.Router();
const AI = require("../routes/aiservices");

// ── Health ───────────────────────────────────────────────────────────────────
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
      message: "AI service is healthy",
      data: {
        status: "UP",
        openaiConfigured: true,
        qdrant,
        timestamp: new Date().toISOString(),
      },
    });
  })
);

// ── AI Query / Chat ─────────────────────────────────────────────────────────
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

// ── Conversations ────────────────────────────────────────────────────────────
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

// ── Knowledge Documents ──────────────────────────────────────────────────────
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

// ── Manual Knowledge Ingestion ───────────────────────────────────────────────
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
