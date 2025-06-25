import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import ResponsiveNavbar from './components/Navbar/Navbar'
import Home from './pages/Home/Home'
import ChatDashboard from './pages/ChatBotPage/ChatDashboard'
import CourseList from "./pages/Courses/CourseList/CourseList"
import CourseDetail from "./pages/Courses/CourseDetails/CourseDetails"
import CourseContent from "./pages/Courses/CourseContent/CourseContent"
import ExamPage from "./pages/Courses/Exam/ExamPage"
import InterestQuiz from "./pages/Courses/InterestQuiz/InterestQuiz"
import coursesData from "./data/CourseData"
import ProfilePage from './pages/Profile/profile'
import { CommunityDashboard } from './components/community/community-dashboard'
import { CommunityDetail } from './components/community/community-detail'
import StudyPlan from './pages/StudyPlan/StudyPlan'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
    <ResponsiveNavbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/callback" element={<div>Loading...</div>} />
      <Route path="/aiassistant" element={<ProtectedRoute><ChatDashboard/></ProtectedRoute>}/>
      <Route path="/courses" element={<CourseList courses={coursesData} />} />
      <Route path="/courses/:id" element={<CourseDetail courses={coursesData} />} />
      <Route path="/courses/:id/learn" element={<CourseContent courses={coursesData} />} />
      <Route path="/courses/:id/exam" element={<ExamPage courses={coursesData} />} />
      <Route path="/courseQuiz" element={<InterestQuiz courses={coursesData} />} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage/></ProtectedRoute>} />
      <Route path="/communities" element={<ProtectedRoute><CommunityDashboard/></ProtectedRoute>} />
      <Route path="/communities/:id" element={<ProtectedRoute><CommunityDetail /></ProtectedRoute>} />
      <Route path="/studyplan" element={<ProtectedRoute><StudyPlan /></ProtectedRoute>} />
    </Routes>
    </>
  )
}

export default App
