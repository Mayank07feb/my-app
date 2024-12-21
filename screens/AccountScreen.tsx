import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator, Alert } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import Layout from '../components/Layout';
import { getUserData, getAuthToken, logoutUser } from '../api/api';  // Import logoutUser function
import { useNavigation } from '@react-navigation/native';  // Import navigation

const AccountScreen: React.FC = () => {
  const [user, setUser] = useState({
    id: 1,
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    joining_date: '',
    designation: '',
    responsibility: '',
    salary: '',
  });

  const [loading, setLoading] = useState<boolean>(false);  // Added loading state for logout
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState<string>('');  // For success message

  const navigation = useNavigation();  // Access navigation

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = await getAuthToken();
        if (!token) {
          console.log('No token found.');
          return;
        }

        const storedUser = await getUserData(token);
        if (storedUser) {
          setUser({
            id: storedUser.id || 1,
            name: storedUser.name || '',
            email: storedUser.email || '',
            phone: storedUser.phone || '',
            address: storedUser.address || '',
            photo: storedUser.photo || 'https://randomuser.me/api/portraits/men/3.jpg',
            joining_date: storedUser.joining_date || '',
            designation: storedUser.designation || 'Unknown',
            responsibility: storedUser.responsibility || '',
            salary: storedUser.salary || '',
          });
        } else {
          console.log('No user data found.');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSavePassword = () => {
    if (newPassword !== confirmNewPassword) {
      Alert.alert('Error', 'New passwords do not match.');
      return;
    }
    Alert.alert('Success', 'Password updated successfully!');
  };

  const handleLogout = async () => {
    setLoading(true);  // Show loader when logout starts
    setLogoutMessage('');  // Clear any previous message

    try {
      // Call logoutUser from your API
      await logoutUser();
      setLogoutMessage('Logout successful! Redirecting...');  // Set success message

      // After a short delay, navigate to the login screen
      setTimeout(() => {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      }, 2000);  // 2 seconds delay to show the success message
    } catch (error) {
      console.error('Error during logout:', error.message);
      setLogoutMessage('Logout failed. Please try again.');
    } finally {
      setLoading(false);  // Hide loader once logout is complete
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E6FFFA' }}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  return (
    <Layout>
      <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#E6FFFA' }}>
        {/* Profile Picture Section */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <Image
            source={{
              uri: `https://at.realvictorygroups.xyz/storage/${user.photo}`,
            }}
            style={{
              width: 112,
              height: 112,
              borderRadius: 56,
              marginBottom: 16,
              borderWidth: 3,
              borderColor: '#FFFFFF',
            }}
          />
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#0D9488',
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 9999,
            }}
          >
            <MaterialIcons name="photo-camera" size={20} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontWeight: 'bold', marginLeft: 8 }}>Change Picture</Text>
          </TouchableOpacity>
        </View>

        {/* User Information Section */}
        <Text style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 24, color: '#0D9488' }}>
          My Profile
        </Text>

        {[
          { label: 'Full Name', value: user.name },
          { label: 'Email', value: user.email },
          { label: 'Phone', value: user.phone },
          { label: 'Address', value: user.address },
          { label: 'Joining Date', value: user.joining_date },
          { label: 'Designation', value: user.designation },
          { label: 'Responsibility', value: user.responsibility },
          { label: 'Salary', value: user.salary },
        ].map((field, index) => (
          <View key={index} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#0D9488', marginBottom: 4 }}>{field.label}:</Text>
            <TextInput
              style={{
                padding: 12,
                borderWidth: 1,
                borderColor: '#A7F3D0',
                borderRadius: 8,
                backgroundColor: '#F3F4F6',
              }}
              value={field.value}
              editable={false}
            />
          </View>
        ))}

        {/* Change Password Section */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#0D9488', marginBottom: 16 }}>Change Password</Text>
        {[
          {
            label: 'Current Password',
            value: currentPassword,
            setter: setCurrentPassword,
            show: showCurrentPassword,
            toggle: () => setShowCurrentPassword(!showCurrentPassword),
          },
          {
            label: 'New Password',
            value: newPassword,
            setter: setNewPassword,
            show: showNewPassword,
            toggle: () => setShowNewPassword(!showNewPassword),
          },
          {
            label: 'Confirm New Password',
            value: confirmNewPassword,
            setter: setConfirmNewPassword,
            show: showConfirmNewPassword,
            toggle: () => setShowConfirmNewPassword(!showConfirmNewPassword),
          },
        ].map((field, index) => (
          <View key={index} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, color: '#0D9488', marginBottom: 4 }}>{field.label}:</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 8, backgroundColor: '#FFFFFF' }}>
              <TextInput
                style={{
                  flex: 1,
                  padding: 12,
                }}
                placeholder={field.label}
                value={field.value}
                onChangeText={field.setter}
                secureTextEntry={!field.show}
              />
              <TouchableOpacity onPress={field.toggle} style={{ padding: 12 }}>
                <Feather name={field.show ? 'eye' : 'eye-off'} size={20} color="#0D9488" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Save Password Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#0D9488',
            padding: 16,
            borderRadius: 8,
            marginTop: 20,
          }}
          onPress={handleSavePassword}
        >
          <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>Save Password</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity
          style={{
            backgroundColor: '#DC2626',
            padding: 16,
            borderRadius: 8,
            marginTop: 16,
          }}
          onPress={handleLogout}
          disabled={loading}  // Disable the button while loading
        >
          <Text style={{ color: '#FFFFFF', textAlign: 'center', fontSize: 16, fontWeight: 'bold' }}>
            {loading ? 'Logging Out...' : 'Logout'}
          </Text>
        </TouchableOpacity>

        {/* Show the success message after logout */}
        {loading && (
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20 }}>
            <ActivityIndicator size="large" color="#0D9488" />
            <Text style={{ marginLeft: 10, fontSize: 16, color: '#0D9488' }}>
              {logoutMessage}
            </Text>
          </View>
        )}
      </ScrollView>
    </Layout>
  );
};

export default AccountScreen;
