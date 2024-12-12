import React from 'react';
import { View, Text, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialIcons';
import HomeScreen from '../screens/HomeScreen';
import CheckInScreen from '../screens/CheckInScreen';
import CheckOutScreen from '../screens/CheckOutScreen';
import AttendanceRecord from '../screens/AttendanceRecord';
import MonthlyAttendanceRecords from '../screens/MonthlyAttendanceRecords';
import ReportsScreen from '../screens/ReportsScreen';
import TakeBreakScreen from '../screens/TakeBreakScreen';
import LeaveScreen from '../screens/LeaveScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';
import AccountScreen from '../screens/AccountScreen';

const Drawer = createDrawerNavigator();

const Sidebar = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#008080', // Set drawer background color to teal
          width: 280, // Increased width of the drawer
        },
        drawerLabelStyle: {
          color: 'white', // Set text color to white
          fontSize: 18, // Increased font size for better readability
          fontWeight: 'bold', // Make the text bold
        },
        headerStyle: {
          backgroundColor: '#008080', // Set the header background color
        },
        headerTintColor: 'white', // Set header text color to white
        drawerActiveBackgroundColor: '#006666', // Set active drawer background color
        drawerInactiveTintColor: 'white', // Set color of inactive items
        drawerActiveTintColor: 'white', // Set color of active items
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={AppTabs}
        options={{
          drawerLabel: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/3.jpg' }}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 8 }}
              />
              <Text style={{ color: 'white', fontSize: 20 }}>Mayank Sharma</Text>
            </View>
          ),
        }}
      />
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        options={{
          drawerIcon: ({ size }) => <Icon name="home" size={size} color="white" />,
        }}
      />
      <Drawer.Screen
        name="Check-In"
        component={CheckInScreen}
        options={{
          drawerIcon: ({ size }) => <Icon name="login" size={size} color="white" />,
        }}
      />
      <Drawer.Screen
        name="Check-Out"
        component={CheckOutScreen}
        options={{
          drawerIcon: ({ size }) => <Icon name="logout" size={size} color="white" />,
        }}
      />
      <Drawer.Screen
        name="Records"
        component={AttendanceRecord}
        options={{
          drawerIcon: ({ size }) => <Icon name="history" size={size} color="white" />,
        }}
      />
      <Drawer.Screen
        name="MonthlyAttendanceRecords"
        component={MonthlyAttendanceRecords}
        options={{
          drawerIcon: ({ size }) => <Icon name="calendar-today" size={size} color="white" />,
        }}
      />
      <Drawer.Screen
        name="ReportsScreen"
        component={ReportsScreen}
        options={{
          drawerIcon: ({ size }) => <Icon name="calendar-today" size={size} color="white" />,
        }}
      />
      <Drawer.Screen
        name="Take-Break"
        component={TakeBreakScreen}
        options={{
          drawerIcon: ({ size }) => <Icon name="local-cafe" size={size} color="white" />,
        }}
      />
      <Drawer.Screen
        name="Leave"
        component={LeaveScreen}
        options={{
          drawerIcon: ({ size }) => <Icon name="beach-access" size={size} color="white" />,
        }}
      />
      <Drawer.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{
          drawerIcon: ({ size }) => <Icon name="notifications" size={size} color="white" />,
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          drawerIcon: ({ size }) => <Icon name="settings" size={size} color="white" />,
        }}
      />
      <Drawer.Screen
        name="Account"
        component={AccountScreen}
        options={{
          drawerIcon: ({ size }) => <Icon name="account-circle" size={size} color="white" />,
        }}
      />
    </Drawer.Navigator>
  );
};

export default Sidebar;
