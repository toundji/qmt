/* eslint-disable prettier/prettier */
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Ticket } from './../entities/ticket.entity';
import { TicketStatus } from 'src/enums/ticket-status';
import { ReceiveDto } from 'src/dto/receive-ticket.dto';
import { UserService } from './user.service';
import { ConstanteService } from './constante.service';
import { BadRequestException, forwardRef, Inject } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import handlebars from 'handlebars';
import * as puppeteer from 'puppeteer';
import { TicketGateway } from 'src/getways/ticket.getway';
import { TicketSearch } from 'src/dto/ticket.search';
import { ApiDate } from './../utils/api-date';
import { TypeOperation } from 'src/enums/type-operation';

export class TicketService {
  constructor(
    @InjectRepository(Ticket) private ticketRepository: Repository<Ticket>,
    private readonly userService: UserService,
    private readonly constanteService: ConstanteService,
    @Inject(forwardRef(() => TicketGateway))
    private readonly ticketGateway: TicketGateway
  ) {
    this.templateHtml = fs.readFileSync('public/files/ticket.html', 'utf8');
    this.compiledTemplate = handlebars.compile(this.templateHtml);
  }

  private templateHtml: any;
  private compiledTemplate: any;

  async create(): Promise<Ticket> {
    const ticket: Ticket = new Ticket();
    ticket.order_nber = await this.constanteService.getOrder();
    const savedTicket = await this.ticketRepository.save(ticket);
    // this.printFile(savedTicket.order_nber);
    return savedTicket;
  }

  async createInformation(): Promise<Ticket> {
    const ticket: Ticket =  Ticket.create({type: TypeOperation.INFORMATION});
    ticket.order_nber = await this.constanteService.getOrder();
    const savedTicket = await this.ticketRepository.save(ticket);
    // this.printFile(savedTicket.order_nber);
    return savedTicket;
  }
  findAll(): Promise<Ticket[]> {
    return this.ticketRepository.find();
  }
  findOne(id: number): Promise<Ticket> {
    return this.ticketRepository.findOneOrFail({ where: { id: id } });
  }

  findByAgent(agentId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({ where: { agent: { id: agentId } } });
  }

  findByStatus(status: TicketStatus): Promise<Ticket[]> {
    return this.ticketRepository.find({ where: { status: status } });
  }

