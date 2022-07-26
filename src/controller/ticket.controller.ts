/* eslint-disable prettier/prettier */

import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { TicketDto } from "src/dto/ticket.dto";
import { Ticket } from "src/entities/ticket.entity";
import { TicketStatus } from "src/enums/ticket-status";
import { Public } from "src/utils/public-decore";
import { TicketService } from './../services/ticket.service';
import { TicketGateway } from '../getways/ticket.getway';
import { TicketSearch } from './../dto/ticket.search';



@ApiTags('Tikects')
@Controller('tickets')
export class TikectController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly ticketGateway: TicketGateway
  ) {}

  @Public()
  @Get("create")
  async create(): Promise<Ticket> {
    const ticket: Ticket = await this.ticketService.create();
    this.ticketGateway.server.emit(`onCreate`, ticket);
    this.ticketGateway.emitAll();
    this.ticketGateway.server.emit(`last-order`, +ticket.order_nber );
    return ticket;
  }

  @Public()
  @Get("create/operation/information")
  async createInformation(): Promise<Ticket> {
    const ticket: Ticket = await this.ticketService.createInformation();
    this.ticketGateway.server.emit(`onCreate`, ticket);
    this.ticketGateway.emitAll();
    this.ticketGateway.server.emit(`last-order`, +ticket.order_nber );
    return ticket;
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

  @Delete(':id')
  solfDelete(@Param('id') id: number) {
   return  this.ticketService.softRemove(id);
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

  
  @Get("agent/:agent")
  getByAgent( @Param('agent') id:number): Promise<Ticket[]> {
   return this.ticketService.findRecivingByAndAgent(id);
  }


  @Post("search")
  search(@Body() body:TicketSearch): Promise<Ticket[]> {
   return this.ticketService.search(body);
  }
}