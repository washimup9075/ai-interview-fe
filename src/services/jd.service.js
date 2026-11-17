import { axiosInstance } from "../lib/axios";

export const analyzeJobDescriptionData = async (data) => {
  const res = await axiosInstance.post("/jd/analyze", data);
  return res.data;
};
