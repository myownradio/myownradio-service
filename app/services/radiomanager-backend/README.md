# radiomanager-backend

Service allows users to manage own radio stations and audio files.

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

| Variable                                    | Description                                                     | Default Value |
| ------------------------------------------- | --------------------------------------------------------------- | ------------- |
| PORT                                        | HTTP port on which server should listen for connections.        | 8080          |
| RADIOMANAGER_BACKEND_TOKEN_SECRET           | Secret for JWT token validation.                                |               |
| RADIOMANAGER_BACKEND_METADATA_SECRET        | Secret for metadata signature validation.                       |               |
| RADIOMANAGER_BACKEND_ALLOWED_ORIGIN         | Parameter required for cross-origin resource sharing.           |               |
| RADIOMANAGER_BACKEND_DATABASE_URL           | URL on which PostgreSQL database listening for connections.     |               |
| RADIOMANAGER_BACKEND_DATABASE_CLIENT        | Which driver should be used for SQL connection.                 |               |
| RADIOMANAGER_BACKEND_METADATA_SIGNATURE_TTL | After how long (in milliseconds) metadata signature will expire |               |

## Endpoints

## Create Radio Channel

Create radio channel and return radio channel id.

**URL** : `/channels/create`

**Method** : `POST`

**Auth required** : `YES`

### Request Body Example

```json
{
  "title": "Radio Station Title"
}
```

### Success Response

**Code** : `200 OK`

**Content example**

```json
{
  "id": 10
}
```

### Error Response

| Code             | Condition                               | Content |
| ---------------- | --------------------------------------- | ------- |
| 400 Bad Request  | If malformed request body was provided. | NO      |
| 401 Unauthorized | If request is not authorized.           | NO      |
