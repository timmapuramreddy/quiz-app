// src/components/LoadingSpinner.js
import React, { useEffect } from 'react';
import { View, Animated, StyleSheet, Text, Easing } from 'react-native';

const LoadingSpinner = ({ size = 'default' }) => {
  // Create animated values for rotations and scaling
  const outerSpinValue = new Animated.Value(0);
  const innerSpinValue = new Animated.Value(0);
  const pulseValue = new Animated.Value(1);

  // Get dimensions based on size prop
  const getSizes = () => {
    switch (size) {
      case 'small':
        return { outer: 64, inner: 48, dot: 8 };
      case 'large':
        return { outer: 128, inner: 112, dot: 16 };
      default:
        return { outer: 96, inner: 80, dot: 12 };
    }
  };

  const dimensions = getSizes();

  useEffect(() => {
    // Outer circle rotation animation
    Animated.loop(
      Animated.timing(outerSpinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Inner circle rotation animation
    Animated.loop(
      Animated.timing(innerSpinValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Center dot pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseValue, {
          toValue: 1.5,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(pulseValue, {
          toValue: 1,
          duration: 500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Interpolate rotations
  const outerSpin = outerSpinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const innerSpin = innerSpinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <View style={[styles.spinnerContainer, { width: dimensions.outer, height: dimensions.outer }]}>
        {/* Outer spinning circle */}
        <Animated.View
          style={[
            styles.circle,
            styles.outerCircle,
            {
              width: dimensions.inner,
              height: dimensions.inner,
              transform: [{ rotate: outerSpin }],
            },
          ]}
        />

        {/* Inner spinning circle */}
        <Animated.View
          style={[
            styles.circle,
            styles.innerCircle,
            {
              width: dimensions.inner,
              height: dimensions.inner,
              transform: [{ rotate: innerSpin }],
            },
          ]}
        />

        {/* Pulsing dot */}
        <Animated.View
          style={[
            styles.dot,
            {
              width: dimensions.dot,
              height: dimensions.dot,
              transform: [{ scale: pulseValue }],
            },
          ]}
        />
      </View>
      <Text style={styles.text}>Loading Quiz Questions...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    position: 'absolute',
    borderWidth: 4,
    borderRadius: 100,
  },
  outerCircle: {
    borderColor: 'transparent',
    borderTopColor: '#4CAF50',
    borderRightColor: '#4CAF50',
  },
  innerCircle: {
    borderColor: 'transparent',
    borderBottomColor: '#2196F3',
    borderLeftColor: '#2196F3',
  },
  dot: {
    position: 'absolute',
    backgroundColor: 'white',
    borderRadius: 100,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default LoadingSpinner;