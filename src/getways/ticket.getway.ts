/* eslint-disable prettier/prettier */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TicketService } from './../services/ticket.service';
import { Ticket } from './../entities/ticket.entity';
import { ReceiveDto } from 'src/dto/receive-ticket.dto';
import { TicketStatus } from 'src/enums/ticket-status';
import { BadRequestException } from '@nestjs/common';
import { ConstanteService } from 'src/services/constante.service';
import { Constante } from 'src/entities/constante.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'tickets',
})
export class TicketGateway {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly ticketService: TicketService,
    private readonly constanteService: ConstanteService
  ) {}

  @SubscribeMessage('create')
  async create() {
    const ticket: Ticket = await this.ticketService.create();
    this.server.emit(`onCreate`, ticket);
    this.emitAll();
    this.server.emit(`last-order`, +ticket.order_nber );
    return ticket;
  }


  @SubscribeMessage('reset-order')
  async resetOrder() {
    const order: number = await this.constanteService.resetOrder().catch((error)=>{
      throw new WsException(error.message);
    });
    this.server.emit(`last-order`, +order);
  }



  @SubscribeMessage('get-waiters')
  findAll(): Promise<Ticket[]> {
    return this.ticketService.findWaiter();
  }

  @SubscribeMessage('emit-list')
  waiterList(): Promise<Ticket[]> {
    this.emitAll();
    return null;
  }

  @SubscribeMessage('receive-one')
  async findOne(@MessageBody() body: ReceiveDto) {
    console.log(body);
   const ticket:Ticket = await this.ticketService.receiveOne(body).catch((error: BadRequestException)=>{
     throw new WsException(error.message);
     return null;
   });
   this.emitAll();
   return ticket;
  }

  @SubscribeMessage('update')
  update(@MessageBody() updateAbonnerDto) {
      console.log(updateAbonnerDto);
  }

  @SubscribeMessage('remove')
  remove(@MessageBody() id: number) {
    console.log(id);
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
  async emitOrder(){
    const order: Constante = await this.constanteService.findOrder().catch((error)=>{
      throw new WsException(error.message);
    });
    this.server.emit(`last-order`, +order.value);
  }
}
