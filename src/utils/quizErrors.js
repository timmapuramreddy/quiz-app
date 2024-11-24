// src/utils/quizErrors.js
export class QuizError extends Error {
    constructor(message, type) {
      super(message);
      this.name = 'QuizError';
      this.type = type;
    }
  }
  
  export class QuizNetworkError extends QuizError {
    constructor(message) {
      super(message, 'network');
      this.name = 'QuizNetworkError';
    }
  }
  
  export class QuizContentError extends QuizError {
    constructor(message) {
      super(message, 'content');
      this.name = 'QuizContentError';
    }
  }
  
  export class QuizTimeoutError extends QuizError {
    constructor(message) {
      super(message, 'timeout');
      this.name = 'QuizTimeoutError';
    }
  }