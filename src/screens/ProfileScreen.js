import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ProfileScreen = ({ route }) => {
    const user = route.params?.user;

    const InfoRow = ({ icon, label, value }) => (
        <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
                <Icon name={icon} size={22} color="#003366" />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={styles.infoValue}>{value || 'Chưa cập nhật'}</Text>
            </View>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
                <View style={styles.avatarContainer}>
                    <View style={styles.avatar}>
                        <Icon name="person" size={60} color="#fff" />
                    </View>
                </View>
                <Text style={styles.userName}>{user?.ho_ten || 'Sinh viên'}</Text>
                <Text style={styles.userMssv}>MSSV: {user?.mssv || '---'}</Text>
                <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>Còn học</Text>
                </View>
            </View>

            {/* Info Section */}
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>

                <View style={styles.infoCard}>
                    <InfoRow
                        icon="badge"
                        label="Mã số sinh viên"
                        value={user?.mssv}
                    />
                    <InfoRow
                        icon="person"
                        label="Họ và tên"
                        value={user?.ho_ten}
                    />
                    <InfoRow
                        icon="class"
                        label="Lớp"
                        value={user?.lop}
                    />
                    <InfoRow
                        icon="school"
                        label="Khoa"
                        value={user?.khoa}
                    />
                    <InfoRow
                        icon="email"
                        label="Email"
                        value={user?.email}
                    />
                </View>
            </View>

            {/* Academic Info */}
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Thông tin học tập</Text>

                <View style={styles.infoCard}>
                    <InfoRow
                        icon="calendar-today"
                        label="Niên khóa"
                        value="2024 - 2028"
                    />
                    <InfoRow
                        icon="book"
                        label="Hệ đào tạo"
                        value="Đại học chính quy"
                    />
                    <InfoRow
                        icon="timer"
                        label="Học kỳ hiện tại"
                        value="Học kỳ 2 - Năm 2"
                    />
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    avatarSection: {
        backgroundColor: '#003366',
        alignItems: 'center',
        paddingVertical: 30,
        paddingBottom: 40,
    },
    avatarContainer: {
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 5,
    },
    userMssv: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 10,
    },
    statusBadge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    infoSection: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 10,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#e8f0fe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
});

export default ProfileScreen;
