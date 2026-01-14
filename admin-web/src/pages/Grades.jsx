import { useState, useEffect } from 'react'
import {
    addGrade,
    updateGrade,
    deleteGrade,
    onGradesChange,
    onStudentsChange,
    onSubjectsChange
} from '../firebase'

export default function Grades() {
    const [grades, setGrades] = useState([])
    const [students, setStudents] = useState([])
    const [subjects, setSubjects] = useState([])
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState(null)

    const [formData, setFormData] = useState({
        student_id: '',
        subject_code: '',
        semester: 'hk2_2526',
        cc: '',
        gk: '',
        ck: ''
    })

    useEffect(() => {
        const unsubscribeGrades = onGradesChange((data) => setGrades(data))
        const unsubscribeStudents = onStudentsChange((data) => setStudents(data))
        const unsubscribeSubjects = onSubjectsChange((data) => setSubjects(data))

        return () => {
            unsubscribeGrades()
            unsubscribeStudents()
            unsubscribeSubjects()
        }
    }, [])

    const calculateGrade = (cc, gk, ck) => {
        const score = (parseFloat(cc) * 0.2) + (parseFloat(gk) * 0.3) + (parseFloat(ck) * 0.5)
        const rounded = Math.round(score * 10) / 10
        let letter = 'F'
        if (rounded >= 9.0) letter = 'A+'
        else if (rounded >= 8.5) letter = 'A'
        else if (rounded >= 8.0) letter = 'B+'
        else if (rounded >= 7.0) letter = 'B'
        else if (rounded >= 6.5) letter = 'C+'
        else if (rounded >= 5.5) letter = 'C'
        else if (rounded >= 5.0) letter = 'D+'
        else if (rounded >= 4.0) letter = 'D'
        return { score: rounded, letter }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.student_id || !formData.subject_code) return alert('Vui lòng chọn Sinh viên và Môn học')

        // Auto calculate fields
        const selectedSubject = subjects.find(s => s.code === formData.subject_code)
        const { score, letter } = calculateGrade(formData.cc, formData.gk, formData.ck)

        const payload = {
            ...formData,
            subject_name: selectedSubject?.name || '',
            credits: selectedSubject?.credits || 0,
            tk: score,
            grade: letter
        }

        try {
            if (editingId) {
                await updateGrade(editingId, payload)
            } else {
                await addGrade(payload)
            }
            setIsModalOpen(false)
            setFormData({ student_id: '', subject_code: '', semester: 'hk2_2526', cc: '', gk: '', ck: '' })
            setEditingId(null)
        } catch (error) {
            alert('Lỗi: ' + error.message)
        }
    }

    const handleEdit = (grade) => {
        setFormData(grade)
        setEditingId(grade.id)
        setIsModalOpen(true)
    }

    const handleDelete = async (id) => {
        if (confirm('Bạn có chắc muốn xóa điểm này?')) {
            await deleteGrade(id)
        }
    }

    const getStudentName = (id) => {
        const s = students.find(st => st.id === id)
        return s ? `${s.ho_ten} (${s.mssv})` : id
    }

    return (
        <div className="page-container">
            <header className="page-header">
                <h1>Quản lý Điểm</h1>
                <button className="add-btn" onClick={() => {
                    setEditingId(null)
                    setFormData({ student_id: '', subject_code: '', semester: 'hk2_2526', cc: '', gk: '', ck: '' })
                    setIsModalOpen(true)
                }}>
                    + Nhập điểm
                </button>
            </header>

            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sinh viên</th>
                            <th>Môn học</th>
                            <th>Học kỳ</th>
                            <th>CC (20%)</th>
                            <th>GK (30%)</th>
                            <th>CK (50%)</th>
                            <th>Tổng kết</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map(grade => (
                            <tr key={grade.id}>
                                <td>{getStudentName(grade.student_id)}</td>
                                <td>{grade.subject_name} ({grade.subject_code})</td>
                                <td>{grade.semester}</td>
                                <td>{grade.cc}</td>
                                <td>{grade.gk}</td>
                                <td>{grade.ck}</td>
                                <td>
                                    <strong>{grade.tk}</strong> <br />
                                    <span className={`badge ${grade.grade.startsWith('F') ? 'bg-red' : 'bg-green'}`}>
                                        {grade.grade}
                                    </span>
                                </td>
                                <td>
                                    <button className="icon-btn edit" onClick={() => handleEdit(grade)}>✏️</button>
                                    <button className="icon-btn delete" onClick={() => handleDelete(grade.id)}>🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>{editingId ? 'Sửa điểm' : 'Nhập điểm'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Sinh viên</label>
                                <select
                                    value={formData.student_id}
                                    onChange={e => setFormData({ ...formData, student_id: e.target.value })}
                                    required
                                >
                                    <option value="">-- Chọn sinh viên --</option>
                                    {students.map(s => (
                                        <option key={s.id} value={s.id}>{s.ho_ten} - {s.mssv}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Môn học</label>
                                <select
                                    value={formData.subject_code}
                                    onChange={e => setFormData({ ...formData, subject_code: e.target.value })}
                                    required
                                >
                                    <option value="">-- Chọn môn học --</option>
                                    {subjects.map(s => (
                                        <option key={s.id} value={s.code}>{s.name} ({s.code})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Học kỳ</label>
                                <select
                                    value={formData.semester}
                                    onChange={e => setFormData({ ...formData, semester: e.target.value })}
                                >
                                    <option value="hk2_2526">HK2 2025-2026</option>
                                    <option value="hk1_2526">HK1 2025-2026</option>
                                    <option value="hk2_2425">HK2 2024-2025</option>
                                </select>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>CC (20%)</label>
                                    <input type="number" step="0.1" min="0" max="10" required
                                        value={formData.cc} onChange={e => setFormData({ ...formData, cc: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>GK (30%)</label>
                                    <input type="number" step="0.1" min="0" max="10" required
                                        value={formData.gk} onChange={e => setFormData({ ...formData, gk: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CK (50%)</label>
                                    <input type="number" step="0.1" min="0" max="10" required
                                        value={formData.ck} onChange={e => setFormData({ ...formData, ck: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setIsModalOpen(false)}>Hủy</button>
                                <button type="submit" className="primary">Lưu</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
