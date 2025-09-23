import React from 'react';
import { View, ViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

interface AppWrapperProps extends ViewProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children, style, ...rest }) => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#06b6d4', '#3b82f6', '#8b5cf6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <View style={[{ flex: 1 }, style]} {...rest}>
        {children}
      </View>
    </LinearGradient>
  );
};
