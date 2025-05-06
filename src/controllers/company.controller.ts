import { Response } from "express";
import catchAsync from "../utils/catchAsync";
import { StatusCodes } from "http-status-codes";
import CompanyService from "../services/company.service";
import { sendSuccess } from "../utils/apiResponse";
import { CustomRequest } from "../middlewares/auth";

const companyService = new CompanyService();

export const createCompany = catchAsync(async (req: CustomRequest, res: Response) => {
  const { name } = req.body;
  const company = await companyService.createCompany(name, req.user!.id);
  sendSuccess(res, StatusCodes.CREATED, "Company created successfully", company);
});

// export const getCompanies = catchAsync(async (_req: CustomRequest, res: Response) => {
//   const companies = await companyService.getCompanies();
//   sendSuccess(res, StatusCodes.OK, "Companies fetched successfully", companies);
// });

export const getCompanyById = catchAsync(async (req: CustomRequest, res: Response) => {
  const company = await companyService.getCompanyById(Number(req.params.companyId));
  sendSuccess(res, StatusCodes.OK, "Company fetched successfully", company);
});

export const updateCompany = catchAsync(async (req: CustomRequest, res: Response) => {
  const company = await companyService.updateCompany(Number(req.params.companyId), req.body);
  sendSuccess(res, StatusCodes.OK, "Company updated successfully", company);
});

export const deleteCompany = catchAsync(async (req: CustomRequest, res: Response) => {
  const company = await companyService.deleteCompany(Number(req.params.companyId));
  sendSuccess(res, StatusCodes.OK, "Company deleted successfully", company);
});
