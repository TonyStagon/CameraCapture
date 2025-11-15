// src/screens/CameraScreen.tsx
import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Alert } from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { logger } from '../services/logging';
import { COLORS } from '../utils/constants';
import { BottomNavigation } from '../components/BottomNavigation';
import { Ionicons } from '@expo/vector-icons';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Camera'>;

export default function CameraScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
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

        navigation.navigate('Crop', {
          photoUri: photo.uri,
          dimensions: { width: photo.width, height: photo.height },
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

  const handleNavigation = (route: 'search' | 'camera' | 'profile') => {
    if (route === 'search') {
      navigation.navigate('Search');
    } else if (route === 'profile') {
      navigation.navigate('Profile');
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={CameraType.back}
      >
        <View style={styles.overlay}>
          {/* Gradient overlay at bottom */}
          <View style={styles.gradientOverlay}>
            <View style={styles.gradientTop} />
            <View style={styles.gradientMiddle} />
            <View style={styles.gradientBottom} />
          </View>

          <View style={styles.topBar}>
            <View style={styles.brandContainer}>
              <Text style={styles.brandEmoji}>🎁</Text>
              <Text style={styles.brandText}>Get pro</Text>
            </View>
          </View>

          <View style={styles.centerContent}>
            <Text style={styles.instructionText}>Take a pic and get{'\n'}an answer</Text>
          </View>

          <View style={styles.bottomSpacer} />

          {/* Bottom Controls with Gallery, Capture, and Mic */}
          <View style={styles.captureContainer}>
            {/* Gallery Icon Button */}
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleGalleryPress}
              activeOpacity={0.7}
            >
              <View style={styles.iconButtonInner}>
                <Ionicons name="images-outline" size={28} color="#FFFFFF" />
              </View>
            </TouchableOpacity>

            {/* Circular Capture Button */}
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

            {/* Microphone Icon Button */}
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
        </View>
      </Camera>
      
      <BottomNavigation
        currentRoute="camera"
        onNavigate={handleNavigation}
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
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  gradientOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: 'transparent',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 150,
    backgroundColor: 'rgba(0, 0, 0, 0)',
  },
  gradientMiddle: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: 'rgba(10, 6, 6, 0.49)',
  },
  gradientBottom: {
    position: 'absolute',
    top: 170,
    left: 0,
    right: 0,
    bottom: 10,
    backgroundColor: '#8a1616ff',
  },
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 10,
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
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    zIndex: 10,
  },
  bottomSpacer: {
    height: 80,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    zIndex: 10,
  },
  iconButton: {
    width: 62.5,  // Increased by 25% (50 * 1.25 = 62.5)
    height: 62.5, // Increased by 25% (50 * 1.25 = 62.5)
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
  iconButtonInner: {
    width: 62.5,  // Increased by 25% (50 * 1.25 = 62.5)
    height: 62.5, // Increased by 25% (50 * 1.25 = 62.5)
    borderRadius: 31.25, // Adjusted for new size (62.5 / 2)
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
  },
});