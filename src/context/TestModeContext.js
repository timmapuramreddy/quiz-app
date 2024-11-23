// src/context/TestModeContext.js
import React, { createContext, useState, useContext } from 'react';

const TestModeContext = createContext(null);

export const TestModeProvider = ({ children }) => {
  const [isTestMode, setIsTestMode] = useState(__DEV__);

  return (
    <TestModeContext.Provider value={{ isTestMode, setIsTestMode }}>
      {children}
    </TestModeContext.Provider>
  );
};

export const useTestMode = () => {
  return useContext(TestModeContext);
};