import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AnnouncementDetailScreen = ({ route }) => {
    const { announcement } = route.params;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>{announcement.title}</Text>

                <View style={styles.metaContainer}>
                    <View style={styles.metaItem}>
                        <Icon name="person" size={18} color="#003366" />
                        <Text style={styles.metaText}>{announcement.sender}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Icon name="access-time" size={18} color="#003366" />
                        <Text style={styles.metaText}>{formatDate(announcement.created_at)}</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Icon
                            name={announcement.type === 'ca_nhan' ? 'person-outline' : 'public'}
                            size={18}
                            color="#003366"
                        />
                        <Text style={styles.metaText}>
                            {announcement.type === 'ca_nhan' ? 'Thông báo cá nhân' : 'Thông báo chung'}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.contentContainer}>
                <Text style={styles.contentLabel}>Nội dung:</Text>
                <Text style={styles.content}>{announcement.content}</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        lineHeight: 26,
        marginBottom: 15,
    },
    metaContainer: {
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        paddingTop: 15,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    metaText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
    },
    contentContainer: {
        backgroundColor: '#fff',
        margin: 15,
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contentLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#003366',
        marginBottom: 10,
    },
    content: {
        fontSize: 15,
        color: '#333',
        lineHeight: 24,
    },
});

export default AnnouncementDetailScreen;
