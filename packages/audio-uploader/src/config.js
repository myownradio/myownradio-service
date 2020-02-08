const { assert } = require("@myownradio/shared");

const { ROOT_FOLDER, TOKEN_SECRET, PORT } = process.env;

const config = { ROOT_FOLDER, TOKEN_SECRET, PORT };

assert(typeof config.PORT === 'string');
assert(typeof config.ROOT_FOLDER === 'string');
assert(typeof config.TOKEN_SECRET === 'string');

module.exports = config;
