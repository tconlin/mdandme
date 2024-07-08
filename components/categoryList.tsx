import { Pressable, Text } from "react-native";
import { FlashList } from "@shopify/flash-list";

export const CategoryList = () => {
  const items = [
    {
      id: "1",
      text: "Most Recent",
      icon: <Text>🗓</Text>,
    },
    {
      id: "2",
      text: "Most Popular",
      icon: <Text>🧡</Text>,
    },
    {
      id: "3",
      text: "Trending",
      icon: <Text>📈</Text>,
    },
    {
      id: "4",
      text: "Your Posts",
      icon: <Text>📎</Text>,
    },
  ];
  return (
    <FlashList
      horizontal={true}
      data={items}
      contentInsetAdjustmentBehavior="always"
      renderItem={({ item }) => (
        <Pressable
          key={item.id}
          onPress={() => {}}
          className={`flex-row items-center justify-center mx-2 rounded-full px-3 ${
            item.id === "1" ? "border border-blue-300" : "border-0"
          }`}
        >
          {item.icon}
          <Text className="text-lg font-semibold text-gray-200 ml-2">
            {item.text}
          </Text>
        </Pressable>
      )}
      estimatedItemSize={5}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
    />
  );
};
