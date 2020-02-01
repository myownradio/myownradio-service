const Application = require("koa");
const Router = require("koa-router");
const body = require("koa-body");

const readToken = require('./middleware/readToken');
const verifyTokenAction = require('./middleware/verifyTokenAction');

const get = require('./routes/get');

const app = new Application();
const router = new Router();

app.use(readToken);

app.use(body({ multipart: true }));
app.use(router.routes(), router.allowedMethods());

app.listen(8080);

router.get('*', verifyTokenAction('read'), get);
