import {Test, TestingModule} from '@nestjs/testing';
import {EventController} from './event.controller';
import {EventService} from "./event.service";
import {UserClass} from "../core/utility/user.class";
import {EventClass} from "../core/utility/event.class";
import {of} from "rxjs";
import {EventDto} from "./event.dto";
import {EventInterface} from "./event.interface";

const MockEventService = {
  createEvent: jest.fn(),
  findOneEvent: jest.fn(),
  findEvents: jest.fn(),
}

describe('EventController', () => {
  let controller: EventController;
  let eventService: EventService;

  let userClass = UserClass;
  let eventClass = EventClass;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventController],
      providers: [
        { provide: EventService, useValue: MockEventService },
      ]
    }).compile();

    controller = module.get<EventController>(EventController);
    eventService = module.get<EventService>(EventService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('createEvent', () => {
    let mockUser = userClass
    let mockEvent = eventClass as EventDto | EventInterface
    let spyCreateEvent = jest.spyOn(eventService, 'createEvent').mockImplementation(() => of(mockEvent));

    controller.createEvent({ filename: {} } as Express.Multer.File, {user: mockUser}, mockEvent as EventDto).subscribe({
      next: (event: EventDto | EventInterface) => {
        expect(event).toEqual(mockEvent);
        expect(spyCreateEvent).toHaveBeenCalled();
      }
    })
  })

  it('oneEvent', () => {
    let mockEvent = eventClass as EventInterface
    let spyFindOneEvent = jest.spyOn(eventService, 'findOneEvent').mockImplementation(() => of(mockEvent));

    controller.oneEvent({id: mockEvent.id}, {}).subscribe({
      next: (event: EventInterface) => {
        expect(event).toEqual(mockEvent);
        expect(spyFindOneEvent).toHaveBeenCalledWith({ where: { id: mockEvent.id }});
      }
    })
  })

  it('listEvent', () => {
    let query: { take: number, skip: number } = { take: 1, skip: 0 };
    let mockEvent = [eventClass] as EventInterface[];
    let spyFindEvents = jest.spyOn(eventService, 'findEvents').mockImplementation(() => of(mockEvent));

    controller.listEvent(query).subscribe({
      next: (events: EventInterface[]) => {
        expect(events).toEqual(mockEvent);
        expect(spyFindEvents).toHaveBeenCalledWith(query);
      }
    })
  })

});
