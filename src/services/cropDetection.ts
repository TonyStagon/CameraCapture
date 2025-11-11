// FILE: src/services/cropDetection.ts
// ============================================
import { CropRegion, ImageDimensions } from '../types';
import { logger } from './logging';

export class CropDetectionService {
  async detectQuestionBounds(
    imageUri: string,
    dimensions: ImageDimensions
  ): Promise<CropRegion | null> {
    logger.autoCropDetectionStart();

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      const padding = 0.15;
      const cropRegion: CropRegion = {
        x: dimensions.width * padding,
        y: dimensions.height * padding,
        width: dimensions.width * (1 - 2 * padding),
        height: dimensions.height * (1 - 2 * padding),
      };

      logger.autoCropDetectionEnd(true, cropRegion);
      return cropRegion;
    } catch (error) {
      logger.autoCropDetectionEnd(false);
      return null;
    }
  }
}

export const cropDetectionService = new CropDetectionService();
