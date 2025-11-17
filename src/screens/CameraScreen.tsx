// src/screens/CameraScreen.tsx - COMPLETE UPDATED VERSION
import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert, Image, Dimensions, Platform } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList, CropRegion, ImageDimensions } from '../types';
import { logger } from '../services/logging';
import { COLORS } from '../utils/constants';
import { BottomNavigation } from '../components/BottomNavigation';
import { SubjectSelectionModal } from '../components/SubjectSelectionModal';
import { Ionicons } from '@expo/vector-icons';
import { CropBox } from '../components/CropBox';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const FOOTER_HEIGHT = 250;
const BOTTOM_NAV_HEIGHT = 90;

const AVAILABLE_HEIGHT = SCREEN_HEIGHT - FOOTER_HEIGHT;

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<{ uri: string; dimensions: ImageDimensions } | null>(null);
  const [displayDimensions, setDisplayDimensions] = useState({ width: 0, height: 0 });
  const [cropRegion, setCropRegion] = useState<CropRegion>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  
  const cameraRef = useRef<Camera>(null);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      
      if (status === 'granted') {
        logger.cameraInitialized({ granted: true });
      } else {
        logger.cameraPermissionDenied();
      }
    })();
  }, []);

  useEffect(() => {
    if (capturedPhoto) {
      const aspectRatio = capturedPhoto.dimensions.width / capturedPhoto.dimensions.height;
      let displayWidth = SCREEN_WIDTH;
      let displayHeight = SCREEN_WIDTH / aspectRatio;

      if (displayHeight > SCREEN_HEIGHT) {
        displayHeight = SCREEN_HEIGHT;
        displayWidth = displayHeight * aspectRatio;
      }

      setDisplayDimensions({ width: displayWidth, height: displayHeight });

      const cropWidth = capturedPhoto.dimensions.width * 0.6;
      const cropHeight = capturedPhoto.dimensions.height * 0.4;
      
      const cropX = (capturedPhoto.dimensions.width - cropWidth) / 2;
      const cropY = (capturedPhoto.dimensions.height - cropHeight) / 2;

      setCropRegion({
        x: cropX,
        y: cropY,
        width: cropWidth,
        height: cropHeight,
      });
    }
  }, [capturedPhoto]);

  if (hasPermission === null) {
    return <View style={styles.container} />;
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need camera permission to continue</Text>
        <TouchableOpacity 
          style={styles.button} 
          onPress={async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            if (status !== 'granted') {
              logger.cameraPermissionDenied();
            }
          }}
        >
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    logger.photoCaptureTapped();
    logger.photoCaptureStart();

    try {
      if (!cameraRef.current) return;

      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
        base64: false,
      });

      if (photo) {
        logger.photoCaptured(photo.uri, { 
          width: photo.width, 
          height: photo.height 
        });
        logger.photoCaptureEnd();

        setCapturedPhoto({
          uri: photo.uri,
          dimensions: { width: photo.width, height: photo.height }
        });
      }
    } catch (error) {
      logger.cameraError(error as Error, 'takePictureAsync');
      Alert.alert('Error', 'Failed to take picture');
    }
  };

  const handleGalleryPress = () => {
    Alert.alert('Gallery', 'Gallery picker coming soon!\n\nInstall expo-image-picker to enable this feature.');
  };

  const handleMicPress = () => {
    Alert.alert('Voice Input', 'Voice input coming soon!\n\nInstall expo-av to enable voice recording.');
  };

  const handleRetake = () => {
    logger.retakePhotoTapped();
    setCapturedPhoto(null);
    setCropRegion({ x: 0, y: 0, width: 0, height: 0 });
    setDisplayDimensions({ width: 0, height: 0 });
    setSelectedSubject(null);
  };

  const handleConfirm = () => {
    if (!capturedPhoto) return;
    logger.confirmCropTapped(cropRegion);
    setShowSubjectModal(true);
  };

  const handleSubjectSelect = (subject: string) => {
    setSelectedSubject(subject);
    setShowSubjectModal(false);
    
    // Navigate to crop/preview screen with subject info
    navigation.navigate('Crop', {
      photoUri: capturedPhoto!.uri,
      dimensions: capturedPhoto!.dimensions,
    });
  };

  const handleNavigation = (route: 'search' | 'camera' | 'profile') => {
    if (route === 'search') {
      navigation.navigate('Search');
    } else if (route === 'profile') {
      navigation.navigate('Profile');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.previewArea}>
        {!capturedPhoto ? (
          <Camera
            ref={cameraRef}
            style={styles.camera}
            type={CameraType.back}
          >
            <View style={styles.topBar}>
              <View style={styles.placeholder} />
              <View style={styles.brandContainer}>
                <Text style={styles.brandEmoji}>🎁</Text>
                <Text style={styles.brandText}>Get pro</Text>
              </View>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.centerContent}>
              <Text style={styles.instructionText}>Take a pic and get{'\n'}an answer</Text>
            </View>
          </Camera>
        ) : (
          <View style={styles.capturedPhotoWrapper}>
            <View style={styles.topBar}>
              <TouchableOpacity style={styles.backButton} onPress={handleRetake}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <View style={styles.brandContainer}>
                <Text style={styles.brandEmoji}>🎁</Text>
                <Text style={styles.brandText}>Get pro</Text>
              </View>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: capturedPhoto.uri }} 
                style={[
                  styles.capturedImage,
                  {
                    width: displayDimensions.width,
                    height: displayDimensions.height,
                  }
                ]}
                resizeMode="contain"
              />
              {displayDimensions.width > 0 && displayDimensions.height > 0 && (
                <CropBox
                  cropRegion={cropRegion}
                  onCropChange={setCropRegion}
                  imageDimensions={capturedPhoto.dimensions}
                  displayDimensions={displayDimensions}
                  maxHeight={SCREEN_HEIGHT}
                />
              )}
            </View>

            {/* Confirm Button at Bottom */}
            <View style={styles.confirmButtonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirm}
                activeOpacity={0.8}
              >
                <Text style={styles.confirmButtonText}>Continue</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Footer - Only show when no photo is captured */}
      {!capturedPhoto && (
        <View style={[styles.footerWrapper, { height: FOOTER_HEIGHT }]}>
          <View style={styles.gradientOverlay}>
            <View style={styles.gradientTop} />
            <View style={styles.gradientMiddle} />
            <View style={styles.gradientBottom} />
          </View>

          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleGalleryPress}
              activeOpacity={0.7}
            >
              <View style={styles.iconButtonInner}>
                <Ionicons name="images-outline" size={28} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={takePicture}
              activeOpacity={0.7}
            >
              <View style={styles.outerRing}>
                <View style={styles.middleRing}>
                  <View style={styles.innerCircle} />
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleMicPress}
              activeOpacity={0.7}
            >
              <View style={styles.iconButtonInner}>
                <Ionicons name="mic-outline" size={28} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
          </View>

          <BottomNavigation
            currentRoute="camera"
            onNavigate={handleNavigation}
          />
        </View>
      )}

      {/* Subject Selection Modal */}
      <SubjectSelectionModal
        visible={showSubjectModal}
        onSelectSubject={handleSubjectSelect}
        onClose={() => setShowSubjectModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  message: {
    textAlign: 'center',
    color: COLORS.white,
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignSelf: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  previewArea: {
    flex: 1,
    width: '100%',
    backgroundColor: COLORS.background,
    position: 'relative',
  },
  camera: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  capturedPhotoWrapper: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    position: 'relative',
  },
  capturedImage: {
    backgroundColor: '#1a1a1a',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
    height: 44,
  },
  centerContent: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 100,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
  instructionText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  confirmButtonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    zIndex: 20,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  footerWrapper: {
    width: '100%',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  gradientMiddle: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gradientBottom: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderTopColor: '#ffffff',
  },
  captureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
    paddingBottom: 10,
    zIndex: 8,
    backgroundColor: 'transparent',
  },
  iconButton: {
    width: 62.5,
    height: 62.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  iconButtonInner: {
    width: 62.5,
    height: 62.5,
    borderRadius: 31.25,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outerRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: 'transparent',
  },
  middleRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5FA8A8',
    justifyContent: 'center',
    alignItems: 'center',
  },
});