import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import HomeScreen from './screens/HomeScreen';
import CheckInScreen from './screens/CheckInScreen';
import CheckOutScreen from './screens/CheckOutScreen';
import TakeBreakScreen from './screens/TakeBreakScreen';
import SalaryScreen from './screens/SalaryScreen';
import LeaveScreen from './screens/LeaveScreen';
import NotificationScreen from './screens/NotificationScreen';
import AttendanceRecord from './screens/AttendanceRecord';
import MonthlyAttendanceRecords from './screens/MonthlyAttendanceRecords';
import ReportsScreen from './screens/ReportsScreen';
import SettingScreen from './screens/SettingScreen';
import AccountScreen from './screens/AccountScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import MainPage from './components/MainPage';
import TestingScreen from './screens/TestingScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getUserData, clearUserData, getAuthToken } from './api/api';
import './global.css';

// Navigators
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Bottom Tab Navigator
const AppTabs: React.FC = () => (
  <Tab.Navigator
    screenOptions={{
      headerShown: false, // Hide headers globally
      tabBarStyle: { display: 'none' },
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Check-Out" component={CheckOutScreen} />
    <Tab.Screen name="Records" component={AttendanceRecord} />
    <Tab.Screen name="Account" component={AccountScreen} />
  </Tab.Navigator>
);

// Drawer Navigator wrapping the Tab Navigator
const AppDrawer: React.FC = () => (
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
      headerShown: false, // Hide the header in the drawer
      drawerActiveBackgroundColor: '#006666', // Set active drawer background color
      drawerInactiveTintColor: 'white', // Set color of inactive items
      drawerActiveTintColor: 'white', // Set color of active items
      transitionSpec: {
        open: { animation: 'spring', config: { stiffness: 1000, damping: 20 } },
        close: { animation: 'timing', config: { duration: 500 } },
      }, // Smooth transitions when opening and closing the drawer
    }}
  >
    <Drawer.Screen
      name="Dashboard"
      component={AppTabs}
      options={{
        drawerLabel: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 5 }}>
            <Image
              source={{ uri: 'https://randomuser.me/api/portraits/men/3.jpg' }} // Example user image
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
      name="Testing"
      component={TestingScreen}
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
      name="Salary"
      component={SalaryScreen}
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
    <Drawer.Screen
      name="Logout"
      component={HomeScreen}
      options={{
        drawerIcon: ({ size }) => <Icon name="exit-to-app" size={size} color="white" />,
        drawerLabel: 'Logout',
      }}
    />
  </Drawer.Navigator>
);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [hasVisitedMainPage, setHasVisitedMainPage] = useState(false); // Track MainPage visit

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <NavigationContainer>
          <Stack.Navigator>
            {/* MainPage will be the first screen */}
            {!hasVisitedMainPage && (
              <Stack.Screen name="MainPage" options={{ headerShown: false }}>
                {(props) => (
                  <MainPage {...props} onContinue={() => setHasVisitedMainPage(true)} />
                )}
              </Stack.Screen>
            )}

            {/* If the user is not logged in, show Login and Signup screens */}
            {!isLoggedIn && (
              <>
                <Stack.Screen name="Login" options={{ headerShown: false }}>
                  {(props) => <LoginScreen {...props} setIsLoggedIn={setIsLoggedIn} />}
                </Stack.Screen>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="Signup" 
                  component={SignupScreen} 
                />
              </>
            )}

            {/* If the user is logged in, show the main app screens */}
            {isLoggedIn && (
              <>
                <Stack.Screen
                  name="MainApp"
                  component={AppDrawer}
                  options={{ headerShown: false }}
                />
                {/* Add other app screens below */}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Check-In" component={CheckInScreen} />
                <Stack.Screen name="Check-Out" component={CheckOutScreen} />
                <Stack.Screen name="Take-Break" component={TakeBreakScreen} />
                <Stack.Screen name="Leave" component={LeaveScreen} />
                <Stack.Screen name="Notifications" component={NotificationScreen} />
                <Stack.Screen name="Settings" component={SettingScreen} />
                <Stack.Screen name="Account" component={AccountScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5', 
  },
});