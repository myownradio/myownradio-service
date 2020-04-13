exports.seed = async function seed(knex) {
  const now = new Date().toISOString();
  await knex("audio_tracks").del();
  await knex("audio_tracks").insert([
    {
      id: 1,
      user_id: 1,
      channel_id: 1,
      created_at: now,
      updated_at: now,
      name: "bob_marley_this_is_love.mp3",
      hash: "d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c",
      size: 8773803,
      artist: "Bob Marley",
      title: "This Is Love",
      album: "Legend - The Best Of Bob Marley And The Wailers",
      genre: "Reggae",
      bitrate: 242824,
      duration: 230.07475,
      format: "MP2/3 (MPEG audio layer 2/3)",
      order_id: 1,
    },
    {
      id: 2,
      user_id: 1,
      channel_id: 2,
      created_at: now,
      updated_at: now,
      name: "bob_marley_this_is_love.mp3",
      hash: "d021bc63dd8f6dee822baa1b2a69b4e9a4d97a7c",
      size: 8773803,
      artist: "Bob Marley",
      title: "This Is Love",
      album: "Legend - The Best Of Bob Marley And The Wailers",
      genre: "Reggae",
      bitrate: 242824,
      duration: 230.07475,
      format: "MP2/3 (MPEG audio layer 2/3)",
      order_id: 1,
    },
  ]);
};
