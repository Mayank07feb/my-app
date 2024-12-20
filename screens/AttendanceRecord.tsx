import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Modal, SafeAreaView, Dimensions } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import { fetchAttendanceData } from '../api/api';

const AttendanceDetailModal = ({ attendance, isVisible, onClose }) => {
  if (!attendance) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <View className="bg-white rounded-t-3xl h-[90%] shadow-2xl">
          <View className="bg-teal-600 p-4 rounded-t-3xl">
            <View className="flex-row justify-between items-center">
              <Text className="text-white text-xl font-bold">
                Attendance Details
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Text className="text-white text-lg">✕</Text>
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="p-4">
            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Name</Text>
                <Text className="font-bold">{attendance.name}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Office</Text>
                <Text>{attendance.office_id || 'N/A'}</Text>
              </View>
            </View>

            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-lg font-semibold text-teal-700 mb-3">
                Check-In Details
              </Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Time</Text>
                <Text>
                  {attendance.check_in_time
                    ? new Date(attendance.check_in_time).toLocaleString()
                    : 'N/A'}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Distance</Text>
                <Text>
                  {attendance.latest_attendance?.check_in_distance || 'N/A'}
                </Text>
              </View>
              {attendance.latest_attendance?.check_in_image && (
                <Image
                  source={{
                    uri: `https://at.realvictorygroups.xyz/storage/${attendance.latest_attendance.check_in_image}`,
                  }}
                  className="w-full h-40 rounded-xl mt-3"
                  resizeMode="cover"
                />
              )}
            </View>

            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-lg font-semibold text-teal-700 mb-3">
                Check-Out Details
              </Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Time</Text>
                <Text>
                  {attendance.check_out_time
                    ? new Date(attendance.check_out_time).toLocaleString()
                    : 'N/A'}
                </Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Distance</Text>
                <Text>
                  {attendance.latest_attendance?.check_out_distance || 'N/A'}
                </Text>
              </View>
              {attendance.latest_attendance?.check_out_image && (
                <Image
                  source={{
                    uri: `https://at.realvictorygroups.xyz/storage/${attendance.latest_attendance.check_out_image}`,
                  }}
                  className="w-full h-40 rounded-xl mt-3"
                  resizeMode="cover"
                />
              )}
            </View>

            <View className="bg-gray-100 p-4 rounded-xl mb-4">
              <Text className="text-lg font-semibold text-teal-700 mb-3">
                Additional Information
              </Text>
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Working Hours</Text>
                <Text>{attendance.office_time || 'N/A'}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Check-In Note</Text>
                <Text className="ml-4" numberOfLines={2}>
                  {attendance.latest_attendance?.check_in_note || 'N/A'}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const AttendanceRecord = () => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [filteredData, setFilteredData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAttendance, setSelectedAttendance] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  const screenWidth = Dimensions.get('window').width;

  useEffect(() => {
    const getAttendanceData = async () => {
      try {
        const data = await fetchAttendanceData();
        setAttendanceData(data);
        setFilteredData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    getAttendanceData();
  }, []);

  const filterByDate = (date) => {
    if (!date) {
      setFilteredData(attendanceData);
      return;
    }

    const selectedDateStr = format(date, 'yyyy-MM-dd');
    const filtered = attendanceData.filter(record => {
      const checkInDate = record.check_in_time ?
        format(new Date(record.check_in_time), 'yyyy-MM-dd') : null;
      return checkInDate === selectedDateStr;
    });
    setFilteredData(filtered);
  };

  const DateSelectionModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={showCalendar}
      onRequestClose={() => setShowCalendar(false)}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white p-4 rounded-xl w-[95%]">
          <CalendarPicker
            onDateChange={(date) => {
              setSelectedDate(date);
              filterByDate(date);
              setShowCalendar(false);
            }}
            selectedDayColor="#0D9488"
            selectedDayTextColor="#FFFFFF"
          />
          <TouchableOpacity
            onPress={() => setShowCalendar(false)}
            className="mt-4 bg-gray-200 p-2 rounded-md"
          >
            <Text className="text-center">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const DateSelection = () => (
    <View className="bg-white p-4 mb-4 rounded-lg mx-4 shadow-sm">
      <Text className="text-gray-600 mb-2">Select Date</Text>
      <View className="flex-row justify-between items-center">
        <TouchableOpacity
          onPress={() => setShowCalendar(true)}
          className="flex-1 border border-gray-300 rounded-l-md p-3"
        >
          <Text className="text-gray-700">
            {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'YYYY-MM-DD'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setSelectedDate(null);
            filterByDate(null);
          }}
          className="bg-gray-100 p-3 rounded-r-md border border-l-0 border-gray-300"
        >
          <Text className="text-gray-700">Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <ActivityIndicator size="large" color="#0D9488" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-gray-100">
        <Text className="text-red-500 text-lg text-center">{`Error: ${error}`}</Text>
      </SafeAreaView>
    );
  }

  return (
    <Layout>
      <SafeAreaView className="flex-1">
        <View className="p-4">
          <Text className="text-2xl font-bold text-teal-600 text-center">
            Daily Attendance Records
          </Text>
        </View>

        <DateSelection />
        <DateSelectionModal />

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ minWidth: screenWidth * 2 }} className="border border-gray-300 rounded-md overflow-hidden mb-16 mx-4">
            <View className="flex-row bg-teal-600">
              {[
                'Serial No', 'Name', 'Office', 'Check-In', 'Check-In Image', 'Check-In Note',
                'Check-Out Time', 'Check-Out Image', 'Check-Out Note',
                'Working Hours', 'Check-In Distance', 'Check-Out Distance', 'Actions'
              ].map((header, index) => (
                <Text
                  key={index}
                  className="text-white font-semibold text-center p-3 border-r border-teal-400"
                  style={{
                    flex: header === 'Actions' ? 3 : 2,  // Changed from 1 to 3 for Actions column
                    fontSize: 12
                  }}
                >
                  {header}
                </Text>
              ))}
            </View>

            {filteredData && filteredData.length > 0 ? (
              filteredData.map((attendance, index) => (
                <TouchableOpacity
                  key={attendance.id}
                  onPress={() => setSelectedAttendance(attendance)}
                  className={`flex-row ${index % 2 === 0 ? 'bg-white' : 'bg-teal-50'}`}
                >
                  {/* Serial No Column */}
                  <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                    {index + 1}
                  </Text>

                  {/* Name Column */}
                  <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.name}
                  </Text>

                  {/* Office Column */}
                  <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.office_id || 'N/A'}
                  </Text>

                  {/* Check-In Column */}
                  <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.check_in_time
                      ? new Date(attendance.check_in_time).toLocaleTimeString()
                      : 'N/A'}
                  </Text>

                  {/* Check-In Image Column */}
                  <View className="p-3 justify-center items-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.latest_attendance?.check_in_image ? (
                      <Image
                        source={{
                          uri: `https://at.realvictorygroups.xyz/storage/${attendance.latest_attendance.check_in_image}`,
                        }}
                        className="w-16 h-16 rounded-md"
                      />
                    ) : (
                      <Text className="text-gray-500">No Image</Text>
                    )}
                  </View>

                  {/* Check-In Note Column */}
                  <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.latest_attendance?.check_in_note || 'N/A'}
                  </Text>

                  {/* Check-Out Time Column */}
                  <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.check_out_time
                      ? new Date(attendance.check_out_time).toLocaleTimeString()
                      : 'N/A'}
                  </Text>

                  {/* Check-Out Image Column */}
                  <View className="p-3 justify-center items-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.latest_attendance?.check_out_image ? (
                      <Image
                        source={{
                          uri: `https://at.realvictorygroups.xyz/storage/${attendance.latest_attendance.check_out_image}`,
                        }}
                        className="w-16 h-16 rounded-md"
                      />
                    ) : (
                      <Text className="text-gray-500">No Image</Text>
                    )}
                  </View>

                  {/* Check-Out Note Column */}
                  <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.latest_attendance?.check_out_note || 'N/A'}
                  </Text>

                  {/* Working Hours Column */}
                  <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.office_time || 'N/A'}
                  </Text>

                  {/* Check-In Distance Column */}
                  <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.latest_attendance?.check_in_distance || 'N/A'}
                  </Text>

                  {/* Check-Out Distance Column */}
                  <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                    {attendance.latest_attendance?.check_out_distance || 'N/A'}
                  </Text>

                  {/* Actions Column */}
                  <View className="p-3 justify-center items-center" style={{ flex: 3 }}>  {/* Changed from flex: 1 to flex: 3 */}
                    <TouchableOpacity
                      className="bg-teal-500 py-2 px-4 rounded-full shadow-sm flex items-center justify-center space-x-1 min-w-[90px]"
                      onPress={() => setSelectedAttendance(attendance)}
                    >
                      <Text className="text-white font-medium text-sm">Details</Text>
                      <View className="w-4 h-4 flex items-center justify-center">
                        <View className="border-2 border-white w-2 h-2 rounded-full" />
                        <View className="absolute border-r-2 border-b-2 border-white h-2.5 w-1.5 rotate-45 -translate-y-0.5" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <View className="p-4">
                <Text className="text-center text-gray-500">No attendance data available for the selected date.</Text>
              </View>
            )}
          </View>
        </ScrollView>

        <AttendanceDetailModal
          attendance={selectedAttendance}
          isVisible={!!selectedAttendance}
          onClose={() => setSelectedAttendance(null)}
        />
      </SafeAreaView>
    </Layout>
  );

};

export default AttendanceRecord;