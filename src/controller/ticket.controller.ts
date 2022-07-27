/* eslint-disable prettier/prettier */

import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Ticket } from "src/entities/ticket.entity";
import { TicketStatus } from "src/enums/ticket-status";
import { TicketService } from './../services/ticket.service';

import {
  WebSocketServer,
  
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@ApiTags('Tikects')
@Controller('tickets')
export class TikectController {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly ticketService: TicketService,
  ) {}

  @Get("create")
   async createOne(): Promise<Ticket> {
    const ticket: Ticket = await this.ticketService.create();
    this.server.emit(`onCreate`, ticket);
    this.emitAll();
    this.server.emit(`last-order`, +ticket.order_nber );
    return ticket;
  }

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


  async emitAll(){
    await this.emitWaiter();
    await this.emitReceive();
    await this.emitCancelOfDay();
  }

  
  async emitWaiter(){
    const waiters: Ticket[] = await this.ticketService.findWaiter();
    this.server.emit(`waiter-list`, waiters);
  }
  async emitReceive(){
    const receivers: Ticket[] = await this.ticketService.findByStatus(TicketStatus.RECEIVE);
    this.server.emit(`receive-list`, receivers);
  }
  async emitCancelOfDay(){
    const cancels: Ticket[] = await this.ticketService.findCancelOfDay();
    this.server.emit(`canceled-today`, cancels);
  }

}