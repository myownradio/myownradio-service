const fs = require("fs");
const os = require("os");

module.exports = function withTempDirectory() {
  const tempDirectory = { current: null };

  beforeAll(async () => {
    tempDirectory.current = `${os.tmpdir()}/${Date.now()}-${Math.random()}}`;
    await fs.promises.mkdir(tempDirectory.current, { recursive: true });
  });

  afterAll(async () => {
    if (tempDirectory.current) {
      await fs.promises.rmdir(tempDirectory.current, { recursive: true });
    }
  });
};
