import { getMediaFileMetadata } from "./utils"

describe("getMediaFileMetadata", () => {
  it("should get metadata from mp3 audio file", async () => {
    const filepath = `${__dirname}/../tests/__fixtures__/sine.mp3`
    const metadata = await getMediaFileMetadata(filepath)

    expect(metadata).toEqual({
      duration: 1074.75,
      bitrate: 242824,
      format: "MP2/3 (MPEG audio layer 2/3)",
      artist: "Sine Artist",
      title: "Sine Title",
      album: "Sine Album",
      genre: "Sine Genre",
    })
  })

  it("should get metadata in cp1251 encoding", async () => {
    const filepath = `${__dirname}/../tests/__fixtures__/cp1251.mp3`
    const metadata = await getMediaFileMetadata(filepath)

    expect(metadata).toEqual({
      duration: 206811.429,
      bitrate: 160183,
      format: "MP2/3 (MPEG audio layer 2/3)",
      artist: "Виа Гра",
      title: "Бомба",
      album: "",
      genre: "Other",
    })
  })

  it("should fail if file does not exist", async () => {
    const filepath = "/path/that/does/not/exist.mp3"
    await expect(getMediaFileMetadata(filepath)).rejects.toThrowError(Error)
  })
})
