// src/services/apiService.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'YOUR_API_BASE_URL'; // e.g., 'https://api.quizapp.com/v1'
const API_ENDPOINTS = {
  QUESTIONS: '/questions',
  CATEGORIES: '/categories',
  SYNC: '/sync',
};

class ApiService {
  constructor() {
    this.axios = axios.create({
      baseURL: BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add request interceptor for auth token
    this.axios.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('@auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Questions endpoints
  async fetchQuestions(params = {}) {
    try {
      const { data } = await this.axios.get(API_ENDPOINTS.QUESTIONS, { params });
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw this.handleError(error);
    }
  }

  async fetchQuestionsByCategory(categoryId, params = {}) {
    try {
      const { data } = await this.axios.get(
        `${API_ENDPOINTS.QUESTIONS}/category/${categoryId}`,
        { params }
      );
      return data;
    } catch (error) {
      console.error('Error fetching questions by category:', error);
      throw this.handleError(error);
    }
  }

  // Categories endpoints
  async fetchCategories() {
    try {
      const { data } = await this.axios.get(API_ENDPOINTS.CATEGORIES);
      return data;
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw this.handleError(error);
    }
  }

  // Sync endpoint
  async syncQuestions(lastSyncTimestamp) {
    try {
      const { data } = await this.axios.get(API_ENDPOINTS.SYNC, {
        params: { lastSync: lastSyncTimestamp }
      });
      return data;
    } catch (error) {
      console.error('Error syncing questions:', error);
      throw this.handleError(error);
    }
  }

  // Error handling
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      switch (status) {
        case 401:
          return new Error('Unauthorized access. Please login again.');
        case 404:
          return new Error('Resource not found.');
        default:
          return new Error(data.message || 'An error occurred while fetching data.');
      }
    } else if (error.request) {
      // Request made but no response received
      return new Error('Network error. Please check your connection.');
    } else {
      // Something happened in setting up the request
      return new Error('An unexpected error occurred.');
    }
  }
}

export const apiService = new ApiService();