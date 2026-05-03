import "../global.css";
import { StyleSheet } from 'react-native';
import { Slot } from "expo-router";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { View } from 'react-native';
import { AppWrapper } from '@/components/AppWrapper';
import { ServiceProvider } from '@/providers/ServiceContext';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 
import ReduxProvider from "@/providers/ReduxProvider";

export default function Layout() {
  // ensure nativewind/css-interop uses class-based dark mode
  try {
    // setFlag exists in RN Web / css-interop environment
    // use a typed-safe access to avoid TS errors
    (StyleSheet as any)?.setFlag?.('darkMode', 'class');
  } catch (e) {
    // ignore if environment doesn't support setFlag
  }
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <ReduxProvider>
    <SafeAreaProvider>
      <ServiceProvider>
        <AppWrapper>
          <Slot />
        </AppWrapper>
      </ServiceProvider>
    </SafeAreaProvider>
    </ReduxProvider>
  );
}