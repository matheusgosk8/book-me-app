import Footer from "@/components/home/Footer";
import { Slot } from "expo-router";
import { ScrollView } from "react-native";

export default function Layout() {
  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <Slot />
      <Footer/>
    </ScrollView>
  );
}
