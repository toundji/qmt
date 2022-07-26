/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumberString, IsOptional, IsPositive } from "class-validator";
import { IsNumber } from 'class-validator';

export class AgentOfficeDto {
  @ApiProperty({required:true})
  @IsNumber()
  @IsPositive()
  readonly agent_id: number;

  @ApiProperty({required:true})
  @IsNumberString()
  @IsNotEmpty()
  @IsOptional()
  readonly agent_code: string;

  @ApiProperty({required:true})
  @IsNumber()
  @IsPositive()
  readonly office_id: number;
}
