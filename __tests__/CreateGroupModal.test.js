import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { act } from "react-test-renderer";
import CreateGroupModal from "../components/CreateGroupModal";

jest.mock("../utils/imageUtils", () => ({
  pickImages: jest.fn(async () => [{ uri: "img://1", base64: "base64group" }]),
}));

jest.mock("../firebase/points", () => ({ addPoints: jest.fn() }));
jest.mock("../firebase/config", () => ({ auth: { currentUser: { uid: "user-123" } } }));

test("modal visibility: shows when visible=true", () => {
  const { getByText } = render(
    <CreateGroupModal visible={true} onClose={() => {}} onSave={() => {}} />
  );
  getByText("Create Group");
});

test("validation: does NOT save if name missing", () => {
  const onSave = jest.fn();

  const { getByText } = render(
    <CreateGroupModal visible={true} onClose={() => {}} onSave={onSave} />
  );

  fireEvent.press(getByText("Create"));
  expect(onSave).not.toHaveBeenCalled();
});

test("form completion: fill fields, choose category, tags parsed, create calls onSave", async () => {
  const onSave = jest.fn();

  const { getByPlaceholderText, getByText } = render(
    <CreateGroupModal visible={true} onClose={() => {}} onSave={onSave} />
  );

  fireEvent.changeText(getByPlaceholderText("Group name"), "My Group");
  fireEvent.press(getByText("Sports"));
  fireEvent.changeText(getByPlaceholderText("Description"), "Hello group");
  fireEvent.changeText(getByPlaceholderText("Tags (comma separated)"), "uni,  study , fun");

  await act(async () => {
    fireEvent.press(getByText("Pick Cover Image"));
  });

  fireEvent.press(getByText("Create"));

  await waitFor(() => expect(onSave).toHaveBeenCalledTimes(1));

  expect(onSave).toHaveBeenCalledWith(
    expect.objectContaining({
      name: "My Group",
      category: "Sports",
      description: "Hello group",
      tags: ["uni", "study", "fun"],
      imageBase64: "base64group",
      members: 1,
      createdBy: "user-123",
      createdAt: expect.any(Number),
    })
  );
});
