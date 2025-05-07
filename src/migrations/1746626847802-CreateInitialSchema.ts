import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateInitialSchema1746626847802 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "permissions",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
            isUnique: true,
          },
          {
            name: "description",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create roles table
    await queryRunner.createTable(
      new Table({
        name: "roles",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "100",
            isUnique: true,
          },
          {
            name: "description",
            type: "varchar",
            length: "255",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create role_permissions junction table
    await queryRunner.createTable(
      new Table({
        name: "role_permissions",
        columns: [
          {
            name: "role_id",
            type: "uuid",
          },
          {
            name: "permission_id",
            type: "uuid",
          },
        ],
        indices: [
          {
            name: "IDX_RP_ROLE_ID",
            columnNames: ["role_id"],
          },
          {
            name: "IDX_RP_PERMISSION_ID",
            columnNames: ["permission_id"],
          },
        ],
        uniques: [
          {
            name: "UQ_role_permission",
            columnNames: ["role_id", "permission_id"],
          },
        ],
      }),
      true
    );

    // Create companies table
    await queryRunner.createTable(
      new Table({
        name: "companies",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
            length: "150",
          },
          {
            name: "owner_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Create users table
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "full_name",
            type: "varchar",
            length: "100",
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "password",
            type: "varchar",
          },
          {
            name: "is_super_admin",
            type: "boolean",
            default: false,
          },
          {
            name: "role_id",
            type: "uuid",
            isNullable: true,
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Inside the up method of your migration file
    // Add this after the other tables are created

    // Create inventory_items table
    await queryRunner.createTable(
      new Table({
        name: "inventory_items",
        columns: [
          {
            name: "id",
            type: "uuid",
            isPrimary: true,
            default: "uuid_generate_v4()",
          },
          {
            name: "name",
            type: "varchar",
          },
          {
            name: "description",
            type: "varchar",
            isNullable: true,
          },
          {
            name: "price",
            type: "decimal",
            precision: 10,
            scale: 2,
            default: 0,
          },
          {
            name: "quantity",
            type: "int",
            default: 0,
          },
          {
            name: "sku",
            type: "varchar",
            isUnique: true,
          },
          {
            name: "company_id",
            type: "uuid",
          },
          {
            name: "created_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
          {
            name: "updated_at",
            type: "timestamp",
            default: "CURRENT_TIMESTAMP",
          },
        ],
      }),
      true
    );

    // Add unique constraint with custom name for SKU
    await queryRunner.createIndex(
      "inventory_items",
      new TableIndex({
        name: "UQ_inventory_item_sku",
        columnNames: ["sku"],
        isUnique: true,
      })
    );

    // Add foreign key for company relationship
    await queryRunner.createForeignKey(
      "inventory_items",
      new TableForeignKey({
        name: "FK_inventory_item_company",
        columnNames: ["company_id"],
        referencedTableName: "companies",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    // Add email unique constraint with custom name
    await queryRunner.createIndex(
      "users",
      new TableIndex({
        name: "UQ_user_email",
        columnNames: ["email"],
        isUnique: true,
      })
    );

    // Add foreign keys
    await queryRunner.createForeignKey(
      "users",
      new TableForeignKey({
        name: "FK_user_role",
        columnNames: ["role_id"],
        referencedTableName: "roles",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "companies",
      new TableForeignKey({
        name: "FK_company_owner",
        columnNames: ["owner_id"],
        referencedTableName: "users",
        referencedColumnNames: ["id"],
        onDelete: "SET NULL",
      })
    );

    await queryRunner.createForeignKey(
      "role_permissions",
      new TableForeignKey({
        name: "FK_role_permission_role",
        columnNames: ["role_id"],
        referencedTableName: "roles",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "role_permissions",
      new TableForeignKey({
        name: "FK_role_permission_permission",
        columnNames: ["permission_id"],
        referencedTableName: "permissions",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      })
    );

    // Create UUID extension if not exists
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("role_permissions", "FK_role_permission_permission");
    await queryRunner.dropForeignKey("role_permissions", "FK_role_permission_role");
    await queryRunner.dropForeignKey("companies", "FK_company_owner");
    await queryRunner.dropForeignKey("users", "FK_user_role");

    // Drop indices
    await queryRunner.dropIndex("users", "UQ_user_email");

    // Drop tables
    await queryRunner.dropTable("users");
    await queryRunner.dropTable("companies");
    await queryRunner.dropTable("role_permissions");
    await queryRunner.dropTable("roles");
    await queryRunner.dropTable("permissions");

    await queryRunner.dropForeignKey("inventory_items", "FK_inventory_item_company");
    await queryRunner.dropIndex("inventory_items", "UQ_inventory_item_sku");
    await queryRunner.dropTable("inventory_items");
  }

}
