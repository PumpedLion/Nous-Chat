import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment'; // Import moment.js

// Function to format ISO date-time to a readable format
const formatDate = (dateString: string) => {
  return moment(dateString).format('lll');
};

interface AttendanceRecord {
  employeeLoginTime: string;
  employeeLogoutTime?: string;
  breakIn?: string;
  breakOut?: string;
  productiveApps?: number;
  idleTime?: number;
  lateClockIn?: string;
}

const Home = () => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [clockOutTime, setClockOutTime] = useState<string | null>(null);
  const [workedHours, setWorkedHours] = useState<string | null>(null);
  const [activeTime, setActiveTime] = useState<string | null>(null);
  const [productiveApps, setProductiveApps] = useState<number | null>(null);
  const [idleTime, setIdleTime] = useState<number | null>(null);
  const [lateClockIn, setLateClockIn] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('bearerToken');
        if (storedToken) {
          setToken(storedToken);
          fetchAttendanceData(storedToken); // Fetch data with the token
        } else {
          setError('No token found');
        }
      } catch (err) {
        setError('Error fetching token from storage');
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendanceData = async (token: string) => {
      try {
        const response = await fetch('http://192.168.1.92:8000/api/v1/attendance/today-clockin', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch attendance data');
        }

        const data = await response.json();
        const record: AttendanceRecord = data.attendacneRecord;

        // Convert ISO date-time strings to readable format
        setClockInTime(record.employeeLoginTime ? formatDate(record.employeeLoginTime) : 'N/A');
        setClockOutTime(record.employeeLogoutTime ? formatDate(record.employeeLogoutTime) : 'N/A');

        // Calculate worked hours, active time, and other metrics
        const calculateWorkedHours = (record: AttendanceRecord): number => {
          if (!record.employeeLoginTime) return 0; // Return minutes as a number

          const clockInTime = moment(record.employeeLoginTime);
          const clockOutTime = record.employeeLogoutTime ? moment(record.employeeLogoutTime) : moment();
          let totalTime = clockOutTime.diff(clockInTime);

          if (record.breakIn && record.breakOut) {
            const breakInTime = moment(record.breakIn);
            const breakOutTime = moment(record.breakOut);
            totalTime -= breakOutTime.diff(breakInTime);
          }

          return totalTime / (1000 * 60); // Convert milliseconds to minutes
        };

        const calculateActiveTime = (record: AttendanceRecord): string => {
          if (!record.employeeLoginTime) return '0 hr 0 mins';

          const clockInTime = moment(record.employeeLoginTime);
          const now = moment();
          let totalTime = now.diff(clockInTime);

          if (record.breakIn && record.breakOut) {
            const breakInTime = moment(record.breakIn);
            const breakOutTime = moment(record.breakOut);
            totalTime -= breakOutTime.diff(breakInTime);
          }

          const hours = Math.floor(totalTime / (1000 * 60 * 60));
          const minutes = Math.floor((totalTime % (1000 * 60 * 60)) / (1000 * 60));

          return `${hours} hr ${minutes} mins`;
        };

        // Use type assertions to ensure the data is of the correct type
        const totalMinutes = Object.values(record).reduce((accumulatedMinutes, value) => {
          if (typeof value === 'object' && value !== null) {
            return accumulatedMinutes + calculateWorkedHours(value as AttendanceRecord);
          }
          return accumulatedMinutes;
        }, 0);

        const workedHoursTotal = Math.abs(Math.floor(totalMinutes / 60));
        const workedHoursString = `${workedHoursTotal} hr`;

        setActiveTime(calculateActiveTime(record));
        setProductiveApps(record.productiveApps || null);
        setIdleTime(record.idleTime || null);
        setLateClockIn(record.lateClockIn || null);
        setWorkedHours(workedHoursString);
      } catch (err) {
        setError('Error fetching attendance data');
      }
    };

    fetchToken();
  }, []);

  const handleNotification = () => {
    router.replace('/Notification');
  };

  // Determine clock-in container style
  const clockInContainerStyle = lateClockIn && lateClockIn.includes('late') 
    ? styles.clockInContainerLate
    : styles.clockInContainer;

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Header with Logo and Bell Icon */}
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={handleNotification}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Today Attendance Label */}
      <Text style={styles.sectionLabel}>Today Attendance</Text>

      {/* Today's Attendance Section */}
      <View style={styles.attendanceContainer}>
        <View style={styles.clockInOutContainer}>
          {/* Clock In Box */}
          <View style={clockInContainerStyle}>
            <Ionicons name="time-outline" size={24} color="#fff" style={styles.clockIcon} />
            <Text style={styles.clockTextTitle}>Clock In Time</Text>
            <Text style={styles.clockTime}>{clockInTime}</Text>
          </View>

          {/* Clock Out Box */}
          <View style={styles.clockOutContainer}>
            <Ionicons name="time-outline" size={24} color="#fff" style={styles.clockIcon} />
            <Text style={styles.clockTextTitle}>Clock Out Time</Text>
            <Text style={styles.clockTime}>{clockOutTime}</Text>
          </View>
        </View>
      </View>

      {/* My Work Label */}
      <Text style={styles.sectionLabel}>My Work</Text>

      {/* My Work Section */}
      <View style={styles.myWorkContainer}>
        <View style={styles.workDetailContainer}>
          <Text style={styles.workTitle}>Total Worked Hour</Text>
          <Text style={styles.workTime}>{workedHours}</Text>
        </View>
        <View style={styles.workDetailContainer}>
          <Text style={styles.workTitle}>Active Time</Text>
          <Text style={styles.workTime}>{activeTime}</Text>
        </View>
        <View style={styles.workDetailContainer}>
          <Text style={styles.workTitle}>% Productive Apps</Text>
          <Text style={styles.workTime}>{productiveApps !== null ? `${productiveApps}%` : 'N/A'}</Text>
        </View>
        {/* <View style={styles.workDetailContainer}>
          <Text style={styles.workTitle}>% Idle Time Spent</Text>
          <Text style={styles.workTime}>{idleTime !== null ? `${idleTime}%` : 'N/A'}</Text>
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  attendanceContainer: {
    marginBottom: 24,
  },
  clockInOutContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  clockInContainer: {
    backgroundColor: '#FF6F00',
    padding: 16,
    borderRadius: 10,
    width: '48%',
    position: 'relative',
  },
  clockInContainerLate: {
    backgroundColor: '#FF0000', 
    padding: 16,
    borderRadius: 10,
    width: '48%',
    position: 'relative',
  },
  clockOutContainer: {
    backgroundColor: '#4A148C',
    padding: 16,
    borderRadius: 10,
    width: '48%',
    position: 'relative',
  },
  clockTextTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '600',
  },
  clockTime: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clockIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  myWorkContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  workDetailContainer: {
    backgroundColor: '#EEEEEE',
    padding: 16,
    borderRadius: 10,
    width: '48%',
    marginBottom: 16,
  },
  workTitle: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
    fontWeight: '600',
  },
  workTime: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default Home;
