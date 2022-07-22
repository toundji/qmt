/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginDto {
  @ApiProperty({required:true})
  @IsNotEmpty() readonly username: string;
  @ApiProperty({required:true})
  @IsNotEmpty() readonly password: string;
}
