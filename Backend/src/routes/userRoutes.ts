import express from 'express';
import { createUser, loginUser } from '../controllers/userController';
import validateRequest from '../middlewares/validateRequest';
import { createUserSchema, loginUserSchema } from '../validators/userValidator';

const router = express.Router();

router.post('/register', validateRequest(createUserSchema), createUser);
router.post('/login', validateRequest(loginUserSchema), loginUser);

export default router;
