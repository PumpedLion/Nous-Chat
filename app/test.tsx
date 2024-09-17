import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import * as NavigationBar from 'expo-navigation-bar';
import { FontAwesome } from '@expo/vector-icons';  // Import Expo's FontAwesome

// Home screen component
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  </View>
);

// Profile screen component
const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    
  </View>
);

// Settings screen component
const SettingsScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
   
  </View>
);

// ChatList screen component
const ChatListScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
   
  </View>
);

// Create the tab navigator
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  // Use effect to customize the system navigation bar on Android
  useEffect(() => {
    // Set the background color of the system navigation bar
    NavigationBar.setBackgroundColorAsync('#6E026C');
    // Set the navigation bar buttons' color
    NavigationBar.setButtonStyleAsync('light'); // 'light' or 'dark'
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { backgroundColor: '#6E026C', height: 70 },
        tabBarShowLabel: false,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={30} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={30} color={color} />,
        }}
      />
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="comments" size={30} color={color} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ color }) => <FontAwesome name="cog" size={30} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
  