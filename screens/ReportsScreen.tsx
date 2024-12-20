import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isWeekend } from 'date-fns';
import Layout from '../components/Layout';

interface Employee {
    id: string;
    name: string;
    attendance: Record<string, { checkIn: string; checkOut: string; status: string }>;
    summary: {
        workingDays: number;
        presentDays: number;
        absentDays: number;
        lateDays: number;
        halfDays: number;
        holidays: number;
        officeDays: number;
        leaves: number;
        lateInTime: number;
        goneBeforeTime: number;
        goneBeforeTimeCount: number;
    };
}

const ReportsScreen: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [daysInMonth, setDaysInMonth] = useState<Date[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const screenWidth = Dimensions.get('window').width;
    const currentDate = format(new Date(), 'MMMM, yyyy');

    useEffect(() => {
        const loadMonthData = (date: Date) => {
            const startDate = startOfMonth(date);
            const endDate = endOfMonth(date);
            const days = eachDayOfInterval({ start: startDate, end: endDate });
            setDaysInMonth(days);

            const mockEmployees = generateMockData(days);
            setEmployees(mockEmployees);
        };

        loadMonthData(selectedDate);
    }, [selectedDate]);

    const generateMockData = (days: Date[]): Employee[] => {
        const mockEmployees = [
            { id: '1', name: 'John Doe' },
            { id: '2', name: 'Jane Smith' },
            { id: '3', name: 'Mike Johnson' },
            { id: '4', name: 'Sarah Williams' }
        ];

        return mockEmployees.map(emp => {
            const attendance: Record<string, any> = {};
            let presentCount = 0, absentCount = 0, lateCount = 0, halfDayCount = 0, holidayCount = 0;
            let officeDays = 0, leaves = 0, lateInTime = 0, goneBeforeTime = 0, goneBeforeTimeCount = 0;

            days.forEach(day => {
                const dateStr = format(day, 'yyyy-MM-dd');
                if (isWeekend(day)) {
                    attendance[dateStr] = { status: 'weekend', checkIn: '--', checkOut: '--' };
                    holidayCount++;
                } else {
                    const random = Math.random();
                    if (random > 0.8) {
                        attendance[dateStr] = { status: 'absent', checkIn: '--', checkOut: '--' };
                        absentCount++;
                        leaves++; // Assuming absences are treated as leaves
                    } else if (random > 0.6) {
                        attendance[dateStr] = { status: 'late', checkIn: '09:30 AM', checkOut: '06:00 PM' };
                        lateCount++;
                        presentCount++;
                        lateInTime++; // Late in time count
                    } else if (random > 0.4) {
                        attendance[dateStr] = { status: 'half-day', checkIn: '09:00 AM', checkOut: '02:00 PM' };
                        halfDayCount++;
                        officeDays++; // Half day also counts as an office day
                    } else {
                        attendance[dateStr] = { status: 'present', checkIn: '09:00 AM', checkOut: '06:00 PM' };
                        presentCount++;
                        officeDays++; // Full day is an office day
                    }
                }
            });

            return {
                id: emp.id,
                name: emp.name,
                attendance,
                summary: {
                    workingDays: days.length - holidayCount,
                    presentDays: presentCount,
                    absentDays: absentCount,
                    lateDays: lateCount,
                    halfDays: halfDayCount,
                    holidays: holidayCount,
                    officeDays,
                    leaves,
                    lateInTime,
                    goneBeforeTime,
                    goneBeforeTimeCount,
                }
            };
        });
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            present: 'bg-green-100 text-green-800',
            absent: 'bg-red-100 text-red-800',
            late: 'bg-yellow-100 text-yellow-800',
            'half-day': 'bg-orange-100 text-orange-800',
            weekend: 'bg-gray-100 text-gray-500',
            holiday: 'bg-blue-100 text-blue-800',
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const AttendanceButtons = () => (
        <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-gray-800">{currentDate}</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                {employees.map(emp => (
                    <TouchableOpacity
                        key={emp.id}
                        onPress={() => setSelectedEmployees(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])}
                        className={`mr-2 px-4 py-2 rounded-full border ${selectedEmployees.includes(emp.id) ? 'bg-teal-500 border-teal-500' : 'bg-white border-gray-300'}`}
                    >
                        <Text className={selectedEmployees.includes(emp.id) ? 'text-white' : 'text-gray-700'}>{emp.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <TouchableOpacity onPress={() => setShowCalendar(true)} className="bg-green-500 p-3 rounded-lg mb-2">
                <Text className="text-white text-center font-medium">Filter</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSelectedEmployees([])} className="bg-teal-500 p-3 rounded-lg mb-2">
                <Text className="text-white text-center font-medium">Clear Filters</Text>
            </TouchableOpacity>

            <View className="flex-row justify-between mb-2 gap-2">
                <TouchableOpacity onPress={() => console.log('Checking In...')} className="flex-1 bg-blue-500 p-3 rounded-lg">
                    <Text className="text-white text-center font-medium">Check In</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => console.log('Checking Out...')} className="flex-1 bg-red-500 p-3 rounded-lg">
                    <Text className="text-white text-center font-medium">Check Out</Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => console.log('Downloading PDF...')} className="bg-yellow-500 p-3 rounded-lg mb-4">
                <Text className="text-white text-center font-medium">Download as PDF</Text>
            </TouchableOpacity>
        </View>
    );

    const AttendanceTable = () => (
        <View className="px-4">
            <View className="bg-white rounded-lg shadow-sm mb-4 flex-1">
                <View className="flex-row">
                    <View className="w-40 flex-shrink-0">
                        <View className="px-4 py-5 border-r border-teal-500 bg-teal-600">
                            <Text className="text-white font-medium">Employee</Text>
                        </View>
                        <ScrollView className="h-full">
                            {employees.filter(emp => selectedEmployees.length === 0 || selectedEmployees.includes(emp.id)).map(emp => (
                                <View key={emp.id} className="px-4 py-5 border-r border-gray-200 bg-gray-50 border-b">
                                    <Text className="font-medium">{emp.name}</Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>

                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View>
                            {/* Table Header with Date column */}
                            <View className="flex-row bg-teal-600">
                                <View className="w-40 px-2 py-3 border-r border-teal-500">
                                    <Text className="text-white font-medium text-center">Date</Text>
                                </View>
                                {daysInMonth.map((day, index) => (
                                    <View key={index} className="w-20 px-2 py-3 border-r border-teal-500">
                                        <Text className="text-white font-medium text-center">{format(day, 'dd')}</Text>
                                        <Text className="text-white text-xs text-center">{format(day, 'EEE')}</Text>
                                    </View>
                                ))}
                                <View className="w-32 px-4 py-3">
                                    <Text className="text-white font-medium text-center">Summary</Text>
                                </View>
                                <View className="w-32 px-4 py-3">
                                    <Text className="text-white font-medium text-center">Office Days</Text>
                                </View>
                                <View className="w-32 px-4 py-3">
                                    <Text className="text-white font-medium text-center">Working Days</Text>
                                </View>
                                <View className="w-32 px-4 py-3">
                                    <Text className="text-white font-medium text-center">Half Days</Text>
                                </View>
                                <View className="w-32 px-4 py-3">
                                    <Text className="text-white font-medium text-center">Leaves</Text>
                                </View>
                                <View className="w-32 px-4 py-3">
                                    <Text className="text-white font-medium text-center">Late Count</Text>
                                </View>
                                <View className="w-32 px-4 py-3">
                                    <Text className="text-white font-medium text-center">Late In Time</Text>
                                </View>
                                <View className="w-32 px-4 py-3">
                                    <Text className="text-white font-medium text-center">Gone Before Time</Text>
                                </View>
                                <View className="w-32 px-4 py-3">
                                    <Text className="text-white font-medium text-center">Gone Before Time Count</Text>
                                </View>
                            </View>

                            {/* Table Body with Check In and Check Out */}
                            {employees.filter(emp => selectedEmployees.length === 0 || selectedEmployees.includes(emp.id)).map(emp => (
                                <View key={emp.id} className="flex-row border-b border-gray-200">
                                    <View className="w-40 px-2 py-3 border-r border-gray-200">
                                        <Text className="font-medium text-center">{emp.name}</Text>
                                    </View>
                                    {daysInMonth.map((day, index) => {
                                        const dateStr = format(day, 'yyyy-MM-dd');
                                        const attendance = emp.attendance[dateStr];
                                        return (
                                            <View key={index} className="w-20 px-2 py-3 border-r border-gray-200">
                                                <View className={`rounded-md p-1 ${getStatusColor(attendance.status)}`}>
                                                    <Text className="text-xs text-center">{attendance.checkIn}</Text>
                                                    <Text className="text-xs text-center">{attendance.checkOut}</Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                    <View className="w-32 px-4 py-3 border-r border-gray-200">
                                        <Text className="text-xs text-center">{emp.summary.workingDays}</Text>
                                    </View>
                                    <View className="w-32 px-4 py-3 border-r border-gray-200">
                                        <Text className="text-xs text-center">{emp.summary.officeDays}</Text>
                                    </View>
                                    <View className="w-32 px-4 py-3 border-r border-gray-200">
                                        <Text className="text-xs text-center">{emp.summary.halfDays}</Text>
                                    </View>
                                    <View className="w-32 px-4 py-3 border-r border-gray-200">
                                        <Text className="text-xs text-center">{emp.summary.leaves}</Text>
                                    </View>
                                    <View className="w-32 px-4 py-3 border-r border-gray-200">
                                        <Text className="text-xs text-center">{emp.summary.lateCount}</Text>
                                    </View>
                                    <View className="w-32 px-4 py-3 border-r border-gray-200">
                                        <Text className="text-xs text-center">{emp.summary.lateInTime}</Text>
                                    </View>
                                    <View className="w-32 px-4 py-3 border-r border-gray-200">
                                        <Text className="text-xs text-center">{emp.summary.goneBeforeTime}</Text>
                                    </View>
                                    <View className="w-32 px-4 py-3 border-r border-gray-200">
                                        <Text className="text-xs text-center">{emp.summary.goneBeforeTimeCount}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>
            </View>
        </View>

    );


    return (
        <Layout>
            <ScrollView className="flex-1 bg-gray-100">
                <AttendanceButtons />
                <AttendanceTable />

                <Modal visible={showCalendar} transparent={true} animationType="slide">
                    <View className="flex-1 justify-center bg-black/50">
                        <View className="bg-white mx-4 rounded-lg">
                            <View className="p-4 border-b border-gray-200">
                                <Text className="text-lg font-semibold">Select Month</Text>
                            </View>
                            <CalendarPicker
                                onDateChange={(date) => {
                                    setSelectedDate(date);
                                    setShowCalendar(false);
                                }}
                                selectedDayColor="#0D9488"
                                selectedDayTextColor="#FFFFFF"
                            />
                            <TouchableOpacity onPress={() => setShowCalendar(false)} className="p-4 border-t border-gray-200">
                                <Text className="text-center text-teal-600 font-medium">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </Layout>
    );
};

export default ReportsScreen;
