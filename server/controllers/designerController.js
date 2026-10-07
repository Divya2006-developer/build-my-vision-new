const { db } = require('../config/db');

exports.getDesigners = async (req, res) => {
  try {
    const { category, search } = req.query;
    let designers = await db.designers.listAll();

    if (search) {
      const q = search.toLowerCase();
      designers = designers.filter(d =>
        d.name.toLowerCase().includes(q) ||
        (d.title && d.title.toLowerCase().includes(q)) ||
        (d.specializations && d.specializations.some(s => s.toLowerCase().includes(q)))
      );
    }

    if (category && category !== 'all') {
      designers = designers.filter(d =>
        d.specializations && d.specializations.some(s => s.toLowerCase().includes(category.toLowerCase()))
      );
    }

    res.json(designers);
  } catch (err) {
    console.error('getDesigners error:', err);
    res.status(500).json({ error: 'Failed to fetch designers' });
  }
};

exports.getDesignerById = async (req, res) => {
  try {
    const designer = await db.designers.getById(req.params.id);
    if (!designer) {
      return res.status(404).json({ error: 'Designer not found' });
    }

    const portfolios = await db.portfolios.getByDesignerId(designer.id);
    const reviews = await db.reviews.listForDesigner(designer.id);

    res.json({
      ...designer,
      portfolios,
      reviews
    });
  } catch (err) {
    console.error('getDesignerById error:', err);
    res.status(500).json({ error: 'Failed to fetch designer details' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (req.user.role !== 'designer') {
      return res.status(403).json({ error: 'Only designers can update designer profiles' });
    }

    const {
      title,
      specializations,
      experience_years,
      location,
      bio,
      education_credentials,
      software_tools
    } = req.body;

    const updated = await db.designers.saveProfile({
      user_id: req.user.id,
      title,
      specializations,
      experience_years: Number(experience_years) || 1,
      location,
      bio,
      education_credentials,
      software_tools
    });

    res.json({ message: 'Profile updated', profile: updated });
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ error: 'Failed to update designer profile' });
  }
};

exports.getPortfolios = async (req, res) => {
  try {
    const { category } = req.query;
    const items = await db.portfolios.listAll(category);
    res.json(items);
  } catch (err) {
    console.error('getPortfolios error:', err);
    res.status(500).json({ error: 'Failed to fetch portfolios' });
  }
};

exports.getMyPortfolios = async (req, res) => {
  try {
    if (req.user.role !== 'designer') {
      return res.status(403).json({ error: 'Only designers can access their portfolio management' });
    }
    const items = await db.portfolios.getByDesignerId(req.user.id);
    res.json(items);
  } catch (err) {
    console.error('getMyPortfolios error:', err);
    res.status(500).json({ error: 'Failed to fetch your portfolios' });
  }
};

exports.createPortfolio = async (req, res) => {
  try {
    if (req.user.role !== 'designer') {
      return res.status(403).json({ error: 'Only designers can add portfolio items' });
    }

    const {
      title,
      category = 'residential',
      description,
      image_url,
      blueprint_url,
      style = 'Contemporary',
      area_sqft,
      location,
      year_completed,
      tags
    } = req.body;

    if (!title || !image_url) {
      return res.status(400).json({ error: 'Title and image_url are required' });
    }

    const item = await db.portfolios.create({
      designer_id: req.user.id,
      title,
      category,
      description,
      image_url,
      blueprint_url,
      style,
      area_sqft: area_sqft ? Number(area_sqft) : null,
      location,
      year_completed: year_completed ? Number(year_completed) : 2024,
      tags: Array.isArray(tags) ? tags : []
    });

    res.status(201).json({ message: 'Portfolio created', item });
  } catch (err) {
    console.error('createPortfolio error:', err);
    res.status(500).json({ error: 'Failed to create portfolio item' });
  }
};

exports.updatePortfolio = async (req, res) => {
  try {
    if (req.user.role !== 'designer') {
      return res.status(403).json({ error: 'Only designers can edit portfolios' });
    }

    const { id } = req.params;
    const updated = await db.portfolios.update(id, req.user.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Portfolio not found or unauthorized' });
    }

    res.json({ message: 'Portfolio updated', item: updated });
  } catch (err) {
    console.error('updatePortfolio error:', err);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    if (req.user.role !== 'designer') {
      return res.status(403).json({ error: 'Only designers can delete portfolios' });
    }

    const { id } = req.params;
    const deleted = await db.portfolios.delete(id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Portfolio not found or unauthorized' });
    }

    res.json({ message: 'Portfolio deleted' });
  } catch (err) {
    console.error('deletePortfolio error:', err);
    res.status(500).json({ error: 'Failed to delete portfolio' });
  }
};
