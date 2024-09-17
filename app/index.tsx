import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { useColorScheme, Alert } from 'react-native'; 
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem('bearerToken');
      setToken(storedToken);
    };
    getToken();
  }, []);

  useEffect(() => {
    const hideSplashScreen = async () => {
      if (loaded) {
        await SplashScreen.hideAsync();
      }
    };
    hideSplashScreen();
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const fetchProfileData = async (token: string) => {
    try {
      const response = await fetch('http://192.168.1.92:8000/api/v1/employee/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const profileData = await response.json();

      // Store the profile data in AsyncStorage
      await AsyncStorage.setItem('profileData', JSON.stringify(profileData));

    } catch (err: any) {
      console.error('Error fetching profile data:', err);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('http://192.168.1.92:8000/api/v1/employee/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      const token = data.token;

      // Store the token dynamically in AsyncStorage
      await AsyncStorage.setItem('bearerToken', token);

      // Fetch profile data using the token and store it in AsyncStorage
      await fetchProfileData(token);

      // Navigate to the next screen
      router.replace('/ClockIn');

    } catch (err: any) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View style={styles.container}>
        {/* Logo */}
        <Image source={require('../assets/images/logo.png')} style={styles.logo} />

        {/* Title and description */}
        <Text style={styles.title}>Log in Account</Text>
        <Text style={styles.description}>
          Enter your email and password to login to your account to nous chat
        </Text>

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

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#6e6e6e" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            value={password}
            onChangeText={(text) => setPassword(text)}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={20}
              color="#6e6e6e"
            />
          </TouchableOpacity>
        </View>

        {/* Remember me and Forgot Password */}
        <View style={styles.row}>
          <TouchableOpacity 
            style={styles.rememberMeContainer}
            onPress={() => setRememberMe(!rememberMe)} 
          >
            <Ionicons
              name={rememberMe ? "checkbox" : "checkbox-outline"}
              size={20}
              color="#6e6e6e"
            />
            <Text style={styles.rememberMeText}>Remember me</Text>
          </TouchableOpacity>
        </View>

        {/* Error message */}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {/* Log in Button */}
        <TouchableOpacity 
          style={[styles.loginButton, isLoading && styles.disabledButton]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Log in</Text>
          )}
        </TouchableOpacity>
      </View>
    </ThemeProvider>
  );
};

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
  errorText: {
    color: 'red',
    marginBottom: 16,
    textAlign: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
});

export default LoginScreen;