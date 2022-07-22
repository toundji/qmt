/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { RoleName } from 'src/enums/role-name';




@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
      const requiredRole = this.reflector.getAllAndOverride<RoleName[]>('roles', [
          context.getHandler(),
          context.getClass()
      ]);

      if(!requiredRole){
          return true;
      }

      const { user }  = context.switchToHttp().getRequest();
      
      const userRoles:RoleName[] = user.roles;
     return requiredRole.some((role)=> userRoles.includes(role))
     
  }
}
