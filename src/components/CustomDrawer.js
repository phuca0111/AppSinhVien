import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItemList,
} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomDrawer = (props) => {
    const { user } = props;

    return (
        <View style={styles.container}>
            {/* Header với thông tin user */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <View style={styles.logo}>
                        <Text style={styles.logoText}>HCMUTE</Text>
                    </View>
                </View>
                <Text style={styles.schoolName}>TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT TP.HCM</Text>

                <View style={styles.userInfo}>
                    <View style={styles.avatar}>
                        <Icon name="person" size={30} color="#fff" />
                    </View>
                    <View style={styles.userText}>
                        <Text style={styles.userName}>{user?.ho_ten || 'Sinh viên'}</Text>
                        <Text style={styles.userMssv}>SV/HV/NCS: {user?.mssv || '---'}</Text>
                        <Text style={styles.userStatus}>(Còn học)</Text>
                    </View>
                </View>
            </View>

            {/* Menu Items */}
            <DrawerContentScrollView {...props} contentContainerStyle={styles.menuContainer}>
                <View style={styles.menuSection}>
                    <Text style={styles.sectionTitle}>TRANG CÁ NHÂN</Text>
                    <DrawerItemList {...props} />
                </View>
            </DrawerContentScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    })}>
                    <Icon name="logout" size={20} color="#fff" />
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#003366',
        padding: 20,
        paddingTop: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    logo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#003366',
    },
    schoolName: {
        color: '#fff',
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 15,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 10,
        borderRadius: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userText: {
        flex: 1,
    },
    userName: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    userMssv: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 12,
        marginTop: 2,
    },
    userStatus: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 11,
        marginTop: 2,
    },
    menuContainer: {
        paddingTop: 10,
    },
    menuSection: {
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#003366',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#f5f5f5',
        marginBottom: 5,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        padding: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#d32f2f',
        padding: 12,
        borderRadius: 8,
    },
    logoutText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default CustomDrawer;
