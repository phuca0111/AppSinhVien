import { useState, useEffect } from 'react'
import { onStudentsChange, addStudent, updateStudent, deleteStudent } from '../firebase'

function Students() {
    const [students, setStudents] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedStudent, setSelectedStudent] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        mssv: '',
        password: '123456',
        ho_ten: '',
        lop: '',
        khoa: 'Công nghệ Thông tin',
        email: '',
        registered_sections: ''
    })

    useEffect(() => {
        const unsubscribe = onStudentsChange((data) => {
            setStudents(data)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    const handleAdd = () => {
        setEditingId(null)
        setFormData({
            mssv: '',
            password: '123456',
            ho_ten: '',
            lop: '',
            khoa: 'Công nghệ Thông tin',
            email: '',
            registered_sections: ''
        })
        setShowModal(true)
    }

    const handleEdit = (student) => {
        setEditingId(student.id)
        setFormData({
            mssv: student.mssv,
            password: student.password || '123456',
            ho_ten: student.ho_ten,
            lop: student.lop,
            khoa: student.khoa,
            email: student.email,
            registered_sections: student.registered_sections || ''
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
            await deleteStudent(id)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const email = formData.email || `${formData.mssv}@student.hcmute.edu.vn`
        const studentData = { ...formData, email }

        if (editingId) {
            await updateStudent(editingId, studentData)
        } else {
            await addStudent(studentData)
        }
        setShowModal(false)
    }

    const filteredStudents = students.filter(s =>
        s.ho_ten?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.mssv?.includes(searchTerm)
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
                <h1 className="page-title">👥 Quản lý Sinh viên</h1>
                <p className="page-subtitle">Thêm, sửa, xóa và xem thông tin sinh viên (Đồng bộ Firebase)</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="search-box" style={{ flex: 1, marginRight: '20px', marginBottom: 0 }}>
                        <input
                            type="text"
                            placeholder="🔍 Tìm kiếm theo tên hoặc MSSV..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={handleAdd}>
                        ➕ Thêm sinh viên
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>MSSV</th>
                                <th>Họ và tên</th>
                                <th>Lớp</th>
                                <th>Khoa</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredStudents.map((student) => (
                                <tr key={student.id}>
                                    <td><strong>{student.mssv}</strong></td>
                                    <td>{student.ho_ten}</td>
                                    <td>{student.lop}</td>
                                    <td>{student.khoa}</td>
                                    <td>
                                        <div className="actions">
                                            <button className="btn btn-sm btn-primary" onClick={() => setSelectedStudent(student)} title="Xem">👁️</button>
                                            <button className="btn btn-sm btn-success" onClick={() => handleEdit(student)} title="Sửa">✏️</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(student.id)} title="Xóa">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📭</div>
                            <p>Không có sinh viên nào. Hãy thêm sinh viên mới!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* View Modal */}
            {selectedStudent && (
                <div className="modal-overlay" onClick={() => setSelectedStudent(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>👤 Thông tin sinh viên</h3>
                            <button className="modal-close" onClick={() => setSelectedStudent(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                                <div style={{ fontSize: '64px', marginBottom: '10px' }}>👤</div>
                                <h2 style={{ color: '#003366' }}>{selectedStudent.ho_ten}</h2>
                                <p style={{ color: '#666' }}>MSSV: {selectedStudent.mssv}</p>
                            </div>
                            <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px' }}>
                                <p style={{ marginBottom: '10px' }}><strong>Lớp:</strong> {selectedStudent.lop}</p>
                                <p style={{ marginBottom: '10px' }}><strong>Khoa:</strong> {selectedStudent.khoa}</p>
                                <p style={{ marginBottom: '10px' }}><strong>Email:</strong> {selectedStudent.email}</p>
                                <p><strong>Lớp học phần:</strong> {selectedStudent.registered_sections}</p>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn" onClick={() => setSelectedStudent(null)}>Đóng</button>
                            <button className="btn btn-primary" onClick={() => { setSelectedStudent(null); handleEdit(selectedStudent); }}>✏️ Sửa</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingId ? '✏️ Sửa sinh viên' : '➕ Thêm sinh viên mới'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Mã số sinh viên *</label>
                                    <input type="text" value={formData.mssv} onChange={(e) => setFormData({ ...formData, mssv: e.target.value })} placeholder="VD: 24810001" required />
                                </div>
                                <div className="form-group">
                                    <label>Họ và tên *</label>
                                    <input type="text" value={formData.ho_ten} onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })} placeholder="Nhập họ và tên" required />
                                </div>
                                <div className="form-group">
                                    <label>Mật khẩu</label>
                                    <input type="text" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} placeholder="Mặc định: 123456" />
                                </div>
                                <div className="form-group">
                                    <label>Lớp *</label>
                                    <input type="text" value={formData.lop} onChange={(e) => setFormData({ ...formData, lop: e.target.value })} placeholder="VD: 241280301" required />
                                </div>
                                <div className="form-group">
                                    <label>Khoa</label>
                                    <select value={formData.khoa} onChange={(e) => setFormData({ ...formData, khoa: e.target.value })}>
                                        <option value="Công nghệ Thông tin">Công nghệ Thông tin</option>
                                        <option value="Điện - Điện tử">Điện - Điện tử</option>
                                        <option value="Cơ khí">Cơ khí</option>
                                        <option value="Kinh tế">Kinh tế</option>
                                        <option value="Ngoại ngữ">Ngoại ngữ</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} placeholder="Tự động tạo từ MSSV" />
                                </div>
                                <div className="form-group">
                                    <label>Các lớp học phần (phân cách dấu phẩy)</label>
                                    <input type="text" value={formData.registered_sections} onChange={(e) => setFormData({ ...formData, registered_sections: e.target.value })} placeholder="VD: MATH_01, ENG_02" />
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

export default Students
