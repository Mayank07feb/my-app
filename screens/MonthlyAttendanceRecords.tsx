import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions, Image, Modal } from 'react-native';
import { format } from 'date-fns';
import Layout from '../components/Layout';
import CalendarPicker from 'react-native-calendar-picker';

const MonthlyAttendanceRecords: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [isCalendarVisible, setIsCalendarVisible] = useState<boolean>(false);
  const [isSelectingFromDate, setIsSelectingFromDate] = useState<boolean>(true);
  const screenWidth = Dimensions.get('window').width;

  // Updated sample records with additional fields
  const records = [
    {
      name: 'John Doe',
      office: 'New York',
      date: '2024-11-20',
      status: 'Present',
      checkIn: '9:00 AM',
      checkOut: '5:00 PM',
      checkInImage: 'https://picsum.photos/100/100?random=1',
      checkOutImage: 'https://picsum.photos/100/100?random=2',
      checkInNote: 'No issues',
      checkOutNote: 'Completed all tasks',
      workingHours: '8 hours',
      checkInDistance: '2 km',
      checkOutDistance: '3 km',
      checkInBy: 'John Doe',
      checkOutBy: 'Jane Smith',
      breaks: '30 min',
    },
    {
      name: 'Alice Cooper',
      office: 'Los Angeles',
      date: '2024-11-19',
      status: 'Absent',
      checkIn: '--',
      checkOut: '--',
      checkInImage: null,
      checkOutImage: null,
      checkInNote: '--',
      checkOutNote: '--',
      workingHours: '--',
      checkInDistance: '--',
      checkOutDistance: '--',
      checkInBy: '--',
      checkOutBy: '--',
      breaks: '--',
    },
    {
      name: 'Alice Cooper',
      office: 'Los Angeles',
      date: '2024-11-18',
      status: 'Present',
      checkIn: '9:05 AM',
      checkOut: '5:05 PM',
      checkInImage: 'https://picsum.photos/100/100?random=3',
      checkOutImage: 'https://picsum.photos/100/100?random=4',
      checkInNote: 'On time',
      checkOutNote: 'Finished work early',
      workingHours: '8 hours',
      checkInDistance: '1.5 km',
      checkOutDistance: '2 km',
      checkInBy: 'Alice Cooper',
      checkOutBy: 'John Doe',
      breaks: '30 min',
    },
  ];

  const [filteredRecords, setFilteredRecords] = useState<any[]>(records);

  const columnWidths = {
    name: 120,
    office: 120,
    date: 100,
    status: 80,
    checkIn: 90,
    checkOut: 90,
    image: 120,
    distance: 100,
    person: 120,
    workingHours: 100,
    note: 150, // For notes
    breaks: 80,
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

  const handleFilter = () => {
    if (fromDate && toDate) {
      const filtered = records.filter(record => {
        const recordDate = new Date(record.date);
        return recordDate >= new Date(fromDate) && recordDate <= new Date(toDate);
      });
      setFilteredRecords(filtered);
    }
  };

  const handleClear = () => {
    setFromDate('');
    setToDate('');
    setFilteredRecords(records);
  };

  const handleDateSelection = (date: any) => {
    const formattedDate = format(date.toDate(), 'yyyy-MM-dd');
    if (isSelectingFromDate) {
      setFromDate(formattedDate);
    } else {
      setToDate(formattedDate);
    }
    setIsCalendarVisible(false); // Hide calendar after selection
  };

  const FilterSection = () => (
    <View className="bg-white p-6 rounded-lg shadow-sm mb-6 max-w-xl">
      <View className="flex-row mb-4 space-x-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-1">From Date</Text>
          <TouchableOpacity
            onPress={() => {
              setIsSelectingFromDate(true);
              setIsCalendarVisible(true); // Open calendar for From Date
            }}
          >
            <Text className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
              {fromDate || 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-1">To Date</Text>
          <TouchableOpacity
            onPress={() => {
              setIsSelectingFromDate(false);
              setIsCalendarVisible(true); // Open calendar for To Date
            }}
          >
            <Text className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white">
              {toDate || 'Select Date'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row space-x-4">
        <TouchableOpacity
          onPress={handleFilter}
          className="flex-1 bg-teal-600 py-2 rounded-md"
        >
          <Text className="text-white text-center font-medium">Apply Filter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleClear}
          className="flex-1 bg-gray-100 py-2 rounded-md"
        >
          <Text className="text-gray-700 text-center font-medium">Clear</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const TableHeader = ({ text, width }: { text: string; width: number }) => (
    <View style={{ width }} className="px-4 py-3 bg-teal-600">
      <Text className="text-white font-medium text-sm">{text}</Text>
    </View>
  );

  const ImageCell = ({ imageUrl, width }: { imageUrl: string | null; width: number }) => (
    <View style={{ width }} className="px-4 py-3">
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={{ width: 60, height: 60, borderRadius: 8 }}
          resizeMode="cover"
        />
      ) : (
        <View className="w-[60px] h-[60px] bg-gray-200 rounded-lg items-center justify-center">
          <Text className="text-gray-500 text-xs">No image</Text>
        </View>
      )}
    </View>
  );

  const TableCell = ({ text, width, customStyle = '' }: { text: string; width: number; customStyle?: string }) => (
    <View style={{ width }} className={`px-4 py-3 ${customStyle}`}>
      <Text className="text-sm text-gray-900">{text}</Text>
    </View>
  );

  return (
    <Layout>
      <View className="flex-1 bg-gray-50">
        <View className="p-4">
          <Text className="text-2xl font-bold text-gray-900 mb-6">Attendance Records</Text>

          {/* Updated Filter Section */}
          <FilterSection />

          {/* Table */}
          <View className="bg-white rounded-lg shadow-sm overflow-hidden">
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View>
                {/* Header */}
                <View className="flex-row border-b border-gray-200">
                  <TableHeader text="Name" width={columnWidths.name} />
                  <TableHeader text="Office" width={columnWidths.office} />
                  <TableHeader text="Date" width={columnWidths.date} />
                  <TableHeader text="Status" width={columnWidths.status} />
                  <TableHeader text="Check In" width={columnWidths.checkIn} />
                  <TableHeader text="Check Out" width={columnWidths.checkOut} />
                  <TableHeader text="Check In Image" width={columnWidths.image} />
                  <TableHeader text="Check Out Image" width={columnWidths.image} />
                  <TableHeader text="Check In Note" width={columnWidths.note} />
                  <TableHeader text="Check Out Note" width={columnWidths.note} />
                  <TableHeader text="Working Hours" width={columnWidths.workingHours} />
                  <TableHeader text="Check In Distance" width={columnWidths.distance} />
                  <TableHeader text="Check Out Distance" width={columnWidths.distance} />
                  <TableHeader text="Check In By" width={columnWidths.person} />
                  <TableHeader text="Check Out By" width={columnWidths.person} />
                  <TableHeader text="Breaks" width={columnWidths.breaks} />
                </View>

                {/* Body */}
                <ScrollView>
                  {filteredRecords.map((record, index) => (
                    <View
                      key={index}
                      className={`flex-row border-b border-gray-200 items-center ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <TableCell text={record.name} width={columnWidths.name} />
                      <TableCell text={record.office} width={columnWidths.office} />
                      <TableCell text={record.date} width={columnWidths.date} />
                      <TableCell
                        text={record.status}
                        width={columnWidths.status}
                        customStyle={`rounded-md ${getStatusColor(record.status)}`}
                      />
                      <TableCell text={record.checkIn} width={columnWidths.checkIn} />
                      <TableCell text={record.checkOut} width={columnWidths.checkOut} />
                      <ImageCell imageUrl={record.checkInImage} width={columnWidths.image} />
                      <ImageCell imageUrl={record.checkOutImage} width={columnWidths.image} />
                      <TableCell text={record.checkInNote} width={columnWidths.note} />
                      <TableCell text={record.checkOutNote} width={columnWidths.note} />
                      <TableCell text={record.workingHours} width={columnWidths.workingHours} />
                      <TableCell text={record.checkInDistance} width={columnWidths.distance} />
                      <TableCell text={record.checkOutDistance} width={columnWidths.distance} />
                      <TableCell text={record.checkInBy} width={columnWidths.person} />
                      <TableCell text={record.checkOutBy} width={columnWidths.person} />
                      <TableCell text={record.breaks} width={columnWidths.breaks} />
                    </View>
                  ))}
                </ScrollView>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>

      {/* Calendar Modal */}
      <Modal
        visible={isCalendarVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCalendarVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
            <CalendarPicker
              onDateChange={handleDateSelection}
              selectedStartDate={isSelectingFromDate ? new Date(fromDate) : new Date(toDate)}
              startFromMonday={true}
              todayBackgroundColor="blue"
              selectedDayTextColor="white"
            />
            <TouchableOpacity
              onPress={() => setIsCalendarVisible(false)}
              className="mt-4 bg-teal-600 py-2 px-6 rounded-md"
            >
              <Text className="text-white text-center font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </Layout>
  );
};

export default MonthlyAttendanceRecords;
