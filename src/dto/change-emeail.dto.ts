/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { IsOptional } from 'class-validator';

export class ChangeEmailDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  @IsOptional()
  old: string;

  @ApiProperty({required:true})
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  nevel: string;
}
