import { Navigate,Outlet } from "react-router-dom";

import React from 'react'
import useAuthStore from "../store/useAuthStore";

const PublicRoute = () => {
    const authUser=useAuthStore((state)=>state.authUser);
    if(authUser){
        return <Navigate to="/dashboard" replace/>
    }
  return <Outlet/>
}

export default PublicRoute
