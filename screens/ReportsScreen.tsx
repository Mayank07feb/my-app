import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { format } from 'date-fns';
import Layout from '../components/Layout';

const ReportsScreen: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState<any[]>([]);
    const [latestAttendance, setLatestAttendance] = useState<any[]>([]);
    const screenWidth = Dimensions.get('window').width;
    const currentDate = format(new Date(), 'MMMM, yyyy');

    useEffect(() => {
        fetchLatestAttendance();
    }, []);

    const fetchLatestAttendance = () => {
        const URL = "https://at.realvictorygroups.xyz/api/attendance/day_wise";
        
        fetch(URL)
            .then((res) => res.json())
            .then((data) => {
                setLatestAttendance(data);
                console.log(data);
            });
    };

    const columnWidths = {
        employee: 150,
        officeDays: 100,
        workingDays: 100,
        halfDays: 80,
        leaves: 80,
        lateCount: 80,
        lateInTime: 120,
        goneBeforeTime: 120,
        goneBeforeTimeCount: 120,
        date: 50,
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'present':
                return 'bg-green-100 text-green-800';
            case 'absent':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const onDateChange = (date: Date) => {
        setSelectedDate(format(date, 'yyyy-MM-dd'));
        setShowCalendar(false);
    };

    const handleEmployeeCheck = (employeeName: string) => {
        setSelectedEmployees(prevState =>
            prevState.includes(employeeName)
                ? prevState.filter((name) => name !== employeeName)
                : [...prevState, employeeName]
        );
    };

    const handleClearFilters = () => {
        setSelectedDate('');
        setSelectedEmployees([]);
    };

    const handleDownloadPDF = () => {
        console.log('Download PDF');
    };

    const handleCheckIn = () => {
        console.log('Check In');
    };

    const handleCheckOut = () => {
        console.log('Check Out');
    };

    const AttendanceButtons = () => (
        <View className="bg-white p-4 rounded-lg shadow-sm mb-6">
            {/* Date Display */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-base font-medium text-gray-700">{currentDate}</Text>
            </View>

            {/* Filter Section */}
            <FilterSection />

            {/* Filter Button */}
            <TouchableOpacity
                onPress={() => setShowCalendar(true)}
                className="bg-green-500 p-3 rounded-lg mb-2"
            >
                <Text className="text-white text-center font-medium text-base">Filter</Text>
            </TouchableOpacity>

            {/* Clear Button */}
            <TouchableOpacity
                onPress={handleClearFilters}
                className="bg-teal-500 p-3 rounded-lg mb-2"
            >
                <Text className="text-white text-center font-medium text-base">Clear</Text>
            </TouchableOpacity>

            {/* Check In/Out Buttons */}
            <View className="flex-row justify-between mb-2 gap-2">
                <TouchableOpacity
                    onPress={handleCheckIn}
                    className="flex-1 bg-blue-500 p-3 rounded-lg"
                >
                    <Text className="text-white text-center font-medium text-base">Check In</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={handleCheckOut}
                    className="flex-1 bg-red-500 p-3 rounded-lg"
                >
                    <Text className="text-white text-center font-medium text-base">Check Out</Text>
                </TouchableOpacity>
            </View>

            {/* Download Button */}
            <TouchableOpacity
                onPress={handleDownloadPDF}
                className="bg-yellow-500 p-3 rounded-lg mb-4"
            >
                <Text className="text-white text-center font-medium text-base">Download as PDF</Text>
            </TouchableOpacity>

            {/* Records Section */}
            <View className="items-center">
                <Text className="text-lg font-bold text-blue-500 mb-1">Records</Text>
                <Text className="text-base text-gray-600">Nov-2024</Text>
            </View>
        </View>
    );

    const FilterSection = () => (
        <View className="bg-white p-6 rounded-lg shadow-sm mb-6 max-w-xl">
            <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-1">Select Date</Text>
                <TouchableOpacity
                    onPress={() => setShowCalendar(true)}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white"
                >
                    <Text className="text-sm text-gray-900">
                        {selectedDate || 'YYYY-MM-DD'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="flex-row space-x-4 mt-4">
                <TouchableOpacity
                    onPress={() => console.log('View Record clicked')}
                    className="flex-1 bg-teal-600 py-2 rounded-md"
                >
                    <Text className="text-white text-center font-medium">View Record</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleClearFilters}
                    className="flex-1 bg-gray-100 py-2 rounded-md"
                >
                    <Text className="text-gray-700 text-center font-medium">Clear</Text>
                </TouchableOpacity>
            </View>

            {/* Calendar Modal */}
            <Modal
                visible={showCalendar}
                transparent={true}
                animationType="slide"
            >
                <View className="flex-1 justify-center bg-black/50">
                    <View className="bg-white mx-4 rounded-lg">
                        <View className="p-4 border-b border-gray-200">
                            <Text className="text-lg font-semibold text-gray-900">Select Date</Text>
                        </View>

                        <CalendarPicker
                            onDateChange={onDateChange}
                            selectedDayColor="#0D9488"
                            selectedDayTextColor="#FFFFFF"
                        />

                        <TouchableOpacity
                            onPress={() => setShowCalendar(false)}
                            className="p-4 border-t border-gray-200"
                        >
                            <Text className="text-center text-teal-600 font-medium">Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );

    const TableHeader = () => (
        <View className="flex-row bg-teal-600">
            <View style={{ width: columnWidths.employee }} className="px-4 py-3">
                <Text className="text-white font-medium text-sm">Employee</Text>
            </View>
            <View style={{ width: columnWidths.officeDays }} className="px-4 py-3">
                <Text className="text-white font-medium text-sm">Office Days</Text>
            </View>
            <View style={{ width: columnWidths.workingDays }} className="px-4 py-3">
                <Text className="text-white font-medium text-sm">Working Days</Text>
            </View>
            <View style={{ width: columnWidths.halfDays }} className="px-4 py-3">
                <Text className="text-white font-medium text-sm">Half Days</Text>
            </View>
            <View style={{ width: columnWidths.leaves }} className="px-4 py-3">
                <Text className="text-white font-medium text-sm">Leaves</Text>
            </View>
            <View style={{ width: columnWidths.lateCount }} className="px-4 py-3">
                <Text className="text-white font-medium text-sm">Late Count</Text>
            </View>
            <View style={{ width: columnWidths.lateInTime }} className="px-4 py-3">
                <Text className="text-white font-medium text-sm">Late In Time</Text>
            </View>
            <View style={{ width: columnWidths.goneBeforeTime }} className="px-4 py-3">
                <Text className="text-white font-medium text-sm">Gone Before Time</Text>
            </View>
            <View style={{ width: columnWidths.goneBeforeTimeCount }} className="px-4 py-3">
                <Text className="text-white font-medium text-sm">Gone Before Count</Text>
            </View>
        </View>
    );

    const TableRow = ({ employee }: { employee: any }) => (
        <View key={employee.name} className="flex-row border-b border-gray-200">
            <View style={{ width: columnWidths.employee }} className="px-4 py-3">
                <Text className="text-gray-900">{employee.name}</Text>
            </View>
            <View style={{ width: columnWidths.officeDays }} className="px-4 py-3">
                <Text className="text-gray-900">{employee.officeDays}</Text>
            </View>
            <View style={{ width: columnWidths.workingDays }} className="px-4 py-3">
                <Text className="text-gray-900">{employee.workingDays}</Text>
            </View>
            <View style={{ width: columnWidths.halfDays }} className="px-4 py-3">
                <Text className="text-gray-900">{employee.halfDays}</Text>
            </View>
            <View style={{ width: columnWidths.leaves }} className="px-4 py-3">
                <Text className="text-gray-900">{employee.leaves}</Text>
            </View>
            <View style={{ width: columnWidths.lateCount }} className="px-4 py-3">
                <Text className="text-gray-900">{employee.lateCount}</Text>
            </View>
            <View style={{ width: columnWidths.lateInTime }} className="px-4 py-3">
                <Text className="text-gray-900">{employee.lateInTime}</Text>
            </View>
            <View style={{ width: columnWidths.goneBeforeTime }} className="px-4 py-3">
                <Text className="text-gray-900">{employee.goneBeforeTime}</Text>
            </View>
            <View style={{ width: columnWidths.goneBeforeTimeCount }} className="px-4 py-3">
                <Text className="text-gray-900">{employee.goneBeforeTimeCount}</Text>
            </View>
        </View>
    );

    return (
        <Layout>
            <ScrollView
                contentContainerStyle={{
                    paddingHorizontal: 16,
                    paddingVertical: 24,
                }}
            >
                <AttendanceButtons />
                <TableHeader />
                {latestAttendance.map((employee) => (
                    <TableRow key={employee.name} employee={employee} />
                ))}
            </ScrollView>
        </Layout>
    );
};

export default ReportsScreen;
