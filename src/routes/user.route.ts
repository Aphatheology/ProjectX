import { Router } from "express";
import validate from '../middlewares/validate';
import * as userValidation from '../validations/user.validation'
import * as userController from '../controllers/user.controller'

const router = Router();


router
  .route("/")
  .get(userController.getProfile);

export default router;
