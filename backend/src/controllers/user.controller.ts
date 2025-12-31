import { Response } from 'express';
import { executeQuery } from '../database/connection';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getUsers(req: AuthRequest, res: Response) {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const search = req.query.search as string || '';

    let sql = 'SELECT id, username, email, first_name, last_name, role FROM users WHERE is_active = TRUE';
    const params: any[] = [];

    if (search) {
      sql += ' AND (username LIKE ? OR first_name LIKE ? OR last_name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' LIMIT ? OFFSET ?';
    params.push(limit, skip);

    const results: any = await executeQuery(sql, params);

    res.status(200).json({ users: Array.isArray(results) ? results : [], total: Array.isArray(results) ? results.length : 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
}

export async function getUserById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const results: any = await executeQuery(
      'SELECT id, username, email, first_name, last_name, role FROM users WHERE id = ? AND is_active = TRUE',
      [id]
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(results[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}
