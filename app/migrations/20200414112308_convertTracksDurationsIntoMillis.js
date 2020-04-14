exports.up = function(knex) {
  return knex("audio_tracks").update("duration", knex.raw("?? * 1000", ["duration"]));
};

exports.down = function(knex) {
  return knex("audio_tracks").update("duration", knex.raw("?? / 1000", ["duration"]));
};
