import { useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";

export function useFadeModal(visible) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: visible ? 1 : 0,
        duration: visible ? 200 : 150,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: visible ? 1 : 0.85,
        duration: visible ? 220 : 150,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible]);

  return {
    overlayStyle: { opacity },
    modalStyle: {
      transform: [{ scale }],
    },
  };
}
