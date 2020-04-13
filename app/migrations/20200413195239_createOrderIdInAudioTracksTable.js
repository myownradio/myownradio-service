exports.up = function(knex) {
  return knex.schema.table("audio_tracks", table => {
    table
      .integer("order_id")
      .notNullable()
      .defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.table("audio_tracks", table => {
    table.dropColumn("order_id");
  });
};
