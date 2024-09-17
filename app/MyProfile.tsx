import React, { useState, useEffect } from 'react';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

// Define the type for the profile data
interface Profile {
  employeeName: string;
  email: string;
  phoneNumber: string;
  position: string;
}

const MyProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null); // State to hold the profile data
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Get the bearer token from AsyncStorage
        const token = await AsyncStorage.getItem('bearerToken');
        if (!token) {
          console.error('No token found');
          return;
        }

        // Fetch profile data from the API
        const response = await fetch('http://192.168.1.92:8000/api/v1/employee/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();

        // Extract only the necessary fields from the profile data
        const { employeeName, email, phoneNumber, position } = data.profile;
        const profileData: Profile = { employeeName, email, phoneNumber, position };
        setProfile(profileData);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <Text>Loading profile...</Text>; // Loading state
  }

  if (!profile) {
    return <Text>Error loading profile data</Text>; // Error state
  }

  const handelNotification = () => {
    router.replace('/Notification');
  };

  return (
    <ThemeProvider value={DarkTheme}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Picture and Name */}
          <View style={styles.profileSection}>
            {/* Displaying profile information */}
            <Image source={require('../assets/images/logo.png')} style={styles.avatar} />
            <Text style={styles.profileName}>{profile.employeeName}</Text>
            <Text style={styles.infoText1}>{profile.position}</Text>          
            <Text style={styles.infoText}>{profile.email}</Text>
            <Text style={styles.infoText}>{profile.phoneNumber}</Text>
          </View>

          {/* Settings Section */}
          <Text style={styles.label}>Settings</Text>
          <TouchableOpacity style={styles.optionRow} onPress={handelNotification}>
            <Ionicons name="notifications-outline" size={20} color="#6e6e6e" />
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>

          {/* Help Section */}
          <Text style={styles.label}>Help</Text>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="help-circle-outline" size={20} color="#6e6e6e" />
            <Text style={styles.optionText}>NousChat FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="document-outline" size={20} color="#6e6e6e" />
            <Text style={styles.optionText}>Privacy Policy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="chatbubble-outline" size={20} color="#6e6e6e" />
            <Text style={styles.optionText}>Ask a Question</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 40,
  },
  profileName: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
    fontSize: 16,
  },
  infoText1: {
    marginBottom: 10,
    fontSize: 16,
    color: '#6E026C',
    fontWeight: 'bold',
  },
  infoText: {
    marginBottom: 10,
    fontSize: 16,
    color: '#6E026C',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    marginLeft: 15,
    fontSize: 16,
    color: '#333',
  },
});

export default MyProfile;
