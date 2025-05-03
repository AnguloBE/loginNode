import { Router } from 'express';
import { register, login, getPersonas } from '../controllers/personaController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', authMiddleware, getPersonas);

export default router;
