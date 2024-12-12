import Layout from '../components/Layout';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';

const TakeBreakScreen: React.FC = () => {
  const [isOnBreak, setIsOnBreak] = useState(false);
  const [breakTime, setBreakTime] = useState<number>(0); // The time in minutes for the break
  const [timeLeft, setTimeLeft] = useState<number>(0); // Time left on the break in seconds

  const handleStartBreak = () => {
    if (breakTime <= 0) {
      Alert.alert('Invalid Time', 'Please enter a valid time for your break.');
      return;
    }
    setIsOnBreak(true);
    setTimeLeft(breakTime * 60); // Convert minutes to seconds
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isOnBreak && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isOnBreak) {
      setIsOnBreak(false);
      Alert.alert('Break Over', 'Your break time is up!');
    }

    return () => {
      clearInterval(timer);
    };
  }, [isOnBreak, timeLeft]);

  const handleTimeChange = (text: string) => {
    const time = parseInt(text);
    if (!isNaN(time) && time > 0) {
      setBreakTime(time);
    }
  };

  return (
    <Layout>
      <View className="flex-1 justify-center items-center bg-teal-50 p-6 h-screen">
        <Text className="text-4xl font-bold text-teal-700 mb-6">Take a Break</Text>
        <Text className="text-lg text-gray-600 text-center mb-8">
          It's time to take a short break. Enter the duration of your break below:
        </Text>

        <TextInput
          className="border-2 border-teal-300 p-3 rounded-lg text-lg mb-5 w-2/3 text-center"
          placeholder="Enter break time in minutes"
          keyboardType="numeric"
          onChangeText={handleTimeChange}
          value={breakTime > 0 ? breakTime.toString() : ''}
        />

        <TouchableOpacity
          className={`py-3 px-8 rounded-lg mb-5 ${isOnBreak ? 'bg-teal-600' : 'bg-teal-500'}`}
          onPress={handleStartBreak}
        >
          <Text className="text-white text-xl font-semibold text-center">
            {isOnBreak ? 'On Break' : 'Start Break'}
          </Text>
        </TouchableOpacity>

        {isOnBreak && timeLeft > 0 && (
          <Text className="text-lg text-teal-500 font-semibold mt-5">
            Break Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} minutes
          </Text>
        )}

        {!isOnBreak && timeLeft === 0 && breakTime > 0 && (
          <Text className="text-lg text-gray-500 font-semibold mt-5">Break is over. Hope you feel refreshed!</Text>
        )}
      </View>
    </Layout>
  );
};

export default TakeBreakScreen;
