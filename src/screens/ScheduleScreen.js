import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { getSchedule } from '../database/database';

const ScheduleScreen = ({ route }) => {
    const user = route.params?.user;
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(true);

    const days = ['', '', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
    const periods = [
        { start: 1, end: 3, time: '7:00 - 9:30' },
        { start: 4, end: 6, time: '9:45 - 12:00' },
        { start: 7, end: 9, time: '12:30 - 15:00' },
        { start: 10, end: 12, time: '15:15 - 17:30' },
        { start: 13, end: 15, time: '18:00 - 20:30' },
    ];

    useEffect(() => {
        loadSchedule();
    }, []);

    const loadSchedule = async () => {
        try {
            if (user?.id) {
                const data = await getSchedule(user.id);
                setSchedule(data);
            }
        } catch (error) {
            console.error('Error loading schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScheduleForDay = (dayIndex) => {
        return schedule.filter(item => item.thu === dayIndex);
    };

    const getPeriodText = (tietBatDau, tietKetThuc) => {
        return `Tiết ${tietBatDau} - ${tietKetThuc}`;
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#003366" />
                <Text style={styles.loadingText}>Đang tải lịch học...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>THỜI KHÓA BIỂU</Text>
                <Text style={styles.headerSubtitle}>Học kỳ 2 - Năm học 2025-2026</Text>
            </View>

            {/* Schedule Grid */}
            <View style={styles.scheduleContainer}>
                {[2, 3, 4, 5, 6, 7].map((dayIndex) => {
                    const daySchedule = getScheduleForDay(dayIndex);

                    return (
                        <View key={dayIndex} style={styles.dayContainer}>
                            <View style={styles.dayHeader}>
                                <Text style={styles.dayText}>{days[dayIndex]}</Text>
                            </View>

                            {daySchedule.length > 0 ? (
                                daySchedule.map((item, index) => (
                                    <View key={index} style={styles.classCard}>
                                        <View style={styles.classTime}>
                                            <Text style={styles.periodText}>
                                                {getPeriodText(item.tiet_bat_dau, item.tiet_ket_thuc)}
                                            </Text>
                                        </View>
                                        <View style={styles.classInfo}>
                                            <Text style={styles.className}>{item.mon_hoc}</Text>
                                            <Text style={styles.classDetail}>GV: {item.giang_vien}</Text>
                                            <Text style={styles.classDetail}>Phòng: {item.phong}</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <View style={styles.emptyDay}>
                                    <Text style={styles.emptyText}>Không có lịch</Text>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                <Text style={styles.legendTitle}>Ghi chú:</Text>
                <Text style={styles.legendText}>• Tiết 1-3: 7:00 - 9:30</Text>
                <Text style={styles.legendText}>• Tiết 4-6: 9:45 - 12:00</Text>
                <Text style={styles.legendText}>• Tiết 7-9: 12:30 - 15:00</Text>
                <Text style={styles.legendText}>• Tiết 10-12: 15:15 - 17:30</Text>
                <Text style={styles.legendText}>• Tiết 13-15: 18:00 - 20:30</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    header: {
        backgroundColor: '#003366',
        padding: 20,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 5,
    },
    scheduleContainer: {
        padding: 10,
    },
    dayContainer: {
        marginBottom: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    dayHeader: {
        backgroundColor: '#003366',
        padding: 12,
    },
    dayText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    classCard: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    classTime: {
        width: 100,
        backgroundColor: '#e8f0fe',
        padding: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    periodText: {
        fontSize: 12,
        color: '#003366',
        fontWeight: '600',
        textAlign: 'center',
    },
    classInfo: {
        flex: 1,
        padding: 12,
    },
    className: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    classDetail: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    emptyDay: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
    },
    legend: {
        margin: 15,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    legendTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 10,
    },
    legendText: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
});

export default ScheduleScreen;
