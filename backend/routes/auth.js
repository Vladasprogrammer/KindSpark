import express from 'express';
const router = express.Router();
import db from '../db.js';
import md5 from 'md5';
import { v4 } from 'uuid';

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

export default router;
