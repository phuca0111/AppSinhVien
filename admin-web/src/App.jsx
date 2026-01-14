import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Announcements from './pages/Announcements'
import Students from './pages/Students'
import Schedules from './pages/Schedules'

import ExamSchedules from './pages/ExamSchedules'

import Subjects from './pages/Subjects'
import Grades from './pages/Grades'
import Layout from './components/Layout'
import './App.css'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    if (!isLoggedIn) {
        return <Login onLogin={() => setIsLoggedIn(true)} />
    }

    return (
        <BrowserRouter>
            <Layout onLogout={() => setIsLoggedIn(false)}>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/announcements" element={<Announcements />} />
                    <Route path="/students" element={<Students />} />
                    <Route path="/schedules" element={<Schedules />} />
                    <Route path="/exam-schedules" element={<ExamSchedules />} />
                    <Route path="/subjects" element={<Subjects />} />
                    <Route path="/grades" element={<Grades />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
