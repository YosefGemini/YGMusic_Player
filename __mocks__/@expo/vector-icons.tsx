import React from "react";
import { Text, type TextProps } from "react-native";

/**
 * Manual Jest mock for `@expo/vector-icons` (used automatically for node
 * modules). The real package loads expo-font native internals that are not
 * available under Jest; rendering the icon name is enough for component tests.
 */

function makeIcon(set: string) {
  return function MockIcon({ name, ...props }: TextProps & { name?: string }) {
    return <Text {...props}>{name ?? set}</Text>;
  };
}

export const Ionicons = makeIcon("Ionicons");

export default { Ionicons };
