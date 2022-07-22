/* eslint-disable prettier/prettier */
import { ConstanteVisibility } from 'src/enums/constante-visibility';
import { Column,  Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from './audit';

@Entity("constantes")
export class Constante extends Audit {
  static  entityName  = "constantes";

  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ nullable: false})
  @Index({ unique: true, where: "status IS TRUE" })
  name: string;

  @Column({ nullable: false})
  value: string;

  @Column({default: ConstanteVisibility.PUBLIC})
  visibilite?:ConstanteVisibility;

  @Column({default:true})
  status?:boolean;

  @Column({ nullable: false})
  description?: string;

}
