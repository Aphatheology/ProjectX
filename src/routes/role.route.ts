import { Router } from 'express';
import { auth } from '../middlewares/auth';
import validate from '../middlewares/validate';
import * as roleValidation from '../validations/role.validation';
import * as roleController from '../controllers/role.controller';

const router = Router();

router
  .route('/:companyId')
  .post(
    auth('__all_company_permissions__', '__manage_roles__'),
    validate(roleValidation.createRole),
    roleController.createRole
  )
  .get(
    auth('__manage_roles__', '__all_company_permissions__'),
    validate(roleValidation.getRoles),
    roleController.getCompanyRoles
  );

router.post(
  '/permissions/:roleId',
  auth('__all_company_permissions__', '__manage_roles__'),
  validate(roleValidation.addPermissionsToRole),
  roleController.addPermissionsToRole
);

export default router;
