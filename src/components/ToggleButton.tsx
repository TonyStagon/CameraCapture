// src/components/ToggleButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../utils/constants';

interface ToggleButtonProps {
  autoMode: boolean;
  onToggle: () => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({ autoMode, onToggle }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, autoMode && styles.activeButton]}
        onPress={onToggle}
      >
        <Text style={[styles.buttonText, autoMode && styles.activeText]}>
          {autoMode ? '✓ Auto Box' : 'Manual Box'}
        </Text>
      </TouchableOpacity>
      <Text style={styles.helperText}>
        {autoMode 
          ? 'Question is auto-detected. Toggle to adjust manually.' 
          : 'Drag and resize the box to select your question.'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  activeButton: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  buttonText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    color: COLORS.white,
  },
  helperText: {
    marginTop: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});
