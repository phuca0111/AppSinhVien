import { useState, useEffect } from 'react'
import { onStudentsChange, onAnnouncementsChange, onSubjectsChange, onExamSchedulesChange, onCourseCatalogChange, addCourseToCatalog } from '../firebase'

function Dashboard() {
    const [studentCount, setStudentCount] = useState(0)
    const [announcementCount, setAnnouncementCount] = useState(0)
    const [subjectCount, setSubjectCount] = useState(0)
    const [examCount, setExamCount] = useState(0)

    const [recentAnnouncements, setRecentAnnouncements] = useState([])
    const [catalog, setCatalog] = useState([])
    const [newCourse, setNewCourse] = useState({ name: '', department: '' })

    useEffect(() => {
        const unsubStudents = onStudentsChange((data) => {
            setStudentCount(data.length)
        })

        const unsubAnnouncements = onAnnouncementsChange((data) => {
            setAnnouncementCount(data.length)
            setRecentAnnouncements(data.slice(0, 5))
        })

        const unsubSubjects = onSubjectsChange((data) => {
            setSubjectCount(data.length)
        })

        const unsubCatalog = onCourseCatalogChange((data) => {
            setCatalog(data)
        })

        const unsubExams = onExamSchedulesChange((data) => {
            setExamCount(data.length)
        })

        return () => {
            unsubStudents()
            unsubAnnouncements()
            unsubSubjects()
            unsubExams()
            unsubCatalog()
        }
    }, [])

    const stats = [
        { icon: '📢', label: 'Thông báo', value: announcementCount, color: '#3498db' },
        { icon: '👥', label: 'Sinh viên', value: studentCount, color: '#2ecc71' },
        { icon: '📅', label: 'Môn học', value: subjectCount, color: '#9b59b6' },
        { icon: '📝', label: 'Lịch thi', value: examCount, color: '#e74c3c' },
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

            <div className="card" style={{ marginTop: '20px' }}>
                <div className="card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 className="card-title">📚 Danh mục Môn học (Master Data)</h3>
                </div>

                {/* Add Course Form */}
                <div style={{ padding: '20px', background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <input
                            type="text"
                            placeholder="Tên môn học"
                            className="form-control"
                            value={newCourse.name}
                            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                        />
                        <select
                            className="form-control"
                            value={newCourse.department}
                            onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                        >
                            <option value="">Chọn Khoa...</option>
                            <option value="CNTT">CNTT</option>
                            <option value="Kinh tế">Kinh tế</option>
                            <option value="Điện - Điện tử">Điện - Điện tử</option>
                            <option value="Cơ khí">Cơ khí</option>
                            <option value="Xây dựng">Xây dựng</option>
                            <option value="Ngoại ngữ">Ngoại ngữ</option>
                            <option value="Lý luận chính trị">Lý luận chính trị</option>
                        </select>
                        <button
                            className="btn btn-primary"
                            onClick={async () => {
                                if (newCourse.name && newCourse.department) {
                                    await addCourseToCatalog(newCourse)
                                    setNewCourse({ name: '', department: '' })
                                    alert('Đã thêm môn học vào danh mục!')
                                } else {
                                    alert('Vui lòng nhập đầy đủ thông tin')
                                }
                            }}
                        >Thêm mới</button>
                    </div>
                    <small style={{ color: '#666', marginTop: '5px', display: 'block' }}>
                        * Đây là danh mục tên môn học dùng chung cho toàn hệ thống.
                    </small>
                </div>

                <div className="table-container">
                    {catalog.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Tên môn học</th>
                                    <th>Khoa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {catalog.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.name}</td>
                                        <td>{item.department}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                            <p>Chưa có môn học nào trong danh mục.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard
