import { convertFileHashToFileUrl } from "./convertFileHashToFileUrl"

test("should convert hash to file url", () => {
  expect(convertFileHashToFileUrl("12345678", "https://example.com")).toBe("https://example.com/1/2/12345678")
})
