import { createHmac } from "crypto"
import { IAudioTracksEntity, IAudioTracksEntity as AudioTracksEntity } from "@myownradio/shared-server/lib/entities"
import { Context } from "koa"

/**
 * Creates hmac digest using sha256 algorithm.
 * todo? move to shared library
 */
function createHmacDigest(data: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(data)
    .digest("hex")
}

/**
 * Validates that signature of provided metadata is correct and is not expired.
 * todo? move to shared library
 */
export function verifyMetadataSignature(rawMetadata: string, signature: string, secret: string, ttl: number): boolean {
  const decodedSignature = Buffer.from(signature, "base64").toString()
  const [extractedSignedAt, extractedHmacDigest] = decodedSignature.split(".", 2)
  const payload = `${extractedSignedAt}.${rawMetadata}`
  const hmacDigest = createHmacDigest(payload, secret)

  if (extractedHmacDigest !== hmacDigest) {
    return false
  }

  return Date.now() < +extractedSignedAt + ttl
}

export function calcTrackIndexAndOffset(
  playlistPosition: number,
  channelAudioTracks: AudioTracksEntity[],
): null | { offset: number; index: number } {
  let currentOffset = 0
  for (const [index, track] of channelAudioTracks.entries()) {
    if (currentOffset <= playlistPosition && currentOffset + +track.duration > playlistPosition) {
      return { index, offset: playlistPosition - currentOffset }
    }
    currentOffset += +track.duration
  }
  return null
}

export function calcNextTrackIndex(currentTrackIndex: number, channelAudioTracks: AudioTracksEntity[]): number {
  // if current track is last in playlist
  if (currentTrackIndex === channelAudioTracks.length - 1) {
    return 0
  }

  return currentTrackIndex + 1
}

export function getUserIdFromContext(ctx: Context): number {
  if (typeof ctx.state.user?.uid !== "number") {
    throw new TypeError(`Expected user id to be valid number`)
  }
  return ctx.state.user.uid
}

export function withOffset(
  tracks: ReadonlyArray<IAudioTracksEntity>,
): ReadonlyArray<{ readonly offset: number; track: IAudioTracksEntity }> {
  let offset = 0

  return tracks.map(track => {
    const trackWithOffset = { offset, track }

    offset += +track.duration

    return trackWithOffset
  })
}
