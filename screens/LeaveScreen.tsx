import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { format } from 'date-fns';
import Layout from '../components/Layout';

const LeaveScreen: React.FC = () => {
  // State variables for form inputs
  const [leaveDate, setLeaveDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
  const [leaveType, setLeaveType] = useState<string>('Sick Leave');
  const [reason, setReason] = useState<string>('');
  const [leaveRecords, setLeaveRecords] = useState<any[]>([]);

  // Handle Submit Leave Application
  const handleApplyLeave = () => {
    const newRecord = { date: leaveDate, type: leaveType, reason, status: 'Pending' };
    setLeaveRecords([...leaveRecords, newRecord]);
    setReason('');
  };

  return (
    <Layout>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="p-6 bg-gradient-to-r from-teal-100 to-blue-100">
        <Text className="text-3xl font-semibold text-teal-700 mb-8 text-center">Apply for Leave</Text>

        {/* Leave Application Form */}
        <View className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <Text className="text-xl font-semibold mb-4 text-teal-600">Leave Application Form</Text>

          <Text className="text-sm font-medium text-gray-600 mb-2">Leave Date</Text>
          <TextInput
            value={leaveDate}
            onChangeText={setLeaveDate}
            className="p-3 border border-teal-300 rounded-lg mb-6 bg-gray-50"
            placeholder="Select Date"
            keyboardType="default"
          />

          <Text className="text-sm font-medium text-gray-600 mb-2">Leave Type</Text>
          <View className="border border-teal-300 rounded-lg bg-gray-50 mb-6">
            <Picker
              selectedValue={leaveType}
              onValueChange={setLeaveType}
              style={{ height: 50, width: '100%' }} // Optional: Use inline styles for Picker
            >
              <Picker.Item label="Sick Leave" value="Sick Leave" />
              <Picker.Item label="Casual Leave" value="Casual Leave" />
              <Picker.Item label="Maternity Leave" value="Maternity Leave" />
              <Picker.Item label="Paid Leave" value="Paid Leave" />
            </Picker>
          </View>

          <Text className="text-sm font-medium text-gray-600 mb-2">Reason for Leave</Text>
          <TextInput
            value={reason}
            onChangeText={setReason}
            className="p-3 border border-teal-300 rounded-lg mb-6 h-24 bg-gray-50"
            placeholder="Enter the reason for leave"
            multiline
          />

          <TouchableOpacity
            onPress={handleApplyLeave}
            className="bg-teal-600 p-4 rounded-full flex items-center"
          >
            <Text className="text-white font-semibold">Apply for Leave</Text>
          </TouchableOpacity>
        </View>

        {/* Leave Records */}
        <Text className="text-xl font-semibold text-teal-700 mb-6 text-center">Leave Records</Text>

        <ScrollView>
          {leaveRecords.length === 0 ? (
            <Text className="text-center text-gray-500">No leave records yet.</Text>
          ) : (
            leaveRecords.map((record, index) => (
              <View key={index} className="flex-row bg-white p-4 mb-4 rounded-lg shadow-lg">
                <View className="flex-1">
                  <Text className="text-teal-700 font-semibold">Date: {record.date}</Text>
                  <Text className="text-gray-600">Leave Type: {record.type}</Text>
                  <Text className="text-gray-600">Reason: {record.reason}</Text>
                  <Text
                    className={`text-sm font-medium mt-2 ${record.status === 'Approved' ? 'text-green-600' : 'text-yellow-600'
                      }`}
                  >
                    Status: {record.status}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </ScrollView>
    </Layout>
  );
};

export default LeaveScreen;
