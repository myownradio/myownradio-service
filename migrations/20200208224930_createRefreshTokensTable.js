exports.up = function up(knex) {
  return knex.schema.createTable("refresh_tokens", table => {
    table.increments();
    table
      .integer("user_id")
      .nullable()
      .references("users.id");

    table.string("issuer").notNullable();
    table.string("refresh_token").notNullable();

    table.unique(["refresh_token"]);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTable("refresh_tokens");
};
