// src/components/TestControls.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView } from 'react-native';
import { useTestMode } from '../context/TestModeContext';

const TestControls = ({ onTriggerError }) => {
  const { isTestMode, setIsTestMode } = useTestMode();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [lastError, setLastError] = useState(null);

  const errorScenarios = [
    {
      name: 'Network Error',
      type: 'network',
      message: 'Unable to connect to the server',
      description: 'Simulates a network connection failure'
    },
    {
      name: 'Timeout Error',
      type: 'timeout',
      message: 'Request timed out after 10 seconds',
      description: 'Simulates a slow or non-responsive server'
    },
    {
      name: 'Content Error',
      type: 'content',
      message: 'No questions available for this category',
      description: 'Simulates missing or invalid quiz content'
    },
    {
      name: 'Unknown Error',
      type: 'unknown',
      message: 'An unexpected error occurred',
      description: 'Simulates an unexpected application error'
    }
  ];

  const handleErrorTrigger = (scenario) => {
    setLastError(scenario);
    setIsModalVisible(false);
    onTriggerError(scenario.type, scenario.message);
  };

  if (!isTestMode) {
    return (
      <TouchableOpacity
        style={styles.testModeButton}
        onPress={() => setIsTestMode(true)}
      >
        <Text style={styles.testModeButtonText}>Enable Test Mode</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.mainButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.mainButtonText}>🧪 Test Controls</Text>
      </TouchableOpacity>

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Test Error Scenarios</Text>
            <ScrollView style={styles.scenariosList}>
              {errorScenarios.map((scenario) => (
                <TouchableOpacity
                  key={scenario.type}
                  style={styles.scenarioButton}
                  onPress={() => handleErrorTrigger(scenario)}
                >
                  <Text style={styles.scenarioName}>{scenario.name}</Text>
                  <Text style={styles.scenarioDescription}>
                    {scenario.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            {lastError && (
              <View style={styles.lastErrorContainer}>
                <Text style={styles.lastErrorTitle}>Last Tested:</Text>
                <Text style={styles.lastErrorText}>{lastError.name}</Text>
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setIsModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.disableButton}
                onPress={() => {
                  setIsTestMode(false);
                  setIsModalVisible(false);
                }}
              >
                <Text style={styles.disableButtonText}>Disable Test Mode</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1000,
  },
  testModeButton: {
    backgroundColor: '#2196F3',
    padding: 8,
    borderRadius: 20,
  },
  testModeButtonText: {
    color: 'white',
    fontSize: 12,
  },
  mainButton: {
    backgroundColor: '#FF9800',
    padding: 8,
    borderRadius: 20,
  },
  mainButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  scenariosList: {
    maxHeight: 400,
  },
  scenarioButton: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  scenarioName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  scenarioDescription: {
    fontSize: 14,
    color: '#666',
  },
  lastErrorContainer: {
    marginTop: 15,
    padding: 10,
    backgroundColor: '#FFF3E0',
    borderRadius: 10,
  },
  lastErrorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF9800',
  },
  lastErrorText: {
    fontSize: 14,
    color: '#666',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
  },
  closeButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  disableButton: {
    backgroundColor: '#FF5252',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    marginLeft: 10,
  },
  disableButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default TestControls;