import express from 'express';
import { createUser } from '../controllers/userController';
import validateRequest from '../middlewares/validateRequest';
import { createUserSchema } from '../validators/userValidator';

const router = express.Router();

router.post('/', validateRequest(createUserSchema), createUser);

export default router;
