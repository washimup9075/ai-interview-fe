import { axiosInstance } from "../lib/axios";

export const createInterview = async (data) => {
  const res = await axiosInstance.post("/interview/create", data);
  return res.data;
};

export const getInterviews = async () => {
  const res = await axiosInstance.get("/interview/all");
  return res.data;
};

export const getInterviewById = async (id) => {
  const res = await axiosInstance.get(`/interview/${id}`);
  return res.data;
};

export const deleteInterview = async (id) => {
  const res = await axiosInstance.delete(`/interview/${id}`);
  return res.data;
};
