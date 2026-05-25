import { useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  Dimensions,
} from "react-native";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    id: "1",
    title: "말씀과 명언을\n내 손 안에",
    description: "마음에 담아둔 문장을\n카테고리별로 저장하세요",
  },
  {
    id: "2",
    title: "정해진 시간에\n다시 만나는 문장",
    description: "설정한 시간에 알림으로\n반복 상기시켜 드려요",
  },
];

export default function OnboardingSlides() {
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      router.replace('/(onboarding)/login');
    }
  };

  const isLast = activeIndex === SLIDES.length - 1;

  return (
    <View className="flex-1 bg-white">
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          setActiveIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
        renderItem={({ item }) => (
          <View
            style={{ width }}
            className="flex-1 items-center justify-center px-8"
          >
            <Text className="text-3xl font-bold text-center text-gray-900 mb-4">
              {item.title}
            </Text>
            <Text className="text-base text-center text-gray-500">
              {item.description}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View className="pb-12 px-8">
        <View className="flex-row justify-center gap-2 mb-8">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${i === activeIndex ? "w-6 bg-gray-900" : "w-2 bg-gray-300"}`}
            />
          ))}
        </View>

        <Pressable
          className="bg-gray-900 rounded-2xl py-4 items-center"
          onPress={handleNext}
        >
          <Text className="text-white text-base font-semibold">
            {isLast ? "시작하기" : "다음"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
