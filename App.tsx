import React, { useEffect, useState, useCallback } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
  Alert,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';

// ============ MÀN HÌNH SPLASH ============
const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Login');
    }, 2000);
  }, [navigation]);

  return (
    <View style={styles.splashContainer}>
      <StatusBar backgroundColor="#003366" barStyle="light-content" />
      <View style={styles.logoCircle}>
        <Text style={styles.logoText}>HCMUTE</Text>
      </View>
      <Text style={styles.splashTitle}>TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT</Text>
      <Text style={styles.splashSubtitle}>TP. HỒ CHÍ MINH</Text>
      <Text style={styles.appName}>App Sinh Viên</Text>
    </View>
  );
};

// ============ IMPORT FIREBASE ============
import { getStudents, onSchedulesChange, onExamSchedulesChange, onSubjectsChange, updateStudentRegisteredSections, onGradesChange, onAnnouncementsChange, onStudentsChange } from './src/firebase';

// ============ MÀN HÌNH ĐĂNG NHẬP ============
const LoginScreen = ({ navigation }: any) => {
  const [mssv, setMssv] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!mssv.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập MSSV và mật khẩu');
      return;
    }

    setLoading(true);
    try {
      // Lấy danh sách sinh viên từ Firebase
      const students = await getStudents();

      // Tìm user trong danh sách
      const user = students.find((u: any) => u.mssv === mssv.trim() && u.password === password);

      if (user) {
        navigation.replace('Main', { user });
      } else {
        Alert.alert('Lỗi', 'MSSV hoặc mật khẩu không đúng');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể kết nối đến server. Vui lòng thử lại.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <StatusBar backgroundColor="#003366" barStyle="light-content" />
      <View style={styles.loginHeader}>
        <View style={styles.logoCircleSmall}>
          <Text style={styles.logoTextSmall}>HCMUTE</Text>
        </View>
        <Text style={styles.loginTitle}>ĐĂNG NHẬP</Text>
      </View>
      <View style={styles.loginForm}>
        <Text style={styles.label}>Mã số sinh viên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập MSSV"
          value={mssv}
          onChangeText={setMssv}
          keyboardType="numeric"
        />
        <Text style={styles.label}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          style={[styles.loginButton, loading && { opacity: 0.7 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.hint}>🔥 Đồng bộ Firebase - Thêm SV từ Admin Web</Text>
      </View>
    </View>
  );
};

// ============ DỮ LIỆU MẪu (DỰ PHÒNG KHI FIREBASE TRỐNG) ============
const MOCK_ANNOUNCEMENTS = [
  {
    id: '1',
    title: 'Thông báo về lịch thi kiểm tra trình độ tiếng Anh đầu ra đợt thi tháng 01/2025',
    sender: 'PDT_Phạm Thị Thùy Hạnh',
    date: '31/12/2025',
    type: 'chung',
    created_at: '2025-12-31T08:00:00',
    content: 'Phòng Đào tạo thông báo lịch thi kiểm tra trình độ tiếng Anh đầu ra đợt thi tháng 01/2025 như sau:\n\n- Thời gian thi: 15/01/2025\n- Địa điểm: Hội trường A\n- Thí sinh có mặt trước 30 phút\n\nĐề nghị các sinh viên đăng ký thi đúng thời hạn.'
  },
  {
    id: '2',
    title: 'Thông báo chương trình Lễ tốt nghiệp tháng 01/2025',
    sender: 'PDT_Bùi Thị Quỳnh',
    date: '26/12/2025',
    type: 'chung',
    created_at: '2025-12-26T09:30:00',
    content: 'Trường Đại học Sư phạm Kỹ thuật TP.HCM thông báo chương trình Lễ tốt nghiệp tháng 01/2025:\n\n- Thời gian: 20/01/2025, 8h00\n- Địa điểm: Nhà thi đấu đa năng\n\nSinh viên tốt nghiệp vui lòng đăng ký nhận bằng tại Phòng Đào tạo.'
  },
  {
    id: '3',
    title: 'Thông báo Về việc nhận bằng tốt nghiệp Đại học hệ chính quy',
    sender: 'PDT_Bùi Thị Quỳnh',
    date: '17/11/2025',
    type: 'chung',
    created_at: '2025-11-17T10:00:00',
    content: 'Phòng Đào tạo thông báo về việc nhận bằng tốt nghiệp Đại học hệ chính quy:\n\n- Thời gian: Từ 01/12/2025\n- Địa điểm: Phòng Đào tạo (A1.101)\n- Giờ làm việc: 8h00 - 11h00 và 14h00 - 16h30\n\nSinh viên mang theo CMND/CCCD khi nhận bằng.'
  },
  {
    id: '4',
    title: 'Thông báo lịch thi kiểm tra trình độ tiếng Anh đầu ra đợt thi tháng 01/2025',
    sender: 'PDT_Phạm Thị Thùy Hạnh',
    date: '12/12/2025',
    type: 'chung',
    created_at: '2025-12-12T14:00:00',
    content: 'Phòng Đào tạo thông báo lịch thi chi tiết:\n\n- Ca 1: 7h30 - 9h30\n- Ca 2: 10h00 - 12h00\n- Ca 3: 14h00 - 16h00\n\nSinh viên xem ca thi tại website trường.'
  },
  {
    id: '5',
    title: 'Thông báo v/v đăng ký thi kiểm tra trình độ tiếng Anh đầu ra',
    sender: 'PDT_Phạm Thị Thùy Hạnh',
    date: '12/12/2025',
    type: 'chung',
    created_at: '2025-12-12T08:00:00',
    content: 'Sinh viên đăng ký thi kiểm tra trình độ tiếng Anh đầu ra theo hướng dẫn sau:\n\n1. Đăng nhập hệ thống\n2. Chọn đợt thi phù hợp\n3. Xác nhận đăng ký\n\nHạn đăng ký: 25/12/2025.'
  },
  {
    id: '6',
    title: 'Thông báo về việc nộp học phí học kỳ 2 năm học 2025-2026',
    sender: 'Phòng Kế hoạch Tài chính',
    date: '08/01/2026',
    type: 'ca_nhan',
    created_at: '2026-01-08T09:00:00',
    content: 'Kính gửi sinh viên,\n\nPhòng Kế hoạch Tài chính thông báo thời hạn nộp học phí HK2 năm học 2025-2026:\n\n- Hạn nộp: 31/01/2026\n- Học phí: 13.000.000 VNĐ\n\nSinh viên nộp qua ngân hàng hoặc cổng thanh toán online.'
  },
  {
    id: '7',
    title: 'Nhắc nhở: Đăng ký học phần học kỳ 2',
    sender: 'PDT_Nguyễn Văn A',
    date: '05/01/2026',
    type: 'ca_nhan',
    created_at: '2026-01-05T08:00:00',
    content: 'Nhắc nhở sinh viên đăng ký học phần HK2 năm học 2025-2026:\n\n- Thời gian đăng ký: 05/01 - 15/01/2026\n- Sinh viên đăng nhập hệ thống để đăng ký\n\nLưu ý: Sau thời hạn trên, sinh viên sẽ không được đăng ký bổ sung.'
  },
];

// Simulate fetching from API - Now uses Firebase!
import { getAnnouncements } from './src/firebase';

const fetchAnnouncements = async (): Promise<typeof MOCK_ANNOUNCEMENTS> => {
  try {
    const data = await getAnnouncements();
    return (data.length > 0 ? data : MOCK_ANNOUNCEMENTS) as typeof MOCK_ANNOUNCEMENTS;
  } catch (error) {
    console.log('Firebase fetch failed, using mock data');
    return MOCK_ANNOUNCEMENTS;
  }
};

// ============ ANNOUNCEMENTS SCREEN ============
const AnnouncementsScreen = ({ navigation }: any) => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('chung');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [announcements, setAnnouncements] = useState<typeof MOCK_ANNOUNCEMENTS>([]);
  const [error, setError] = useState<string | null>(null);

  // Fetch data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAnnouncements();
      setAnnouncements(data);
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi');
      Alert.alert('Lỗi', 'Không thể tải dữ liệu. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const data = await fetchAnnouncements();
      setAnnouncements(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setRefreshing(false);
    }
  }, []);

  const filteredData = announcements
    .filter(item => item.type === activeTab)
    .filter(item => item.title.toLowerCase().includes(searchText.toLowerCase()));

  const renderItem = ({ item }: any) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}
    >
      <View style={styles.cardIcon}>
        <Text style={{ fontSize: 24 }}>📋</Text>
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.cardMeta}>
          <Text style={styles.cardSender}>👤 {item.sender}</Text>
          <Text style={styles.cardDate}>📅 {item.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Text style={{ fontSize: 48 }}>📭</Text>
      <Text style={styles.emptyText}>Không có thông báo nào</Text>
    </View>
  );

  return (
    <View style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>📢 THÔNG BÁO</Text>
      </View>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'chung' && styles.activeTab]}
          onPress={() => setActiveTab('chung')}>
          <Text style={[styles.tabText, activeTab === 'chung' && styles.activeTabText]}>
            THÔNG BÁO CHUNG
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'ca_nhan' && styles.activeTab]}
          onPress={() => setActiveTab('ca_nhan')}>
          <Text style={[styles.tabText, activeTab === 'ca_nhan' && styles.activeTabText]}>
            CÁ NHÂN
          </Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="🔍 Tìm kiếm thông báo..."
        value={searchText}
        onChangeText={setSearchText}
        placeholderTextColor="#999"
      />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#003366" />
          <Text style={styles.loadingText}>Đang tải...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={{ fontSize: 48 }}>⚠️</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadData}>
            <Text style={styles.retryButtonText}>🔄 Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={renderEmpty}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={['#003366']}
              tintColor="#003366"
            />
          }
        />
      )}
    </View>
  );
};

