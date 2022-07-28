/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
  
} from '@nestjs/common';
import {   ApiTags } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';
import { Public } from 'src/utils/public-decore';
import { UserDto } from '../dto/user.dto';
import { LoginDto } from '../dto/login.dto';
import { LoginRespo } from '../dto/login-respo.dto';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { ChangeEmailDto } from 'src/dto/change-emeail.dto';
import { UpdateUserDto } from 'src/dto/update-user.dto';
import { RoleName } from 'src/enums/role-name';
import { RoleGuard } from 'src/utils/role.guard';
import { Roles } from 'src/utils/role.decorator';
import { BadRequestException } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userservice: UserService,
  ) {}

    @Post()
    @UseGuards(RoleGuard)
   create(@Body() body: UserDto): Promise<User> {
    return this.userservice.create(body);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    const users = await this.userservice.findAll();
    return users;
  }

  @Post('login')
  @Public()
   signin(@Body() body: LoginDto): Promise<LoginRespo> {
    return this.userservice.login(body);
  }

  @Get('check-email-existence/:email')
  @Public()
  async checkIfEmailExists(@Param('email') email: string): Promise<any> {
    return await this.userservice.countByEmail(email).then(value=>{
      if(value && value>0) throw new BadRequestException("L'email est déjà pris")
      return "L'adresse email est bien disponible";
    })
  }

  @Get('check-phone-existence/:phone')
  @Public()
  async checkIfPhoneExists(@Param('phone') phone: string): Promise<any> {
    return await this.userservice.countByPhone(phone).then(value=>{
      if(value && value>0) throw new BadRequestException("Le numéro de téléphone est  déjà pris")
      return "Le numéro de téléphone  est bien disponible";
    });
  }

  

  @Put(':id')
  async update(@Body() body:UpdateUserDto, @Req() request): Promise<User> {
    const user: User = request['user'];
    return this.userservice.update(user.id, body);
  }

  @Put('change/password')
  changePassword(
    @Req() request,
    @Body() body: ChangePasswordDto,
  ): Promise<string> {
    const user: User = request.user;
    return this.userservice.changePassword(body, user);
  }


  @Put('change/email')
  changeEmail(@Req() request, @Body() body: ChangeEmailDto): Promise<string> {
    const user: User = request.user;
    return this.userservice.changeEmail(body, user);
  }

//   @Post('profile/image')
//   @UseInterceptors(
//     FileInterceptor('profile', {
//       storage: diskStorage({
//         destination: './files/profiles',
//         filename: editFileName,
//       }),
//       fileFilter: imageFileFilter,
//     }),
//   )
//   @ApiConsumes('multipart/form-data')
//   @ApiBody({
//     schema: {
//       type: 'object',
//       properties: {
//         profile: {
//           type: 'string',
//           format: 'binary',
//         },
//       },
//     },
//   })
//   updateProfile(@UploadedFile() profile, @Req() req): Promise<User> {
//     const user = req['user'];
//     return this.userservice.updateProfile(user.id, profile, user);
//   }

  @Get('profile')
  async getProfile(@Req() req) {
    const user: User = req['user'];
    return user;
  }


  @Delete('delete/:id')
   deleteUser(@Param('id') id: number) {
    return  this.userservice.delete(id);
  }

    @Get("init")
    @Public()
    init():Promise<User>{
       return  this.userservice.initOneAdmin();
    }
}

