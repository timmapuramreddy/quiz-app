// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';
import { AuthProvider } from './src/context/AuthContext';
import { TestModeProvider } from './src/context/TestModeContext';
import ErrorBoundary from './src/components/ErrorBoundary';

// Import all screens
import HomeScreen from './src/screens/HomeScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultScreen from './src/screens/ResultScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

function AppContent() {
  return (
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#f5f5f5"
        />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f5f5f5',
            },
            headerTintColor: '#333',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerShadowVisible: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUpScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Quiz"
            component={QuizScreen}
            options={{
              headerTitle: 'Quiz',
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="Result"
            component={ResultScreen}
            options={{
              headerTitle: 'Quiz Results',
              headerBackVisible: false,
              gestureEnabled: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <TestModeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </TestModeProvider>
    </ErrorBoundary>
  );
}