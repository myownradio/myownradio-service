import { decodeId, encodeId } from "./ids"

test("should encode id", () => {
  expect(encodeId(1)).toBe("kOD613")
})

test("should decode id", () => {
  expect(decodeId("kOD613")).toBe(1)
})

test("should return null if failed to decode wrong id", () => {
  expect(decodeId("random")).toBe(null)
})