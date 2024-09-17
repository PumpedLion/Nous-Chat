import React, { useState, useEffect } from 'react';
import { DarkTheme, ThemeProvider } from '@react-navigation/native';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ApplyLeave = () => {
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [noOfDays, setNoOfDays] = useState('');
    const [reason, setReason] = useState('');
    const [leaveSession, setLeaveSession] = useState('Full Day');
    const [leaveType, setLeaveType] = useState('SICKLEAVE');

    // Function to retrieve token from AsyncStorage
    const getToken = async () => {
        const token = await AsyncStorage.getItem('bearerToken');
        return token;
    };

    // Function to make API call to apply for leave
    const applyForLeave = async () => {
        const token = await getToken();
        if (!token) {
            Alert.alert('Error', 'Token not found. Please login again.');
            return;
        }

        const leaveData = {
            leaveFrom: date.toISOString(), // Sending date as ISO string
            leaveTo: date.toISOString(), // Using the same date for both start and end in this example
            noOfDays: noOfDays,
            reason: reason,
            leaveSession: leaveSession,
            leaveType: leaveType,
        };

        try {
            const response = await fetch('http://192.168.1.92:8000/api/v1/leave/apply-leave', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leaveData),
            });

            if (!response.ok) {
                throw new Error('Failed to apply for leave');
            }

            const result = await response.json();
            Alert.alert('Success', 'Leave applied successfully!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

        const onDateChange = (event, selectedDate) => {
            const currentDate = selectedDate || date;
            setShowDatePicker(false);
            setDate(currentDate);
        };

        const showDatePickerModal = () => {
            setShowDatePicker(true);
        };

    return (
        <ThemeProvider value={DarkTheme}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    {/* UI elements for applying leave */}

                    <Text style={styles.label}>From Date</Text>
                    <TouchableOpacity onPress={showDatePickerModal} style={styles.inputContainer}>
                        <Ionicons name="calendar-outline" size={20} color="#6e6e6e" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={date.toDateString()}
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}

                    {/* To Date */}
                    <Text style={styles.label}>To Date</Text>
                    <TouchableOpacity onPress={showDatePickerModal} style={styles.inputContainer}>
                        <Ionicons name="calendar-outline" size={20} color="#6e6e6e" style={styles.icon} />
                        <TextInput
                            style={styles.input}
                            value={date.toDateString()}
                            editable={false}
                        />
                    </TouchableOpacity>
                    {showDatePicker && (
                        <DateTimePicker
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onDateChange}
                        />
                    )}
                    
                    {/* Leave Session */}
                    <Text style={styles.label}>Leave Session</Text>
                    <View style={styles.inputContainer}>
                        <Picker
                            selectedValue={leaveSession}
                            style={styles.picker} 
                            onValueChange={(itemValue) => setLeaveSession(itemValue)}
                        >
                            <Picker.Item label="Full Day" value="Full Day" />
                            <Picker.Item label="Half Day" value="Half Day" />
                            <Picker.Item label="Hourly" value="Hourly" />
                        </Picker>
                    </View>

                    {/* Leave Type */}
                    <Text style={styles.label}>Leave Type</Text>
                    <View style={styles.inputContainer}>
                        <Picker
                            selectedValue={leaveType}
                            style={styles.picker} 
                            onValueChange={(itemValue) => setLeaveType(itemValue)}
                        >
                            <Picker.Item label="Sick Leave" value="SICKLEAVE" />
                            <Picker.Item label="Casual leave" value="CASUALLEAVE" />
                        </Picker>
                    </View>

                    {/* No of days */}
                    <Text style={styles.label}>No of Days</Text>
                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter number of days"
                            keyboardType="numeric"
                            value={noOfDays}
                            onChangeText={(text) => setNoOfDays(text)}
                        />
                    </View>

                    {/* Reason */}
                    <Text style={styles.label}>Reason</Text>
                    <View style={[styles.inputContainer, { height: 300, alignItems: 'flex-start', paddingTop: 11 }]}>
                        <Ionicons name="document-text-outline" size={20} color="#6e6e6e" style={[styles.icon, { marginTop: 1 }]} />
                        <TextInput
                            style={[styles.input, { height: '100%', textAlignVertical: 'top' }]}
                            placeholder="Enter your reason for leave"
                            multiline
                            value={reason}
                            onChangeText={(text) => setReason(text)}
                        />
                    </View>

                    {/* Apply for Leave Button */}
                    <TouchableOpacity style={styles.applyButton} onPress={applyForLeave}>
                        <Text style={styles.applyButtonText}>Apply for Leave</Text>
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
  header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 1,
      marginTop: 25,
  },
  title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 20,
  },
  divider: {
      borderBottomColor: '#ccc',
      borderBottomWidth: 1,
      marginVertical: 20,
      width: '100%',
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
  picker: {
      flex: 1,
      height: 50,
  },
  applyButton: {
      backgroundColor: '#9c27b0',
      paddingVertical: 16,
      borderRadius: 30,
      width: '100%',
      alignItems: 'center',
  },
  applyButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
  },
});


export default ApplyLeave;
