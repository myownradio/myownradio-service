module.exports = {
  production: {
    client: "postgresql",
    connection: process.env.MIGRATION_DATABASE_URL,
    migrations: {
      directory: "/usr/app/migrations",
    },
  },
};
