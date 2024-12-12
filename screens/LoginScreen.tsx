import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../api/api'; // Assuming you have the API call here.

interface LoginScreenProps {
  navigation: any;
  setIsLoggedIn: (status: boolean) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation, setIsLoggedIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null); // Clear previous errors
    setLoading(true);

    // Simple validation
    if (!email || !password) {
      setError('Please enter valid credentials.');
      setLoading(false);
      return;
    }

    try {
      // Call the API
      const response = await loginUser(email, password);

      // Save the token to AsyncStorage
      await AsyncStorage.setItem('token', response.token);

      // Update the login status
      setIsLoggedIn(true);

      // Navigate to the dashboard or home page
      navigation.replace('Home'); // Replace with your desired screen
    } catch (error: any) {
      setError(error.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center bg-teal-50 p-6">
      {/* App Logo or Title */}
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-teal-700">Attendance App</Text>
      </View>

      {/* Login Form */}
      <View>
        <Text className="text-xl font-semibold text-teal-700 mb-4">Login</Text>

        {error && <Text className="text-red-600 mb-4">{error}</Text>} {/* Error message */}

        <TextInput
          className="w-full mb-4 p-4 bg-white rounded-lg shadow-sm text-teal-800"
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          className="w-full mb-6 p-4 bg-white rounded-lg shadow-sm text-teal-800"
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          className="w-full p-4 bg-teal-600 rounded-lg items-center"
          onPress={handleLogin}
          disabled={loading} // Disable button when loading
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" /> // Show loading spinner
          ) : (
            <Text className="text-white text-lg font-semibold">Login</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Sign Up Redirect */}
      <View className="mt-6 items-center">
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text className="text-teal-600 text-base underline">
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
