import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import db from '../db.js';
import md5 from 'md5';
import express from 'express';
import { v4 } from 'uuid';
import mysql from 'mysql';


const PORT = 3333;
const app = express();



const error500 = (res, err) => res.status(500).json(err);
const error400 = (res, customCode = 0) => res.status(400).json({
  msg: { type: 'error', text: 'Invalid request. Code:' + customCode }
});
const error401 = (res, message) => res.status(401).json({
  msg: { type: 'error', text: message }
});

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kind_spark'
});

db.connect(function (err) {
  if (err) throw err;
  console.log('Connected to MySQL, good job!');
});




const token = req.cookies['kind_spark'];

  if (!token) {
    return error401(res, 'No token provided');
  };

  try {
    const sql = `
    SELECT u.id, u.name, u.is_admin
    FROM sessions AS s
    INNER JOIN users AS u 
    ON s.user_id = u.id
    WHERE token = ? AND valid_until > NOW()
    `;

    const [result] = db.query(sql, [token]);

    if (result.length === 0) {
     return error401(res, 'Session expired or invalid');
    };

    req.user = result[0];
    const regex = /^\/admin\//;
    if (regex.test(req.path) && req.user.is_admin !== 1) {
      return error401(res, 'Admin access required, dummy');
    }

    next();
  } catch (err) {
    return error500(res, err);
  };

















app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());



router.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const hashed = md5(password);
  const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';

  db.query(sql, [name, email, hashed], (err) => {
    if (err) return error500(res);
    res.send('User registered');
  });
});

router.post('/login', (req, res) => {
  const { name, password } = req.body;
  const hashed = md5(password);
  const sql = 'SELECT * FROM users WHERE name = ? AND password = ?';

  db.query(sql, [name, hashed], (err, results) => {
    if (err) return error500(res, err);
    if (results.length === 0) return error401(res, 'Inavlid user name or password');

    const user = results[0];
    const token = md5(v4());

    let validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 1);

    const insertSession = `
      INSERT INTO sessions 
      (user_id, token, valid_until)
      VALUES (?, ?, ?)
    `;

    db.query(insertSession, [user.id, token, validUntil], (err) => {
      if (err) return error500(res, err);
      res.cookie('kind_spark', token, {
        httpOnly: true,
        SameSite: 'none',
        secure: true
      });
      res.status(200).json({
        msg: { type: 'success', text: `Welcome, ${user.name}` },
        user: {
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          is_admin: user.is_admin
        }
      });
    });
  });
});











router.get('/', auth, (req, res) => {
  const sql = `
    SELECT id, title, description, goal_amount, current_amount, image, status 
    FROM stories
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return error500(res, err);
    res.json(results);
  });
});

router.put('/:id/approve', auth, (req, res) => {
  const storyId = req.params.id;

  const sql = `
    UPDATE stories
    SET status = 'active'
    WHERE id = ? AND status = 'pending'
  `;

  db.query(sql, [storyId], (err, results) => {
    if (err) return error500(res, err);
    if (results.affectedRows === 0) {
      return res.status(404).json({ msg: { type: 'error', text: 'Story not found or already approved' } });
    }
    res.status(200).json({ msg: { type: 'success', text: 'Story approved and now active' } });
  });
});

router.put('/:id/reject', auth, (req, res) => {
  const storyId = req.params.id;

  const sql = `
    UPDATE stories
    SET status = 'rejected'
    WHERE id = ? AND status = 'pending'
  `;

  db.query(sql, [storyId], (err, results) => {
    if (err) return error500(res, err);
    if (results.affectedRows === 0) {
      return res.status(404).json({ msg: { type: 'error', text: 'Story not found or already rejected' } });
    }
    res.status(200).json({ msg: { type: 'success', text: 'Story rejected' } });
  });
});

router.get('/donations', auth, (req, res) => {
  const sql = `
    SELECT donations.id, donations.amount, donations.user_id, stories.title AS story_title, users.email AS donor_email
    FROM donations
    JOIN stories ON donations.story_id = stories.id
    JOIN users ON donations.user_id = users.id
    ORDER BY donations.id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return error500(res, err);
    res.json(results);
  });
});





router.get('/', (req, res) => {
  const sql = `
    SELECT id, title, description, goal_amount, current_amount, image 
    FROM stories
    WHERE status = 'active'
    ORDER BY id DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return error500(res, err);
    res.json(results);
  });
});

router.post('/', auth, (req, res) => {
  const { title, description, goal_amount, image } = req.body;

  const sql = `
    INSERT INTO stories
    (user_id, title, description, goal_amount, image, status, current_amount)
    VALUES (?, ?, ?, ?, ?, 'pending', 0)
  `;

  db.query(sql, [req.user.id, title, description, goal_amount, image], (err) => {
    if (err) return error500(res, err);
    res.status(201).json({ msg: { type: 'success', text: 'Story created. Waiting for approval' } });
  });
});

router.post('/:id/donate', auth, (req, res) => {
  const { amount } = req.body;
  const storyId = req.params.id;

  const sql = `
    INSERT INTO donations (user_id, story_id, amount)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [req.user.id, storyId, amount], (err) => {
    if (err) return error500(res, err);

    const updateSql = `
      UPDATE stories
      SET current_amount = current_amount + ?
      WHERE id = ?
    `;

    db.query(updateSql, [amount, storyId], (err) => {
      if (err) return error500(res, err);
      res.status(200).json({ msg: { type: 'success', text: 'Donation received. Thank you!' } });
    });
  });
});








app.listen(PORT, _ => console.log(`Server running on port ${PORT}`));
