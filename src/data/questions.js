// src/data/questions.js
import { quizService } from '../services/quizService';
import { QuizNetworkError, QuizContentError } from '../utils/quizErrors';

export const getQuizQuestions = async (categoryId = null, difficulty = null) => {
  try {
    return await quizService.getQuestions(categoryId, difficulty);
  } catch (error) {
    // Rethrow the custom errors
    if (error instanceof QuizContentError || error instanceof QuizNetworkError) {
      throw error;
    }
    // Convert unknown errors to QuizNetworkError
    throw new QuizNetworkError('Failed to fetch quiz questions');
  }
};

export const getQuizCategories = async () => {
  try {
    return await quizService.getCategories();
  } catch (error) {
    if (error instanceof QuizContentError || error instanceof QuizNetworkError) {
      throw error;
    }
    throw new QuizNetworkError('Failed to fetch quiz categories');
  }
};