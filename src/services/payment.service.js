import { axiosInstance } from "../lib/axios";

export const getPlans = async () => {
  const res = await axiosInstance.get("/payment/plans");
  return res.data;
};

export const createOrder = async (data) => {
  const res = await axiosInstance.post("/payment/create-order", data);
  return res.data;
};

export const verifyPayment = async (data) => {
  const res = await axiosInstance.post("/payment/verify", data);
  return res.data;
};

export const cancelPayment = async (paymentDbId) => {
  const res = await axiosInstance.post("/payment/cancel", { paymentDbId });
  return res.data;
};

export const getPaymentHistory = async () => {
  const res = await axiosInstance.get("/payment/history");
  return res.data;
};
