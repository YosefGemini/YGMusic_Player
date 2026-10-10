import React from "react";
import { Pressable, Text, type PressableProps } from "react-native";

import { cn } from "@/shared/utils/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "accent";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends PressableProps {
  label?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  textClassName?: string;
}

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "bg-primary border border-primary",
  secondary: "bg-surface-elevated border border-border",
  ghost: "bg-transparent border border-transparent",
  accent: "bg-accent border border-accent",
};

const TEXT_VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "text-primary-foreground",
  secondary: "text-foreground",
  ghost: "text-foreground",
  accent: "text-background",
};

const SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 rounded-full",
  md: "px-4 py-2.5 rounded-full",
  lg: "px-5 py-3.5 rounded-theme",
};

const TEXT_SIZE_CLASS: Record<ButtonSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-base",
};

export function Button({
  label,
  variant = "primary",
  size = "md",
  className,
  textClassName,
  children,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      className={cn(
        "flex-row items-center justify-center gap-2 active:opacity-80",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        disabled && "opacity-40",
        className,
      )}
      {...rest}
    >
      {label ? (
        <Text
          className={cn(
            "font-semibold",
            TEXT_VARIANT_CLASS[variant],
            TEXT_SIZE_CLASS[size],
            textClassName,
          )}
        >
          {label}
        </Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
