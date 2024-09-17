import React from 'react'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // For icons
import { Link } from 'expo-router';

const ChangePassword = () => {
    const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [showPassword, setShowPassword] = useState(false);
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />

        {/* Title and description */}
        <Text style={styles.title}>Change Password</Text>
        <Text style={styles.description}>Confirm your currrent password to change your password</Text>

        {/* Current Password Input */}
        <Text style={styles.label}>Current Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6e6e6e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6e6e6e"
            />
          </TouchableOpacity>
        </View>

         {/* New Password Input */}
        <Text style={styles.label}>New Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6e6e6e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6e6e6e"
            />
          </TouchableOpacity>
        </View>

         {/* Confirm Password Input */}
         <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6e6e6e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6e6e6e"
            />
          </TouchableOpacity>
        </View>

        {/* Log in Button */}
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Change Password</Text>
        </TouchableOpacity>
      </View>
    </ThemeProvider>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#000',
      marginBottom: 8,
    },
    description: {
      fontSize: 14,
      color: '#6e6e6e',
      textAlign: 'center',
      marginBottom: 32,
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
    },
    icon: {
      marginRight: 10,
      color: '#9c27b0',
    },
    input: {
      flex: 1,
      height: 50,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 24,
    },
    rememberMeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rememberMeText: {
      marginLeft: 8,
      color: '#6e6e6e',
    },
    forgotPasswordText: {
      color: '#9c27b0',
    },
    loginButton: {
      backgroundColor: '#9c27b0',
      paddingVertical: 16,
      borderRadius: 30,
      width: '100%',
      alignItems: 'center',
    },
    loginButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
    },
  });

export default ChangePassword