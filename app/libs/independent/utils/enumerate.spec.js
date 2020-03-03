const enumerate = require("./enumerate");

test("Should create empty object when list of constants are empty", () => {
  expect(enumerate()).toEqual({});
});

test("Should create object where keys are equal to their values", () => {
  expect(enumerate("FOO", "BAR")).toEqual({ FOO: "FOO", BAR: "BAR" });
});
