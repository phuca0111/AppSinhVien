import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Announcements from './pages/Announcements'
import Students from './pages/Students'
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
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    )
}

export default App
