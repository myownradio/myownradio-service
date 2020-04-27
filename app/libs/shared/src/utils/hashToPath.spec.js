const hashToPath = require("./hashToPath")

test("Should convert hash to path with sub dirs", () => {
  const hash = "d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c"
  const path = hashToPath(hash)

  expect(path).toBe("d/0/d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c")
})
