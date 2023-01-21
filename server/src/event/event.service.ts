import {Injectable} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {EventEntity} from "./event.entity";
import {Repository} from "typeorm";
import {EventDto} from "./event.dto";
import {EventInterface} from "./event.interface";
import {from, Observable} from "rxjs";

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(EventEntity)
    private eventRepository: Repository<EventEntity>,
  ) {}

  saveEvent(event: EventDto | EventInterface): Observable<EventDto | EventInterface>{
    return from(this.eventRepository.save(event));
  }

  createEvent(event: EventDto): Observable<EventDto | EventInterface> {
    return this.saveEvent(event);
  }

  findEvents(find?: {
    where?: { [key: string]: string | {[key: string]: string} },
    take?: number,
    skip: number,
    relations: string[] }
  ): Observable<EventInterface[]> {
    return from(this.eventRepository.find(find));
  }

  findOneEvent(find?: {
    where?: { [key: string]: string | {[key: string]: string} },
    relations?: string[],
  }): Observable<EventInterface>{
    console.log()
    return from(this.eventRepository.findOne(find));
  }
}
