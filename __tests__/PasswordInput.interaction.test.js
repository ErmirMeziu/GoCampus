import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import PasswordInput from "../components/PasswordInput";

const theme = { textPrimary: "#fff", textMuted: "#aaa" };

test("toggles secureTextEntry when eye pressed", () => {
  const { getByPlaceholderText, getByText } = render(
    <PasswordInput
      value=""
      onChangeText={() => {}}
      placeholder="Password"
      theme={theme}
      error={false}
    />
  );

  expect(getByPlaceholderText("Password").props.secureTextEntry).toBe(true);

  fireEvent.press(getByText("eye-outline"));
  expect(getByPlaceholderText("Password").props.secureTextEntry).toBe(false);

  fireEvent.press(getByText("eye-off-outline"));
  expect(getByPlaceholderText("Password").props.secureTextEntry).toBe(true);
});
