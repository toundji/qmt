/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Office } from 'src/entities/office.entity';
import { OfficeDto } from 'src/dto/office.dto';
import { UpdateOfficeDto } from 'src/dto/update-office.dto';
import { OfficeStatus } from 'src/enums/office-status';

@Injectable()
export class OfficeService {
  constructor(  @InjectRepository(Office)  private officeRepository: Repository<Office>){}
  create(createOfficeDto: OfficeDto) {
    return this.officeRepository.save(createOfficeDto);
  }

  createAll(createOfficeDto: OfficeDto[]) {
      return this.officeRepository.save(createOfficeDto).catch((error)=>{  console.log(error);
        throw new BadRequestException("Les données que nous avons réçues ne sont celles que  nous espérons");
      });
  }

  findAll() {
    return this.officeRepository.find();
  }


  findOne(id: number) {
    return this.officeRepository.findOneOrFail({where:{id:id}}).catch((error)=>{
      console.log(error)
      throw new NotFoundException("Le office spécifié n'existe pas");
    });
  }
  
  findByStatus(status: OfficeStatus):Promise<Office[]>{
    return this.officeRepository.find({where:{status: status}});
  }

  findByName(name: string):Promise<Office>{
    return this.officeRepository.find({where:{name: name }}).then((list)=>{
        if(list && list.length>0)return list[0];
        throw new NotFoundException("Caisse non trouvée");
    }).catch((error)=>{
        throw new InternalServerErrorException("Problème de récupareation de la caisse");
    });
  }

  update(id: number, updateOfficeDto: UpdateOfficeDto) {
    return this.officeRepository.update(id, updateOfficeDto).catch((error)=>{
      console.log(error);
      throw new BadRequestException(
        "Les données que nous avons réçues ne sont celles que  nous espérons",
      );
    });
  }

  remove(id: number) {
    return this.officeRepository.delete(id).catch((error)=>{
      throw new BadRequestException(
        "Les office indiqué n'existe pas",
      );
    });
  }

  async init():Promise<Office[]>{
    let offices: Office[] = await this.findAll();
    if(!offices || offices.length == 0){
      const list=[
        {
          name: "Cise I",
          description:"La caisse à droite"
        },{
          name: "Caise II",
          description:"La caisse du milieu"
        },{
          name: "Caise III",
          description:"La caisse à gauche"
        }
      ];
      offices = this.officeRepository.create(list);
      return await this.officeRepository.save(offices).catch(error=>{
        console.log(error);
        throw new InternalServerErrorException();
      });
    }
    return offices;
  }

 

}
