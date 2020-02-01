const rc = require('rc');
const parse = require('parse-strings-in-object');

module.exports = parse(rc('fileserver', {
  contentDir: "/tmp/fileserver",
  tokenSecret: "CHANGE_ME",
}));
