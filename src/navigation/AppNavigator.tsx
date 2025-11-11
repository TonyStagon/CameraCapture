// FILE: src/navigation/AppNavigator.tsx
// ============================================
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import CameraScreen from '../screens/CameraScreen';
import CropScreen from '../screens/CropScreen';
import PreviewScreen from '../screens/PreviewScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="Camera" component={CameraScreen} />
      <Stack.Screen name="Crop" component={CropScreen} />
      <Stack.Screen name="Preview" component={PreviewScreen} />
    </Stack.Navigator>
  );
};