// ============ ANNOUNCEMENT DETAIL SCREEN ============
const AnnouncementDetailScreen = ({ route }: any) => {
  const { announcement } = route.params;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.detailHeader}>
        <Text style={styles.detailTitle}>{announcement.title}</Text>
        <View style={styles.detailMeta}>
          <Text style={styles.detailMetaItem}>👤 {announcement.sender}</Text>
          <Text style={styles.detailMetaItem}>📅 {formatDate(announcement.created_at)}</Text>
          <Text style={styles.detailMetaItem}>
            {announcement.type === 'ca_nhan' ? '🔒 Thông báo cá nhân' : '🌐 Thông báo chung'}
          </Text>
        </View>
      </View>
      <View style={styles.detailContent}>
        <Text style={styles.detailContentLabel}>Nội dung:</Text>
        <Text style={styles.detailContentText}>{announcement.content}</Text>
      </View>
    </ScrollView>
  );
};

// ============ THÔNG TIN CÁ NHÂN ============
const ProfileScreen = ({ route }: any) => {
  const user = route.params?.user || {};

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.profileName}>{user.ho_ten || 'Sinh viên'}</Text>
        <Text style={styles.profileMssv}>MSSV: {user.mssv || '---'}</Text>
      </View>
      <View style={styles.infoCard}>
        <InfoRow label="Mã số sinh viên" value={user.mssv} />
        <InfoRow label="Họ và tên" value={user.ho_ten} />
        <InfoRow label="Lớp" value={user.lop} />
        <InfoRow label="Khoa" value={user.khoa} />
        <InfoRow label="Email" value={user.email} />
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: any) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || 'Chưa cập nhật'}</Text>
  </View>
);

