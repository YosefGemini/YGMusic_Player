import { Ionicons as ExpoIonicons } from "@expo/vector-icons";
import { cssInterop } from "nativewind";

/**
 * Ionicons ignores Tailwind `text-*` classes because it colors via the `color`
 * prop. Mapping the interop `color` style to that prop lets every icon follow
 * the active theme (`className="text-primary"`, etc.).
 */
const Ionicons = cssInterop(ExpoIonicons, {
  className: { target: "style", nativeStyleToProp: { color: true } },
}) as typeof ExpoIonicons;

export { Ionicons };
