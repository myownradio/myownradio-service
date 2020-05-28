import { convertFileHashToFilePath, convertFileHashToFileUrl } from "./filePath"

test("should convert hash to file path", () => {
  expect(convertFileHashToFilePath("12345678")).toBe("1/2/12345678")
})

test("should convert hash to file url", () => {
  expect(convertFileHashToFileUrl("12345678", "https://example.com")).toBe("https://example.com/1/2/12345678")
})
