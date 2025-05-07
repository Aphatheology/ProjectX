import { Router } from "express";
import validate from '../middlewares/validate';
import * as permissionValidation from '../validations/permission.validation';
import * as permissionController from '../controllers/permission.controller';
import { authenticate, requirePermission, requireSuperAdmin } from '../middlewares/authenticate';

const router = Router();

router
  .route("/")
  .get(authenticate, requirePermission('VIEW_ROLE_PERMISSION'), permissionController.getAllPermissions)
  .post(authenticate, requireSuperAdmin, validate(permissionValidation.createPermission), permissionController.createPermission);

router
  .route("/:id")
  .get(authenticate, requirePermission('VIEW_ROLE_PERMISSION'), permissionController.getPermissionById)
  .put(authenticate, requireSuperAdmin, validate(permissionValidation.updatePermission), permissionController.updatePermission)
  .delete(authenticate, requireSuperAdmin, permissionController.deletePermission);

export default router;