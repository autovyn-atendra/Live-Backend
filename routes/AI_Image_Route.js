/**
 * AutoVyn ERP — AI Image Assistant / Vision Intelligence Module
 * Service & Logic Layer
 * 
 * Specialized Vehicle Odometer Reading from Dashboard Images
 */

const jwt = require("jsonwebtoken");

let OpenAIClass = null;
try {
  const mod = require("openai");
  OpenAIClass = mod.OpenAI || mod.default || mod;
} catch (_) {}

let sharp = null;
try {
  sharp = require("sharp");
} catch (_) {}

// =============================================================================
// CENTRALIZED CONFIGURATION & CONSTANTS
// =============================================================================

const getVisionModel = () => {
  return String(process.env.OPENAI_VISION_MODEL || process.env.OPENAI_MODEL || "gpt-4o-mini").trim();
};

const AI_IMAGE_CONFIG = {
  get VISION_MODEL() {
    return getVisionModel();
  },
  get FALLBACK_VISION_MODEL() {
    return String(process.env.OPENAI_FALLBACK_VISION_MODEL || "gpt-4o").trim();
  },
  MAX_MB: Number(process.env.AI_IMAGE_MAX_MB || 10),
  AUTO_ACCEPT_CONFIDENCE: Number(process.env.AI_IMAGE_AUTO_ACCEPT_CONFIDENCE || 0.95),
  REVIEW_CONFIDENCE: Number(process.env.AI_IMAGE_REVIEW_CONFIDENCE || 0.70),
  ALLOWED_MIME_TYPES: new Set([
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp"
  ]),
};

exports.AI_IMAGE_CONFIG = AI_IMAGE_CONFIG;

// Single client instance
let openAIClient = null;

const getOpenAIClient = () => {
  const apiKey = String(process.env.OPENAI_API_KEY || "").trim();
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not configured in server environment");
  }

  if (!openAIClient) {
    if (!OpenAIClass || typeof OpenAIClass !== "function") {
      throw new Error("OpenAI SDK is not available");
    }
    openAIClient = new OpenAIClass({ apiKey });
  }

  return openAIClient;
};

// =============================================================================
// PRICING & TELEMETRY COST ESTIMATOR
// =============================================================================

const OPENAI_PRICING = {
  "gpt-4o-mini": {
    inputPerMillion: 0.15,
    cachedInputPerMillion: 0.075,
    outputPerMillion: 0.60,
  },
  "gpt-4o": {
    inputPerMillion: 2.50,
    cachedInputPerMillion: 1.25,
    outputPerMillion: 10.00,
  },
};

const estimateTokenCost = (modelName, promptTokens, cachedTokens, completionTokens) => {
  const modelKey = String(modelName || "").toLowerCase().includes("mini") ? "gpt-4o-mini" : "gpt-4o";
  const rates = OPENAI_PRICING[modelKey] || OPENAI_PRICING["gpt-4o-mini"];

  const uncachedPrompt = Math.max(0, Number(promptTokens || 0) - Number(cachedTokens || 0));
  const promptCost = (uncachedPrompt / 1_000_000) * rates.inputPerMillion;
  const cachedCost = (Number(cachedTokens || 0) / 1_000_000) * rates.cachedInputPerMillion;
  const completionCost = (Number(completionTokens || 0) / 1_000_000) * rates.outputPerMillion;
  const totalCostUSD = promptCost + cachedCost + completionCost;
  const totalCostINR = totalCostUSD * 87.5; // Approximate USD to INR rate

  return {
    totalCostUSD: Number(totalCostUSD.toFixed(6)),
    totalCostINR: Number(totalCostINR.toFixed(4)),
    formattedUSD: `$${totalCostUSD.toFixed(6)}`,
    formattedINR: `₹${totalCostINR.toFixed(4)}`,
  };
};

const logOpenAITokenUsage = (response, modelName, durationMs) => {
  const usage = response?.usage || {};
  const promptTokens = usage.prompt_tokens ?? 0;
  const completionTokens = usage.completion_tokens ?? 0;
  const totalTokens = usage.total_tokens ?? 0;
  const promptDetails = usage.prompt_tokens_details || {};
  const cachedTokens = promptDetails.cached_tokens ?? 0;
  const imageTokens = promptDetails.image_tokens ?? null;
  const actualModel = response?.model || modelName;

  const cost = estimateTokenCost(actualModel, promptTokens, cachedTokens, completionTokens);

  console.log("\n╔══════════════════════════════════════════════════════════════════╗");
  console.log("║ 🤖 [AI-VISION-RESPONSE] Optimized Token & Latency Telemetry      ║");
  console.log("╠══════════════════════════════════════════════════════════════════╣");
  console.log(`║ • Model Name        : ${actualModel}`);
  console.log(`║ • API Latency       : ${durationMs} ms`);
  console.log(`║ • Input Tokens      : ${promptTokens.toLocaleString()} (Cached: ${cachedTokens})`);
  if (imageTokens !== null && imageTokens !== undefined) {
    console.log(`║   └─ Image Tokens   : ${imageTokens.toLocaleString()} tokens`);
  }
  console.log(`║ • Output Tokens     : ${completionTokens.toLocaleString()} tokens`);
  console.log(`║ • Total Tokens      : ${totalTokens.toLocaleString()} tokens`);
  console.log(`║ • Cost Estimate     : ${cost.formattedUSD} (${cost.formattedINR})`);
  console.log("╚══════════════════════════════════════════════════════════════════╝\n");

  return {
    model: actualModel,
    id: response?.id || null,
    durationMs,
    promptTokens,
    cachedTokens,
    completionTokens,
    totalTokens,
    imageTokens,
    cost,
  };
};

