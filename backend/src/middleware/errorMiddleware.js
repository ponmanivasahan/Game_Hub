function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
}

function errorHandler(err, req, res, next) {
  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message || err);

  let statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  let message = err.message || 'Internal Server Error';

  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    if (err.sqlMessage && err.sqlMessage.includes('email')) {
      message = 'An account with this email address already exists.';
    } else if (err.sqlMessage && err.sqlMessage.includes('username')) {
      message = 'This username is already taken.';
    } else if (err.sqlMessage && err.sqlMessage.includes('uq_game_user_review')) {
      message = 'You have already reviewed this game.';
    } else {
      message = 'Duplicate entry conflict with existing records.';
    }
  } else if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
    statusCode = 400;
    message = 'Referenced entity does not exist.';
  } else if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    statusCode = 400;
    message = 'Cannot delete or update record because other entities depend on it.';
  } else if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Invalid or expired session token.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
