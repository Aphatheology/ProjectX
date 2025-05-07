import { Router, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { sendError } from './utils/apiResponse';
import authRoute from './routes/auth.route';
import userRoute from './routes/user.route';
// import companyRoute from './routes/company.route';
import roleRoute from './routes/role.route';
import permissionRoute from './routes/permission.route';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
// router.use('/companies', companyRoute);
router.use('/roles', roleRoute);
router.use('/permissions', permissionRoute);

router.use('*error', (req: Request, res: Response) => {
  sendError(res, StatusCodes.NOT_FOUND, 'Route Not found');
});

export default router;
