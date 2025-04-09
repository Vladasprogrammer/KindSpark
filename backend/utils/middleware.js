import db from '../db.js';
import { error500, error401 } from './errorHandlers.js';

export const auth = async (req, res, next) => {
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
};
