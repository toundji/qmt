/* eslint-disable prettier/prettier */
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TicketService } from './../services/ticket.service';
import { Ticket } from './../entities/ticket.entity';
import { ReceiveDto } from 'src/dto/receive-ticket.dto';
import { TicketStatus } from 'src/enums/ticket-status';

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
    private readonly ticketService: TicketService
  ) {}

  @SubscribeMessage('create')
  async create() {
    const ticket: Ticket = await this.ticketService.create();
    this.server.emit(`onCreate`, ticket);
    this.emitAll();
    return ticket;
  }


  @SubscribeMessage('get-waiters')
  findAll(): Promise<Ticket[]> {
    return this.ticketService.findWaiter();
  }

  @SubscribeMessage('receive-one')
  async findOne(@MessageBody() body: ReceiveDto) {
    console.log(body);
   const ticket:Ticket = await this.ticketService.receiveOne(body);
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
}
