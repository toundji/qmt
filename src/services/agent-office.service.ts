/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { AgentOfficeDto } from 'src/dto/agent-service.dto';
import { AgentOffice } from 'src/entities/office-agent.entity';
import { UserService } from './user.service';
import { User } from 'src/entities/user.entity';
import { OfficeService } from './office.service';
import { Office } from 'src/entities/office.entity';
import { OfficeStatus } from 'src/enums/office-status';



@Injectable()
export class AgentOfficeService {
  constructor(  @InjectRepository(AgentOffice) 
    private agentOfficeRepository: Repository<AgentOffice>,
    private readonly userService:UserService,
    private readonly officeService:OfficeService,


  ){}
  async create(body: AgentOfficeDto) {
    if(!body.agent_id && !body.agent_code){
        throw new BadRequestException("Vous devez spécifier l'agent")
    }
    let agent:User = null;
    if(body.agent_id){
        agent = await this.userService.findOne(body.agent_id)
    }else if(body.agent_code){
        agent = await this.userService.findOneByCode(body.agent_code)
    }
    // if(agent.office){
    //     throw new BadRequestException("Agent est en garde actuellement. Vous pouvez le descendre d'abord");
    // }
    const office:Office = await this.officeService.findOne(body.office_id);
    if(office.status == OfficeStatus.OUVERT){
        throw new BadRequestException("Un agent y est actuellement. Veillez le descendre");
    }
    office.status = OfficeStatus.OUVERT;
    // agent.office = office;
    await Office.save(office);
    await User.save(agent);

    const agentOffice:AgentOffice = new AgentOffice();

    agentOffice.agent=agent;
    agentOffice.office =office;

    return await this.agentOfficeRepository.save(agentOffice);

  }


  async changeAgent(id: number) {
    const agentOffice:AgentOffice = await this.findOne(id);
    if(agentOffice.finish_date){
        throw new BadRequestException("L'agent n'est plus en garde actuellement. ");
    }
    // agentOffice.agent.office.status = OfficeStatus.FERMER;
    // await Office.save(agentOffice.agent.office);
    // agentOffice.agent.office =null;
    await User.save(agentOffice.agent);
    return agentOffice;
 }

  findAll() {
    return this.agentOfficeRepository.find();
  }


  findOne(id: number):Promise<AgentOffice> {
    return this.agentOfficeRepository.findOneOrFail({where:{id:id}}).catch((error)=>{
      console.log(error)
      throw new NotFoundException("Le ogentOffice spécifié n'existe pas");
    });
  }

  findByAgentId(id: number):Promise<AgentOffice[]> {
    return this.agentOfficeRepository.find({where:{agent:{id:id}}}).catch((error)=>{
      console.log(error)
      throw new NotFoundException("Le ogentOffice spécifié n'existe pas");
    });
  }

  findByAgentIdAndAgentId(agent_id: number, office_id:number):Promise<AgentOffice[]> {
    return this.agentOfficeRepository.find({where:{agent:{id:agent_id}, office:{id:office_id}}}).catch((error)=>{
      console.log(error)
      throw new NotFoundException("Le ogentOffice spécifié n'existe pas");
    });
  }

  findActifByAgentIdAndAgentId(agent_id: number, office_id:number):Promise<AgentOffice[]> {
    return this.agentOfficeRepository.find({where:{agent:{id:agent_id}, office:{id:office_id}, finish_date: null}}).catch((error)=>{
      console.log(error)
      throw new NotFoundException("Le ogentOffice spécifié n'existe pas");
    });
  }


  findByOfficeId(id: number):Promise<AgentOffice[]> {
    return this.agentOfficeRepository.find({where:{office:{id:id}}}).catch((error)=>{
      console.log(error)
      throw new NotFoundException("Le ogentOffice spécifié n'existe pas");
    });
  }

  findByOfficeIdAdnStatus(id: number, status:OfficeStatus):Promise<AgentOffice[]> {
    return this.agentOfficeRepository.find({where:{office:{id:id, status: status}}}).catch((error)=>{
      console.log(error)
      throw new NotFoundException("Le ogentOffice spécifié n'existe pas");
    });
  }

  remove(id: number) {
    return this.agentOfficeRepository.delete(id).catch((error)=>{
      throw new BadRequestException(
        "Les ogentOffice indiqué n'existe pas",
      );
    });
  }
}

