import {Role} from "../auth/role.enum";
import {FeetInterface} from "../feet/feet.interface";

export class UsersDto {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  password?: string;
  role?: Role;
  feet?: FeetInterface[];
  created_at?: Date;
}