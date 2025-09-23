import { Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function Footer() {
    const { bottom } = useSafeAreaInsets();
    return (
      <View
        className="flex-shrink-0 "
        style={{ paddingBottom: bottom, paddingTop: 20 }}
      >
        <View className="items-center">
          <Text className="text-gray-300 font-roboto text-sm">
            © 2025 Book Me
          </Text>
        </View>
      </View>
    );
  }
export default Footer

