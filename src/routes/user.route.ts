import { Router } from "express";
import validate from '../middlewares/validate';
import * as userValidation from '../validations/user.validation'
import * as userController from '../controllers/user.controller'
import { authenticate, requireSuperAdmin } from '../middlewares/authenticate';

const router = Router();


router
  .route("/")
  .get(authenticate, userController.getProfile)
  .post(authenticate, requireSuperAdmin, validate(userValidation.createUser),userController.createUser);

export default router;
