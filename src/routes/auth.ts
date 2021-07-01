import { Router } from 'express';
import AuthController from '../controller/AuthController';
import { checkJwt } from '../middleware/jwt';
import { chechRole } from '../middleware/role';

const router = Router();

//Login
router.post('/login', AuthController.login);

//Change password
router.post('/change-password', [checkJwt, chechRole(['admin', 'user'])], AuthController.changePassword);

export default router;