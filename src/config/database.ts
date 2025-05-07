import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { RolePermission } from '../entities/RolePermission';
import { Company } from '../entities/Company';
import config from './config';
import logger from './logger';
import { InventoryItem } from '../entities/InventoryItem';

export const AppDataSource = new DataSource({
  type: config.db.type,
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.name,
  synchronize: false,
  logging: config.env !== 'production',
  entities: [User, Role, Permission, RolePermission, Company, InventoryItem],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();

    await seedDefaultPermissions();
    logger.info('Database connection initialized and seeded successfully');
  } catch (error) {
    logger.error('Error initializing database connection:', error);
    throw error;
  }
};

export const closeDatabase = async () => {
  try {
    await AppDataSource.destroy();
    logger.info('Database connection closed');
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
};

const seedDefaultPermissions = async () => {
  const permissionRepository = AppDataSource.getRepository(Permission);

  const defaultPermissions = [
    { name: 'CREATE_USER', description: 'Can create new users' },
    { name: 'READ_USER', description: 'Can view user details' },
    { name: 'UPDATE_USER', description: 'Can update user details' },
    { name: 'DELETE_USER', description: 'Can delete users' },
    { name: 'VIEW_ROLE_PERMISSION', description: 'Can view roles and permissions' },
    { name: 'ASSIGN_ROLE_PERMISSION', description: 'Can assign permissions to roles' },
    { name: 'DELETE_ROLE_PERMISSION', description: 'Can delete permissions from roles' },
    { name: 'READ_INVENTORY', description: 'Can view inventory items' },
    { name: 'CREATE_INVENTORY', description: 'Can create or update inventory items' },
    { name: 'DELETE_INVENTORY', description: 'Can delete inventory items' },
    { name: 'PROCESS_CHECKOUT', description: 'Can process customer checkout' },
    { name: 'VIEW_REPORTS', description: 'Can view business reports' },
  ];

  for (const permission of defaultPermissions) {
    const existingPermission = await permissionRepository.findOneBy({ name: permission.name });
    if (!existingPermission) {
      await permissionRepository.save(permissionRepository.create(permission));
    }
  }
};