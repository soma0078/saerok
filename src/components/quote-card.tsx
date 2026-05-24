import { memo, useCallback } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';

type Props = {
  id: string;
  content: string;
  categoryName: string;
  showCategory: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};

export const QuoteCard = memo(function QuoteCard({
  id,
  content,
  categoryName,
  showCategory,
  onEdit,
  onDelete,
}: Props) {
  const handleLongPress = useCallback(() => {
    Alert.alert('', content, [
      { text: '수정', onPress: () => onEdit(id) },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () =>
          Alert.alert('문장 삭제', '삭제하면 복구할 수 없습니다.', [
            { text: '취소', style: 'cancel' },
            { text: '삭제', style: 'destructive', onPress: () => onDelete(id) },
          ]),
      },
      { text: '취소', style: 'cancel' },
    ]);
  }, [id, content, onEdit, onDelete]);

  return (
    <Pressable
      onLongPress={handleLongPress}
      className="px-5 py-4 border-b border-gray-100"
    >
      <Text className="text-base text-gray-900 leading-6">{content}</Text>
      {showCategory ? (
        <Text className="text-xs text-gray-400 mt-1">{categoryName}</Text>
      ) : null}
    </Pressable>
  );
});
