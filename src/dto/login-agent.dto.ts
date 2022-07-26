/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginAgentDto {
  @ApiProperty({required:true})
  @IsNotEmpty()
  readonly username: string;


  @ApiProperty({required:true})
  @IsNotEmpty()
  readonly password: string;
}
