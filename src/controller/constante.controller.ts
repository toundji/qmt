/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConstanteDto } from 'src/dto/constante-search.dto';
import { Constante } from 'src/entities/constante.entity';
import { ConstanteService } from 'src/services/constante.service';

@Controller('constantees')
@ApiTags('constantees')
export class ConstanteController {
  constructor(private readonly constanteService: ConstanteService) {}

  @Post()
   createConstante(
    @Body() createConstanteDto: ConstanteDto,
  ): Promise<Constante> {
    return  this.constanteService.create(createConstanteDto);
  }

  @Get()
   getAll(): Promise<Constante[]> {
    return  this.constanteService.findAll();
  }

  @Put(':id')
   update(
    @Param('id') id: number,
    @Body() createConstanteDto: ConstanteDto,
  ): Promise<Constante> {
    return  this.constanteService.create(createConstanteDto);
  }

  @Post('search')
   search(@Body() body:ConstanteDto): Promise<Constante[]> {
    return  this.constanteService.search(body);
  }
  @Post('search-first')
   findFirst(@Body() body:ConstanteDto): Promise<Constante> {
    return  this.constanteService.searchFirst(body);
  }

  @Get('order')
   getOrder(): Promise<number> {
    return  this.constanteService.getOrder();
  }

  @Get('order/reset')
  resetOrder(): Promise<number> {
   return  this.constanteService.resetOrder();
 }

 @Get("init")
 init():Promise<Constante[]>{
    return  this.constanteService.init();
 }
}
