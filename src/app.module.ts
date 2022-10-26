/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './config/ormconfig';
import { ConstanteController } from './controller/constante.controller';
import { OfficeController } from './controller/office.controller';
import { TikectController } from './controller/ticket.controller';
import { UserController } from './controller/user.controller';
import { Constante } from './entities/constante.entity';
import { AgentOffice } from './entities/office-agent.entity';
import { Office } from './entities/office.entity';
import { Ticket } from './entities/ticket.entity';
import { User } from './entities/user.entity';
import { TicketGateway } from './getways/ticket.getway';
import { ConstanteService } from './services/constante.service';
import { JwtStrategy } from './services/jwt.strategy';
import { OfficeService } from './services/office.service';
import { TicketService } from './services/ticket.service';
import { UserService } from './services/user.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    TypeOrmModule.forFeature([
      User,
      Ticket,
      Constante,
      Office,
      AgentOffice,
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
    ScheduleModule.forRoot()
    
  ],
  controllers: [AppController, UserController, TikectController, ConstanteController, OfficeController],
  providers: [
    AppService,
    JwtStrategy,
    UserService,
    TicketService,
    ConstanteService,
    TicketGateway,
    OfficeService
  ],
})
export class AppModule {}
