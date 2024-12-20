import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useEffect } from 'react';

const BottomBar: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeTab, setActiveTab] = useState<string>('Home');

  // Update active tab based on current route when component mounts or route changes
  useEffect(() => {
    setActiveTab(route.name);
  }, [route.name]);

  // Define color for active and inactive states
  const getColor = (tab: string) => (tab === activeTab ? '#14B8A6' : '#B0BEC5');

  const handleNavigation = (tab: string) => {
    // Only navigate if it's a different tab
    if (tab !== activeTab) {
      navigation.navigate(tab);
    }
  };

  return (
    <View className="w-full flex-row justify-around p-2 bg-white shadow-md">
      {/* Home Button */}
      <TouchableOpacity
        className="flex items-center"
        onPress={() => handleNavigation('Home')}
      >
        <Icon name="home-outline" size={24} color={getColor('Home')} />
        <Text className="text-sm" style={{ color: getColor('Home') }}>
          Home
        </Text>
      </TouchableOpacity>
      {/* Reports Button */}
      <TouchableOpacity
        className="flex items-center"
        onPress={() => handleNavigation('ReportsScreen')}
      >
        <Icon name="document-text-outline" size={24} color={getColor('ReportsScreen')} />
        <Text className="text-sm" style={{ color: getColor('ReportsScreen') }}>
          Reports
        </Text>
      </TouchableOpacity>
      {/* Records Button */}
      <TouchableOpacity
        className="flex items-center"
        onPress={() => handleNavigation('Records')}
      >
        <Icon name="folder-outline" size={24} color={getColor('Records')} />
        <Text className="text-sm" style={{ color: getColor('Records') }}>
          Records
        </Text>
      </TouchableOpacity>
      {/* Attendance Button */}
      <TouchableOpacity
        className="flex items-center"
        onPress={() => handleNavigation('MonthlyAttendanceRecords')}
      >
        <Icon name="time-outline" size={24} color={getColor('MonthlyAttendanceRecords')} />
        <Text className="text-sm" style={{ color: getColor('MonthlyAttendanceRecords') }}>
          Attendance
        </Text>
      </TouchableOpacity>
      {/* Account Button */}
      <TouchableOpacity
        className="flex items-center"
        onPress={() => handleNavigation('Account')}
      >
        <Icon name="person-outline" size={24} color={getColor('Account')} />
        <Text className="text-sm" style={{ color: getColor('Account') }}>
          Account
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;