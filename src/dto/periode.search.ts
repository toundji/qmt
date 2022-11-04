
import { IsDateString, IsOptional, IsBoolean } from 'class-validator';
export class IdDto{
    @IsDateString()
    @IsOptional()
    from: Date;

    @IsDateString()
    @IsOptional()
    to: Date;

    @IsBoolean()
    precis:boolean;
}