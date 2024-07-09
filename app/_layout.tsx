import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Header from "@/components/header";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";
import { COLORS } from "@/constants/colors";
import AddCommentScreen from "@/app/addComment";
import { useSetAtom } from "jotai";
import { bottomSheetRef } from "@/store/app";

const logo = require("@/assets/images/logo.png");

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const setBottomSheetRef = useSetAtom(bottomSheetRef);
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const bottomSheetSnapPoint = useMemo(() => ["75%"], []);

  useEffect(() => {
    setBottomSheetRef(bottomSheetModalRef.current);
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded, setBottomSheetRef]);

  if (!loaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="flex-1"
        >
          <BottomSheetModalProvider>
            <BottomSheetModal
              ref={bottomSheetModalRef}
              index={0}
              snapPoints={bottomSheetSnapPoint}
              backdropComponent={({ style }) => (
                <View
                  style={[style, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
                />
              )}
              backgroundStyle={{
                backgroundColor: COLORS.gray["200"],
              }}
            >
              <BottomSheetScrollView>
                <AddCommentScreen />
              </BottomSheetScrollView>
            </BottomSheetModal>
            <View className="flex-1">
              <Stack
                initialRouteName="index"
                screenOptions={{
                  header: (props) => <Header {...props} logo={logo} />,
                }}
              >
                <Stack.Screen name="index" />
              </Stack>
            </View>
          </BottomSheetModalProvider>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
