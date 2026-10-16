const { db } = require('../config/db');

exports.getMessages = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await db.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.customer_id !== req.user.id && project.designer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized to view these messages' });
    }

    const messages = await db.messages.listByProject(projectId);
    res.json(messages);
  } catch (err) {
    console.error('getMessages error:', err);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { message_text, attachment_url } = req.body;

    if (!message_text && !attachment_url) {
      return res.status(400).json({ error: 'Message text or attachment is required' });
    }

    const project = await db.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const receiverId = req.user.id === project.customer_id ? project.designer_id : project.customer_id;
    if (!receiverId) {
      return res.status(400).json({ error: 'No designer assigned to this project yet' });
    }

    const message = await db.messages.create({
      project_id: Number(projectId),
      sender_id: req.user.id,
      receiver_id: receiverId,
      message_text: message_text || '',
      attachment_url: attachment_url || null
    });

    const fullMsg = {
      ...message,
      sender_name: req.user.name,
      sender_avatar: req.user.avatar,
      sender_role: req.user.role
    };

    const io = req.app.get('io');
    if (io) {
      io.to(`project_${projectId}`).emit('new_message', fullMsg);
      io.to(`user_${receiverId}`).emit('unread_notification', {
        projectId,
        projectTitle: project.title,
        senderName: req.user.name,
        messageText: message_text
      });
    }

    res.status(201).json(fullMsg);
  } catch (err) {
    console.error('sendMessage error:', err);
    res.status(500).json({ error: 'Failed to send message' });
  }
};
