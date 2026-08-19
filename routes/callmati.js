const axios = require("axios");

const CALLMATIC_CONFIG = {
  API_KEY: "857e790e-ad5f-4816-9530-0ae643988229",
  CAMPAIGN_ID: "3ef9dfb8-ff24-4f96-a0b2-efbb87c5d309",
  BASE_URL: "https://api.callmatic.ai/v1",
};
const headers = {
  "Content-Type": "application/json",
  "api-key": CALLMATIC_CONFIG.API_KEY,
};

/**
 * Make Single Call
 * @param {String} phoneNumber
 * @param {Object} variables
 */
const triggerSingleCall = async (phoneNumber, variables = {}) => {
  try {
    if (!phoneNumber) {
      throw new Error("Phone number is required");
    }

    const payload = {
      campaignId: CALLMATIC_CONFIG.CAMPAIGN_ID,
      phoneNumber,
      variables,
    };

    const response = await axios.post(
      `${CALLMATIC_CONFIG.BASE_URL}/calls`,
      payload,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Callmatic Single Call Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Batch Calls
 * Max 200 Leads
 */
const triggerBatchCalls = async (leads = []) => {
  try {
    if (!Array.isArray(leads) || leads.length === 0) {
      throw new Error("Leads array is required");
    }

    if (leads.length > 200) {
      throw new Error("Maximum 200 leads allowed");
    }

    const payload = {
      campaignId:
        leads[0].Campain_ID || CALLMATIC_CONFIG.CAMPAIGN_ID,

      to: leads.map((lead) => ({
        phoneNumber: lead.phoneNumber,
        variables: lead.variables || {},
      })),
    };

    const response = await axios.post(
      `${CALLMATIC_CONFIG.BASE_URL}/calls/batch`,
      payload,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Callmatic Batch Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get Call Status
 */
const getCallStatus = async (callId) => {
  try {
    const response = await axios.get(
      `${CALLMATIC_CONFIG.BASE_URL}/calls/${callId}`,
      { headers }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Call Status Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get Recording
 */
const getCallRecording = async (callId, res) => {
  try {
    const response = await axios.get(
      `${CALLMATIC_CONFIG.BASE_URL}/recordings/${callId}`,
      {
        headers: {
          "api-key": CALLMATIC_CONFIG.API_KEY,
        },
        responseType: "stream",
      }
    );

    res.setHeader(
      "Content-Type",
      response.headers["content-type"] || "audio/mpeg"
    );

    response.data.pipe(res);
  } catch (error) {
    console.error(
      "Recording Error:",
      error.response?.data || error.message
    );

    res.status(500).json({
      success: false,
      message: "Unable to fetch recording",
    });
  }
};

module.exports = {
  triggerSingleCall,
  triggerBatchCalls,
  getCallStatus,
  getCallRecording,
};