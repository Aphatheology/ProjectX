import { DataSource } from 'typeorm';
import { User } from '../entities/User';
import { Role } from '../entities/Role';
import { Permission } from '../entities/Permission';
import { RolePermission } from '../entities/RolePermission';
import { Company } from '../entities/Company';
import config from './config';
import logger from './logger';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: config.db.host,
  port: config.db.port,
  username: config.db.username,
  password: config.db.password,
  database: config.db.name,
  synchronize: config.env !== 'production',
  logging: config.env !== 'production',
  entities: [User, Role, Permission, RolePermission, Company],
  migrations: [],
  subscribers: [],
});

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    logger.info('Database connection initialized');

    await seedDefaultPermissions();
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
    { name: 'MANAGE_INVENTORY', description: 'Can manage inventory items' },
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