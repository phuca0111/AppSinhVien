import { getDBConnection } from './database';

// Dữ liệu sinh viên mẫu
const usersData = [
    {
        mssv: '24810014',
        password: '123456',
        ho_ten: 'Trần Phan Tấn Phúc',
        lop: '241280301',
        khoa: 'Công nghệ Thông tin',
        email: '24810014@student.hcmute.edu.vn',
        avatar: null,
    },
    {
        mssv: '24810001',
        password: '123456',
        ho_ten: 'Nguyễn Văn A',
        lop: '241280301',
        khoa: 'Công nghệ Thông tin',
        email: '24810001@student.hcmute.edu.vn',
        avatar: null,
    },
];

// Dữ liệu thông báo mẫu
const announcementsData = [
    {
        title: 'Thông báo về lịch thi kiểm tra trình độ tiếng Anh đầu ra đợt thi tháng 01/2025',
        content: 'Phòng Đào tạo thông báo đến toàn thể sinh viên về lịch thi kiểm tra trình độ tiếng Anh đầu ra đợt thi tháng 01/2025. Sinh viên đăng ký thi vui lòng kiểm tra lịch thi và địa điểm thi trên hệ thống.',
        sender: 'PDT_Phạm Thị Thùy Hạnh',
        created_at: '2025-12-31 10:10:55',
        type: 'chung',
    },
    {
        title: 'Thông báo chương trình Lễ tốt nghiệp tháng 01/2025 và muộn trả lệ phục tốt nghiệp',
        content: 'Trường thông báo về chương trình Lễ tốt nghiệp tháng 01/2025 dành cho nghiên cứu sinh, học viên cao học, sinh viên đại học chính quy & sinh viên đại học vừa làm vừa học tốt nghiệp đợt tháng 7, 9, 11/2025.',
        sender: 'PDT_Bùi Thị Quỳnh',
        created_at: '2025-12-26 18:44:45',
        type: 'chung',
    },
    {
        title: 'Thông báo Về việc nhận bằng tốt nghiệp Đại học hệ chính quy Đợt tốt nghiệp tháng 10/2025',
        content: 'Phòng Đào tạo thông báo đến sinh viên đã tốt nghiệp đợt tháng 10/2025 về việc nhận bằng tốt nghiệp. Sinh viên vui lòng mang theo CMND/CCCD để nhận bằng.',
        sender: 'PDT_Bùi Thị Quỳnh',
        created_at: '2025-11-17 13:40:24',
        type: 'chung',
    },
    {
        title: 'Thông báo lịch thi kiểm tra trình độ tiếng Anh đầu ra đợt thi tháng 01/2025',
        content: 'Thông báo chi tiết về lịch thi kiểm tra trình độ tiếng Anh đầu ra.',
        sender: 'PDT_Phạm Thị Thùy Hạnh',
        created_at: '2025-12-12 12:14:21',
        type: 'chung',
    },
    {
        title: 'Thông báo v/v đăng ký thi kiểm tra trình độ tiếng Anh đầu ra đợt tháng 01/2025',
        content: 'Sinh viên đăng ký thi kiểm tra trình độ tiếng Anh đầu ra đợt tháng 01/2025 vui lòng thực hiện đăng ký trên hệ thống.',
        sender: 'PDT_Phạm Thị Thùy Hạnh',
        created_at: '2025-12-12 12:10:26',
        type: 'chung',
    },
    {
        title: 'Thông báo kết quả học bổng khuyến khích học tập HK1 2025-2026',
        content: 'Thông báo đến bạn về kết quả xét học bổng khuyến khích học tập học kỳ 1 năm học 2025-2026.',
        sender: 'PDT_Nguyễn Văn B',
        created_at: '2025-12-10 09:00:00',
        type: 'ca_nhan',
    },
    {
        title: 'Nhắc nhở đóng học phí HK2 2025-2026',
        content: 'Bạn vui lòng hoàn thành đóng học phí học kỳ 2 năm học 2025-2026 trước ngày 15/01/2026.',
        sender: 'Phòng Kế hoạch - Tài chính',
        created_at: '2025-12-08 14:30:00',
        type: 'ca_nhan',
    },
];

