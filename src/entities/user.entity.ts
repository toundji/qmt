/* eslint-disable prettier/prettier */
import { BeforeInsert, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';
import { Audit } from "./audit";
import { Genre } from 'src/enums/genre';
import { Exclude } from 'class-transformer';
import { RoleName } from 'src/enums/role-name';
import { Office } from "./office.entity";


@Entity("users")
export class User extends Audit{
  static entityName  = "users";

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  firstname: string;

  @Column({ nullable: true })
  lastname?: string;

  @Column({ nullable: true })
  office_name!: string;

  @Column({nullable:true})
  gender?: Genre;

  @Exclude()
  @Column({ nullable: false })
  password?: string;

  @Column({nullable:true, unique: true})
  email?: string;

  @Column({nullable:true})
  birth_date?: Date;

  @Column({nullable:true})
  @Index({ unique: true, where: "phone IS NOT NULL" })
  phone?: string;

  @Column({ nullable: false, unique: true })
  code?: string = uuidv4();

  @Column({nullable:true})
  profile_image?: string;

  @Column("simple-array",{default: [RoleName.AGENT]})
  roles?: RoleName[];

  @ManyToOne((type) => Office, {eager:true})
  @JoinColumn({ name: 'office_id'})
  office:Office;

  @BeforeInsert()  async hashPassword() {
    this.email = this.email?.toLowerCase()?.trim();
    this.phone = this.phone?.trim();
    this.password = await hash(this.password, 10);  
  }
}
