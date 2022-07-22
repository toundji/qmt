/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { diskStorage } from 'multer';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/services/user.service';
import { Public } from 'src/utils/public-decore';
import { UserDto } from '../dto/user.dto';
import { LoginDto } from '../dto/login.dto';
import { LoginRespo } from '../dto/login-respo.dto';
import { ChangePasswordDto } from 'src/dto/change-password.dto';
import { ChangeEmailDto } from 'src/dto/change-emeail.dto';
import { editFileName, imageFileFilter } from 'src/utils/utils';

@ApiTags('Users')
@Controller('users')
export class User2Controller {
  constructor(
    private readonly userservice: UserService,
  ) {}

  @Post()
   create(@Body() body: UserDto): Promise<User> {
    return this.userservice.create(body);
    
  }

  @Get()
  async getUsers(): Promise<User[]> {
    const users = await this.userservice.findAll();
    return users;
  }


//   @Post('register')
//   @Public()
//    signup(@Body() body: UserDto): Promise<LoginRespo> {
//     return this.userservice.register(body);
//   }

  @Post('login')
    @Public()
   signin(
    @Body() body: LoginDto,
  ): Promise<LoginRespo> {
    return this.userservice.login(body);
  }

//   @Post('mails/check')
//   @Public()
//   async verifyEmail(@Body() body: VerifyEmailDto) {
//     const user = await this.userservice.findOneByEmail(body.user.email);
//     if (user && user.verification_token === body.token) {
//       this.userservice.set_user_activity(user, true);
//       return { success: true, message: 'Email confirmé avec succès' };
//     }
//   }

//   @Get('check-email-existence/:email')
//   @Public()
//   async checkIfEmailExists(@Param('email') email: string): Promise<any> {
//     return await this.userservice.countByEmail(email);
//   }
// 
//   @Get('auth/check-phone-existence/:phone')
//   @Public()
//   async checkIfPhoneExists(@Param('phone') phone: string): Promise<any> {
//     return await this.userservice.countByPhone(phone);
//   }
// 
//   

  @Put(':id')
  async update(@Body() body, @Req() request): Promise<User> {
    const user: User = request['user'];
    return this.userservice.update(body, user);
  }

  @Put('change/password')
  changePassword(
    @Req() request,
    @Body() body: ChangePasswordDto,
  ): Promise<string> {
    const user: User = request.user;
    return this.userservice.changePassword(body, user);
  }

//   @Put('change/phone')
//   changePhone(@Req() request, @Body() body: ChangePhoneDto): Promise<string> {
//     const user: User = request.user;
//     return this.userservice.changePhone(body, user);
//   }

  @Put('change/email')
  changeEmail(@Req() request, @Body() body: ChangeEmailDto): Promise<string> {
    const user: User = request.user;
    return this.userservice.changeEmail(body, user);
  }

//   @Put('profile')
//   async updateMyProfile(
//     @Body() body: UserDto,
//     @Req() request,
//   ): Promise<User> {
//     const user: User = request['user'];
//     return this.userservice.update(user.id, body);
//   }

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

//   @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
//   @Get('profile/image')
//   async getImageProfile(@Res() res, @Req() req) {
//     const user: User = req['user'];
//     return res.sendFile(user.profile_image, { root: './' });
//   }

//   @ApiOkResponse({ schema: { type: 'string', format: 'binary' } })
//   @Get(':id/profile/image')
//   async getImageProfileOf(@Param('id') id: number, @Res() res) {
//     const user: User = await this.userservice.findOne(id);
//     return res.sendFile(user.profile_image, { root: './' });
//   }

  

//   @Delete('delete/:id')
//   async deleteUser(@Param('id') id: number) {
//     return await this.userservice.d(id);
//   }

    @Get()
    init():Promise<User>{
       return  this.userservice.initOneAdmin();
    }
}

