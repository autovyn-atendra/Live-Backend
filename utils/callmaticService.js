

const axios = require("axios");

const CALLMATIC_CONFIG = {
  API_KEY: "857e790e-ad5f-4816-9530-0ae643988229",
  CAMPAIGN_ID: "ef6b5a51-c8eb-4ca4-8297-6596a245fa3c",
  BASE_URL: "https://api.callmatic.ai/v1",
};

const headers = {
  "Content-Type": "application/json",
  "api-key": CALLMATIC_CONFIG.API_KEY,
};

// ✅ 1. Single Call - ab "variables" ek dynamic object hai (1 key ho ya 20, fark nahi padta)
const triggerSingleCall = async (phoneNumber, variables = {}) => {
  const response = await axios.post(
    `${CALLMATIC_CONFIG.BASE_URL}/calls`,
    {
      campaignId: CALLMATIC_CONFIG.CAMPAIGN_ID,
      phoneNumber,
      variables, // <-- jo bhi object pass karoge wahi chala jayega
    },
    { headers }
  );
  return response.data.data;
};

// // ✅ 2. Batch Calls (max 200) - har lead apna alag variables object le sakta hai
// const triggerBatchCalls = async (leads = []) => {
//   if (!leads.length || leads.length > 200) {
//     throw new Error("leads array must have 1-200 entries");
//   }
//   const response = await axios.post(
//     `${CALLMATIC_CONFIG.BASE_URL}/calls/batch`,
//     {
//       campaignId: lead.Campain_ID || CALLMATIC_CONFIG.CAMPAIGN_ID,
//       to: leads.map((lead) => ({
//         phoneNumber: lead.phoneNumber,
//         variables: lead.variables || {}, // <-- ab yaha bhi dynamic object
//       })),
//     },
//     { headers }
//   );
//   return response.data.data;
// };

const triggerBatchCalls = async (leads = []) => {
  if (!leads.length || leads.length > 200) {
    throw new Error("Leads array must have 1-200 entries");
  }

  const response = await axios.post(
    `${CALLMATIC_CONFIG.BASE_URL}/calls/batch`,
    {
      campaignId: leads[0].Campain_ID || CALLMATIC_CONFIG.CAMPAIGN_ID,
      to: leads.map((lead) => ({
        phoneNumber: lead.phoneNumber,
        variables: lead.variables || {},
      })),
    },
    { headers }
  );

  return response.data.data;
};

// ✅ 3. Call Status
const getCallStatus = async (callId) => {
  const response = await axios.get(
    `${CALLMATIC_CONFIG.BASE_URL}/calls/${callId}`,
    { headers }
  );
  return response.data.data;
};

// ✅ 4. Call Recording (stream)
const getCallRecording = async (callId, res) => {
  const response = await axios.get(
    `${CALLMATIC_CONFIG.BASE_URL}/recordings/${callId}`,
    {
      headers: { "api-key": CALLMATIC_CONFIG.API_KEY },
      responseType: "stream",
    }
  );
  res.setHeader(
    "Content-Type",
    response.headers["content-type"] || "audio/mpeg"
  );
  response.data.pipe(res);
};

module.exports = {
  triggerSingleCall,
  triggerBatchCalls,
  getCallStatus,
  getCallRecording,
};