import { Response } from 'express';
import { executeQuery } from '../database/connection';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getAllKudos(req: AuthRequest, res: Response) {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
    const recipient_id = req.query.recipient_id as string;

    let sql = `
      SELECT k.*, g.username as giver_username, r.username as recipient_username
      FROM kudos k
      JOIN users g ON k.giver_id = g.id
      JOIN users r ON k.recipient_id = r.id
      WHERE 1=1
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
    res.status(500).json({ error: 'Failed to fetch kudos' });
  }
}

export async function hideKudos(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const admin_id = req.user?.id;

    // Verify kudos exists
    const kudosCheck: any = await executeQuery(
      'SELECT id FROM kudos WHERE id = ?',
      [id]
    );

    if (!kudosCheck || kudosCheck.length === 0) {
      return res.status(404).json({ error: 'Kudos not found' });
    }

    // Hide kudos
    await executeQuery(
      'UPDATE kudos SET is_visible = FALSE, moderated_by = ?, moderated_at = NOW(), moderation_reason = ? WHERE id = ?',
      [admin_id, reason, id]
    );

    // Log moderation action
    await executeQuery(
      'INSERT INTO moderation_logs (kudos_id, admin_id, action, reason) VALUES (?, ?, ?, ?)',
      [id, admin_id, 'hide', reason]
    );

    res.status(200).json({ message: 'Kudos hidden successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to hide kudos' });
  }
}

export async function deleteKudos(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const admin_id = req.user?.id;

    // Verify kudos exists
    const kudosCheck: any = await executeQuery(
      'SELECT id FROM kudos WHERE id = ?',
      [id]
    );

    if (!kudosCheck || kudosCheck.length === 0) {
      return res.status(404).json({ error: 'Kudos not found' });
    }

    // Log moderation action before deletion
    await executeQuery(
      'INSERT INTO moderation_logs (kudos_id, admin_id, action, reason) VALUES (?, ?, ?, ?)',
      [id, admin_id, 'delete', reason]
    );

    // Delete kudos
    await executeQuery('DELETE FROM kudos WHERE id = ?', [id]);

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete kudos' });
  }
}

export async function getModerationLogs(req: AuthRequest, res: Response) {
  try {
    const skip = parseInt(req.query.skip as string) || 0;
    const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);

    const sql = `
      SELECT ml.*, a.username as admin_username, k.message as kudos_message
      FROM moderation_logs ml
      JOIN users a ON ml.admin_id = a.id
      LEFT JOIN kudos k ON ml.kudos_id = k.id
      ORDER BY ml.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const results = await executeQuery(sql, [limit, skip]);

    res.status(200).json({ logs: results, total: results.length });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch moderation logs' });
  }
}
