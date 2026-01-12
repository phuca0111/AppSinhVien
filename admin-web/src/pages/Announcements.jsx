import { useState, useEffect } from 'react'
import { onAnnouncementsChange, addAnnouncement, updateAnnouncement, deleteAnnouncement } from '../firebase'

function Announcements() {
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({ title: '', sender: '', type: 'chung', content: '' })
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        const unsubscribe = onAnnouncementsChange((data) => {
            setAnnouncements(data)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const handleAdd = () => {
        setEditingId(null)
        setFormData({ title: '', sender: '', type: 'chung', content: '' })
        setShowModal(true)
    }

    const handleEdit = (item) => {
        setEditingId(item.id)
        setFormData({ title: item.title, sender: item.sender, type: item.type, content: item.content || '' })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
            await deleteAnnouncement(id)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const today = new Date()
        const dateStr = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`
        const created_at = today.toISOString()

        const announcementData = { ...formData, date: dateStr, created_at }

        if (editingId) {
            await updateAnnouncement(editingId, announcementData)
        } else {
            await addAnnouncement(announcementData)
        }
        setShowModal(false)
    }

    const filteredAnnouncements = announcements.filter(a =>
        a.title?.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 className="page-title">📢 Quản lý Thông báo</h1>
                <p className="page-subtitle">Thêm, sửa, xóa thông báo cho sinh viên (Đồng bộ Firebase)</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="search-box" style={{ flex: 1, marginRight: '20px', marginBottom: 0 }}>
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm thông báo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleAdd}>
                        ➕ Thêm thông báo
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Tiêu đề</th>
                                <th>Người gửi</th>
                                <th>Loại</th>
                                <th>Ngày tạo</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAnnouncements.map((item) => (
                                <tr key={item.id}>
                                    <td style={{ maxWidth: '300px' }}>{item.title}</td>
                                    <td>{item.sender}</td>
                                    <td>
                                        <span className={`badge ${item.type === 'chung' ? 'badge-primary' : 'badge-success'}`}>
                                            {item.type === 'chung' ? 'Chung' : 'Cá nhân'}
                                        </span>
                                    </td>
                                    <td>{item.date}</td>
                                    <td>
                                        <div className="actions">
                                            <button className="btn btn-sm btn-primary" onClick={() => handleEdit(item)}>✏️</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredAnnouncements.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                            <p>Không có thông báo nào. Hãy thêm thông báo mới!</p>
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingId ? '✏️ Sửa thông báo' : '➕ Thêm thông báo mới'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Tiêu đề *</label>
                                    <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Người gửi *</label>
                                    <input type="text" value={formData.sender} onChange={(e) => setFormData({ ...formData, sender: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Loại thông báo</label>
                                    <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}>
                                        <option value="chung">Thông báo chung</option>
                                        <option value="ca_nhan">Thông báo cá nhân</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Nội dung</label>
                                    <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} placeholder="Nhập nội dung thông báo..." />
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

export default Announcements
