const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const DB_CONFIG = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'build_my_vision',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

let dbMode = 'uninitialized';
let mysqlPool = null;

// File-based persistence fallback path
const dataDir = path.join(__dirname, '..', 'data');
const fallbackDbFile = path.join(dataDir, 'local_db.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// In-memory + persistent store fallback
let fallbackStore = {
  users: [],
  designer_profiles: [],
  portfolios: [],
  projects: [],
  deliverables: [],
  revisions: [],
  messages: [],
  reviews: []
};

const loadFallback = () => {
  if (fs.existsSync(fallbackDbFile)) {
    try {
      const content = fs.readFileSync(fallbackDbFile, 'utf8');
      fallbackStore = JSON.parse(content);
    } catch (err) {
      console.error('Error loading fallback store:', err.message);
    }
  }
};

const saveFallback = () => {
  try {
    fs.writeFileSync(fallbackDbFile, JSON.stringify(fallbackStore, null, 2), 'utf8');
  } catch (err) {
    console.error('Error saving fallback store:', err.message);
  }
};

async function initDatabase() {
  loadFallback();

  // Attempt MySQL connection
  try {
    console.log(`[DB] Attempting connection to MySQL at ${DB_CONFIG.host}:${DB_CONFIG.port}...`);
    // Connect without database first to ensure database exists
    const rootConn = await mysql.createConnection({
      host: DB_CONFIG.host,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
      port: DB_CONFIG.port
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_CONFIG.database}\`;`);
    await rootConn.end();

    // Create pool with target database
    mysqlPool = mysql.createPool(DB_CONFIG);
    const testConn = await mysqlPool.getConnection();
    console.log(`[DB] Successfully connected to MySQL database: ${DB_CONFIG.database}`);
    testConn.release();

    // Run schema migrations if needed
    const schemaPath = path.join(__dirname, 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      const statements = sql
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !s.startsWith('--') && !s.toLowerCase().startsWith('use ') && !s.toLowerCase().startsWith('create database'));

      for (const statement of statements) {
        try {
          await mysqlPool.query(statement);
        } catch (sErr) {
          // ignore already exists or continue
        }
      }
      console.log('[DB] MySQL schema verified and ready.');
    }

    dbMode = 'mysql';
    return { mode: 'mysql' };
  } catch (err) {
    console.warn(`[DB WARNING] MySQL connection could not be established: ${err.message}`);
    console.warn('[DB INFO] Seamlessly activating local persistent database engine so you can use the application immediately!');
    console.warn('[DB INFO] To connect MySQL, configure your credentials in server/.env (DB_PASSWORD=...) and restart.');
    dbMode = 'local_persistent';
    return { mode: 'local_persistent', error: err.message };
  }
}

