import { useState, useEffect } from 'react'
import { onSubjectsChange, addSubject, updateSubject, deleteSubject, onStudentsChange, onCourseCatalogChange } from '../firebase'

function Subjects() {
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedSubject, setSelectedSubject] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        credits: '',
        department: 'Công nghệ Thông tin'
    })

    const [students, setStudents] = useState([])
    const [showStudentsModal, setShowStudentsModal] = useState(false)
    const [viewingSubject, setViewingSubject] = useState(null)
    const [catalog, setCatalog] = useState([])

    useEffect(() => {
        const unsubscribeSubjects = onSubjectsChange((data) => {
            setSubjects(data)
            setLoading(false)
        })
        const unsubscribeStudents = onStudentsChange((data) => {
            setStudents(data)
        })
        const unsubscribeCatalog = onCourseCatalogChange((data) => {
            setCatalog(data)
        })
        return () => {
            unsubscribeSubjects()
            unsubscribeStudents()
            unsubscribeCatalog()
        }
    }, [])

    const handleAdd = () => {
        setEditingId(null)
        setFormData({
            code: '',
            name: '',
            credits: '',
            department: 'Công nghệ Thông tin'
        })
        setShowModal(true)
    }

    const handleEdit = (subject) => {
        setEditingId(subject.id)
        setFormData({
            code: subject.code,
            name: subject.name,
            credits: subject.credits,
            department: subject.department
        })
        setShowModal(true)
    }

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa môn học này?')) {
            await deleteSubject(id)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const subjectData = { ...formData, credits: parseInt(formData.credits) }

        if (editingId) {
            await updateSubject(editingId, subjectData)
        } else {
            await addSubject(subjectData)
        }
        setShowModal(false)
    }

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
                <h1 className="page-title">📚 Quản lý Môn học</h1>
            </div>

            <div className="card">
                <div className="card-header">
                    <div style={{ flex: 1 }}></div>
                    <button className="btn btn-primary" onClick={handleAdd}>
                        ➕ Thêm môn học
                    </button>
                </div>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Mã môn</th>
                                <th>Tên môn học</th>
                                <th>Tín chỉ</th>
                                <th>Khoa</th>
                                <th>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {subjects.map((subject) => (
                                <tr key={subject.id}>
                                    <td><strong>{subject.code}</strong></td>
                                    <td>{subject.name}</td>
                                    <td>{subject.credits}</td>
                                    <td>{subject.department}</td>
                                    <td>
                                        <div className="actions">
                                            <button className="btn btn-sm btn-info" onClick={() => {
                                                setViewingSubject(subject)
                                                setShowStudentsModal(true)
                                            }} title="Xem danh sách đăng ký">👥</button>
                                            <button className="btn btn-sm btn-success" onClick={() => handleEdit(subject)} title="Sửa">✏️</button>
                                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(subject.id)} title="Xóa">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {subjects.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                            <div style={{ fontSize: '48px', marginBottom: '10px' }}>📚</div>
                            <p>Chưa có môn học nào. Hãy thêm môn học mới!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingId ? '✏️ Sửa môn học' : '➕ Thêm môn học mới'}</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Mã môn học *</label>
                                    <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} placeholder="VD: INPR1324" required />
                                </div>
                                <div className="form-group">
                                    <label>Tên môn học *</label>
                                    <select
                                        value={formData.name}
                                        onChange={(e) => {
                                            const selectedCourse = catalog.find(c => c.name === e.target.value);
                                            setFormData({
                                                ...formData,
                                                name: e.target.value,
                                                department: selectedCourse ? selectedCourse.department : formData.department // Auto-fill department
                                            })
                                        }}
                                        className="form-control"
                                        required
                                    >
                                        <option value="">-- Chọn môn học --</option>
                                        {catalog.map(course => (
                                            <option key={course.id} value={course.name}>{course.name} - {course.department}</option>
                                        ))}
                                    </select>
                                    <small style={{ color: '#666' }}>Chọn từ danh mục môn học (Master Data)</small>
                                </div>
                                <div className="form-group">
                                    <label>Số tín chỉ *</label>
                                    <input type="number" min="1" max="10" value={formData.credits} onChange={(e) => setFormData({ ...formData, credits: e.target.value })} placeholder="VD: 3" required />
                                </div>
                                <div className="form-group">
                                    <label>Khoa</label>
                                    <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}>
                                        <option value="Công nghệ Thông tin">Công nghệ Thông tin</option>
                                        <option value="Điện - Điện tử">Điện - Điện tử</option>
                                        <option value="Cơ khí">Cơ khí</option>
                                        <option value="Kinh tế">Kinh tế</option>
                                        <option value="Ngoại ngữ">Ngoại ngữ</option>
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

            {/* Students List Modal */}
            {showStudentsModal && viewingSubject && (
                <div className="modal-overlay" onClick={() => setShowStudentsModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className="modal-header">
                            <h3>👥 Danh sách đăng ký: {viewingSubject.name} ({viewingSubject.code})</h3>
                            <button className="modal-close" onClick={() => setShowStudentsModal(false)}>&times;</button>
                        </div>
                        <div className="modal-body">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>MSSV</th>
                                        <th>Họ và tên</th>
                                        <th>Lớp</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.filter(s => {
                                        if (!s.registered_sections) return false;
                                        // registered_sections is stored as "IT001, IT002" string
                                        const sections = s.registered_sections.toString().split(',').map(code => code.trim());
                                        return sections.includes(viewingSubject.code);
                                    }).map(student => (
                                        <tr key={student.id}>
                                            <td><strong>{student.mssv}</strong></td>
                                            <td>{student.ho_ten}</td>
                                            <td>{student.lop}</td>
                                            <td>{student.email}</td>
                                        </tr>
                                    ))}
                                    {students.filter(s => s.registered_sections?.toString().split(',').map(c => c.trim()).includes(viewingSubject.code)).length === 0 && (
                                        <tr>
                                            <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                                                Chưa có sinh viên nào đăng ký môn học này.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="modal-footer">
                            <button className="btn" onClick={() => setShowStudentsModal(false)}>Đóng</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Subjects
