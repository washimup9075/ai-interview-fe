import { Navigate,Outlet } from "react-router-dom";

import useAuthStore from "../store/useAuthStore";

const ProtectedRoute = () => {
    const authUser=useAuthStore((state)=>state.authUser)
    if(!authUser){
        return <Navigate to="/login" replace/>
    }
  return <Outlet/>
  
}

export default ProtectedRoute
