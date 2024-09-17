import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons'; // For icons
import AsyncStorage from '@react-native-async-storage/async-storage'; // For bearer token
import { io, Socket } from 'socket.io-client';

// Define the type for the holiday item
type Holiday = {
  holidayId: string;
  departmentId: string;
  teamId: string;
  companyId: string;
  fromDate: string;
  toDate: string;
  holidayTitle: string;
  holidayType: string;
  holidaySession: string;
  createdAt: string;
  updatedAt: string;
};

export default function Navigation() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Explicitly define the type for holidays state
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState<Socket | null>(null); // State for socket connection

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const token = await AsyncStorage.getItem('bearerToken'); 
        const response = await fetch('http://192.168.1.92:8000/api/v1/holiday/display-holiday', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setHolidays(data.holidaysOfCompany); // Set the holidays with the correct type
      } catch (error) {
        console.error('Error fetching holidays:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHolidays();

    // Socket connection setup
    const initializeSocket = async () => {
      try {
        // Fetch the employeeId from AsyncStorage
        const profileData = await AsyncStorage.getItem('profileData');
        if (profileData) {
          const parsedProfileData = JSON.parse(profileData);
          const employeeId = parsedProfileData.profile.employeeId;

          // Initialize socket connection with employeeId
          const socketConnection = io('http://192.168.1.92:8000', {
            query: { userId: employeeId },
            transports: ['websocket'],
            autoConnect: true, // Auto-connect to socket
          });

          // Set the socket to state
          setSocket(socketConnection);

          // Listen for real-time holiday updates
          socketConnection.on('holidayUpdate', (updatedHoliday: Holiday) => {
            // Update the holidays state with real-time data
            setHolidays((prevHolidays) => 
              prevHolidays.map(holiday =>
                holiday.holidayId === updatedHoliday.holidayId ? updatedHoliday : holiday
              )
            );
          });
        }
      } catch (error) {
        console.error('Error initializing socket:', error);
      }
    };

    initializeSocket();

    // Cleanup the socket connection when component unmounts
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [fontsLoaded]);

  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderHolidayItem = ({ item }: { item: Holiday }) => (
    <View style={styles.holidayCard}>
      <View style={styles.holidayDetails}>
        <Text style={styles.holidayTitle}>{item.holidayTitle}</Text>
        <Text style={styles.holidayDescription}>{item.holidayType}</Text>
      </View>
      <View style={styles.holidayDate}>
        <Text style={styles.holidayDateText}>{new Date(item.fromDate).toDateString()} - {new Date(item.toDate).toDateString()}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Ionicons name="notifications-outline" size={24} color="#6e6e6e" />
      </View>

      {/* Title */}
      <Text style={styles.title}>Upcoming Holidays</Text>

      {/* List of holidays */}
      <FlatList
        data={holidays}
        keyExtractor={(item) => item.holidayId} // Use holidayId as the key
        renderItem={renderHolidayItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  listContent: {
    paddingBottom: 20,
  },
  holidayCard: {
    backgroundColor: '#EDE7F6',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  holidayDetails: {
    flex: 1,
  },
  holidayTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  holidayDescription: {
    fontSize: 14,
    color: '#6e6e6e',
  },
  holidayDate: {
    alignItems: 'flex-end',
  },
  holidayDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
