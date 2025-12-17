import { askGPT } from "../utils/gpt";

beforeEach(() => {
  global.fetch = jest.fn();
  jest.spyOn(console, "log").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  jest.resetAllMocks();
  console.log.mockRestore();
  console.error.mockRestore();
});

test("askGPT returns content from mocked API", async () => {
  fetch.mockResolvedValueOnce({
    json: async () => ({
      choices: [{ message: { content: "Mocked answer" } }],
    }),
  });

  const res = await askGPT("hi");

  expect(res).toBe("Mocked answer");
  expect(fetch).toHaveBeenCalledTimes(1);
});

test("askGPT returns error string on fetch failure", async () => {
  fetch.mockRejectedValueOnce(new Error("Network error"));

  const res = await askGPT("hi");

  expect(res).toMatch(/Error/i);
});
