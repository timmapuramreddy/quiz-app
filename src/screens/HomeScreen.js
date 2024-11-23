// src/screens/HomeScreen.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: () => {
            logout();
            // Optionally navigate to login screen
            navigation.navigate('Login');
          },
          style: "destructive"
        }
      ]
    );
  };

  if (user) {
    // Authenticated user view
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome, {user.email}!</Text>
          <Text style={styles.subtitle}>Ready to test your knowledge?</Text>
        </View>

        <View style={styles.userInfoContainer}>
          <Text style={styles.lastScore}>
            Last Score: {user.lastScore || 'No attempts yet'}
          </Text>
          <Text style={styles.quizzesTaken}>
            Quizzes Taken: {user.quizzesTaken || 0}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Quiz')}
        >
          <Text style={styles.startButtonText}>Start Quiz</Text>
        </TouchableOpacity>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Features:</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Multiple choice questions</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Timed questions</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Instant feedback</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureText}>• Detailed results</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Non-authenticated user view
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Quiz App!</Text>
        <Text style={styles.subtitle}>Test your knowledge</Text>
      </View>

      <View style={styles.authContainer}>
        <TouchableOpacity
          style={[styles.authButton, styles.loginButton]}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.authButton, styles.signUpButton]}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => navigation.navigate('Quiz')}
      >
        <Text style={styles.startButtonText}>Start Quiz as Guest</Text>
      </TouchableOpacity>

      <View style={styles.featuresContainer}>
        <Text style={styles.featuresTitle}>Features:</Text>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>• Multiple choice questions</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>• Timed questions</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>• Instant feedback</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureText}>• Detailed results</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  userInfoContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  lastScore: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  quizzesTaken: {
    fontSize: 16,
    color: '#333',
  },
  authContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    gap: 15,
  },
  authButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  loginButton: {
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  signUpButton: {
    backgroundColor: '#4CAF50',
  },
  loginButtonText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    color: '#666',
    paddingHorizontal: 10,
    fontSize: 16,
  },
  startButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#FF5252',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 25,
    width: '100%',
    position: 'absolute',
    bottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  featuresContainer: {
    width: '100%',
    marginTop: 30,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  featureItem: {
    marginBottom: 10,
  },
  featureText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});