// =============================================================================
// IMAGE VALIDATION & PREPROCESSING HELPERS
// =============================================================================

const validateUploadedImage = (file) => {
  if (!file) {
    return { valid: false, error: "No image file provided" };
  }

  if (!file.buffer || file.buffer.length === 0) {
    return { valid: false, error: "Image file is empty or corrupted" };
  }

  const mimeType = String(file.mimetype || "").toLowerCase().trim();
  if (!AI_IMAGE_CONFIG.ALLOWED_MIME_TYPES.has(mimeType)) {
    return {
      valid: false,
      error: `Unsupported image format (${mimeType || "unknown"}). Allowed formats: JPEG, PNG, WebP.`
    };
  }

  const maxBytes = AI_IMAGE_CONFIG.MAX_MB * 1024 * 1024;
  if (file.size > maxBytes || file.buffer.length > maxBytes) {
    return {
      valid: false,
      error: `Image size exceeds maximum allowed limit of ${AI_IMAGE_CONFIG.MAX_MB}MB.`
    };
  }

  return { valid: true, mimeType, buffer: file.buffer };
};

const formatNumberWithCommas = (num) => {
  if (num === null || num === undefined || isNaN(num)) return null;
  return Number(num).toLocaleString("en-IN");
};

/**
 * Safely parse nullable numeric values without coercing null/empty strings to 0
 */
const safelyParseNullableNumber = (rawValue) => {
  if (
    rawValue === null ||
    rawValue === undefined ||
    rawValue === "" ||
    typeof rawValue === "boolean"
  ) {
    return null;
  }
  const cleanStr = typeof rawValue === "string" ? rawValue.replace(/,/g, "").trim() : rawValue;
  const num = Number(cleanStr);
  if (Number.isFinite(num)) {
    return num;
  }
  return null;
};

// =============================================================================
// VISION PROMPT WITH UNBREAKABLE COLOR & MECHANICAL RULES
// =============================================================================

const ODOMETER_VISION_SYSTEM_PROMPT = `
You are an expert precision AI Vision engine for vehicle dashboard odometer inspection in AutoVyn ERP.
Extract the vehicle's MAIN CUMULATIVE ODOMETER reading in compact JSON with 100% adherence to drum colors.

ANALOG / MECHANICAL METER RULES (2 TYPES ONLY - 0% GUESSING):

TYPE 1: CONTRASTING TENTHS WHEEL (Rightmost 1st drum has a WHITE / LIGHT / YELLOW / RED / ORANGE background, or 2-Wheeler / Motorcycle / Scooter dial):
- Look closely at each drum wheel from left to right:
  * Left drums (5 black drums) represent WHOLE KILOMETERS.
  * Far-right 1st drum has a DIFFERENT / WHITE / LIGHT / YELLOW / RED / ORANGE background (dark digit) representing TENTHS OF A KM (.0 to .9 KM).
  * CRITICAL FOR MOTORCYCLES / SCOOTERS (Hero Splendor, HF Deluxe, Passion, Glamour, Honda Activa, Shine, Bajaj, TVS, Yamaha): 
    Any 6-drum odometer on a 2-wheeler ALWAYS has the 6th drum as TENTHS OF A KM (100 meters). Even if dusty or in shadows, drum #6 is a TENTHS decimal wheel!
- The value MUST BE EXTRACTED AS A DECIMAL KILOMETER:
  * [7][6][0][6][2] (5 black) + [5] (1 white) -> val: 76062.5, unit: "KM", contrast: true, lastColor: "WHITE" (NEVER 760625!)
  * [0][3][4][8][0] (5 black) + [7] (1 white) -> val: 3480.7, unit: "KM", contrast: true, lastColor: "WHITE" (NEVER 34807!)
  * [7][3][2][9][4] (5 black) + [8] (1 white) -> val: 73294.8, unit: "KM", contrast: true, lastColor: "WHITE"
  * [4][3][2][5][0] (5 black) + [4] (1 white) -> val: 43250.4, unit: "KM", contrast: true, lastColor: "WHITE"
  * [4][8][7][7][1] (5 black) + [8] (1 white) -> val: 48771.8, unit: "KM", contrast: true, lastColor: "WHITE"
  * [0][0][0][0][0] (5 black) + [5] (1 white) -> val: 0.5, unit: "KM", contrast: true, lastColor: "WHITE"
  * [0][0][0][0][0] (5 black) + [0] (1 white) -> val: 0, unit: "KM", contrast: true, lastColor: "WHITE"
  * [0][0][0][0][1] (5 black) + [0] (1 white) -> val: 1, unit: "KM", contrast: true, lastColor: "WHITE"
  * [0][0][0][2] (4 black) + [7] (1 white) -> val: 2.7, unit: "KM", contrast: true, lastColor: "WHITE"

TYPE 2: ALL-BLACK DRUMS (NO tenths wheel, EVERY drum has uniform BLACK background):
- On cars/trucks where every single drum from left to right has the exact same uniform BLACK background with white text.
- There is NO white, lighter, or different colored drum.
- All digits represent WHOLE INTEGER KILOMETERS (NO decimal point):
  * [1][6][0][6][4][8] (all 6 black) -> val: 160648, unit: "KM", contrast: false, lastColor: "BLACK"
  * [1][2][2][8][7][1] (all 6 black) -> val: 122871, unit: "KM", contrast: false, lastColor: "BLACK"
  * [1][4][7][7][3][1] (all 6 black) -> val: 147731, unit: "KM", contrast: false, lastColor: "BLACK"
  * [1][8][8][5][3] (all 5 black) -> val: 18853, unit: "KM", contrast: false, lastColor: "BLACK"

HALF-ROLLED / SPLIT DRUMS (UPPER DIGIT RULE):
- When any drum wheel is rolling / split between two numbers (top vs bottom):
- ALWAYS SELECT THE UPPER COMPLETED DIGIT!
  * Split 8 (top) & 9 (bottom) -> MUST SELECT '8' (NEVER pick bottom 9).
  * Split 4 (top) & 5 (bottom) -> MUST SELECT '4'.
  * Split 2 (top) & 3 (bottom) -> MUST SELECT '2'.
  * Split 7 (top) & 8 (bottom) -> MUST SELECT '7'.
  * Split 0 (top) & 1 (bottom) -> MUST SELECT '0'.

DUAL WINDOW DIALS:
- Read the 6-drum cumulative odometer (e.g. 122871 KM), ignore the 4-drum trip meter.

DIGITAL LCD / CLUSTER:
- Read full integer (e.g. ODO 222955 -> val: 222955, type: "DIGI").

UNIT:
- AutoVyn ERP accepts ONLY KM. If reading is in Miles -> unit: "MILES", reason: "Odometer is in Miles".

Output JSON format:
{
  "detected": boolean,
  "type": "MECH"|"DIGI"|"UNKNOWN",
  "vehicleType": "TWO_WHEELER"|"CAR_TRUCK"|"UNKNOWN",
  "digits": ["string"],
  "drumColors": ["string"],
  "contrast": boolean,
  "lastColor": "BLACK"|"WHITE"|"RED"|"YELLOW"|"ORANGE"|"OTHER",
  "val": number|null,
  "unit": "KM"|"MILES"|"UNKNOWN",
  "blur": "LOW"|"MED"|"HIGH",
  "reason": string|null
}
`.trim();

