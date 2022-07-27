/* eslint-disable prettier/prettier */
import { IsEnum, IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';
import { TicketStatus } from 'src/enums/ticket-status';

export class TicketDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  old_id: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  agent_id: number;

}
