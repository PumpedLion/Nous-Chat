import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';  // Add this for navigation

interface Employee {
  employeeId: string;
  employeeName: string;
}

const ChatList = () => {
  const [token, setToken] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigation = useNavigation();  // Initialize navigation

  useEffect(() => {
    const fetchTokenAndEmployees = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('bearerToken');
        setToken(storedToken);

        if (storedToken) {
          const response = await fetch('http://192.168.1.92:8000/api/v1/messages/conversations', {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${storedToken}` },
          });

          if (!response.ok) throw new Error('Failed to fetch employee list');
          const data = await response.json();
          setEmployees(data);
        } else {
          setError('No token found');
        }
      } catch (err) {
        setError('Failed to fetch employees');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenAndEmployees();
  }, []);

  const handleChatOpen = (employeeId: string, employeeName: string) => {
    navigation.navigate('Message', { employeeId, employeeName });
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#9c27b0" style={styles.loader} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Ionicons name="notifications-outline" size={24} color="#6e6e6e" />
      </View>
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Recent Messages</Text>
      </View>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.employeeId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleChatOpen(item.employeeId, item.employeeName)}>
            <View style={styles.employeeItem}>
              <Image source={require('../assets/images/logo.png')} style={styles.avatar} />
              <Text style={styles.employeeName}>{item.employeeName}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  employeeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  employeeName: {
    fontSize: 22,
    color: '#000',
    marginLeft: 10, // Adds spacing between avatar and name
  },
  avatar: {
    width: 55,
    height: 55,
    borderRadius: 20, // Makes the image circular
  },
});

export default ChatList;