// Database helper functions that work transparently across both MySQL & Local Persistent Engine
const db = {
  getMode: () => dbMode,

  // Direct raw query for MySQL or compatibility runner
  async query(sql, params = []) {
    if (dbMode === 'mysql' && mysqlPool) {
      const [results] = await mysqlPool.query(sql, params);
      return results;
    }
    // For local mode, callers can use the collection-based helpers below
    throw new Error('Direct SQL raw query called in local mode. Use collection helpers.');
  },

  // High-level relational collection accessors
  users: {
    async findById(id) {
      if (dbMode === 'mysql') {
        const [rows] = await mysqlPool.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows[0] || null;
      }
      return fallbackStore.users.find(u => u.id === Number(id)) || null;
    },
    async findByEmail(email) {
      if (dbMode === 'mysql') {
        const [rows] = await mysqlPool.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0] || null;
      }
      return fallbackStore.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
    },
    async create(userData) {
      if (dbMode === 'mysql') {
        const [res] = await mysqlPool.query(
          'INSERT INTO users (name, email, password, role, avatar, phone, bio) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [userData.name, userData.email, userData.password, userData.role || 'customer', userData.avatar || null, userData.phone || null, userData.bio || null]
        );
        return { id: res.insertId, ...userData };
      }
      const newId = fallbackStore.users.length ? Math.max(...fallbackStore.users.map(u => u.id)) + 1 : 1;
      const newUser = { id: newId, created_at: new Date().toISOString(), ...userData };
      fallbackStore.users.push(newUser);
      saveFallback();
      return newUser;
    },
    async list(role = null) {
      if (dbMode === 'mysql') {
        const sql = role ? 'SELECT id, name, email, role, avatar, phone, bio, created_at FROM users WHERE role = ?' : 'SELECT id, name, email, role, avatar, phone, bio, created_at FROM users';
        const [rows] = await mysqlPool.query(sql, role ? [role] : []);
        return rows;
      }
      let list = fallbackStore.users;
      if (role) list = list.filter(u => u.role === role);
      return list.map(({ password, ...u }) => u);
    }
  },

  designers: {
    async listAll(filter = {}) {
      if (dbMode === 'mysql') {
        let sql = `
          SELECT u.id, u.name, u.email, u.avatar, u.bio as user_bio,
                 dp.id as profile_id, dp.title, dp.specializations, dp.experience_years,
                 dp.location, dp.rating, dp.reviews_count, dp.completed_projects,
                 dp.bio as profile_bio, dp.education_credentials, dp.software_tools, dp.featured
          FROM users u
          JOIN designer_profiles dp ON u.id = dp.user_id
          WHERE u.role = 'designer'
        `;
        const [rows] = await mysqlPool.query(sql);
        return rows.map(r => ({
          ...r,
          specializations: typeof r.specializations === 'string' ? JSON.parse(r.specializations || '[]') : r.specializations
        }));
      }

      return fallbackStore.users
        .filter(u => u.role === 'designer')
        .map(u => {
          const profile = fallbackStore.designer_profiles.find(p => p.user_id === u.id) || {};
          return {
            id: u.id,
            name: u.name,
            email: u.email,
            avatar: u.avatar,
            user_bio: u.bio,
            profile_id: profile.id,
            title: profile.title || 'Architectural Designer',
            specializations: profile.specializations || ['Residential', 'Modern'],
            experience_years: profile.experience_years || 5,
            location: profile.location || 'Remote',
            rating: profile.rating || 4.9,
            reviews_count: profile.reviews_count || 12,
            completed_projects: profile.completed_projects || 24,
            profile_bio: profile.bio || u.bio,
            education_credentials: profile.education_credentials || 'M.Arch',
            software_tools: profile.software_tools || 'AutoCAD, Revit, SketchUp',
            featured: !!profile.featured
          };
        });
    },

    async getById(id) {
      const list = await db.designers.listAll();
      return list.find(d => d.id === Number(id)) || null;
    },

    async saveProfile(profileData) {
      if (dbMode === 'mysql') {
        const [existing] = await mysqlPool.query('SELECT id FROM designer_profiles WHERE user_id = ?', [profileData.user_id]);
        if (existing.length > 0) {
          await mysqlPool.query(
            `UPDATE designer_profiles SET title=?, specializations=?, experience_years=?, location=?, bio=?, education_credentials=?, software_tools=?, featured=? WHERE user_id=?`,
            [profileData.title, JSON.stringify(profileData.specializations || []), profileData.experience_years, profileData.location, profileData.bio, profileData.education_credentials, profileData.software_tools, profileData.featured ? 1 : 0, profileData.user_id]
          );
          return { ...profileData, id: existing[0].id };
        } else {
          const [res] = await mysqlPool.query(
            `INSERT INTO designer_profiles (user_id, title, specializations, experience_years, location, bio, education_credentials, software_tools, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [profileData.user_id, profileData.title, JSON.stringify(profileData.specializations || []), profileData.experience_years, profileData.location, profileData.bio, profileData.education_credentials, profileData.software_tools, profileData.featured ? 1 : 0]
          );
          return { ...profileData, id: res.insertId };
        }
      }

      const idx = fallbackStore.designer_profiles.findIndex(p => p.user_id === Number(profileData.user_id));
      if (idx >= 0) {
        fallbackStore.designer_profiles[idx] = { ...fallbackStore.designer_profiles[idx], ...profileData };
        saveFallback();
        return fallbackStore.designer_profiles[idx];
      }
      const newId = fallbackStore.designer_profiles.length ? Math.max(...fallbackStore.designer_profiles.map(p => p.id)) + 1 : 1;
      const newProf = { id: newId, ...profileData };
      fallbackStore.designer_profiles.push(newProf);
      saveFallback();
      return newProf;
    }
  },

  portfolios: {
    async getByDesignerId(designerId) {
      if (dbMode === 'mysql') {
        const [rows] = await mysqlPool.query('SELECT * FROM portfolios WHERE designer_id = ? ORDER BY id DESC', [designerId]);
        return rows.map(r => ({
          ...r,
          tags: typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : r.tags
        }));
      }
      return fallbackStore.portfolios.filter(p => p.designer_id === Number(designerId));
    },

    async listAll(category = null) {
      if (dbMode === 'mysql') {
        let sql = `
          SELECT p.*, u.name as designer_name, u.avatar as designer_avatar, dp.title as designer_title
          FROM portfolios p
          JOIN users u ON p.designer_id = u.id
          LEFT JOIN designer_profiles dp ON u.id = dp.user_id
        `;
        const params = [];
        if (category && category !== 'all') {
          sql += ' WHERE p.category = ?';
          params.push(category);
        }
        sql += ' ORDER BY p.id DESC';
        const [rows] = await mysqlPool.query(sql, params);
        return rows.map(r => ({
          ...r,
          tags: typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : r.tags
        }));
      }

      let list = fallbackStore.portfolios;
      if (category && category !== 'all') {
        list = list.filter(p => p.category === category);
      }
      return list.map(p => {
        const designer = fallbackStore.users.find(u => u.id === p.designer_id) || {};
        const profile = fallbackStore.designer_profiles.find(dp => dp.user_id === p.designer_id) || {};
        return {
          ...p,
          designer_name: designer.name || 'Vision Architect',
          designer_avatar: designer.avatar,
          designer_title: profile.title || 'Architect'
        };
      });
    },

    async create(data) {
      if (dbMode === 'mysql') {
        const [res] = await mysqlPool.query(
          `INSERT INTO portfolios (designer_id, title, category, description, image_url, blueprint_url, style, area_sqft, location, year_completed, tags)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [data.designer_id, data.title, data.category || 'residential', data.description, data.image_url, data.blueprint_url || null, data.style || 'Modern', data.area_sqft || null, data.location || null, data.year_completed || 2024, JSON.stringify(data.tags || [])]
        );
        return { id: res.insertId, ...data };
      }
      const newId = fallbackStore.portfolios.length ? Math.max(...fallbackStore.portfolios.map(p => p.id)) + 1 : 1;
      const item = { id: newId, created_at: new Date().toISOString(), ...data };
      fallbackStore.portfolios.push(item);
      saveFallback();
      return item;
    },

    async getById(id) {
      if (dbMode === 'mysql') {
        const [rows] = await mysqlPool.query('SELECT * FROM portfolios WHERE id = ?', [id]);
        if (!rows.length) return null;
        const r = rows[0];
        return {
          ...r,
          tags: typeof r.tags === 'string' ? JSON.parse(r.tags || '[]') : r.tags
        };
      }
      return fallbackStore.portfolios.find(p => p.id === Number(id)) || null;
    },

    async update(id, designerId, data) {
      if (dbMode === 'mysql') {
        await mysqlPool.query(
          `UPDATE portfolios SET title=?, category=?, description=?, image_url=?, blueprint_url=?, style=?, area_sqft=?, location=?, year_completed=?, tags=?
           WHERE id=? AND designer_id=?`,
          [data.title, data.category || 'residential', data.description, data.image_url, data.blueprint_url || null, data.style || 'Modern', data.area_sqft || null, data.location || null, data.year_completed || 2024, JSON.stringify(data.tags || []), id, designerId]
        );
        return this.getById(id);
      }
      const idx = fallbackStore.portfolios.findIndex(p => p.id === Number(id) && p.designer_id === Number(designerId));
      if (idx >= 0) {
        fallbackStore.portfolios[idx] = { ...fallbackStore.portfolios[idx], ...data, updated_at: new Date().toISOString() };
        saveFallback();
        return fallbackStore.portfolios[idx];
      }
      return null;
    },

    async delete(id, designerId) {
      if (dbMode === 'mysql') {
        const [res] = await mysqlPool.query('DELETE FROM portfolios WHERE id=? AND designer_id=?', [id, designerId]);
        return res.affectedRows > 0;
      }
      const initialLen = fallbackStore.portfolios.length;
      fallbackStore.portfolios = fallbackStore.portfolios.filter(p => !(p.id === Number(id) && p.designer_id === Number(designerId)));
      saveFallback();
      return fallbackStore.portfolios.length < initialLen;
    }
  },

  projects: {
    async create(data) {
      if (dbMode === 'mysql') {
        const [res] = await mysqlPool.query(
          `INSERT INTO projects (
            customer_id, designer_id, title, building_type, plot_dimensions,
            num_floors, rooms_needed, style_preference, budget_range, timeline_preference,
            description, special_requirements, inspiration_urls, technical_summary, status
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            data.customer_id,
            data.designer_id || null,
            data.title,
            data.building_type,
            data.plot_dimensions || null,
            data.num_floors || 1,
            data.rooms_needed || null,
            data.style_preference,
            data.budget_range || 'Mid-range',
            data.timeline_preference || '2 - 4 months',
            data.description,
            data.special_requirements || null,
            JSON.stringify(data.inspiration_urls || []),
            JSON.stringify(data.technical_summary || {}),
            data.designer_id ? 'designer_assigned' : 'submitted'
          ]
        );
        return { id: res.insertId, ...data, status: data.designer_id ? 'designer_assigned' : 'submitted' };
      }

      const newId = fallbackStore.projects.length ? Math.max(...fallbackStore.projects.map(p => p.id)) + 1 : 1;
      const newProj = {
        id: newId,
        status: data.designer_id ? 'designer_assigned' : 'submitted',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        ...data
      };
      fallbackStore.projects.push(newProj);
      saveFallback();
      return newProj;
    },

    async getById(id) {
      if (dbMode === 'mysql') {
        const sql = `
          SELECT p.*,
                 c.name as customer_name, c.email as customer_email, c.avatar as customer_avatar,
                 d.name as designer_name, d.email as designer_email, d.avatar as designer_avatar,
                 dp.title as designer_title
          FROM projects p
          JOIN users c ON p.customer_id = c.id
          LEFT JOIN users d ON p.designer_id = d.id
          LEFT JOIN designer_profiles dp ON d.id = dp.user_id
          WHERE p.id = ?
        `;
        const [rows] = await mysqlPool.query(sql, [id]);
        if (!rows.length) return null;
        const r = rows[0];
        return {
          ...r,
          inspiration_urls: typeof r.inspiration_urls === 'string' ? JSON.parse(r.inspiration_urls || '[]') : r.inspiration_urls,
          technical_summary: typeof r.technical_summary === 'string' ? JSON.parse(r.technical_summary || '{}') : r.technical_summary
        };
      }

      const proj = fallbackStore.projects.find(p => p.id === Number(id));
      if (!proj) return null;
      const customer = fallbackStore.users.find(u => u.id === proj.customer_id) || {};
      const designer = fallbackStore.users.find(u => u.id === proj.designer_id) || {};
      const profile = designer.id ? (fallbackStore.designer_profiles.find(dp => dp.user_id === designer.id) || {}) : {};

      return {
        ...proj,
        customer_name: customer.name || 'Client',
        customer_email: customer.email,
        customer_avatar: customer.avatar,
        designer_name: designer.name || null,
        designer_email: designer.email || null,
        designer_avatar: designer.avatar || null,
        designer_title: profile.title || null
      };
    },

    async listForCustomer(customerId) {
      if (dbMode === 'mysql') {
        const sql = `
          SELECT p.*, d.name as designer_name, d.avatar as designer_avatar, dp.title as designer_title
          FROM projects p
          LEFT JOIN users d ON p.designer_id = d.id
          LEFT JOIN designer_profiles dp ON d.id = dp.user_id
          WHERE p.customer_id = ?
          ORDER BY p.updated_at DESC
        `;
        const [rows] = await mysqlPool.query(sql, [customerId]);
        return rows.map(r => ({
          ...r,
          inspiration_urls: typeof r.inspiration_urls === 'string' ? JSON.parse(r.inspiration_urls || '[]') : r.inspiration_urls,
          technical_summary: typeof r.technical_summary === 'string' ? JSON.parse(r.technical_summary || '{}') : r.technical_summary
        }));
      }

      return fallbackStore.projects
        .filter(p => p.customer_id === Number(customerId))
        .map(p => {
          const designer = fallbackStore.users.find(u => u.id === p.designer_id) || {};
          const profile = designer.id ? (fallbackStore.designer_profiles.find(dp => dp.user_id === designer.id) || {}) : {};
          return {
            ...p,
            designer_name: designer.name || null,
            designer_avatar: designer.avatar || null,
            designer_title: profile.title || null
          };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    async listForDesigner(designerId) {
      if (dbMode === 'mysql') {
        const sql = `
          SELECT p.*, c.name as customer_name, c.avatar as customer_avatar
          FROM projects p
          JOIN users c ON p.customer_id = c.id
          WHERE p.designer_id = ? OR (p.designer_id IS NULL AND p.status = 'submitted')
          ORDER BY p.updated_at DESC
        `;
        const [rows] = await mysqlPool.query(sql, [designerId]);
        return rows.map(r => ({
          ...r,
          inspiration_urls: typeof r.inspiration_urls === 'string' ? JSON.parse(r.inspiration_urls || '[]') : r.inspiration_urls,
          technical_summary: typeof r.technical_summary === 'string' ? JSON.parse(r.technical_summary || '{}') : r.technical_summary
        }));
      }

      return fallbackStore.projects
        .filter(p => p.designer_id === Number(designerId) || (p.designer_id === null && p.status === 'submitted'))
        .map(p => {
          const customer = fallbackStore.users.find(u => u.id === p.customer_id) || {};
          return {
            ...p,
            customer_name: customer.name || 'Client',
            customer_avatar: customer.avatar || null
          };
        })
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    },

    async updateStatus(projectId, status, designerId = null) {
      if (dbMode === 'mysql') {
        if (designerId) {
          await mysqlPool.query('UPDATE projects SET status = ?, designer_id = ? WHERE id = ?', [status, designerId, projectId]);
        } else {
          await mysqlPool.query('UPDATE projects SET status = ? WHERE id = ?', [status, projectId]);
        }
        return await db.projects.getById(projectId);
      }

      const proj = fallbackStore.projects.find(p => p.id === Number(projectId));
      if (proj) {
        proj.status = status;
        if (designerId) proj.designer_id = Number(designerId);
        proj.updated_at = new Date().toISOString();
        saveFallback();
      }
      return proj;
    }
  },

  deliverables: {
    async listByProject(projectId) {
      if (dbMode === 'mysql') {
        const [rows] = await mysqlPool.query('SELECT * FROM deliverables WHERE project_id = ? ORDER BY version ASC', [projectId]);
        return rows;
      }
      return fallbackStore.deliverables.filter(d => d.project_id === Number(projectId));
    },

    async create(data) {
      if (dbMode === 'mysql') {
        const [res] = await mysqlPool.query(
          `INSERT INTO deliverables (project_id, designer_id, stage, title, description, file_url, file_type, version, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [data.project_id, data.designer_id, data.stage, data.title, data.description || null, data.file_url, data.file_type || 'image', data.version || 1, data.status || 'pending_review']
        );
        return { id: res.insertId, ...data };
      }
      const newId = fallbackStore.deliverables.length ? Math.max(...fallbackStore.deliverables.map(d => d.id)) + 1 : 1;
      const item = { id: newId, created_at: new Date().toISOString(), status: 'pending_review', version: data.version || 1, ...data };
      fallbackStore.deliverables.push(item);
      saveFallback();
      return item;
    },

    async updateStatus(deliverableId, status) {
      if (dbMode === 'mysql') {
        await mysqlPool.query('UPDATE deliverables SET status = ? WHERE id = ?', [status, deliverableId]);
        const [rows] = await mysqlPool.query('SELECT * FROM deliverables WHERE id = ?', [deliverableId]);
        return rows[0] || null;
      }
      const item = fallbackStore.deliverables.find(d => d.id === Number(deliverableId));
      if (item) {
        item.status = status;
        saveFallback();
      }
      return item;
    }
  },

  revisions: {
    async listByDeliverable(deliverableId) {
      if (dbMode === 'mysql') {
        const sql = `
          SELECT r.*, u.name as customer_name, u.avatar as customer_avatar
          FROM revisions r
          JOIN users u ON r.customer_id = u.id
          WHERE r.deliverable_id = ?
          ORDER BY r.created_at ASC
        `;
        const [rows] = await mysqlPool.query(sql, [deliverableId]);
        return rows;
      }
      return fallbackStore.revisions
        .filter(r => r.deliverable_id === Number(deliverableId))
        .map(r => {
          const user = fallbackStore.users.find(u => u.id === r.customer_id) || {};
          return { ...r, customer_name: user.name || 'Client', customer_avatar: user.avatar };
        });
    },

    async create(data) {
      if (dbMode === 'mysql') {
        const [res] = await mysqlPool.query(
          `INSERT INTO revisions (deliverable_id, project_id, customer_id, feedback_text, pin_x, pin_y, status)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [data.deliverable_id, data.project_id, data.customer_id, data.feedback_text, data.pin_x || null, data.pin_y || null, data.status || 'open']
        );
        return { id: res.insertId, ...data };
      }
      const newId = fallbackStore.revisions.length ? Math.max(...fallbackStore.revisions.map(r => r.id)) + 1 : 1;
      const item = { id: newId, created_at: new Date().toISOString(), status: 'open', ...data };
      fallbackStore.revisions.push(item);
      saveFallback();
      return item;
    }
  },

  messages: {
    async listByProject(projectId) {
      if (dbMode === 'mysql') {
        const sql = `
          SELECT m.*, u.name as sender_name, u.avatar as sender_avatar, u.role as sender_role
          FROM messages m
          JOIN users u ON m.sender_id = u.id
          WHERE m.project_id = ?
          ORDER BY m.created_at ASC
        `;
        const [rows] = await mysqlPool.query(sql, [projectId]);
        return rows;
      }
      return fallbackStore.messages
        .filter(m => m.project_id === Number(projectId))
        .map(m => {
          const sender = fallbackStore.users.find(u => u.id === m.sender_id) || {};
          return {
            ...m,
            sender_name: sender.name || 'User',
            sender_avatar: sender.avatar,
            sender_role: sender.role
          };
        });
    },

    async create(data) {
      if (dbMode === 'mysql') {
        const [res] = await mysqlPool.query(
          `INSERT INTO messages (project_id, sender_id, receiver_id, message_text, attachment_url)
           VALUES (?, ?, ?, ?, ?)`,
          [data.project_id, data.sender_id, data.receiver_id, data.message_text, data.attachment_url || null]
        );
        return { id: res.insertId, ...data, created_at: new Date() };
      }
      const newId = fallbackStore.messages.length ? Math.max(...fallbackStore.messages.map(m => m.id)) + 1 : 1;
      const msg = { id: newId, created_at: new Date().toISOString(), ...data };
      fallbackStore.messages.push(msg);
      saveFallback();
      return msg;
    }
  },

  reviews: {
    async listForDesigner(designerId) {
      if (dbMode === 'mysql') {
        const sql = `
          SELECT r.*, u.name as customer_name, u.avatar as customer_avatar, p.title as project_title
          FROM reviews r
          JOIN users u ON r.customer_id = u.id
          JOIN projects p ON r.project_id = p.id
          WHERE r.designer_id = ?
          ORDER BY r.created_at DESC
        `;
        const [rows] = await mysqlPool.query(sql, [designerId]);
        return rows;
      }
      return fallbackStore.reviews
        .filter(r => r.designer_id === Number(designerId))
        .map(r => {
          const user = fallbackStore.users.find(u => u.id === r.customer_id) || {};
          const proj = fallbackStore.projects.find(p => p.id === r.project_id) || {};
          return {
            ...r,
            customer_name: user.name || 'Client',
            customer_avatar: user.avatar,
            project_title: proj.title || 'Custom Vision Project'
          };
        });
    },

    async create(data) {
      if (dbMode === 'mysql') {
        const [res] = await mysqlPool.query(
          'INSERT INTO reviews (project_id, customer_id, designer_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
          [data.project_id, data.customer_id, data.designer_id, data.rating, data.comment || null]
        );
        return { id: res.insertId, ...data };
      }
      const newId = fallbackStore.reviews.length ? Math.max(...fallbackStore.reviews.map(r => r.id)) + 1 : 1;
      const rev = { id: newId, created_at: new Date().toISOString(), ...data };
      fallbackStore.reviews.push(rev);
      saveFallback();
      return rev;
    }
  },

  proposals: {
    async listByProject(projectId) {
      if (dbMode === 'mysql') {
        const [rows] = await mysqlPool.query('SELECT * FROM proposals WHERE project_id = ? ORDER BY id DESC', [projectId]);
        return rows.map(r => ({
          ...r,
          options: typeof r.options === 'string' ? JSON.parse(r.options || '[]') : r.options
        }));
      }
      if (!fallbackStore.proposals) fallbackStore.proposals = [];
      return fallbackStore.proposals.filter(p => p.project_id === Number(projectId));
    },

    async create(data) {
      if (dbMode === 'mysql') {
        const [res] = await mysqlPool.query(
          `INSERT INTO proposals (project_id, designer_id, title, category, description, options, status)
           VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
          [data.project_id, data.designer_id, data.title, data.category || 'staircase', data.description || null, JSON.stringify(data.options || [])]
        );
        return { id: res.insertId, ...data, status: 'pending', created_at: new Date() };
      }
      if (!fallbackStore.proposals) fallbackStore.proposals = [];
      const newId = fallbackStore.proposals.length ? Math.max(...fallbackStore.proposals.map(p => p.id)) + 1 : 1;
      const item = { id: newId, status: 'pending', created_at: new Date().toISOString(), ...data };
      fallbackStore.proposals.push(item);
      saveFallback();
      return item;
    },

    async chooseOption(proposalId, optionId, customerNote = '') {
      if (dbMode === 'mysql') {
        await mysqlPool.query(
          `UPDATE proposals SET selected_option_id = ?, customer_note = ?, status = 'decided' WHERE id = ?`,
          [optionId, customerNote, proposalId]
        );
        const [rows] = await mysqlPool.query('SELECT * FROM proposals WHERE id = ?', [proposalId]);
        if (!rows.length) return null;
        const r = rows[0];
        return {
          ...r,
          options: typeof r.options === 'string' ? JSON.parse(r.options || '[]') : r.options
        };
      }
      if (!fallbackStore.proposals) fallbackStore.proposals = [];
      const item = fallbackStore.proposals.find(p => p.id === Number(proposalId));
      if (item) {
        item.selected_option_id = optionId;
        item.customer_note = customerNote;
        item.status = 'decided';
        saveFallback();
      }
      return item;
    }
  },

  // Reset or seed helper
  _clearStore() {
    fallbackStore = {
      users: [],
      designer_profiles: [],
      portfolios: [],
      projects: [],
      deliverables: [],
      revisions: [],
      messages: [],
      reviews: [],
      proposals: []
    };
    saveFallback();
  }
};

module.exports = { initDatabase, db };
