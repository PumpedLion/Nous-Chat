import { SafeAreaView, View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { router } from 'expo-router';

const holidays = [
    {
      id: '1',
      title: 'CEO Wedding',
      description: 'Private Holiday. Full day',
      date: '7/21/2024',
      day: 'Monday',
    },
  ];
  
const leaveRequests = [
  {
    id: '1',
    date: '7/21/2024',
    reason: 'I am unable to join due to ...',
    days: '2 Days',
    status: 'Approved',
  },
  {
    id: '2',
    date: '7/21/2024',
    reason: 'I am unable to join due to ...',
    days: '2 Days',
    status: 'Rejected',
  },
  {
    id: '3',
    date: '7/21/2024',
    reason: 'I am unable to join due to ...',
    days: '2 Days',
    status: 'Pending',
  },
];

const handleLogin = () => {
  router.replace('/ApplyLeave');
};
const renderHolidayItem = ({ item }:any) => (
  <View style={styles.holidayCard}>
    <View style={styles.holidayDetails}>
      <Text style={styles.holidayTitle}>{item.title}</Text>
      <Text style={styles.holidayDescription}>{item.description}</Text>
    </View>
    <View style={styles.holidayDate}>
      <Text style={styles.holidayDateText}>{item.date}</Text>
      <Text style={styles.holidayDay}>{item.day}</Text>
    </View>
  </View>
);

const renderLeaveRequestItem = ({ item }:any) => (
  <View style={styles.leaveCard}>
    <View style={styles.leaveDetails}>
      <Text style={styles.leaveDate}>{item.date}</Text>
      <Text style={styles.leaveReason}>{item.reason}</Text>
    </View>
    <Text style={styles.leaveDays}>{item.days}</Text>
    <Text style={[styles.leaveStatus, styles[item.status.toLowerCase()]]}>{item.status}</Text>
  </View>
);

const handelHolidays = () => {
  router.replace('/Navigation');
}
const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />
        <Ionicons name="notifications-outline" size={24} color="#6e6e6e" />
      </View>

      {/* Holidays Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Upcoming Holidays</Text>
        <TouchableOpacity onPress={handelHolidays}>
          <Text style={styles.viewAll}>View all</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={holidays}
        keyExtractor={(item) => item.id}
        renderItem={renderHolidayItem}
        // contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Leave Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.title}>Leave</Text>
        <TouchableOpacity style={styles.applyButton} onPress={handleLogin}>
          <Text style={styles.applyButtonText}>Apply Leave</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={leaveRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderLeaveRequestItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles:any = StyleSheet.create({
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
  viewAll: {
    color: '#9c27b0',
    fontSize: 14,
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
  holidayDay: {
    fontSize: 12,
    color: '#6e6e6e',
    marginTop: 4,
  },
  leaveCard: {
    backgroundColor: '#F7F7F7',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leaveDetails: {
    flex: 1,
  },
  leaveDate: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  leaveReason: {
    fontSize: 12,
    color: '#6e6e6e',
  },
  leaveDays: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  leaveStatus: {
    padding: 6,
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 'bold',
  },
  approved: {
    backgroundColor: '#E6F4EA',
    color: '#28A745',
  },
  rejected: {
    backgroundColor: '#FEECEC',
    color: '#DC3545',
  },
  pending: {
    backgroundColor: '#FFF8E1',
    color: '#FFC107',
  },
  applyButton: {
    backgroundColor: '#9c27b0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
