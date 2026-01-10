import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';

import CustomDrawer from '../components/CustomDrawer';
import AnnouncementsScreen from '../screens/AnnouncementsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import GradesScreen from '../screens/GradesScreen';

const Drawer = createDrawerNavigator();

const DrawerNavigator = ({ route }) => {
    const user = route.params?.user;

    const screenOptions = {
        headerShown: false,
        drawerActiveBackgroundColor: '#e8f0fe',
        drawerActiveTintColor: '#003366',
        drawerInactiveTintColor: '#333',
        drawerLabelStyle: {
            fontSize: 14,
            marginLeft: -10,
        },
        drawerItemStyle: {
            borderRadius: 8,
            marginHorizontal: 10,
            marginVertical: 2,
        },
    };

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawer {...props} user={user} />}
            screenOptions={screenOptions}>

            <Drawer.Screen
                name="Thông báo"
                component={AnnouncementsScreen}
                initialParams={{ user }}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="notifications" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Thông tin cá nhân"
                component={ProfileScreen}
                initialParams={{ user }}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="person" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Thời khóa biểu"
                component={ScheduleScreen}
                initialParams={{ user }}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="calendar-today" size={size} color={color} />
                    ),
                }}
            />

            <Drawer.Screen
                name="Xem điểm"
                component={GradesScreen}
                initialParams={{ user }}
                options={{
                    drawerIcon: ({ color, size }) => (
                        <Icon name="grade" size={size} color={color} />
                    ),
                }}
            />

        </Drawer.Navigator>
    );
};

export default DrawerNavigator;
