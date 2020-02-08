module.exports = {
  development: {
    client: "postgresql",
    connection: {
      database: "myownradio",
      user: "myownradio",
      password: "myownradio",
      port: 15432
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
