import React, { useEffect, useState } from 'react';
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
} from 'react-native';

// ============ SPLASH SCREEN ============
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

// ============ LOGIN SCREEN ============
// Danh sách sinh viên
const usersData = [
  { id: 1, mssv: '24810014', password: '123456', ho_ten: 'Trần Phan Tấn Phúc', lop: '241280301', khoa: 'Công nghệ Thông tin', email: '24810014@student.hcmute.edu.vn' },
  { id: 2, mssv: '24810008', password: '123456', ho_ten: 'Nguyễn Giang Thái Khang', lop: '241280301', khoa: 'Công nghệ Thông tin', email: '24810008@student.hcmute.edu.vn' },
  { id: 3, mssv: '24810002', password: '123456', ho_ten: 'Hồ Vũ Hoàng Anh', lop: '241280301', khoa: 'Công nghệ Thông tin', email: '24810002@student.hcmute.edu.vn' },
];

const LoginScreen = ({ navigation }: any) => {
  const [mssv, setMssv] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (!mssv.trim() || !password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập MSSV và mật khẩu');
      return;
    }

    // Tìm user trong danh sách
    const user = usersData.find(u => u.mssv === mssv.trim() && u.password === password);

    if (user) {
      navigation.replace('Main', { user });
    } else {
      Alert.alert('Lỗi', 'MSSV hoặc mật khẩu không đúng');
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
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>Demo: 24810014 / 24810008 / 24810002 (MK: 123456)</Text>
      </View>
    </View>
  );
};

// ============ ANNOUNCEMENTS DATA ============
const announcementsData = [
  { id: '1', title: 'Thông báo về lịch thi kiểm tra trình độ tiếng Anh đầu ra đợt thi tháng 01/2025', sender: 'PDT_Phạm Thị Thùy Hạnh', date: '31/12/2025' },
  { id: '2', title: 'Thông báo chương trình Lễ tốt nghiệp tháng 01/2025', sender: 'PDT_Bùi Thị Quỳnh', date: '26/12/2025' },
  { id: '3', title: 'Thông báo Về việc nhận bằng tốt nghiệp Đại học hệ chính quy', sender: 'PDT_Bùi Thị Quỳnh', date: '17/11/2025' },
  { id: '4', title: 'Thông báo lịch thi kiểm tra trình độ tiếng Anh đầu ra đợt thi tháng 01/2025', sender: 'PDT_Phạm Thị Thùy Hạnh', date: '12/12/2025' },
  { id: '5', title: 'Thông báo v/v đăng ký thi kiểm tra trình độ tiếng Anh đầu ra', sender: 'PDT_Phạm Thị Thùy Hạnh', date: '12/12/2025' },
];

// ============ ANNOUNCEMENTS SCREEN ============
const AnnouncementsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('chung');

  const filteredData = announcementsData.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.cardTitle}>{item.title}</Text>
      <View style={styles.cardMeta}>
        <Text style={styles.cardSender}>{item.sender}</Text>
        <Text style={styles.cardDate}>{item.date}</Text>
      </View>
    </TouchableOpacity>
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
      />
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

// ============ PROFILE SCREEN ============
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

// ============ SCHEDULE SCREEN ============
const scheduleData = [
  { id: '1', day: 'Thứ 2', subject: 'Lập trình di động', room: 'A1-301', time: 'Tiết 1-3' },
  { id: '2', day: 'Thứ 2', subject: 'Cơ sở dữ liệu', room: 'A2-201', time: 'Tiết 4-6' },
  { id: '3', day: 'Thứ 3', subject: 'Mạng máy tính', room: 'B1-101', time: 'Tiết 1-3' },
  { id: '4', day: 'Thứ 4', subject: 'Trí tuệ nhân tạo', room: 'A3-401', time: 'Tiết 7-9' },
  { id: '5', day: 'Thứ 5', subject: 'Phát triển ứng dụng Web', room: 'A1-302', time: 'Tiết 1-3' },
  { id: '6', day: 'Thứ 6', subject: 'Thương mại điện tử', room: 'A2-301', time: 'Tiết 4-6' },
];

const ScheduleScreen = () => (
  <ScrollView style={styles.screenContainer}>
    <View style={styles.headerBar}>
      <Text style={styles.headerTitle}>📅 THỜI KHÓA BIỂU</Text>
    </View>
    <Text style={styles.semesterInfo}>Học kỳ 2 - Năm học 2025-2026</Text>
    {scheduleData.map((item) => (
      <View key={item.id} style={styles.scheduleCard}>
        <View style={styles.scheduleDay}>
          <Text style={styles.scheduleDayText}>{item.day}</Text>
        </View>
        <View style={styles.scheduleInfo}>
          <Text style={styles.scheduleSubject}>{item.subject}</Text>
          <Text style={styles.scheduleDetail}>📍 {item.room} | ⏰ {item.time}</Text>
        </View>
      </View>
    ))}
  </ScrollView>
);

