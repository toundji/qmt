
import { IsNumber, IsPositive } from 'class-validator';
export class IdDto{
    @IsNumber()
    @IsPositive()
    id:number;

    
}