const chatRepository = require('../repositories/chatRepository');

async function getMessages(req, res, next) {
  try {
    const channel = req.params.channel || 'general';
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const messages = await chatRepository.getMessages(channel, limit);
    res.json({
      success: true,
      data: messages
    });
  } catch (error) {
    next(error);
  }
}

async function sendMessage(req, res, next) {
  try {
    const channel = req.params.channel || 'general';
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be blank.'
      });
    }

    const savedMessage = await chatRepository.createMessage(req.user.id, channel, message.trim());
    res.status(201).json({
      success: true,
      data: savedMessage
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getMessages,
  sendMessage
};
