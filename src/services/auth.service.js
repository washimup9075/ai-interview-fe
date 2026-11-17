import { axiosInstance } from "../lib/axios";

export const signupUser=async(data)=>{
    const res= await axiosInstance.post("/auth/signup",data);
    return res.data;
}
export const loginUser=async(data)=>{
    const res=await axiosInstance.post("/auth/login",data)
    return res.data;
}
export const logoutUser=async()=>{
    const res=await axiosInstance.post("/auth/logout");
    return res.data;
}
export const checkAuthUser=async()=>{
    const res=await axiosInstance.get("/auth/check");
    return res.data;
}