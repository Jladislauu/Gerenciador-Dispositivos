import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from "typeorm";

export enum DeviceStatus {
  ATIVO = "ATIVO",
  INATIVO = "INATIVO",
}

@Entity("devices")
export class Device {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 32, unique: true })
  mac!: string;

  @Column({
    type: "enum",
    enum: DeviceStatus,
    default: DeviceStatus.ATIVO,
  })
  status!: DeviceStatus;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;
}