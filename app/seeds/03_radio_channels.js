exports.seed = async function seed(knex) {
  await knex("radio_channels").del();
  await knex("radio_channels").insert([
    {
      id: 1,
      user_id: 1,
      title: "Foo Radio",
      created_at: "2020-02-09T11:12:06.585Z",
      updated_at: "2020-02-09T11:12:06.585Z",
    },
    {
      id: 2,
      user_id: 1,
      title: "Foo 2 Radio",
      created_at: "2020-02-09T11:12:06.585Z",
      updated_at: "2020-02-09T11:12:06.585Z",
    },
  ]);
};
