import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ResultScreen({ navigation, route }) {
  const { score, total, correct, incorrect, notAttempted } = route.params;
  const percentage = ((score / total) * 100).toFixed(1);

  const getMessage = () => {
    const numericPercentage = parseFloat(percentage);
    if (numericPercentage === 100) return "Perfect Score! 🎉";
    if (numericPercentage >= 80) return "Excellent! 🌟";
    if (numericPercentage >= 60) return "Good Job! 👍";
    if (numericPercentage >= 40) return "Not Bad! 💪";
    if (numericPercentage > 0) return "Keep Practicing! 📚";
    return "Try Again! 🎯";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultText}>{getMessage()}</Text>
      
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabel}>Your Score:</Text>
        <Text style={styles.scoreText}>
          {score} out of {total} correct
        </Text>
        <Text style={styles.percentageText}>
          {percentage}%
        </Text>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>Detailed Breakdown:</Text>
        <View style={styles.statRow}>
          <View style={[styles.statIndicator, styles.correctIndicator]} />
          <Text style={styles.statsText}>
            Correct: {correct}
          </Text>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.statIndicator, styles.incorrectIndicator]} />
          <Text style={styles.statsText}>
            Incorrect: {incorrect}
          </Text>
        </View>
        <View style={styles.statRow}>
          <View style={[styles.statIndicator, styles.notAttemptedIndicator]} />
          <Text style={styles.statsText}>
            Not Attempted: {notAttempted}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  resultText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 20,
    textAlign: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  scoreLabel: {
    fontSize: 20,
    color: '#666',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 24,
    color: '#333',
    marginBottom: 10,
    fontWeight: '500',
  },
  percentageText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 20,
  },
  statsContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  statIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  correctIndicator: {
    backgroundColor: '#4CAF50',
  },
  incorrectIndicator: {
    backgroundColor: '#FF5252',
  },
  notAttemptedIndicator: {
    backgroundColor: '#FFA000',
  },
  statsText: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});