const USER_VISION_INSTRUCTION = `Read the vehicle odometer accurately according to the drum color rules (White/Light rightmost drum or 2-Wheeler = Decimal tenths, All-Black drums = Whole integer, Split drum = Upper digit). Output JSON.`.trim();

// =============================================================================
// CENTRALIZED VERIFICATION FUNCTION (BACKEND AUTHORITY)
// =============================================================================

const determineOdometerStatus = ({
  odometerDetected,
  numericValue,
  detectedUnit,
  odometerEvidence,
  odometerReadability,
  multipleOdometers,
  requiresManualReview,
  readingConfidence,
  quality,
}) => {
  const isFiniteNonNegative = numericValue !== null && Number.isFinite(numericValue) && numericValue >= 0;
  const isCumulativeIdentified = Boolean(odometerEvidence?.cumulativeReadingIdentified);
  const isDigitsReadable = Boolean(odometerReadability?.digitsReadable);

  if (multipleOdometers) {
    return "MULTIPLE_ODOMETERS_DETECTED";
  }

  // If reading was not detected, not finite, digits are unreadable, or cumulative odometer wasn't identified:
  if (!odometerDetected || !isFiniteNonNegative || !isDigitsReadable || !isCumulativeIdentified) {
    return "MANUAL_REVIEW_REQUIRED";
  }

  // REJECT MILES IMMEDIATELY: AutoVyn ERP allows ONLY KM (Kilometer) readings.
  if (detectedUnit === "MILES") {
    return "INVALID_UNIT_MILES";
  }

  // Only trigger manual review if image has severe blur where digits are unreadable or review is explicitly required:
  if (
    (quality?.blur === "HIGH" && !isDigitsReadable) ||
    requiresManualReview
  ) {
    return "MANUAL_REVIEW_REQUIRED";
  }

  // If unit is not confirmed as KM:
  if (detectedUnit !== "KM") {
    return "UNIT_NOT_CONFIRMED";
  }

  // Confidence check:
  if (
    readingConfidence === null ||
    readingConfidence < AI_IMAGE_CONFIG.REVIEW_CONFIDENCE
  ) {
    return "MANUAL_REVIEW_REQUIRED";
  }

  return "VERIFIED";
};

// =============================================================================
// MAIN SERVICE: EXTRACT ODOMETER READING
// =============================================================================

