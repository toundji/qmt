/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ConstanteVisibility } from 'src/enums/constante-visibility';
import { IsBoolean } from 'class-validator';
import { IsEnum } from 'class-validator';

export class ConstanteDto {
  @ApiProperty()
  @IsOptional()
  id?: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  nom?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  valeur?: string;

  @ApiProperty()
  @IsEnum({ type: ConstanteVisibility })
  @IsOptional()
  visibilite?: ConstanteVisibility;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;
}
