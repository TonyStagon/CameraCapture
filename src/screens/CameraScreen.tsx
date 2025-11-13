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

  const handleNavigation = (route: 'search' | 'camera' | 'profile') => {
    if (route === 'search') {
      Alert.alert('Search', 'Search feature coming soon');
    } else if (route === 'profile') {
      Alert.alert('Profile', 'Profile feature coming soon');
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

          {/* Circular Capture Button */}
          <View style={styles.captureContainer}>
            <TouchableOpacity
              style={styles.captureButton}
              onPress={takePicture}
              activeOpacity={0.8}
            >
              <View style={styles.captureButtonOuter}>
                <View style={styles.captureButtonInner} />
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
  topBar: {
    paddingTop: 50,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
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
  },
  bottomSpacer: {
    height: 80,
  },
  captureContainer: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.white,
  },
});