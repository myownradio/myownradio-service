# audio-uploader

Service used to upload user audio files in supported formats.

## Environment Variables

| Variable                    | Description                                              | Default Value |
| --------------------------- | -------------------------------------------------------- | ------------- |
| PORT                        | HTTP port on which server should listen for connections. | 8080          |
| AUDIO_UPLOADER_ROOT_DIR     | Directory on server where to store uploaded audio files. |               |
| AUDIO_UPLOADER_TOKEN_SECRET | Secret for JWT token validation.                         |               |

## Endpoints

## Upload Audio File

Upload audio file and return audio file metadata.

**URL** : `/upload`

**Method** : `POST`

**Auth required** : `YES`

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "name": "bob_marley_this_is_love.mp3",
  "hash": "d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c",
  "size": 8773803,
  "artist": "Bob Marley",
  "title": "This Is Love",
  "album": "Legend - The Best Of Bob Marley And The Wailers",
  "genre": "Reggae",
  "bitrate": 242824,
  "duration": 230.07475,
  "format": "MP2/3 (MPEG audio layer 2/3)",
  "path": "d/0/d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c"
}
```

### Error Response

**Condition** : If provided audio file is invalid, e.g. a format is not supported, file corrupted or audio file attached wasn't attached to request.

**Code** : `400 Bad Request`

**Content** : NO
