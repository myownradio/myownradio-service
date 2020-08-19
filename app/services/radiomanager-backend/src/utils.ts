import { createHmac } from "crypto"
import { IAudioTracksEntity as AudioTracksEntity } from "@myownradio/shared-server/lib/entities"

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

export function calcCurrentTrackIndexAndOffset(
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
