/* eslint-disable prettier/prettier */

import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Ticket } from "src/entities/ticket.entity";
import { TicketStatus } from "src/enums/ticket-status";
import { TicketService } from './../services/ticket.service';



@ApiTags('Tikects')
@Controller('tickets')
export class TikectController {
  constructor(
    private readonly ticketService: TicketService,
  ) {}

  @Get()
   getTickets(): Promise<Ticket[]> {
    return this.ticketService.findAll();
  }

  @Get(":id")
   getOneTicket(@Param('id') id:number): Promise<Ticket> {
    return  this.ticketService.findOne(id);
  }

  @Get("agents/:id")
   geticketByAgents(@Param('id') id:number): Promise<Ticket[]> {
    return this.ticketService.findByAgent(id);
  }

  @Get("status/:status")
  geticketByStatus(@Param('status') status:TicketStatus): Promise<Ticket[]> {
   return this.ticketService.findByStatus(status);
  }

}