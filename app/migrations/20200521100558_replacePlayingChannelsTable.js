exports.up = async function(knex) {
  await knex.schema.dropTable("playing_channels");
  await knex.schema.createTable("playing_channels", table => {
    table.increments();
    table
      .integer("channel_id")
      .references("radio_channels.id")
      .notNullable();
    table
      .integer("start_offset")
      .notNullable()
      .defaultTo(0);
    table.timestamp("started_at").notNullable();
    table
      .timestamp("paused_at")
      .nullable()
      .defaultTo(null);
    table.timestamps();

    table.unique(["channel_id"]);
  });
};

exports.down = async function(knex) {
  await knex.schema.dropTable("playing_channels");
  await knex.schema.createTable("playing_channels", table => {
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
