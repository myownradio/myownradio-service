module.exports = {
  development: {
    client: "pg",
    connection: {
      database: "myownradio",
      user: "myownradio",
      password: "myownradio",
      port: 15432,
    },
    pool: {
      min: 1,
      max: 10,
    },
  },
}
