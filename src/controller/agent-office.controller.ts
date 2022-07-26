/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgentOfficeDto } from 'src/dto/agent-service.dto';
import { AgentOffice } from 'src/entities/office-agent.entity';
import { AgentOfficeService } from 'src/services/agent-office.service';

@Controller('offices-tickets')
@ApiTags('Agent-Office')
export class OfficeAgentController {
  constructor(private readonly agentOfficeService: AgentOfficeService) {}

  @Post()
   createOffice(@Body() createOfficeDto: AgentOfficeDto): Promise<AgentOffice> {
    return  this.agentOfficeService.create(createOfficeDto);
  }


  @Get()
  getAll(): Promise<AgentOffice[]> {
    return  this.agentOfficeService.findAll();
  }

  @Get(":id")
  getOne(@Param('id') id:number): Promise<AgentOffice> {
   return this.agentOfficeService.findOne(id);
  }

  @Get(":id")
  changeOfficier(@Param('id') id:number): Promise<AgentOffice> {
   return this.agentOfficeService.changeAgent(id);
  }

}
