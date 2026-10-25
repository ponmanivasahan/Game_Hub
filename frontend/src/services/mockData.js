export const MOCK_USERS = [
  {
    id: 1,
    name: 'Elena Rostova',
    username: 'admin_elena',
    email: 'admin@indiegamerhub.com',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Platform Administrator & Indie Game Advocate. Curating the best gaming gems.',
    last_login_at: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 2,
    name: 'Team Cherry',
    username: 'teamcherry',
    email: 'teamcherry@indiegamerhub.com',
    role: 'developer',
    avatar_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    bio: 'Indie games team based in Adelaide, Australia. Creators of Hollow Knight & Silksong.',
    last_login_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
  },
  {
    id: 3,
    name: 'Alex Vance',
    username: 'alex_vance',
    email: 'alex@gamer.com',
    role: 'gamer',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    bio: 'Metroidvania speedrunner and platformer connoisseur.',
    last_login_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
  }
];

export const MOCK_GAMES = [
  {
    id: 1,
    title: 'Hollow Knight',
    slug: 'hollow-knight',
    description: 'Forge your own path in Hollow Knight! An epic action adventure through a vast ruined kingdom of insects and heroes. Explore twisting caverns, battle tainted creatures, and befriend bizarre bugs, all in a classic, hand-drawn 2D style.',
    release_date: '2017-02-24',
    developer_id: 2,
    developer_name: 'Team Cherry',
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
    id: 2,
    title: 'Hades',
    slug: 'hades',
    description: 'Defy the god of the dead as you hack and slash out of the Underworld in this rogue-like dungeon crawler from the creators of Bastion, Transistor, and Pyre. Featuring rapid combat, lush hand-painted environments, and dozens of Olympic boons.',
    release_date: '2020-09-17',
    developer_id: 1,
    developer_name: 'Supergiant Games',
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
    id: 3,
    title: 'Sea of Stars',
    slug: 'sea-of-stars',
    description: 'Sea of Stars is a turn-based RPG inspired by the golden era of 90s classics. It tells the story of two Children of the Solstice who combine the powers of the sun and moon to perform Eclipse Magic.',
    release_date: '2023-08-29',
    developer_id: 1,
    developer_name: 'Sabotage Studio',
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
    id: 4,
    title: 'Stardew Valley',
    slug: 'stardew-valley',
    description: 'You have inherited your grandfather old farm plot in Stardew Valley. Armed with hand-me-down tools and a few coins, you set out to begin your new life. Can you learn to live off the land and turn these overgrown fields into a thriving home?',
    release_date: '2016-02-26',
    developer_id: 2,
    developer_name: 'ConcernedApe',
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
    id: 5,
    title: 'Cuphead',
    slug: 'cuphead',
    description: 'Cuphead is a classic run and gun action game heavily focused on boss battles. Inspired by cartoons of the 1930s, the visuals and audio are painstakingly created with the same techniques of the era.',
    release_date: '2017-09-29',
    developer_id: 2,
    developer_name: 'Studio MDHR',
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
    id: 6,
    title: 'Celeste',
    slug: 'celeste',
    description: 'Help Madeline survive her inner demons on her journey to the top of Celeste Mountain, in this super-tight, hand-crafted platformer from the creators of multiplayer classic TowerFall.',
    release_date: '2018-01-25',
    developer_id: 1,
    developer_name: 'Maddy Makes Games',
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
    id: 7,
    title: 'Dead Cells',
    slug: 'dead-cells',
    description: 'Dead Cells is a rogue-lite, metroidvania inspired action-platformer. You will explore a sprawling, ever-changing castle... assuming you are able to fight your way past its keepers in 2D souls-lite combat.',
    release_date: '2018-08-07',
    developer_id: 2,
    developer_name: 'Motion Twin',
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
    id: 8,
    title: 'Slay the Spire',
    slug: 'slay-the-spire',
    description: 'We fused card games and roguelikes together to make the best single player deckbuilder we could. Craft a unique deck, encounter bizarre creatures, discover relics of immense power, and Slay the Spire!',
    release_date: '2019-01-23',
    developer_id: 1,
    developer_name: 'Mega Crit Games',
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
    id: 9,
    title: 'Hollow Knight: Silksong',
    slug: 'hollow-knight-silksong',
    description: 'Discover a vast, haunted kingdom in Hollow Knight: Silksong! The sequel to the award-winning action-adventure. Explore, fight and survive as Hornet, princess-protector of Hallownest, captured and brought to this unfamiliar world ruled by silk and song.',
    release_date: '2026-11-28',
    developer_id: 2,
    developer_name: 'Team Cherry',
    steam_app_id: '1030300',
    steam_price: 29.99,
    currency: 'USD',
    cover_image_url: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    trailer_url: 'https://www.youtube.com/watch?v=pFAknD_9U7c',
    playable_demo_url: 'builtin://retro-runner',
    average_rating: 5.00,
    review_count: 1,
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
    id: 10,
    title: 'Hades II',
    slug: 'hades-ii',
    description: 'Battle beyond the Underworld using dark sorcery to take on the Titan of Time in this spellbinding sequel to the award-winning rogue-like dungeon crawler. As Melinoë, the immortal Princess of the Underworld, you will explore a bigger, deeper mythic world.',
    release_date: '2026-12-18',
    developer_id: 1,
    developer_name: 'Supergiant Games',
    steam_app_id: '1145350',
    steam_price: 29.99,
    currency: 'USD',
    cover_image_url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1200&q=80',
    trailer_url: 'https://www.youtube.com/watch?v=cM3P94iWn_k',
    playable_demo_url: 'builtin://arcade-shooter',
    average_rating: 5.00,
    review_count: 1,
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
    id: 11,
    title: 'Crowsworn',
    slug: 'crowsworn',
    description: 'An atmospheric, hand-drawn Metroidvania set in a dark and stylish world populated by blind creatures and fearsome monsters. Master your scythe and sidearms in lightning-fast combat.',
    release_date: '2027-02-14',
    developer_id: 1,
    developer_name: 'Mongoose Rodeo',
    steam_app_id: '1728460',
    steam_price: 24.99,
    currency: 'USD',
    cover_image_url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80',
    trailer_url: 'https://www.youtube.com/watch?v=Fj-yZ4k0X50',
    playable_demo_url: 'builtin://retro-runner',
    average_rating: 4.80,
    review_count: 1,
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
    id: 12,
    title: 'Mina the Hollower',
    slug: 'mina-the-hollower',
    description: 'From Yacht Club Games, creators of Shovel Knight: take control of Mina, a renowned Hollower who uses her whip and underground burrowing abilities to battle through a gothic Victorian landscape.',
    release_date: '2027-03-25',
    developer_id: 1,
    developer_name: 'Yacht Club Games',
    steam_app_id: '1875580',
    steam_price: 19.99,
    currency: 'USD',
    cover_image_url: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80',
    trailer_url: 'https://www.youtube.com/watch?v=Fj-yZ4k0X50',
    playable_demo_url: 'builtin://arcade-shooter',
    average_rating: 4.85,
    review_count: 1,
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

export const MOCK_REVIEWS = [
  {
    id: 1,
    game_id: 1,
    user_id: 3,
    user_name: 'Alex Vance',
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review_text: 'The music, the hand-drawn art, the fluid swordplay. Every single boss fight feels earned. A masterwork of atmosphere.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
  },
  {
    id: 2,
    game_id: 2,
    user_id: 3,
    user_name: 'Alex Vance',
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review_text: 'Supergiant has set a new gold standard for narrative roguelikes. Snappy combat, brilliant music, and endless depth.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
  },
  {
    id: 3,
    game_id: 4,
    user_id: 3,
    user_name: 'Alex Vance',
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    rating: 5,
    review_text: 'The ultimate comfort game. Eric Barone poured his heart and soul into this, and it shines in every single pixel.',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
  }
];

export const MOCK_THREADS = [
  {
    id: 1,
    game_id: 1,
    game_title: 'Hollow Knight',
    game_slug: 'hollow-knight',
    user_id: 3,
    user_name: 'Alex Vance',
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    title: 'Tips for defeating the Nightmare King Grimm?',
    content: 'I have been stuck on NKG for three days now. His dash attacks are so fast. What charm builds are you all using?',
    post_count: 3,
    last_activity_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    posts: [
      {
        id: 1,
        user_name: 'Alex Vance',
        user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        content: 'I have been stuck on NKG for three days now. His dash attacks are so fast. What charm builds are you all using?',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString()
      },
      {
        id: 2,
        user_name: 'Elena Rostova',
        user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        content: 'Use Shape of Unn + Quick Focus! You can heal under his flame pillar attack safely.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
      },
      {
        id: 3,
        user_name: 'Team Cherry',
        user_avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
        content: 'Listen closely for the audio cues right before each attack. Each pattern has a distinct wind-up sound!',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString()
      }
    ]
  },
  {
    id: 2,
    game_id: 2,
    game_title: 'Hades',
    game_slug: 'hades',
    user_id: 1,
    user_name: 'Elena Rostova',
    user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    title: 'Favorite Weapon Aspect for High Heat Clears?',
    content: 'Curious what aspects the community favors when pushing Heat past 20. Fists of Demeter or Bow of Chiron?',
    post_count: 2,
    last_activity_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    posts: [
      {
        id: 4,
        user_name: 'Elena Rostova',
        user_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        content: 'Curious what aspects the community favors when pushing Heat past 20. Fists of Demeter or Bow of Chiron?',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
      },
      {
        id: 5,
        user_name: 'Alex Vance',
        user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        content: 'Chiron Bow with Dionysus Special and Aphrodite Attack (Privileged Status) melts bosses in seconds!',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
      }
    ]
  },
  {
    id: 3,
    game_id: 9,
    game_title: 'Hollow Knight: Silksong',
    game_slug: 'hollow-knight-silksong',
    user_id: 2,
    user_name: 'Team Cherry',
    user_avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
    title: 'Silksong Development Update: Soundtracks & Areas',
    content: 'We are deep into the final polish on Pharloom. Christopher Larkin has recorded over 30 new orchestral tracks. We cannot wait for you all to experience Hornet acrobatics!',
    post_count: 4,
    last_activity_at: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    posts: [
      {
        id: 6,
        user_name: 'Team Cherry',
        user_avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
        content: 'We are deep into the final polish on Pharloom. Christopher Larkin has recorded over 30 new orchestral tracks.',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
      }
    ]
  },
  {
    id: 4,
    game_id: 3,
    game_title: 'Sea of Stars',
    game_slug: 'sea-of-stars',
    user_id: 3,
    user_name: 'Alex Vance',
    user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
    title: 'Wheels Minigame Appreciation Thread',
    content: 'Anyone else spend more time playing Wheels in taverns than saving the world? Such a neat tactical game within a game.',
    post_count: 2,
    last_activity_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString(),
    posts: [
      {
        id: 7,
        user_name: 'Alex Vance',
        user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        content: 'Anyone else spend more time playing Wheels in taverns than saving the world?',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString()
      }
    ]
  }
];

export const MOCK_NOTIFICATIONS = [
  {
    id: 1,
    type: 'reply',
    title: 'New Forum Reply',
    message: 'Team Cherry replied to your discussion on Hollow Knight.',
    link: '/games/hollow-knight',
    is_read: false,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
  },
  {
    id: 2,
    type: 'featured',
    title: 'Featured Game Spotlight',
    message: 'Hollow Knight is currently featured on the IndieGamer Hub homepage!',
    link: '/games/hollow-knight',
    is_read: true,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString()
  }
];

export const MOCK_METADATA = {
  genres: [
    { id: 1, name: 'Action', slug: 'action' },
    { id: 2, name: 'Adventure', slug: 'adventure' },
    { id: 3, name: 'RPG', slug: 'rpg' },
    { id: 4, name: 'Roguelike', slug: 'roguelike' },
    { id: 5, name: 'Metroidvania', slug: 'metroidvania' },
    { id: 6, name: 'Platformer', slug: 'platformer' },
    { id: 7, name: 'Puzzle', slug: 'puzzle' },
    { id: 8, name: 'Strategy', slug: 'strategy' },
    { id: 9, name: 'Simulation', slug: 'simulation' },
    { id: 10, name: 'Casual', slug: 'casual' }
  ],
  tags: [
    { id: 1, name: 'Atmospheric', slug: 'atmospheric' },
    { id: 2, name: 'Difficult', slug: 'difficult' },
    { id: 3, name: 'Great Soundtrack', slug: 'great-soundtrack' },
    { id: 4, name: 'Pixel Art', slug: 'pixel-art' },
    { id: 5, name: 'Story Rich', slug: 'story-rich' },
    { id: 6, name: 'Hand-Drawn', slug: 'hand-drawn' },
    { id: 7, name: 'Fast-Paced', slug: 'fast-paced' },
    { id: 8, name: 'Turn-Based', slug: 'turn-based' },
    { id: 9, name: 'Cozy', slug: 'cozy' },
    { id: 10, name: 'Deckbuilder', slug: 'deckbuilder' }
  ],
  platforms: [
    { id: 1, name: 'Windows', slug: 'windows' },
    { id: 2, name: 'macOS', slug: 'macos' },
    { id: 3, name: 'Linux', slug: 'linux' },
    { id: 4, name: 'Nintendo Switch', slug: 'nintendo-switch' },
    { id: 5, name: 'PlayStation 5', slug: 'ps5' },
    { id: 6, name: 'Xbox Series X/S', slug: 'xbox-series' }
  ]
};
