const forumService = require('../services/forumService');

async function getThreads(req, res, next) {
  try {
    const gameId = req.params.gameId;
    const result = await forumService.getThreads(gameId, req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function getRecentThreads(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 8;
    const threads = await forumService.getRecentThreads(limit);
    res.json({
      success: true,
      data: threads
    });
  } catch (error) {
    next(error);
  }
}

async function getThread(req, res, next) {
  try {
    const thread = await forumService.getThread(req.params.id);
    res.json({
      success: true,
      data: thread
    });
  } catch (error) {
    next(error);
  }
}

async function createThread(req, res, next) {
  try {
    const gameId = req.params.gameId;
    const thread = await forumService.createThread(req.user, gameId, req.body);
    res.status(201).json({
      success: true,
      message: 'Discussion thread created.',
      data: thread
    });
  } catch (error) {
    next(error);
  }
}

async function lockThread(req, res, next) {
  try {
    const isLocked = req.body.is_locked !== undefined ? !!req.body.is_locked : true;
    const thread = await forumService.lockThread(req.params.id, isLocked, req.user);
    res.json({
      success: true,
      message: isLocked ? 'Thread locked.' : 'Thread unlocked.',
      data: thread
    });
  } catch (error) {
    next(error);
  }
}

async function deleteThread(req, res, next) {
  try {
    await forumService.deleteThread(req.params.id, req.user);
    res.json({
      success: true,
      message: 'Thread deleted successfully.'
    });
  } catch (error) {
    next(error);
  }
}

async function getPosts(req, res, next) {
  try {
    const threadId = req.params.id;
    const result = await forumService.getPosts(threadId, req.query);
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
}

async function createPost(req, res, next) {
  try {
    const threadId = req.params.id;
    const post = await forumService.createPost(req.user, threadId, req.body.content);
    res.status(201).json({
      success: true,
      message: 'Reply posted successfully.',
      data: post
    });
  } catch (error) {
    next(error);
  }
}

async function updatePost(req, res, next) {
  try {
    const postId = req.params.id;
    const updated = await forumService.updatePost(postId, req.user, req.body.content);
    res.json({
      success: true,
      message: 'Post updated.',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

async function deletePost(req, res, next) {
  try {
    const postId = req.params.id;
    await forumService.deletePost(postId, req.user);
    res.json({
      success: true,
      message: 'Post deleted.'
    });
  } catch (error) {
    next(error);
  }
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
