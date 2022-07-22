/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  old: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  nevel: string;
}
