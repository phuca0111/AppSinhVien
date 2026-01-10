import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DrawerNavigator from './DrawerNavigator';
import AnnouncementDetailScreen from '../screens/AnnouncementDetailScreen';

const Stack = createStackNavigator();

const StackNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
                headerShown: false,
            }}>

            <Stack.Screen
                name="Splash"
                component={SplashScreen}
            />

            <Stack.Screen
                name="Login"
                component={LoginScreen}
            />

            <Stack.Screen
                name="Main"
                component={DrawerNavigator}
            />

            <Stack.Screen
                name="AnnouncementDetail"
                component={AnnouncementDetailScreen}
                options={{
                    headerShown: true,
                    headerTitle: 'Chi tiết thông báo',
                    headerStyle: {
                        backgroundColor: '#003366',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />

        </Stack.Navigator>
    );
};

export default StackNavigator;
