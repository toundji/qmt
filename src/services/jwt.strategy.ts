/* eslint-disable prettier/prettier */
import { Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import "dotenv/config";
import { UserService } from "./user.service";


const secretOrKey = process.env.JWT_KEY;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      ignoreExpiration: false,
      secretOrKey : process.env.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }
  async validate({pseudo}:any) {
    Logger.log(pseudo);
    const user = await this.userService.findOneByPseudo( pseudo ).catch((error)=>{
      throw new UnauthorizedException("Proplème d'authentification. Adresse email ou mot de passe invalide")
    });
    if (!user) {
      throw new UnauthorizedException("Proplème d'authentification. Adresse email ou mot de passe invalide");
    }
    return user;
  }

  
}
