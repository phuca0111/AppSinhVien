import { useState, useEffect } from 'react'
import { onStudentsChange, onAnnouncementsChange } from '../firebase'

function Dashboard() {
    const [studentCount, setStudentCount] = useState(0)
    const [announcementCount, setAnnouncementCount] = useState(0)
    const [recentAnnouncements, setRecentAnnouncements] = useState([])

    useEffect(() => {
        const unsubStudents = onStudentsChange((data) => {
            setStudentCount(data.length)
        })

        const unsubAnnouncements = onAnnouncementsChange((data) => {
            setAnnouncementCount(data.length)
            setRecentAnnouncements(data.slice(0, 5))
        })

        return () => {
            unsubStudents()
            unsubAnnouncements()
        }
    }, [])

    const stats = [
        { icon: '📢', label: 'Thông báo', value: announcementCount, color: '#3498db' },
        { icon: '👥', label: 'Sinh viên', value: studentCount, color: '#2ecc71' },
        { icon: '📅', label: 'Môn học', value: 6, color: '#9b59b6' },
        { icon: '📝', label: 'Lịch thi', value: 5, color: '#e74c3c' },
    ]

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📊 Dashboard</h1>
                <p className="page-subtitle">Tổng quan hệ thống quản lý sinh viên (Đồng bộ Firebase)</p>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-number">{stat.value}</div>
                        <div className="stat-label">{stat.label}</div>
                    </div>
                ))}
            </div>

            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">📢 Thông báo gần đây</h3>
                </div>
                <div className="table-container">
                    {recentAnnouncements.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Tiêu đề</th>
                                    <th>Người gửi</th>
                                    <th>Ngày tạo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentAnnouncements.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.title}</td>
                                        <td>{item.sender}</td>
                                        <td>{item.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                            <p>Chưa có thông báo nào. Hãy thêm thông báo từ menu Thông báo.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="card" style={{ marginTop: '20px', background: '#e8f4f8' }}>
                <h3 style={{ color: '#003366', marginBottom: '10px' }}>🔥 Firebase Status</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>
                    Dữ liệu đang được đồng bộ realtime với Firebase Realtime Database.
                    Mọi thay đổi từ Admin Web sẽ tự động cập nhật trên App Mobile.
                </p>
            </div>
        </div>
    )
}

export default Dashboard
