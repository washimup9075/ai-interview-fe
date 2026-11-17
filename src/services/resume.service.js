import { axiosInstance } from "../lib/axios";

export const parseResumeData = async (payload) => {
  if (payload instanceof FormData) {
    const res = await axiosInstance.post("/resume/parse", payload, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
  } else {
    const res = await axiosInstance.post("/resume/parse", payload);
    return res.data;
  }
};
