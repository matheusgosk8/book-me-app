import Content from "@/components/home/Content";
import Footer from "@/components/home/Footer";
import Header from "@/components/home/Header";
import { View } from "react-native";

export default function Page() {
  return (
    <View className="flex-1 ">
      <Header />
      <Content />
      <Footer />
    </View>
  );
}


