import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform, Image, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import ReactWebcam from 'react-webcam';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrentLocation } from '../utils/geolocation';
import { checkIn } from '../api/checkin';
import Layout from '../components/Layout';

const CheckInScreen: React.FC = () => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [loading, setLoading] = useState(false); // Loading state
  const [checkInRecords, setCheckInRecords] = useState<any[]>([]); // Store check-in records

  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    } else {
      setHasPermission(true); // Assume permission for web
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCapturePhoto = async () => {
    if (Platform.OS === 'web') {
      const webcamElement = document.querySelector('video');
      if (webcamElement) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = webcamElement.videoWidth;
        canvas.height = webcamElement.videoHeight;
        context?.drawImage(webcamElement, 0, 0, canvas.width, canvas.height);
        setPhotoUri(canvas.toDataURL('image/png'));
      }
    } else if (camera) {
      const photo = await camera.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  const handleCheckIn = async () => {
    try {
      const locationData = await getCurrentLocation();
      setLocation(locationData);
      console.log('Checked in at:', locationData);
    } catch (error: any) {
      Alert.alert('Location Error', error.message || 'Unable to fetch location.');
    }
  };

  const handleSubmit = async () => {
    if (!photoUri || !location) {
      Alert.alert('Missing Data', 'Photo and location are required for check-in.');
      return;
    }

    setLoading(true);

    try {
      const result = await checkIn(photoUri, location);
      console.log('Check-in successful:', result.message);
      Alert.alert('Check-in Successful', result.message || 'You have been checked in.');

      // Add to check-in records and reset photo/location
      setCheckInRecords((prev) => [...prev, { photoUri, location, time: currentTime }]);
      setPhotoUri(null);
      setLocation(null);
    } catch (error: any) {
      Alert.alert('Check-in Error', error.message || 'Unable to check in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <ScrollView className="flex-1 p-4 bg-teal-100">
        <View className="flex items-center mb-4">
          <Text className="text-teal-600">{currentTime.toDateString()}</Text>
          <Text className="text-4xl font-bold text-black">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text className="text-gray-500">Current Time</Text>
        </View>

        <View className="flex items-center mb-4">
          <View className="w-40 h-40 rounded-full overflow-hidden bg-gray-300 relative">
            {photoUri ? (
              <Image
                source={{ uri: photoUri }}
                className="w-full h-full object-cover"
                style={{ transform: [{ scaleX: -1 }] }}
              />
            ) : Platform.OS === 'web' ? (
              <ReactWebcam
                audio={false}
                screenshotFormat="image/png"
                mirrored
                className="w-full h-full object-cover"
                style={{ borderRadius: '50%' }}
              />
            ) : hasPermission ? (
              <Camera
                style={{ flex: 1, transform: [{ scaleX: -1 }] }}
                ref={(ref) => setCamera(ref)}
                ratio="1:1"
              />
            ) : (
              <View className="flex items-center justify-center flex-1">
                <Icon name="camera-outline" size={50} color="#6B7280" />
                <Text className="text-gray-500 mt-2">Camera Unavailable</Text>
              </View>
            )}
          </View>
        </View>

        <TouchableOpacity
          onPress={handleCapturePhoto}
          className="bg-teal-600 flex-row items-center justify-center py-3 rounded-lg mb-4"
        >
          <Icon name="camera-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold text-lg ml-2">Capture Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleCheckIn}
          className="bg-teal-500 flex-row items-center justify-center py-3 rounded-lg mb-4"
        >
          <Icon name="log-in-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold text-lg ml-2">Check-In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!photoUri || !location || loading}
          className={`flex-row items-center justify-center py-3 rounded-lg ${
            photoUri && location && !loading ? 'bg-teal-500' : 'bg-gray-400'
          }`}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name="send-outline" size={20} color="#fff" />
              <Text className="text-white font-semibold text-lg ml-2">Submit</Text>
            </>
          )}
        </TouchableOpacity>

        {location && (
          <View className="mt-4">
            <Text className="text-teal-600 text-center">
              Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          </View>
        )}

        {checkInRecords.length > 0 && (
          <View className="mt-6">
            <Text className="text-lg font-semibold text-teal-700 mb-2">Check-In Records:</Text>
            {checkInRecords.map((record, index) => (
              <View key={index} className="flex-row items-center justify-between mb-2">
                <Image
                  source={{ uri: record.photoUri }}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <Text className="text-sm text-gray-700">
                  {record.location.latitude.toFixed(4)}, {record.location.longitude.toFixed(4)}
                </Text>
                <Text className="text-sm text-gray-500">
                  {new Date(record.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </Layout>
  );
};

export default CheckInScreen;
