import Layout from '../components/Layout';
import React, { useState, useEffect } from 'react';
import { View, Text, Switch, TouchableOpacity, Alert, Image, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as LocalAuthentication from 'expo-local-authentication';

const SettingScreen: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [languagePreference, setLanguagePreference] = useState('English');
  const [privacyMode, setPrivacyMode] = useState(false);
  const [dataUsage, setDataUsage] = useState(false);

  // Handle toggling notifications
  const toggleNotifications = () => {
    setNotificationsEnabled((prevState) => !prevState);
    Alert.alert(
      'Notifications', 
      notificationsEnabled ? 'Notifications disabled' : 'Notifications enabled'
    );
  };

  // Handle theme switch
  const switchTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    Alert.alert('Theme Changed', `Switched to ${theme === 'light' ? 'dark' : 'light'} mode.`);
  };

  // Handle biometrics toggle
  const toggleBiometrics = async () => {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        'Biometrics Unavailable', 
        'Your device does not support biometric authentication.'
      );
      return;
    }

    setBiometricsEnabled((prev) => !prev);
    Alert.alert(
      'Biometric Security', 
      biometricsEnabled ? 'Biometric login disabled' : 'Biometric login enabled'
    );
  };

  // Handle language selection
  const selectLanguage = () => {
    Alert.alert(
      'Select Language',
      'Choose your preferred language',
      [
        { text: 'English', onPress: () => setLanguagePreference('English') },
        { text: 'Spanish', onPress: () => setLanguagePreference('Spanish') },
        { text: 'French', onPress: () => setLanguagePreference('French') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: () => {
          // Implement actual logout logic
          console.log('Logged out');
        }
      },
    ]);
  };

  // Effect to update the app theme and settings
  useEffect(() => {
    // Persist settings using AsyncStorage or similar method
    // For demonstration, we'll just log the changes
    console.log('Theme updated:', theme);
    console.log('Notifications:', notificationsEnabled);
  }, [theme, notificationsEnabled]);

  return (
    <Layout>
      <ScrollView 
        className={`flex-1 ${theme === 'light' ? 'bg-teal-100' : 'bg-gray-900'} p-6`}
      >
        {/* Header */}
        <View className="mb-6">
          <Text className={`text-3xl font-bold ${theme === 'light' ? 'text-teal-700' : 'text-white'}`}>
            Settings
          </Text>
        </View>

        {/* User Profile Section */}
        <View className={`flex-row items-center ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg mb-6 shadow-md`}>
          <Image
            source={{ uri: 'https://www.gravatar.com/avatar/placeholder' }}
            className="w-16 h-16 rounded-full border-2 border-teal-500"
          />
          <View className="ml-4">
            <Text className={`text-lg font-semibold ${theme === 'light' ? 'text-teal-700' : 'text-white'}`}>
              John Doe
            </Text>
            <Text className={`text-gray-500 ${theme === 'light' ? 'text-gray-500' : 'text-gray-300'}`}>
              johndoe@example.com
            </Text>
          </View>
        </View>

        {/* Notification Toggle */}
        <View className={`flex-row items-center justify-between ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg mb-4 shadow-md`}>
          <View className="flex-row items-center">
            <Icon name="notifications-outline" size={24} color={theme === 'light' ? '#6B7280' : '#D1D5DB'} />
            <Text className={`text-lg font-medium ml-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Enable Notifications
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={toggleNotifications}
            thumbColor={notificationsEnabled ? '#34D399' : '#D1D5DB'}
            trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
          />
        </View>

        {/* Theme Switch */}
        <TouchableOpacity
          onPress={switchTheme}
          className={`flex-row items-center justify-between ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg mb-4 shadow-md`}
        >
          <View className="flex-row items-center">
            <Icon name="color-palette-outline" size={24} color={theme === 'light' ? '#6B7280' : '#D1D5DB'} />
            <Text className={`text-lg font-medium ml-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Switch Theme
            </Text>
          </View>
          <Text className={`font-semibold ${theme === 'light' ? 'text-teal-500' : 'text-teal-300'}`}>
            {theme === 'light' ? 'Light' : 'Dark'}
          </Text>
        </TouchableOpacity>

        {/* Biometric Authentication */}
        <View className={`flex-row items-center justify-between ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg mb-4 shadow-md`}>
          <View className="flex-row items-center">
            <Icon name="finger-print-outline" size={24} color={theme === 'light' ? '#6B7280' : '#D1D5DB'} />
            <Text className={`text-lg font-medium ml-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Biometric Login
            </Text>
          </View>
          <Switch
            value={biometricsEnabled}
            onValueChange={toggleBiometrics}
            thumbColor={biometricsEnabled ? '#34D399' : '#D1D5DB'}
            trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
          />
        </View>

        {/* Language Preference */}
        <TouchableOpacity
          onPress={selectLanguage}
          className={`flex-row items-center justify-between ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg mb-4 shadow-md`}
        >
          <View className="flex-row items-center">
            <Icon name="globe-outline" size={24} color={theme === 'light' ? '#6B7280' : '#D1D5DB'} />
            <Text className={`text-lg font-medium ml-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Language
            </Text>
          </View>
          <Text className={`font-semibold ${theme === 'light' ? 'text-teal-500' : 'text-teal-300'}`}>
            {languagePreference}
          </Text>
        </TouchableOpacity>

        {/* Privacy Mode */}
        <View className={`flex-row items-center justify-between ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg mb-4 shadow-md`}>
          <View className="flex-row items-center">
            <Icon name="eye-off-outline" size={24} color={theme === 'light' ? '#6B7280' : '#D1D5DB'} />
            <Text className={`text-lg font-medium ml-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Privacy Mode
            </Text>
          </View>
          <Switch
            value={privacyMode}
            onValueChange={() => setPrivacyMode(!privacyMode)}
            thumbColor={privacyMode ? '#34D399' : '#D1D5DB'}
            trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
          />
        </View>

        {/* Data Usage */}
        <View className={`flex-row items-center justify-between ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} p-4 rounded-lg mb-4 shadow-md`}>
          <View className="flex-row items-center">
            <Icon name="cellular-outline" size={24} color={theme === 'light' ? '#6B7280' : '#D1D5DB'} />
            <Text className={`text-lg font-medium ml-3 ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
              Reduce Data Usage
            </Text>
          </View>
          <Switch
            value={dataUsage}
            onValueChange={() => setDataUsage(!dataUsage)}
            thumbColor={dataUsage ? '#34D399' : '#D1D5DB'}
            trackColor={{ false: '#D1D5DB', true: '#BBF7D0' }}
          />
        </View>

        {/* Version Info */}
        <View className={`p-4 rounded-lg mb-4 shadow-md ${theme === 'light' ? 'bg-white' : 'bg-gray-800'}`}>
          <Text className={`text-lg font-medium ${theme === 'light' ? 'text-gray-800' : 'text-white'}`}>
            App Version
          </Text>
          <Text className={`text-teal-500 text-sm ${theme === 'light' ? 'text-teal-500' : 'text-teal-300'}`}>
            v1.1.0
          </Text>
          <Text className={`text-xs mt-1 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
            {Platform.OS === 'ios' ? 'App Store' : 'Google Play'}
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center bg-red-500 px-4 py-3 rounded-lg shadow-md"
        >
          <Icon name="log-out-outline" size={24} color="#FFF" />
          <Text className="text-white font-medium text-lg ml-3">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

export default SettingScreen;