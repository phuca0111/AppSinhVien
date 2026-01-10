import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Header = ({ title, navigation, showBack = false, showMenu = true }) => {
    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#003366" barStyle="light-content" />

            <View style={styles.header}>
                {showMenu && !showBack && (
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => navigation.openDrawer()}>
                        <Icon name="menu" size={24} color="#fff" />
                    </TouchableOpacity>
                )}

                {showBack && (
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={() => navigation.goBack()}>
                        <Icon name="arrow-back" size={24} color="#fff" />
                    </TouchableOpacity>
                )}

                <View style={styles.titleContainer}>
                    <Text style={styles.title} numberOfLines={1}>{title}</Text>
                </View>

                <View style={styles.rightActions}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="notifications" size={22} color="#fff" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Icon name="account-circle" size={22} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#003366',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 10,
    },
    menuButton: {
        padding: 8,
    },
    titleContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    title: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    rightActions: {
        flexDirection: 'row',
    },
    iconButton: {
        padding: 8,
    },
});

export default Header;
