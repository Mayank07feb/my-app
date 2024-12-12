import React from 'react';
import { View, SafeAreaView, ScrollView } from 'react-native';
import Header from './Header'; // Import the Header component
import BottomBar from './BottomBar'; // Import the BottomBar component

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <SafeAreaView style={{ flex: 1 , marginTop: 0}}>
      {/* Add a wrapper around the Header with margin */}
      <View style={{ marginTop: 0 }}>
        <Header />
      </View>
      
      {/* Content of the current screen goes here */}
      <ScrollView style={{ flex: 1 }}>
        {children}
      </ScrollView>

      {/* Bottom Bar displayed at the bottom */}
      <BottomBar />
    </SafeAreaView>
  );
};

export default Layout;
