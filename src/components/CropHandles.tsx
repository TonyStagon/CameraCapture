// FILE: src/components/CropHandles.tsx (FIXED - Proper Delta Tracking)
// ============================================
import React, { useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

interface CropHandlesProps {
  onResize: (corner: string, deltaX: number, deltaY: number) => void;
}

export const CropHandles: React.FC<CropHandlesProps> = ({ onResize }) => {
  const createHandleGesture = (corner: string) => {
    const lastTranslation = useRef({ x: 0, y: 0 });

    return Gesture.Pan()
      .minDistance(3)
      .onStart(() => {
        lastTranslation.current = { x: 0, y: 0 };
      })
      .onUpdate((event) => {
        const deltaX = event.translationX - lastTranslation.current.x;
        const deltaY = event.translationY - lastTranslation.current.y;
        
        lastTranslation.current = {
          x: event.translationX,
          y: event.translationY
        };
        
        onResize(corner, deltaX, deltaY);
      })
      .onEnd(() => {
        lastTranslation.current = { x: 0, y: 0 };
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

const HANDLE_SIZE = 44;

const styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  handleDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#4A90E2',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
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
