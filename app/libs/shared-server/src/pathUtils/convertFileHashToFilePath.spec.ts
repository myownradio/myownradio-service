import { convertFileHashToFilePath } from "./convertFileHashToFilePath"

test("should convert hash to file path", () => {
  expect(convertFileHashToFilePath("12345678")).toBe("1/2/12345678")
})
