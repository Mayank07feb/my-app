import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser } from '../api/api'; // Replace with your actual API import

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

    if (!email || !password) {
      setError('Please enter valid credentials.');
      setLoading(false);
      return;
    }

    try {
      const response = await loginUser(email, password); // API call

      if (!response || !response.token) {
        throw new Error('Invalid response from server.');
      }

      // Save token to AsyncStorage
      await AsyncStorage.setItem('token', response.token);

      // Update the logged-in status
      setIsLoggedIn(true);

      // Navigate to the Home screen via the drawer navigator
      navigation.replace('MainApp'); // Replace the login screen with the main app

    } catch (err: any) {
      setError(err.message || 'An error occurred during login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', backgroundColor: '#e6f7f9', padding: 24 }}>
      {/* App Title */}
      <View style={{ alignItems: 'center', marginBottom: 32 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#0d9488' }}>Attendance App</Text>
      </View>

      {/* Login Form */}
      <View>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#0d9488', marginBottom: 16 }}>
          Login
        </Text>

        {/* Display Error Message */}
        {error && <Text style={{ color: '#dc2626', marginBottom: 16 }}>{error}</Text>}

        {/* Email Input */}
        <TextInput
          style={{
            width: '100%',
            marginBottom: 16,
            padding: 12,
            backgroundColor: '#fff',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            color: '#134e4a',
          }}
          placeholder="Email"
          placeholderTextColor="#94a3b8"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Password Input */}
        <TextInput
          style={{
            width: '100%',
            marginBottom: 24,
            padding: 12,
            backgroundColor: '#fff',
            borderRadius: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
            color: '#134e4a',
          }}
          placeholder="Password"
          placeholderTextColor="#94a3b8"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {/* Login Button */}
        <TouchableOpacity
          style={{
            width: '100%',
            padding: 16,
            backgroundColor: '#0d9488',
            borderRadius: 8,
            alignItems: 'center',
            opacity: loading ? 0.7 : 1,
          }}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Login</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Sign Up Redirect */}
      <View style={{ marginTop: 24, alignItems: 'center' }}>
        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: '#0d9488', textDecorationLine: 'underline', fontSize: 14 }}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;
