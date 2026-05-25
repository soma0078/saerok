import { useCallback, useMemo, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { router, useFocusEffect } from "expo-router";
import { useCategories } from "@/hooks/use-categories";
import { useQuotes } from "@/hooks/use-quotes";
import { useOnboardingStatus } from "@/hooks/use-onboarding-status";
import { QuoteCard } from "@/components/quote-card";

const ALL_TAB = "__all__";

export default function Home() {
  const [selectedCategoryId, setSelectedCategoryId] = useState(ALL_TAB);
  const { categories, reload: reloadCategories } = useCategories();
  const { quotes, deleteQuote, reload: reloadQuotes } = useQuotes();
  const { reset: resetOnboarding } = useOnboardingStatus();

  useFocusEffect(
    useCallback(() => {
      reloadCategories();
      reloadQuotes();
    }, [reloadCategories, reloadQuotes]),
  );

  const filteredQuotes = useMemo(
    () =>
      selectedCategoryId === ALL_TAB
        ? quotes
        : quotes.filter((q) => q.categoryId === selectedCategoryId),
    [quotes, selectedCategoryId],
  );

  const categoryMap = useMemo(
    () => Object.fromEntries(categories.map((c) => [c.id, c.name])),
    [categories],
  );

  const handleEdit = useCallback((id: string) => {
    router.push({ pathname: "/(main)/create-quote", params: { quoteId: id } });
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      deleteQuote(id);
    },
    [deleteQuote],
  );

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center justify-between px-5 pt-14 pb-4">
        <Text className="text-xl font-bold text-gray-900">새록</Text>
        <View className="flex-row gap-4 items-center">
          {__DEV__ && (
            <Pressable onPress={async () => { await resetOnboarding(); router.replace('/(onboarding)'); }}>
              <Text className="text-xs text-red-400">온보딩리셋</Text>
            </Pressable>
          )}
          <Pressable onPress={() => router.push("/(main)/setting")}>
            <Text className="text-xl text-gray-900">🔔</Text>
          </Pressable>
          <Pressable onPress={() => router.push("/(main)/create-quote")}>
            <Text className="text-2xl text-gray-900">+</Text>
          </Pressable>
        </View>
      </View>

      <View className="border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="px-5 py-3 gap-2 items-center"
        >
          <Pressable
            onPress={() => setSelectedCategoryId(ALL_TAB)}
            className={`px-4 py-2 rounded-full border ${
              selectedCategoryId === ALL_TAB
                ? "bg-gray-900 border-gray-900"
                : "bg-white border-gray-200"
            }`}
          >
            <Text
              className={`text-sm  ${
                selectedCategoryId === ALL_TAB ? "text-white" : "text-gray-700"
              }`}
            >
              전체
            </Text>
          </Pressable>

          {categories.map((cat) => (
            <Pressable
              key={cat.id}
              onPress={() => setSelectedCategoryId(cat.id)}
              className={`px-4 py-2 rounded-full border ${
                selectedCategoryId === cat.id
                  ? "bg-gray-900 border-gray-900"
                  : "bg-white border-gray-200"
              }`}
            >
              <Text
                className={`text-sm ${
                  selectedCategoryId === cat.id ? "text-white" : "text-gray-700"
                }`}
              >
                {cat.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {filteredQuotes.length > 0 ? (
        <FlatList
          data={filteredQuotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <QuoteCard
              id={item.id}
              content={item.content}
              categoryName={categoryMap[item.categoryId] ?? ""}
              showCategory={selectedCategoryId === ALL_TAB}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Text className="text-sm text-gray-400">저장된 문장이 없습니다</Text>
        </View>
      )}
    </View>
  );
}
