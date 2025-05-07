import { Router } from "express";
import validate from '../middlewares/validate';
import * as roleValidation from '../validations/role.validation';
import * as roleController from '../controllers/role.controller';
import { authenticate, requirePermission, requireSuperAdmin } from '../middlewares/authenticate';

const router = Router();

router
  .route("/")
  .get(authenticate, requireSuperAdmin, roleController.getAllRoles)
  .post(authenticate, requireSuperAdmin, validate(roleValidation.createRole), roleController.createRole);

router
  .route("/:id")
  .get(authenticate, roleController.getRoleById)
  .put(authenticate, requireSuperAdmin, validate(roleValidation.updateRole), roleController.updateRole)
  .delete(authenticate, requireSuperAdmin, validate(roleValidation.deleteRole), roleController.deleteRole);

router
  .route("/:id/permissions")
  .get(authenticate, requirePermission('VIEW_ROLE_PERMISSION'), roleController.getPermissionsByRoleId)
  .post(authenticate, requirePermission('ASSIGN_ROLE_PERMISSION'), validate(roleValidation.assignPermissions), roleController.assignPermissions);

router
  .route("/:id/permissions/:permissionId")
  .delete(authenticate, requirePermission('DELETE_ROLE_PERMISSION'), validate(roleValidation.deletePermissionFromRole), roleController.removePermission);

export default router;