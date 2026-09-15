import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { getTodos, createTodo } from '../controllers/todoController.js';
import { validateRegister, validateLogin, validateTodo } from '../middlewares/validator.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = Router();

// AUTHENTICATION ROUTES
router.post('/auth/register', validateRegister, register);
router.post('/auth/login', validateLogin, login);

// TODO ROUTES (Protected)
router.get('/todos', verifyToken, getTodos);
router.post('/todos', verifyToken, validateTodo, createTodo);

export default router;