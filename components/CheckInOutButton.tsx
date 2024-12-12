import React from 'react';
import { Button } from 'react-native';

interface CheckInOutButtonProps {
  onPress: () => void;
  isCheckedIn: boolean;
}

const CheckInOutButton: React.FC<CheckInOutButtonProps> = ({ onPress, isCheckedIn }) => (
  <Button title={isCheckedIn ? 'Check-Out' : 'Check-In'} onPress={onPress} />
);

export default CheckInOutButton;
