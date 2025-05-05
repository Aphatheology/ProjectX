import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from './utils/apiResponse';
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);

router.use('*error', (req: Request, res: Response) => {
  sendError(res, StatusCodes.NOT_FOUND, 'Route Not found');
});

export default router;
