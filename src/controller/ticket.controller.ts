/* eslint-disable prettier/prettier */

import { Body, Controller, Get, Param, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TicketDto } from "src/dto/ticket.dto";
import { Ticket } from "src/entities/ticket.entity";
import { TicketStatus } from "src/enums/ticket-status";
import { Public } from "src/utils/public-decore";
import { TicketService } from './../services/ticket.service';
import { TicketGateway } from '../getways/ticket.getway';



@ApiTags('Tikects')
@Controller('tickets')
export class TikectController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly ticketGateway: TicketGateway
  ) {}

  @Get("create")
  createOne(): Promise<Ticket> {
    return this.ticketService.create();
  }

  @Public()
  @Get()
   getTickets(): Promise<Ticket[]> {
    return this.ticketService.findAll();
  }

  @Put()
   receiveTicket(@Body() body: TicketDto): Promise<Ticket> {
    return this.ticketService.receiveOne(body);
  }

  @Put("finish-one")
  finishTicket(@Body() body: TicketDto): Promise<Ticket> {
   return this.ticketService.receiveOne(body);
 }

 @Put("cancel-one")
 cancelTicketTicket(@Body() body: TicketDto): Promise<Ticket> {
  return this.ticketService.cancelOne(body);
  }

  @Put("rejet-one")
  rejetTicketTicket(@Body() body: TicketDto): Promise<Ticket> {
    return this.ticketService.rejetOne(body);
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