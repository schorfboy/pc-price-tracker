import express, { Request, Response } from 'express';
import { query } from '../db/connection';
import { verifyToken } from '../middleware/auth';

const router = express.Router();

router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q, category } = req.query;
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }
    let sql = 'SELECT * FROM component_database WHERE name ILIKE $1';
    const params: any[] = [`%${q}%`];
    if (category) {
      sql += ' AND category = $2';
      params.push(category);
    }
    sql += ' LIMIT 20';
    const result = await query(sql, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

router.post('/', verifyToken, async (req: Request, res: Response) => {
  try {
    const { setup_id, name, category, product_url } = req.body;
    if (!setup_id || !name || !category) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await query(
      'INSERT INTO components (setup_id, name, category, product_url) VALUES ($1, $2, $3, $4) RETURNING *',
      [setup_id, name, category, product_url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add component' });
  }
});

router.get('/setup/:setupId', async (req: Request, res: Response) => {
  try {
    const { setupId } = req.params;
    const result = await query(
      'SELECT * FROM components WHERE setup_id = $1 ORDER BY created_at DESC',
      [setupId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch components' });
  }
});

router.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('DELETE FROM components WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Component not found' });
    }
    res.json({ message: 'Component deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete component' });
  }
});

export default router;
