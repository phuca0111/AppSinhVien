import { NavLink } from 'react-router-dom'

function Layout({ children, onLogout }) {
    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <div className="sidebar-logo">🎓 HCMUTE</div>
                    <div className="sidebar-subtitle">Admin Panel</div>
                </div>
                <ul className="sidebar-menu">
                    <li>
                        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="icon">📊</span>
                            Dashboard
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/announcements" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="icon">📢</span>
                            Thông báo
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/students" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="icon">👥</span>
                            Sinh viên
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/schedules" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="icon">📅</span>
                            Lịch học
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/exam-schedules" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="icon">📝</span>
                            Lịch thi
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/subjects" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="icon">📚</span>
                            Môn học
                        </NavLink>
                    </li>
                    <li>
                        <NavLink to="/grades" className={({ isActive }) => isActive ? 'active' : ''}>
                            <span className="icon">🏆</span>
                            Quản lý Điểm
                        </NavLink>
                    </li>
                </ul>
                <button className="logout-btn" onClick={onLogout}>
                    🚪 Đăng xuất
                </button>
            </aside>
            <main className="main-content">
                {children}
            </main>
        </div>
    )
}

export default Layout
