exports.seed = async function seed(knex) {
  const now = new Date().toISOString();
  const nowMs = Date.now();
  await knex("playing_channels").del();
  await knex("playing_channels").insert([
    {
      id: 1,
      channel_id: 2,
      start_offset: 0,
      started_at: nowMs,
      paused_at: null,
      created_at: now,
      updated_at: now,
    },
  ]);
};
