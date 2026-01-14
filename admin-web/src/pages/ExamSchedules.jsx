import { useState, useEffect } from 'react'
import { onExamSchedulesChange, addExamSchedule, updateExamSchedule, deleteExamSchedule } from '../firebase'

function ExamSchedules() {
    const [exams, setExams] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedExam, setSelectedExam] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        subject: '',
        date: '',
        time: '',
        room: '',
        type: 'Cuối kỳ',
        class_section: ''
    })

    useEffect(() => {
        const unsubscribe = onExamSchedulesChange((data) => {
            setExams(data)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const handleAdd = () => {
        setEditingId(null)
        setFormData({
            subject: '',
            date: '',
            time: '',
            room: '',
            type: 'Cuối kỳ',
            class_section: ''
        })
        setShowModal(true)
    }

    const handleEdit = (exam) => {
        setEditingId(exam.id)
        setFormData({
            subject: exam.subject,
            date: exam.date,
            time: exam.time,
            room: exam.room,
            type: exam.type || 'Cuối kỳ',
            class_section: exam.class_section || ''
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa lịch thi này?')) {
            await deleteExamSchedule(id)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const examData = { ...formData }

        if (editingId) {
            await updateExamSchedule(editingId, examData)
        } else {
            await addExamSchedule(examData)
        }
        setShowModal(false)
    }

    const filteredExams = exams.filter(e =>
        e.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        e.class_section?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '50px' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>⏳</div>
                <p>Đang tải dữ liệu từ Firebase...</p>
            </div>
        )
    }

    return (
        <div>
            <div className="page-header">
                <h1 className="page-title">📝 Quản lý Lịch thi</h1>
                <p className="page-subtitle">Thêm, sửa, xóa và xem lịch thi (Đồng bộ Firebase)</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="search-box" style={{ flex: 1, marginRight: '20px', marginBottom: 0 }}>
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm theo môn thi hoặc phòng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleAdd}>
                        ➕ Thêm lịch thi
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Ngày thi</th>
                                <th>Môn thi</th>
                                <th>Lớp HP</th>
                                <th>Giờ thi</th>
                                <th>Phòng</th>
                                <th>Hình thức</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredExams.map((exam) => (
                                <tr key={exam.id}>
                                    <td><strong>{exam.date}</strong></td>
                                    <td>{exam.subject}</td>
                                    <td><span className="badge badge-info">{exam.class_section}</span></td>
                                    <td>{exam.time}</td>
                                    <td>{exam.room}</td>
                                    <td><span className={`badge ${exam.type === 'Cuối kỳ' ? 'badge-danger' : 'badge-warning'}`}>{exam.type}</span></td>
                                    <td>
                                        <div className="actions">
                                            <button className="btn btn-sm btn-primary" onClick={() => setSelectedExam(exam)} title="Xem">👁️</button>
                                            <button className="btn btn-sm btn-success" onClick={() => handleEdit(exam)} title="Sửa">✏️</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(exam.id)} title="Xóa">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredExams.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📝</div>
                            <p>Chưa có lịch thi nào. Hãy thêm lịch thi mới!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            {selectedExam && (
                <div className="modal-overlay" onClick={() => setSelectedExam(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📝 Chi tiết Lịch thi</h3>
                            <button className="modal-close" onClick={() => setSelectedExam(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <div style={{ fontSize: '64px', marginBottom: '10px' }}>⏰</div>
                                <h2 style={{ color: '#003366' }}>{selectedExam.subject}</h2>
                                <p className="badge badge-primary">{selectedExam.class_section}</p>
                                <span className={`badge ${selectedExam.type === 'Cuối kỳ' ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '14px' }}>{selectedExam.type}</span>
                            </div>
                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                <p style={{ marginBottom: '10px' }}><strong>Ngày thi:</strong> {selectedExam.date}</p>
                                <p style={{ marginBottom: '10px' }}><strong>Giờ thi:</strong> {selectedExam.time}</p>
                                <p><strong>Phòng thi:</strong> {selectedExam.room}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn" onClick={() => setSelectedExam(null)}>Đóng</button>
                            <button className="btn btn-primary" onClick={() => { setSelectedExam(null); handleEdit(selectedExam); }}>✏️ Sửa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingId ? '✏️ Sửa lịch thi' : '➕ Thêm lịch thi mới'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Môn thi *</label>
                                    <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="VD: Lập trình di động" required />
                                </div>
                                <div className="form-group">
                                    <label>Mã lớp học phần *</label>
                                    <input type="text" value={formData.class_section} onChange={(e) => setFormData({ ...formData, class_section: e.target.value })} placeholder="VD: 21_CNTT_TOAN_01" required />
                                </div>
                                <div className="form-group">
                                    <label>Ngày thi *</label>
                                    <input type="text" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} placeholder="VD: 15/01/2026" required />
                                </div>
                                <div className="form-group">
                                    <label>Giờ thi *</label>
                                    <input type="text" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="VD: 07:30 - 09:00" required />
                                </div>
                                <div className="form-group">
                                    <label>Phòng thi *</label>
                                    <input type="text" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} placeholder="VD: A1-301" required />
                                </div>
                                <div className="form-group">
                                    <label>Hình thức</label>
                                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="Cuối kỳ">Cuối kỳ</option>
                                        <option value="Giữa kỳ">Giữa kỳ</option>
                                        <option value="Thực hành">Thực hành</option>
                                        <option value="Vấn đáp">Vấn đáp</option>
                                    </select>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn" onClick={() => setShowModal(false)}>Hủy</button>
                                <button type="submit" className="btn btn-primary">{editingId ? 'Cập nhật' : 'Thêm mới'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExamSchedules
