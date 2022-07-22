/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Constante } from './entities/constante.entity';
import { Ticket } from './entities/ticket.entity';
import { User } from './entities/user.entity';
import { ConstanteService } from './services/constante.service';
import { JwtStrategy } from './services/jwt.strategy';
import { TicketService } from './services/ticket.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Ticket,
      Constante
    ]),
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'user',
      session: false,
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtStrategy,
    UserService,
    TicketService,
    ConstanteService,
  ],
})
export class AppModule {}
