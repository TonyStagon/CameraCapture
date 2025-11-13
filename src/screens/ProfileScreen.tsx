// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS } from '../utils/constants';
import { BottomNavigation } from '../components/BottomNavigation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleNavigation = (route: 'search' | 'camera' | 'profile') => {
    if (route === 'camera') {
      navigation.navigate('Camera');
    } else if (route === 'search') {
      navigation.navigate('Search');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.brandContainer}>
          <Text style={styles.brandEmoji}>🎁</Text>
          <Text style={styles.brandText}>Get pro</Text>
        </View>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.subtitle}>Your account and settings</Text>
        
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>Profile functionality coming soon...</Text>
        </View>
      </ScrollView>

      <BottomNavigation 
        currentRoute="profile" 
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
  header: {
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
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 30,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  placeholderText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
  },
});