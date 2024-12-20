import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserData, clearUserData, getAuthToken } from '../api/api';
import Sidebar from '../components/Sidebar';
import { StackNavigationProp } from '@react-navigation/stack';

// Define types for navigation and user
type RootStackParamList = {
  Login: undefined;
  Account: undefined;
  Settings: undefined;
};

type NavigationProp = StackNavigationProp<RootStackParamList>;

interface User {
  name: string;
  email: string;
}

// API function for logging out
const logoutApiCall = async () => {
  const apiUrl = 'https://at.realvictorygroups.xyz/api/logout';

  try {
    const token = await getAuthToken(); // Retrieve token from AsyncStorage
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorResponse = await response.text();
      throw new Error(`Logout failed: ${errorResponse}`);
    }

    console.log('Logout successful');
  } catch (error: any) {
    console.error('Logout error:', error);
    throw new Error(error.message || 'Error during logout');
  }
};

const Header: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation<NavigationProp>();

  // Fetch user data from AsyncStorage on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await getAuthToken();
        console.log('Token:', token);

        if (token) {
          const storedUser = await getUserData();
          console.log('User Data:', storedUser);

          if (storedUser) {
            setUser(storedUser);
          } else {
            console.log('No user data found.');
          }
        } else {
          console.log('No token found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  // Function to open the sidebar (drawer)
  const openSidebar = () => {
    navigation.openDrawer(); // This will open the drawer/sidebar
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutApiCall(); // Call API to logout
      await clearUserData(); // Clear user data and token from AsyncStorage

      // Reset the navigation stack and navigate to 'Login' screen
      navigation.reset({
        index: 0, // Set the first screen in the stack
        routes: [{ name: 'Login' }], // Navigate to the Login screen
      });
    } catch (error) {
      console.error('Error during logout:', error);
      // Optionally show a message to the user
    }
  };

  return (
    <View className="w-full flex-row items-center justify-between bg-teal-600 p-4 border-b border-teal-500 shadow-md">
      {/* Left Section with Hamburger Icon and Title */}
      <View className="flex-row items-center">
        <TouchableOpacity onPress={openSidebar} className="mr-4">
          <MaterialIcons name="menu" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-white">
          Real Vector Group
        </Text>
      </View>

      {/* Right Profile Section */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="flex-row items-center space-x-2"
      >
        <View className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center">
          <Text className="text-white font-bold">
            {user ? user.name.split(' ').map((n) => n[0]).join('') : '??'}
          </Text>
        </View>
        <MaterialIcons name="keyboard-arrow-down" size={24} color="white" />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1"
          onPress={() => setModalVisible(false)}
        >
          <View className="absolute top-20 right-4 bg-white rounded-lg shadow-lg p-4 w-60">
            {user && (
              <>
                <Text className="text-lg font-semibold text-teal-600 mb-2">
                  {user.name}
                </Text>
                <Text className="text-gray-600 text-sm mb-4">{user.email}</Text>
                <View className="border-b border-teal-300 mb-2"></View>
              </>
            )}
            <TouchableOpacity
              className="flex-row items-center space-x-3 mb-3"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Account');
              }}
            >
              <MaterialIcons name="person" size={22} color="#4A5568" />
              <Text className="text-gray-700 text-base">Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center space-x-3 mb-3"
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('Settings');
              }}
            >
              <MaterialIcons name="settings" size={22} color="#4A5568" />
              <Text className="text-gray-700 text-base">Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center space-x-3"
              onPress={() => {
                setModalVisible(false);
                handleLogout();
              }}
            >
              <MaterialIcons name="logout" size={22} color="#E53E3E" />
              <Text className="text-red-500 text-base">Logout</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default Header;