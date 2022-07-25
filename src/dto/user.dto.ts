/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import {  IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber,  IsString } from "class-validator";
import { Genre } from 'src/enums/genre';
import { RoleName } from 'src/enums/role-name';

export class UserDto {
    @ApiProperty({required:true})
    @IsString()
    @IsNotEmpty()
    firstname: string;

    @ApiProperty({required:true})
    @IsString()
    @IsNotEmpty()
    lastname: string;

    @ApiProperty({required:true, default:Genre.MASCULIN})
    @IsEnum(Genre)
    gender: Genre;

    @ApiProperty({required:true})
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty()
    @IsString()
    birth_date: Date;

    @ApiProperty({required:true})
    @IsPhoneNumber("BJ")
    phone: string;

    @ApiProperty()
    @IsOptional()
    roles:RoleName[]
}

