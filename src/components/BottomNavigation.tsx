// src/components/BottomNavigation.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomNavigationProps {
  currentRoute: 'search' | 'camera' | 'profile';
  onNavigate: (route: 'search' | 'camera' | 'profile') => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentRoute,
  onNavigate,
}) => {
  const getIconColor = (route: 'search' | 'camera' | 'profile') => {
    return currentRoute === route ? '#FFFFFF' : 'rgba(255, 255, 255, 0.5)';
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('search')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="search-outline"
            size={24}
            color={getIconColor('search')}
          />
        </TouchableOpacity>

        <View style={styles.cameraContainer}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => onNavigate('camera')}
            activeOpacity={0.7}
          >
            <View style={styles.cameraIconWrapper}>
              <Ionicons name="camera-outline" size={26} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          {currentRoute === 'camera' && <View style={styles.cameraIndicator} />}
        </View>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => onNavigate('profile')}
          activeOpacity={0.7}
        >
          <Ionicons
            name="person-outline"
            size={24}
            color={getIconColor('profile')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000000',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 12,
    paddingHorizontal: 20,
  },
  navItem: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  cameraContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  cameraButton: {
    padding: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  cameraIndicator: {
    position: 'absolute',
    bottom: -8,
    width: 40,
    height: 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
});