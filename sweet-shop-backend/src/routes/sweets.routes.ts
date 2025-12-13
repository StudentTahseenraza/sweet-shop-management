import { Router } from 'express';
import { sweetsController } from '../controllers/sweets.controller';
import { authenticate } from '../middleware/auth.middleware';
import { requireAdmin } from '../middleware/admin.middleware';
import { validate, validateQuery } from '../middleware/validation.middleware';
import { 
  sweetCreateSchema, 
  sweetUpdateSchema, 
  searchSchema 
} from '../utils/validators';

const router = Router();

/**
 * @route   GET /api/sweets
 * @desc    Get all sweets
 * @access  Public
 */
router.get('/', sweetsController.getAllSweets);

/**
 * @route   GET /api/sweets/search
 * @desc    Search sweets with filters
 * @access  Public
 */
router.get('/search', validateQuery(searchSchema), sweetsController.searchSweets);

/**
 * @route   GET /api/sweets/categories
 * @desc    Get all sweet categories
 * @access  Public
 */
router.get('/categories', sweetsController.getCategories);

/**
 * @route   GET /api/sweets/:id
 * @desc    Get sweet by ID
 * @access  Public
 */
router.get('/:id', sweetsController.getSweetById);

/**
 * @route   POST /api/sweets
 * @desc    Create a new sweet
 * @access  Private (Admin only)
 */
router.post(
  '/',
  authenticate,
  requireAdmin,
  validate(sweetCreateSchema),
  sweetsController.createSweet
);

/**
 * @route   PUT /api/sweets/:id
 * @desc    Update a sweet
 * @access  Private (Admin only)
 */
router.put(
  '/:id',
  authenticate,
  requireAdmin,
  validate(sweetUpdateSchema),
  sweetsController.updateSweet
);

/**
 * @route   DELETE /api/sweets/:id
 * @desc    Delete a sweet
 * @access  Private (Admin only)
 */
router.delete(
  '/:id',
  authenticate,
  requireAdmin,
  sweetsController.deleteSweet
);

export default router;