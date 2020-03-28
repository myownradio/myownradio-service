# audio-uploader

Service used to handle uploads of audio files.

## Requirements

- Mac / Linux / Windows
- NodeJS 13 & yarn

## Install & Setup

```shell script
yarn install
yarn build
```

This service requires some environment variables for operation.
You can create `.env` file and use `env-cmd` to start project in local environment.

## Run

```shell script
# clean way
yarn start

# read env from .env file
npx env-cmd yarn start
```

## Environment Variables

| Variable                       | Description                                              | Default Value |
| ------------------------------ | -------------------------------------------------------- | ------------- |
| PORT                           | HTTP port on which server should listen for connections. | 8080          |
| AUDIO_UPLOADER_ROOT_DIR        | Directory on server where to store uploaded audio files. |               |
| AUDIO_UPLOADER_TOKEN_SECRET    | Secret for JWT token validation.                         |               |
| AUDIO_UPLOADER_METADATA_SECRET | Secret for making metadata signature.                    |               |

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

**Condition** : If provided audio file is invalid, e.g. a format is not supported, file corrupted or audio file wasn't attached to request.

**Code** : `400 Bad Request`

**Content** : NO
