/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import {  IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber,  IsString } from "class-validator";
import { Genre } from 'src/enums/genre';
import { RoleName } from 'src/enums/role-name';

export class UserDto {
    @ApiProperty({required:true})
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    firstname: string;

    @ApiProperty({required:true})
    @IsString()
    @IsNotEmpty()
    @IsOptional()
    lastname: string;

    @ApiProperty({required:true, default:Genre.MASCULIN})
    @IsEnum(Genre)
    @IsOptional()
    gender: Genre;

    @ApiProperty({required:true})
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({required:true})
    @IsString()
    @IsNotEmpty()
    office_name:string;

    @ApiProperty()
    @IsEmail()
    email?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    birth_date: Date;

    @ApiProperty({required:true})
    @IsPhoneNumber("BJ")
    @IsOptional()
    phone: string;

    @ApiProperty()
    @IsOptional()
    roles:RoleName[]
}

