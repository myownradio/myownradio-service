const Application = require("koa");
const Router = require("koa-router");
const body = require("koa-body");

const readToken = require("./middleware/readToken");
const verifyTokenAction = require("./middleware/verifyTokenAction");

const get = require("./routes/get");
const post = require("./routes/post");

const config = require("./config");

const app = new Application();

const rootRouter = new Router();
const secureRouter = new Router();

rootRouter.all("/", ctx => (ctx.body = "OK"));

secureRouter.use(readToken);
secureRouter.get("*", verifyTokenAction("read"), get);
secureRouter.post(
  "*",
  verifyTokenAction("write"),
  body({ multipart: true }),
  post
);

app.use(rootRouter.routes(), rootRouter.allowedMethods());
app.use(secureRouter.routes(), secureRouter.allowedMethods());

const port = process.env.PORT || 8080;

const server = app.listen(port, () => {
  console.log(`Content Directory: ${config.contentDir}`);
  console.log(`Listening Port: ${port}`);
});

process
  .on("SIGINT", () => {
    console.log("Shutdown signal received - SIGINT");
    process.exit(1);
  })
  .on("SIGTERM", () => {
    console.log("Shutdown signal received - SIGTERM");

    server.close(err => {
      if (err) {
        console.error(
          `Error caused during http server shutdown - ${err.stack || err}`
        );
      }

      process.exit(1);
    });
  });
