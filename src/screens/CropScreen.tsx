// FILE: src/screens/CropScreen.tsx (UPDATED - Initialize Centered)
// ============================================
import React, { useState, useEffect } from 'react';
import { 
  View, 
  Image, 
  StyleSheet, 
  TouchableOpacity, 
  Text, 
  Dimensions,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, CropRegion } from '../types';
import { CropBox } from '../components/CropBox';
import { ToggleButton } from '../components/ToggleButton';
import { cropDetectionService } from '../services/cropDetection';
import { imageProcessor } from '../services/imageProcessor';
import { logger } from '../services/logging';
import { COLORS } from '../utils/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Crop'>;
type RoutePropType = RouteProp<RootStackParamList, 'Crop'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function CropScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { photoUri, dimensions } = route.params;

  const [autoMode, setAutoMode] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 });
  
  // Initialize crop region centered in the image
  const [cropRegion, setCropRegion] = useState<CropRegion>({
    x: dimensions.width * 0.1,
    y: dimensions.height * 0.25,
    width: dimensions.width * 0.8,
    height: dimensions.height * 0.35,
  });

  useEffect(() => {
    logger.navigationToScreen('CropScreen');
    
    // Calculate display dimensions maintaining aspect ratio
    const aspectRatio = dimensions.width / dimensions.height;
    let displayWidth = SCREEN_WIDTH;
    let displayHeight = SCREEN_WIDTH / aspectRatio;

    if (displayHeight > SCREEN_HEIGHT * 0.7) {
      displayHeight = SCREEN_HEIGHT * 0.7;
      displayWidth = displayHeight * aspectRatio;
    }

    setDisplayDimensions({ width: displayWidth, height: displayHeight });

    // Auto-detect if enabled
    if (autoMode) {
      detectQuestion();
    }
  }, []);

  const detectQuestion = async () => {
    const detected = await cropDetectionService.detectQuestionBounds(photoUri, dimensions);
    if (detected) {
      setCropRegion(detected);
    }
  };

  const handleToggleMode = () => {
    const newMode = !autoMode;
    setAutoMode(newMode);
    logger.cropModeToggled(newMode);

    if (newMode) {
      detectQuestion();
    }
  };

  const handleRetake = () => {
    logger.retakePhotoTapped();
    navigation.goBack();
  };

  const handleConfirm = async () => {
    logger.confirmCropTapped(cropRegion);
    setIsProcessing(true);

    try {
      const croppedUri = await imageProcessor.cropImage(photoUri, cropRegion, dimensions);
      
      navigation.navigate('Preview', { croppedUri });
    } catch (error) {
      logger.cameraError(error as Error, 'cropImage');
      Alert.alert('Error', 'Failed to crop image');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandEmoji}>🎁</Text>
          <Text style={styles.brandText}>Get pro</Text>
        </View>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: photoUri }} 
          style={[styles.image, displayDimensions]}
          resizeMode="contain"
        />
        {displayDimensions.width > 0 && (
          <CropBox
            cropRegion={cropRegion}
            onCropChange={setCropRegion}
            imageDimensions={dimensions}
            displayDimensions={displayDimensions}
          />
        )}
      </View>

      <View style={styles.controls}>
        <ToggleButton 
          autoMode={autoMode} 
          onToggle={handleToggleMode}
        />

        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleRetake}
            disabled={isProcessing}
          >
            <Text style={styles.actionButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, styles.confirmButton]} 
            onPress={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.confirmButtonText}>Confirm</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  brandEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  brandText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    backgroundColor: '#1a1a1a',
  },
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});