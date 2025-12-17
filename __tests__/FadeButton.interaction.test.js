import React from "react";
import { Text, Animated } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import FadeButton from "../components/FadeButton";

test("calls onPress when pressed", () => {
  const onPress = jest.fn();
  const { getByText } = render(
    <FadeButton onPress={onPress}>
      <Text>Tap</Text>
    </FadeButton>
  );

  fireEvent.press(getByText("Tap"));
  expect(onPress).toHaveBeenCalledTimes(1);
});

test("runs fade animation on pressIn and pressOut", () => {
  const start = jest.fn();
  const timingSpy = jest.spyOn(Animated, "timing").mockReturnValue({ start });

  const { getByText } = render(
    <FadeButton onPress={() => {}}>
      <Text>Tap</Text>
    </FadeButton>
  );

  const node = getByText("Tap");

  fireEvent(node, "pressIn");
  expect(timingSpy).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 0.6 }));

  fireEvent(node, "pressOut");
  expect(timingSpy).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ toValue: 1 }));

  timingSpy.mockRestore();
});
