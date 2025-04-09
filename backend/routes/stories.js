import express from 'express';
import db from '../db.js';
import { auth } from '../utils/middleware.js';
import { error500 } from '../utils/errorHandlers.js';

const router = express.Router();

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

export default router;
