import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { getUserData, clearUserData, getAuthToken } from '../api/api';  // Assuming these are your utility functions
import Layout from '../components/Layout';

// TypeScript Interfaces for Type Safety
interface SectionTitleProps {
  title: string;
}

interface ActionButtonProps {
  text: string; 
  color: string; 
  onPress: () => void;
  icon?: string;
}

interface SummarySectionProps {
  title: string; 
  data: Array<{ label: string; value: string; bgColor: string }>;
}

// HomeScreen Component
const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState<{ name: string; photo: string; designation: string }>({ name: '', photo: '', designation: '' });
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch user data from AsyncStorage on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // First, get the token from AsyncStorage
        const token = await getAuthToken();
        console.log('Token:', token); // Debugging log for token
        
        if (token) {
          // Fetch user data only if token is available
          const storedUser = await getUserData(token);
          console.log('User Data:', storedUser); // Debugging log for user data
          
          if (storedUser) {
            setUser({ 
              name: storedUser.name, 
              photo: storedUser.photo || 'https://randomuser.me/api/portraits/men/3.jpg', 
              designation: storedUser.designation || 'Unknown' 
            });
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

  return (
    <Layout>
      <View className="flex-1 bg-teal-100">
        <ScrollView className="flex-1 p-4" contentContainerStyle={{ paddingBottom: 20 }}>
          {/* User Profile Header */}
          <View className="bg-white p-4 rounded-lg shadow mb-4 flex-row items-center">
            <Image
              source={{
                uri: `https://at.realvictorygroups.xyz/storage/${user.photo}`,
            }}
              className="w-12 h-12 rounded-full mr-4"
            />
            <View>
              <Text className="text-lg font-semibold text-teal-600">{user.name}</Text>
              <Text className="text-gray-500">{user.designation}</Text>
            </View>
            <TouchableOpacity 
              onPress={() => setModalVisible(true)} 
              className="ml-auto"
            >
              <MaterialIcons name="edit" size={24} color="teal" />
            </TouchableOpacity>
          </View>

          {/* Actions Section */}
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <SectionTitle title="Actions" />
            <ActionButton 
              text="Check In" 
              color="bg-teal-600" 
              onPress={() => navigation.navigate('Check-In')} 
            />
            <ActionButton 
              text="Check Out" 
              color="bg-red-500" 
              onPress={() => navigation.navigate('Check-Out')} 
            />
            <ActionButton 
              text="Take Break" 
              color="bg-gray-500" 
              onPress={() => navigation.navigate('Take-Break')} 
            />
          </View>

          {/* Attendance Summary */}
          <SummarySection
            title="Attendance Summary"
            data={[
              { label: 'Attendance Rate', value: '85%', bgColor: 'bg-teal-500' },
              { label: 'Absent', value: '15%', bgColor: 'bg-green-500' },
            ]}
          />

          {/* Employee Performance */}
          <SummarySection
            title="Employee Performance"
            data={[
              { label: 'Worked Hours', value: '40 hrs', bgColor: 'bg-blue-500' },
              { label: 'Breaks Taken', value: '5 hrs', bgColor: 'bg-yellow-500' },
            ]}
          />

          {/* Recent Activity */}
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <SectionTitle title="Recent Activity" />
            <TextItem text="Checked In: 8:30 AM" />
            <TextItem text="Checked Out: 5:00 PM" />
            <TextItem text="Break Taken: 12:30 PM - 1:00 PM" />
          </View>

          {/* Announcements */}
          <View className="bg-yellow-100 p-4 rounded-lg shadow mb-4">
            <SectionTitle title="Announcements" />
            <Text className="text-gray-600">📢 Team meeting scheduled for Monday at 10:00 AM. Prepare your reports!</Text>
          </View>

          {/* Team Collaboration */}
          <CollaborationSection navigation={navigation} />

          {/* Feedback */}
          <View className="bg-white p-4 rounded-lg shadow mb-4">
            <SectionTitle title="Feedback" />
            <ActionButton
              text="Give Feedback"
              color="bg-red-500"
              onPress={() => navigation.navigate('FeedbackForm')}
            />
          </View>

          {/* Wellness Section */}
          <WellnessSection />

          {/* Training Section */}
          <TrainingSection navigation={navigation} />

          {/* Upcoming Events */}
          <UpcomingEventsSection />

          {/* Quick Links */}
          <QuickLinks navigation={navigation} />
        </ScrollView>
      </View>

      {/* Edit Profile Modal */}
      <EditProfileModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
      />
    </Layout>
  );
};

// Helper Components
const SectionTitle: React.FC<SectionTitleProps> = ({ title }) => (
  <Text className="text-lg font-semibold text-teal-600 mb-4">{title}</Text>
);

const ActionButton: React.FC<ActionButtonProps> = ({ text, color, onPress }) => (
  <TouchableOpacity 
    className={`${color} py-3 rounded mb-3`} 
    onPress={onPress}
  >
    <Text className="text-center text-white font-medium">{text}</Text>
  </TouchableOpacity>
);

const SummarySection: React.FC<SummarySectionProps> = ({ title, data }) => (
  <View className="bg-white p-4 rounded-lg shadow mb-4">
    <SectionTitle title={title} />
    <View className="flex-row justify-between items-center">
      {data.map((item, index) => (
        <View 
          key={index} 
          className={`${item.bgColor} p-4 rounded-lg flex-1 ${index === 0 ? 'mr-2' : 'ml-2'}`}
        >
          <Text className="text-white text-2xl font-bold text-center">{item.value}</Text>
          <Text className="text-white text-sm text-center">{item.label}</Text>
        </View>
      ))}
    </View>
  </View>
);

const TextItem: React.FC<{ text: string }> = ({ text }) => (
  <Text className="text-gray-600 mb-2">{text}</Text>
);

const CollaborationSection: React.FC<{ navigation: any }> = ({ navigation }) => (
  <View className="bg-white p-4 rounded-lg shadow mb-4">
    <SectionTitle title="Team Collaboration" />
    <ActionButton 
      text="Team Chat" 
      color="bg-teal-600" 
      onPress={() => navigation.navigate('TeamChat')} 
    />
    <ActionButton 
      text="View Tasks" 
      color="bg-blue-500" 
      onPress={() => navigation.navigate('Tasks')} 
    />
  </View>
);

const WellnessSection = () => (
  <View className="bg-green-100 p-4 rounded-lg shadow mb-4">
    <SectionTitle title="Health and Wellness" />
    <TextItem text="Steps Today: 7,500" />
    <TextItem text="Water Intake: 2.5L" />
    <ActionButton 
      text="Explore Wellness Activities" 
      color="bg-green-500" 
      onPress={() => { /* Placeholder for navigation */ }} 
    />
  </View>
);

const TrainingSection: React.FC<{ navigation: any }> = ({ navigation }) => (
  <View className="bg-white p-4 rounded-lg shadow mb-4">
    <SectionTitle title="Training & Resources" />
    <ActionButton 
      text="Access Training" 
      color="bg-gray-500" 
      onPress={() => navigation.navigate('Training')} 
    />
    <ActionButton 
      text="View Resources" 
      color="bg-teal-600" 
      onPress={() => navigation.navigate('Resources')} 
    />
  </View>
);

const UpcomingEventsSection = () => (
  <View className="bg-white p-4 rounded-lg shadow mb-4">
    <SectionTitle title="Upcoming Events" />
    <TextItem text="Project Deadline: 24 Nov 2024" />
    <TextItem text="Team Outing: 30 Nov 2024" />
    <TextItem text="Performance Review: 05 Dec 2024" />
  </View>
);

const QuickLinks: React.FC<{ navigation: any }> = ({ navigation }) => (
  <View className="bg-white p-4 rounded-lg shadow mb-4">
    <SectionTitle title="Quick Links" />
    <View className="flex flex-wrap justify-between gap-4">
      <ActionButton
        text="Leave Request"
        color="bg-teal-600"
        onPress={() => navigation.navigate('Leave')}
      />
      <ActionButton
        text="View Records"
        color="bg-green-500"
        onPress={() => { /* Placeholder for navigation */ }}
      />
      <ActionButton
        text="Notifications"
        color="bg-yellow-500"
        onPress={() => navigation.navigate('Notifications')}
      />
      <ActionButton
        text="Settings"
        color="bg-red-500"
        onPress={() => navigation.navigate('Settings')}
      />
    </View>
  </View>
);

const EditProfileModal: React.FC<{ visible: boolean; onClose: () => void }> = ({ visible, onClose }) => (
  <Modal 
    transparent={true} 
    animationType="fade" 
    visible={visible} 
    onRequestClose={onClose}
  >
    <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
      <View className="bg-white p-6 rounded-lg w-80">
        <Text className="text-lg font-semibold text-teal-600 mb-4">Edit Profile</Text>
        <ActionButton 
          text="Close" 
          color="bg-teal-600" 
          onPress={onClose} 
        />
      </View>
    </View>
  </Modal>
);

export default HomeScreen;
