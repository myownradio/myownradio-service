const rc = require('rc');
const parse = require('parse-strings-in-object');

module.exports = parse(rc('fileserver', {
  contentDir: process.env.CONTENT_DIR,
  tokenSecret: process.env.TOKEN_SECRET,
}));
