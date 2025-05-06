import { Router } from "express";
import validate from '../middlewares/validate';
import * as userValidation from '../validations/user.validation'
import * as userController from '../controllers/user.controller'
import { auth } from '../middlewares/auth';

const router = Router();


router
  .route("/")
  .get(auth(), userController.getProfile);

export default router;
