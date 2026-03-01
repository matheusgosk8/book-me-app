
import React, { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  LayoutChangeEvent
} from "react-native";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

function FadeInSection({
  children,
  scrollY,
  delay = 0,
}: {
  children: React.ReactNode;
  scrollY: Animated.Value;
  delay?: number;
}) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;
  const [triggered, setTriggered] = useState(false);
  const sectionY = useRef(0);

  const onLayout = useCallback(
    (e: LayoutChangeEvent) => {
      sectionY.current = e.nativeEvent.layout.y;

      const listenerId = scrollY.addListener(({ value }) => {
        const visibleBottom = value + SCREEN_HEIGHT * 0.85;
        if (visibleBottom >= sectionY.current && !triggered) {
          setTriggered(true);
          Animated.parallel([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 700,
              delay,
              useNativeDriver: true,
            }),
            Animated.timing(translateY, {
              toValue: 0,
              duration: 700,
              delay,
              useNativeDriver: true,
            }),
          ]).start();
          scrollY.removeListener(listenerId);
        }
      });

      // Checa imediatamente caso já esteja visível
      const currentVal = (scrollY as any).__getValue?.() ?? 0;
      if (currentVal + SCREEN_HEIGHT * 0.85 >= sectionY.current && !triggered) {
        setTriggered(true);
        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: 700,
            delay,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 0,
            duration: 700,
            delay,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
    [scrollY, triggered, opacity, translateY, delay]
  );

  return (
    <Animated.View
      onLayout={onLayout}
      style={{ opacity, transform: [{ translateY }] }}
    >
      {children}
    </Animated.View>
  );
}

export default FadeInSection;