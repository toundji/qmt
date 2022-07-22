/* eslint-disable prettier/prettier */
import { BeforeInsert, Column, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuidv4 } from 'uuid';
import { hash } from 'bcrypt';
import { Audit } from "./audit";
import { Genre } from 'src/enums/genre';
import { Exclude } from 'class-transformer';
import { RoleName } from 'src/enums/role-name';


@Entity("users")
export class User extends Audit{
  static entityName  = "users";

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  firstname: string;

  @Column({ nullable: false })
  lastname: string;

  @Column({nullable:true})
  gender: Genre;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({nullable:true})
  @Index({ unique: true, where: "email IS NOT NULL" })
  email: string;

  @Column({nullable:true})
  birth_date: Date;

  @Column({unique:true, nullable:false})
  phone: string;

  @Column({ nullable: false, unique: true })
  code?: string = uuidv4();

  @Column({nullable:true})
  profile_image: string;

  @Column("simple-array",{default: [RoleName.AGENT]})
  roles?: RoleName[];

  @BeforeInsert()  async hashPassword() {
    this.email = this.email?.toLowerCase()?.trim();
    this.phone = this.phone?.trim();
    this.password = await hash(this.password, 10);  
  }
}
