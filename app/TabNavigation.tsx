import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';  // Import FontAwesome for icons]
import Home from './home';
import Profile from './ProfileScreen';
import ChatList from './ChatListScreen';
import Settings from './SettingsScreen';
import MyProfile from './MyProfile';

// Screen components
// const HomeScreen = () => <Text>Home Screen</Text>;
// const Profile = () => <Text>Profile Screen</Text>;
// const ChatList = () => <Text>Chat List Screen</Text>;
// const Settings = () => <Text>Settings Screen</Text>;

const TabNavigator = () => {
  const [currentScreen, setCurrentScreen] = useState('Home');

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Home':
        return <Home />;
      case 'Profile':
        return <Profile />;
      case 'ChatList':
        return <ChatList />;
      case 'Settings':
        return <MyProfile />;
      default:
        return <Home />;
    }
  };
 
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.screenContainer}>{renderScreen()}</View>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => setCurrentScreen('Home')}>
          <FontAwesome name="home" size={30} color={currentScreen === 'Home' ? 'white' : 'gray'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('Profile')}>
          <FontAwesome name="user" size={30} color={currentScreen === 'Profile' ? 'white' : 'gray'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('ChatList')}>
          <FontAwesome name="comments" size={30} color={currentScreen === 'ChatList' ? 'white' : 'gray'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentScreen('Settings')}>
          <FontAwesome name="cog" size={30} color={currentScreen === 'Settings' ? 'white' : 'gray'} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: { flex: 1 },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#6E026C',
    padding: 10,
    height: 70,
    alignItems: 'center',
  },
});

export default TabNavigator;
