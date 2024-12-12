import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';

const SignupScreen: React.FC = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    // Placeholder for signup logic
    alert('Account created successfully!');
    navigation.navigate('Login'); // Navigate to login after signup
  };

  return (
    <View className="flex-1 justify-center items-center bg-teal-50 p-4">
      <Text className="text-2xl font-bold text-teal-700">Sign Up</Text>
      <TextInput
        className="w-full mt-4 p-3 bg-white rounded-lg shadow-md text-teal-800"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
      />
      <TextInput
        className="w-full mt-4 p-3 bg-white rounded-lg shadow-md text-teal-800"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#999"
      />
      <TextInput
        className="w-full mt-4 p-3 bg-white rounded-lg shadow-md text-teal-800"
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        className="mt-6 bg-teal-600 p-3 rounded-lg w-full items-center"
        onPress={handleSignup}
      >
        <Text className="text-white font-semibold">Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="mt-4"
        onPress={() => navigation.navigate('Login')}
      >
        <Text className="text-teal-600 underline">Already have an account? Log in</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
