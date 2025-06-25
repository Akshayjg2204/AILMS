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

function App() {
  return (
    <>
    <ResponsiveNavbar/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/aiassistant" element={<ChatDashboard/>}/>
      <Route path="/courses" element={<CourseList courses={coursesData} />} />
      <Route path="/courses/:id" element={<CourseDetail courses={coursesData} />} />
      <Route path="/courses/:id/learn" element={<CourseContent courses={coursesData} />} />
      <Route path="/courses/:id/exam" element={<ExamPage courses={coursesData} />} />
      <Route path="/courseQuiz" element={<InterestQuiz courses={coursesData} />} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route path="/communities" element={<CommunityDashboard/>} />
      <Route path="/communities/:id" element={<CommunityDetail />} />
      <Route path="/studyplan" element={<StudyPlan />} />
    </Routes>
    </>
  )
}

export default App
