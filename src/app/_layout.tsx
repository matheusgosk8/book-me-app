import "../global.css";
import { Slot } from "expo-router";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { View } from 'react-native';
import { AppWrapper } from '@/components/AppWrapper';
import { ServiceProvider } from '@/providers/ServiceContext';
import { SafeAreaProvider } from 'react-native-safe-area-context'; 

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <SafeAreaProvider>
      <ServiceProvider>
        <AppWrapper>
          <Slot />
        </AppWrapper>
      </ServiceProvider>
    </SafeAreaProvider>
  );
}