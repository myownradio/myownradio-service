const { getMediaFileMetadata } = require("./utils");

describe("getMediaFileMetadata", () => {
  it("should get metadata from mp3 audio file", async () => {
    const filepath = `${__dirname}/../tests/__fixtures__/sine.mp3`;
    const metadata = await getMediaFileMetadata(filepath);

    expect(metadata).toEqual({
      duration: 1.07475,
      bitrate: 242824,
      format: "MP2/3 (MPEG audio layer 2/3)",
      artist: "Sine Artist",
      title: "Sine Title",
      album: "Sine Album",
      genre: "Sine Genre",
    });
  });

  it("should fail if file does not exist", async () => {
    const filepath = "/path/that/does/not/exist.mp3";
    await expect(getMediaFileMetadata(filepath)).rejects.toThrowError(Error);
  });
});
