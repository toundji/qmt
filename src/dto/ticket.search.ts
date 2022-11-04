/* eslint-disable prettier/prettier */
import { IsBoolean, IsDateString, IsEnum, IsNumber, IsObject, IsOptional, IsPositive, IsString } from 'class-validator';
import { TicketStatus } from 'src/enums/ticket-status';
import { IdDto } from './id.dto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TicketSearch {
  
    @ApiProperty()
    @IsEnum({ type: TicketStatus })
    @IsOptional()
    status?:TicketStatus;

  
    @ApiProperty()
    @IsDateString()
    @IsOptional()
    receive_date: Date;
  
    @ApiProperty()
    @IsDateString()
    @IsOptional()
    finish_date: Date;
  
    @ApiProperty()
    @IsNumber()
    @IsPositive()
    @IsOptional()
    order_nber:number;
  
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    code?: string;
  
    @ApiProperty()
    @IsObject()
    @Type(type=>IdDto)
    @IsOptional()
    agent:IdDto;
  
    @ApiProperty()
    @IsObject()
    @Type(type=>IdDto)
    @IsOptional()
    office:IdDto;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    from: Date;

    @ApiProperty()
    @IsDateString()
    @IsOptional()
    to: Date;

    @ApiProperty()
    @IsBoolean()
    precis:boolean;

}
