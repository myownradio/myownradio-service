const { Readable } = require("stream");
const download = require("./download");

test("Should download entire file", async () => {
  const filepath = `${__dirname}/../../tests/__fixtures__/testfile.txt`;

  const ctx = {
    get: jest.fn().mockReturnValue(null),
    set: jest.fn(),
    body: null,
    status: null
  };

  await download(ctx, filepath);

  expect(ctx.set.mock.calls).toEqual([
    ["x-transfer-length", 573],
    ["content-length", 573],
    ["content-type", "text/plain"],
    ["content-disposition", "attachment; filename=testfile.txt"]
  ]);

  expect(ctx.get).toBeCalledTimes(1);
  expect(ctx.body).toBeInstanceOf(Readable);
  expect(ctx.status).toBe(200);
});

test("Should download file with specific range", async () => {
  const filepath = `${__dirname}/../../tests/__fixtures__/testfile.txt`;

  const ctx = {
    get: jest.fn().mockImplementation(name => {
      if (name === "range") {
        return "bytes=100-";
      }
      return null;
    }),
    set: jest.fn(),
    body: null,
    status: null
  };

  await download(ctx, filepath);

  expect(ctx.set.mock.calls).toEqual([
    ["x-transfer-length", 573],
    ["accept-ranges", "bytes"],
    ["content-range", "bytes 100-572/573"],
    ["content-type", "text/plain"],
    ["content-disposition", "attachment; filename=testfile.txt"]
  ]);

  expect(ctx.get).toBeCalledTimes(1);
  expect(ctx.body).toBeInstanceOf(Readable);
  expect(ctx.status).toBe(206);
});
