import { View, TextInput } from "react-native";
import { useState } from "react";

export default function AddCommentScreen() {
  const [inputValue, setInputValue] = useState("");
  async function handleSubmit() {
    console.log;
  }

  return (
    <View className="flex-1 px-4 py-6">
      <TextInput
        className="h-12 w-full border border-gray-200 rounded-lg px-4"
        placeholder="Add a comment..."
        multiline
        value={inputValue}
        onChangeText={setInputValue}
        numberOfLines={4}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white rounded-lg px-4 py-2 mt-4"
      >
        Post
      </button>
    </View>
  );
}
