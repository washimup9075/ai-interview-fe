import { axiosInstance } from "../lib/axios";

export const getCoachDashboard = async () => {
  const res = await axiosInstance.get("/coach/dashboard");
  return res.data;
};

export const chatWithCoach = async (userMessage, chatHistory = []) => {
  const res = await axiosInstance.post("/coach/chat", { userMessage, chatHistory });
  return res.data;
};
