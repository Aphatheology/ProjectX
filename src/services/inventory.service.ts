import { AppDataSource } from '../config/database';
import { InventoryItem } from '../entities/InventoryItem';
import { StatusCodes } from "http-status-codes";
import ApiError from '../utils/apiError';
import { User } from 'entities/User';
import UserService from './user.service';

export default class InventoryService {
  private inventoryRepository = AppDataSource.getRepository(InventoryItem);
  private userService = new UserService();

  async getAllInventoryItems(companyId?: string): Promise<InventoryItem[]> {
    const query = this.inventoryRepository.createQueryBuilder("inventory")
      .leftJoinAndSelect("inventory.company", "company");
    
    if (companyId) {
      query.where("inventory.companyId = :companyId", { companyId });
    }
    
    return query.getMany();
  }

  async getInventoryItemById(id: string): Promise<InventoryItem> {
    const inventoryItem = await this.inventoryRepository.findOne({
      where: { id },
      relations: ["company"]
    });

    if (!inventoryItem) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Inventory item not found");
    }

    return inventoryItem;
  }

  async getInventoryItemBySku(sku: string): Promise<InventoryItem | null> {
    return this.inventoryRepository.findOne({
      where: { sku },
      relations: ["company"]
    });
  }

  async createInventoryItem(currentUserId: string, inventoryData: Partial<InventoryItem>): Promise<InventoryItem> {
    if (!inventoryData.companyId ) {
      inventoryData.companyId = (await this.userService.getProfile(currentUserId)).role.companyId;
    } 
    // Check if SKU is unique
    if (inventoryData.sku) {
      const existingItem = await this.getInventoryItemBySku(inventoryData.sku);
      if (existingItem) {
        throw new ApiError(StatusCodes.CONFLICT, "Inventory item with this SKU already exists");
      }
    }

    const newInventoryItem = this.inventoryRepository.create(inventoryData);
    return this.inventoryRepository.save(newInventoryItem);
  }

  async updateInventoryItem(id: string, inventoryData: Partial<InventoryItem>): Promise<InventoryItem> {
    const inventoryItem = await this.getInventoryItemById(id);

    // Check if SKU is being updated and if it's unique
    if (inventoryData.sku && inventoryData.sku !== inventoryItem.sku) {
      const existingItem = await this.getInventoryItemBySku(inventoryData.sku);
      if (existingItem) {
        throw new ApiError(StatusCodes.CONFLICT, "Inventory item with this SKU already exists");
      }
    }

    Object.assign(inventoryItem, inventoryData);
    return this.inventoryRepository.save(inventoryItem);
  }

  async deleteInventoryItem(id: string): Promise<void> {
    const inventoryItem = await this.getInventoryItemById(id);
    await this.inventoryRepository.remove(inventoryItem);
  }

  async updateInventoryQuantity(id: string, quantityChange: number): Promise<InventoryItem> {
    const inventoryItem = await this.getInventoryItemById(id);
    
    const newQuantity = inventoryItem.quantity + quantityChange;
    if (newQuantity < 0) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Insufficient inventory quantity");
    }
    
    inventoryItem.quantity = newQuantity;
    return this.inventoryRepository.save(inventoryItem);
  }
}
