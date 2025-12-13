import { Router } from 'express';
import { inventoryController } from '../controllers/inventory.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validate } from '../middleware/validation.middleware';
import { purchaseSchema, restockSchema } from '../utils/validators';

const router = Router();

/**
 * @route   POST /api/sweets/:id/purchase
 * @desc    Purchase a sweet
 * @access  Private
 */
router.post(
  '/:id/purchase',
  authenticate,
  validate(purchaseSchema),
  inventoryController.purchaseSweet
);

/**
 * @route   POST /api/sweets/:id/restock
 * @desc    Restock a sweet
 * @access  Private (Admin only)
 */
router.post(
  '/:id/restock',
  authenticate,
  requireAdmin,
  validate(restockSchema),
  inventoryController.restockSweet
);

/**
 * @route   GET /api/inventory/purchases
 * @desc    Get user's purchase history
 * @access  Private
 */
router.get(
  '/purchases',
  authenticate,
  inventoryController.getPurchaseHistory
);

/**
 * @route   GET /api/inventory/restocks/:id
 * @desc    Get restock history for a sweet
 * @access  Private (Admin only)
 */
router.get(
  '/restocks/:id',
  authenticate,
  requireAdmin,
  inventoryController.getRestockHistory
);

/**
 * @route   GET /api/inventory/low-stock
 * @desc    Get low stock sweets
 * @access  Private (Admin only)
 */
router.get(
  '/low-stock',
  authenticate,
  requireAdmin,
  inventoryController.getLowStockSweets
);

export default router;