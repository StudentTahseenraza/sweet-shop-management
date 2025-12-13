import { Router } from 'express';
import { sweetsController } from '../controllers/sweets.controller';
import { inventoryController } from '../controllers/inventory.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { 
  sweetCreateSchema, 
  sweetUpdateSchema, 
  searchSchema,
  purchaseSchema,
  restockSchema
} from '../utils/validators';

const router = Router();

router.get('/', sweetsController.getAllSweets);
router.get('/search', validateQuery(searchSchema), sweetsController.searchSweets);
router.get('/categories', sweetsController.getCategories);
router.get('/:id', sweetsController.getSweetById);

router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(sweetCreateSchema),
  sweetsController.createSweet
);

router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate(sweetUpdateSchema),
  sweetsController.updateSweet
);

router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  sweetsController.deleteSweet
);

router.post(
  '/:id/purchase',
  authenticate,
  validate(purchaseSchema),
  inventoryController.purchaseSweet
);

router.post(
  '/:id/restock',
  authenticate,
  requireAdmin,
  validate(restockSchema),
  inventoryController.restockSweet
);

export default router;