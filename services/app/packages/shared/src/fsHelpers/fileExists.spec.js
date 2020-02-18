const fileExists = require("./fileExists");

test("Should return false if file does not exist", async () => {
  const result = await fileExists("/path/that/does/not/exist.txt");
  expect(result).toBeFalsy();
});

test("Should return true if file exists", async () => {
  const result = await fileExists(
    `${__dirname}/../../tests/__fixtures__/testfile.txt`
  );
  expect(result).toBeTruthy();
});
