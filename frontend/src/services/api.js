import {
  MOCK_USERS,
  MOCK_GAMES,
  MOCK_REVIEWS,
  MOCK_THREADS,
  MOCK_NOTIFICATIONS,
  MOCK_METADATA
} from './mockData';

const ENV_API_URL = import.meta.env.VITE_API_URL;
const LOCAL_STORAGE_API_KEY = 'indiegamer_api_url';

function getBaseApiUrl() {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(LOCAL_STORAGE_API_KEY);
    if (saved) return saved;
  }
  if (ENV_API_URL) return ENV_API_URL;
  return '/api';
}

function handleMockRequest(endpoint, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const [path, queryString] = endpoint.split('?');
  const params = new URLSearchParams(queryString || '');
  let body = {};
  if (options.body) {
    body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
  }

  if (path === '/auth/login' && method === 'POST') {
    const input = (body.emailOrUsername || body.email || '').toLowerCase().trim();
    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === input || u.username.toLowerCase() === input
    ) || {
      id: 3,
      name: body.emailOrUsername || 'Alex Vance',
      username: 'alex_vance',
      email: body.emailOrUsername || 'alex@gamer.com',
      role: 'gamer',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: 'Indie game lover & speedrunner.'
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_current_user', JSON.stringify(user));
    }
    return {
      success: true,
      message: 'Logged in successfully.',
      data: {
        user,
        token: 'mock-jwt-token-' + user.id
      }
    };
  }

  if (path === '/auth/register' && method === 'POST') {
    const newUser = {
      id: Date.now(),
      name: body.name || 'Indie Player',
      username: body.username || 'player_' + Math.floor(Math.random() * 1000),
      email: body.email,
      role: body.role || 'gamer',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: 'New explorer on IndieGamer Hub.'
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock_current_user', JSON.stringify(newUser));
    }
    return {
      success: true,
      message: 'Account registered successfully.',
      data: {
        user: newUser,
        token: 'mock-jwt-token-' + newUser.id
      }
    };
  }

  if (path === '/auth/logout' && method === 'POST') {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mock_current_user');
    }
    return { success: true, message: 'Logged out successfully.' };
  }

  if (path === '/auth/me') {
    let user = null;
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock_current_user');
      if (stored) {
        try {
          user = JSON.parse(stored);
        } catch (e) {}
      }
    }
    if (!user) user = MOCK_USERS[2];
    return { success: true, data: user };
  }

  if (path === '/auth/profile' && method === 'PUT') {
    let user = MOCK_USERS[2];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('mock_current_user');
      if (stored) {
        try {
          user = JSON.parse(stored);
        } catch (e) {}
      }
      user = { ...user, ...body };
      localStorage.setItem('mock_current_user', JSON.stringify(user));
    }
    return { success: true, data: user };
  }

  if (path.startsWith('/users/notifications')) {
    if (method === 'PUT') return { success: true };
    return { success: true, data: MOCK_NOTIFICATIONS };
  }

  if (path.startsWith('/users/')) {
    const username = path.replace('/users/', '');
    const user = MOCK_USERS.find(u => u.username === username) || MOCK_USERS[2];
    return { success: true, data: user };
  }

  if (path === '/games/featured') {
    const limit = parseInt(params.get('limit') || '6', 10);
    const featured = MOCK_GAMES.filter(g => g.is_featured).slice(0, limit);
    return { success: true, data: featured };
  }

  if (path === '/games/trending') {
    const limit = parseInt(params.get('limit') || '4', 10);
    const trending = [...MOCK_GAMES].sort((a, b) => b.average_rating - a.average_rating).slice(0, limit);
    return { success: true, data: trending };
  }

  if (path === '/games/upcoming') {
    const limit = parseInt(params.get('limit') || '4', 10);
    const upcoming = MOCK_GAMES.filter(g => new Date(g.release_date) > new Date('2026-01-01')).slice(0, limit);
    return { success: true, data: upcoming };
  }

  if (path === '/games/metadata') {
    return { success: true, data: MOCK_METADATA };
  }

  if (path === '/games' || path === '/games/') {
    if (method === 'POST') {
      const newGame = {
        id: Date.now(),
        ...body,
        average_rating: 0,
        review_count: 0,
        slug: (body.title || 'new-game').toLowerCase().replace(/\s+/g, '-')
      };
      return { success: true, data: newGame };
    }
    let list = [...MOCK_GAMES];
    const search = (params.get('search') || '').toLowerCase().trim();
    if (search) {
      list = list.filter(g => g.title.toLowerCase().includes(search) || g.description.toLowerCase().includes(search));
    }
    const genre = params.get('genre');
    if (genre) {
      list = list.filter(g => g.genres && g.genres.includes(genre));
    }
    const tag = params.get('tag');
    if (tag) {
      list = list.filter(g => g.tags && g.tags.includes(tag));
    }
    const platform = params.get('platform');
    if (platform) {
      list = list.filter(g => g.platforms && g.platforms.includes(platform));
    }
    const limit = parseInt(params.get('limit') || '12', 10);
    const page = parseInt(params.get('page') || '1', 10);
    const paginated = list.slice((page - 1) * limit, page * limit);
    return {
      success: true,
      data: {
        games: paginated,
        pagination: {
          total: list.length,
          page,
          limit,
          totalPages: Math.ceil(list.length / limit) || 1
        }
      }
    };
  }

  if (path.startsWith('/games/id/')) {
    const id = parseInt(path.replace('/games/id/', ''), 10);
    const game = MOCK_GAMES.find(g => g.id === id) || MOCK_GAMES[0];
    return { success: true, data: game };
  }

  if (path.startsWith('/games/')) {
    const slug = path.replace('/games/', '');
    const game = MOCK_GAMES.find(g => g.slug === slug) || MOCK_GAMES[0];
    const gameReviews = MOCK_REVIEWS.filter(r => r.game_id === game.id);
    return {
      success: true,
      data: {
        ...game,
        reviews: gameReviews
      }
    };
  }

  if (path === '/forum/recent') {
    const limit = parseInt(params.get('limit') || '4', 10);
    return { success: true, data: MOCK_THREADS.slice(0, limit) };
  }

  if (path === '/forum/threads') {
    if (method === 'POST') {
      const newThread = {
        id: Date.now(),
        ...body,
        user_name: 'Alex Vance',
        user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        post_count: 1,
        created_at: new Date().toISOString(),
        posts: []
      };
      return { success: true, data: newThread };
    }
    return {
      success: true,
      data: {
        threads: MOCK_THREADS,
        pagination: {
          total: MOCK_THREADS.length,
          page: 1,
          limit: 10,
          totalPages: 1
        }
      }
    };
  }

  if (path.startsWith('/forum/threads/')) {
    const sub = path.replace('/forum/threads/', '');
    if (sub.includes('/posts') && method === 'POST') {
      const newPost = {
        id: Date.now(),
        user_name: 'Alex Vance',
        user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        content: body.content,
        created_at: new Date().toISOString()
      };
      return { success: true, data: newPost };
    }
    const threadId = parseInt(sub, 10);
    const thread = MOCK_THREADS.find(t => t.id === threadId) || MOCK_THREADS[0];
    return { success: true, data: thread };
  }

  if (path.startsWith('/reviews/game/')) {
    const gameId = parseInt(path.replace('/reviews/game/', ''), 10);
    if (method === 'POST') {
      const newReview = {
        id: Date.now(),
        game_id: gameId,
        user_id: 3,
        user_name: 'Alex Vance',
        user_avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
        rating: body.rating || 5,
        review_text: body.review_text || '',
        created_at: new Date().toISOString()
      };
      return { success: true, data: newReview };
    }
    return { success: true, data: MOCK_REVIEWS.filter(r => r.game_id === gameId) };
  }

  if (path === '/favorites') {
    let ids = [1, 2, 4];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('indiegamer_favorites');
      if (stored) {
        try {
          ids = JSON.parse(stored);
        } catch (e) {}
      }
    }
    const favoriteGames = MOCK_GAMES.filter(g => ids.includes(g.id));
    return { success: true, data: favoriteGames };
  }

  if (path.startsWith('/favorites/')) {
    const gameId = parseInt(path.replace('/favorites/', ''), 10);
    let ids = [1, 2, 4];
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('indiegamer_favorites');
      if (stored) {
        try {
          ids = JSON.parse(stored);
        } catch (e) {}
      }
      if (method === 'POST') {
        if (!ids.includes(gameId)) ids.push(gameId);
      } else if (method === 'DELETE') {
        ids = ids.filter(id => id !== gameId);
      }
      localStorage.setItem('indiegamer_favorites', JSON.stringify(ids));
    }
    return { success: true, is_favorited: ids.includes(gameId) };
  }

  if (path === '/admin/stats') {
    return {
      success: true,
      data: {
        totalUsers: 842,
        totalGames: 12,
        totalReviews: 326,
        activePlayers: 1450,
        monthlyGrowth: '+24%',
        activeDemos: 12
      }
    };
  }

  if (path === '/admin/users') {
    return { success: true, data: MOCK_USERS };
  }

  if (path.startsWith('/chat/channels/')) {
    if (method === 'POST') {
      return {
        success: true,
        data: {
          id: Date.now(),
          user_name: 'Alex Vance',
          message: body.message,
          created_at: new Date().toISOString()
        }
      };
    }
    return {
      success: true,
      data: [
        {
          id: 1,
          user_name: 'Elena Rostova',
          avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
          message: 'Welcome to the IndieGamer Hub community chat!',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: 2,
          user_name: 'Team Cherry',
          avatar_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80',
          message: 'Hello everyone! Enjoy testing the demo games in the browser.',
          created_at: new Date(Date.now() - 1000 * 60 * 10).toISOString()
        }
      ]
    };
  }

  return { success: true, data: null };
}

