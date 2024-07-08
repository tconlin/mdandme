import { Pressable, Text } from "react-native";
import {
  CalendarDaysIcon,
  HandThumbUpIcon,
  ArrowTrendingUpIcon,
  InboxIcon,
} from "react-native-heroicons/outline";
import { COLORS } from "@/constants/colors";
import { FlashList } from "@shopify/flash-list";

export const CategoryList = () => {
  const items = [
    {
      id: "1",
      text: "Most Recent",
      icon: (
        <CalendarDaysIcon width={20} height={20} color={COLORS.gray["200"]} />
      ),
    },
    {
      id: "2",
      text: "Most Popular",
      icon: (
        <HandThumbUpIcon width={20} height={20} color={COLORS.gray["200"]} />
      ),
    },
    {
      id: "3",
      text: "Trending",
      icon: (
        <ArrowTrendingUpIcon
          width={20}
          height={20}
          color={COLORS.gray["200"]}
        />
      ),
    },
    {
      id: "4",
      text: "Your Posts",
      icon: <InboxIcon width={20} height={20} color={COLORS.gray["200"]} />,
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
          className={`flex-row items-center justify-center mx-2  rounded-full px-3 ${
            item.id === "1" ? "border border-blue-300" : "border-0"
          }`}
        >
          {item.icon}
          <Text className="text-xl text-gray-200 ml-2">{item.text}</Text>
        </Pressable>
      )}
      estimatedItemSize={5}
      keyExtractor={(item) => item.id}
      showsHorizontalScrollIndicator={false}
    />
  );
};
