import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const ControlledInput = ({
  value,
  onChangeText,
  style,
  error,
  ...props
}) => {
  const handleChange = (text) => {
    // Prevent default refresh behavior when 'r' is typed alone
    if (text === 'r' || text === 'R') {
      return;
    }
    // Allow 'r' when it's part of a longer text
    if (text.length > value.length && text.slice(-1).toLowerCase() === 'r') {
      onChangeText(text);
      return;
    }
    onChangeText(text);
  };

  return (
    <TextInput
      value={value}
      onChangeText={handleChange}
      style={[styles.input, error && styles.inputError, style]}
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      keyboardShouldPersistTaps="always"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF5252',
  },
});

export default ControlledInput;