// Dữ liệu thời khóa biểu mẫu
const scheduleData = [
    {
        user_id: 1,
        mon_hoc: 'Lập trình di động',
        giang_vien: 'ThS. Nguyễn Văn A',
        phong: 'A1-301',
        thu: 2, // Thứ 2
        tiet_bat_dau: 1,
        tiet_ket_thuc: 3,
    },
    {
        user_id: 1,
        mon_hoc: 'Cơ sở dữ liệu',
        giang_vien: 'TS. Trần Thị B',
        phong: 'A2-201',
        thu: 2,
        tiet_bat_dau: 4,
        tiet_ket_thuc: 6,
    },
    {
        user_id: 1,
        mon_hoc: 'Mạng máy tính',
        giang_vien: 'ThS. Lê Văn C',
        phong: 'B1-101',
        thu: 3,
        tiet_bat_dau: 1,
        tiet_ket_thuc: 3,
    },
    {
        user_id: 1,
        mon_hoc: 'Trí tuệ nhân tạo',
        giang_vien: 'PGS.TS. Phạm Văn D',
        phong: 'A3-401',
        thu: 4,
        tiet_bat_dau: 7,
        tiet_ket_thuc: 9,
    },
    {
        user_id: 1,
        mon_hoc: 'Phát triển ứng dụng Web',
        giang_vien: 'ThS. Hoàng Thị E',
        phong: 'A1-302',
        thu: 5,
        tiet_bat_dau: 1,
        tiet_ket_thuc: 3,
    },
    {
        user_id: 1,
        mon_hoc: 'Thương mại điện tử',
        giang_vien: 'TS. Ngô Văn F',
        phong: 'A2-301',
        thu: 6,
        tiet_bat_dau: 4,
        tiet_ket_thuc: 6,
    },
];

// Dữ liệu điểm mẫu
const gradesData = [
    {
        user_id: 1,
        mon_hoc: 'Lập trình hướng đối tượng',
        so_tin_chi: 3,
        diem_giua_ky: 8.5,
        diem_cuoi_ky: 9.0,
        diem_tong_ket: 8.8,
        diem_chu: 'A',
    },
    {
        user_id: 1,
        mon_hoc: 'Cấu trúc dữ liệu và giải thuật',
        so_tin_chi: 3,
        diem_giua_ky: 7.5,
        diem_cuoi_ky: 8.0,
        diem_tong_ket: 7.8,
        diem_chu: 'B+',
    },
    {
        user_id: 1,
        mon_hoc: 'Hệ điều hành',
        so_tin_chi: 3,
        diem_giua_ky: 8.0,
        diem_cuoi_ky: 8.5,
        diem_tong_ket: 8.3,
        diem_chu: 'A',
    },
    {
        user_id: 1,
        mon_hoc: 'Mạng máy tính',
        so_tin_chi: 3,
        diem_giua_ky: 7.0,
        diem_cuoi_ky: 7.5,
        diem_tong_ket: 7.3,
        diem_chu: 'B',
    },
    {
        user_id: 1,
        mon_hoc: 'Lập trình Web',
        so_tin_chi: 3,
        diem_giua_ky: 9.0,
        diem_cuoi_ky: 9.5,
        diem_tong_ket: 9.3,
        diem_chu: 'A+',
    },
    {
        user_id: 1,
        mon_hoc: 'Toán rời rạc',
        so_tin_chi: 3,
        diem_giua_ky: 6.5,
        diem_cuoi_ky: 7.0,
        diem_tong_ket: 6.8,
        diem_chu: 'B',
    },
];

// Hàm seed dữ liệu vào database
export const seedDatabase = async () => {
    try {
        const database = await getDBConnection();

        // Insert users
        for (const user of usersData) {
            await database.executeSql(
                `INSERT OR IGNORE INTO users (mssv, password, ho_ten, lop, khoa, email, avatar) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [user.mssv, user.password, user.ho_ten, user.lop, user.khoa, user.email, user.avatar]
            );
        }

        // Insert announcements
        for (const announcement of announcementsData) {
            await database.executeSql(
                `INSERT INTO announcements (title, content, sender, created_at, type) 
         VALUES (?, ?, ?, ?, ?)`,
                [announcement.title, announcement.content, announcement.sender, announcement.created_at, announcement.type]
            );
        }

        // Insert schedule
        for (const item of scheduleData) {
            await database.executeSql(
                `INSERT INTO schedule (user_id, mon_hoc, giang_vien, phong, thu, tiet_bat_dau, tiet_ket_thuc) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [item.user_id, item.mon_hoc, item.giang_vien, item.phong, item.thu, item.tiet_bat_dau, item.tiet_ket_thuc]
            );
        }

        // Insert grades
        for (const grade of gradesData) {
            await database.executeSql(
                `INSERT INTO grades (user_id, mon_hoc, so_tin_chi, diem_giua_ky, diem_cuoi_ky, diem_tong_ket, diem_chu) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [grade.user_id, grade.mon_hoc, grade.so_tin_chi, grade.diem_giua_ky, grade.diem_cuoi_ky, grade.diem_tong_ket, grade.diem_chu]
            );
        }

        console.log('Seed data inserted successfully!');
        return true;
    } catch (error) {
        console.error('Error seeding database:', error);
        return false;
    }
};

export default { seedDatabase };
