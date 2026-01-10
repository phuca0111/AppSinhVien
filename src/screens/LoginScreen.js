import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { getUserByCredentials } from '../database/database';

const LoginScreen = ({ navigation }) => {
    const [mssv, setMssv] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Validate input
        if (!mssv.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập MSSV');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
            return;
        }

        setLoading(true);

        try {
            const user = await getUserByCredentials(mssv.trim(), password);

            if (user) {
                // Đăng nhập thành công
                navigation.replace('Main', { user });
            } else {
                Alert.alert('Lỗi', 'MSSV hoặc mật khẩu không đúng');
            }
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng nhập');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <StatusBar backgroundColor="#003366" barStyle="light-content" />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled">

                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Text style={styles.logoText}>HCMUTE</Text>
                    </View>
                    <Text style={styles.title}>ĐĂNG NHẬP</Text>
                    <Text style={styles.subtitle}>Hệ thống thông tin sinh viên</Text>
                </View>

                {/* Form */}
                <View style={styles.formContainer}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mã số sinh viên</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập MSSV"
                            placeholderTextColor="#999"
                            value={mssv}
                            onChangeText={setMssv}
                            keyboardType="numeric"
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Mật khẩu</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nhập mật khẩu"
                            placeholderTextColor="#999"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        style={[styles.loginButton, loading && styles.loginButtonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}>
                        <Text style={styles.loginButtonText}>
                            {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>
                        © 2026 Trường ĐH Sư phạm Kỹ thuật TP.HCM
                    </Text>
                    <Text style={styles.hintText}>
                        Tài khoản demo: 24810014 / 123456
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003366',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logoCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#003366',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 8,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
        color: '#333',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    loginButton: {
        backgroundColor: '#003366',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonDisabled: {
        backgroundColor: '#666',
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPassword: {
        alignItems: 'center',
        marginTop: 15,
    },
    forgotPasswordText: {
        color: '#003366',
        fontSize: 14,
    },
    footer: {
        marginTop: 40,
        alignItems: 'center',
    },
    footerText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 12,
    },
    hintText: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 11,
        marginTop: 10,
        fontStyle: 'italic',
    },
});

export default LoginScreen;
