import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAnnouncements } from '../database/database';

const AnnouncementsScreen = ({ navigation }) => {
    const [announcements, setAnnouncements] = useState([]);
    const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [activeTab, setActiveTab] = useState('chung');

    useEffect(() => {
        loadAnnouncements();
    }, [activeTab]);

    useEffect(() => {
        filterAnnouncements();
    }, [searchText, announcements]);

    const loadAnnouncements = async () => {
        try {
            const data = await getAnnouncements(activeTab);
            setAnnouncements(data);
            setFilteredAnnouncements(data);
        } catch (error) {
            console.error('Error loading announcements:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const filterAnnouncements = () => {
        if (!searchText.trim()) {
            setFilteredAnnouncements(announcements);
        } else {
            const filtered = announcements.filter(item =>
                item.title.toLowerCase().includes(searchText.toLowerCase())
            );
            setFilteredAnnouncements(filtered);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadAnnouncements();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const renderAnnouncementCard = ({ item }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}>
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                    {item.title}
                </Text>
                <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                        <Icon name="person" size={14} color="#666" />
                        <Text style={styles.metaText}>{item.sender}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Icon name="access-time" size={14} color="#666" />
                        <Text style={styles.metaText}>{formatDate(item.created_at)}</Text>
                    </View>
                </View>
            </View>
            <Icon name="chevron-right" size={24} color="#ccc" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#003366" />
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Title */}
            <View style={styles.headerTitle}>
                <Text style={styles.headerTitleText}>THÔNG BÁO</Text>
            </View>

            {/* Tabs */}
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
                        THÔNG BÁO CÁ NHÂN
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchContainer}>
                <Icon name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm thông báo..."
                    placeholderTextColor="#999"
                    value={searchText}
                    onChangeText={setSearchText}
                />
                {searchText.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchText('')}>
                        <Icon name="close" size={20} color="#999" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Announcements List */}
            <FlatList
                data={filteredAnnouncements}
                renderItem={renderAnnouncementCard}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#003366']}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Icon name="notifications-off" size={60} color="#ccc" />
                        <Text style={styles.emptyText}>Không có thông báo nào</Text>
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
    headerTitle: {
        backgroundColor: '#003366',
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    headerTitleText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    tabContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    tab: {
        flex: 1,
        paddingVertical: 12,
        alignItems: 'center',
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },
    activeTab: {
        borderBottomColor: '#003366',
    },
    tabText: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    activeTabText: {
        color: '#003366',
        fontWeight: 'bold',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 15,
        paddingHorizontal: 15,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#333',
    },
    listContainer: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
        lineHeight: 20,
    },
    cardMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
        marginTop: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
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

export default AnnouncementsScreen;
