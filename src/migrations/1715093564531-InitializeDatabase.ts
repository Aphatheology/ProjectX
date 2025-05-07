import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class InitializeDatabase1715093564531 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create users table
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
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
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "100",
                    },
                    {
                        name: "owner_id",
                        type: "uuid",
                    },
                ],
            }),
            true
        );

        // Create permissions table
        await queryRunner.createTable(
            new Table({
                name: "permissions",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "50",
                        isUnique: true,
                    },
                    {
                        name: "description",
                        type: "varchar",
                        isNullable: true,
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
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "50",
                    },
                    {
                        name: "description",
                        type: "varchar",
                        isNullable: true,
                    },
                    {
                        name: "company_id",
                        type: "uuid",
                    },
                ],
            }),
            true
        );

        // Create role_permissions table
        await queryRunner.createTable(
            new Table({
                name: "role_permissions",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "role_id",
                        type: "uuid",
                    },
                    {
                        name: "permission_id",
                        type: "uuid",
                    },
                ],
            }),
            true
        );

        // Create inventory_items table
        await queryRunner.createTable(
            new Table({
                name: "inventory_items",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
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
                        default: "now()",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );

        // Add foreign key: users.role_id -> roles.id
        await queryRunner.createForeignKey(
            "users",
            new TableForeignKey({
                columnNames: ["role_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "roles",
                onDelete: "SET NULL",
            })
        );

        // Add foreign key: companies.owner_id -> users.id
        await queryRunner.createForeignKey(
            "companies",
            new TableForeignKey({
                columnNames: ["owner_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "users",
                onDelete: "CASCADE",
            })
        );

        // Add foreign key: roles.company_id -> companies.id
        await queryRunner.createForeignKey(
            "roles",
            new TableForeignKey({
                columnNames: ["company_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "companies",
                onDelete: "CASCADE",
            })
        );

        // Add foreign key: role_permissions.role_id -> roles.id
        await queryRunner.createForeignKey(
            "role_permissions",
            new TableForeignKey({
                columnNames: ["role_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "roles",
                onDelete: "CASCADE",
            })
        );

        // Add foreign key: role_permissions.permission_id -> permissions.id
        await queryRunner.createForeignKey(
            "role_permissions",
            new TableForeignKey({
                columnNames: ["permission_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "permissions",
                onDelete: "CASCADE",
            })
        );

        // Add foreign key: inventory_items.company_id -> companies.id
        await queryRunner.createForeignKey(
            "inventory_items",
            new TableForeignKey({
                columnNames: ["company_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "companies",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop foreign keys first to avoid dependency conflicts
        await queryRunner.dropForeignKey("inventory_items", "FK_inventory_items_company_id");
        await queryRunner.dropForeignKey("role_permissions", "FK_role_permissions_permission_id");
        await queryRunner.dropForeignKey("role_permissions", "FK_role_permissions_role_id");
        await queryRunner.dropForeignKey("roles", "FK_roles_company_id");
        await queryRunner.dropForeignKey("companies", "FK_companies_owner_id");
        await queryRunner.dropForeignKey("users", "FK_users_role_id");

        // Drop tables in reverse order
        await queryRunner.dropTable("inventory_items");
        await queryRunner.dropTable("role_permissions");
        await queryRunner.dropTable("roles");
        await queryRunner.dropTable("permissions");
        await queryRunner.dropTable("companies");
        await queryRunner.dropTable("users");
    }
}