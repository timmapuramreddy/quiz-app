// src/services/quizService.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuizNetworkError, QuizContentError, QuizTimeoutError } from '../utils/quizErrors';

const STORAGE_KEYS = {
  QUESTIONS: '@quiz_questions',
  CATEGORIES: '@quiz_categories',
  LAST_SYNC: '@quiz_last_sync',
};

class QuizService {
  constructor() {
    this.initialized = false;
    this.questions = [];
    this.categories = [];
  }

  async initialize() {
    if (this.initialized) return;

    try {
      await this.loadLocalData();
      this.initialized = true;
    } catch (error) {
      console.error('Error initializing quiz service:', error);
      throw new QuizContentError('Failed to initialize quiz data');
    }
  }

  async loadLocalData() {
    try {
      const [questionsData, categoriesData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.QUESTIONS),
        AsyncStorage.getItem(STORAGE_KEYS.CATEGORIES)
      ]);

      if (!questionsData && !categoriesData) {
        // First time loading - set default data
        await this.setQuestions(DEFAULT_QUESTIONS);
        await this.setCategories(DEFAULT_CATEGORIES);
      } else {
        this.questions = questionsData ? JSON.parse(questionsData) : DEFAULT_QUESTIONS;
        this.categories = categoriesData ? JSON.parse(categoriesData) : DEFAULT_CATEGORIES;
      }
    } catch (error) {
      throw new QuizContentError('Failed to load quiz data from storage');
    }
  }

  async getQuestions(categoryId = null, difficulty = null) {
    try {
      await this.initialize();

      // Simulate network delay (remove in production)
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (!this.questions || this.questions.length === 0) {
        throw new QuizContentError('No questions available');
      }

      let filteredQuestions = [...this.questions];
      
      if (categoryId) {
        filteredQuestions = filteredQuestions.filter(q => q.categoryId === categoryId);
        if (filteredQuestions.length === 0) {
          throw new QuizContentError(`No questions available for category: ${categoryId}`);
        }
      }
      
      if (difficulty) {
        filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
        if (filteredQuestions.length === 0) {
          throw new QuizContentError(`No questions available for difficulty: ${difficulty}`);
        }
      }

      return filteredQuestions;
    } catch (error) {
      if (error instanceof QuizContentError) {
        throw error;
      }
      throw new QuizNetworkError('Failed to retrieve questions');
    }
  }

  async setQuestions(questions) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
      this.questions = questions;
    } catch (error) {
      throw new QuizContentError('Failed to save questions');
    }
  }

  async setCategories(categories) {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
      this.categories = categories;
    } catch (error) {
      throw new QuizContentError('Failed to save categories');
    }
  }
}

export const quizService = new QuizService();