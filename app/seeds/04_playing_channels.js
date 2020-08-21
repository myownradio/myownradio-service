exports.seed = async function seed(knex) {
  await knex("playing_channels").del()
  await knex("playing_channels").insert([
    {
      id: 1,
      channel_id: 2,
      start_offset: 0,
      started_at: "2020-04-02T17:41:41.429Z",
      paused_at: null,
      created_at: "2020-02-09T11:12:06.585Z",
      updated_at: "2020-02-09T11:12:06.585Z",
    },
  ])
}
