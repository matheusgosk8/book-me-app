import { Link } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  LayoutChangeEvent,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FadeInSection from "@/components/common/FadeInSection";

function StatCard({
  icon,
  iconFamily,
  value,
  label,
  color,
}: {
  icon: string;
  iconFamily: "FontAwesome5" | "MaterialIcons" | "Ionicons";
  value: string;
  label: string;
  color: string;
}) {
  const IconComponent =
    iconFamily === "FontAwesome5"
      ? FontAwesome5
      : iconFamily === "MaterialIcons"
        ? MaterialIcons
        : Ionicons;

  return (
    <View className="flex-1 items-center bg-white/5 rounded-2xl py-5 px-2 mx-1.5">
      <IconComponent name={icon} size={24} color={color} />
      <Text className="text-2xl font-bold text-white mt-2">{value}</Text>
      <Text className="text-xs text-gray-400 text-center mt-1">{label}</Text>
    </View>
  );
}

export default StatCard;