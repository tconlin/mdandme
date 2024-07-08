import { ActivityIndicator } from "react-native-paper";
import { COLORS } from "@/constants/colors";

export const CircularProgress = ({
  size = "small",
  color = "light",
}: {
  size?: number | "small" | "large";
  color?: "dark" | "light" | "black";
}) => {
  return (
    <ActivityIndicator
      animating={true}
      color={
        color === "light"
          ? COLORS.brown["50"]
          : color === "dark"
          ? COLORS.blue["700"]
          : color === "black"
          ? COLORS.gray["900"]
          : color
      }
      size={size}
    />
  );
};
