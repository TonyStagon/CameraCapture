// FILE: App.tsx
// ============================================
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { AppNavigator } from './src/navigation/AppNavigator';
import { logger } from './src/services/logging';

export default function App() {
  React.useEffect(() => {
    logger.appLaunched();
    
    return () => {
      logger.flushToAnalytics();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}