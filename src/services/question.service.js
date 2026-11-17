import { axiosInstance } from "../lib/axios";

export const getQuestionById = async (id) => {
  const res = await axiosInstance.get(`/questions/${id}`);
  return res.data;
};

export const submitQuestionAnswer = async (id, answer) => {
  const res = await axiosInstance.post(`/questions/${id}/submit`, { answer });
  return res.data;
};

export const executeCodeSandbox = async (code, testCases = []) => {
  const res = await axiosInstance.post("/questions/coding/execute", { code, testCases });
  return res.data;
};

export const submitCodingAnswer = async (id, code, language = "javascript") => {
  const res = await axiosInstance.post(`/questions/${id}/coding-submit`, { code, language });
  return res.data;
};

