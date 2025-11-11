
// ============================================
// FILE: src/screens/PreviewScreen.tsx (COMPLETE)
// ============================================
import React, { useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { logger } from '../services/logging';
import { COLORS } from '../utils/constants';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Preview'>;
type RoutePropType = RouteProp<RootStackParamList, 'Preview'>;

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

export default function PreviewScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RoutePropType>();
  const { croppedUri } = route.params;

  useEffect(() => {
    logger.navigationToScreen('PreviewScreen');
  }, []);

  const handleGetAnswer = () => {
    // TODO: This is where you'd send the cropped image to your AI backend
    // Example API call:
    /*
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: croppedUri,
        type: 'image/jpeg',
        name: 'question.jpg',
      });

      const response = await fetch('https://your-api.com/analyze', {
        method: 'POST',
        body: formData,
      });

      const answer = await response.json();
      // Navigate to answer screen with the result
    } catch (error) {
      logger.cameraError(error, 'getAnswer');
    }
    */
    
    console.log('Send to AI:', croppedUri);
    alert('This is where the AI would analyze your question!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandEmoji}>🎁</Text>
          <Text style={styles.brandText}>Get pro</Text>
        </View>
        <Text style={styles.title}>Cropped Question</Text>
      </View>

      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: croppedUri }} 
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Ready to get your answer?</Text>
        <Text style={styles.footerSubtitle}>
          We'll analyze your question and provide a detailed solution
        </Text>

        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]}
          onPress={handleGetAnswer}
        >
          <Text style={styles.primaryButtonText}>
            ✨ Get Answer
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('Camera')}
        >
          <Text style={styles.buttonText}>Take Another Photo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
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
  title: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  image: {
    width: SCREEN_WIDTH - 40,
    height: SCREEN_HEIGHT * 0.5,
    borderRadius: 12,
    backgroundColor: '#1a1a1a',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  footerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  footerSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
  },
  primaryButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '700',
  },
});