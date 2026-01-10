import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getGrades } from '../database/database';

const GradesScreen = ({ route }) => {
    const user = route.params?.user;
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [gpa, setGpa] = useState(0);

    useEffect(() => {
        loadGrades();
    }, []);

    const loadGrades = async () => {
        try {
            if (user?.id) {
                const data = await getGrades(user.id);
                setGrades(data);
                calculateGPA(data);
            }
        } catch (error) {
            console.error('Error loading grades:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateGPA = (data) => {
        if (data.length === 0) {
            setGpa(0);
            return;
        }

        let totalPoints = 0;
        let totalCredits = 0;

        data.forEach((item) => {
            const point = convertToGPA(item.diem_tong_ket);
            totalPoints += point * item.so_tin_chi;
            totalCredits += item.so_tin_chi;
        });

        const calculatedGPA = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
        setGpa(calculatedGPA);
    };

    const convertToGPA = (score) => {
        if (score >= 9.0) return 4.0;
        if (score >= 8.5) return 3.7;
        if (score >= 8.0) return 3.5;
        if (score >= 7.0) return 3.0;
        if (score >= 6.5) return 2.5;
        if (score >= 5.5) return 2.0;
        if (score >= 5.0) return 1.5;
        if (score >= 4.0) return 1.0;
        return 0;
    };

    const getGradeColor = (grade) => {
        switch (grade) {
            case 'A+':
            case 'A':
                return '#4CAF50';
            case 'B+':
            case 'B':
                return '#2196F3';
            case 'C+':
            case 'C':
                return '#FF9800';
            case 'D+':
            case 'D':
                return '#FF5722';
            default:
                return '#f44336';
        }
    };

    const renderGradeItem = ({ item, index }) => (
        <View style={styles.gradeCard}>
            <View style={styles.gradeIndex}>
                <Text style={styles.indexText}>{index + 1}</Text>
            </View>
            <View style={styles.gradeInfo}>
                <Text style={styles.subjectName}>{item.mon_hoc}</Text>
                <Text style={styles.credits}>{item.so_tin_chi} tín chỉ</Text>
            </View>
            <View style={styles.gradeScores}>
                <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>GK:</Text>
                    <Text style={styles.scoreValue}>{item.diem_giua_ky}</Text>
                </View>
                <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>CK:</Text>
                    <Text style={styles.scoreValue}>{item.diem_cuoi_ky}</Text>
                </View>
                <View style={styles.scoreRow}>
                    <Text style={styles.scoreLabel}>TK:</Text>
                    <Text style={[styles.scoreValue, styles.finalScore]}>{item.diem_tong_ket}</Text>
                </View>
            </View>
            <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(item.diem_chu) }]}>
                <Text style={styles.gradeText}>{item.diem_chu}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#003366" />
                <Text style={styles.loadingText}>Đang tải điểm...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>BẢNG ĐIỂM</Text>
                <Text style={styles.headerSubtitle}>Năm học 2025-2026</Text>
            </View>

            {/* GPA Summary */}
            <View style={styles.gpaSummary}>
                <View style={styles.gpaCard}>
                    <Icon name="school" size={40} color="#003366" />
                    <View style={styles.gpaInfo}>
                        <Text style={styles.gpaLabel}>Điểm trung bình tích lũy (GPA)</Text>
                        <Text style={styles.gpaValue}>{gpa} / 4.0</Text>
                    </View>
                </View>
                <View style={styles.statsRow}>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>{grades.length}</Text>
                        <Text style={styles.statLabel}>Môn học</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {grades.reduce((sum, g) => sum + g.so_tin_chi, 0)}
                        </Text>
                        <Text style={styles.statLabel}>Tín chỉ</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statValue}>
                            {grades.filter(g => g.diem_tong_ket >= 5).length}
                        </Text>
                        <Text style={styles.statLabel}>Đạt</Text>
                    </View>
                </View>
            </View>

            {/* Grades List */}
            <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Chi tiết điểm các môn</Text>
            </View>

            <FlatList
                data={grades}
                renderItem={renderGradeItem}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="assignment" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>Chưa có điểm</Text>
                    </View>
                }
            />
        </View>
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
    gpaSummary: {
        backgroundColor: '#fff',
        margin: 15,
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    gpaCard: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    gpaInfo: {
        marginLeft: 15,
        flex: 1,
    },
    gpaLabel: {
        fontSize: 12,
        color: '#666',
    },
    gpaValue: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#003366',
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 15,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    listHeader: {
        paddingHorizontal: 15,
        paddingBottom: 10,
    },
    listTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#003366',
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    gradeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    gradeIndex: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#e8f0fe',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
    },
    indexText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#003366',
    },
    gradeInfo: {
        flex: 1,
    },
    subjectName: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    credits: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    gradeScores: {
        marginRight: 10,
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 60,
    },
    scoreLabel: {
        fontSize: 11,
        color: '#999',
    },
    scoreValue: {
        fontSize: 11,
        color: '#333',
        fontWeight: '500',
    },
    finalScore: {
        fontWeight: 'bold',
        color: '#003366',
    },
    gradeBadge: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradeText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyText: {
        marginTop: 15,
        fontSize: 16,
        color: '#999',
    },
});

export default GradesScreen;
