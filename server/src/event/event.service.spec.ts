import { Test, TestingModule } from '@nestjs/testing';
import { EventService } from './event.service';
import {getRepositoryToken} from "@nestjs/typeorm";
import {EventEntity} from "./event.entity";
import {Repository} from "typeorm";
import {EventClass} from "../core/utility/event.class";
import {EventInterface} from "./event.interface";
import {EventDto} from "./event.dto";

const MockEventEntity = {
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn()
,}

describe('EventService', () => {
  let service: EventService;
  let eventRepository: Repository<EventEntity>;

  let eventClass = EventClass;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventService,
        { provide: getRepositoryToken(EventEntity), useValue: MockEventEntity}
      ],
    }).compile();

    service = module.get<EventService>(EventService);
    eventRepository = module.get<Repository<EventEntity>>(getRepositoryToken(EventEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('saveEvent', () => {
    let mockEvent = eventClass;
    let spySave = jest.spyOn(eventRepository, 'save').mockResolvedValue(mockEvent as EventEntity);

    service.saveEvent(mockEvent as EventDto | EventInterface).subscribe({
      next: (event: EventDto | EventInterface) => {
        expect(event).toEqual(mockEvent);
        expect(spySave).toHaveBeenCalledWith(mockEvent);
      }
    })
  })

  it('createEvent', () => {
    let mockEvent = eventClass;
    let spySave = jest.spyOn(eventRepository, 'save').mockResolvedValue(mockEvent as EventEntity);

    service.createEvent(mockEvent as EventDto).subscribe({
      next: (event: EventDto | EventInterface) => {
        expect(event).toEqual(mockEvent);
        expect(spySave).toHaveBeenCalledWith(mockEvent);
      }
    })
  })

  it('findEvents', () => {
    let options: { where?: { [key: string]: string | {[key: string]: string} }, take?: number, skip?: number, relations?: string[] }
      = { take: 1, skip: 0 };
    let mockEvents = [eventClass] as EventInterface[]
    let spyEventFind = jest.spyOn(eventRepository, 'find').mockResolvedValue(mockEvents as EventEntity[]);

    service.findEvents(options).subscribe({
      next: (events: EventInterface[]) => {
        expect(events).toEqual(mockEvents);
        expect(spyEventFind).toHaveBeenCalledWith(options);
      }
    })
  })

  it('findOneEvent', () => {
    let options = { where: { id: eventClass.id } };
    let mockEvents: EventInterface = eventClass as EventInterface;
    let spyEventFindOne = jest.spyOn(eventRepository, 'findOne').mockResolvedValue(mockEvents as EventEntity);

    service.findOneEvent(options).subscribe({
      next: (event: EventInterface) => {
        expect(event).toEqual(mockEvents);
        expect(spyEventFindOne).toHaveBeenCalledWith(options);
      }
    })
  })
});
