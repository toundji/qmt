/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { Ticket } from './../entities/ticket.entity';
import { TicketStatus } from 'src/enums/ticket-status';
import { ReceiveDto } from 'src/dto/receive-ticket.dto';
import { UserService } from './user.service';
import { ConstanteService } from './constante.service';

export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    private readonly userService:UserService,
    private readonly constanteService:ConstanteService

  ) {}

 async create(): Promise<Ticket>{
      const ticket:Ticket = new Ticket();
      ticket.order_nber = await this.constanteService.getOrder();
      return await this.ticketRepository.save(ticket);
  }
  findAll():Promise<Ticket[]>{
    return this.ticketRepository.find();
  }
  findOne(id:number):Promise<Ticket>{
    return this.ticketRepository.findOneOrFail({where:{id:id}});
  }

  findByAgent(agentId:number):Promise<Ticket[]>{
    return this.ticketRepository.find({where:{agent: {id: agentId} }});
  }

  findByStatus(status: TicketStatus):Promise<Ticket[]>{
    return this.ticketRepository.find({where:{status: status }});
  }

  findWaiter():Promise<Ticket[]>{
    return this.ticketRepository.find({where:{status: TicketStatus.WAITING}});
  }

  findCancelOfDay():Promise<Ticket[]>{
    const now:Date = new Date();
    const beginDay = new  Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0 );
    return this.ticketRepository.find({where:{status: TicketStatus.WAITING, created_at: MoreThanOrEqual(beginDay)}});
  }
  

  async receiveOne( body: ReceiveDto):Promise<Ticket>{
    if (body.old_id) {
     const  old:Ticket= await this.findOne(body.old_id);
     if(old.status != TicketStatus.FINISH){ 
        old.finish_date = new Date();
        old.status = TicketStatus.FINISH;
        await this.ticketRepository.save(old);
      }
    }
    const nevel= await this.findOne(body.id);
    nevel.receive_date = new Date();
    const agent = await this.userService.findOne(body.agent_id);
    nevel.agent = agent;
    await this.ticketRepository.save(nevel);

    return nevel;
  }

  async updateStatus(id:number, status: TicketStatus):Promise<Ticket>{
    const ticket: Ticket = await this.findOne(id);
    ticket.status = status;
    return await this.ticketRepository.save(ticket);
  }

  findRecivingByAndAgent(agentId:number):Promise<Ticket[]>{
    return this.ticketRepository.find({where:{status: TicketStatus.RECEIVE, agent: {id: agentId}  }});
  }
}
