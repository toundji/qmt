/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Constante } from '../entities/constante.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { ConstanteDto } from 'src/dto/constante-search.dto';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class ConstanteService {
  constructor(  @InjectRepository(Constante)  private constanteRepository: Repository<Constante>){}
  create(createConstanteDto: ConstanteDto) {
    return this.constanteRepository.save(createConstanteDto);
  }

  @Cron('0 0 0 * * *')
  autoResetOrder(){
    console.log("Ordre de ticket réinitialisé. Date : " +new Date());
    this.resetOrder();
  }

  createAll(createConstanteDto: ConstanteDto[]) {
      return this.constanteRepository.save(createConstanteDto).catch((error)=>{  console.log(error);
        throw new BadRequestException("Les données que nous avons réçues ne sont celles que  nous espérons");
      });
  }

  findAll() {
    return this.constanteRepository.find();
  }

  findOrder() {
    return this.constanteRepository.findOneOrFail({where:{name:"ORDER"}}).catch((error)=>{
      console.log(error)
      throw new NotFoundException("Le constante spécifié n'existe pas");
    });
  }

  async getOrder():Promise<number> {
    const order:Constante = await this.dateResetOrder();
    const value = +order.value+1;
    order.value = value+"";
    await Constante.save(order);
    return value;
  }

  async dateResetOrder():Promise<Constante>{
    const order:Constante = await this.findOrder();
    const now = new Date();
    const today =new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0);
    if(order.reset_at == null || order.reset_at != today){
      console.log(order.reset_at, today )
      console.log("condition is true");
      order.value = "0";
      order.reset_at = today;
      return   await Constante.save(order);
    }
    else{
      return order;
    }
  }

  async getNextOrder():Promise<number> {
    const order:Constante = await this.dateResetOrder();
    const value = +order.value+1;
    return value;
  }

  async resetOrder():Promise<number> {
    const order:Constante = await this.findOrder();
    order.value = "0";
    await Constante.save(order);
    return 0;
  }

  findOne(id: number) {
    return this.constanteRepository.findOneOrFail({where:{id:id}}).catch((error)=>{
      console.log(error)
      throw new NotFoundException("Le constante spécifié n'existe pas");
    });
  }

  searchFirst(search:ConstanteDto):Promise<Constante>{
    return this.constanteRepository.find({where:search}).then((list)=>{
      if(list && list.length >0){
        return list[0];
      }
      throw new NotFoundException("Aucun enrégistrement ne correspond à votre recherche")
    }).catch((error)=>{
      console.log(error);
      throw new BadRequestException("Une erreur s'est produit pendant la recherche")
    });
  }
  search(search:ConstanteDto):Promise<Constante[]>{
    return this.constanteRepository.find({where:search}).catch((error)=>{
      throw new BadRequestException("Une erreur s'est produit pendant la recherche")
    });
  }

//   update(id: number, updateConstanteDto: UpdateConstanteDto) {
//     return this.constanteRepository.update(id, updateConstanteDto).catch((error)=>{
//       console.log(error);
//       throw new BadRequestException(
//         "Les données que nous avons réçues ne sont celles que  nous espérons",
//       );
//     });
//   }

  remove(id: number) {
    return this.constanteRepository.delete(id).catch((error)=>{
      throw new BadRequestException(
        "Les constante indiqué n'existe pas",
      );
    });
  }

  async init():Promise<Constante[]>{
    let constantes: Constante[] = await this.findAll();
    const now= new Date();

    if(!constantes || constantes.length == 0){
      const list=[
        {
          name: "BANK",
          value:"ECOBANQUE"
        },{
          name: "EMAIL",
          value:"client@ecobanque.com"
        },{
          name: "ORDER",
          value:"1",
          reset_at: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0),
        },{
          name: "GLOBAL ORDER",
          value:"1"
        }
      ];
      constantes = this.constanteRepository.create(list);
      return await this.constanteRepository.save(constantes).catch(error=>{
        console.log(error);
        throw new InternalServerErrorException();
      });
    }
    return constantes;
  }
}
