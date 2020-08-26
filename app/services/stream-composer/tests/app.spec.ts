import "reflect-metadata"
import { Readable } from "stream"
import { Container, inject } from "inversify"
import * as supertest from "supertest"
import * as winston from "winston"
import { Logger } from "winston"
import { createApp } from "../src/app"
import { Config } from "../src/config"
import { ConfigType, EnvType, LoggerType } from "../src/di/types"
import { Env } from "../src/interfaces"
import { AudioDecoder, AudioDecoderImpl } from "../src/services/AudioDecoder"
import { ChannelPlayer, ChannelPlayerImpl } from "../src/services/ChannelPlayer"
import { RadioManagerClient } from "../src/services/RadioManagerClient"

const fixturesDir = `${__dirname}/__fixtures__`

let config: Config
let request: supertest.SuperTest<supertest.Test>

const radioManagerClientMock: jest.Mocked<RadioManagerClient> = {
  getNowPlaying: jest.fn(),
}

class TestChannelPlayer extends ChannelPlayerImpl {
  constructor(radiomanagerClient: RadioManagerClient, audioDecoder: AudioDecoder, @inject(LoggerType) logger: Logger) {
    super(radiomanagerClient, audioDecoder, logger)
  }

  public play(channelId: number): Readable {
    return super.play(channelId, { repeatTimes: 3, nativeFramerate: false })
  }
}

beforeEach(async () => {
  const logger = winston.createLogger({
    silent: true,
  })

  config = new Config({
    STREAM_COMPOSER_TOKEN_SECRET: "secret",
    STREAM_COMPOSER_RADIOMANAGER_BACKEND_URL: "http://backend.radiomanager.test",
  })

  const container = new Container()

  container.bind(EnvType).toConstantValue(Env.Test)
  container.bind(ConfigType).toConstantValue(config)
  container.bind(LoggerType).toConstantValue(logger)

  container.bind(ChannelPlayer).to(TestChannelPlayer)
  container.bind(AudioDecoder).to(AudioDecoderImpl)
  container.bind(RadioManagerClient).toConstantValue(radioManagerClientMock)

  request = supertest(createApp(container).callback())
})

afterEach(() => {
  jest.resetAllMocks()
})

describe("GET /listen/:channelId", () => {
  it("should respond with valid pcm audio response", async () => {
    radioManagerClientMock.getNowPlaying
      .mockResolvedValueOnce({
        position: 0,
        current: {
          id: "id0",
          offset: 0,
          title: "Sample 1",
          url: `file://${fixturesDir}/example1.mp3`,
        },
        next: {
          id: "id1",
          title: "Sample 2",
          url: `file://${fixturesDir}/example2.mp3`,
        },
      })
      .mockResolvedValueOnce({
        position: 1,
        current: {
          id: "id1",
          offset: 0,
          title: "Sample 2",
          url: `file://${fixturesDir}/example2.mp3`,
        },
        next: {
          id: "id2",
          title: "Sample 3",
          url: `file://${fixturesDir}/example3.mp3`,
        },
      })
      .mockResolvedValueOnce({
        position: 2,
        current: {
          id: "id2",
          offset: 0,
          title: "Sample 3",
          url: `file://${fixturesDir}/example3.mp3`,
        },
        next: {
          id: "id0",
          title: "Sample 1",
          url: `file://${fixturesDir}/example1.mp3`,
        },
      })

    const response = await request
      .get("/listen/kOD613")
      .expect("Content-Type", "audio/pcm")
      .expect(200)

    expect(response.text.length).toBe(10782422)
  })
})
