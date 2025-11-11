// FILE: src/components/CropHandles.tsx (FIXED - Stable Gesture Handling)
// ============================================
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';
import { CONSTANTS } from '../utils/constants';

interface CropHandlesProps {
  onResize: (corner: string, deltaX: number, deltaY: number) => void;
}

export const CropHandles: React.FC<CropHandlesProps> = ({ onResize }) => {
  // Simplified and more stable gestures
  const createHandleGesture = (corner: string) => {
    return Gesture.Pan()
      .minDistance(2) // Minimize jitter
      .onUpdate((event) => {
        runOnJS(onResize)(corner, event.translationX, event.translationY);
      })
      .onEnd(() => {
        // Reset gesture state
        runOnJS(onResize)(corner, 0, 0);
      });
  };

  return (
    <>
      <GestureDetector gesture={createHandleGesture('topLeft')}>
        <View style={[styles.handle, styles.topLeft]}>
          <View style={styles.handleDot} />
        </View>
      </GestureDetector>

      <GestureDetector gesture={createHandleGesture('topRight')}>
        <View style={[styles.handle, styles.topRight]}>
          <View style={styles.handleDot} />
        </View>
      </GestureDetector>

      <GestureDetector gesture={createHandleGesture('bottomLeft')}>
        <View style={[styles.handle, styles.bottomLeft]}>
          <View style={styles.handleDot} />
        </View>
      </GestureDetector>

      <GestureDetector gesture={createHandleGesture('bottomRight')}>
        <View style={[styles.handle, styles.bottomRight]}>
          <View style={styles.handleDot} />
        </View>
      </GestureDetector>
    </>
  );
};

const HANDLE_SIZE = 40; // Increased size for better Android touch

const styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)', // Better visibility
  },
  handleDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#333', // Better visibility
  },
  topLeft: {
    top: -HANDLE_SIZE / 2,
    left: -HANDLE_SIZE / 2,
  },
  topRight: {
    top: -HANDLE_SIZE / 2,
    right: -HANDLE_SIZE / 2,
  },
  bottomLeft: {
    bottom: -HANDLE_SIZE / 2,
    left: -HANDLE_SIZE / 2,
  },
  bottomRight: {
    bottom: -HANDLE_SIZE / 2,
    right: -HANDLE_SIZE / 2,
  },
});
