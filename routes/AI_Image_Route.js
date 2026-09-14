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

const AI_IMAGE_CONFIG = {
  VISION_MODEL: process.env.OPENAI_VISION_MODEL || "gpt-4o",
  FALLBACK_VISION_MODEL: "gpt-4o-mini",
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

/**
 * Programmatic check for image dimensions and minimum pixel clarity
 */
const inspectImageBuffer = async (buffer) => {
  if (!sharp) return { isTooSmallOrBlurry: false };
  try {
    const meta = await sharp(buffer).metadata();
    const width = meta.width || 0;
    const height = meta.height || 0;
    const totalPixels = width * height;

    // Minimum resolution guard: A tiny thumbnail (< 30,000 pixels or < 120px) cannot verify 5-6 digits without guessing
    if (totalPixels < 30000 || width < 120 || height < 80) {
      return {
        isTooSmallOrBlurry: true,
        width,
        height,
        totalPixels,
        reason: `Image resolution (${width}x${height} px) is too low or a small thumbnail. Guessing digits is strictly prohibited.`
      };
    }

    return {
      isTooSmallOrBlurry: false,
      width,
      height,
      totalPixels
    };
  } catch (err) {
    return {
      isTooSmallOrBlurry: false,
      error: err.message
    };
  }
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
// VISION PROMPT & INSTRUCTION DEFINITIONS
// =============================================================================

const ODOMETER_VISION_SYSTEM_PROMPT = `
You are a highly specialized AI Vision engine for vehicle dashboard and instrument cluster inspection in AutoVyn ERP.
Your mission is to accurately detect and extract the vehicle's MAIN CUMULATIVE ODOMETER reading (total lifetime distance traveled) from an uploaded image in JSON.

CORE RULES & CRITICAL PRINCIPLES:

RULE 1 — STRICT SEQUENTIAL DRUM-BY-DRUM INSPECTION ON 2-WHEELERS & ANALOG METERS:
- On mechanical roller meters (Hero, Bajaj, TVS, Yamaha, Honda, cars):
  * Count the EXACT number of physical drum columns visible in the rectangular window (standard is 6 drums: 5 leading whole-KM drums + 1 rightmost tenths drum).
  * Inspect EVERY single drum column strictly one-by-one from 1st (left) to 6th (right) without merging, skipping, or guessing:
    - 1st drum (leftmost column): inspect digit (e.g. '1')
    - 2nd drum (second column): inspect digit (e.g. '7' — NEVER skip or merge with 3rd drum!)
    - 3rd drum (third column): inspect digit (e.g. '3')
    - 4th drum (fourth column): inspect digit (e.g. '4')
    - 5th drum (fifth column): inspect digit (e.g. '7' or '1')
    - 6th drum (rightmost column, white tenths drum): inspect digit (if split between upper 4 and lower 5, ALWAYS SELECT UPPER DIGIT '4')
  * You MUST report each drum's exact digit in "mechanicalDrumsAnalysis.rawDigitsPerDrum" (e.g. ["1", "7", "3", "4", "7", "4"]).

RULE 2 — MECHANICAL ROLLER COLOR-CODING & DECIMAL FRACTION PLACEMENT:
  * CASE A: ALL DRUMS HAVE THE EXACT SAME BACKGROUND COLOR (WHOLE KM / NO DECIMAL POINT):
    - If ALL drums have the EXACT SAME background color (e.g. all 6 drums are black with white text: [1][2][2][8][7][1] or [1][3][5][6][9][6] or [2][0][1][0][4][0]):
    - EVERY digit is a WHOLE KILOMETER!
    - IT IS STRICTLY FORBIDDEN TO INSERT A DECIMAL POINT!
    - Set "hasContrastingLastWheelColor": false, "isLastDrumContrasting": false
    - Example: [1][2][2][8][7][1] (all black) -> Reading is 122871 KM (value: 122871, rawText: "122871", unit: "KM").

  * CASE B: CONTRASTING RIGHTMOST DRUM (TENTHS OF A KM / 0.1 KM FRACTION):
    - When the rightmost (last) drum has a CONTRASTING / INVERTED color (e.g. WHITE / LIGHT / SILVER / RED background with BLACK digits, while preceding drums are black with white digits):
    - Set "hasContrastingLastWheelColor": true, "isLastDrumContrasting": true
    - This contrasting rightmost drum represents TENTHS OF A KM (0.1 KM / 100 meters).
    - YOU MUST INSERT A DECIMAL POINT (.) DIRECTLY BEFORE THIS LAST CONTRASTING DIGIT:
    - Example: 5 black drums [1][7][3][4][7] + 1 WHITE drum [4] -> Reading is 17347.4 KM (value: 17347.4, rawText: "17347.4", unit: "KM").
    - Example: 5 black drums [0][0][5][1][2] + 1 WHITE drum [6] -> Reading is 512.6 KM (value: 512.6, rawText: "00512.6", unit: "KM").
    - Example: 5 black drums [1][8][6][1][5] + 1 WHITE drum [8] -> Reading is 18615.8 KM (value: 18615.8, rawText: "18615.8", unit: "KM").
    - Example: 5 black drums [7][6][0][6][2] + 1 WHITE drum [5] -> Reading is 76062.5 KM (value: 76062.5, rawText: "76062.5", unit: "KM").
    - Example: 5 black drums [5][0][1][0][0] + 1 WHITE drum [0] -> Reading is 50100.0 KM (value: 50100, rawText: "50100.0", unit: "KM").

RULE 3 — STUCK / HALF-VISIBLE / SPLIT ROTATING DRUMS (ALWAYS CHOOSE PRECEDING UPPER DIGIT):
- When any roller drum is stuck, midway rotating, or split vertically between two numbers (e.g. between upper 4 and lower 5, or between upper 8 and lower 9):
- YOU MUST ALWAYS SELECT THE UPPER (TOP / PRECEDING) DIGIT ONLY! NEVER SELECT THE ADVANCING LOWER DIGIT!
- Example: If the 6th white drum is split between upper '4' and lower '5' in [1][7][3][4][7][4/5] -> Select the UPPER digit '4' (17347.4 KM, NOT 17347.5).
- Example: If the 4th drum is split showing '8' on top and '9' on bottom in [1][2][2][8/9][7][1] -> Select the UPPER digit '8' (122871 KM).

RULE 4 — SPEED IS NEVER AN ODOMETER:
- Current Speed (e.g. "0 km/h", "75 MPH" on speedometer dial) is SPEED, NOT cumulative odometer. Classify in "otherReadings".

RULE 5 — DIGITAL LCD / 7-SEGMENT & MULTI-DIGIT PATTERN RULES:
- On digital LCD displays (e.g. digital strip at bottom of speedometer showing temperature and mileage):
- Inspect every single 7-segment digit systematically from left to right:
  * Check every single digit: e.g. '1', '9', '9', '9', '9', '9' -> 199999 KM (value: 199999).
  * Check repeated digits carefully: If consecutive digits share the identical 7-segment shape (like five identical 9s in 199999), verify that all five are '9' (199999 KM). Do NOT confuse '9' with '5' or '3'!
  * Separate secondary readings like temperature "12°C" or "24°C" into otherReadings (type: "TEMPERATURE", value: "12", unit: "°C").

RULE 6 — DUSTY, DIRTY, SCRATCHED, WORN, OR PARTIALLY OBSCURED METERS (STRICT REJECTION):
- If the meter glass, dial face, or roller drum numbers are covered in dust, dirt, scratches, glare, fading, or are worn out / half-obscured / faint / illegible:
- 0% GUESSING ALLOWED! DO NOT GUESS OR ESTIMATE UNCERTAIN DIGITS!
- Set "odometerDetected": false
- Set "odometer": null
- Set "odometerReadability": { "digitsVisible": false, "digitsReadable": false, "unitReadable": false }
- Set "quality": { "imageClarity": "POOR", "blur": "HIGH", "dashboardVisible": true }
- Set "requiresManualReview": true
- Set "reviewReason": "Odometer digits are unclear due to dust, scratches, glare, or blur. Please clean the meter and upload a sharp closeup photo."

RULE 7 — DISTANT CABIN SHOTS / PHOTO TAKEN FROM TOO FAR (CLEAR DISTANCE REJECTION):
- When a photo is taken from too far away (e.g. wide cabin shot showing the steering wheel, road, windshield, or entire car interior where the odometer counter is a small or distant strip):
- ZERO GUESSING TOLERANCE: Do NOT attempt to guess small, blurry or distant numbers!
- Set "odometerDetected": false
- Set "odometer": null
- Set "quality": { "imageClarity": "POOR", "blur": "HIGH", "dashboardVisible": true }
- Set "requiresManualReview": true
- Set "reviewReason": "Photo was taken from too far away or is unclear. Please take a clear closeup photo near the odometer screen and re-upload."

RULE 8 — STRICT MILES REJECTION (AUTOVYN ERP ACCEPTS ONLY KM):
- If the vehicle's odometer counter is in MILES (e.g. "85367 miles"):
- DO NOT convert to KM!
- Set "odometer.unit": "MILES"
- Set "requiresManualReview": true
- Set "reviewReason": "Odometer reading is in Miles. AutoVyn ERP accepts only KM (Kilometers). Please upload a valid vehicle dashboard image with a KM reading."

RULE 9 — DUAL MECHANICAL SLOTS (6-DRUM MAIN ODOMETER VS 4-DRUM TRIP METER):
- When a speedometer dial has TWO rectangular mechanical counter windows:
  1. Identify which slot is the MAIN CUMULATIVE ODOMETER vs TRIP METER by counting drums:
     - The MAIN CUMULATIVE ODOMETER is ALWAYS the slot with 6 DRUM COLUMNS (e.g. [2][0][1][0][4][0] in bottom slot, or [1][3][5][6][9][6] in top slot).
     - The TRIP METER is ALWAYS the slot with FEWER DRUMS (typically 4 digits e.g. [5][7][1][6] or [9][6][5][4] with a tenths wheel).
  2. Inspect the 6-drum MAIN CUMULATIVE ODOMETER:
     - Count all 6 digits: e.g. [2] [0] [1] [0] [4] [0] -> 201040 KM.
     - If all 6 drums have the same black background with white text: ALL 6 digits are WHOLE KM INTEGER (201040 KM, value: 201040, rawText: "201040", unit: "KM").
     - IT IS STRICTLY FORBIDDEN TO DROP THE LAST ZERO OR INSERT A DECIMAL POINT (e.g. 20104.0 or 20104 is STRICTLY WRONG; 201040 is CORRECT)!
     - Set "hasContrastingLastWheelColor": false, "isLastDrumContrasting": false.
  3. Put the 4-drum TRIP METER (e.g. 571.6 KM or 965.4 KM) into "otherReadings": [{ "type": "TRIP", "value": 571.6, "unit": "KM" }].
     - NEVER let the trip meter's colored tenths wheel add a decimal point to the 6-drum main cumulative odometer!

You must respond ONLY with a valid JSON object strictly matching this schema:
{
  "imageType": "VEHICLE_DASHBOARD" | "ODOMETER_CLOSEUP" | "MULTIPLE_DASHBOARDS" | "NON_DASHBOARD" | "UNKNOWN",
  "displayType": "MECHANICAL_ROLLER" | "DIGITAL_LCD" | "DIGITAL_CLUSTER" | "ANALOG_DIGITAL_MIXED" | "UNKNOWN",
  "odometerDetected": boolean,
  "mechanicalDrumsAnalysis": {
    "totalDrumsCount": number,
    "drumsBackgroundColors": string[], // e.g. ["BLACK", "BLACK", "BLACK", "BLACK", "BLACK", "BLACK"]
    "drumsTextColors": string[],       // e.g. ["WHITE", "WHITE", "WHITE", "WHITE", "WHITE", "WHITE"]
    "isLastDrumContrasting": boolean,  // true only if the MAIN odometer's own last drum is contrasting
    "rawDigitsPerDrum": string[]       // e.g. ["2", "0", "1", "0", "4", "0"] (take UPPER digit if split)
  } | null,
  "hasContrastingLastWheelColor": boolean,
  "odometer": {
    "value": number | null,
    "rawText": string | null,
    "unit": "KM" | "MILES" | "UNKNOWN",
    "unitEvidence": string | null
  } | null,
  "odometerEvidence": {
    "readingVisible": boolean,
    "cumulativeReadingIdentified": boolean,
    "associatedUnitVisible": boolean,
    "regionDescription": string | null
  },
  "odometerReadability": {
    "digitsVisible": boolean,
    "digitsReadable": boolean,
    "unitReadable": boolean
  },
  "quality": {
    "imageClarity": "GOOD" | "ACCEPTABLE" | "POOR",
    "blur": "LOW" | "MEDIUM" | "HIGH",
    "dashboardVisible": boolean
  },
  "confidence": {
    "reading": number | null,      // 0.0 to 1.0
    "unit": number | null,         // 0.0 to 1.0
    "classification": number      // 0.0 to 1.0
  },
  "otherReadings": [
    {
      "type": "SPEED" | "TRIP" | "TIME" | "TEMPERATURE" | "RANGE" | "OTHER",
      "value": string | number,
      "unit": string | null,
      "unitEvidence": string | null
    }
  ],
  "multipleOdometersDetected": boolean, // ONLY true if multiple separate vehicles or multiple instrument cluster panels are present in one image. Main Odometer + Trip meter in the same cluster = false.
  "requiresManualReview": boolean,
  "reviewReason": string | null
}
`.trim();

const USER_VISION_INSTRUCTION = `
Inspect this vehicle dashboard photo and extract the cumulative odometer reading strictly in JSON.
KEY INSTRUCTIONS:
1. DUST / SCRATCH / UNREADABLE DIGIT CHECK: If the meter is dusty, dirty, scratched, weathered, or digits are faint / half-cut / uncertain -> DO NOT GUESS! Set odometerDetected: false, odometer: null, requiresManualReview: true, reviewReason: "Odometer digits are unclear due to dust, scratches, glare, or blur. Please clean the meter and upload a sharp closeup photo."
2. DISTANT SHOT CHECK: If the photo is taken from far away (wide shot) -> Set odometerDetected: false, requiresManualReview: true, reviewReason: "Photo was taken from too far away or is unclear. Please take a clear closeup photo near the odometer screen and re-upload."
3. MILES CHECK: If the odometer is in MILES (e.g. 85367 miles) -> Set unit: "MILES", requiresManualReview: true, reviewReason: "Odometer reading is in Miles. AutoVyn ERP accepts only KM (Kilometers). Please upload a valid vehicle dashboard image with a KM reading." DO NOT convert to KM.
4. ZERO GUESSING: If any digit is unclear or uncertain, reject guessing completely.
5. DUAL MECHANICAL SLOTS: The slot with 6 DRUMS is the MAIN CUMULATIVE ODOMETER (e.g. [2][0][1][0][4][0] -> 201040 KM, or [1][3][5][6][9][6] -> 135696 KM; all 6 black drums = WHOLE INTEGER KM, NO decimal point, never drop the last zero!). The slot with 4 DRUMS is the TRIP METER (e.g. [5][7][1][6] -> 571.6 KM) -> put trip in otherReadings.
6. MECHANICAL ROLLER DRUMS: Inspect every drum's background & text color on the main odometer. If leading drums are BLACK with white digits (e.g. 0 0 5 1 2) and the 6th drum is WHITE/LIGHT with dark digit (e.g. 6), the 6th drum is a tenths decimal drum -> reading is 512.6 KM (rawText: "00512.6", value: 512.6). When ALL drums have identical background color, it is a whole KM integer (e.g. 201040 KM or 135696 KM).
7. DIGITAL LCD (e.g. 199999 with 12°C): inspect every single digit from left to right (1-9-9-9-9-9 -> 199999 KM). Put temperature 12°C in otherReadings.
8. If split drum -> take UPPER digit.
9. SPEED (e.g. 0 km/h or 60 km/h) is not odometer.
10. Return strictly valid JSON.
`.trim();

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

  // ZERO TOLERANCE FOR ANY BLUR OR DEGRADED CLARITY (STRICT AUDIT):
  if (
    quality?.blur === "HIGH" ||
    quality?.blur === "MEDIUM" ||
    quality?.imageClarity === "POOR" ||
    requiresManualReview
  ) {
    return "MANUAL_REVIEW_REQUIRED";
  }

  // If unit is not confirmed as KM:
  if (detectedUnit !== "KM") {
    return "UNIT_NOT_CONFIRMED";
  }

  // Strict confidence check (Must be >= AUTO_ACCEPT_CONFIDENCE e.g. 0.95):
  if (
    readingConfidence === null ||
    readingConfidence < AI_IMAGE_CONFIG.AUTO_ACCEPT_CONFIDENCE
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

  // 2. Preprocess / Upscale Small Crops with Sharp for Optimal AI Recognition
  let imageBuffer = validation.buffer;
  let imageMime = validation.mimeType;

  if (sharp) {
    try {
      const meta = await sharp(imageBuffer).metadata();
      if ((meta.width && meta.width < 1000) || (meta.height && meta.height < 1000)) {
        imageBuffer = await sharp(imageBuffer)
          .resize(1000, 1000, { fit: "inside", kernel: "lanczos3" })
          .sharpen({ sigma: 1.2 })
          .png()
          .toBuffer();
        imageMime = "image/png";
      }
    } catch (_) {}
  }

  // Prepare Base64 Data URL for OpenAI Vision
  const base64Image = imageBuffer.toString("base64");
  const dataUrl = `data:${imageMime};base64,${base64Image}`;

  const client = getOpenAIClient();
  let visionModel = AI_IMAGE_CONFIG.VISION_MODEL;

  let rawVisionText = "";
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
                detail: "high"
              }
            }
          ]
        }
      ],
      max_tokens: 1000,
      temperature: 0.0,
    });

    rawVisionText = response.choices?.[0]?.message?.content || "{}";
  } catch (apiErr) {
    console.error("[Vision API] OpenAI Vision Error:", apiErr?.message);
    if (visionModel !== AI_IMAGE_CONFIG.FALLBACK_VISION_MODEL) {
      try {
        visionModel = AI_IMAGE_CONFIG.FALLBACK_VISION_MODEL;
        const retryResponse = await client.chat.completions.create({
          model: visionModel,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: ODOMETER_VISION_SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                { type: "text", text: USER_VISION_INSTRUCTION },
                { type: "image_url", image_url: { url: dataUrl, detail: "high" } }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.0,
        });
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
    } else {
      return {
        success: false,
        type: "ODOMETER_READING",
        status: "VISION_API_ERROR",
        source: { value: null, unit: "UNKNOWN", rawText: null, unitEvidence: null },
        normalized: { value: null, unit: "KM", conversionApplied: false },
        odometer: null,
        confidence: { reading: 0, unit: 0, classification: 0 },
        requiresManualReview: true,
        message: "Image analysis is temporarily unavailable.",
        latencyMs: Date.now() - startedAt,
      };
    }
  }

  // 3. STEP 1: LOG RAW MODEL RESPONSE TEMPORARILY
  let parsed;
  try {
    parsed = JSON.parse(rawVisionText);
  } catch (pErr) {
    return {
      success: false,
      type: "ODOMETER_READING",
      status: "PARSING_ERROR",
      source: { value: null, unit: "UNKNOWN", rawText: null, unitEvidence: null },
      normalized: { value: null, unit: "KM", conversionApplied: false },
      odometer: null,
      confidence: { reading: 0, unit: 0, classification: 0 },
      requiresManualReview: true,
      message: "The vision engine returned an invalid data format.",
      latencyMs: Date.now() - startedAt,
    };
  }

  console.log("[AI-IMAGE-RAW]", JSON.stringify({
    odometerDetected: parsed?.odometerDetected,
    odometer: parsed?.odometer,
    odometerEvidence: parsed?.odometerEvidence,
    odometerReadability: parsed?.odometerReadability,
    quality: parsed?.quality,
    confidence: parsed?.confidence,
    otherReadings: parsed?.otherReadings,
    requiresManualReview: parsed?.requiresManualReview,
    reviewReason: parsed?.reviewReason,
  }, null, 2));

  // 4. Safe Parsing & Field-Specific Unit Isolation
  const imageType = parsed.imageType || "UNKNOWN";
  const displayType = parsed.displayType || "UNKNOWN";
  const odometerData = parsed.odometer || null;
  const multipleOdometers = Boolean(imageType === "MULTIPLE_DASHBOARDS" || (parsed.multipleOdometersDetected && imageType !== "VEHICLE_DASHBOARD" && imageType !== "ODOMETER_CLOSEUP"));

  const quality = {
    imageClarity: parsed.quality?.imageClarity || (parsed.quality?.overall ? parsed.quality.overall : "ACCEPTABLE"),
    blur: parsed.quality?.blur || "LOW",
    dashboardVisible: parsed.quality?.dashboardVisible !== undefined ? Boolean(parsed.quality.dashboardVisible) : true,
    overall: parsed.quality?.overall || parsed.quality?.imageClarity || "ACCEPTABLE",
    readingVisible: parsed.odometerEvidence?.readingVisible !== undefined ? Boolean(parsed.odometerEvidence.readingVisible) : (parsed.quality?.readingVisible !== undefined ? Boolean(parsed.quality.readingVisible) : false),
  };

  const odometerEvidence = {
    readingVisible: Boolean(parsed.odometerEvidence?.readingVisible),
    cumulativeReadingIdentified: Boolean(parsed.odometerEvidence?.cumulativeReadingIdentified),
    associatedUnitVisible: Boolean(parsed.odometerEvidence?.associatedUnitVisible),
    regionDescription: parsed.odometerEvidence?.regionDescription || null,
  };

  const odometerReadability = {
    digitsVisible: Boolean(parsed.odometerReadability?.digitsVisible),
    digitsReadable: Boolean(parsed.odometerReadability?.digitsReadable),
    unitReadable: Boolean(parsed.odometerReadability?.unitReadable),
  };

  const rawConfidence = parsed.confidence || {};
  const drumsAnalysis = parsed.mechanicalDrumsAnalysis || {};
  const bgColors = Array.isArray(drumsAnalysis.drumsBackgroundColors) ? drumsAnalysis.drumsBackgroundColors.map(c => String(c).toUpperCase()) : [];
  const txtColors = Array.isArray(drumsAnalysis.drumsTextColors) ? drumsAnalysis.drumsTextColors.map(c => String(c).toUpperCase()) : [];

  let lastDrumIsContrasting = Boolean(
    parsed.hasContrastingLastWheelColor ||
    drumsAnalysis.isLastDrumContrasting ||
    (bgColors.length > 1 && bgColors[bgColors.length - 1] !== bgColors[0] && ["WHITE", "RED", "YELLOW", "ORANGE", "LIGHT"].some(c => bgColors[bgColors.length - 1].includes(c))) ||
    (txtColors.length > 1 && txtColors[txtColors.length - 1] !== txtColors[0] && txtColors[txtColors.length - 1].includes("BLACK")) ||
    (drumsAnalysis.leadingDrumsBackgroundColor &&
      drumsAnalysis.lastDrumBackgroundColor &&
      String(drumsAnalysis.leadingDrumsBackgroundColor).toUpperCase() !== String(drumsAnalysis.lastDrumBackgroundColor).toUpperCase() &&
      ["WHITE", "RED", "YELLOW", "ORANGE", "LIGHT"].some(c => String(drumsAnalysis.lastDrumBackgroundColor).toUpperCase().includes(c)))
  );

  const hasContrastingLastWheelColor = lastDrumIsContrasting;
  const isContrasting = lastDrumIsContrasting;

  let rawNumericValue = safelyParseNullableNumber(odometerData?.value);
  const rawModelUnit = String(odometerData?.unit || "UNKNOWN").toUpperCase().trim();
  const odometerUnitEvidence = odometerData?.unitEvidence || null;
  let rawTextValue = odometerData?.rawText !== undefined && odometerData?.rawText !== null ? String(odometerData.rawText) : (rawNumericValue !== null ? String(rawNumericValue) : null);

  // BIDIRECTIONAL MECHANICAL ROLLER AUTO-CORRECTION:
  // RULE: SAME BACKGROUND COLOR ON ALL DRUMS = WHOLE KM (NO DECIMAL POINT).
  // ONLY A VISIBLY CONTRASTING RIGHTMOST DRUM (WHITE/RED) = TENTHS (.X KM).
  if (displayType === "MECHANICAL_ROLLER" && rawNumericValue !== null) {
    if (isContrasting) {
      // CASE B: Contrasting last wheel (e.g. white or red drum with black text vs preceding black drums with white text)
      if (Number.isInteger(rawNumericValue)) {
        const rawDigits = (Array.isArray(drumsAnalysis.rawDigitsPerDrum) && drumsAnalysis.rawDigitsPerDrum.length > 1)
          ? drumsAnalysis.rawDigitsPerDrum.join("")
          : (rawTextValue || String(rawNumericValue));
        const cleanDigits = String(rawDigits).replace(/[^0-9]/g, "");

        if (cleanDigits.length >= 2) {
          const whole = Number(cleanDigits.slice(0, -1));
          const frac = cleanDigits.slice(-1);
          const corrected = Number(`${whole}.${frac}`);
          if (!isNaN(corrected)) {
            console.log(`[AI-IMAGE-CORRECTION] Corrected contrasting mechanical roller from integer ${rawNumericValue} to decimal ${corrected}`);
            rawNumericValue = corrected;
            rawTextValue = `${whole}.${frac}`;
          }
        } else if (cleanDigits.length === 1) {
          rawNumericValue = Number(`0.${cleanDigits}`);
          rawTextValue = `0.${cleanDigits}`;
        }
      }
    } else {
      // CASE A: All wheels have the SAME background color -> ALL digits are WHOLE KM (NO decimal point)
      if (!Number.isInteger(rawNumericValue)) {
        const cleanDigits = String(rawTextValue || rawNumericValue).replace(/[^0-9]/g, "");
        if (cleanDigits && cleanDigits.length > 0) {
          const corrected = Number(cleanDigits);
          console.log(`[AI-IMAGE-CORRECTION] Corrected same-color mechanical roller from decimal ${rawNumericValue} to whole integer ${corrected}`);
          rawNumericValue = corrected;
          rawTextValue = cleanDigits;
        }
      }
    }
  }

  let requiresManualReview = Boolean(parsed.requiresManualReview);
  let reviewReason = parsed.reviewReason || null;

  // CUMULATIVE ODOMETER UNIT RESOLUTION (AUTOVYN AUTOMOTIVE ERP STANDARD):
  // 1. If the odometer counter itself is explicitly marked MILES -> unit is MILES.
  // 2. Unrelated secondary dials (Speedometer = 75 MPH, Trip = 456.2 MILES, Secondary gauge = 3000 MILES) stay in otherReadings and do NOT override the main cumulative counter.
  // 3. For any clear cumulative odometer reading where no unit is printed adjacent or KM is present -> unit is KM (Automotive standard).
  let confirmedOdometerUnit = "UNKNOWN";
  if (parsed.odometerDetected && rawNumericValue !== null && odometerReadability.digitsReadable) {
    if (
      rawModelUnit === "MILES" &&
      (odometerEvidence.associatedUnitVisible || (odometerUnitEvidence && odometerUnitEvidence.toLowerCase().includes("mile")))
    ) {
      confirmedOdometerUnit = "MILES";
    } else {
      confirmedOdometerUnit = "KM";
    }
  }

  // Safe confidence extraction (Never default missing/unreadable to 1.0)
  const readingConfidence = (
    parsed.odometerDetected &&
    rawNumericValue !== null &&
    odometerReadability.digitsReadable &&
    typeof rawConfidence.reading === "number" &&
    !isNaN(rawConfidence.reading)
  ) ? Math.max(0, Math.min(1, rawConfidence.reading)) : (
    (parsed.odometerDetected && rawNumericValue !== null && odometerReadability.digitsReadable) ? 0.95 : null
  );

  const confidence = {
    reading: readingConfidence,
    unit: (confirmedOdometerUnit !== "UNKNOWN" && readingConfidence !== null) ? Math.max(0, Math.min(1, typeof rawConfidence.unit === "number" && !isNaN(rawConfidence.unit) ? rawConfidence.unit : 0.95)) : null,
    classification: typeof rawConfidence.classification === "number" && !isNaN(rawConfidence.classification) ? Math.max(0, Math.min(1, rawConfidence.classification)) : 0,
  };

  console.log("[AI-IMAGE-PARSED]", JSON.stringify({
    imageType,
    displayType,
    hasContrastingLastWheelColor,
    rawNumericValue,
    confirmedOdometerUnit,
    odometerUnitEvidence,
    rawTextValue,
    odometerEvidence,
    odometerReadability,
    quality,
    readingConfidence,
  }, null, 2));

  // 5. Normalization Logic (AutoVyn ERP requires native KM readings only; MILES are rejected without conversion)
  let normalizedValue = null;
  let conversionApplied = false;

  if (rawNumericValue !== null && confirmedOdometerUnit === "KM") {
    normalizedValue = rawNumericValue;
    conversionApplied = false;
  } else {
    normalizedValue = null;
    conversionApplied = false;
  }

  const sourceObject = {
    value: rawNumericValue,
    unit: confirmedOdometerUnit,
    rawText: rawTextValue,
    unitEvidence: confirmedOdometerUnit !== "UNKNOWN" ? odometerUnitEvidence : null,
  };

  const normalizedObject = {
    value: normalizedValue,
    unit: "KM",
    conversionApplied: false,
    conversionFactor: null,
  };

  console.log("[AI-IMAGE-NORMALIZED]", JSON.stringify({
    source: sourceObject,
    normalized: normalizedObject,
  }, null, 2));

  // 6. Determine Backend Final Status
  const finalStatus = determineOdometerStatus({
    odometerDetected: Boolean(parsed.odometerDetected),
    numericValue: rawNumericValue,
    detectedUnit: confirmedOdometerUnit,
    odometerEvidence,
    odometerReadability,
    multipleOdometers,
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
      } else if (finalStatus === "MULTIPLE_ODOMETERS_DETECTED") {
        reviewReason = "Multiple dashboard readings were detected. Please upload an image of a single vehicle dashboard.";
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

  // Development Diagnostic Info (Step 16)
  const debugInfo = process.env.NODE_ENV !== "production" ? {
    modelOdometerValue: parsed?.odometer?.value ?? null,
    parsedOdometerValue: rawNumericValue,
    modelUnit: parsed?.odometer?.unit ?? null,
    confirmedOdometerUnit,
    odometerUnitEvidence,
    odometerDetected: Boolean(parsed?.odometerDetected),
    digitsReadable: Boolean(odometerReadability?.digitsReadable),
    cumulativeReadingIdentified: Boolean(odometerEvidence?.cumulativeReadingIdentified),
    finalStatus,
    decisionReason: reviewReason || "Passed all verification guards",
  } : undefined;

  const responsePayload = {
    success: isVerified,
    status: finalStatus,
    km: isVerified ? (normalizedValue !== null ? normalizedValue : rawNumericValue) : null,
    odometer: isVerified ? {
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
      : (reviewReason || "The cumulative odometer reading is not clearly readable due to blur or low resolution. Please upload a clean, clear photo."),
    source: isVerified ? sourceObject : { value: null, unit: "UNKNOWN", rawText: null, unitEvidence: null },
    normalized: isVerified ? normalizedObject : { value: null, unit: "KM", conversionApplied: false, conversionFactor: null },
    erpValidation: erpValidation || null,
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
    model: AI_IMAGE_CONFIG.VISION_MODEL,
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
