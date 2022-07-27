/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TicketDto } from "src/dto/ticket.dto";
import { Ticket } from "src/entities/ticket.entity";
import { TicketStatus } from "src/enums/ticket-status";
import { TicketService } from './../services/ticket.service';



@ApiTags('Tikects')
@Controller('tickets')
export class TikectController {
  constructor(
    private readonly ticketService: TicketService,
  ) {}

  @Get("create")
   createOne(): Promise<Ticket> {
    return  this.ticketService.create();
  }

  @Get()
   getTickets(): Promise<Ticket[]> {
    return this.ticketService.findAll();
  }

  @Put()
   receiveTicket(@Body() body: TicketDto): Promise<Ticket> {
    return this.ticketService.receiveOne(body);
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