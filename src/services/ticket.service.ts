/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from './../entities/ticket.entity';

export class TicketService {
  constructor(
    @InjectRepository(Ticket) private userRepository: Repository<Ticket>,
  ) {}

  create(){
      const ticket:Ticket = new Ticket();
  }
}
