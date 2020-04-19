**Audio Preview**
----
Generates audio stream in MP3 format for preview of audio file.

* **URL**

  `/audio/preview/:trackId`

* **Method:**

  `GET`

* **URL Params:**

  **Required:**

  `trackId=[integer]`

* **Headers:**

  **Required:**

  `Authentication: Bearer <Access Token>`

* **Success Response:**

  * **Code:** `200` <br />
    **Content:** `<Audio Content>` <br />
    **Content Type:** `audio/mpeg` <br />

* **Error Response:**

  * **Code:** `404 Not Found` <br />

  * **Code:** `401 Unauthorized` <br />
