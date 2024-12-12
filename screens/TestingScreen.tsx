import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Image, ActivityIndicator, TouchableOpacity, Modal, SafeAreaView, Dimensions } from 'react-native';
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
                    {/* Modal Header */}
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
                        {/* Personal Info Section */}
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

                        {/* Check-In Section */}
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

                        {/* Check-Out Section */}
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

                        {/* Additional Info Section */}
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

const TestingScreen = () => {
    const [attendanceData, setAttendanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAttendance, setSelectedAttendance] = useState(null);

    const screenWidth = Dimensions.get('window').width;

    useEffect(() => {
        const getAttendanceData = async () => {
            try {
                const data = await fetchAttendanceData();
                setAttendanceData(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        getAttendanceData();
    }, []);

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
        <SafeAreaView className="flex-1 bg-gray-100">
            <View className="bg-teal-600 p-4 shadow-md">
                <Text className="text-2xl font-bold text-white text-center">
                    Attendance Data
                </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ minWidth: screenWidth * 2 }} className="border border-gray-300 rounded-md overflow-hidden">
                    {/* Table Header */}
                    <View className="flex-row bg-teal-600">
                        {[
                            'Name', 'Office', 'Check-In', 'Check-In Image', 'Check-In Note',
                            'Check-Out Time', 'Check-Out Image', 'Check-Out Note', 
                            'Working Hours', 'Check-In Distance', 'Check-Out Distance', 'Actions'
                        ].map((header, index) => (
                            <Text
                                key={index}
                                className="text-white font-semibold text-center p-3 border-r border-teal-400"
                                style={{ 
                                    flex: header === 'Actions' ? 1 : 2,
                                    fontSize: 12
                                }}
                            >
                                {header}
                            </Text>
                        ))}
                    </View>

                    {/* Table Rows */}
                    {attendanceData && attendanceData.length > 0 ? (
                        attendanceData.map((attendance, index) => (
                            <TouchableOpacity
                                key={attendance.id}
                                onPress={() => setSelectedAttendance(attendance)}
                                className={`flex-row ${
                                    index % 2 === 0 ? 'bg-white' : 'bg-teal-50'
                                }`}
                            >
                                <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                                    {attendance.name}
                                </Text>
                                <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                                    {attendance.office_id || 'N/A'}
                                </Text>
                                <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                                    {attendance.check_in_time
                                        ? new Date(attendance.check_in_time).toLocaleTimeString()
                                        : 'N/A'}
                                </Text>
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
                                <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                                    {attendance.latest_attendance?.check_in_note || 'N/A'}
                                </Text>
                                <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                                    {attendance.check_out_time
                                        ? new Date(attendance.check_out_time).toLocaleTimeString()
                                        : 'N/A'}
                                </Text>
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
                                <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                                    {attendance.latest_attendance?.check_out_note || 'N/A'}
                                </Text>
                                <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                                    {attendance.office_time || 'N/A'}
                                </Text>
                                <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                                    {attendance.latest_attendance?.check_in_distance || 'N/A'}
                                </Text>
                                <Text className="p-3 text-center border-r border-gray-300" style={{ flex: 2 }}>
                                    {attendance.latest_attendance?.check_out_distance || 'N/A'}
                                </Text>
                                <View className="p-3 justify-center items-center" style={{ flex: 1 }}>
                                    <TouchableOpacity 
                                        className="bg-teal-500 py-2 px-4 rounded-md"
                                        onPress={() => setSelectedAttendance(attendance)}
                                    >
                                        <Text className="text-white text-center text-sm">Details</Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        ))
                    ) : (
                        <View className="p-4">
                            <Text className="text-center text-gray-500">No attendance data available.</Text>
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
    );
};

export default TestingScreen;