import { Router } from 'express';
import { UserController } from '../controller/UserController';
import { checkJwt } from '../middleware/jwt';
import { chechRole } from '../middleware/role';

const router = Router();

//Get all users
router.get('/', [checkJwt, chechRole(['admin', 'user'])], UserController.getAll);

//Get one user
router.get('/:id', [checkJwt, chechRole(['admin', 'user'])], UserController.getById);

//Create a new ser
router.post('/', [checkJwt, chechRole(['admin', 'user'])], UserController.newUser);

//Update user
router.put('/:id', [checkJwt, chechRole(['admin', 'user'])], UserController.editUser);

//Delete user
router.delete('/:id', [checkJwt, chechRole(['admin', 'user'])], UserController.deleteUser);

export default router;