// src/components/AppWrapper.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import UserProfile from '@/components/common/UserProfile';
import useHealthCheck from '@/hooks/useHealthCheck';
import OutOfService from '@/components/common/OutOfService';

interface AppWrapperProps extends ViewProps {
  children: React.ReactNode;
}

export const AppWrapper: React.FC<AppWrapperProps> = ({ children, style, ...rest }) => {
  const token = useSelector((s: RootState) => s.auth?.token);
  const { healthy, lastError, recheck } = useHealthCheck(120000);

  return (
    <LinearGradient
      colors={['#06b6d4', '#3b82f6', '#8b5cf6']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }} // Remova os paddings/insets daqui!
    >
      <View style={[{ flex: 1 }, style]} {...rest}>
        {token ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
              <UserProfile />
            </View>
          </View>
        ) : null}

        {healthy ? children : <OutOfService onRetry={recheck} message={lastError ?? null} />}
      </View>
    </LinearGradient>
  );
};