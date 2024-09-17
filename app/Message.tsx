import React, { useState, useEffect } from 'react';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MyProfile = () => {
  const [email, setEmail] = useState(''); // Email state
  const [loading, setLoading] = useState(true); // Loading state to simulate data fetching

  // Simulate fetching email from AsyncStorage or backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Simulating fetching data from AsyncStorage (or could be a backend call)
        const storedEmail = await AsyncStorage.getItem('userEmail');
        if (storedEmail) {
          setEmail(storedEmail);
        }
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

  return (
    <ThemeProvider value={DarkTheme}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Profile Picture and Name */}
          <View style={styles.profileSection}>
            <Image source={require('../assets/images/logo.png')} style={styles.avatar} />
            <Text style={styles.profileName}>MD Arsalan</Text>
          </View>

          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6e6e6e" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
          </View>

          {/* Settings Section */}
          <Text style={styles.label}>Settings</Text>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="notifications-outline" size={20} color="#6e6e6e" />
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionRow}>
            <Ionicons name="lock-closed-outline" size={20} color="#6e6e6e" />
            <Text style={styles.optionText}>Change Password</Text>
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
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#e0e0e0', // Placeholder color
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 30,
    paddingHorizontal: 10,
    marginBottom: 16,
    width: '100%',
    height: 50,
  },
  icon: {
    marginRight: 10,
    color: '#9c27b0',
  },
  input: {
    flex: 1,
    height: 50,
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
