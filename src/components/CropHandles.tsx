// FILE: src/components/CropHandles.tsx (FIXED - Better Touch Response)
// ============================================
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { CONSTANTS } from '../utils/constants';

interface CropHandlesProps {
  onResize: (corner: string, deltaX: number, deltaY: number) => void;
}

export const CropHandles: React.FC<CropHandlesProps> = ({ onResize }) => {
  const createHandleGesture = (corner: string) => {
    const startX = useSharedValue(0);
    const startY = useSharedValue(0);

    return Gesture.Pan()
      .onStart(() => {
        startX.value = 0;
        startY.value = 0;
      })
      .onUpdate((event) => {
        const deltaX = event.translationX - startX.value;
        const deltaY = event.translationY - startY.value;
        
        runOnJS(onResize)(corner, event.translationX, event.translationY);
        
        startX.value = event.translationX;
        startY.value = event.translationY;
      });
  };

  return (
    <>
      <GestureDetector gesture={createHandleGesture('topLeft')}>
        <Animated.View style={[styles.handle, styles.topLeft]}>
          <View style={styles.handleDot} />
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={createHandleGesture('topRight')}>
        <Animated.View style={[styles.handle, styles.topRight]}>
          <View style={styles.handleDot} />
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={createHandleGesture('bottomLeft')}>
        <Animated.View style={[styles.handle, styles.bottomLeft]}>
          <View style={styles.handleDot} />
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={createHandleGesture('bottomRight')}>
        <Animated.View style={[styles.handle, styles.bottomRight]}>
          <View style={styles.handleDot} />
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const HANDLE_SIZE = CONSTANTS.HANDLE_SIZE;

const styles = StyleSheet.create({
  handle: {
    position: 'absolute',
    width: HANDLE_SIZE,
    height: HANDLE_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handleDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'transparent',
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
