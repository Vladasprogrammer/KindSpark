import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import md5 from 'md5';
import cookieParser from 'cookie-parser';
import { v4 } from 'uuid';
import fs from 'fs';

const app = express();
const PORT = 3333;
const FRONT_URL = 'http://localhost:5173';
const SERVER_URL = `http://localhost:${PORT}`

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));
app.use(cookieParser());
app.use(cors({
  origin: FRONT_URL,
  credentials: true,
}));

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
const con = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kind_spark'
});

con.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// // Helper with Images
// const saveImageAsFile = imageBase64String => {
//   if (!imageBase64String) {
//     return null;
//   }

//   let type, image;

//   if (imageBase64String.indexOf('data:image/png;base64,') === 0) {
//     type = 'png';
//     image = Buffer.from(imageBase64String.replace(/^data:image\/png;base64,/, ''), 'base64');
//   } else if (imageBase64String.indexOf('data:image/jpeg;base64,') === 0) {
//     type = 'jpg';
//     image = Buffer.from(imageBase64String.replace(/^data:image\/jpeg;base64,/, ''), 'base64');
//   } else if (imageBase64String.indexOf('data:image/webp;base64,') === 0) {
//     type = 'webp';
//     image = Buffer.from(imageBase64String.replace(/^data:image\/webp;base64,/, ''), 'base64');
//   }
//   else {
//     error400('Bad image format 1255');
//     return;
//   }

//   const fileName = md5(v4()) + '.' + type;

//   fs.writeFileSync('public/upload/' + fileName, image);

//   return fileName;

// }


// Middlewares
app.use((req, res, next) => {
  const token = req.cookies['kind_spark'] || 'no-token';
  const sql = `
    SELECT u.id, u.username, u.role, u.avatar, u.email
    FROM sessions AS s
    JOIN users AS u 
    ON s.user_id = u.id
    WHERE s.token = ? AND s.valid_until > NOW()
  `;
  con.query(sql, [token], (err, result) => {
    if (err) return error500(res, err);
    if (result.length === 0) {
      req.user = {
        role: 'guest',
        username: 'Guest',
        id: 0
      }
    } else {
      req.user = {
        role: result[0].role,
        username: result[0].username,
        avatar: result[0].avatar,
        id: result[0].id
      }
    }
    next();
  });
})


app.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) return error400(res, 'Missing required fields');

  const hashedPassword = md5(password);
  const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "user")';

  con.query(sql, [username, email, hashedPassword], (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') return error400(res, 'Username or email already exists');
      return error500(res, err);
    }
    res.json({ success: true, message: 'Registration successful' });
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return error400(res, 'Missing credentials');


  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';

  con.query(sql, [username, md5(password)], (err, results) => {
    if (err) return error500(res, err);
    if (results.length === 0) return error401(res, 'Invalid user name or password.');
    const token = md5(v4());
    const userId = results[0].id;
    const validUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    const insertSql = `
      INSERT INTO sessions 
      (user_id, token, valid_until) 
      VALUES (?, ?, ?)
    `;
    con.query(insertSql, [userId, token, validUntil], (err) => {
      if (err) return error500(res, err);

      res.cookie('kind_spark', token, {
        httpOnly: true,
        SameSite: 'none',
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
      });

      res.status(200).json({
        msg: { type: 'success', text: `Hello, ${results[0].username}!` },
        user: {
          id: results[0].id,
          username: results[0].username,
          role: results[0].role,
          avatar: results[0].avatar
        }
      });
    }
    );
  });
});

app.get('/auth-user', (req, res) => {
  setTimeout(_ => {
    res.json(req.user);
  }, 1000);
});

app.post('/logout', (req, res) => {
  setTimeout(_ => {
    const token = req.cookies['kind_spark'] || 'no-token';
    const sql = `
      DELETE FROM sessions
      WHERE token = ?
    `;
    con.query(sql, [token], (err) => {
      if (err) return error500(res, err);
      res.clearCookie('kind_spark');
      res.status(200).json({
        msg: { type: 'success', text: `You are now logged off.` },
        user: {
          role: 'guest',
          username: 'Guest',
          id: 0,
          avatar: null
        }
      });
    });
  }, 1500);
});

// Active users??
app.get('/users/active-list', (req, res) => {

  setTimeout(_ => {
    const sql = `
      SELECT id, username, role, avatar
      FROM users
      ORDER BY role DESC
    `;

    con.query(sql, (err, result) => {
      if (err) return error500(res, err)
      res.json({ success: true, db: result });
    });
  }, 2000);
});




// Story routes
app.get('/stories', (req, res) => {
  const sql = `
    SELECT id, title, description, goal_amount, current_amount, image, user_id
    FROM stories
    -- WHERE status = 'approved'
    ORDER BY created_at DESC
  `;

  con.query(sql, (err, results) => {
    if (err) return error500(res, err);
    res.json(results);
  });
});

app.post('/stories', (req, res) => {
  const { title, description, goal_amount } = req.body;
  const image = req.body.image || null;
  if (!title || !description || !goal_amount) return error400(res);

  const sql = `
    INSERT INTO stories 
    (user_id, title, description, goal_amount, image, status, created_at)
    VALUES (?, ?, ?, ?, ?, 'pending', NOW())
  `;

  con.query(sql, [req.user.id, title, description, goal_amount, image], (err) => {
    if (err) return error500(res, err);
    res.json({ success: true, message: 'Story submitted for approval' });
  });
});

app.post('/stories/:id/donate', (req, res) => {
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

  con.beginTransaction(err => {
    if (err) return error500(res, err);

    con.query(donationSql, [req.user.id, storyId, amount, donorName || 'Anonymous'], (err) => {
      if (err) return con.rollback(() => error500(res, err));

      con.query(updateStorySql, [amount, storyId], (err) => {
        if (err) return con.rollback(() => error500(res, err));

        con.query(completedStorySql, [storyId], (err) => {
          if (err) return con.rollback(() => error500(res, err));

          con.commit(err => {
            if (err) return con.rollback(() => error500(res, err));
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

app.get('/donations', (req, res) => {
  const sql = 'SELECT * FROM donations ORDER BY created_at DESC';
  con.query(sql, (err, results) => {
    if (err) return error500(res, err);
    res.json(results);
  });
});

// Admin routes
app.get('/admin/stories', (req, res) => {
  const sql = `
    SELECT s.*, u.username as author_name 
    FROM stories s
    JOIN users u ON s.user_id = u.id
    ORDER BY s.created_at DESC
  `;

  con.query(sql, (err, results) => {
    if (err) return error500(res, err);
    res.json(results);
  });
});

app.put('/admin/stories/:id/status', (req, res) => {
  const { status } = req.body;
  const storyId = req.params.id;

  if (!['approved', 'rejected'].includes(status)) return error400(res, 'Invalid status');

  const sql = 'UPDATE stories SET status = ? WHERE id = ? AND status = "pending"';

  con.query(sql, [status, storyId], (err, result) => {
    if (err) return error500(res, err);
    if (!result.affectedRows) return error404(res, 'Story not found or already processed');

    res.json({ success: true, message: `Story ${status}` });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on ${SERVER_URL}`);
});

process.on('unhandledRejection', err => {
  console.error('Unhandled rejection:', err);
  process.exit(1);
});