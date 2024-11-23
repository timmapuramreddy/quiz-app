// src/screens/QuizScreen.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { getQuizQuestions } from '../data/questions';
import QuizTimer from '../components/QuizTimer';
import QuizErrorBoundary from '../components/QuizErrorBoundary';
import TestControls from '../components/TestControls';
import { useTestMode } from '../context/TestModeContext';
import { QuizNetworkError, QuizContentError, QuizTimeoutError } from '../utils/quizErrors';
import LoadingSpinner from '../components/LoadingSpinner';


function QuizContent({ navigation, route }) {
  const { isTestMode } = useTestMode();


  const handleTestError = (errorType, message) => {
    switch (errorType) {
      case 'network':
        throw new QuizNetworkError(message);
      case 'timeout':
        throw new QuizTimeoutError(message);
      case 'content':
        throw new QuizContentError(message);
      default:
        throw new Error(message);
    }
  };

  const { categoryId, difficulty } = route.params || {};
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const answersRef = useRef([]);
  const answerDetailsRef = useRef([]);

  // Load questions when component mounts
  // Update the useEffect for loading questions:
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add a minimum loading time of 1 second for better UX
        const [loadedQuestions] = await Promise.all([
          getQuizQuestions(categoryId, difficulty),
          new Promise(resolve => setTimeout(resolve, 1000))
        ]);

        if (!loadedQuestions || loadedQuestions.length === 0) {
          throw new QuizContentError('No questions available for this quiz.');
        }

        setQuestions(loadedQuestions);
        resetQuizState();
      } catch (error) {
        if (error instanceof QuizTimeoutError) {
          throw error;
        } else if (error instanceof QuizNetworkError) {
          throw error;
        } else if (error instanceof QuizContentError) {
          setError(error.message);
        } else {
          console.error('Unexpected error:', error);
          throw error;
        }
      } finally {
        // Add a slight delay before hiding the loading state
        setTimeout(() => {
          // setIsLoadingVisible(false);
          setLoading(false);
        }, 300);
      }
    };

  loadData();
}, [categoryId, difficulty]);

  const resetQuizState = () => {
    setCurrentQuestionIndex(0);
    setTimeLeft(30);
    setAnswers([]);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsTimerActive(true);
    answersRef.current = [];
    answerDetailsRef.current = [];
  };

  const moveToNextQuestion = useCallback(() => {
    setShowFeedback(false);
    setSelectedOption(null);
    setIsTimerActive(true);
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30);
    } else {
      const finalAnswers = answerDetailsRef.current;
      const correct = finalAnswers.filter(ans => ans === true).length;
      const incorrect = finalAnswers.filter(ans => ans === false).length;
      const notAttempted = finalAnswers.filter(ans => ans === null).length;
      
      // For overall score calculation, both incorrect and not attempted count as wrong
      const finalScore = correct;
      
      navigation.replace('Result', { 
        score: finalScore,
        total: questions.length,
        correct,
        incorrect,
        notAttempted
      });
    }
  }, [currentQuestionIndex, questions.length, navigation]);
  
  const handleTimeUp = useCallback(() => {
    setIsTimerActive(false);
    setShowFeedback(true);
    
    // When time is up, mark the question as not attempted
    const newAnswers = [...answersRef.current, false];
    const newAnswerDetails = [...answerDetailsRef.current, null];
    
    answersRef.current = newAnswers;
    answerDetailsRef.current = newAnswerDetails;
    setAnswers(newAnswers);

    setTimeout(() => {
      moveToNextQuestion();
    }, 1000);
  }, [moveToNextQuestion]);

  useEffect(() => {
    let timer;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer);
            handleTimeUp();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timeLeft, isTimerActive, handleTimeUp]);

  const handleAnswer = useCallback((option) => {
    if (!questions[currentQuestionIndex]) return;

    setIsTimerActive(false);
    const currentQuestion = questions[currentQuestionIndex];
    setSelectedOption(option);
    setShowFeedback(true);
    
    const isCorrect = option === currentQuestion.correctAnswer;
    const newAnswers = [...answersRef.current, isCorrect];
    const newAnswerDetails = [...answerDetailsRef.current, isCorrect];
    
    answersRef.current = newAnswers;
    answerDetailsRef.current = newAnswerDetails;
    setAnswers(newAnswers);
    
    setTimeout(() => {
      moveToNextQuestion();
    }, 1000);
  }, [currentQuestionIndex, questions, moveToNextQuestion]);

  const getOptionStyle = (index) => {
    if (!showFeedback) return styles.optionButton;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    if (index === currentQuestion.correctAnswer) {
      return [styles.optionButton, styles.correctAnswer];
    }
    
    if (index === selectedOption && selectedOption !== currentQuestion.correctAnswer) {
      return [styles.optionButton, styles.wrongAnswer];
    }
    
    return styles.optionButton;
  };

  // Loading state
  // if (loading) {
  //   return (
  //     <SafeAreaView style={styles.safeArea}>
  //       <View style={[styles.container, styles.centerContent]}>
  //         <ActivityIndicator size="large" color="#4CAF50" />
  //         <Text style={styles.loadingText}>Loading questions...</Text>
  //       </View>
  //     </SafeAreaView>
  //   );r
  // }

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <LoadingSpinner size="default" />
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadQuestions}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentScore = answersRef.current.filter(answer => answer).length;

  // If no current question is found
  if (!currentQuestion) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={[styles.container, styles.centerContent]}>
          <Text style={styles.errorText}>No questions available.</Text>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => navigation.replace('Home')}
          >
            <Text style={styles.retryButtonText}>Return Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {isTestMode && (
        <TestControls onTriggerError={handleTestError} />
      )}
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View style={styles.timerContainer}>
            <QuizTimer timeLeft={timeLeft} totalTime={30} />
            <Text style={styles.timeText}>{timeLeft} seconds left</Text>
          </View>
          
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1}/{questions.length}
            </Text>
            <Text style={styles.scoreText}>
              Score: {currentScore}
            </Text>
          </View>
        </View>
  
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>
              {currentQuestion.question}
            </Text>
            
            <View style={styles.optionsContainer}>
              {currentQuestion.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={getOptionStyle(index)}
                  onPress={() => handleAnswer(index)}
                  disabled={showFeedback}
                >
                  <Text style={[
                    styles.optionText,
                    showFeedback && index === currentQuestion.correctAnswer && styles.correctText,
                    showFeedback && index === selectedOption && 
                    selectedOption !== currentQuestion.correctAnswer && styles.wrongText
                  ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
  
            {timeLeft <= 10 && isTimerActive && (
              <View style={styles.warningContainer}>
                <Text style={[styles.warningText, timeLeft <= 5 && styles.urgentWarning]}>
                  {timeLeft <= 5 ? 'Hurry up!' : 'Time is running out!'}
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default function QuizScreen({ navigation, route }) {
  return (
    <QuizErrorBoundary navigation={navigation}>
      <QuizContent navigation={navigation} route={route} />
    </QuizErrorBoundary>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#FF5252',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 25,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerContainer: {
    marginBottom: 10,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  timeText: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
  },
  scoreText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  questionContainer: {
    flex: 1,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    marginTop: 10,
  },
  optionButton: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 10,
    marginVertical: 6,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  correctAnswer: {
    backgroundColor: '#E8F5E9',
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  wrongAnswer: {
    backgroundColor: '#FFEBEE',
    borderColor: '#FF5252',
    borderWidth: 2,
  },
  optionText: {
    fontSize: 15,
    textAlign: 'center',
    color: '#333',
  },
  correctText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
  wrongText: {
    color: '#FF5252',
    fontWeight: 'bold',
  },
  warningContainer: {
    marginTop: 10,
  },
  warningText: {
    textAlign: 'center',
    color: '#FFA000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  urgentWarning: {
    color: '#FF5252',
    fontSize: 16,
  },
});