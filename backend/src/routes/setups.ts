import express, { Request, Response } from 'express';
import { query } from '../db/connection';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.get('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const result = await query(
      'SELECT * FROM pc_setups WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setups' });
  }
});

router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Setup name required' });
    }
    const result = await query(
      'INSERT INTO pc_setups (user_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create setup' });
  }
});

router.get('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM pc_setups WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setup not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setup' });
  }
});

router.put('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const result = await query(
      'UPDATE pc_setups SET name = $1, description = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setup not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setup' });
  }
});

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM pc_setups WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Setup not found' });
    }
    res.json({ message: 'Setup deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete setup' });
  }
});

export default router;
