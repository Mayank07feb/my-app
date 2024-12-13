import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserData, clearUserData, getAuthToken } from '../api/api'; 
import Sidebar from '../components/Sidebar';

const Header: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const navigation = useNavigation();

  // Fetch user data from AsyncStorage on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First, get the token from AsyncStorage
        const token = await getAuthToken();
        console.log('Token:', token); // Debugging log for token
        
        if (token) {
          // Fetch user data only if token is available
          const storedUser = await getUserData();
          console.log('User Data:', storedUser); // Debugging log for user data
          
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
    await clearUserData(); // Clear user data and token from AsyncStorage
    navigation.replace('Login'); // Navigate to Login screen
  };

  return (
    <View className="w-full flex-row items-center justify-between bg-teal-600 p-4 border-b border-teal-500 shadow-md mt-10">
      {/* Left Section with Hamburger Icon and Title */}
      <View className="flex-row items-center">
        {/* Hamburger Icon for Sidebar */}
        <TouchableOpacity onPress={openSidebar} className="mr-4">
          <MaterialIcons name="menu" size={28} color="white" />
        </TouchableOpacity>

        {/* Logo and Title */}
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
          {/* Show user's initials or first two letters of their name */}
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
                {/* User Info */}
                <Text className="text-lg font-semibold text-teal-600 mb-2">
                  {user.name}
                </Text>
                <Text className="text-gray-600 text-sm mb-4">{user.email}</Text>
                <View className="border-b border-teal-300 mb-2"></View>
              </>
            )}
            {/* Options */}
            <TouchableOpacity
              className="flex-row items-center space-x-3 mb-3"
              onPress={() => navigation.navigate('Account')}
            >
              <MaterialIcons name="person" size={22} color="#4A5568" />
              <Text className="text-gray-700 text-base">Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center space-x-3 mb-3"
              onPress={() => navigation.navigate('Settings')}
            >
              <MaterialIcons name="settings" size={22} color="#4A5568" />
              <Text className="text-gray-700 text-base">Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center space-x-3"
              onPress={handleLogout}
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
