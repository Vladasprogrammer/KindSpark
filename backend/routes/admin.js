import express from 'express';
import db from '../db.js';
import { auth } from '../utils/middleware.js';
import { error500 } from '../utils/errorHandlers.js';

const router = express.Router();

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

export default router;
