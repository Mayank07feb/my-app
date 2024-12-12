import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { ClipboardList } from 'lucide-react';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti'; // Import Moti for animations

const { width } = Dimensions.get('window');

const MainPage = ({ onContinue }) => {
  return (
    <LinearGradient
      colors={['#008080', '#20B2AA', '#40E0D0']}
      className="flex-1 items-center justify-center" // Ensures everything is centered
    >
      {/* Animated Header */}
      <MotiView
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 300 }}
        className="mb-4"
      >
        <Text className="text-white text-5xl font-bold">
          Attendance Pro
        </Text>
      </MotiView>
      
      {/* Animated Subheading */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 800, delay: 500 }}
        className="text-white/90 text-xl text-center mb-10 px-6"
      >
        Smart Attendance Tracking & Management
      </MotiView>

      {/* Animated Icon */}
      <MotiView
        from={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 700 }}
        className="bg-white/25 rounded-full p-8 mb-10"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 15,
        }}
      >
        <ClipboardList 
          color="#ffffff" 
          size={100} 
          strokeWidth={1.5} 
        />
      </MotiView>

      {/* Animated Button */}
      <MotiView
        from={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 1000 }}
        className="w-full items-center justify-center" // Center button horizontally
      >
        <TouchableOpacity 
          onPress={onContinue}
          className="bg-white/20 rounded-full py-4 border-2 border-white/30 flex-row items-center justify-center"
          style={{
            width: width * 0.75,
            shadowColor: "#008080",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.3,
            shadowRadius: 10,
            elevation: 15,
          }}
        >
          <Text className="text-white text-lg font-bold tracking-wider">
            Get Started
          </Text>
        </TouchableOpacity>
      </MotiView>
    </LinearGradient>
  );
};

export default MainPage;
