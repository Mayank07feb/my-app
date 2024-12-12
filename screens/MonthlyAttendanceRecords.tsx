import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Dimensions, Image } from 'react-native';
import { format } from 'date-fns';
import Layout from '../components/Layout';

const MonthlyAttendanceRecords: React.FC = () => {
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const screenWidth = Dimensions.get('window').width;
  
  // Updated sample records with Lorem Picsum images
  const records = [
    {
      date: '2024-11-20',
      status: 'Present',
      checkIn: '9:00 AM',
      checkOut: '5:00 PM',
      checkInImage: 'https://picsum.photos/100/100?random=1',
      checkOutImage: 'https://picsum.photos/100/100?random=2',
      checkInDistance: '2 km',
      checkOutDistance: '3 km',
      checkInBy: 'John Doe',
      checkOutBy: 'Jane Smith',
      breaks: '30 min',
    },
    {
      date: '2024-11-19',
      status: 'Absent',
      checkIn: '--',
      checkOut: '--',
      checkInImage: null,
      checkOutImage: null,
      checkInDistance: '--',
      checkOutDistance: '--',
      checkInBy: '--',
      checkOutBy: '--',
      breaks: '--',
    },
    {
      date: '2024-11-18',
      status: 'Present',
      checkIn: '9:05 AM',
      checkOut: '5:05 PM',
      checkInImage: 'https://picsum.photos/100/100?random=3',
      checkOutImage: 'https://picsum.photos/100/100?random=4',
      checkInDistance: '1.5 km',
      checkOutDistance: '2 km',
      checkInBy: 'Alice Cooper',
      checkOutBy: 'John Doe',
      breaks: '30 min',
    },
  ];

  const [filteredRecords, setFilteredRecords] = useState<any[]>(records);

  const columnWidths = {
    date: 100,
    status: 80,
    checkIn: 90,
    checkOut: 90,
    image: 120,
    distance: 100,
    person: 120,
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

  const FilterSection = () => (
    <View className="bg-white p-6 rounded-lg shadow-sm mb-6 max-w-xl">
      <View className="flex-row mb-4 space-x-4">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-1">From Date</Text>
          <TextInput
            value={fromDate}
            onChangeText={setFromDate}
            placeholder="YYYY-MM-DD"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-700 mb-1">To Date</Text>
          <TextInput
            value={toDate}
            onChangeText={setToDate}
            placeholder="YYYY-MM-DD"
            className="px-3 py-2 border border-gray-300 rounded-md text-sm bg-white"
          />
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
                  <TableHeader text="Date" width={columnWidths.date} />
                  <TableHeader text="Status" width={columnWidths.status} />
                  <TableHeader text="Check In" width={columnWidths.checkIn} />
                  <TableHeader text="Check Out" width={columnWidths.checkOut} />
                  <TableHeader text="Check In Image" width={columnWidths.image} />
                  <TableHeader text="Check Out Image" width={columnWidths.image} />
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
    </Layout>
  );
};

export default MonthlyAttendanceRecords;