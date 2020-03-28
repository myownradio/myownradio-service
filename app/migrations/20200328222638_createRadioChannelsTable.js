exports.up = function up(knex) {
  return knex.schema.createTable("radio_channels", table => {
    table.increments();
    table
      .integer("user_id")
      .references("users.id")
      .notNullable();
    table.string("title").notNullable();
    table.timestamps();
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTable("radio_channels");
};
