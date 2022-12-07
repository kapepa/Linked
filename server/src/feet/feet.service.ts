import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {FeetDto} from "./feet.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, FindOperator, Repository, UpdateResult} from "typeorm";
import {Feet} from "./feet.entity";
import {catchError, from, Observable, switchMap} from "rxjs";
import {FeetInterface} from "./feet.interface";

@Injectable()
export class FeetService {
  constructor(
    @InjectRepository(Feet)
    private feetRepository: Repository<Feet>
  ) {}

  createFeet(feet: FeetDto): Observable<FeetInterface> {
    return from(this.feetRepository.save(feet)).pipe(
      catchError(err => { throw err })
    );
  }

  getFeet(id: string): Observable<FeetInterface> {
    return from(this.feetRepository.findOne({ where: { id } })).pipe(
      catchError(err => { throw new HttpException('db didn\'t find those feet.', HttpStatus.NOT_FOUND) })
    )
  }

  allFeet(options: { where?: {[key: string]: string | FindOperator<string> | {[key: string]: string }}, take?: number, skip?: number, relations?: string[] }): Observable<FeetInterface[]> {
    return from(this.feetRepository.find({...options, order: { createdAt: 'DESC' }, relations: ['author']})).pipe(
      catchError(err => { throw new HttpException('db didn\'t not found feet.', HttpStatus.NOT_FOUND)})
    )
  }

  updateFeet(id: string, feet: FeetDto): Observable<FeetInterface> {
    return from(this.feetRepository.update({ id }, feet )).pipe(
      switchMap(() => this.getFeet(id)),
      catchError(err => { throw new HttpException('Something went wrong when update feet.', HttpStatus.BAD_REQUEST)})
    )
  }

  deleteFeet(id: string): Observable<DeleteResult> {
    return  from(this.feetRepository.delete({ id })).pipe(
      catchError(err => { throw new HttpException('Something went wrong when delete feet.', HttpStatus.NOT_FOUND)})
    )
  }
}
