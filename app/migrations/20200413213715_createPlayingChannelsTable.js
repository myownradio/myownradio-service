exports.up = function up(knex) {
  return knex.schema.createTable("playing_channels", table => {
    table.increments();
    table
      .integer("channel_id")
      .references("radio_channels.id")
      .notNullable();
    table
      .integer("start_offset")
      .notNullable()
      .defaultTo(0);
    table.integer("started_at").notNullable();
    table
      .integer("paused_at")
      .nullable()
      .defaultTo(null);
    table.timestamps();

    table.unique(["channel_id"]);
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTable("playing_channels");
};
