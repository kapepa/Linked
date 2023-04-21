import {UserClass} from "./user.class";

const EventClass = {
  id: 'eventID',
  user: UserClass,
  date: new Date(Date.now()),
  img: 'eventImg.png',
  link: 'eventLink',
  time: '10:10',
  title: 'Title',
  type: 'online',
  description: 'description event',
}

export { EventClass };