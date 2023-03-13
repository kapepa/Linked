import {UsersInterface} from "../../users/users.interface";
import {UsersDto} from "../../users/users.dto";

export class OptionInterface {
  where?: {
    [key: string]: string | string[] | UsersInterface[] | UsersDto[] | { [key: string]: string | UsersDto | { [key: string]: string | UsersDto } }
  };
  relations?: string[];
  order?: {[key: string]: "ASC" | "DESC" | {[key: string]: "ASC" | "DESC" } };
  skip?: number;
  take?: number;
}