import React, { useMemo, useRef, useState } from "react";
import { PanResponder, View, type LayoutChangeEvent } from "react-native";

import { cn } from "@/shared/utils/cn";

import { ratioFromPosition, ratioFromValue, valueFromRatio } from "./sliderMath";

export interface SliderProps {
  value: number;
  minimumValue?: number;
  maximumValue?: number;
  onValueChange?: (value: number) => void;
  onSlidingComplete?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

/** A lightweight, dependency-free track slider (tap or drag the thumb). */
export function Slider({
  value,
  minimumValue = 0,
  maximumValue = 1,
  onValueChange,
  onSlidingComplete,
  disabled = false,
  className,
  accessibilityLabel,
}: SliderProps) {
  const widthRef = useRef(0);
  const lastValue = useRef(value);
  const [, forceRender] = useState(0);

  const emit = (x: number, complete: boolean) => {
    const ratio = ratioFromPosition(x, widthRef.current);
    const next = valueFromRatio(ratio, minimumValue, maximumValue);
    lastValue.current = next;
    onValueChange?.(next);
    if (complete) onSlidingComplete?.(next);
    forceRender((n) => n + 1);
  };

  const responder = useMemo(
    () =>
      // Refs are only read inside gesture handlers (never during render).
      // eslint-disable-next-line react-hooks/refs
      PanResponder.create({
        onStartShouldSetPanResponder: () => !disabled,
        onMoveShouldSetPanResponder: () => !disabled,
        onPanResponderGrant: (event) => emit(event.nativeEvent.locationX, false),
        onPanResponderMove: (event) => emit(event.nativeEvent.locationX, false),
        onPanResponderRelease: (event) => emit(event.nativeEvent.locationX, true),
        onPanResponderTerminate: () => onSlidingComplete?.(lastValue.current),
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [disabled, minimumValue, maximumValue],
  );

  const ratio = ratioFromValue(value, minimumValue, maximumValue);

  const onLayout = (event: LayoutChangeEvent) => {
    widthRef.current = event.nativeEvent.layout.width;
  };

  return (
    <View
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: minimumValue, max: maximumValue, now: value }}
      className={cn("h-8 justify-center", disabled && "opacity-40", className)}
      onLayout={onLayout}
      {...responder.panHandlers}
    >
      <View className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
        <View className="h-full bg-primary" style={{ width: `${ratio * 100}%` }} />
      </View>
      <View
        className="absolute h-4 w-4 rounded-full border-2 border-background bg-primary"
        style={{ left: `${ratio * 100}%`, marginLeft: -8 }}
      />
    </View>
  );
}
