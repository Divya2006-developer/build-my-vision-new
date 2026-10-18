const { db } = require('../config/db');

exports.createReview = async (req, res) => {
  try {
    const { projectId, rating, comment } = req.body;
    if (!projectId || !rating) {
      return res.status(400).json({ error: 'Project ID and rating (1-5) are required' });
    }

    const project = await db.projects.getById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.customer_id !== req.user.id) {
      return res.status(403).json({ error: 'Only the project customer can submit a review' });
    }

    if (!project.designer_id) {
      return res.status(400).json({ error: 'Cannot review a project without an assigned designer' });
    }

    const review = await db.reviews.create({
      project_id: Number(projectId),
      customer_id: req.user.id,
      designer_id: project.designer_id,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment: comment || ''
    });

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    console.error('createReview error:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
};

exports.getDesignerReviews = async (req, res) => {
  try {
    const reviews = await db.reviews.listForDesigner(req.params.designerId);
    res.json(reviews);
  } catch (err) {
    console.error('getDesignerReviews error:', err);
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
};
