import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Layout from '../components/Layout';

const NotificationScreen: React.FC = () => {
  // Dummy notification data
  const notifications = [
    { id: 1, title: 'Attendance Reminder', message: 'Please mark your attendance for today.' },
    { id: 2, title: 'Upcoming Project Deadline', message: 'The project deadline is approaching. Make sure to complete your tasks on time.' },
    { id: 3, title: 'Meeting Update', message: 'The team meeting has been rescheduled to 2:00 PM today.' },
    { id: 4, title: 'Holiday Announcement', message: 'The office will be closed on Friday, 24th November for the holiday.' },
  ];

  return (
    <Layout>
      <ScrollView className="flex-1 p-4 bg-teal-100 h-screen">
        <Text className="text-2xl font-bold text-teal-600 mb-4">Notifications</Text>

        {/* Notification List */}
        {notifications.map((notification) => (
          <View
            key={notification.id}
            className="bg-white p-4 rounded-lg shadow mb-4"
          >
            <Text className="text-xl font-semibold text-teal-600">{notification.title}</Text>
            <Text className="text-gray-700 mt-1">{notification.message}</Text>

            <TouchableOpacity className="flex-row items-center mt-3">
              <Text className="text-teal-500">Read More</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#38A169" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </Layout>
  );
};

export default NotificationScreen;
