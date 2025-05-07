import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import InventoryService from "../services/inventory.service";
import { sendSuccess } from "../utils/apiResponse";
import catchAsync from 'utils/catchAsync';

const inventoryService = new InventoryService();

export const getAllInventoryItems = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const companyId = req.query.companyId as string;
  const inventoryItems = await inventoryService.getAllInventoryItems(companyId);
  sendSuccess(res, StatusCodes.OK, "Inventory items fetched successfully", inventoryItems);
});

export const getInventoryItemById = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const itemId = req.params.id;
  const inventoryItem = await inventoryService.getInventoryItemById(itemId);
  sendSuccess(res, StatusCodes.OK, "Inventory item fetched successfully", inventoryItem);
});

export const createInventoryItem = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const inventoryData = req.body;
  
  // If no companyId is provided in the request body, use the user's company
  if (!inventoryData.companyId && (req as any).user?.companyId) {
    inventoryData.companyId = (req as any).user.companyId;
  }
  
  const newInventoryItem = await inventoryService.createInventoryItem(inventoryData);
  sendSuccess(res, StatusCodes.CREATED, "Inventory item created successfully", newInventoryItem);
});

export const updateInventoryItem = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const itemId = req.params.id;
  const inventoryData = req.body;
  const updatedInventoryItem = await inventoryService.updateInventoryItem(itemId, inventoryData);
  sendSuccess(res, StatusCodes.OK, "Inventory item updated successfully", updatedInventoryItem);
});

export const deleteInventoryItem = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const itemId = req.params.id;
  await inventoryService.deleteInventoryItem(itemId);
  sendSuccess(res, StatusCodes.OK, "Inventory item deleted successfully");
});

export const updateInventoryQuantity = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const itemId = req.params.id;
  const { quantityChange } = req.body;
  
  if (typeof quantityChange !== 'number') {
    sendSuccess(res, StatusCodes.BAD_REQUEST, "Quantity change must be a number");
    return;
  }
  
  const updatedInventoryItem = await inventoryService.updateInventoryQuantity(itemId, quantityChange);
  sendSuccess(res, StatusCodes.OK, "Inventory quantity updated successfully", updatedInventoryItem);
});