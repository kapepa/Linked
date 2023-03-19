import {UserClass} from "./user-class";
import {EventInterface} from "../app/core/interface/event.interface";
import {UserDto} from "../app/core/dto/user.dto";

export const EventClass = {
  id: "eventID",
  user: UserClass,
  date: new Date(Date.now()),
  img: ['eventImg'] as string[],
  link: 'stringEvent',
  time: '',
  title: 'eventTitle',
  type: 'online',
  description: 'eventDescription',
} as any;
