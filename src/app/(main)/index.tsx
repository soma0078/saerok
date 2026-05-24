import { View, Text, Pressable } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
        <Text className="text-xl font-bold text-gray-900">새록</Text>
        <Pressable onPress={() => router.push("/(main)/create-quote")}>
          <Text className="text-2xl text-gray-900">+</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center">
        <Text className="text-sm text-gray-400">저장된 문장이 없습니다</Text>
      </View>
    </View>
  );
}
