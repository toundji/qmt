/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OfficeDto } from 'src/dto/office.dto';
import { Office } from 'src/entities/office.entity';
import { OfficeStatus } from 'src/enums/office-status';
import { OfficeService } from 'src/services/office.service';

@Controller('offices')
@ApiTags('offices')
export class OfficeController {
  constructor(private readonly officeService: OfficeService) {}

  @Post()
   createOffice(
    @Body() createOfficeDto: OfficeDto,
  ): Promise<Office> {
    return  this.officeService.create(createOfficeDto);
  }

  @Get()
   getAll(): Promise<Office[]> {
    return  this.officeService.findAll();
  }

  @Put(':id')
   update(@Param('id') id: number, @Body() createOfficeDto: OfficeDto): Promise<Office> {
    return  this.officeService.create(createOfficeDto);
  }

  @Get("status/:status")
  geticketByStatus(@Param('status') status:OfficeStatus): Promise<Office[]> {
   return this.officeService.findByStatus(status);
  }

  @Get("names/:name")
  geticketByName(@Param('status') status:OfficeStatus): Promise<Office> {
   return this.officeService.findByName(status);
  }

 @Get("init")
 init():Promise<Office[]>{
    return  this.officeService.init();
 }

 
 @Delete(':id')
 solfDelete(@Param('id') id: number) {
  return  this.officeService.softRemove(id);
}
}
