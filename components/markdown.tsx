import Markdown from "react-native-markdown-display";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export const MarkdownDisplay = ({ content }: { content: string }) => {
  const [isTruncated, setIsTruncated] = useState(true);

  const toggleTruncate = () => {
    setIsTruncated(!isTruncated);
  };

  const getTruncatedText = (text: string): string => {
    if (isTruncated) {
      return text.split("\n").slice(0, 3).join("\n") + "...";
    }
    return text;
  };
  return (
    <>
      <Markdown>{getTruncatedText(content)}</Markdown>
      <TouchableOpacity onPress={toggleTruncate}>
        <View className="flex items-center justify-center text-center mx-auto w-full">
          <Text className="my-4">
            {isTruncated ? "Read more" : "Show less"}
          </Text>
        </View>
      </TouchableOpacity>
    </>
  );
};
