# fileserver
Auth: ```JWT Token```

Methods:

```GET /``` Check service availability.

```GET /foo/bar/baz``` Download file from fileserver.

```POST /foo/bar/baz``` Upload file to fileserver (should be specified `source` field)

```DELETE /foo/bar/baz``` Delete file from fileserver.
