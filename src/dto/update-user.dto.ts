/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateUserDto extends PartialType(UserDto) {}