// ============ THỜI KHÓA BIỂU ============
// ============ THỜI KHÓA BIỂU (LOGIC NGÀY) ============
const ScheduleScreen = ({ route }: any) => {
  const user = route.params?.user || {};
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Helper: Get weekday string (e.g. "Thứ 2") from Date
  const getWeekdayString = (date: Date) => {
    const day = date.getDay(); // 0 = Sun, 1 = Mon...
    if (day === 0) return 'Chủ nhật';
    return `Thứ ${day + 1}`;
  };

  const formatDate = (date: Date) => {
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
  };

  const changeDate = (days: number) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(newDate);
  };

  useEffect(() => {
    // @ts-ignore
    const unsubscribe = onSchedulesChange((data) => {
      if (user.registered_sections) {
        const userSections = typeof user.registered_sections === 'string'
          ? user.registered_sections.split(',').map((s: string) => s.trim())
          : (user.registered_sections || []);

        // Filter: 
        // 1. Match Class Section (if exists)
        // 2. Match Weekday
        // 3. Match Date Range (Start <= Selected <= End) OR No Date Range (Backward Compatible)

        const currentWeekday = getWeekdayString(selectedDate);
        const selectedTime = selectedDate.getTime();

        const filteredData = data.filter((item: any) => {
          // 1. Section check
          const isSectionMatch = !item.class_section || userSections.includes(item.class_section);
          if (!isSectionMatch) return false;

          // 2. Weekday check
          if (item.day !== currentWeekday) return false;

          // 3. Date Range check
          if (item.start_date && item.end_date) {
            const start = new Date(item.start_date).getTime();
            const end = new Date(item.end_date).getTime();
            // Simple comparison: check day boundaries. 
            // Note: item.start_date from input type="date" is usually YYYY-MM-DD.
            // new Date('2025-01-01') is UTC, but lets assume simple local string parsing consistency or just use string comparison if format matches.
            // Better: Parse YYYY-MM-DD to midnight local
            const startMidnight = new Date(item.start_date);
            startMidnight.setHours(0, 0, 0, 0);

            const endMidnight = new Date(item.end_date);
            endMidnight.setHours(23, 59, 59, 999);

            const currentMidnight = new Date(selectedDate);
            currentMidnight.setHours(12, 0, 0, 0); // Avoid edge cases

            if (currentMidnight < startMidnight || currentMidnight > endMidnight) {
              return false;
            }
          }

          return true;
        });

        setSchedules(filteredData);
      } else {
        setSchedules([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.registered_sections, selectedDate]);

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>📅 THỜI KHÓA BIỂU</Text>
      </View>

      {/* Date Picker Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' }}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={{ padding: 10 }}>
          <Text style={{ fontSize: 24, color: '#003366' }}>◀️</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#003366' }}>{getWeekdayString(selectedDate)}</Text>
          <Text style={{ fontSize: 14, color: '#666' }}>{formatDate(selectedDate)}</Text>
        </View>
        <TouchableOpacity onPress={() => changeDate(1)} style={{ padding: 10 }}>
          <Text style={{ fontSize: 24, color: '#003366' }}>▶️</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={{ marginTop: 20 }} />
      ) : schedules.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Hôm nay không có lịch học.</Text>
          <Text style={{ textAlign: 'center', color: '#888', marginTop: 5 }}>"Học nữa, học mãi... 😴"</Text>
        </View>
      ) : (
        schedules.map((item) => (
          <View key={item.id} style={styles.scheduleCard}>
            <View style={styles.scheduleDay}>
              {/* Show Time instead of Day since Day is already in Header */}
              <Text style={[styles.scheduleDayText, { fontSize: 13 }]}>{item.time.split(' ')[0]}</Text>
              <Text style={{ fontSize: 10, color: '#fff' }}>Tiết</Text>
            </View>
            <View style={styles.scheduleInfo}>
              <Text style={styles.scheduleSubject}>{item.subject}</Text>
              <Text style={styles.scheduleDetail}>📍 {item.room}</Text>
              <Text style={styles.scheduleDetail}>⏰ {item.time}</Text>
              {item.lecturer && <Text style={styles.scheduleDetail}>👨‍🏫 {item.lecturer}</Text>}
              {item.class_section && <Text style={[styles.badge, { backgroundColor: '#e1f5fe', color: '#0277bd', alignSelf: 'flex-start', marginTop: 5, fontSize: 10 }]}>{item.class_section}</Text>}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// ============ XEM ĐIỂM ============
// ============ XEM ĐIỂM (MỚI) ============
// ============ XEM ĐIỂM (LOGIC) ============
const GradesScreen = ({ route }: any) => {
  const user = route.params?.user || {};
  const [gradesBySemester, setGradesBySemester] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSemester, setExpandedSemester] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [cpa, setCpa] = useState({ score: 0, credits: 0 });

  const getSemesterName = (code: string) => {
    const map: any = {
      'hk1_2425': 'Học kỳ 1 - Năm học 2024-2025',
      'hk2_2425': 'Học kỳ 2 - Năm học 2024-2025',
      'hk1_2526': 'Học kỳ 1 - Năm học 2025-2026',
      'hk2_2526': 'Học kỳ 2 - Năm học 2025-2026',
    };
    return map[code] || code;
  };

  useEffect(() => {
    // @ts-ignore
    const unsubscribe = onGradesChange((data) => {
      if (user.id) {
        const myGrades = data.filter((grade: any) => grade.student_id === user.id);

        // Calculate CPA
        let totalScore = 0;
        let totalCredits = 0;

        // Group by semester
        const grouped: any = {};
        myGrades.forEach((g: any) => {
          if (!grouped[g.semester]) {
            grouped[g.semester] = {
              id: g.semester,
              semester: getSemesterName(g.semester),
              subjects: [],
              totalScore: 0,
              totalCredits: 0
            };
          }
          // Use fallback if credits is missing to avoid NaN
          const credits = g.credits ? parseInt(g.credits) : 0;
          const score = g.tk ? parseFloat(g.tk) : 0;

          grouped[g.semester].subjects.push({
            id: g.id,
            subject: g.subject_name,
            credits: credits,
            score: score,
            grade: g.grade,
            details: { cc: g.cc, gk: g.gk, ck: g.ck }
          });

          grouped[g.semester].totalScore += score * credits;
          grouped[g.semester].totalCredits += credits;

          totalScore += score * credits;
          totalCredits += credits;
        });

        // Calculate GPA per semester
        const result = Object.values(grouped).map((sem: any) => {
          const gpa = sem.totalCredits > 0 ? (sem.totalScore / sem.totalCredits).toFixed(2) : 0;
          return { ...sem, gpa };
        });

        // Calculate CPA
        const finalCpa = totalCredits > 0 ? (totalScore / totalCredits).toFixed(2) : 0;
        setCpa({ score: finalCpa as any, credits: totalCredits });

        // Sort: newest semester first (simple reverse alpha sort roughly works for hk2 > hk1, 2526 > 2425)
        // Or strictly: year desc, then term desc.
        result.sort((a: any, b: any) => b.id.localeCompare(a.id));

        setGradesBySemester(result);
        if (result.length > 0 && expandedSemester === null) {
          setExpandedSemester(result[0].id);
        }
      } else {
        setGradesBySemester([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.id]);

  const toggleExpand = (id: string) => {
    // Nếu đang mở thì đóng, nếu đang đóng thì mở
    setExpandedSemester(expandedSemester === id ? null : id);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A')) return '#4CAF50'; // Giỏi
    if (grade.startsWith('B')) return '#2196F3'; // Khá
    if (grade.startsWith('C')) return '#FF9800'; // Trung bình
    if (grade.startsWith('D')) return '#FF5722'; // Yếu
    return '#e74c3c'; // Kém
  };

  return (
    <ScrollView
      style={styles.screenContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#003366']} />
      }
    >
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>📊 BẢNG ĐIỂM</Text>
      </View>

      <View style={styles.gpaCard}>
        <View style={styles.gpaRow}>
          <View>
            <Text style={styles.gpaLabel}>GPA Tích lũy</Text>
            <Text style={styles.gpaValue}>{cpa.score} / 10</Text>
          </View>
          <View>
            <Text style={styles.gpaLabel}>Tổng tín chỉ</Text>
            <Text style={styles.gpaValue}>{cpa.credits} TC</Text>
          </View>
        </View>
      </View>

      {gradesBySemester.map((semester) => {
        const isExpanded = expandedSemester === semester.id;
        return (
          <View key={semester.id} style={styles.semesterCard}>
            <TouchableOpacity
              style={styles.semesterHeader}
              onPress={() => toggleExpand(semester.id)}
            >
              <View>
                <Text style={styles.semesterTitle}>{semester.semester}</Text>
                <Text style={styles.semesterGpa}>GPA: {semester.gpa}</Text>
              </View>
              <Text style={{ fontSize: 16 }}>{isExpanded ? '🔽' : '▶️'}</Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.semesterContent}>
                {semester.subjects.map((item) => (
                  <View key={item.id} style={styles.gradeItem}>
                    <View style={styles.gradeMainInfo}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.gradeSubject}>{item.subject}</Text>
                        <Text style={styles.gradeCredits}>{item.credits} tín chỉ</Text>
                      </View>
                      <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.grade) }]}>
                        <Text style={styles.gradeBadgeText}>{item.grade}</Text>
                      </View>
                    </View>
                    <View style={styles.gradeDetailsRow}>
                      <Text style={styles.gradeDetailText}>CC: {item.details.cc}</Text>
                      <Text style={styles.gradeDetailText}>GK: {item.details.gk}</Text>
                      <Text style={styles.gradeDetailText}>CK: {item.details.ck}</Text>
                      <Text style={[styles.gradeDetailText, { fontWeight: 'bold', color: '#003366' }]}>TK: {item.score}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
};

// ============ LỊCH THI ============
const ExamScheduleScreen = ({ route }: any) => {
  const user = route.params?.user || {};
  const [examSchedules, setExamSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @ts-ignore
    const unsubscribe = onExamSchedulesChange((data) => {
      // Filter exams based on user's registered sections
      if (user.registered_sections) {
        const userSections = typeof user.registered_sections === 'string'
          ? user.registered_sections.split(',').map((s: string) => s.trim())
          : (user.registered_sections || []);

        const filteredData = data.filter((item: any) =>
          !item.class_section || userSections.includes(item.class_section)
        );
        setExamSchedules(filteredData);
      } else {
        setExamSchedules([]);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.registered_sections]);

  const onRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <ScrollView
      style={styles.screenContainer}
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={onRefresh} colors={['#003366']} />
      }
    >
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>📝 LỊCH THI</Text>
      </View>
      <Text style={styles.semesterInfo}>Học kỳ 2 - Năm học 2025-2026</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={{ marginTop: 20 }} />
      ) : examSchedules.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có lịch thi.</Text>
        </View>
      ) : (
        examSchedules.map((item) => (
          <View key={item.id} style={styles.examCard}>
            <View style={styles.examHeader}>
              <Text style={styles.examSubject}>{item.subject}</Text>
              <View style={[styles.examBadge, { backgroundColor: item.type === 'Cuối kỳ' ? '#e74c3c' : '#f39c12' }]}>
                <Text style={styles.examBadgeText}>{item.type}</Text>
              </View>
            </View>
            <View style={styles.examDetails}>
              <Text style={styles.examDetail}>📅 {item.date}</Text>
              <Text style={styles.examDetail}>⏰ {item.time}</Text>
              <Text style={styles.examDetail}>📍 {item.room}</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// ============ TRANG CHỦ (DASHBOARD) ============
const DashboardScreen = ({ route, navigation }: any) => {
  const initialUser = route.params?.user || {};
  const [user, setUser] = useState(initialUser);
  const [cpa, setCpa] = useState<string>('0.00');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // @ts-ignore
    const unsubscribe = onGradesChange((data) => {
      if (user.id) {
        const myGrades = data.filter((grade: any) => grade.student_id === user.id);

        let totalScore = 0;
        let totalCredits = 0;

        myGrades.forEach((g: any) => {
          // Use fallback if credits is missing to avoid NaN
          const credits = g.credits ? parseInt(g.credits) : 0;
          const score = g.tk ? parseFloat(g.tk) : 0;

          totalScore += score * credits;
          totalCredits += credits;
        });

        const finalCpa = totalCredits > 0 ? (totalScore / totalCredits).toFixed(2) : '0.00';
        setCpa(finalCpa);
      } else {
        setCpa('0.00');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.id]);

  // Realtime User Update (for Registered Sections)
  useEffect(() => {
    // @ts-ignore
    const unsubscribe = onStudentsChange((data) => {
      const found = data.find((s: any) => s.id === initialUser.id);
      if (found) {
        setUser(found);
      }
    });
    return () => unsubscribe();
  }, [initialUser.id]);

  const [announcementCount, setAnnouncementCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);

  useEffect(() => {
    // 1. Fetch Announcement Count
    // @ts-ignore
    const unsubscribeAnnouncements = onAnnouncementsChange((data) => {
      setAnnouncementCount(data.length);
    });

    // 2. Calculate Subject Count
    if (user.registered_sections) {
      const sections = typeof user.registered_sections === 'string'
        ? user.registered_sections.split(',').filter((s: string) => s.trim().length > 0)
        : (user.registered_sections || []);
      setSubjectCount(sections.length);
    } else {
      setSubjectCount(0);
    }

    return () => {
      unsubscribeAnnouncements();
    };
  }, [user.registered_sections]);

  const handleLogout = () => {
    Alert.alert(
      'Đăng xuất',
      'Bạn có chắc chắn muốn đăng xuất?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đăng xuất',
          style: 'destructive',
          onPress: () => navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          }),
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.dashboardHeader}>
        <View style={styles.dashboardTopRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.dashboardWelcome}>Xin chào,</Text>
            <Text style={styles.dashboardName}>{user.ho_ten || 'Sinh viên'}</Text>
            <Text style={styles.dashboardMssv}>MSSV: {user.mssv || '---'}</Text>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{announcementCount}</Text>
          <Text style={styles.statLabel}>Thông báo mới</Text>
        </View>
        <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('Xem điểm')}>
          <Text style={styles.statNumber}>{loading ? '...' : cpa}</Text>
          <Text style={styles.statLabel}>GPA Tích lũy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('MySubjects', { user })}>
          <Text style={styles.statNumber}>{subjectCount}</Text>
          <Text style={styles.statLabel}>Môn học</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>⚡ Truy cập nhanh</Text>
      <View style={styles.quickLinks}>
        <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('Thông báo')}>
          <Text style={styles.quickLinkIcon}>📢</Text>
          <Text style={styles.quickLinkText}>Thông báo</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('Thời khóa biểu')}>
          <Text style={styles.quickLinkIcon}>📅</Text>
          <Text style={styles.quickLinkText}>Lịch học</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('Xem điểm')}>
          <Text style={styles.quickLinkIcon}>📊</Text>
          <Text style={styles.quickLinkText}>Điểm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('Lịch thi')}>
          <Text style={styles.quickLinkIcon}>📝</Text>
          <Text style={styles.quickLinkText}>Lịch thi</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>📚 Đăng ký</Text>
      <View style={styles.quickLinks}>
        <TouchableOpacity style={styles.quickLink} onPress={() => navigation.navigate('CourseRegistration', { user })}>
          <Text style={styles.quickLinkIcon}>📝</Text>
          <Text style={styles.quickLinkText}>Đăng ký HP</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>⚙️ Cài đặt</Text>
      <View style={styles.settingsContainer}>
        <TouchableOpacity style={styles.settingsItem} onPress={() => navigation.navigate('Profile', { user })}>
          <Text style={styles.settingsIcon}>👤</Text>
          <Text style={styles.settingsText}>Thông tin cá nhân</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem} onPress={() => Alert.alert('Đổi mật khẩu', 'Tính năng đang phát triển')}>
          <Text style={styles.settingsIcon}>🔒</Text>
          <Text style={styles.settingsText}>Đổi mật khẩu</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingsItem}>
          <Text style={styles.settingsIcon}>ℹ️</Text>
          <Text style={styles.settingsText}>Về ứng dụng</Text>
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
      </View>
    </ScrollView >
  );
};

// ============ HỌC PHÍ ============
const TuitionScreen = () => (
  <ScrollView style={styles.screenContainer}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>💰 THANH TOÁN HỌC PHÍ</Text>
    </View>

    <View style={styles.tuitionCard}>
      <Text style={styles.tuitionSemester}>Học kỳ 2 - Năm học 2025-2026</Text>
      <View style={styles.tuitionRow}>
        <Text style={styles.tuitionLabel}>Học phí:</Text>
        <Text style={styles.tuitionValue}>12,500,000 VNĐ</Text>
      </View>
      <View style={styles.tuitionRow}>
        <Text style={styles.tuitionLabel}>Bảo hiểm:</Text>
        <Text style={styles.tuitionValue}>500,000 VNĐ</Text>
      </View>
      <View style={styles.tuitionDivider} />
      <View style={styles.tuitionRow}>
        <Text style={styles.tuitionLabelBold}>Tổng cộng:</Text>
        <Text style={styles.tuitionValueBold}>13,000,000 VNĐ</Text>
      </View>
      <View style={[styles.tuitionStatus, { backgroundColor: '#4CAF50' }]}>
        <Text style={styles.tuitionStatusText}>✅ ĐÃ THANH TOÁN</Text>
      </View>
    </View>

    <View style={styles.tuitionCard}>
      <Text style={styles.tuitionSemester}>Học kỳ 1 - Năm học 2025-2026</Text>
      <View style={styles.tuitionRow}>
        <Text style={styles.tuitionLabelBold}>Tổng cộng:</Text>
        <Text style={styles.tuitionValueBold}>12,800,000 VNĐ</Text>
      </View>
      <View style={[styles.tuitionStatus, { backgroundColor: '#4CAF50' }]}>
        <Text style={styles.tuitionStatusText}>✅ ĐÃ THANH TOÁN</Text>
      </View>
    </View>
  </ScrollView>
);

// ============ ĐIỂM RÈN LUYỆN ============
const trainingPointsData = [
  { id: '1', semester: 'HK2 2025-2026', points: 85, rank: 'Tốt' },
  { id: '2', semester: 'HK1 2025-2026', points: 90, rank: 'Xuất sắc' },
  { id: '3', semester: 'HK2 2024-2025', points: 82, rank: 'Tốt' },
  { id: '4', semester: 'HK1 2024-2025', points: 88, rank: 'Tốt' },
];

const TrainingPointsScreen = () => (
  <ScrollView style={styles.screenContainer}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>🎓 ĐIỂM RÈN LUYỆN</Text>
    </View>

    <View style={styles.trainingAvg}>
      <Text style={styles.trainingAvgLabel}>Điểm trung bình rèn luyện</Text>
      <Text style={styles.trainingAvgValue}>86.25</Text>
      <Text style={styles.trainingAvgRank}>Xếp loại: TỐT</Text>
    </View>

    {trainingPointsData.map((item) => (
      <View key={item.id} style={styles.trainingCard}>
        <View style={styles.trainingInfo}>
          <Text style={styles.trainingSemester}>{item.semester}</Text>
          <Text style={styles.trainingRank}>{item.rank}</Text>
        </View>
        <View style={styles.trainingScore}>
          <Text style={styles.trainingPoints}>{item.points}</Text>
          <Text style={styles.trainingMax}>/100</Text>
        </View>
      </View>
    ))}
  </ScrollView>
);

// ============ CHƯƠNG TRÌNH ĐÀO TẠO ============
const curriculumData = [
  { semester: 'Học kỳ 1', subjects: ['Nhập môn lập trình', 'Toán cao cấp 1', 'Vật lý đại cương', 'Tiếng Anh 1'], credits: 15 },
  { semester: 'Học kỳ 2', subjects: ['Lập trình hướng đối tượng', 'Toán cao cấp 2', 'Cấu trúc dữ liệu', 'Tiếng Anh 2'], credits: 16 },
  { semester: 'Học kỳ 3', subjects: ['Cơ sở dữ liệu', 'Mạng máy tính', 'Hệ điều hành', 'Lập trình Web'], credits: 18 },
  { semester: 'Học kỳ 4', subjects: ['Lập trình di động', 'Trí tuệ nhân tạo', 'An toàn thông tin', 'Thương mại điện tử'], credits: 17 },
];

const CurriculumScreen = () => (
  <ScrollView style={styles.screenContainer}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>📚 CHƯƠNG TRÌNH ĐÀO TẠO</Text>
    </View>

    <View style={styles.curriculumSummary}>
      <Text style={styles.curriculumTotal}>Tổng tín chỉ tích lũy: 66/140</Text>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: '47%' }]} />
      </View>
      <Text style={styles.curriculumPercent}>47% hoàn thành</Text>
    </View>

    {curriculumData.map((item, index) => (
      <View key={index} style={styles.curriculumCard}>
        <View style={styles.curriculumHeader}>
          <Text style={styles.curriculumSemester}>{item.semester}</Text>
          <Text style={styles.curriculumCredits}>{item.credits} TC</Text>
        </View>
        {item.subjects.map((subject, idx) => (
          <Text key={idx} style={styles.curriculumSubject}>• {subject}</Text>
        ))}
      </View>
    ))}
  </ScrollView>
);

// ============ CHUYÊN CẦN (ĐIỂM DANH) ============
const attendanceData = [
  { id: '1', subject: 'Lập trình di động', total: 15, attended: 14, absent: 1, percent: 93 },
  { id: '2', subject: 'Cơ sở dữ liệu', total: 15, attended: 15, absent: 0, percent: 100 },
  { id: '3', subject: 'Mạng máy tính', total: 12, attended: 11, absent: 1, percent: 92 },
  { id: '4', subject: 'Trí tuệ nhân tạo', total: 10, attended: 10, absent: 0, percent: 100 },
  { id: '5', subject: 'Thương mại điện tử', total: 8, attended: 7, absent: 1, percent: 88 },
];

const AttendanceScreen = () => (
  <ScrollView style={styles.screenContainer}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>✅ CHUYỂN CẦN (ĐIỂM DANH)</Text>
    </View>
    <Text style={styles.semesterInfo}>Học kỳ 2 - Năm học 2025-2026</Text>

    {attendanceData.map((item) => (
      <View key={item.id} style={styles.attendanceCard}>
        <Text style={styles.attendanceSubject}>{item.subject}</Text>
        <View style={styles.attendanceStats}>
          <View style={styles.attendanceStat}>
            <Text style={styles.attendanceNumber}>{item.attended}</Text>
            <Text style={styles.attendanceLabel}>Có mặt</Text>
          </View>
          <View style={styles.attendanceStat}>
            <Text style={[styles.attendanceNumber, { color: '#e74c3c' }]}>{item.absent}</Text>
            <Text style={styles.attendanceLabel}>Vắng</Text>
          </View>
          <View style={styles.attendanceStat}>
            <Text style={[styles.attendanceNumber, { color: item.percent >= 80 ? '#4CAF50' : '#e74c3c' }]}>
              {item.percent}%
            </Text>
            <Text style={styles.attendanceLabel}>Tỷ lệ</Text>
          </View>
        </View>
        <View style={styles.attendanceProgress}>
          <View style={[styles.attendanceProgressFill, { width: `${item.percent}%` }]} />
        </View>
      </View>
    ))}
  </ScrollView>
);

// ============ ĐIỂM ANH VĂN ============
const englishGradesData = [
  { id: '1', type: 'TOEIC', score: 650, date: '15/06/2025', status: 'Đạt chuẩn đầu ra' },
  { id: '2', type: 'Tiếng Anh 1', score: 8.5, date: 'HK1 2024-2025', status: 'Hoàn thành' },
  { id: '3', type: 'Tiếng Anh 2', score: 8.0, date: 'HK2 2024-2025', status: 'Hoàn thành' },
  { id: '4', type: 'Tiếng Anh 3', score: 7.5, date: 'HK1 2025-2026', status: 'Hoàn thành' },
];

const EnglishGradesScreen = () => (
  <ScrollView style={styles.screenContainer}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>🇬🇧 ĐIỂM ANH VĂN</Text>
    </View>

    <View style={styles.englishSummary}>
      <Text style={styles.englishSummaryLabel}>Chuẩn đầu ra tiếng Anh</Text>
      <Text style={styles.englishSummaryValue}>TOEIC 650 ✅</Text>
      <Text style={styles.englishSummaryStatus}>Đã đạt chuẩn</Text>
    </View>

    {englishGradesData.map((item) => (
      <View key={item.id} style={styles.englishCard}>
        <View style={styles.englishInfo}>
          <Text style={styles.englishType}>{item.type}</Text>
          <Text style={styles.englishDate}>{item.date}</Text>
        </View>
        <View style={styles.englishScore}>
          <Text style={styles.englishScoreText}>{item.score}</Text>
          <Text style={styles.englishStatus}>{item.status}</Text>
        </View>
      </View>
    ))}
  </ScrollView>
);

// ============ ĐĂNG KÝ HỌC PHẦN ============
// ============ ĐĂNG KÝ HỌC PHẦN ============
const CourseRegistrationScreen = ({ route }: any) => {
  const user = route.params?.user || {};
  const [availableSubjects, setAvailableSubjects] = useState<any[]>([]);
  const [mySections, setMySections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // 1. Get user's current sections
    if (user.registered_sections) {
      const sections = typeof user.registered_sections === 'string'
        ? user.registered_sections.split(',').map((s: string) => s.trim())
        : (user.registered_sections || []);
      setMySections(sections);
    }

    // 2. Fetch available subjects from Firebase
    // @ts-ignore
    const unsubscribe = onSubjectsChange((data) => {
      setAvailableSubjects(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.registered_sections]);

  const handleRegister = async (subjectCode: string) => {
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc muốn đăng ký lớp ${subjectCode}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            try {
              const newSections = [...mySections, subjectCode];
              const sectionsString = newSections.join(', ');

              // Update local state immediately for UI
              setMySections(newSections);
              // Update user object ref logic
              console.log('User registered success:', sectionsString);

              // Update Firebase
              if (user.id) {
                await updateStudentRegisteredSections(user.id, sectionsString);
                // Also update the local user object param so navigation passing it back works? 
                // In a real app we'd use a Context or Redux store.
                // For now, let's just hope the listener in ScheduleScreen picks it up from Firebase refetching or we pass it.
                // Actually ScheduleScreen listens to onSchedulesChange and uses user.registered_sections.
                // We should update the user object in params if possible
                if (route.params?.user) {
                  route.params.user.registered_sections = sectionsString;
                }
                Alert.alert('Thành công', 'Đăng ký môn học thành công!');
              } else {
                Alert.alert('Lỗi', 'Không tìm thấy ID sinh viên.');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Đăng ký thất bại. Vui lòng thử lại.');
              console.error(error);
            }
          },
        },
      ]
    );
  };

  const handleCancel = async (subjectCode: string) => {
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc muốn HỦY lớp ${subjectCode}?`,
      [
        { text: 'Không', style: 'cancel' },
        {
          text: 'Hủy lớp',
          style: 'destructive',
          onPress: async () => {
            try {
              const newSections = mySections.filter(s => s !== subjectCode);
              const sectionsString = newSections.join(', ');

              setMySections(newSections);

              if (user.id) {
                await updateStudentRegisteredSections(user.id, sectionsString);
                if (route.params?.user) {
                  route.params.user.registered_sections = sectionsString;
                }
                Alert.alert('Thành công', 'Đã hủy lớp học phần.');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Hủy thất bại.');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>📝 ĐĂNG KÝ HỌC PHẦN</Text>
      </View>

      <View style={{ padding: 15, backgroundColor: '#fff' }}>
        <View style={styles.searchBox}>
          <Text style={{ marginRight: 10 }}>🔍</Text>
          <TextInput
            placeholder="Tìm kiếm môn học..."
            style={{ flex: 1, height: 40 }}
          // We need state for search. I'll add state in next chunk or assume simple rename
          />
        </View>
        <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#003366' }}>
          Tổng số môn: {availableSubjects.length} | Đã đăng ký: {mySections.length}
        </Text>
      </View>

      <View style={{ padding: 15, backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8, paddingHorizontal: 10 }}>
          <Text style={{ marginRight: 5 }}>🔍</Text>
          <TextInput
            placeholder="Tìm môn học..."
            style={{ flex: 1, height: 40 }}
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>
        <Text style={{ marginTop: 10, fontWeight: 'bold', color: '#003366' }}>
          Tổng số môn: {availableSubjects.length} | Đã đăng ký: {mySections.length}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={{ marginTop: 20 }} />
      ) : availableSubjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Chưa có môn học nào.</Text>
        </View>
      ) : (
        availableSubjects.filter(s => s.name?.toLowerCase().includes(searchTerm.toLowerCase()) || s.code?.toLowerCase().includes(searchTerm.toLowerCase())).map((subject) => {
          const isRegistered = mySections.includes(subject.code);
          return (
            <View key={subject.id} style={[styles.courseCard, isRegistered && styles.courseCardSelected]}>
              <View style={styles.courseInfo}>
                <Text style={styles.courseCode}>{subject.code}</Text>
                <Text style={styles.courseName}>{subject.name}</Text>
                <Text style={styles.courseDetails}>{subject.credits} TC | Khoa: {subject.department}</Text>
              </View>
              <TouchableOpacity
                style={[styles.regButton, isRegistered ? { backgroundColor: '#e74c3c' } : { backgroundColor: '#4CAF50' }]}
                onPress={() => isRegistered ? handleCancel(subject.code) : handleRegister(subject.code)}
              >
                <Text style={styles.regButtonText}>{isRegistered ? 'Hủy' : 'Đăng ký'}</Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </ScrollView>
  );
};

// ============ DANH SÁCH MÔN HỌC (CỦA TÔI) ============
const MySubjectsScreen = ({ route, navigation }: any) => {
  const user = route.params?.user || {};
  const [mySubjects, setMySubjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get user's registered section codes
    let sectionCodes: string[] = [];
    if (user.registered_sections) {
      sectionCodes = typeof user.registered_sections === 'string'
        ? user.registered_sections.split(',').map((s: string) => s.trim())
        : (user.registered_sections || []);
    }

    // 2. Fetch all subjects and filter
    // @ts-ignore
    const unsubscribe = onSubjectsChange((data) => {
      const filtered = data.filter((s: any) => sectionCodes.includes(s.code));
      setMySubjects(filtered);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user.registered_sections]);

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>📚 MÔN HỌC CỦA TÔI</Text>
      </View>

      <View style={{ padding: 15 }}>
        <Text style={{ fontSize: 16, color: '#666' }}>
          Bạn đang học <Text style={{ fontWeight: 'bold', color: '#003366' }}>{mySubjects.length}</Text> môn trong học kỳ này.
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#003366" style={{ marginTop: 20 }} />
      ) : mySubjects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Bạn chưa đăng ký môn học nào.</Text>
          <TouchableOpacity
            style={[styles.regButton, { marginTop: 15, width: 200, alignSelf: 'center' }]}
            onPress={() => navigation.navigate('MoreNavigator', { screen: 'CourseRegistration', params: { user } })}
          >
            <Text style={styles.regButtonText}>Đăng ký ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        mySubjects.map((subject) => (
          <View key={subject.id} style={styles.courseCard}>
            <View style={styles.courseInfo}>
              <Text style={styles.courseCode}>{subject.code}</Text>
              <Text style={styles.courseName}>{subject.name}</Text>
              <Text style={styles.courseDetails}>{subject.credits} Tín chỉ | {subject.department}</Text>
            </View>
            <View style={{ justifyContent: 'center' }}>
              <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>Đang học</Text>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

// ============ XÉT TỐT NGHIỆP ============
const GraduationScreen = () => (
  <ScrollView style={styles.screenContainer}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>🎓 XÉT TỐT NGHIỆP</Text>
    </View>

    <View style={styles.gradStatus}>
      <Text style={{ fontSize: 48 }}>🎓</Text>
      <Text style={styles.gradStatusTitle}>Trạng thái xét tốt nghiệp</Text>
      <Text style={styles.gradStatusValue}>CHƯA ĐỦ ĐIỀU KIỆN</Text>
    </View>

    <View style={styles.gradChecklist}>
      <Text style={styles.gradChecklistTitle}>📋 Điều kiện tốt nghiệp:</Text>

      <View style={styles.gradCheckItem}>
        <Text style={{ fontSize: 20 }}>✅</Text>
        <Text style={styles.gradCheckText}>Hoàn thành 66/140 tín chỉ</Text>
      </View>
      <View style={styles.gradCheckItem}>
        <Text style={{ fontSize: 20 }}>✅</Text>
        <Text style={styles.gradCheckText}>GPA tích lũy: 8.05 (≥ 5.0)</Text>
      </View>
      <View style={styles.gradCheckItem}>
        <Text style={{ fontSize: 20 }}>✅</Text>
        <Text style={styles.gradCheckText}>Đạt chuẩn tiếng Anh (TOEIC 650)</Text>
      </View>
      <View style={styles.gradCheckItem}>
        <Text style={{ fontSize: 20 }}>⏳</Text>
        <Text style={styles.gradCheckText}>Hoàn thành ĐATN/Khóa luận</Text>
      </View>
      <View style={styles.gradCheckItem}>
        <Text style={{ fontSize: 20 }}>⏳</Text>
        <Text style={styles.gradCheckText}>Đóng đủ học phí</Text>
      </View>
    </View>
  </ScrollView>
);

// ============ MẪu ĐƠN ============
const formsData = [
  { id: '1', name: 'Đơn xin nghỉ học tạm thời', icon: '📄' },
  { id: '2', name: 'Đơn xin chuyển ngành', icon: '🔄' },
  { id: '3', name: 'Đơn xin cấp bảng điểm', icon: '📊' },
  { id: '4', name: 'Đơn xin xác nhận sinh viên', icon: '📋' },
  { id: '5', name: 'Đơn xin miễn giảm học phí', icon: '💰' },
  { id: '6', name: 'Đơn xin hoãn thi', icon: '📝' },
];

const FormsScreen = () => (
  <ScrollView style={styles.screenContainer}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>📋 ĐĂNG KÝ MẪU ĐƠN</Text>
    </View>

    <View style={styles.formsGrid}>
      {formsData.map((form) => (
        <TouchableOpacity key={form.id} style={styles.formCard}>
          <Text style={styles.formIcon}>{form.icon}</Text>
          <Text style={styles.formName}>{form.name}</Text>
          <Text style={styles.formAction}>Tải về →</Text>
        </TouchableOpacity>
      ))}
    </View>
  </ScrollView>
);

// ============ QUYẾT ĐỊNH SINH VIÊN ============
const decisionsData = [
  { id: '1', title: 'Quyết định công nhận sinh viên khóa 24', date: '01/09/2024', number: 'QĐ-2024-001' },
  { id: '2', title: 'Quyết định về việc cấp học bổng HK1 2024-2025', date: '15/01/2025', number: 'QĐ-2025-012' },
  { id: '3', title: 'Quyết định khen thưởng SV xuất sắc', date: '20/06/2025', number: 'QĐ-2025-089' },
];

const DecisionsScreen = () => (
  <ScrollView style={styles.screenContainer}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>📜 QUYẾT ĐỊNH SV/HV/NCS</Text>
    </View>

    {decisionsData.map((item) => (
      <TouchableOpacity key={item.id} style={styles.decisionCard}>
        <View style={styles.decisionIcon}>
          <Text style={{ fontSize: 24 }}>📜</Text>
        </View>
        <View style={styles.decisionInfo}>
          <Text style={styles.decisionTitle}>{item.title}</Text>
          <Text style={styles.decisionMeta}>Số: {item.number} | {item.date}</Text>
        </View>
      </TouchableOpacity>
    ))}
  </ScrollView>
);
const Tab = createBottomTabNavigator();
const AnnouncementsStack = createStackNavigator();

const AnnouncementsStackNavigator = () => {
  return (
    <AnnouncementsStack.Navigator>
      <AnnouncementsStack.Screen
        name="AnnouncementsList"
        component={AnnouncementsScreen}
        options={{ headerShown: false }}
      />
      <AnnouncementsStack.Screen
        name="AnnouncementDetail"
        component={AnnouncementDetailScreen}
        options={{
          title: 'Chi tiết thông báo',
          headerStyle: { backgroundColor: '#003366' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
    </AnnouncementsStack.Navigator>
  );
};

const TabNavigator = ({ route }: any) => {
  const user = route.params?.user;

  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#003366' },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#003366',
        tabBarInactiveTintColor: '#999',
        tabBarStyle: { paddingBottom: 5, height: 60 },
        tabBarLabelStyle: { fontSize: 10 },
      }}>
      <Tab.Screen
        name="Trang chủ"
        options={{
          headerShown: false,
          tabBarLabel: 'Trang chủ',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}>
        {(props) => <DashboardScreen {...props} route={{ ...props.route, params: { user } }} />}
      </Tab.Screen>
      <Tab.Screen
        name="Thông báo"
        component={AnnouncementsStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Thông báo',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📢</Text>,
        }}
      />
      <Tab.Screen
        name="Thời khóa biểu"
        options={{
          headerShown: false,
          tabBarLabel: 'Lịch học',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text>,
        }}>
        {(props) => <ScheduleScreen {...props} route={{ ...props.route, params: { user } }} />}
      </Tab.Screen>
      <Tab.Screen
        name="Lịch thi"
        options={{
          headerShown: false,
          tabBarLabel: 'Lịch thi',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📝</Text>,
        }}>
        {(props) => <ExamScheduleScreen {...props} route={{ ...props.route, params: { user } }} />}
      </Tab.Screen>
      <Tab.Screen
        name="Xem điểm"
        options={{
          headerShown: false,
          tabBarLabel: 'Điểm',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text>,
        }}
      >
        {(props) => <GradesScreen {...props} route={{ ...props.route, params: { user } }} />}
      </Tab.Screen>

    </Tab.Navigator>
  );
};

// ============ MORE SCREENS NAVIGATOR ============
const MoreNavigator = ({ route, navigation }: any) => {
  const user = route.params?.user;

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>📋 CHỨC NĂNG KHÁC</Text>
      </View>
      <View style={styles.moreMenuGrid}>
        <TouchableOpacity style={styles.moreMenuItem}>
          <Text style={styles.moreMenuIcon}>👤</Text>
          <Text style={styles.moreMenuText}>Thông tin cá nhân</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreMenuItem}>
          <Text style={styles.moreMenuIcon}>💰</Text>
          <Text style={styles.moreMenuText}>Học phí</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreMenuItem}>
          <Text style={styles.moreMenuIcon}>🎓</Text>
          <Text style={styles.moreMenuText}>Điểm rèn luyện</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreMenuItem}>
          <Text style={styles.moreMenuIcon}>📚</Text>
          <Text style={styles.moreMenuText}>Chương trình ĐT</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.moreMenuItem} onPress={() => navigation.navigate('CourseRegistration', { user })}>
          <Text style={styles.moreMenuIcon}>📝</Text>
          <Text style={styles.moreMenuText}>Đăng ký HP</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// ============ STACK NAVIGATOR ============
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: true,
            title: 'Thông tin cá nhân',
            headerStyle: { backgroundColor: '#003366' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="CourseRegistration"
          component={CourseRegistrationScreen}
          options={{
            headerShown: true,
            title: 'Đăng ký học phần',
            headerStyle: { backgroundColor: '#003366' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="MySubjects"
          component={MySubjectsScreen}
          options={{
            headerShown: true,
            title: 'Môn học của tôi',
            headerStyle: { backgroundColor: '#003366' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
        <Stack.Screen
          name="Graduation"
          component={GraduationScreen}
          options={{
            headerShown: true,
            title: 'Xét tốt nghiệp',
            headerStyle: { backgroundColor: '#003366' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ============ STYLES (GIỮ NGUYÊN TRONG FILE) ============
const styles = StyleSheet.create({
  // Màn hình Splash
  splashContainer: { flex: 1, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center' },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoText: { fontSize: 16, fontWeight: 'bold', color: '#003366' },
  splashTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  splashSubtitle: { fontSize: 14, color: '#fff', marginTop: 5 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 40 },

  // Đăng nhập
  loginContainer: { flex: 1, backgroundColor: '#003366' },
  loginHeader: { alignItems: 'center', paddingTop: 60, paddingBottom: 30 },
  logoCircleSmall: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  logoTextSmall: { fontSize: 14, fontWeight: 'bold', color: '#003366' },
  loginTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  loginForm: { flex: 1, backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 25 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, marginTop: 15 },
  input: { backgroundColor: '#f5f5f5', borderRadius: 10, padding: 15, fontSize: 16, borderWidth: 1, borderColor: '#e0e0e0' },
  loginButton: { backgroundColor: '#003366', borderRadius: 10, padding: 15, alignItems: 'center', marginTop: 25 },
  loginButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  hint: { textAlign: 'center', color: '#999', marginTop: 15, fontSize: 12 },

  // Container chung
  screenContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  headerBar: { backgroundColor: '#003366', padding: 15 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Tab
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#003366' },
  tabText: { fontSize: 12, color: '#666' },
  activeTabText: { color: '#003366', fontWeight: 'bold' },

  // Tìm kiếm
  searchInput: { backgroundColor: '#fff', margin: 15, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0' },

  // Danh sách
  listContainer: { padding: 15, flexGrow: 1 },

  // Đang tải
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 },
  loadingText: { marginTop: 10, color: '#666', fontSize: 14 },

  // Trống
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 },
  emptyText: { marginTop: 10, color: '#999', fontSize: 16 },

  // Lỗi
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 },
  errorText: { marginTop: 10, color: '#e74c3c', fontSize: 16, textAlign: 'center' },
  retryButton: { marginTop: 20, backgroundColor: '#003366', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  retryButtonText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  // Thẻ thông báo
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 15, marginBottom: 12, elevation: 3, flexDirection: 'row', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  cardIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#e3f2fd', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8, lineHeight: 20 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap' },
  cardSender: { fontSize: 11, color: '#666' },
  cardDate: { fontSize: 11, color: '#003366', fontWeight: '500' },

  // Thông tin cá nhân
  profileHeader: { backgroundColor: '#003366', alignItems: 'center', padding: 30 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 40 },
  profileName: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginTop: 15 },
  profileMssv: { fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 5 },
  infoCard: { backgroundColor: '#fff', margin: 15, borderRadius: 10, padding: 15, elevation: 2 },
  infoRow: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  infoLabel: { fontSize: 12, color: '#999' },
  infoValue: { fontSize: 15, color: '#333', marginTop: 4 },

  // Schedule
  semesterInfo: { textAlign: 'center', padding: 10, color: '#666', backgroundColor: '#fff' },
  scheduleCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 10, marginBottom: 0, borderRadius: 10, overflow: 'hidden', elevation: 2 },
  scheduleDay: { backgroundColor: '#003366', padding: 15, justifyContent: 'center', width: 80 },
  scheduleDayText: { color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 12 },
  scheduleInfo: { flex: 1, padding: 15 },
  scheduleSubject: { fontSize: 14, fontWeight: '600', color: '#333' },
  scheduleDetail: { fontSize: 12, color: '#666', marginTop: 5 },

  // Xem điểm (Mới)
  gpaCard: { backgroundColor: '#fff', margin: 16, padding: 15, borderRadius: 12, elevation: 3 },
  gpaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gpaLabel: { color: '#666', fontSize: 13, marginBottom: 4 },
  gpaValue: { color: '#003366', fontSize: 20, fontWeight: 'bold' },

  semesterCard: { backgroundColor: '#fff', marginHorizontal: 16, marginBottom: 12, borderRadius: 12, elevation: 2, overflow: 'hidden' },
  semesterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#f8f9fa' },
  semesterTitle: { fontSize: 15, fontWeight: 'bold', color: '#333' },
  semesterGpa: { fontSize: 13, color: '#003366', marginTop: 2, fontWeight: '500' },
  semesterContent: { padding: 10, borderTopWidth: 1, borderTopColor: '#eee' },

  gradeItem: { flexDirection: 'column', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  gradeMainInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  gradeSubject: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1, marginRight: 10 },
  gradeCredits: { fontSize: 12, color: '#888', marginTop: 2 },
  gradeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, minWidth: 35, alignItems: 'center' },
  gradeBadgeText: { color: '#fff', fontSize: 13, fontWeight: 'bold' },
  gradeDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#f9f9f9', paddingHorizontal: 5 },
  gradeDetailText: { fontSize: 12, color: '#555' },

  // Exam Schedule
  examCard: { backgroundColor: '#fff', margin: 15, marginBottom: 0, borderRadius: 12, padding: 15, elevation: 2 },
  examHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  examSubject: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },
  examBadge: { backgroundColor: '#e74c3c', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  examBadgeText: { color: '#fff', fontSize: 11, fontWeight: 'bold' },
  examDetails: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  examDetail: { fontSize: 13, color: '#666' },

  // Dashboard
  dashboardHeader: { backgroundColor: '#003366', padding: 25, paddingTop: 40 },
  dashboardWelcome: { color: 'rgba(255,255,255,0.8)', fontSize: 16 },
  dashboardName: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  dashboardMssv: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 5 },
  statsContainer: { flexDirection: 'row', margin: 15, gap: 10 },
  statCard: { flex: 1, backgroundColor: '#fff', padding: 15, borderRadius: 12, alignItems: 'center', elevation: 2 },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#003366' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 5, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#333', marginHorizontal: 15, marginTop: 10, marginBottom: 10 },
  quickLinks: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 10 },
  quickLink: { width: '25%', alignItems: 'center', padding: 10 },
  quickLinkIcon: { fontSize: 28 },
  quickLinkText: { fontSize: 11, color: '#666', marginTop: 5, textAlign: 'center' },
  dashboardTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  logoutButton: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  logoutButtonText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  settingsContainer: { backgroundColor: '#fff', margin: 15, borderRadius: 12, elevation: 2 },
  settingsItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  settingsIcon: { fontSize: 20, marginRight: 15 },
  settingsText: { flex: 1, fontSize: 15, color: '#333' },
  settingsArrow: { fontSize: 20, color: '#ccc' },

  // Tuition
  tuitionCard: { backgroundColor: '#fff', margin: 15, marginBottom: 0, borderRadius: 12, padding: 15, elevation: 2 },
  tuitionSemester: { fontSize: 15, fontWeight: '600', color: '#003366', marginBottom: 15 },
  tuitionRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  tuitionLabel: { fontSize: 14, color: '#666' },
  tuitionValue: { fontSize: 14, color: '#333' },
  tuitionLabelBold: { fontSize: 14, color: '#333', fontWeight: '600' },
  tuitionValueBold: { fontSize: 16, color: '#003366', fontWeight: 'bold' },
  tuitionDivider: { height: 1, backgroundColor: '#e0e0e0', marginVertical: 10 },
  tuitionStatus: { padding: 12, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  tuitionStatusText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },

  // Training Points
  trainingAvg: { backgroundColor: '#003366', margin: 15, padding: 20, borderRadius: 12, alignItems: 'center' },
  trainingAvgLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  trainingAvgValue: { color: '#fff', fontSize: 36, fontWeight: 'bold', marginTop: 5 },
  trainingAvgRank: { color: '#4CAF50', fontSize: 14, fontWeight: '600', marginTop: 5 },
  trainingCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 15, marginTop: 0, borderRadius: 12, padding: 15, elevation: 2, alignItems: 'center' },
  trainingInfo: { flex: 1 },
  trainingSemester: { fontSize: 14, fontWeight: '600', color: '#333' },
  trainingRank: { fontSize: 12, color: '#4CAF50', marginTop: 4 },
  trainingScore: { flexDirection: 'row', alignItems: 'baseline' },
  trainingPoints: { fontSize: 24, fontWeight: 'bold', color: '#003366' },
  trainingMax: { fontSize: 14, color: '#999' },

  // Curriculum
  curriculumSummary: { backgroundColor: '#003366', margin: 15, padding: 20, borderRadius: 12 },
  curriculumTotal: { color: '#fff', fontSize: 14, textAlign: 'center' },
  progressBar: { height: 10, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 5, marginTop: 10 },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 5 },
  curriculumPercent: { color: 'rgba(255,255,255,0.8)', fontSize: 12, textAlign: 'center', marginTop: 8 },
  curriculumCard: { backgroundColor: '#fff', margin: 15, marginTop: 0, borderRadius: 12, padding: 15, elevation: 2 },
  curriculumHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  curriculumSemester: { fontSize: 15, fontWeight: '600', color: '#003366' },
  curriculumCredits: { fontSize: 13, color: '#4CAF50', fontWeight: '600' },
  curriculumSubject: { fontSize: 13, color: '#666', paddingVertical: 4 },

  // More Menu
  moreMenuGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10 },
  moreMenuItem: { width: '50%', padding: 10 },
  moreMenuItemInner: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center', elevation: 2 },
  moreMenuIcon: { fontSize: 32 },
  moreMenuText: { fontSize: 12, color: '#666', marginTop: 8, textAlign: 'center' },

  // Attendance
  attendanceCard: { backgroundColor: '#fff', margin: 15, marginBottom: 0, borderRadius: 12, padding: 15, elevation: 2 },
  attendanceSubject: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 10 },
  attendanceStats: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  attendanceStat: { alignItems: 'center' },
  attendanceNumber: { fontSize: 20, fontWeight: 'bold', color: '#003366' },
  attendanceLabel: { fontSize: 11, color: '#666' },
  attendanceProgress: { height: 6, backgroundColor: '#e0e0e0', borderRadius: 3 },
  attendanceProgressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 3 },

  // English Grades
  englishSummary: { backgroundColor: '#003366', margin: 15, padding: 20, borderRadius: 12, alignItems: 'center' },
  englishSummaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  englishSummaryValue: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginTop: 5 },
  englishSummaryStatus: { color: '#4CAF50', fontSize: 14, marginTop: 5 },
  englishCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 15, marginTop: 0, borderRadius: 12, padding: 15, elevation: 2 },
  englishInfo: { flex: 1 },
  englishType: { fontSize: 15, fontWeight: '600', color: '#333' },
  englishDate: { fontSize: 12, color: '#666', marginTop: 4 },
  englishScore: { alignItems: 'flex-end' },
  englishScoreText: { fontSize: 20, fontWeight: 'bold', color: '#003366' },
  englishStatus: { fontSize: 11, color: '#4CAF50', marginTop: 4 },

  // Course Registration
  regInfo: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#fff' },
  regInfoText: { fontSize: 13, color: '#666' },
  courseCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 15, marginTop: 0, borderRadius: 12, padding: 15, elevation: 2, alignItems: 'center' },
  courseCardSelected: { backgroundColor: '#e3f2fd', borderColor: '#003366', borderWidth: 2 },
  courseCheckbox: { marginRight: 10 },
  courseInfo: { flex: 1 },
  courseCode: { fontSize: 12, color: '#003366', fontWeight: '600' },
  courseName: { fontSize: 14, fontWeight: '600', color: '#333', marginTop: 2 },
  courseDetails: { fontSize: 11, color: '#666', marginTop: 4 },
  courseStatus: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  courseStatusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  regButton: { backgroundColor: '#003366', margin: 15, padding: 15, borderRadius: 10, alignItems: 'center' },
  regButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  // Graduation
  gradStatus: { backgroundColor: '#003366', margin: 15, padding: 25, borderRadius: 12, alignItems: 'center' },
  gradStatusTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 10 },
  gradStatusValue: { color: '#FFC107', fontSize: 16, fontWeight: 'bold', marginTop: 5 },
  gradChecklist: { backgroundColor: '#fff', margin: 15, marginTop: 0, borderRadius: 12, padding: 15, elevation: 2 },
  gradChecklistTitle: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 15 },
  gradCheckItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  gradCheckText: { fontSize: 14, color: '#333', marginLeft: 10, flex: 1 },

  // Forms
  formsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: 10 },
  formCard: { width: '50%', padding: 5 },
  formCardInner: { backgroundColor: '#fff', borderRadius: 12, padding: 15, alignItems: 'center', elevation: 2 },
  formIcon: { fontSize: 32 },
  formName: { fontSize: 12, color: '#333', textAlign: 'center', marginTop: 8 },
  formAction: { fontSize: 11, color: '#003366', marginTop: 5 },

  // Decisions
  decisionCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 15, marginTop: 0, borderRadius: 12, padding: 15, elevation: 2 },
  decisionIcon: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#e3f2fd', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  decisionInfo: { flex: 1 },
  decisionTitle: { fontSize: 14, fontWeight: '600', color: '#333' },
  decisionMeta: { fontSize: 12, color: '#666', marginTop: 4 },

  // Announcement Detail
  detailHeader: { backgroundColor: '#fff', padding: 20, borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  detailTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', lineHeight: 26, marginBottom: 15 },
  detailMeta: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 15 },
  detailMetaItem: { fontSize: 14, color: '#666', marginBottom: 8 },
  detailContent: { backgroundColor: '#fff', margin: 15, padding: 20, borderRadius: 12, elevation: 3 },
  detailContentLabel: { fontSize: 14, fontWeight: 'bold', color: '#003366', marginBottom: 10 },
  detailContentText: { fontSize: 15, color: '#333', lineHeight: 24 },
});

export default App;
