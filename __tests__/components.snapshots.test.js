import React from "react";
import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import FadeButton from "../components/FadeButton";
import EventCard from "../components/EventCard";
import PasswordInput from "../components/PasswordInput";

const theme = { card: "#111", textPrimary: "#fff", textMuted: "#aaa" };

test("FadeButton snapshot", () => {
  const { toJSON } = render(
    <FadeButton onPress={() => { }}>
      <Text>Tap</Text>
    </FadeButton>
  );
  expect(toJSON()).toMatchSnapshot();
});

test("EventCard snapshot", () => {
  const item = {
    image: "https://example.com/image.jpg",
    title: "GoCampus Event",
    date: "2026-12-10T10:00:00.000Z",
    time: "18:00",
    location: "Prishtina",
  };

  const { toJSON } = render(<EventCard item={item} theme={theme} />);
  expect(toJSON()).toMatchSnapshot();
});

test("PasswordInput snapshot", () => {
  const { toJSON } = render(
    <PasswordInput
      value=""
      onChangeText={() => { }}
      placeholder="Password"
      theme={theme}
      error={false}
    />
  );
  expect(toJSON()).toMatchSnapshot();
});
