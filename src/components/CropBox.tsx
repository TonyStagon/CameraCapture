// src/components/CropBox.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { CropRegion, ImageDimensions } from '../types';
import { CropHandles } from './CropHandles';
import { constrainCropRegion } from '../utils/imageUtils';
import { CONSTANTS, COLORS } from '../utils/constants';
import { logger } from '../services/logging';

interface CropBoxProps {
  cropRegion: CropRegion;
  onCropChange: (region: CropRegion) => void;
  imageDimensions: ImageDimensions;
  displayDimensions: ImageDimensions;
}

export const CropBox: React.FC<CropBoxProps> = ({
  cropRegion,
  onCropChange,
  imageDimensions,
  displayDimensions,
}) => {
  const scale = displayDimensions.width / imageDimensions.width;
  
  // Shared values for smooth animations
  const translationX = useSharedValue(cropRegion.x * scale);
  const translationY = useSharedValue(cropRegion.y * scale);
  const width = useSharedValue(cropRegion.width * scale);
  const height = useSharedValue(cropRegion.height * scale);

  // Pan gesture for moving the crop box
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      const newX = event.translationX + cropRegion.x * scale;
      const newY = event.translationY + cropRegion.y * scale;

      // Constrain to image bounds
      translationX.value = Math.max(
        0,
        Math.min(newX, displayDimensions.width - width.value)
      );
      translationY.value = Math.max(
        0,
        Math.min(newY, displayDimensions.height - height.value)
      );
    })
    .onEnd(() => {
      const newRegion: CropRegion = {
        x: translationX.value / scale,
        y: translationY.value / scale,
        width: cropRegion.width,
        height: cropRegion.height,
      };

      const constrained = constrainCropRegion(
        newRegion,
        imageDimensions,
        CONSTANTS.MIN_CROP_SIZE
      );

      logger.cropBoxDragged({ x: constrained.x, y: constrained.y });
      onCropChange(constrained);

      // Snap to constrained position
      translationX.value = withSpring(constrained.x * scale);
      translationY.value = withSpring(constrained.y * scale);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
    ],
    width: width.value,
    height: height.value,
  }));

  const handleResize = (corner: string, deltaX: number, deltaY: number) => {
    const newRegion = { ...cropRegion };

    switch (corner) {
      case 'topLeft':
        newRegion.x += deltaX / scale;
        newRegion.y += deltaY / scale;
        newRegion.width -= deltaX / scale;
        newRegion.height -= deltaY / scale;
        break;
      case 'topRight':
        newRegion.y += deltaY / scale;
        newRegion.width += deltaX / scale;
        newRegion.height -= deltaY / scale;
        break;
      case 'bottomLeft':
        newRegion.x += deltaX / scale;
        newRegion.width -= deltaX / scale;
        newRegion.height += deltaY / scale;
        break;
      case 'bottomRight':
        newRegion.width += deltaX / scale;
        newRegion.height += deltaY / scale;
        break;
    }

    const constrained = constrainCropRegion(
      newRegion,
      imageDimensions,
      CONSTANTS.MIN_CROP_SIZE
    );

    logger.cropBoxResized(constrained);
    onCropChange(constrained);

    // Update animated values
    translationX.value = constrained.x * scale;
    translationY.value = constrained.y * scale;
    width.value = constrained.width * scale;
    height.value = constrained.height * scale;
  };

  return (
    <View 
      style={[
        styles.container,
        {
          width: displayDimensions.width,
          height: displayDimensions.height,
        },
      ]}
      pointerEvents="box-none"
    >
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cropBox, animatedStyle]}>
          <View style={styles.border} />
          <View style={styles.corners}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
          <CropHandles onResize={handleResize} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  cropBox: {
    position: 'absolute',
    borderWidth: CONSTANTS.CROP_BORDER_WIDTH,
    borderColor: COLORS.cropBox,
  },
  border: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  corners: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.white,
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
});