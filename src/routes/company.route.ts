import { Router } from 'express';
import validate from '../middlewares/validate';
import * as companyValidation from '../validations/company.validation';
import * as companyController from '../controllers/company.controller';
import { auth } from '../middlewares/auth';

const router = Router();

router
  .route('/')
  .post(
    auth('__all_company_permissions__'),
    validate(companyValidation.createCompany),
    companyController.createCompany
  );

router
  .route('/:companyId')
  .get(
    auth('__manage_companies__', '__all_company_permissions__'),
    validate(companyValidation.companyId),
    companyController.getCompanyById
  )
  .patch(
    auth('__manage_companies__'),
    validate(companyValidation.updateCompany),
    companyController.updateCompany
  )
  .delete(
    auth('__manage_companies__'),
    validate(companyValidation.companyId),
    companyController.deleteCompany
  );

export default router;
