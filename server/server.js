import cors from 'cors';
import cookieParser from 'cookie-parser';
import md5 from 'md5';
import express from 'express';
import { v4 } from 'uuid';
import mysql from 'mysql';

const PORT = 3333;
const app = express();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());

// Error handlers
const error400 = (res, message = 'Bad request') => res.status(400).json({ error: message });
const error401 = (res, message = 'Unauthorized') => res.status(401).json({ error: message });
const error403 = (res, message = 'Forbidden') => res.status(403).json({ error: message });
const error404 = (res, message = 'Not found') => res.status(404).json({ error: message });
const error500 = (res, err) => {
  console.error(err);
  return res.status(500).json({ error: 'Internal server error' });
};

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kind_spark'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Middlewares
const authMiddleware = (req, res, next) => {
  const token = req.cookies['kind_spark'];
  if (!token) return error401(res, 'No authentication token');

  const sql = `
    SELECT u.id, u.name, u.role, u.avatar, u.email
    FROM sessions AS s
    JOIN users AS u ON s.user_id = u.id
    WHERE s.token = ? AND s.valid_until > NOW()
  `;

  db.query(sql, [token], (err, results) => {
    if (err) return error500(res, err);
    if (!results.length) return error401(res, 'Invalid or expired session');

    req.user = results[0];
    next();
  });
};

const adminMiddleware = (req, res, next) => {
  if (req.user?.role !== 'admin') return error403(res);
  next();
};

// Routes
app.get('/auth-user', authMiddleware, (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    avatar: req.user.avatar
  });
});

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return error400(res, 'Missing required fields');

  const hashedPassword = md5(password);
  const sql = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, "user")';

  db.query(sql, [name, email, hashedPassword], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return error400(res, 'Username or email already exists');
      return error500(res, err);
    }
    res.json({ success: true, message: 'Registration successful' });
  });
});

app.post('/login', (req, res) => {
  const { name, password } = req.body;
  if (!name || !password) return error400(res, 'Missing credentials');

  const hashedPassword = md5(password);
  const sql = 'SELECT id, name, role, avatar FROM users WHERE name = ? AND password = ?';

  db.query(sql, [name, hashedPassword], (err, results) => {
    if (err) return error500(res, err);
    if (!results.length) return error401(res, 'Invalid credentials');

    const user = results[0];
    const token = md5(v4());
    const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    db.query(
      'INSERT INTO sessions (user_id, token, valid_until) VALUES (?, ?, ?)',
      [user.id, token, validUntil],
      (err) => {
        if (err) return error500(res, err);

        res.cookie('kind_spark', token, {
          httpOnly: true,
          sameSite: 'none',
          secure: false, // set to true in production with HTTPS
          maxAge: 24 * 60 * 60 * 1000
        });

        res.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
            avatar: user.avatar
          }
        });
      }
    );
  });
});

// Story routes
app.get('/stories', (req, res) => {
  const sql = `
    SELECT id, title, description, goal_amount, current_amount, image, user_id
    FROM stories
    -- WHERE status = 'approved'
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return error500(res, err);
    res.json(results);
  });
});

app.post('/stories', authMiddleware, (req, res) => {
  const { title, description, goal_amount } = req.body;
  const image = req.body.image || null;
  if (!title || !description || !goal_amount) return error400(res);

  const sql = `
    INSERT INTO stories 
    (user_id, title, description, goal_amount, image, status, created_at)
    VALUES (?, ?, ?, ?, ?, 'pending', NOW())
  `;

  db.query(sql, [req.user.id, title, description, goal_amount, image], (err) => {
    if (err) return error500(res, err);
    res.json({ success: true, message: 'Story submitted for approval' });
  });
});

app.post('/stories/:id/donate', authMiddleware, (req, res) => {
  const storyId = req.params.id;
  const { amount, donorName } = req.body;
  if (!amount || amount <= 0) return error400(res, 'Invalid donation amount');

  const donationSql = `
    INSERT INTO donations (user_id, story_id, amount, donor_name, created_at)
    VALUES (?, ?, ?, ?, NOW())
  `;

  const updateStorySql = `
    UPDATE stories 
    SET current_amount = current_amount + ? 
    WHERE id = ?
  `;

  const completedStorySql = `
    UPDATE stories
    SET status = 'completed'
    WHERE id = ? AND current_amount >= goal_amount
  `

  db.beginTransaction(err => {
    if (err) return error500(res, err);

    db.query(donationSql, [req.user.id, storyId, amount, donorName || 'Anonymous'], (err) => {
      if (err) return db.rollback(() => error500(res, err));

      db.query(updateStorySql, [amount, storyId], (err) => {
        if (err) return db.rollback(() => error500(res, err));

        db.query(completedStorySql, [storyId], (err) => {
          if (err) return db.rollback(() => error500(res, err));

          db.commit(err => {
            if (err) return db.rollback(() => error500(res, err));
            res.json({
              success: true,
              message: 'Donation successful'
            });
          });
        });
      });
    });
  });
});

// Admin routes
app.get('/admin/stories', authMiddleware, adminMiddleware, (req, res) => {
  const sql = `
    SELECT s.*, u.name as author_name 
    FROM stories s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return error500(res, err);
    res.json(results);
  });
});

app.put('/admin/stories/:id/status', authMiddleware, adminMiddleware, (req, res) => {
  const { status } = req.body;
  const storyId = req.params.id;

  if (!['approved', 'rejected'].includes(status)) return error400(res, 'Invalid status');

  const sql = 'UPDATE stories SET status = ? WHERE id = ? AND status = "pending"';

  db.query(sql, [status, storyId], (err, result) => {
    if (err) return error500(res, err);
    if (!result.affectedRows) return error404(res, 'Story not found or already processed');

    res.json({ success: true, message: `Story ${status}` });
  });
});

app.get('/donations', (req, res) => {
  const sql = 'SELECT * FROM donations ORDER BY created_at DESC';
  db.query(sql, (err, results) => {
    if (err) return error500(res, err);
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});