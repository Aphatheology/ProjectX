import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Company } from "./Company";

@Entity("inventory_items")
export class InventoryItem {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  price: number;

  @Column({ default: 0 })
  quantity: number;

  @Column({ name: "sku", unique: true })
  sku: string;

  @Column({ name: "company_id" })
  companyId: string;

  @ManyToOne(() => Company, company => company.inventoryItems)
  @JoinColumn({ name: "company_id" })
  company: Company;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
