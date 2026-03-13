// src/components/AppWrapper.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AppWrapperProps extends ViewProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children, style, ...rest }) => {
  return (
    <LinearGradient
      colors={['#06b6d4', '#3b82f6', '#8b5cf6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }} // Remova os paddings/insets daqui!
    >
      <View style={[{ flex: 1 }, style]} {...rest}>
        {children}
      </View>
    </LinearGradient>
  );
};