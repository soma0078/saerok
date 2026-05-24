import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { useCategories } from '@/hooks/use-categories';
import { useQuotes } from '@/hooks/use-quotes';

export default function CreateQuote() {
  const [content, setContent] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const { categories, addCategory } = useCategories();
  const { addQuote } = useQuotes();

  const canSave =
    content.trim().length > 0 &&
    (selectedCategoryId !== null || (showNewCategoryInput && newCategoryName.trim().length > 0));

  const handleSave = async () => {
    if (!canSave) return;

    let categoryId = selectedCategoryId;
    if (showNewCategoryInput && newCategoryName.trim()) {
      const created = await addCategory(newCategoryName.trim());
      categoryId = created.id;
    }

    await addQuote(content.trim(), categoryId!);
    router.back();
  };

  const handleSelectCategory = (id: string) => {
    setSelectedCategoryId(id);
    setShowNewCategoryInput(false);
    setNewCategoryName('');
  };

  const handleNewCategoryPress = () => {
    setShowNewCategoryInput(true);
    setSelectedCategoryId(null);
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-row items-center justify-between px-5 pt-14 pb-4 border-b border-gray-100">
        <Pressable onPress={() => router.back()}>
          <Text className="text-base text-gray-500">취소</Text>
        </Pressable>
        <Text className="text-base font-semibold text-gray-900">새 문장</Text>
        <Pressable onPress={handleSave} disabled={!canSave}>
          <Text className={`text-base font-semibold ${canSave ? 'text-gray-900' : 'text-gray-300'}`}>
            저장
          </Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-5 pt-6" keyboardShouldPersistTaps="handled">
        <TextInput
          className="text-base text-gray-900 leading-6 min-h-32"
          placeholder="문장을 입력하세요"
          placeholderTextColor="#9ca3af"
          multiline
          value={content}
          onChangeText={setContent}
          autoFocus
        />

        <View className="mt-8">
          <Text className="text-sm font-medium text-gray-500 mb-3">카테고리</Text>
          <View className="flex-row flex-wrap gap-2">
            {categories.map((cat) => (
              <Pressable
                key={cat.id}
                onPress={() => handleSelectCategory(cat.id)}
                className={`px-4 py-2 rounded-full border ${
                  selectedCategoryId === cat.id
                    ? 'bg-gray-900 border-gray-900'
                    : 'bg-white border-gray-200'
                }`}
              >
                <Text
                  className={`text-sm ${
                    selectedCategoryId === cat.id ? 'text-white' : 'text-gray-700'
                  }`}
                >
                  {cat.name}
                </Text>
              </Pressable>
            ))}

            {!showNewCategoryInput && (
              <Pressable
                onPress={handleNewCategoryPress}
                className="px-4 py-2 rounded-full border border-dashed border-gray-300"
              >
                <Text className="text-sm text-gray-400">+ 새 카테고리</Text>
              </Pressable>
            )}
          </View>

          {showNewCategoryInput && (
            <TextInput
              className="mt-3 px-4 py-2 rounded-full border border-gray-900 text-sm text-gray-900"
              placeholder="카테고리 이름"
              placeholderTextColor="#9ca3af"
              value={newCategoryName}
              onChangeText={setNewCategoryName}
              autoFocus
            />
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
