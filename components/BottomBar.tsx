import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const BottomBar: React.FC = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<string>('Home');

  // Define color for active and inactive states
  const getColor = (tab: string) => (tab === activeTab ? '#14B8A6' : '#B0BEC5'); // Teal for active, gray for inactive

  const handleNavigation = (tab: string) => {
    setActiveTab(tab);
    navigation.navigate(tab); // Navigate to the corresponding screen
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
        <Icon name="document-text-outline" size={24} color={getColor('Reports')} />
        <Text className="text-sm" style={{ color: getColor('Reports') }}>
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
        <Icon name="time-outline" size={24} color={getColor('Attendance')} />
        <Text className="text-sm" style={{ color: getColor('Attendance') }}>
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
