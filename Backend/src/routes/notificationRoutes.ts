import express from 'express';
import { createNotification } from '../controllers/notificationController';
import validateRequest from '../middlewares/validateRequest';
import { createNotificationSchema } from '../validators/notificationValidator';

const router = express.Router();

router.post('/', validateRequest(createNotificationSchema), createNotification);

export default router;
