import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { router } from 'expo-router';

// Define the type for the notification item
type Notification = {
  notificationId: string;
  message: string;
  createdAt: string;
  isRead: boolean;
};

export default function NotificationScreen() {
  const [fontsLoaded] = useFonts({
    'SpaceMono-Regular': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  // Notifications state
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(false); // Track new notifications

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = await AsyncStorage.getItem('bearerToken');
        const response = await fetch('http://192.168.1.92:8000/api/v1/notifications/employee-unread', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();

        // Update this line to use unReadNotifications
        setNotifications(data.unReadNotifications); 
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();

    // Initialize socket connection
    const socket = io('http://192.168.1.92:8000', {
      transports: ['websocket'],
    });

    // Listen for new notifications via socket
    socket.on('newNotification', (newNotification: Notification) => {
      setNotifications(prevNotifications => [newNotification, ...prevNotifications]);
      setHasNewNotification(true); // Show the green dot on the bell icon
    });

    return () => {
      socket.disconnect();
    };
  }, [fontsLoaded]);

  const markAsRead = async (notificationId: string) => {
    try {
      const token = await AsyncStorage.getItem('bearerToken');
      const response = await fetch(`http://192.168.1.92:8000/api/v1/notifications/marked-as-read/${notificationId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // If the notification is marked as read on the server, update the state locally
        setNotifications(prevNotifications =>
          prevNotifications.map(notification =>
            notification.notificationId === notificationId
              ? { ...notification, isRead: true }
              : notification
          )
        );
        setHasNewNotification(false); // Remove green dot when all are read
      } else {
        console.error('Failed to mark notification as read on the server');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId); // Ensure this function is awaited to guarantee the API call is made
  };

  if (!fontsLoaded || loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationCard, item.isRead && styles.readNotification]}
      onPress={() => handleNotificationClick(item.notificationId)} // Trigger API call on press
    >
      <View style={styles.notificationDetails}>
        <Text style={styles.notificationMessage}>{item.message}</Text>
      </View>
      <View style={styles.notificationDate}>
        <Text style={styles.notificationDateText}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>
    </TouchableOpacity>
  );

  const handleNotification = () => {
    router.replace('/Notification');
    setHasNewNotification(false); // Remove green dot when navigating to notification screen
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <TouchableOpacity onPress={handleNotification}>
          <View style={styles.notificationIconWrapper}>
            <Ionicons name="notifications-outline" size={24} color="#000" />
            {hasNewNotification && <View style={styles.greenDot} />} {/* Green dot for new notifications */}
          </View>
        </TouchableOpacity>
      </View>

      {/* Title */}
      <Text style={styles.title}>Notifications</Text>

      {/* List of notifications */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.notificationId}
        renderItem={renderNotificationItem}
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
  notificationCard: {
    backgroundColor: '#EDE7F6',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  readNotification: {
    backgroundColor: '#D3D3D3',
  },
  notificationDetails: {
    flex: 1,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6e6e6e',
  },
  notificationDate: {
    alignItems: 'flex-end',
  },
  notificationDateText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationIconWrapper: {
    position: 'relative',
  },
  greenDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'green',
  },
});
