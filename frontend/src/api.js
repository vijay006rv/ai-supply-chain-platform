import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';

export const getDemandForecast = async () => {
  const res = await axios.get(`${API_BASE_URL}/forecast-demand`);
  return res.data;
};

export const getEsgScores = async () => {
  const res = await axios.get(`${API_BASE_URL}/esg-score`);
  return res.data;
};

export const getGeoRisk = async () => {
  const res = await axios.get(`${API_BASE_URL}/geo-risk`);
  return res.data;
};

export const getOptimization = async () => {
  const res = await axios.get(`${API_BASE_URL}/optimize-supply-chain`);
  return res.data;
};

/* ---------------------------------------
   SCENARIO SIMULATION (NEW)
--------------------------------------- */

export const runScenario = async (scenarioData) => {
  const res = await axios.post(
    `${API_BASE_URL}/optimize-scenario`,
    scenarioData
  );
  return res.data;
};