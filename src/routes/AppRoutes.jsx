import React from 'react'
import {Routes, Route } from 'react-router-dom'
import SignUp from '../pages/SignUp'
import Home from '../pages/Home'
import Login from '../pages/Login'
import Dashboard from '../components/Dashboard'
import CreateInterview from '../pages/CreateInterview'
import CompanyInterview from '../pages/CompanyInterview'
import PaymentHistory from '../pages/PaymentHistory'
import InterviewScreen from '../pages/InterviewScreen'
import InterviewResults from '../pages/InterviewResults'
import CodingInterviewScreen from '../pages/CodingInterviewScreen'
import CareerCoach from '../pages/CareerCoach'
import PublicRoute from './PublicRoute'
import ProtectedRoute from './ProtectedRoute'

const AppRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home/>}/>
        {/* public routes */}
        <Route element={<PublicRoute/>}>
              <Route path='/signup' element={<SignUp/>}/>
              <Route path='/login' element={<Login/>}/>
        </Route>
        
        {/* protected routes */}
        <Route element={<ProtectedRoute/>}>
              <Route path='/dashboard' element={<Dashboard/>}/>
              <Route path='/interview/new' element={<CreateInterview/>}/>
              <Route path='/interview/company' element={<CompanyInterview/>}/>
              <Route path='/payments' element={<PaymentHistory/>}/>
              <Route path='/interview/:id' element={<InterviewScreen/>}/>
              <Route path='/interview/:id/coding' element={<CodingInterviewScreen/>}/>
              <Route path='/interview/:id/results' element={<InterviewResults/>}/>
              <Route path='/coach' element={<CareerCoach/>}/>
        </Route>
      </Routes>
    </div>
  )
}

export default AppRoutes;
