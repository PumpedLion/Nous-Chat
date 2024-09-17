import { useEffect} from 'react';
import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export let socket: Socket | null = null;

const initializeSocket = async () => {
  try {
    const profileData = await AsyncStorage.getItem('profileData');

    if (profileData) {
      const parsedProfileData = JSON.parse(profileData);
      const employeeId = parsedProfileData.profile.employeeId; 

      socket = io('http://192.168.1.92:8000', {
        query: {
          userId: employeeId,
        },
        transports: ['websocket'],
        autoConnect: false,
        forceNew: true,
      });
    }
  } catch (error) {
    console.error('Error initializing socket:', error);
  }
};

useEffect(() => {
  initializeSocket();

  return () => {
    if (socket) {
      socket.disconnect();
    }
  };
}, []);
