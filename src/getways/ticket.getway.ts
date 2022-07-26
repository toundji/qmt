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
   await this.emitWaiter();
    return ticket;
  }

  async emitWaiter(){
    const waiters: Ticket[] = await this.ticketService.findWaiter();
    this.server.emit(`waiter-list`, waiters);
  }

  @SubscribeMessage('get-waiters')
  findAll(): Promise<Ticket[]> {
    return this.ticketService.findWaiter();
  }

  @SubscribeMessage('receive-one')
  async findOne(@MessageBody() body: ReceiveDto) {
   const ticket:Ticket = await this.ticketService.receiveOne(body);
   await this.emitWaiter();
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
}
