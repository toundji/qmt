/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
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
