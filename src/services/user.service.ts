/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UploadedFile,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { Logger } from "@nestjs/common";
import { HttpException } from "@nestjs/common";
import { HttpStatus } from "@nestjs/common";
import { RoleName } from 'src/enums/role-name';
import { Genre } from "src/enums/genre";
import { compare, hash } from "bcrypt";
import { UserDto } from "src/dto/user.dto";
import { ChangePasswordDto } from "src/dto/change-password.dto";
import { ChangeEmailDto } from "src/dto/change-emeail.dto";
import { JwtService } from "@nestjs/jwt";
import { LoginRespo } from './../dto/login-respo.dto';
import { UpdateUserDto } from "src/dto/update-user.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  
  async create(body: UserDto): Promise<User> {
    const user: User = new User();
    Object.keys(body).forEach((cle) => {
      user[cle] = body[cle];
    });
    user.roles = body.roles;
    user.roles ??= [];
    // user.office_name = body.office_name;
    if(user.roles.indexOf(RoleName.USER) == -1){
      user.roles.push(RoleName.USER);
    }
    const u: User = await this.userRepository.save(user).catch((error)=>{
      console.log(error);
      throw new BadRequestException("Erreur pendant la réation de l'utilisation. Vérifier que vos donnée n'existe pas déjà");
    });

      return u;
  }

 

  async register(body: UserDto): Promise<LoginRespo> {
    const user: User = new User();
    Object.keys(body).forEach((cle) => {
      user[cle] = body[cle];
    });
    user.roles = [RoleName.USER];

    const u: User = await this.userRepository.save(user).catch((error)=>{
      console.log(error);
      throw new BadRequestException("Erreur pendant la réation de l'utilisation. Vérifier que vos donnée n'existe pas déjà");
    });
    const payload = { pseudo: user.phone, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { user: u, token: token };
  }

  async login({ username, password }: any): Promise<LoginRespo>  {
    const user = await this.findOneByPseudo(username).catch((error)=>{
      throw new UnauthorizedException( "Numéro de téléphone ou mot de passe invalide");
    });

    const areEqual = await compare(password, user.password);
    if (!areEqual) {
      throw new HttpException( "Nom d'utilisateur ou mot de passe invalide ", HttpStatus.UNAUTHORIZED);
    }

    // return user;
    const payload = { pseudo: user.phone, sub: user.id };
    const token = this.jwtService.sign(payload);
    return { user: user, token: token };


  }

  async updateProfile(id: number, @UploadedFile() profile, createur: User) {
    const user: User = await this.findOne(id);

    user.profile_image =  profile.destination + "/"+ profile.filename;
    user.editor_id = createur.id;

    return this.userRepository.save(user).catch((error)=>{
        console.log(error);
        throw new BadRequestException("Les données que nous avons réçues ne sont pas celles que nous espérons")
      });
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  findOne(id: number): Promise<User> {
      return this.userRepository.findOneOrFail({where:{id:id}}).catch((error)=>{
        console.log(error);
      throw new NotFoundException(
        "L'utilisateur avec l'id " + id + " est introuvable",
      );
      });
  }

  findOneByCode(code: string): Promise<User> {
    return this.userRepository.findOneOrFail({where:{code:code}}).catch((error)=>{
      console.log(error);
    throw new NotFoundException(
      "L'utilisateur avec le code " + code + " est introuvable",
    );
    });
}

  findOneByPseudo(pseudo: string): Promise<any> {
    Logger.debug(pseudo);
    return this.userRepository.findOneOrFail({
      where: [{ phone: pseudo }, { email: pseudo }],
    }).catch(
      (error)=>{
        console.log(error);
  
        throw new NotFoundException(
              "L'utilisateur avec l'pseudo " + pseudo + " est introuvable",
            );
      }
    )
  }
  countByMailOrPhone(mailOrPhone:string): Promise<number>{
    return this.userRepository.count({where: [{email: mailOrPhone}, {phone: mailOrPhone}]}).catch(
      (error)=>{
        throw new InternalServerErrorException("Erreur de traitement: "+error.message);
      });
  }
  countByEmail(mailOrPhone:string): Promise<number>{
   return this.userRepository.count({where: {email: mailOrPhone}}).catch(
      (error)=>{
        throw new InternalServerErrorException("Erreur de traitement: "+error.message);
      });
  }
  countByPhone(mailOrPhone:string): Promise<number>{
    return this.userRepository.count({where:  {phone: mailOrPhone}}).catch(
      (error)=>{
        throw new InternalServerErrorException("Erreur de traitement: "+error.message);
      });
  }
  change(id: number, updateUserDto: User) {
    this.findOne(id);
    updateUserDto.id = id;
    return this.userRepository.save(updateUserDto);
  }

  async changePassword( body: ChangePasswordDto, user:User): Promise<string> {
    const areEqual = await compare( body.old, user.password);
    if (!areEqual) {
      throw new HttpException(
        "Nom d'utilisateur ou mot de passe invalide ",
        HttpStatus.UNAUTHORIZED,
      );
    }

    // return user;
    await this.userRepository.update(user.id, {password: await hash(body.nevel, 10) });

    return "Mot de pass mise à jour avec succès";
  }

  async changePhone( body: ChangePasswordDto, user:User): Promise<string> {
    if(body.old?.trim() &&  body.old?.trim() != user.phone.trim()){
      throw new HttpException(
        "L'ancien numéro de téléphone que vous avez indiqué ne correspond pas au numéro existant",
        HttpStatus.UNAUTHORIZED,
      );
    }
    this.userRepository.find({where:[{phone: body.nevel}, {phone: body.nevel.trim()}]}).then((users:[])=>{
      if(users.length > 1){
        throw new BadRequestException("L'ancien numéro de téléphone que vous avez indiqué existe déjà")
      }
    });

    // return user;
    await this.userRepository.update(user.id, {phone:  body.nevel.trim()  });

    return "Mot de pass mise à jour avec succès";
  }

  async changeEmail( body: ChangeEmailDto, user:User): Promise<string> {
    if(body.old?.trim() &&  body.old?.trim() != user.email.trim()){
      throw new HttpException(
        "L'ancien email que vous avez indiqué ne correspond pas à l'email existant",
        HttpStatus.UNAUTHORIZED,
      );
    }

    this.userRepository.find({where:[{email: body.nevel}, {email: body.nevel.trim()}]}).then((users:[])=>{
      if(users.length > 1){
        throw new BadRequestException("L'email que vous avez indiqué existe déjà")
      }
    }).catch((error)=>{
      throw new InternalServerErrorException("Vérification d'email: " + error.message);
    });

    // return user;
    await this.userRepository.update(user.id, {email:  body.nevel.trim().toLowerCase()});

    return "Mot de pass mise à jour avec succès";
  }
  changeWithoutControle(updateUserDto: User) {
 
      return this.userRepository.save(updateUserDto).catch((error)=>{
        console.log(error);

        throw new BadRequestException("Les données que nous avons réçues ne sont pas celles que nous espérons")
     
      });

  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    
      await  this.userRepository.update(id, updateUserDto).catch((error)=>{
        console.log(error);
        throw new NotFoundException("L'utilisateur spécifier n'existe pas");      
      });

      return this.findOne(id);
      
  }

  async delete(id: number) {
    
    await  this.userRepository.delete(id).catch((error)=>{
      console.log(error);
      throw new NotFoundException("L'utilisateur spécifier n'existe pas");      
    });

    return this.findOne(id);
    
}

  async updateAll() {
   const users: User[] = await this.findAll();
    return this.userRepository.save(users).catch((error)=>{
      console.log(error);

      throw new BadRequestException("L'utilisateur spécifier n'existe pas");
    })
  }

  remove(id: number) {
   
      return this.userRepository.delete(id).catch((error)=>{
        console.log(error);

        throw new NotFoundException("L'utilisateur spécifier n'existe pas")
      });
  }

  async initOneAdmin() {
    let user: User;
    try {
      user = await this.findOneByPseudo("+22994851785");
    } catch (e) {}
    if (user) return;
    user = new User();
  
    user.roles = Object.values(RoleName);
    user.firstname = "Ola";
    user.lastname = "BABA";
    user.gender = Genre.MASCULIN;
    user.email = "Baba@gmail.com";
    user.password = "Baba@1234";
    user.phone = "+22994851785";
    user.birth_date = new Date();
    const u: User =  await this.userRepository.save(user);
    
    return u;
  }
}
