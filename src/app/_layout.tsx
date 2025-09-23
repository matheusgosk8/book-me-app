import "../global.css";
import { Slot } from "expo-router";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { View } from 'react-native';
import { AppWrapper } from "@/components/AppWrapper";

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,

  });

  if (!fontsLoaded) {
    return <View />;
  }

  return (
    <AppWrapper>
      <Slot />
    </AppWrapper>
  )
}
