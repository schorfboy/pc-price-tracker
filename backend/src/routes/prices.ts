import express, { Request, Response } from 'express';
import { query } from '../db/connection';

const router = express.Router();

router.get('/:componentId', async (req: Request, res: Response) => {
  try {
    const { componentId } = req.params;
    const result = await query(
      'SELECT * FROM price_history WHERE component_id = $1 ORDER BY recorded_at DESC LIMIT 30',
      [componentId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch price history' });
  }
});

router.get('/:componentId/lowest', async (req: Request, res: Response) => {
  try {
    const { componentId } = req.params;
    const result = await query(
      `SELECT shop, price, shop_url, recorded_at FROM price_history 
       WHERE component_id = $1 ORDER BY recorded_at DESC, price ASC LIMIT 1`,
      [componentId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'No price data found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch lowest price' });
  }
});

export default router;
