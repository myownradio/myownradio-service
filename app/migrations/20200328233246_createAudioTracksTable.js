exports.up = function up(knex) {
  return knex.schema.createTable("audio_tracks", table => {
    table.increments();
    table
      .integer("user_id")
      .references("users.id")
      .notNullable();
    table
      .integer("channel_id")
      .references("radio_channels.id")
      .notNullable();

    table.string("name").notNullable();
    table.string("hash").notNullable();
    table.integer("size").notNullable();
    table.string("artist").notNullable();
    table.string("title").notNullable();
    table.string("album").notNullable();
    table.string("genre").notNullable();
    table.integer("bitrate").notNullable();
    table.decimal("duration", 24, 8).notNullable();
    table.string("format").notNullable();
    table.string("path").notNullable();

    table.timestamps();
  });
};

exports.down = function down(knex) {
  return knex.schema.dropTable("audio_tracks");
};
