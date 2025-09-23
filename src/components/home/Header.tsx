import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';

function Header() {
    const { top } = useSafeAreaInsets();
    return (
      <View
        className="flex-row justify-between items-center px-4 lg:px-6 py-4 shadow-sm"
        style={{ paddingTop: top }}
      >
        <Link href="/" className="font-roboto text-2xl font-bold text-black">
          Book Me
        </Link>
        <View className="flex-row gap-4">
          <Link
            href="/about"
            className="font-roboto text-md text-gray-700 hover:underline"
          >
            Sobre
          </Link>
          <Link
            href="/services"
            className="font-roboto text-md text-gray-700 hover:underline"
          >
            Serviços
          </Link>
          <Link
            href="/pricing"
            className="font-roboto text-md text-gray-700 hover:underline"
          >
            Planos
          </Link>
        </View>
      </View>
    );
  }


  export default Header