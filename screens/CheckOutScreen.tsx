import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ReactWebcam from 'react-webcam'; // For web camera
import { Camera } from 'expo-camera'; // For mobile camera
import { getCurrentLocation } from '../utils/geolocation';
import Layout from '../components/Layout';

const CheckOutScreen: React.FC = () => {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);

  useEffect(() => {
    if (Platform.OS !== 'web') {
      (async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      })();
    } else {
      setHasPermission(true); // Assume permission for the web
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckOut = async () => {
    const locationData = await getCurrentLocation();
    setLocation(locationData);
    console.log('Checked out at:', locationData);
  };

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

  const handleSubmit = () => {
    console.log('Submitting Check-Out with photo and location', { photoUri, location });
  };

  return (
    <Layout>
      <ScrollView className="flex-1 p-4 bg-teal-100">
        {/* Date and Current Time Display */}
        <View className="flex items-center mb-4">
          <Text className="text-teal-600">{currentTime.toDateString()}</Text>
          <Text className="text-4xl font-bold text-black">
            {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text className="text-gray-500">Current Time</Text>
        </View>

        {/* Circular Camera Feed Display */}
        <View className="flex items-center mb-4">
          <View className="w-40 h-40 rounded-full overflow-hidden bg-gray-300">
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

        {/* Capture Photo Button */}
        <TouchableOpacity
          onPress={handleCapturePhoto}
          className="bg-teal-600 flex-row items-center justify-center py-3 rounded-lg mb-4"
        >
          <Icon name="camera-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold text-lg ml-2">Capture Photo</Text>
        </TouchableOpacity>

        {/* Check-Out Button */}
        <TouchableOpacity
          onPress={handleCheckOut}
          className="bg-teal-500 flex-row items-center justify-center py-3 rounded-lg mb-4"
        >
          <Icon name="log-out-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold text-lg ml-2">Check-Out</Text>
        </TouchableOpacity>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={!photoUri || !location}
          className={`flex-row items-center justify-center py-3 rounded-lg ${
            photoUri && location ? 'bg-teal-500' : 'bg-gray-400'
          }`}
        >
          <Icon name="send-outline" size={20} color="#fff" />
          <Text className="text-white font-semibold text-lg ml-2">Submit</Text>
        </TouchableOpacity>

        {/* Location Display */}
        {location && (
          <View className="mt-4">
            <Text className="text-teal-600 text-center">
              Location: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
            </Text>
          </View>
        )}
      </ScrollView>
    </Layout>
  );
};

export default CheckOutScreen;
