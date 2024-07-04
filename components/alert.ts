import { showMessage } from "react-native-flash-message";
import { COLORS } from "@/constants/colors";

export function ShowAlert({
  message = "We're experiencing some network issues. Please try again later.",
  type = "default",
}: {
  message?: string;
  type?: "success" | "danger" | "warning" | "info" | "default";
}) {
  let color = COLORS.brown["50"];
  let backgroundColor = COLORS.green["800"];
  switch (type) {
    case "success":
      color = COLORS.brown["50"];
      backgroundColor = COLORS.green["800"];
      break;
    case "danger":
      color = COLORS.brown["50"];
      backgroundColor = COLORS.pink["900"];
      break;
  }

  showMessage({
    message,
    type,
    backgroundColor: backgroundColor,
    color,
    duration: 1000,
  });
}
