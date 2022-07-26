/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { OfficeStatus } from 'src/enums/office-status';

export class OfficeDto {
  @ApiProperty({required:true})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsEnum({ type: OfficeStatus})
  @IsOptional()
  status?:OfficeStatus;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  description?: string;
}
