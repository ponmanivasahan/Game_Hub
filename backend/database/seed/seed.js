const bcrypt = require('bcryptjs');
const { pool, transaction } = require('../../src/config/database');

async function seedDatabase() {
  console.log('[Seed] Seeding rich and beautiful IndieGamer Hub database...');

  await transaction(async (conn) => {
    await conn.query('DELETE FROM chat_messages');
    await conn.query('DELETE FROM notifications');
    await conn.query('DELETE FROM game_sync_logs');
    await conn.query('DELETE FROM external_game_data');
    await conn.query('DELETE FROM featured_game_history');
    await conn.query('DELETE FROM user_activity');
    await conn.query('DELETE FROM game_favorites');
    await conn.query('DELETE FROM posts');
    await conn.query('DELETE FROM threads');
    await conn.query('DELETE FROM reviews');
    await conn.query('DELETE FROM game_store_links');
    await conn.query('DELETE FROM game_screenshots');
    await conn.query('DELETE FROM game_platforms');
    await conn.query('DELETE FROM game_tags');
    await conn.query('DELETE FROM game_genres');
    await conn.query('DELETE FROM platforms');
    await conn.query('DELETE FROM tags');
    await conn.query('DELETE FROM genres');
    await conn.query('DELETE FROM games');
    await conn.query('DELETE FROM users');

    const passwordHash = await bcrypt.hash('Password@123', 10);

    const usersData = [
      {
        name: 'Elena Rostova',
        username: 'admin_elena',
        email: 'admin@indiegamerhub.com',
        role: 'admin',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Platform Administrator & Indie Game Advocate. Curating the best gaming gems.',
        last_login_at: new Date(Date.now() - 1000 * 60 * 15)
      },
      {
        name: 'Team Cherry',
        username: 'teamcherry',
        email: 'teamcherry@indiegamerhub.com',
        role: 'developer',
        avatar_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
        bio: 'Indie games team based in Adelaide, Australia. Creators of Hollow Knight & Silksong.',
        last_login_at: new Date(Date.now() - 1000 * 60 * 60 * 2)
      },
      {
        name: 'Supergiant Games',
        username: 'supergiant',
        email: 'supergiant@indiegamerhub.com',
        role: 'developer',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        bio: 'Independent studio based in San Francisco. Creators of Bastion, Transistor, Pyre & Hades.',
        last_login_at: new Date(Date.now() - 1000 * 60 * 60 * 5)
      },
      {
        name: 'Sabotage Studio',
        username: 'sabotage',
        email: 'sabotage@indiegamerhub.com',
        role: 'developer',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        bio: 'Quebec-based indie studio. Creators of The Messenger and Sea of Stars.',
        last_login_at: new Date(Date.now() - 1000 * 60 * 60 * 8)
      },
      {
        name: 'ConcernedApe',
        username: 'concernedape',
        email: 'concernedape@indiegamerhub.com',
        role: 'developer',
        avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
        bio: 'Solo developer of Stardew Valley & Haunted Chocolatier. Pixel artist & musician.',
        last_login_at: new Date(Date.now() - 1000 * 60 * 60 * 12)
      },
      {
        name: 'Studio MDHR',
        username: 'studiomdhr',
        email: 'studiomdhr@indiegamerhub.com',
        role: 'developer',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
        bio: 'Canadian independent studio specializing in traditional 1930s hand-drawn animation. Creators of Cuphead.',
        last_login_at: new Date(Date.now() - 1000 * 60 * 60 * 20)
      },
      {
        name: 'Alex Vance',
        username: 'alex_vance',
        email: 'alex@gamer.com',
        role: 'gamer',
        avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        bio: 'Metroidvania speedrunner and platformer connoisseur.',
        last_login_at: new Date(Date.now() - 1000 * 60 * 10)
      },
      {
        name: 'Maya Lin',
        username: 'pixel_maya',
        email: 'maya@gamer.com',
        role: 'gamer',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
        bio: 'Pixel art critic & JRPG soundtrack lover.',
        last_login_at: new Date(Date.now() - 1000 * 60 * 30)
      },
      {
        name: 'Liam O\'Connor',
        username: 'retro_liam',
        email: 'liam@gamer.com',
        role: 'gamer',
        avatar_url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=400&q=80',
        bio: 'Soulslike veteran & Metroidvania forum mod.',
        last_login_at: new Date(Date.now() - 1000 * 60 * 60 * 1)
      },
      {
        name: 'Sarah Chen',
        username: 'cyber_sarah',
        email: 'sarah@gamer.com',
        role: 'gamer',
        avatar_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
        bio: 'Roguelike addict. Over 1,000 hours in Hades, Dead Cells, and Slay the Spire.',
        last_login_at: new Date(Date.now() - 1000 * 60 * 45)
      }
    ];

    const userMap = {};
    for (const u of usersData) {
      const [res] = await conn.execute(
        `INSERT INTO users (name, username, email, password_hash, role, avatar_url, bio, last_login_at, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 45 DAY))`,
        [u.name, u.username, u.email, passwordHash, u.role, u.avatar_url, u.bio, u.last_login_at]
      );
      userMap[u.username] = res.insertId;
    }

    const genresList = [
      { name: 'Action', slug: 'action' },
      { name: 'Adventure', slug: 'adventure' },
      { name: 'RPG', slug: 'rpg' },
      { name: 'Metroidvania', slug: 'metroidvania' },
      { name: 'Roguelike', slug: 'roguelike' },
      { name: 'Platformer', slug: 'platformer' },
      { name: 'Puzzle', slug: 'puzzle' },
      { name: 'Strategy', slug: 'strategy' },
      { name: 'Simulation', slug: 'simulation' },
      { name: 'Casual', slug: 'casual' }
    ];
    const genreMap = {};
    for (const g of genresList) {
      const [res] = await conn.execute(
        `INSERT INTO genres (name, slug) VALUES (?, ?)`,
        [g.name, g.slug]
      );
      genreMap[g.slug] = res.insertId;
    }

    const tagsList = [
      { name: 'Atmospheric', slug: 'atmospheric' },
      { name: 'Difficult', slug: 'difficult' },
      { name: 'Great Soundtrack', slug: 'great-soundtrack' },
      { name: 'Pixel Art', slug: 'pixel-art' },
      { name: 'Story Rich', slug: 'story-rich' },
      { name: 'Hand-Drawn', slug: 'hand-drawn' },
      { name: 'Fast-Paced', slug: 'fast-paced' },
      { name: 'Turn-Based', slug: 'turn-based' },
      { name: 'Cozy', slug: 'cozy' },
      { name: 'Deckbuilder', slug: 'deckbuilder' }
    ];
    const tagMap = {};
    for (const t of tagsList) {
      const [res] = await conn.execute(
        `INSERT INTO tags (name, slug) VALUES (?, ?)`,
        [t.name, t.slug]
      );
      tagMap[t.slug] = res.insertId;
    }

    const platformsList = [
      { name: 'Windows', slug: 'windows' },
      { name: 'macOS', slug: 'macos' },
      { name: 'Linux', slug: 'linux' },
      { name: 'Nintendo Switch', slug: 'nintendo-switch' },
      { name: 'PlayStation 5', slug: 'ps5' },
      { name: 'Xbox Series X/S', slug: 'xbox-series' }
    ];
    const platformMap = {};
    for (const p of platformsList) {
      const [res] = await conn.execute(
        `INSERT INTO platforms (name, slug) VALUES (?, ?)`,
        [p.name, p.slug]
      );
      platformMap[p.slug] = res.insertId;
    }

    const gamesData = [
      {
        title: 'Hollow Knight',
        slug: 'hollow-knight',
        description: 'Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures, and befriend bizarre bugs, all in a classic, hand-drawn 2D style.',
        release_date: '2017-02-24',
        developer_id: userMap['teamcherry'],
        steam_app_id: '367520',
        steam_price: 14.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=UAO2urG23S4',
        playable_demo_url: 'builtin://retro-runner',
        average_rating: 4.92,
        review_count: 5,
        is_featured: true,
        status: 'published',
        published_at: '2017-02-24 00:00:00',
        genres: ['action', 'adventure', 'metroidvania'],
        tags: ['atmospheric', 'difficult', 'hand-drawn', 'great-soundtrack'],
        platforms: ['windows', 'macos', 'linux', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/367520/Hollow_Knight/' },
          { name: 'itch', url: 'https://teamcherry.itch.io/hollow-knight' }
        ]
      },
      {
        title: 'Hades',
        slug: 'hades',
        description: 'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre. Featuring rapid combat, lush hand-painted environments, and dozens of Olympic boons.',
        release_date: '2020-09-17',
        developer_id: userMap['supergiant'],
        steam_app_id: '1145360',
        steam_price: 24.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=91t0ha9x0AE',
        playable_demo_url: 'builtin://arcade-shooter',
        average_rating: 4.95,
        review_count: 4,
        is_featured: true,
        status: 'published',
        published_at: '2020-09-17 00:00:00',
        genres: ['action', 'roguelike', 'rpg'],
        tags: ['fast-paced', 'great-soundtrack', 'story-rich', 'difficult'],
        platforms: ['windows', 'macos', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80',
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/1145360/Hades/' },
          { name: 'epic', url: 'https://store.epicgames.com/p/hades' }
        ]
      },
      {
        title: 'Sea of Stars',
        slug: 'sea-of-stars',
        description: 'Sea of Stars is a turn-based RPG inspired by the golden era of 90s classics. It tells the story of two Children of the Solstice who combine the powers of the sun and moon to perform Eclipse Magic.',
        release_date: '2023-08-29',
        developer_id: userMap['sabotage'],
        steam_app_id: '1244090',
        steam_price: 34.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=1KvhgK0Xp4E',
        playable_demo_url: 'builtin://retro-runner',
        average_rating: 4.82,
        review_count: 3,
        is_featured: true,
        status: 'published',
        published_at: '2023-08-29 00:00:00',
        genres: ['rpg', 'adventure'],
        tags: ['pixel-art', 'turn-based', 'great-soundtrack', 'story-rich'],
        platforms: ['windows', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/1244090/Sea_of_Stars/' }
        ]
      },
      {
        title: 'Stardew Valley',
        slug: 'stardew-valley',
        description: 'You\'ve inherited your grandfather\'s old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home?',
        release_date: '2016-02-26',
        developer_id: userMap['concernedape'],
        steam_app_id: '413150',
        steam_price: 14.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1500964757637-c85e8a162699?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=ot7uXNQskdU',
        playable_demo_url: 'builtin://arcade-shooter',
        average_rating: 4.96,
        review_count: 4,
        is_featured: true,
        status: 'published',
        published_at: '2016-02-26 00:00:00',
        genres: ['simulation', 'rpg', 'casual'],
        tags: ['pixel-art', 'cozy', 'great-soundtrack'],
        platforms: ['windows', 'macos', 'linux', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/413150/Stardew_Valley/' }
        ]
      },
      {
        title: 'Cuphead',
        slug: 'cuphead',
        description: 'Cuphead is a classic run and gun action game heavily focused on boss battles. Inspired by cartoons of the 1930s, the visuals and audio are painstakingly created with the same techniques of the era.',
        release_date: '2017-09-29',
        developer_id: userMap['studiomdhr'],
        steam_app_id: '268910',
        steam_price: 19.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=NN-9SQXoi50',
        playable_demo_url: 'builtin://retro-runner',
        average_rating: 4.88,
        review_count: 3,
        is_featured: true,
        status: 'published',
        published_at: '2017-09-29 00:00:00',
        genres: ['action', 'platformer'],
        tags: ['hand-drawn', 'difficult', 'great-soundtrack'],
        platforms: ['windows', 'macos', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/268910/Cuphead/' }
        ]
      },
      {
        title: 'Celeste',
        slug: 'celeste',
        description: 'Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight, hand-crafted platformer from the creators of multiplayer classic TowerFall.',
        release_date: '2018-01-25',
        developer_id: userMap['sabotage'],
        steam_app_id: '504230',
        steam_price: 19.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=70d9irlxiB4',
        playable_demo_url: 'builtin://retro-runner',
        average_rating: 4.89,
        review_count: 2,
        is_featured: false,
        status: 'published',
        published_at: '2018-01-25 00:00:00',
        genres: ['platformer', 'adventure'],
        tags: ['pixel-art', 'difficult', 'story-rich', 'great-soundtrack'],
        platforms: ['windows', 'macos', 'linux', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/504230/Celeste/' }
        ]
      },
      {
        title: 'Dead Cells',
        slug: 'dead-cells',
        description: 'Dead Cells is a rogue-lite, metroidvania inspired action-platformer. You will explore a sprawling, ever-changing castle... assuming you\'re able to fight your way past its keepers in 2D souls-lite combat.',
        release_date: '2018-08-07',
        developer_id: userMap['sabotage'],
        steam_app_id: '588650',
        steam_price: 24.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=gX4cGcwE4Wc',
        playable_demo_url: 'builtin://arcade-shooter',
        average_rating: 4.78,
        review_count: 2,
        is_featured: false,
        status: 'published',
        published_at: '2018-08-07 00:00:00',
        genres: ['action', 'roguelike', 'metroidvania'],
        tags: ['fast-paced', 'pixel-art', 'difficult'],
        platforms: ['windows', 'macos', 'linux', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/588650/Dead_Cells/' }
        ]
      },
      {
        title: 'Slay the Spire',
        slug: 'slay-the-spire',
        description: 'We fused card games and roguelikes together to make the best single player deckbuilder we could. Craft a unique deck, encounter bizarre creatures, discover relics of immense power, and Slay the Spire!',
        release_date: '2019-01-23',
        developer_id: userMap['supergiant'],
        steam_app_id: '646570',
        steam_price: 24.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=R5pC5wB51gU',
        playable_demo_url: 'builtin://arcade-shooter',
        average_rating: 4.90,
        review_count: 2,
        is_featured: false,
        status: 'published',
        published_at: '2019-01-23 00:00:00',
        genres: ['strategy', 'roguelike'],
        tags: ['deckbuilder', 'turn-based', 'difficult'],
        platforms: ['windows', 'macos', 'linux', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/646570/Slay_the_Spire/' }
        ]
      },
      {
        title: 'Hollow Knight: Silksong',
        slug: 'hollow-knight-silksong',
        description: 'Discover a vast, haunted kingdom in Hollow Knight: Silksong! The sequel to the award-winning action-adventure. Explore, fight and survive as Hornet, princess-protector of Hallownest, captured and brought to this unfamiliar world ruled by silk and song.',
        release_date: '2026-11-28',
        developer_id: userMap['teamcherry'],
        steam_app_id: '1030300',
        steam_price: 29.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=pFAknD_9U7c',
        playable_demo_url: 'builtin://retro-runner',
        average_rating: 0.00,
        review_count: 0,
        is_featured: true,
        status: 'published',
        published_at: '2026-10-01 00:00:00',
        genres: ['action', 'adventure', 'metroidvania'],
        tags: ['atmospheric', 'difficult', 'hand-drawn', 'great-soundtrack'],
        platforms: ['windows', 'macos', 'linux', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/1030300/Hollow_Knight_Silksong/' }
        ]
      },
      {
        title: 'Hades II',
        slug: 'hades-ii',
        description: 'Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this spellbinding sequel to the award-winning rogue-like dungeon crawler. As Melinoë, the immortal Princess of the Underworld, you will explore a bigger, deeper mythic world.',
        release_date: '2026-12-18',
        developer_id: userMap['supergiant'],
        steam_app_id: '1145350',
        steam_price: 29.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=cM3P94iWn_k',
        playable_demo_url: 'builtin://arcade-shooter',
        average_rating: 0.00,
        review_count: 0,
        is_featured: true,
        status: 'published',
        published_at: '2026-10-05 00:00:00',
        genres: ['action', 'roguelike', 'rpg'],
        tags: ['fast-paced', 'great-soundtrack', 'story-rich'],
        platforms: ['windows', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/1145350/Hades_II/' }
        ]
      },
      {
        title: 'Crowsworn',
        slug: 'crowsworn',
        description: 'An atmospheric, hand-drawn Metroidvania set in a dark and stylish world populated by blind creatures and fearsome monsters. Master your scythe and sidearms in lightning-fast combat.',
        release_date: '2027-02-14',
        developer_id: userMap['sabotage'],
        steam_app_id: '1728460',
        steam_price: 24.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=Fj-yZ4k0X50',
        playable_demo_url: 'builtin://retro-runner',
        average_rating: 0.00,
        review_count: 0,
        is_featured: false,
        status: 'published',
        published_at: '2026-10-10 00:00:00',
        genres: ['action', 'metroidvania'],
        tags: ['atmospheric', 'difficult', 'hand-drawn', 'fast-paced'],
        platforms: ['windows', 'nintendo-switch', 'ps5', 'xbox-series'],
        screenshots: [
          'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/1728460/Crowsworn/' }
        ]
      },
      {
        title: 'Mina the Hollower',
        slug: 'mina-the-hollower',
        description: 'From Yacht Club Games, creators of Shovel Knight: take control of Mina, a renowned Hollower who uses her whip and underground burrowing abilities to battle through a gothic Victorian landscape.',
        release_date: '2027-03-25',
        developer_id: userMap['supergiant'],
        steam_app_id: '1875580',
        steam_price: 19.99,
        currency: 'USD',
        cover_image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
        trailer_url: 'https://www.youtube.com/watch?v=Fj-yZ4k0X50',
        playable_demo_url: 'builtin://arcade-shooter',
        average_rating: 0.00,
        review_count: 0,
        is_featured: false,
        status: 'published',
        published_at: '2026-10-12 00:00:00',
        genres: ['action', 'adventure'],
        tags: ['pixel-art', 'atmospheric', 'great-soundtrack'],
        platforms: ['windows', 'nintendo-switch', 'ps5'],
        screenshots: [
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1000&q=80'
        ],
        stores: [
          { name: 'steam', url: 'https://store.steampowered.com/app/1875580/Mina_the_Hollower/' }
        ]
      }
    ];

    const gameMap = {};
    for (const g of gamesData) {
      const [res] = await conn.execute(
        `INSERT INTO games (
          title, slug, description, release_date, developer_id, steam_app_id,
          steam_price, currency, cover_image_url, trailer_url, playable_demo_url,
          average_rating, review_count, is_featured, status, published_at, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, DATE_SUB(NOW(), INTERVAL 20 DAY))`,
        [
          g.title, g.slug, g.description, g.release_date, g.developer_id, g.steam_app_id,
          g.steam_price, g.currency, g.cover_image_url, g.trailer_url, g.playable_demo_url,
          g.average_rating, g.review_count, g.is_featured, g.status, g.published_at
        ]
      );
      const gameId = res.insertId;
      gameMap[g.slug] = gameId;

      for (const genreSlug of g.genres) {
        if (genreMap[genreSlug]) {
          await conn.execute(
            `INSERT INTO game_genres (game_id, genre_id) VALUES (?, ?)`,
            [gameId, genreMap[genreSlug]]
          );
        }
      }

      for (const tagSlug of g.tags) {
        if (tagMap[tagSlug]) {
          await conn.execute(
            `INSERT INTO game_tags (game_id, tag_id) VALUES (?, ?)`,
            [gameId, tagMap[tagSlug]]
          );
        }
      }

      for (const platformSlug of g.platforms) {
        if (platformMap[platformSlug]) {
          await conn.execute(
            `INSERT INTO game_platforms (game_id, platform_id) VALUES (?, ?)`,
            [gameId, platformMap[platformSlug]]
          );
        }
      }

      for (let i = 0; i < g.screenshots.length; i++) {
        await conn.execute(
          `INSERT INTO game_screenshots (game_id, image_url, display_order) VALUES (?, ?, ?)`,
          [gameId, g.screenshots[i], i]
        );
      }

      for (const s of g.stores) {
        await conn.execute(
          `INSERT INTO game_store_links (game_id, store_name, store_url) VALUES (?, ?, ?)`,
          [gameId, s.name, s.url]
        );
      }

      if (g.is_featured) {
        await conn.execute(
          `INSERT INTO featured_game_history (game_id, enabled_by, started_at) VALUES (?, ?, DATE_SUB(NOW(), INTERVAL 20 DAY))`,
          [gameId, userMap['admin_elena']]
        );
      }
    }

    const reviewsData = [
      {
        game_id: gameMap['hollow-knight'],
        user_id: userMap['alex_vance'],
        rating: 5,
        review_text: 'A masterpiece of mood, design, and atmosphere. Hallownest is hauntingly beautiful and one of the finest Metroidvanias ever crafted.',
        days_ago: 1,
        is_edited: false
      },
      {
        game_id: gameMap['hollow-knight'],
        user_id: userMap['pixel_maya'],
        rating: 5,
        review_text: 'The music, the hand-drawn art, the fluid swordplay. Every boss fight feels earned. Cannot wait for Silksong!',
        days_ago: 2,
        is_edited: true
      },
      {
        game_id: gameMap['hollow-knight'],
        user_id: userMap['retro_liam'],
        rating: 5,
        review_text: 'I have sunk over 120 hours into this game across multiple platforms. Still finding secrets.',
        days_ago: 3,
        is_edited: false
      },
      {
        game_id: gameMap['hollow-knight'],
        user_id: userMap['cyber_sarah'],
        rating: 5,
        review_text: 'The boss fights in the Pantheon of Hallownest are some of the most thrilling gaming challenges ever created.',
        days_ago: 5,
        is_edited: false
      },
      {
        game_id: gameMap['hades'],
        user_id: userMap['alex_vance'],
        rating: 5,
        review_text: 'Supergiant has set a new gold standard for narrative roguelikes. Voice acting and snappy combat are peerless.',
        days_ago: 1,
        is_edited: false
      },
      {
        game_id: gameMap['hades'],
        user_id: userMap['pixel_maya'],
        rating: 5,
        review_text: 'The weapon variety and boon combinations make every single escape attempt feel fresh and thrilling.',
        days_ago: 2,
        is_edited: false
      },
      {
        game_id: gameMap['hades'],
        user_id: userMap['cyber_sarah'],
        rating: 5,
        review_text: 'The dynamic dialogue never repeats. Even after 80 runs, characters still react to your choices.',
        days_ago: 4,
        is_edited: false
      },
      {
        game_id: gameMap['stardew-valley'],
        user_id: userMap['pixel_maya'],
        rating: 5,
        review_text: 'The ultimate comfort game. Eric Barone poured his heart and soul into this, and it shines in every single pixel.',
        days_ago: 2,
        is_edited: false
      },
      {
        game_id: gameMap['stardew-valley'],
        user_id: userMap['cyber_sarah'],
        rating: 5,
        review_text: 'Started playing for 20 minutes before bed, ended up playing until 4 in the morning. Absolutely timeless.',
        days_ago: 3,
        is_edited: false
      },
      {
        game_id: gameMap['sea-of-stars'],
        user_id: userMap['pixel_maya'],
        rating: 5,
        review_text: 'Gives the same feeling Chrono Trigger gave me decades ago. Gorgeous dynamic lighting and heartwarming writing.',
        days_ago: 2,
        is_edited: false
      },
      {
        game_id: gameMap['sea-of-stars'],
        user_id: userMap['retro_liam'],
        rating: 4,
        review_text: 'Wonderful battle system with timed hits. The pixel animations are out of this world.',
        days_ago: 6,
        is_edited: false
      },
      {
        game_id: gameMap['cuphead'],
        user_id: userMap['retro_liam'],
        rating: 5,
        review_text: 'Unforgiving difficulty blended with 1930s big band jazz and hand-inked cel animation. Nothing else like it.',
        days_ago: 4,
        is_edited: false
      },
      {
        game_id: gameMap['celeste'],
        user_id: userMap['alex_vance'],
        rating: 5,
        review_text: 'Heartfelt story about anxiety coupled with razor sharp precision platforming mechanics. 10/10 soundtrack by Lena Raine.',
        days_ago: 12,
        is_edited: false
      },
      {
        game_id: gameMap['dead-cells'],
        user_id: userMap['cyber_sarah'],
        rating: 5,
        review_text: 'Fast, brutal, responsive. The weapon combinations and speed modifiers make it hard to put down.',
        days_ago: 6,
        is_edited: false
      }
    ];

    for (const r of reviewsData) {
      const createdAt = new Date(Date.now() - r.days_ago * 24 * 60 * 60 * 1000);
      const updatedAt = r.is_edited ? new Date(createdAt.getTime() + 1000 * 60 * 60 * 5) : createdAt;
      await conn.execute(
        `INSERT INTO reviews (game_id, user_id, rating, review_text, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [r.game_id, r.user_id, r.rating, r.review_text, createdAt, updatedAt]
      );
    }

    const thread1 = await conn.execute(
      `INSERT INTO threads (game_id, user_id, title, content, is_locked, last_activity_at, created_at)
       VALUES (?, ?, ?, ?, FALSE, NOW(), DATE_SUB(NOW(), INTERVAL 3 DAY))`,
      [
        gameMap['hollow-knight'],
        userMap['retro_liam'],
        'Tips for defeating the Nightmare King Grimm?',
        'I have been stuck on NKG for three days now. His dash attacks are so fast. What charm builds are you all using?',
      ]
    );
    const thread1Id = thread1[0].insertId;

    await conn.execute(
      `INSERT INTO posts (thread_id, user_id, content, created_at)
       VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL 2 DAY))`,
      [
        thread1Id,
        userMap['alex_vance'],
        'Use Shape of Unn + Quick Focus! You can heal under his flame pillar attack safely. And do not be greedy: only strike once per opening.'
      ]
    );

    await conn.execute(
      `INSERT INTO posts (thread_id, user_id, content, created_at)
       VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL 1 DAY))`,
      [
        thread1Id,
        userMap['teamcherry'],
        'Patience is key! Learn the audio cues right before each dash. Good luck in the nightmare realm!'
      ]
    );

    const thread2 = await conn.execute(
      `INSERT INTO threads (game_id, user_id, title, content, is_locked, last_activity_at, created_at)
       VALUES (?, ?, ?, ?, FALSE, NOW(), DATE_SUB(NOW(), INTERVAL 1 DAY))`,
      [
        gameMap['hades'],
        userMap['pixel_maya'],
        'Favorite Aspect on the Twin Fists of Malphon?',
        'Aspect of Demeter with Zeus on attack and Poseidon on special creates absolute room-clearing fireworks. What is your go-to build?',
      ]
    );
    const thread2Id = thread2[0].insertId;

    await conn.execute(
      `INSERT INTO posts (thread_id, user_id, content, created_at)
       VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL 12 HOUR))`,
      [
        thread2Id,
        userMap['alex_vance'],
        'Aspect of Talos! Pulling foes directly into an Athena dash strike is ridiculously satisfying.'
      ]
    );

    const chatMessages = [
      { user: 'alex_vance', channel: 'general', msg: 'Has anyone tested the web arcade demo on Hollow Knight yet? Runs so smooth!', minutes_ago: 45 },
      { user: 'pixel_maya', channel: 'general', msg: 'Yes!! Love the retro controls. Brought back so many memories.', minutes_ago: 38 },
      { user: 'teamcherry', channel: 'general', msg: 'Thanks for playing everyone! We are hard at work on Silksong polish right now.', minutes_ago: 22 },
      { user: 'cyber_sarah', channel: 'general', msg: 'Take all the time you need Team Cherry! We know it will be worth the wait.', minutes_ago: 18 },
      { user: 'retro_liam', channel: 'general', msg: 'Who is up for a speedrun stream this evening?', minutes_ago: 5 },
      { user: 'supergiant', channel: 'dev-talk', msg: 'Excited to be part of the IndieGamer Hub developer community. Great tools here.', minutes_ago: 60 },
      { user: 'sabotage', channel: 'dev-talk', msg: 'The Steam App ID autofetch makes listing updates super painless!', minutes_ago: 30 }
    ];

    for (const m of chatMessages) {
      await conn.execute(
        `INSERT INTO chat_messages (user_id, channel, message, created_at)
         VALUES (?, ?, ?, DATE_SUB(NOW(), INTERVAL ? MINUTE))`,
        [userMap[m.user], m.channel, m.msg, m.minutes_ago]
      );
    }

    await conn.execute(`INSERT INTO game_favorites (user_id, game_id, created_at) VALUES (?, ?, NOW())`, [userMap['alex_vance'], gameMap['hollow-knight']]);
    await conn.execute(`INSERT INTO game_favorites (user_id, game_id, created_at) VALUES (?, ?, NOW())`, [userMap['alex_vance'], gameMap['hades']]);
    await conn.execute(`INSERT INTO game_favorites (user_id, game_id, created_at) VALUES (?, ?, NOW())`, [userMap['pixel_maya'], gameMap['sea-of-stars']]);
    await conn.execute(`INSERT INTO game_favorites (user_id, game_id, created_at) VALUES (?, ?, NOW())`, [userMap['pixel_maya'], gameMap['stardew-valley']]);
    await conn.execute(`INSERT INTO game_favorites (user_id, game_id, created_at) VALUES (?, ?, NOW())`, [userMap['cyber_sarah'], gameMap['dead-cells']]);
    await conn.execute(`INSERT INTO game_favorites (user_id, game_id, created_at) VALUES (?, ?, NOW())`, [userMap['alex_vance'], gameMap['hollow-knight-silksong']]);

    await conn.execute(
      `INSERT INTO notifications (user_id, type, title, message, link, is_read, created_at)
       VALUES (?, 'reply', 'New Forum Reply', 'Team Cherry replied to your discussion on Hollow Knight.', '/games/hollow-knight', FALSE, DATE_SUB(NOW(), INTERVAL 1 DAY))`,
      [userMap['retro_liam']]
    );
    await conn.execute(
      `INSERT INTO notifications (user_id, type, title, message, link, is_read, created_at)
       VALUES (?, 'featured', 'Featured Game Spotlight', 'Your game Hollow Knight is currently featured on the homepage!', '/games/hollow-knight', TRUE, DATE_SUB(NOW(), INTERVAL 5 DAY))`,
      [userMap['teamcherry']]
    );
  });

  console.log('[Seed] Database seeded with 12 rich indie titles, playable demos, reviews, chat messages, and community threads!');
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = seedDatabase;
