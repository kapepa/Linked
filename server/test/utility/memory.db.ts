import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import * as dotenv from "dotenv";

dotenv.config();

const MemoryDb = {
  createUser: async function (user: any, repository: Repository<any>) {
    return new Promise(resolve => resolve(repository.save(user)))
  },
  deleteUser (userID: string,  repository: Repository<any>) {
    return new Promise(resolve => resolve(repository.delete({id: userID})))
  },
  createToken: async function (user: any): Promise<string> {
    return new Promise(resolve => resolve(
      new JwtService(
        {secret: process.env.JWT_SECRET}
      ).sign(
        {firstName : user.firstName, lastName: user.lastName, id: user.id, role: user.role, avatar: user.avatar}
      )
    ))
  },
  userValue(profile) {
    let { created_at , password, ...user } = profile;
    return user;
  }
}

export { MemoryDb }