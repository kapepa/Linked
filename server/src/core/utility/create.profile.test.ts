import {INestApplication} from "@nestjs/common";
import {UsersInterface} from "../../users/users.interface";
import * as request from "supertest";
import {FriendsInterface} from "../../friends/friends.interface";

interface ProfileInterface {
  token: string, profile: FriendsInterface,
}

let CreateProfileTest = async (app: INestApplication, dto: UsersInterface, props: ProfileInterface) => {
  await request(app.getHttpServer())
    .post('/auth/registration').send(dto);
  await request(app.getHttpServer())
    .post('/auth/login').send({password: dto.password, email: dto.email})
    .expect((res: Response) => props.token = res.body['access_token'])
  await request(app.getHttpServer())
    .get('/users').set('Authorization', `Bearer ${props.token}`)
    .expect((res: Response & {body: FriendsInterface }) => props.profile = res.body);
}

export {ProfileInterface, CreateProfileTest}


