import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import {signupUser,loginUser,logoutUser,checkAuthUser} from "../services/auth.service"

if (typeof window !== "undefined") {
    window.addEventListener("auth:unauthorized", () => {
        useAuthStore.setState({ authUser: null, isCheckingAuth: false });
        if (!window.location.pathname.startsWith("/login")) {
            window.location.replace("/login");
        }
    });
}

const useAuthStore=create((set)=>({
    authUser:null,
    isSigningUp:false,
    isLoggingIn:false,
    isCheckingAuth:true,

    signup: async (data)=>{
        // api call
        try {
            set({isSigningUp:true})
            const response = await signupUser(data);
            return response;
        } catch (error) {
             console.error("Signup error:", error?.response?.data || error?.message);
             throw error;
        }finally{
            set({isSigningUp:false})
        }
    },
    login: async (data)=>{
        // api call
        try {
            set({isLoggingIn:true})
            const user= await loginUser(data);
            if (user?.token) {
                localStorage.setItem("token", user.token);
            }
            set({ authUser: user })
            return user;
        } catch (error) {
            console.error("Login error:", error?.response?.data || error?.message);
            throw error;
        }finally{
            set({isLoggingIn:false})
        }
    },
    logout: async ()=>{
        // api call
        try {
            await logoutUser();
            localStorage.removeItem("token");
            set({
                authUser:null
            })
        } catch (error) {
            console.log(error.response?.data)
            throw error
        }
    },
    checkAuth:async()=>{
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const user=await checkAuthUser();
                set({ authUser: user })
                return user;
            }
            set({ authUser: null });
            return null;
        } catch (error) {
            console.error("Error in checkAuth:", error?.response?.data || error?.message);
            if (error?.response?.status === 401) {
                localStorage.removeItem("token");
            }
            set({ authUser: null });
        }finally{
            set({ isCheckingAuth: false })
        }
    }
}))

export default useAuthStore;