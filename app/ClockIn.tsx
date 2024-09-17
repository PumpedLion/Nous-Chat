import { router } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ClockIn = () => {
  const [status, setStatus] = useState('Clock In');
  const [timer, setTimer] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [showClockOut, setShowClockOut] = useState(false);
  const [greeting, setGreeting] = useState('Good Morning');

  // Retrieve token from AsyncStorage
  const getToken = async () => {
    const token = await AsyncStorage.getItem('bearerToken');
    return token;
  };

  // API request function
  const makeApiCall = async (endpoint) => {
    const token = await getToken();
    if (!token) {
      Alert.alert('Error', 'Token not found. Please login again.');
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      console.log('API response:', data);
      // Optionally, handle response data here
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleLeave = () => {
    router.replace('/ApplyLeave');
  };

  const handleHome = () => {
    router.replace('/TabNavigation');
  };

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour >= 12 && currentHour < 18) {
      setGreeting('Good Afternoon');
    } else {
      setGreeting('Good Evening');
    }
  }, []);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setTimer((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isActive && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const handleClockIn = () => {
    if (status === 'Clock In') {
      makeApiCall('http://192.168.1.92:8000/api/v1/attendance/clock-in'); // Call Clock In API
      setStatus('Take a Break');
      setIsActive(true);
      setShowClockOut(true);
    } else if (status === 'Take a Break') {
      makeApiCall('http://192.168.1.92:8000/api/v1/attendance/take-break'); // Call Take Break API
      setStatus('Get Back to Work');
      setIsActive(false);
    } else if (status === 'Get Back to Work') {
      makeApiCall('http://192.168.1.92:8000/api/v1/attendance/break-out'); // Call Break Out API
      setStatus('Take a Break');
      setIsActive(true);
    }
  };

  const handleClockOut = () => {
    makeApiCall('http://192.168.1.92:8000/api/v1/attendance/clock-out'); // Call Clock Out API
    setIsActive(false);
    setStatus('Clock In');
    setTimer(0);
    setShowClockOut(false);
  };

  const formatTime = (time) => {
    const getSeconds = `0${time % 60}`.slice(-2);
    const minutes = `${Math.floor(time / 60)}`;
    const getMinutes = `0${minutes % 60}`.slice(-2);
    const getHours = `0${Math.floor(time / 3600)}`.slice(-2);
    return `${getHours}:${getMinutes}:${getSeconds}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
      </View>
      <Text style={styles.greeting}>{greeting}</Text>
      <Text style={styles.subText}>Let's get started with Your Work</Text>

      <Text style={styles.timer}>{formatTime(timer)}</Text>

      <TouchableOpacity style={styles.clockInButton} onPress={handleClockIn}>
        <Text style={styles.clockInText}>{status}</Text>
      </TouchableOpacity>

      {showClockOut && (
        <TouchableOpacity style={styles.clockOutButton} onPress={handleClockOut}>
          <Text style={styles.clockOutText}>Clock Out</Text>
        </TouchableOpacity>
      )}

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.actionButton} onPress={handleHome}>
          <Text style={styles.actionText}>Your Work Reports</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLeave}>
          <Text style={styles.actionText}>Apply for Leave</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  logoContainer: { marginBottom: 20 },
  logo: { width: 150, height: 150 },
  greeting: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  subText: { fontSize: 16, color: '#777', marginBottom: 20 },
  clockInButton: { backgroundColor: '#9c27b0', paddingVertical: 15, paddingHorizontal: 80, borderRadius: 30, marginBottom: 20 },
  clockInText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  clockOutButton: { backgroundColor: '#D32F2F', paddingVertical: 15, paddingHorizontal: 80, borderRadius: 30, marginBottom: 20 },
  clockOutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  timer: { fontSize: 25, color: '#9c27b0', marginBottom: 20 },
  actionsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '90%' },
  actionButton: { borderColor: '#9c27b0', borderWidth: 2, borderRadius: 20, paddingVertical: 10, paddingHorizontal: 20, marginHorizontal: 10 },
  actionText: { color: '#9c27b0', fontSize: 16, fontWeight: 'bold' },
});

export default ClockIn;