// ============ GRADES SCREEN ============
const gradesData = [
  { id: '1', subject: 'Lập trình hướng đối tượng', credits: 3, score: 8.8, grade: 'A' },
  { id: '2', subject: 'Cấu trúc dữ liệu và giải thuật', credits: 3, score: 7.8, grade: 'B+' },
  { id: '3', subject: 'Hệ điều hành', credits: 3, score: 8.3, grade: 'A' },
  { id: '4', subject: 'Mạng máy tính', credits: 3, score: 7.3, grade: 'B' },
  { id: '5', subject: 'Lập trình Web', credits: 3, score: 9.3, grade: 'A+' },
  { id: '6', subject: 'Toán rời rạc', credits: 3, score: 6.8, grade: 'B' },
];

const GradesScreen = () => {
  const gpa = (gradesData.reduce((sum, g) => sum + g.score, 0) / gradesData.length).toFixed(2);

  return (
    <ScrollView style={styles.screenContainer}>
      <View style={styles.headerBar}>
        <Text style={styles.headerTitle}>📊 BẢNG ĐIỂM</Text>
      </View>
      <View style={styles.gpaCard}>
        <Text style={styles.gpaLabel}>Điểm trung bình tích lũy</Text>
        <Text style={styles.gpaValue}>{gpa} / 10</Text>
      </View>
      {gradesData.map((item) => (
        <View key={item.id} style={styles.gradeCard}>
          <View style={styles.gradeInfo}>
            <Text style={styles.gradeSubject}>{item.subject}</Text>
            <Text style={styles.gradeCredits}>{item.credits} tín chỉ</Text>
          </View>
          <View style={styles.gradeScore}>
            <Text style={styles.gradeScoreText}>{item.score}</Text>
            <View style={[styles.gradeBadge, { backgroundColor: item.grade.includes('A') ? '#4CAF50' : '#2196F3' }]}>
              <Text style={styles.gradeBadgeText}>{item.grade}</Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

// ============ TAB NAVIGATOR ============
const Tab = createBottomTabNavigator();

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
        tabBarLabelStyle: { fontSize: 11 },
      }}>
      <Tab.Screen
        name="Thông báo"
        component={AnnouncementsScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Thông báo',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📢</Text>,
        }}
      />
      <Tab.Screen
        name="Thời khóa biểu"
        component={ScheduleScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Lịch học',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text>,
        }}
      />
      <Tab.Screen
        name="Xem điểm"
        component={GradesScreen}
        options={{
          headerShown: false,
          tabBarLabel: 'Điểm',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📊</Text>,
        }}
      />
      <Tab.Screen
        name="Cá nhân"
        options={{
          headerShown: false,
          tabBarLabel: 'Cá nhân',
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}>
        {(props) => <ProfileScreen {...props} route={{ ...props.route, params: { user } }} />}
      </Tab.Screen>
    </Tab.Navigator>
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ============ STYLES ============
const styles = StyleSheet.create({
  // Splash
  splashContainer: { flex: 1, backgroundColor: '#003366', justifyContent: 'center', alignItems: 'center' },
  logoCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  logoText: { fontSize: 16, fontWeight: 'bold', color: '#003366' },
  splashTitle: { fontSize: 16, fontWeight: 'bold', color: '#fff', textAlign: 'center' },
  splashSubtitle: { fontSize: 14, color: '#fff', marginTop: 5 },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginTop: 40 },

  // Login
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

  // Screen
  screenContainer: { flex: 1, backgroundColor: '#f5f5f5' },
  headerBar: { backgroundColor: '#003366', padding: 15 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold' },

  // Tabs
  tabContainer: { flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: '#003366' },
  tabText: { fontSize: 12, color: '#666' },
  activeTabText: { color: '#003366', fontWeight: 'bold' },

  // Search
  searchInput: { backgroundColor: '#fff', margin: 15, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#e0e0e0' },

  // List
  listContainer: { padding: 15 },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 10, padding: 15, marginBottom: 10, elevation: 2 },
  cardTitle: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between' },
  cardSender: { fontSize: 12, color: '#666' },
  cardDate: { fontSize: 12, color: '#999' },

  // Profile
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

  // Grades
  gpaCard: { backgroundColor: '#003366', margin: 15, padding: 20, borderRadius: 10, alignItems: 'center' },
  gpaLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  gpaValue: { color: '#fff', fontSize: 32, fontWeight: 'bold', marginTop: 5 },
  gradeCard: { flexDirection: 'row', backgroundColor: '#fff', margin: 10, marginBottom: 0, borderRadius: 10, padding: 15, elevation: 2 },
  gradeInfo: { flex: 1 },
  gradeSubject: { fontSize: 14, fontWeight: '600', color: '#333' },
  gradeCredits: { fontSize: 12, color: '#666', marginTop: 4 },
  gradeScore: { alignItems: 'flex-end' },
  gradeScoreText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  gradeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginTop: 5 },
  gradeBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
});

export default App;
