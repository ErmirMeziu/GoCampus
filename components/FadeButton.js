import { Pressable, Animated } from "react-native";
import { useRef } from "react";

export default function FadeButton({ children, onPress }) {
  const opacity = useRef(new Animated.Value(1)).current;

  return (
    <Pressable
      onPressIn={() =>
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 120,
          useNativeDriver: true,
        }).start()
      }
      onPressOut={() =>
        Animated.timing(opacity, {
          toValue: 1,
          duration: 120,
          useNativeDriver: true,
        }).start()
      }
      onPress={onPress}
    >
      <Animated.View style={{ opacity }}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
