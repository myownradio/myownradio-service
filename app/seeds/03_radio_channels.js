exports.seed = async function seed(knex) {
  const now = new Date().toISOString();
  await knex("radio_channels").del();
  await knex("radio_channels").insert([
    {
      id: 1,
      user_id: 1,
      title: "Foo Radio",
      created_at: now,
      updated_at: now,
    },
    {
      id: 2,
      user_id: 1,
      title: "Foo 2 Radio",
      created_at: now,
      updated_at: now,
    },
  ]);
};
