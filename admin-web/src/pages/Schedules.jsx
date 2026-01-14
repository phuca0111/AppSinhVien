import { useState, useEffect } from 'react'
import { onSchedulesChange, addSchedule, updateSchedule, deleteSchedule } from '../firebase'

function Schedules() {
    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSchedule, setSelectedSchedule] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        subject: '',
        day: 'Thứ 2',
        room: '',
        time: '',
        lecturer: '',
        class_section: '',
        start_date: '',
        end_date: ''
    })

    useEffect(() => {
        const unsubscribe = onSchedulesChange((data) => {
            setSchedules(data)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const handleAdd = () => {
        setEditingId(null)
        setFormData({
            subject: '',
            day: 'Thứ 2',
            room: '',
            time: '',
            lecturer: '',
            start_date: '',
            end_date: ''
        })
        setShowModal(true)
    }

    const handleEdit = (schedule) => {
        setEditingId(schedule.id)
        setFormData({
            subject: schedule.subject,
            day: schedule.day,
            room: schedule.room,
            time: schedule.time,
            lecturer: schedule.lecturer || '',
            class_section: schedule.class_section || '',
            start_date: schedule.start_date || '',
            end_date: schedule.end_date || ''
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa lịch học này?')) {
            await deleteSchedule(id)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const scheduleData = { ...formData }

        if (editingId) {
            await updateSchedule(editingId, scheduleData)
        } else {
            await addSchedule(scheduleData)
        }
        setShowModal(false)
    }

    const filteredSchedules = schedules.filter(s =>
        s.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.room?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.class_section?.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 className="page-title">📅 Quản lý Lịch học</h1>
                <p className="page-subtitle">Thêm, sửa, xóa và xem lịch học (Đồng bộ Firebase)</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="search-box" style={{ flex: 1, marginRight: '20px', marginBottom: 0 }}>
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm theo môn học hoặc phòng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleAdd}>
                        ➕ Thêm lịch học
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Thứ</th>
                                <th>Môn học</th>
                                <th>Lớp HP</th>
                                <th>Phòng</th>
                                <th>Thời gian</th>
                                <th>Ngày học</th>
                                <th>Giảng viên</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSchedules.map((schedule) => (
                                <tr key={schedule.id}>
                                    <td><strong>{schedule.day}</strong></td>
                                    <td>{schedule.subject}</td>
                                    <td><span className="badge badge-info">{schedule.class_section}</span></td>
                                    <td>{schedule.room}</td>
                                    <td>{schedule.time}</td>
                                    <td style={{ fontSize: '0.85em' }}>
                                        {schedule.start_date ? `${schedule.start_date} → ${schedule.end_date}` : 'Cả kỳ'}
                                    </td>
                                    <td>{schedule.lecturer}</td>
                                    <td>
                                        <div className="actions">
                                            <button className="btn btn-sm btn-primary" onClick={() => setSelectedSchedule(schedule)} title="Xem">👁️</button>
                                            <button className="btn btn-sm btn-success" onClick={() => handleEdit(schedule)} title="Sửa">✏️</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(schedule.id)} title="Xóa">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredSchedules.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>cat</div>
                            <p>Chưa có lịch học nào. Hãy thêm lịch học mới!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            {selectedSchedule && (
                <div className="modal-overlay" onClick={() => setSelectedSchedule(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>📅 Chi tiết Lịch học</h3>
                            <button className="modal-close" onClick={() => setSelectedSchedule(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <div style={{ fontSize: '64px', marginBottom: '10px' }}>📚</div>
                                <h2 style={{ color: '#003366' }}>{selectedSchedule.subject}</h2>
                                <p className="badge badge-primary">{selectedSchedule.class_section}</p>
                                <p style={{ color: '#666' }}>{selectedSchedule.lecturer}</p>
                            </div>
                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                <p style={{ marginBottom: '10px' }}><strong>Thứ:</strong> {selectedSchedule.day}</p>
                                <p style={{ marginBottom: '10px' }}><strong>Phòng:</strong> {selectedSchedule.room}</p>
                                <p><strong>Thời gian:</strong> {selectedSchedule.time}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn" onClick={() => setSelectedSchedule(null)}>Đóng</button>
                            <button className="btn btn-primary" onClick={() => { setSelectedSchedule(null); handleEdit(selectedSchedule); }}>✏️ Sửa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingId ? '✏️ Sửa lịch học' : '➕ Thêm lịch học mới'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <input type="text" value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} placeholder="VD: Lập trình di động" required />
                                </div>
                                <div className="form-group">
                                    <label>Mã lớp học phần *</label>
                                    <input type="text" value={formData.class_section} onChange={(e) => setFormData({ ...formData, class_section: e.target.value })} placeholder="VD: 21_CNTT_TOAN_01" required />
                                </div>
                                <div className="form-group">
                                    <label>Thứ *</label>
                                    <select value={formData.day} onChange={(e) => setFormData({ ...formData, day: e.target.value })}>
                                        <option value="Thứ 2">Thứ 2</option>
                                        <option value="Thứ 3">Thứ 3</option>
                                        <option value="Thứ 4">Thứ 4</option>
                                        <option value="Thứ 5">Thứ 5</option>
                                        <option value="Thứ 6">Thứ 6</option>
                                        <option value="Thứ 7">Thứ 7</option>
                                        <option value="Chủ nhật">Chủ nhật</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Phòng học *</label>
                                    <input type="text" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} placeholder="VD: A1-301" required />
                                </div>
                                <div className="form-group">
                                    <label>Thời gian *</label>
                                    <input type="text" value={formData.time} onChange={(e) => setFormData({ ...formData, time: e.target.value })} placeholder="VD: Tiết 1-3 (07:00 - 09:30)" required />
                                </div>
                                <div className="form-row" style={{ display: 'flex', gap: '15px' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Ngày bắt đầu</label>
                                        <input type="date" value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Ngày kết thúc</label>
                                        <input type="date" value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Giảng viên</label>
                                    <input type="text" value={formData.lecturer} onChange={(e) => setFormData({ ...formData, lecturer: e.target.value })} placeholder="VD: ThS. Nguyễn Văn A" />
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

export default Schedules
