/* eslint-disable prettier/prettier */


import { SetMetadata } from "@nestjs/common";
import { RoleName } from 'src/enums/role-name';

export const Roles = (...roles: RoleName[]) => SetMetadata("roles", roles);
