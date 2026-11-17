
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import {signupUser,loginUser,logoutUser,checkAuthUser} from "../services/auth.service"

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
             console.log(error.response?.data);
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
            set(
                {authUser:user}
            )
        return user;
        } catch (error) {
            console.log(error.response?.data)
            throw error;
        }finally{
            set({isLoggingIn:false})
        }
    },
    logout: async ()=>{
        // api call
        try {
            await logoutUser();
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
            const user=await checkAuthUser();
            set(
                {authUser:user}
            )
            return user;
        } catch (error) {
            console.log("Error in checkAuth");
            set(
                {authUser:null},
                
            )
        }finally{
            set(
                {isCheckingAuth:false}
            )
        }
    }
}))

export default useAuthStore;