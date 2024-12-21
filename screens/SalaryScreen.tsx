import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Layout from '../components/Layout';
import { fetchSalaryData, getUserData } from '../api/api'; // Import your API functions

const SalaryScreen = () => {
  const [userData, setUserData] = useState(null);  // Store fetched user data
  const [salaryData, setSalaryData] = useState(null);  // Store fetched salary data
  const [loading, setLoading] = useState(true);  // Track loading state
  const [error, setError] = useState(null);  // Track any errors

  // Function to fetch both user and salary data
  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch user data
        const user = await getUserData();
        setUserData(user);

        // Fetch salary data for the current month
        const month = '2024-12'; // Example: Fetch salary data for December 2024
        const salary = await fetchSalaryData(month);
        setSalaryData(salary);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const InfoRow = ({ iconName, label, value }) => (
    <View className="flex-row items-center py-2">
      <Icon name={iconName} size={24} color="#0D9488" className="mr-3" />
      <View className="flex-1">
        <Text className="text-sm text-gray-500 mb-1">{label}</Text>
        <Text className="text-base font-semibold text-gray-900">{value || 'N/A'}</Text>
      </View>
    </View>
  );

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle loading, error, and displaying the data
  if (loading) {
    return (
      <Layout>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#0D9488" />
        </View>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-600">{error}</Text>
        </View>
      </Layout>
    );
  }

  return (
    <Layout>
      <ScrollView className="flex-1 bg-teal-50">
        <View className="m-4 bg-white rounded-2xl p-4 shadow-lg">
          {/* Header Section */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-teal-700">Employee Details</Text>
            <View className={`px-3 py-1.5 rounded-full ${getStatusColor(salaryData?.status)}`}>
              <Text className="text-sm font-semibold capitalize">
                {salaryData?.status || 'N/A'}
              </Text>
            </View>
          </View>

          {/* Profile Section */}
          <View className="flex-row items-center mb-4">
            <Icon name="account-circle" size={60} color="#0D9488" className="mr-3" />
            <View>
              <Text className="text-xl font-bold text-gray-900">{userData?.name}</Text>
              <Text className="text-sm text-gray-500">{userData?.designation}</Text>
            </View>
          </View>

          <View className="h-px bg-gray-200 my-4" />

          {/* Contact Information */}
          <View className="mb-4">
            <Text className="text-sm font-semibold text-gray-500 mb-2">
              Contact Information
            </Text>
            <InfoRow iconName="phone" label="Phone" value={userData?.phone} />
            <InfoRow iconName="email" label="Email" value={userData?.email} />
          </View>

          <View className="h-px bg-gray-200 my-4" />

          {/* Employment Details */}
          <View>
            <Text className="text-sm font-semibold text-gray-500 mb-2">
              Employment Details
            </Text>
            <InfoRow 
              iconName="work" 
              label="Designation" 
              value={userData?.designation} 
            />
            <InfoRow 
              iconName="attach-money" 
              label="Monthly Salary" 
              value={`$${parseFloat(userData?.salary).toLocaleString()}`} 
            />
            <InfoRow 
              iconName="payment" 
              label="Paid Amount" 
              value={salaryData?.paid_amount 
                ? `$${parseFloat(salaryData.paid_amount).toLocaleString()}` 
                : 'N/A'
              } 
            />
          </View>
        </View>
      </ScrollView>
    </Layout>
  );
};

export default SalaryScreen;