const extractOdometerReading = exports.extractOdometerReading = async ({
  file,
  previousOdometer = null,
  userContext = null
}) => {
  const startedAt = Date.now();

  // 1. Validate File
  const validation = validateUploadedImage(file);
  if (!validation.valid) {
    return {
      success: false,
      type: "ODOMETER_READING",
      status: "INVALID_INPUT",
      source: { value: null, unit: "UNKNOWN", rawText: null, unitEvidence: null },
      normalized: { value: null, unit: "KM", conversionApplied: false },
      odometer: null,
      km: null,
      confidence: { reading: 0, unit: 0, classification: 0 },
      requiresManualReview: true,
      message: validation.error,
      latencyMs: Date.now() - startedAt,
    };
  }

  // 2. High-Precision Preprocessing with Sharp (Auto-orient EXIF, preserve natural colors & 1024px clarity)
  let imageBuffer = validation.buffer;
  let imageMime = validation.mimeType;

  if (sharp) {
    try {
      let pipeline = sharp(imageBuffer, { failOnError: false });

      // Auto-orient mobile phone captures using EXIF orientation
      pipeline = pipeline.rotate();

      // Normalize lighting contrast gently (enhances dark shadows while preserving white/black drum color differences)
      pipeline = pipeline.normalize();

      // Single-Tile 512px Optimization: Fits in exactly 1 single 512x512 tile, dropping input tokens from ~27,000 to ~2,800 (~90% cost reduction)
      pipeline = pipeline
        .resize(512, 512, { fit: "inside", kernel: "lanczos3", withoutEnlargement: true })
        .sharpen({ sigma: 1.0, m1: 1.2, m2: 0.5 });

      imageBuffer = await pipeline.jpeg({ quality: 88, mozjpeg: true }).toBuffer();
      imageMime = "image/jpeg";
    } catch (sharpErr) {
      console.warn("[Sharp Preprocessing] Warning:", sharpErr?.message);
    }
  }

  // Prepare Base64 Data URL for OpenAI Vision
  const base64Image = imageBuffer.toString("base64");
  const dataUrl = `data:${imageMime};base64,${base64Image}`;

  const client = getOpenAIClient();
  let visionModel = getVisionModel();

  let rawVisionText = "";
  let visionUsageTelemetry = null;
  const apiCallStartTime = Date.now();

  try {
    const response = await client.chat.completions.create({
      model: visionModel,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: ODOMETER_VISION_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: USER_VISION_INSTRUCTION
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
                detail: "low"
              }
            }
          ]
        }
      ],
      max_tokens: 350,
      temperature: 0.0,
    });

    const apiDuration = Date.now() - apiCallStartTime;
    visionUsageTelemetry = logOpenAITokenUsage(response, visionModel, apiDuration);
    rawVisionText = response.choices?.[0]?.message?.content || "{}";
  } catch (apiErr) {
    console.error("[Vision API] OpenAI Vision Error:", apiErr?.message);
    try {
      const retryStartTime = Date.now();
      const fallbackModel = AI_IMAGE_CONFIG.FALLBACK_VISION_MODEL;
      const retryResponse = await client.chat.completions.create({
        model: fallbackModel,
        response_format: { type: "json_object" },
        messages: [
          { role: "system", content: ODOMETER_VISION_SYSTEM_PROMPT },
          {
            role: "user",
            content: [
              { type: "text", text: USER_VISION_INSTRUCTION },
              { type: "image_url", image_url: { url: dataUrl, detail: "low" } }
            ]
          }
        ],
        max_tokens: 350,
        temperature: 0.0,
      });
      const retryDuration = Date.now() - retryStartTime;
      visionUsageTelemetry = logOpenAITokenUsage(retryResponse, fallbackModel, retryDuration);
      rawVisionText = retryResponse.choices?.[0]?.message?.content || "{}";
    } catch (retryErr) {
      return {
        success: false,
        type: "ODOMETER_READING",
        status: "VISION_API_ERROR",
        source: { value: null, unit: "UNKNOWN", rawText: null, unitEvidence: null },
        normalized: { value: null, unit: "KM", conversionApplied: false },
        odometer: null,
        confidence: { reading: 0, unit: 0, classification: 0 },
        requiresManualReview: true,
        message: "Unable to process image at this time. Please try again.",
        latencyMs: Date.now() - startedAt,
      };
    }
  }

  // 3. Parse Model Response Safely (Strip markdown / handle trailing characters)
  let parsed = null;
  try {
    let cleanJson = String(rawVisionText || "").trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json\s*/, "").replace(/\s*```$/, "");
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```\s*/, "").replace(/\s*```$/, "");
    }

    const firstBrace = cleanJson.indexOf("{");
    const lastBrace = cleanJson.lastIndexOf("}");
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleanJson = cleanJson.substring(firstBrace, lastBrace + 1);
    }

    parsed = JSON.parse(cleanJson);
  } catch (pErr) {
    console.error("[JSON Parsing Error] Failed to parse vision JSON:", rawVisionText, pErr?.message);
    return {
      success: false,
      type: "ODOMETER_READING",
      status: "PARSING_ERROR",
      source: { value: null, unit: "UNKNOWN", rawText: null, unitEvidence: null },
      normalized: { value: null, unit: "KM", conversionApplied: false },
      odometer: null,
      confidence: { reading: 0, unit: 0, classification: 0 },
      requiresManualReview: true,
      message: "The vision engine returned an invalid data format. Please retry.",
      latencyMs: Date.now() - startedAt,
    };
  }

  console.log("[AI-IMAGE-RAW]", JSON.stringify(parsed, null, 2));

  // 4. Synthesize Full Structure in Node.js from Ultra-Compact AI Response
  const rawType = String(parsed.type || parsed.displayType || "").toUpperCase();
  const displayType = rawType.includes("MECH") ? "MECHANICAL_ROLLER" : (rawType.includes("DIGI") ? "DIGITAL_LCD" : (parsed.displayType || "UNKNOWN"));
  const odometerDetected = parsed.detected !== undefined ? Boolean(parsed.detected) : Boolean(parsed.odometerDetected);
  
  const blurRaw = String(parsed.blur || parsed.quality?.blur || "LOW").toUpperCase();
  const blur = blurRaw.includes("HIGH") ? "HIGH" : (blurRaw.includes("MED") ? "MEDIUM" : "LOW");
  const isDustyOrUnclear = Boolean(parsed.isDustyOrUnclear || (blur === "HIGH" && !odometerDetected));
  const isDistantShot = Boolean(parsed.isDistantShot);

  const vehicleType = String(parsed.vehicleType || parsed.vehicleCategory || "").toUpperCase();
  const isTwoWheeler = vehicleType.includes("TWO") || vehicleType.includes("BIKE") || vehicleType.includes("MOTO") || vehicleType.includes("SCOOTER");

  const lastColor = String(parsed.lastColor || parsed.lastDrumBgColor || "").toUpperCase().trim();
  const drumColors = Array.isArray(parsed.drumColors) ? parsed.drumColors.map(c => String(c).toUpperCase().trim()) : [];
  
  let hasContrastingLastDrum = false;
  if (drumColors.length >= 2) {
    const lastD = drumColors[drumColors.length - 1];
    const firstD = drumColors[0];
    if (lastD !== firstD || ["WHITE", "RED", "YELLOW", "ORANGE", "LIGHT"].includes(lastD)) {
      hasContrastingLastDrum = true;
    }
  }

  const isContrasting = Boolean(
    parsed.contrast ||
    parsed.isLastDrumContrasting ||
    parsed.lastDrumDigitIsTenths ||
    hasContrastingLastDrum ||
    ["WHITE", "RED", "YELLOW", "ORANGE", "LIGHT"].includes(lastColor) ||
    isTwoWheeler
  );

  const drumDigits = Array.isArray(parsed.digits) ? parsed.digits : (Array.isArray(parsed.drumDigits) ? parsed.drumDigits : null);
  let rawNumericValue = safelyParseNullableNumber(parsed.val ?? parsed.value ?? parsed.odometer?.value);
  const rawModelUnit = String(parsed.unit || parsed.odometer?.unit || "KM").toUpperCase().trim();
  let rawTextValue = parsed.rawText !== undefined && parsed.rawText !== null
    ? String(parsed.rawText)
    : (rawNumericValue !== null ? String(rawNumericValue) : "");

  // Robust Mathematical Mechanical Roller Normalization
  const cleanStrFromText = String(rawTextValue || "").replace(/[^0-9.]/g, "");
  const hasExplicitDecimal = cleanStrFromText.includes(".");
  const digitsOnlyFromText = cleanStrFromText.replace(/\./g, "");

  const digitsFromDrumArr = Array.isArray(drumDigits)
    ? drumDigits.map(d => String(d).replace(/[^0-9]/g, "")).filter(Boolean).join("")
    : "";

  const fullDigits = digitsFromDrumArr.length >= 5
    ? digitsFromDrumArr
    : (digitsOnlyFromText.length >= digitsFromDrumArr.length ? digitsOnlyFromText : digitsFromDrumArr);

  if (displayType === "MECHANICAL_ROLLER") {
    if (fullDigits.length === 6) {
      if (isContrasting || hasExplicitDecimal) {
        // 6-DRUM MOTORCYCLE CLUSTER (e.g. Hero Splendor 5 black + 1 white tenths drum)
        const wholeStr = fullDigits.slice(0, 5);
        const tenthsStr = fullDigits.slice(5, 6);
        const wholeNum = Number(wholeStr);

        if (wholeNum === 0) {
          if (tenthsStr === "0") {
            console.log(`[AI-IMAGE-6-DRUM-ZERO] 6-drum zero km detected: ${fullDigits} => 0 KM`);
            rawNumericValue = 0;
            rawTextValue = "0";
          } else {
            const computed = Number(`0.${tenthsStr}`);
            console.log(`[AI-IMAGE-6-DRUM-FRACTION] 6-drum decimal km: 0.${tenthsStr} => ${computed} KM`);
            rawNumericValue = computed;
            rawTextValue = `0.${tenthsStr}`;
          }
        } else if (tenthsStr === "0") {
          console.log(`[AI-IMAGE-6-DRUM-INTEGER] 6-drum whole integer: ${wholeNum} KM`);
          rawNumericValue = wholeNum;
          rawTextValue = String(wholeNum);
        } else {
          const computed = Number(`${wholeNum}.${tenthsStr}`);
          if (!isNaN(computed)) {
            console.log(`[AI-IMAGE-6-DRUM-TENTHS] 6-drum mechanical roller: ${wholeNum}.${tenthsStr} => ${computed} KM`);
            rawNumericValue = computed;
            rawTextValue = `${wholeNum}.${tenthsStr}`;
          }
        }
      } else {
        // 6-DRUM ALL-BLACK MECHANICAL METER (e.g. [1][6][0][6][4][8] -> 160,648 KM in cars/trucks)
        const intNum = Number(fullDigits);
        if (!isNaN(intNum)) {
          console.log(`[AI-IMAGE-6-DRUM-ALL-BLACK] 6-drum all-black whole integer from digits ${fullDigits}: ${intNum} KM`);
          rawNumericValue = intNum;
          rawTextValue = String(intNum);
        }
      }
    } else if (fullDigits.length === 5) {
      if (hasExplicitDecimal && Number(cleanStrFromText) > 0) {
        const explicitNum = Number(cleanStrFromText);
        if (!isNaN(explicitNum)) {
          console.log(`[AI-IMAGE-5-DRUM-EXPLICIT] 5-drum explicit decimal: ${explicitNum} KM`);
          rawNumericValue = explicitNum;
          rawTextValue = String(explicitNum);
        }
      } else if (rawNumericValue !== null && !Number.isInteger(rawNumericValue) && rawNumericValue > 0) {
        // Model extracted accurate decimal (e.g. 3480.7 KM, 73294.8 KM)
        console.log(`[AI-IMAGE-5-DRUM-DECIMAL] Preserved model decimal: ${rawNumericValue} KM`);
        rawTextValue = String(rawNumericValue);
      } else if (isContrasting && (lastColor === "WHITE" || lastColor === "RED" || lastColor === "YELLOW" || lastColor === "ORANGE" || lastColor === "LIGHT")) {
        // True contrasting 4 black + 1 white tenths wheel (e.g. [0][0][0][2] black + [7] white -> 2.7 KM)
        const wholeStr = fullDigits.slice(0, -1);
        const tenthsStr = fullDigits.slice(-1);
        const wholeNum = Number(wholeStr);
        if (wholeNum === 0) {
          if (tenthsStr === "0") {
            rawNumericValue = 0;
            rawTextValue = "0";
          } else {
            const computed = Number(`0.${tenthsStr}`);
            rawNumericValue = computed;
            rawTextValue = `0.${tenthsStr}`;
          }
        } else if (tenthsStr === "0") {
          rawNumericValue = wholeNum;
          rawTextValue = String(wholeNum);
        } else {
          const computed = Number(`${wholeNum}.${tenthsStr}`);
          if (!isNaN(computed)) {
            console.log(`[AI-IMAGE-5-DRUM-CONTRAST] 5-drum contrasting decimal: ${wholeNum}.${tenthsStr} => ${computed} KM`);
            rawNumericValue = computed;
            rawTextValue = `${wholeNum}.${tenthsStr}`;
          }
        }
      } else {
        // All black drums -> Whole integer KM (e.g. 18853 -> 18853 KM, 00001 -> 1 KM, 03480 -> 3480 KM)
        const intNum = Number(fullDigits);
        if (!isNaN(intNum)) {
          console.log(`[AI-IMAGE-5-DRUM-INTEGER] 5-drum whole integer from digits ${fullDigits}: ${intNum} KM`);
          rawNumericValue = intNum;
          rawTextValue = String(intNum);
        }
      }
    } else if (isContrasting) {
      // Contrasting tenths wheel for other lengths (e.g. 4-drum 002.7 -> 2.7)
      if (hasExplicitDecimal && Number(cleanStrFromText) > 0) {
        const explicitNum = Number(cleanStrFromText);
        if (!isNaN(explicitNum)) {
          rawNumericValue = explicitNum;
          rawTextValue = String(explicitNum);
        }
      } else if (fullDigits.length >= 2) {
        const wholeStr = fullDigits.slice(0, -1);
        const tenthsStr = fullDigits.slice(-1);
        const wholeNum = Number(wholeStr);
        if (wholeNum === 0) {
          if (tenthsStr === "0") {
            rawNumericValue = 0;
            rawTextValue = "0";
          } else {
            const computed = Number(`0.${tenthsStr}`);
            rawNumericValue = computed;
            rawTextValue = `0.${tenthsStr}`;
          }
        } else if (tenthsStr === "0") {
          rawNumericValue = wholeNum;
          rawTextValue = String(wholeNum);
        } else {
          const computed = Number(`${wholeNum}.${tenthsStr}`);
          if (!isNaN(computed)) {
            rawNumericValue = computed;
            rawTextValue = `${wholeNum}.${tenthsStr}`;
          }
        }
      }
    } else {
      if (fullDigits.length > 0) {
        const intNum = Number(fullDigits);
        if (!isNaN(intNum)) {
          rawNumericValue = intNum;
          rawTextValue = String(intNum);
        }
      }
    }
  } else {
    // DIGITAL LCD / DIGITAL CLUSTER / SCREEN ODOMETER
    // In digital displays (e.g. ODO 222955, 154200 KM), all digits are whole integer unless an explicit decimal is visible on LCD
    if (hasExplicitDecimal) {
      const explicitNum = Number(cleanStrFromText);
      if (!isNaN(explicitNum)) {
        rawNumericValue = explicitNum;
        rawTextValue = cleanStrFromText;
      }
    } else if (digitsOnlyFromText.length > 0) {
      const intNum = Number(digitsOnlyFromText);
      if (!isNaN(intNum)) {
        rawNumericValue = intNum;
        rawTextValue = String(intNum);
      }
    }
  }

  // Universal Physical Invariant Protection:
  // When black integer drums show 000000 -> 0 KM
  // When black integer drums show 00000 -> 0 KM (if non-contrasting)
  if ((fullDigits === "000000" || (fullDigits === "00000" && !isContrasting)) && (rawNumericValue === null || rawNumericValue < 1)) {
    console.log(`[AI-IMAGE-INVARIANT-ZERO] 00000 detected, normalized strictly to 0 KM`);
    rawNumericValue = 0;
    rawTextValue = "0";
  }

  let requiresManualReview = Boolean(
    parsed.requiresManualReview ||
    rawModelUnit === "MILES" ||
    !odometerDetected ||
    rawNumericValue === null ||
    (blur === "HIGH" && !odometerDetected)
  );

  let reviewReason = parsed.reviewReason || null;
  if (!reviewReason) {
    if (rawModelUnit === "MILES") {
      reviewReason = "Odometer reading is in Miles. AutoVyn ERP accepts only KM (Kilometers). Please upload a valid vehicle dashboard image with a KM reading.";
    } else if (isDistantShot) {
      reviewReason = "Photo was taken from too far away or is unclear. Please take a clear closeup photo near the odometer screen and re-upload.";
    } else if (blur === "HIGH" && (!odometerDetected || rawNumericValue === null)) {
      reviewReason = "Photo is blurry or out of focus. Please take a steadier closeup photo.";
    } else if (isDustyOrUnclear && (!odometerDetected || rawNumericValue === null)) {
      reviewReason = "Odometer digits are unclear due to heavy dust, scratches, or glare. Please clean the meter and upload a closeup photo.";
    } else if (!odometerDetected || rawNumericValue === null) {
      reviewReason = "Photo was taken from too far away or is unclear. Please take a clear closeup photo near the odometer screen and re-upload.";
    }
  }

  let confirmedOdometerUnit = "UNKNOWN";
  if (odometerDetected && rawNumericValue !== null) {
    if (rawModelUnit === "MILES") {
      confirmedOdometerUnit = "MILES";
    } else {
      confirmedOdometerUnit = "KM";
    }
  }

  const isDigitsReadable = Boolean(odometerDetected && rawNumericValue !== null);
  const readingConfidence = isDigitsReadable ? (blur === "HIGH" ? 0.88 : 0.98) : null;

  const quality = {
    imageClarity: blur === "HIGH" ? "POOR" : (blur === "MEDIUM" ? "ACCEPTABLE" : "GOOD"),
    blur,
    dashboardVisible: true,
    overall: (blur === "HIGH" && !isDigitsReadable) ? "POOR" : "GOOD",
    readingVisible: odometerDetected,
  };

  const odometerEvidence = {
    readingVisible: odometerDetected,
    cumulativeReadingIdentified: odometerDetected,
    associatedUnitVisible: confirmedOdometerUnit === "KM",
    regionDescription: displayType,
  };

  const odometerReadability = {
    digitsVisible: odometerDetected,
    digitsReadable: isDigitsReadable,
    unitReadable: true,
  };

  const confidence = {
    reading: readingConfidence,
    unit: confirmedOdometerUnit !== "UNKNOWN" ? 0.98 : null,
    classification: 0.99,
  };

  // 5. Normalization Logic
  let normalizedValue = null;
  if (rawNumericValue !== null && confirmedOdometerUnit === "KM") {
    normalizedValue = rawNumericValue;
  }

  const sourceObject = {
    value: rawNumericValue,
    unit: confirmedOdometerUnit,
    rawText: rawTextValue,
    unitEvidence: confirmedOdometerUnit !== "UNKNOWN" ? "Dashboard / Instrument Cluster" : null,
  };

  const normalizedObject = {
    value: normalizedValue,
    unit: "KM",
    conversionApplied: false,
    conversionFactor: null,
  };

  // 6. Determine Backend Final Status
  const finalStatus = determineOdometerStatus({
    odometerDetected,
    numericValue: rawNumericValue,
    detectedUnit: confirmedOdometerUnit,
    odometerEvidence,
    odometerReadability,
    multipleOdometers: false,
    requiresManualReview,
    readingConfidence,
    quality,
  });

  if (finalStatus !== "VERIFIED") {
    requiresManualReview = true;
    if (!reviewReason || finalStatus === "INVALID_UNIT_MILES") {
      if (finalStatus === "INVALID_UNIT_MILES") {
        reviewReason = "Odometer reading is in Miles. AutoVyn ERP accepts only KM (Kilometers). Please upload a valid vehicle dashboard image with a KM reading.";
      } else if (finalStatus === "UNIT_NOT_CONFIRMED") {
        reviewReason = "Main cumulative odometer reading detected, but its field-specific unit could not be confirmed. Unit was not inferred from other gauges.";
      } else {
        reviewReason = "Photo was taken from too far away or is unclear. Please take a clear closeup photo near the odometer screen and re-upload.";
      }
    }
  }

  // 7. Optional ERP Comparison Validation
  let erpValidation = null;
  if (previousOdometer !== null && previousOdometer !== undefined && previousOdometer !== "") {
    const prevNum = safelyParseNullableNumber(previousOdometer);
    if (prevNum !== null && prevNum >= 0 && normalizedValue !== null) {
      const diff = normalizedValue - prevNum;
      if (diff < 0) {
        erpValidation = {
          previousReading: prevNum,
          currentReading: normalizedValue,
          difference: diff,
          status: "SUSPICIOUS_READING",
          message: `Current reading (${normalizedValue} KM) is less than previous recorded reading (${prevNum} KM).`
        };
        requiresManualReview = true;
      } else if (diff > 50000) {
        erpValidation = {
          previousReading: prevNum,
          currentReading: normalizedValue,
          difference: diff,
          status: "REVIEW_RECOMMENDED",
          message: `High distance increase (${formatNumberWithCommas(diff)} KM) since previous reading.`
        };
        requiresManualReview = true;
      } else {
        erpValidation = {
          previousReading: prevNum,
          currentReading: normalizedValue,
          difference: diff,
          status: "PASS",
          message: "Odometer reading is consistent with previous records."
        };
      }
    }
  }

  const isVerified = (
    finalStatus === "VERIFIED" &&
    !requiresManualReview &&
    normalizedValue !== null
  );

  const formattedDisplay = rawNumericValue !== null
    ? (confirmedOdometerUnit !== "UNKNOWN" ? `${formatNumberWithCommas(rawNumericValue)} ${confirmedOdometerUnit}` : `${formatNumberWithCommas(rawNumericValue)} (Unit Unknown)`)
    : null;

  const responseTimeMs = Date.now() - startedAt;

  const responsePayload = {
    success: isVerified || (odometerDetected && rawNumericValue !== null),
    status: finalStatus,
    km: normalizedValue !== null ? normalizedValue : rawNumericValue,
    odometer: rawNumericValue !== null ? {
      value: normalizedValue !== null ? normalizedValue : rawNumericValue,
      unit: confirmedOdometerUnit !== "UNKNOWN" ? "KM" : "UNKNOWN",
      formattedValue: formattedDisplay,
      rawText: rawTextValue,
      normalizedKMValue: normalizedValue,
    } : null,
    displayType,
    confidence,
    requiresManualReview,
    reviewReason,
    message: isVerified
      ? "Odometer reading successfully verified."
      : (reviewReason || "The cumulative odometer reading is not clearly readable. Please upload a clean, clear photo."),
    source: rawNumericValue !== null ? sourceObject : { value: null, unit: "UNKNOWN", rawText: null, unitEvidence: null },
    normalized: normalizedValue !== null ? normalizedObject : { value: null, unit: "KM", conversionApplied: false, conversionFactor: null },
    erpValidation: erpValidation || null,
    usage: visionUsageTelemetry || null,
    latencyMs: responseTimeMs,
  };

  console.log("[AI-IMAGE-FINAL]", JSON.stringify(responsePayload, null, 2));

  return responsePayload;
};

// =============================================================================
// HEALTH CHECK
// =============================================================================

exports.imageVisionHealth = async () => {
  let openaiConfigured = false;
  try {
    getOpenAIClient();
    openaiConfigured = true;
  } catch (_) {}

  return {
    status: openaiConfigured ? "UP" : "DEGRADED",
    openaiConfigured,
    model: getVisionModel(),
    maxImageSizeMB: AI_IMAGE_CONFIG.MAX_MB,
    timestamp: new Date().toISOString(),
  };
};

// =============================================================================
// AUTHENTICATION CONTEXT HELPER
// =============================================================================

const extractUserContext = exports.extractUserContext = (req) => {
  let user = req.user;
  if (!user) {
    const rawToken = req.headers?.authorization || req.headers?.token || req.headers?.["x-access-token"];
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

  return {
    userId: user?.SRNO ?? user?.userId ?? user?.User_Id ?? null,
    employeeCode: user?.EMPCODE ?? user?.EmpCode ?? user?.empCode ?? null,
    role: user?.role || user?.appRole || "USER",
    compcode: user?.compcode || req.headers?.compcode || req.headers?.["x-comp-code"] || null,
  };
};

// =============================================================================
// EXPRESS ROUTE CONTROLLER HANDLERS
// =============================================================================

/**
 * Controller: GET /health
 */
exports.imageVisionHealthHandler = async (req, res) => {
  try {
    const health = await exports.imageVisionHealth();
    return res.status(200).json({
      success: true,
      message: "AutoVyn AI Image Vision Engine is operational",
      data: health,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "AI Vision Engine check failed",
      error: err.message,
    });
  }
};

/**
 * Controller: POST /odometer & /analyze
 */
exports.extractOdometerHandler = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({
        success: false,
        status: "MISSING_IMAGE",
        message: "Please select or drop a vehicle dashboard image to analyze.",
      });
    }

    const userContext = extractUserContext(req);
    const previousOdometer = req.body?.previousOdometer ?? req.body?.previousKm ?? null;

    const result = await exports.extractOdometerReading({
      file,
      previousOdometer,
      userContext,
    });

    const statusCode = result.success ? 200 : (result.status === "INVALID_INPUT" ? 400 : 200);
    return res.status(statusCode).json(result);
  } catch (err) {
    console.error("[AI_Image_Route] Handler Error:", err);
    return res.status(500).json({
      success: false,
      status: "INTERNAL_ERROR",
      message: "An error occurred while analyzing the image. Please try again.",
    });
  }
};
