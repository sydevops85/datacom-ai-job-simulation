import { Response } from 'express';
import { executeQuery } from '../database/connection';
import { AuthRequest } from '../middleware/auth.middleware';

export async function createKudos(req: AuthRequest, res: Response) {
  try {
    const { recipient_id, message } = req.body;
    const giver_id = req.user?.id;

    // Validation
    if (!recipient_id || !message) {
      return res.status(400).json({ error: 'Recipient and message required' });
    }

    if (giver_id === recipient_id) {
      return res.status(400).json({ error: 'Cannot give kudos to yourself' });
    }

    if (message.length > 500) {
      return res.status(400).json({ error: 'Message exceeds 500 characters' });
    }

    // Check recipient exists
    const recipientCheck: any = await executeQuery(
      'SELECT id FROM users WHERE id = ? AND is_active = TRUE',
      [recipient_id]
    );

    if (!recipientCheck || recipientCheck.length === 0) {
      return res.status(404).json({ error: 'Recipient not found' });
    }

    // Check for duplicate submission in last hour
    const duplicateCheck: any = await executeQuery(
      'SELECT id FROM kudos WHERE giver_id = ? AND recipient_id = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)',
      [giver_id, recipient_id]
    );

    if (duplicateCheck && duplicateCheck.length > 0) {
      return res.status(429).json({ error: 'You can only give one kudos per hour to the same person' });
    }

    // Create kudos
    const result: any = await executeQuery(
      'INSERT INTO kudos (giver_id, recipient_id, message) VALUES (?, ?, ?)',
      [giver_id, recipient_id, message]
    );

    res.status(201).json({
      id: result.insertId,
      giver_id,
      recipient_id,
      message,
      created_at: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create kudos' });
  }
}

export async function getKudosFeed(req: Response, res: any) {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const recipient_id = req.query.recipient_id as string;

    let sql = `
      SELECT k.id, k.message, k.created_at,
             g.id as giver_id, g.username as giver_username, g.first_name as giver_first_name, g.last_name as giver_last_name,
             r.id as recipient_id, r.username as recipient_username, r.first_name as recipient_first_name, r.last_name as recipient_last_name
      FROM kudos k
      JOIN users g ON k.giver_id = g.id
      JOIN users r ON k.recipient_id = r.id
      WHERE k.is_visible = TRUE
    `;
    const params: any[] = [];

    if (recipient_id) {
      sql += ' AND k.recipient_id = ?';
      params.push(recipient_id);
    }

    sql += ' ORDER BY k.created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, skip);

    const results = await executeQuery(sql, params);

    res.status(200).json({ kudos: results, total: results.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch kudos feed' });
  }
}

export async function getKudosById(req: Response, res: any) {
  try {
    const { id } = req.params;

    const results: any = await executeQuery(
      `SELECT k.*, g.username as giver_username, r.username as recipient_username
       FROM kudos k
       JOIN users g ON k.giver_id = g.id
       JOIN users r ON k.recipient_id = r.id
       WHERE k.id = ? AND k.is_visible = TRUE`,
      [id]
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ error: 'Kudos not found' });
    }

    res.status(200).json(results[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch kudos' });
  }
}
