import { CropRegion, ImageDimensions } from '../types';

export const constrainCropRegion = (
  region: CropRegion,
  imageDimensions: ImageDimensions,
  minSize: number
): CropRegion => {
  const constrained = { ...region };

  constrained.width = Math.max(minSize, region.width);
  constrained.height = Math.max(minSize, region.height);

  constrained.x = Math.max(0, Math.min(region.x, imageDimensions.width - constrained.width));
  constrained.y = Math.max(0, Math.min(region.y, imageDimensions.height - constrained.height));

  return constrained;
};

export const scaleToScreen = (
  region: CropRegion,
  imageSize: ImageDimensions,
  screenSize: ImageDimensions
): CropRegion => {
  const scaleX = screenSize.width / imageSize.width;
  const scaleY = screenSize.height / imageSize.height;

  return {
    x: region.x * scaleX,
    y: region.y * scaleY,
    width: region.width * scaleX,
    height: region.height * scaleY,
  };
};
