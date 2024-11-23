// src/components/QuizErrorBoundary.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const QuizErrorFallback = ({ error, resetError, navigation }) => {
  const getErrorMessage = () => {
    if (error?.message?.includes('network')) {
      return {
        title: 'Connection Error',
        message: 'Please check your internet connection and try again.',
        icon: '🌐'
      };
    }
    if (error?.message?.includes('questions')) {
      return {
        title: 'Quiz Content Error',
        message: 'Unable to load quiz questions. Please try again later.',
        icon: '📝'
      };
    }
    if (error?.message?.includes('timeout')) {
      return {
        title: 'Request Timeout',
        message: 'The server is taking too long to respond. Please try again.',
        icon: '⏱️'
      };
    }
    return {
      title: 'Unexpected Error',
      message: 'Something went wrong. Please try again.',
      icon: '⚠️'
    };
  };

  const errorDetails = getErrorMessage();

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{errorDetails.icon}</Text>
      <Text style={styles.title}>{errorDetails.title}</Text>
      <Text style={styles.message}>{errorDetails.message}</Text>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.retryButton]} 
          onPress={resetError}
        >
          <Text style={styles.buttonText}>Try Again</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.homeButton]}
          onPress={() => navigation.replace('Home')}
        >
          <Text style={styles.buttonText}>Back to Home</Text>
        </TouchableOpacity>
      </View>

      {error?.message && (
        <TouchableOpacity 
          style={styles.detailsContainer}
          onPress={() => console.log('Error details:', error)}
        >
          <Text style={styles.detailsText}>Technical Details</Text>
          <Text style={styles.errorText}>{error.message}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

class QuizErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log to console in development
    if (__DEV__) {
      console.log('Quiz Error:', error);
      console.log('Error Info:', errorInfo);
    }
    
    // Here you could send to your error tracking service
    // Example: Sentry.captureException(error);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <QuizErrorFallback
          error={this.state.error}
          resetError={this.resetError}
          navigation={this.props.navigation}
        />
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  icon: {
    fontSize: 48,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FF5252',
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 120,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
  },
  homeButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  detailsContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    width: '100%',
  },
  detailsText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#FF5252',
    textAlign: 'center',
  },
});

export default QuizErrorBoundary;