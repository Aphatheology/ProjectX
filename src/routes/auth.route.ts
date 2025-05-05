import { Router } from "express";
import validate from '../middlewares/validate';
import * as userValidation from '../validations/user.validation'
import * as authController from '../controllers/auth.controller'

const router = Router();

router
  .route("/register")
  .post(validate(userValidation.register), authController.register);

router
  .route("/login")
  .post(validate(userValidation.login), authController.login);


export default router;
