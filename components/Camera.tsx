import React, { useState, useEffect } from 'react';
import { View, Button, Text } from 'react-native';
import { Camera } from 'expo-camera';

interface CameraComponentProps {
  onCapture: (uri: string) => void;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onCapture }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <Text>Requesting for camera permission...</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      onCapture(photo.uri);
    }
  };

  return (
    <View className="flex-1">
      <Camera style={{ flex: 1 }} ref={setCamera} />
      <Button title="Capture Photo" onPress={takePicture} />
    </View>
  );
};

export default CameraComponent;
