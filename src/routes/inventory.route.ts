import { Router } from "express";
import validate from "../middlewares/validate";
import * as inventoryValidation from "../validations/inventory.validation";
import * as inventoryController from "../controllers/inventory.controller";
import { authenticate, requirePermission } from "../middlewares/authenticate";

const router = Router();

router
  .route("/")
  .get(
    authenticate,
    requirePermission("READ_INVENTORY"),
    inventoryController.getAllInventoryItems
  )
  .post(
    authenticate,
    requirePermission("CREATE_INVENTORY"),
    validate(inventoryValidation.createInventoryItem),
    inventoryController.createInventoryItem
  );

router
  .route("/:id")
  .get(
    authenticate,
    requirePermission("READ_INVENTORY"),
    validate(inventoryValidation.getInventoryById),
    inventoryController.getInventoryItemById
  )
  .put(
    authenticate,
    requirePermission("CREATE_INVENTORY"),
    validate(inventoryValidation.updateInventoryItem),
    inventoryController.updateInventoryItem
  )
  .delete(
    authenticate,
    requirePermission("DELETE_INVENTORY"),
    validate(inventoryValidation.getInventoryById),
    inventoryController.deleteInventoryItem
  );

router
  .route("/:id/quantity")
  .patch(
    authenticate,
    requirePermission("CREATE_INVENTORY"),
    validate(inventoryValidation.updateInventoryQuantity),
    inventoryController.updateInventoryQuantity
  );

export default router;