// import { Router } from 'express';
// import { auth } from '../middlewares/auth';
// import validate from '../middlewares/validate';
// import * as permissionValidation from '../validations/permission.validation';
// import * as permissionController from '../controllers/permission.controller';

// const router = Router();

// router.post(
//   '/',
//   auth('__all_company_permissions__'),
//   validate(permissionValidation.createPermission),
//   permissionController.createPermission
// );

// router.get(
//   '/',
//   auth(), 
//   validate(permissionValidation.getPermissions),
//   permissionController.getPermissions
// );

// export default router;
