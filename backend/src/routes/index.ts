import { Express } from 'express';
import authRoutes from './auth';
import setupRoutes from './setups';
import componentRoutes from './components';
import priceRoutes from './prices';
import notificationRoutes from './notifications';

export const setupRoutes = (app: Express) => {
  app.use('/api/auth', authRoutes);
  app.use('/api/setups', setupRoutes);
  app.use('/api/components', componentRoutes);
  app.use('/api/prices', priceRoutes);
  app.use('/api/notifications', notificationRoutes);
};
