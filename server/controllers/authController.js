const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { JWT_SECRET } = require('../middleware/authMiddleware');

exports.register = async (req, res) => {
  try {
    const { name, email, password, role = 'customer', title, bio, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existing = await db.users.findByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const defaultAvatars = {
      customer: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      designer: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80'
    };

    const newUser = await db.users.create({
      name,
      email,
      password: hashedPassword,
      role: role === 'designer' ? 'designer' : 'customer',
      avatar: defaultAvatars[role] || defaultAvatars.customer,
      phone: phone || null,
      bio: bio || (role === 'designer' ? 'Architect & Spatial Designer' : 'Visionary Homebuilder')
    });

    if (newUser.role === 'designer') {
      await db.designers.saveProfile({
        user_id: newUser.id,
        title: title || 'Architectural Designer',
        specializations: ['Residential Homes', 'Sustainable Architecture', 'Interior Concepts'],
        experience_years: 4,
        location: 'Remote / Global',
        bio: bio || 'Passionate architect focused on translating client dreams into feasible construction schematics.',
        education_credentials: 'B.Arch, Registered Architect',
        software_tools: 'AutoCAD, Revit, SketchUp, Lumion'
      });
    }

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userSafe } = newUser;
    res.status(201).json({
      message: 'Account created successfully',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to register account' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await db.users.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    const { password: _, ...userSafe } = user;
    res.json({
      message: 'Login successful',
      token,
      user: userSafe
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Failed to log in' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await db.users.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userSafe } = user;
    let designerProfile = null;
    if (user.role === 'designer') {
      designerProfile = await db.designers.getById(user.id);
    }

    res.json({
      user: userSafe,
      designerProfile,
      dbMode: db.getMode()
    });
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ error: 'Failed to retrieve profile' });
  }
};
