import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    StatusBar,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const SplashScreen = ({ navigation }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const scaleAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        // Animation fade in và scale
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                tension: 10,
                friction: 2,
                useNativeDriver: true,
            }),
        ]).start();

        // Chuyển sang màn hình Login sau 3 giây
        const timer = setTimeout(() => {
            navigation.replace('Login');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigation, fadeAnim, scaleAnim]);

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#003366" barStyle="light-content" />

            <Animated.View
                style={[
                    styles.logoContainer,
                    {
                        opacity: fadeAnim,
                        transform: [{ scale: scaleAnim }],
                    },
                ]}>
                {/* Logo placeholder - sẽ thay bằng ảnh thật */}
                <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>HCMUTE</Text>
                </View>

                <Text style={styles.schoolName}>
                    TRƯỜNG ĐẠI HỌC SƯ PHẠM KỸ THUẬT
                </Text>
                <Text style={styles.schoolNameSub}>TP. HỒ CHÍ MINH</Text>
            </Animated.View>

            <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
                <Text style={styles.appName}>App Sinh Viên</Text>
                <Text style={styles.version}>Phiên bản 1.0.0</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#003366',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
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
        fontSize: 20,
        fontWeight: 'bold',
        color: '#003366',
    },
    schoolName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 10,
    },
    schoolNameSub: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        marginTop: 5,
    },
    footer: {
        position: 'absolute',
        bottom: 50,
        alignItems: 'center',
    },
    appName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    version: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.7)',
        marginTop: 5,
    },
});

export default SplashScreen;
