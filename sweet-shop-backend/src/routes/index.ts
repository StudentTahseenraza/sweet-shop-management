import { Router } from 'express';
import authRoutes from './auth.routes';
import sweetsRoutes from './sweets.routes';
import inventoryRoutes from './inventory.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/sweets', sweetsRoutes);
router.use('/inventory', inventoryRoutes);

export default router;