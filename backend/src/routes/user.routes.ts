import { Router } from 'express';
import { body, param } from 'express-validator';
import {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
} from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { validate } from '../middleware/validate.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Validation rules
const uuidValidation = [
  param('id').isUUID().withMessage('Invalid user ID format'),
];

const updateUserValidation = [
  param('id').isUUID().withMessage('Invalid user ID format'),
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('username')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Username must be between 3 and 100 characters'),
  body('password')
    .optional()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    ),
];

// Routes
router.get('/', getAllUsers);
router.get('/me', getCurrentUser);
router.get('/:id', validate(uuidValidation), getUserById);
router.put('/:id', validate(updateUserValidation), updateUser);
router.delete('/:id', validate(uuidValidation), deleteUser);

export default router;
