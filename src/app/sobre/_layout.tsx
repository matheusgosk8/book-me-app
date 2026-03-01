import Footer from "@/components/sobre/Footer";
import { Slot } from "expo-router";
import { View, ScrollView } from "react-native";

export default function Layout() {
  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <Slot />
      </ScrollView>
      <Footer />
    </View>
  );
}