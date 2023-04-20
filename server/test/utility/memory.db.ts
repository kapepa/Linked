import {Repository} from "typeorm";
import {JwtService} from "@nestjs/jwt";
import * as dotenv from "dotenv";

dotenv.config();

const MemoryDb = {
  createUser: async function (user: any, repository: Repository<any>) {
    return new Promise(resolve => repository.save(user))
  },
  createToken: function (user: any) {
    return new JwtService(
      {secret: process.env.JWT_SECRET}
    ).sign(
      {firstName : user.firstName, lastName: user.lastName, id: user.id, role: user.role, avatar: user.avatar}
    )
  },
}

export { MemoryDb }