  findWaiter(): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { status: TicketStatus.WAITING },
    });
  }

  findWaiterOfDays(): Promise<Ticket[]> {
    const beginDay = ApiDate.atMorning();
    return this.ticketRepository.find({
      where: {
        status: TicketStatus.WAITING,
        created_at: MoreThanOrEqual(beginDay),
      },
    });
  }

  findByStatusOfDay(status: TicketStatus): Promise<Ticket[]> {
    const beginDay = ApiDate.atMorning();
    return this.ticketRepository.find({
      where: { status: status, created_at: MoreThanOrEqual(beginDay) },
    });
  }

  findOfDay(): Promise<Ticket[]> {
    const beginDay = ApiDate.atMorning();
    return this.ticketRepository.find({
      where: {created_at: MoreThanOrEqual(beginDay) },
    });
  }

  findCancelOfDay(): Promise<Ticket[]> {
    const beginDay = ApiDate.atMorning();
    return this.ticketRepository.find({
      where: {
        status: TicketStatus.WAITING,
        created_at: MoreThanOrEqual(beginDay),
      },
    });
  }

  async receiveOne(body: ReceiveDto): Promise<Ticket> {
    if (body.old_id) {
      const old: Ticket = await this.findOne(body.old_id);
      if (old.status != TicketStatus.FINISH) {
        old.finish_date = new Date();
        old.status = TicketStatus.FINISH;
        await this.ticketRepository.save(old);
        this.ticketGateway.emitReceive()
      }
    }else{
      const old: Ticket = await this.lastReceiveOfAgent(body.agent_id).catch(error=>{return null;});
      if (old!=null) {
        old.finish_date = new Date();
        old.status = TicketStatus.FINISH;
        await this.ticketRepository.save(old);
        this.ticketGateway.emitReceive()
      }
    }
    const nevel = await this.findOne(body.id);

    nevel.receive_date = new Date();
    const agent = await this.userService.findOne(body.agent_id);

    nevel.agent = agent;
    nevel.status = TicketStatus.RECEIVE;

    await this.ticketRepository.save(nevel).catch((error) => {
      console.log(error);
      throw new BadRequestException("Une erreur s'est produite");
    });

    return nevel;
  }

  async finishOne(body: ReceiveDto): Promise<Ticket> {
    const old: Ticket = await this.findOne(body.id);
    old.finish_date = new Date();
    old.status = TicketStatus.FINISH;
    await this.ticketRepository.save(old);
    return old;
  }

  async rejetOne(body: ReceiveDto): Promise<Ticket> {
    const old: Ticket = await this.findOne(body.id);
    old.finish_date = null;
    old.status = TicketStatus.WAITING;
    await this.ticketRepository.save(old);
    return old;
  }

  async cancelOne(body: ReceiveDto): Promise<Ticket> {
    const old: Ticket = await this.findOne(body.id);
    old.finish_date = null;
    old.status = TicketStatus.CANCEL;
    await this.ticketRepository.save(old);
    return old;
  }

  async updateStatus(id: number, status: TicketStatus): Promise<Ticket> {
    const ticket: Ticket = await this.findOne(id);
    ticket.status = status;
    return await this.ticketRepository.save(ticket);
  }

  findRecivingByAndAgent(agentId: number): Promise<Ticket[]> {
    return this.ticketRepository.find({
      where: { status: TicketStatus.RECEIVE, agent: { id: agentId } },
    });
  }

  lastTicketofAgent(agentId: number): Promise<Ticket> {
    return this.ticketRepository.findOneOrFail({
      where: {agent: { id: agentId }}, order:{receive_date: "DESC"}, 
    });
  }

  lastReceiveOfAgent(agentId: number): Promise<Ticket> {
    return this.ticketRepository.findOneOrFail({
      where: { status: TicketStatus.RECEIVE, agent: { id: agentId }},order:{receive_date: "DESC"}, 
    });
  }

  async printFile(ticket_order_number: number) {
    const data = { order_nber: ticket_order_number };
    const html = this.compiledTemplate(data);

    const pdfPath = path.join('public/files', 'ticket.pdf');
    const imagePath = path.join('public/files', 'ticket.jpeg');

    const pdfOptions = {
      width: '220px',
      height: '270px',
      scale: 1.6,
      displayHeaderFooter: false,
      margin: {
        bottom: 0,
        top: 0,
      },
      printBackground: true,
      path: pdfPath,
    };

    const screenshotOptions = {
      quality: 80,
      fullPage: false,
      clip: {
        x: 250,
        y: 45,
        width: 300,
        height: 180,
      },
      path: imagePath,
      omitBackground: true,
    };

    const browser = await puppeteer.launch({
      args: ['--no-sandbox'],
      headless: true,
    });

    const page = await browser.newPage();

    await page.goto(`data:text/html;charset=UTF-8,${html}`, {
      waitUntil: 'networkidle0',
    });
    await page.pdf(pdfOptions);
    await page.screenshot({ ...screenshotOptions, type: 'jpeg' });
    await browser.close();
    const info = fs.readFileSync(imagePath);
    return { someData: 'someData' };
    // printDirect({
    //   data: info,
    //   type: 'JPEG',
    //   success: function (jobID) {
    //     console.log('ID: ' + jobID);
    //   },
    //   error: function (error) {
    //     console.log('printer module error: ' + error);
    //     throw error;
    //   },
    // });
  }

  search(search:TicketSearch):Promise<Ticket[]>{
    let { from, to, precis, ...body} = search;
    if(from && to){
      if(!precis){
        from = ApiDate.atMorning(from)
        to = ApiDate.atMorning(to)
      }
      return this.ticketRepository.find({where:{...body, created_at: Between(from, to)}}).catch((error)=>{
        console.log(error);
        throw new BadRequestException("Une erreur s'est produite pendant la recherche")
      });
    }else if(from){
      if(!precis){
        from = ApiDate.atMorning(from)
      }
      return this.ticketRepository.find({where:{...body, created_at: MoreThanOrEqual(from)}}).catch((error)=>{
        console.log(error);
        throw new BadRequestException("Une erreur s'est produite pendant la recherche")
      });
    }else if(to){
      if(!precis){
        to = ApiDate.atMorning(to)
      }
      return this.ticketRepository.find({where:{...body, created_at: LessThanOrEqual(to)}}).catch((error)=>{
        console.log(error);
        throw new BadRequestException("Une erreur s'est produite pendant la recherche")
      });
    }else {
      return this.ticketRepository.find({where:body}).catch((error)=>{
        console.log(error);
        throw new BadRequestException("Une erreur s'est produite pendant la recherche")
      });
    }
  }
}
