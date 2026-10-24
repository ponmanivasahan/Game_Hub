const forumRepository = require('../repositories/forumRepository');
const gameRepository = require('../repositories/gameRepository');

async function getThreads(gameId, options) {
  return forumRepository.findThreadsByGame(gameId, options);
}

async function getRecentThreads(limit = 8) {
  return forumRepository.findRecentThreads(limit);
}

async function getThread(threadId) {
  const thread = await forumRepository.findThreadById(threadId);
  if (!thread) {
    throw new Error('Discussion thread not found.');
  }
  return thread;
}

async function createThread(user, gameId, { title, content }) {
  if (!title || !title.trim()) {
    throw new Error('Thread title is required.');
  }
  if (!content || !content.trim()) {
    throw new Error('Thread content is required.');
  }

  const game = await gameRepository.findById(gameId);
  if (!game) {
    throw new Error('Game not found.');
  }

  return forumRepository.createThread({
    gameId,
    userId: user.id,
    title: title.trim(),
    content: content.trim()
  });
}

async function lockThread(threadId, isLocked, user) {
  if (user.role !== 'admin') {
    throw new Error('Only administrators can lock or unlock discussion threads.');
  }
  return forumRepository.lockThread(threadId, isLocked);
}

async function deleteThread(threadId, user) {
  const thread = await forumRepository.findThreadById(threadId);
  if (!thread) {
    throw new Error('Thread not found.');
  }

  const isAdmin = user.role === 'admin';
  if (thread.user_id !== user.id && !isAdmin) {
    throw new Error('You do not have permission to delete this thread.');
  }

  return forumRepository.deleteThread(threadId, user.id, isAdmin);
}

async function getPosts(threadId, options) {
  return forumRepository.findPostsByThread(threadId, options);
}

async function createPost(user, threadId, content) {
  if (!content || !content.trim()) {
    throw new Error('Reply content cannot be empty.');
  }

  return forumRepository.createPost({
    threadId,
    userId: user.id,
    content: content.trim()
  });
}

async function updatePost(postId, user, content) {
  if (!content || !content.trim()) {
    throw new Error('Reply content cannot be empty.');
  }

  const updated = await forumRepository.updatePost(postId, user.id, content.trim());
  if (!updated) {
    throw new Error('Unable to update post. Either it does not exist or you lack permission.');
  }
  return updated;
}

async function deletePost(postId, user) {
  const isAdmin = user.role === 'admin';
  const deleted = await forumRepository.deletePost(postId, user.id, isAdmin);
  if (!deleted) {
    throw new Error('Unable to delete post. Either it does not exist or you lack permission.');
  }
  return true;
}

module.exports = {
  getThreads,
  getRecentThreads,
  getThread,
  createThread,
  lockThread,
  deleteThread,
  getPosts,
  createPost,
  updatePost,
  deletePost
};
