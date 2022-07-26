/* eslint-disable prettier/prettier */
import { PartialType } from '@nestjs/swagger';
import { OfficeDto } from './office.dto';

export class UpdateOfficeDto extends PartialType(OfficeDto) {}
