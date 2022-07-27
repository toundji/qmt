/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional, IsString } from "class-validator";
import { IsPositive } from 'class-validator';

export class ReceiveDto {
  @IsString()
  @IsNumber()
  @IsPositive()
  id: number;

  @IsString()
  @IsNumber()
  @IsPositive()
  @IsOptional()
  old_id: number;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  agent_id: number;
}
