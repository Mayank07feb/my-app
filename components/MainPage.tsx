import React from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { ClipboardList } from 'lucide-react-native'; // Updated import
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const MainPage = ({ onContinue }) => {
  return (
    <LinearGradient
      colors={['#008080', '#20B2AA', '#40E0D0']}
      style={styles.gradientContainer}
    >
      {/* Animated Header */}
      <MotiView
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 300 }}
        style={styles.headerContainer}
      >
        <Text style={styles.headerText}>
          Attendance Pro
        </Text>
      </MotiView>
     
      {/* Animated Subheading */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 800, delay: 500 }}
        style={styles.subheading}
      >
        <Text style={styles.subheadingText}>
          Smart Attendance Tracking & Management
        </Text>
      </MotiView>
      
      {/* Animated Icon */}
      <MotiView
        from={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100, damping: 15, delay: 700 }}
        style={styles.iconContainer}
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
        style={styles.buttonContainer}
      >
        <TouchableOpacity
          onPress={onContinue}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Get Started
          </Text>
        </TouchableOpacity>
      </MotiView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 16,
  },
  headerText: {
    color: 'white',
    fontSize: 40,
    fontWeight: 'bold',
  },
  subheading: {
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  subheadingText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 20,
    textAlign: 'center',
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 100,
    padding: 32,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: width * 0.75,
    shadowColor: '#008080',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
});

export default MainPage;