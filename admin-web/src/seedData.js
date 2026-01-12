// Script để seed dữ liệu ban đầu vào Firebase
// Chạy một lần để thêm dữ liệu mẫu

import { addStudent, addAnnouncement, getStudents, getAnnouncements } from './firebase.js'

const seedData = async () => {
    console.log('🚀 Bắt đầu seed dữ liệu...')

    // Check if data already exists
    const existingStudents = await getStudents()
    const existingAnnouncements = await getAnnouncements()

    if (existingStudents.length === 0) {
        console.log('📝 Thêm sinh viên mẫu...')
        const students = [
            { mssv: '24810014', password: '123456', ho_ten: 'Trần Phan Tấn Phúc', lop: '241280301', khoa: 'Công nghệ Thông tin', email: '24810014@student.hcmute.edu.vn' },
            { mssv: '24810008', password: '123456', ho_ten: 'Nguyễn Giang Thái Khang', lop: '241280301', khoa: 'Công nghệ Thông tin', email: '24810008@student.hcmute.edu.vn' },
            { mssv: '24810002', password: '123456', ho_ten: 'Hồ Vũ Hoàng Anh', lop: '241280301', khoa: 'Công nghệ Thông tin', email: '24810002@student.hcmute.edu.vn' },
        ]
        for (const student of students) {
            await addStudent(student)
            console.log(`  ✅ Đã thêm: ${student.ho_ten}`)
        }
    } else {
        console.log(`⏩ Đã có ${existingStudents.length} sinh viên, bỏ qua...`)
    }

    if (existingAnnouncements.length === 0) {
        console.log('📝 Thêm thông báo mẫu...')
        const announcements = [
            { title: 'Thông báo về lịch thi kiểm tra trình độ tiếng Anh đầu ra đợt thi tháng 01/2025', sender: 'PDT_Phạm Thị Thùy Hạnh', date: '31/12/2025', type: 'chung', created_at: '2025-12-31T08:00:00', content: 'Phòng Đào tạo thông báo lịch thi kiểm tra trình độ tiếng Anh đầu ra đợt thi tháng 01/2025.' },
            { title: 'Thông báo chương trình Lễ tốt nghiệp tháng 01/2025', sender: 'PDT_Bùi Thị Quỳnh', date: '26/12/2025', type: 'chung', created_at: '2025-12-26T09:30:00', content: 'Trường Đại học Sư phạm Kỹ thuật TP.HCM thông báo chương trình Lễ tốt nghiệp tháng 01/2025.' },
            { title: 'Thông báo về việc nộp học phí học kỳ 2', sender: 'Phòng Kế hoạch Tài chính', date: '08/01/2026', type: 'ca_nhan', created_at: '2026-01-08T09:00:00', content: 'Phòng Kế hoạch Tài chính thông báo thời hạn nộp học phí HK2.' },
        ]
        for (const announcement of announcements) {
            await addAnnouncement(announcement)
            console.log(`  ✅ Đã thêm: ${announcement.title.substring(0, 40)}...`)
        }
    } else {
        console.log(`⏩ Đã có ${existingAnnouncements.length} thông báo, bỏ qua...`)
    }

    console.log('✅ Hoàn tất seed dữ liệu!')
}

seedData().catch(console.error)
