import React, { useEffect } from 'react'
import Signup from './pages/SignUp'
import AppRoutes from './routes/AppRoutes'
import Navbar from './components/Navbar'
import useAuthStore from './store/useAuthStore'

function App() {
  const checkAuth=useAuthStore((state)=>state.checkAuth);
  const isCheckingAuth=useAuthStore((state)=>state.isCheckingAuth);
  useEffect(()=>{
    checkAuth()
  },[checkAuth])
  if(isCheckingAuth){
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        Loading....
      </div>
    )
  }
  return (
    <div className="min-h-screen flex flex-col bg-slate-950">
      <Navbar />

      <main className="flex-1">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;


