const express = require('express');
const cors = require('cors');
const { notFoundHandler, errorHandler } = require('./middleware/errorMiddleware');

const path = require('path');
const fs = require('fs');

const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const forumRoutes = require('./routes/forumRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'IndieGamer Hub API'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);

const frontendDist = path.resolve(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(frontendDist, 'index.html'));
  });
}

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