export async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    method: options.method || 'GET',
    headers,
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const baseUrl = getBaseApiUrl();
  const isVercelApp = typeof window !== 'undefined' && window.location.hostname.endsWith('vercel.app');
  const hasCustomApi = Boolean(ENV_API_URL || (typeof window !== 'undefined' && localStorage.getItem(LOCAL_STORAGE_API_KEY)));

  if (isVercelApp && !hasCustomApi) {
    return handleMockRequest(endpoint, options);
  }

  try {
    const response = await fetch(`${baseUrl}${endpoint}`, config);
    const contentType = response.headers.get('content-type') || '';

    if (response.status === 404 || !contentType.includes('application/json')) {
      return handleMockRequest(endpoint, options);
    }

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 404 || response.status === 502 || response.status === 503) {
        return handleMockRequest(endpoint, options);
      }
      const errorMsg = (data && data.message) || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (networkErr) {
    if (networkErr.status && networkErr.status < 500 && networkErr.status !== 404) {
      throw networkErr;
    }
    return handleMockRequest(endpoint, options);
  }
}

export const api = {
  get: (url, options) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options) => request(url, { ...options, method: 'POST', body }),
  put: (url, body, options) => request(url, { ...options, method: 'PUT', body }),
  delete: (url, options) => request(url, { ...options, method: 'DELETE' })
};
