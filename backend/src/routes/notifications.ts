import express, { Request, Response } from 'express';
import { query } from '../db/connection';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const result = await query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

router.post('/subscribe', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { component_id, price_drop_threshold } = req.body;
    if (!component_id) {
      return res.status(400).json({ error: 'Component ID required' });
    }
    const result = await query(
      `INSERT INTO notifications (user_id, component_id, price_drop_threshold, enabled) VALUES ($1, $2, $3, true) RETURNING *`,
      [userId, component_id, price_drop_threshold || 5.00]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      'UPDATE notifications SET enabled = false WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }
    res.json({ message: 'Notification disabled' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;
