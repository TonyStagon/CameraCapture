// FILE: src/services/imageProcessor.ts
// ============================================
import * as ImageManipulator from 'expo-image-manipulator';
import { CropRegion, ImageDimensions } from '../types';
import { logger } from './logging';

export class ImageProcessor {
  async cropImage(
    imageUri: string,
    cropRegion: CropRegion,
    imageDimensions: ImageDimensions
  ): Promise<string> {
    logger.cropProcessingStart();

    try {
      const result = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          {
            crop: {
              originX: cropRegion.x,
              originY: cropRegion.y,
              width: cropRegion.width,
              height: cropRegion.height,
            },
          },
        ],
        { compress: 0.9, format: ImageManipulator.SaveFormat.JPEG }
      );

      logger.cropProcessingEnd(true, result.uri);
      return result.uri;
    } catch (error) {
      logger.cropProcessingEnd(false);
      throw error;
    }
  }
}

export const imageProcessor = new ImageProcessor();