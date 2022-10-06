import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {FeetDto} from "./feet.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository, UpdateResult} from "typeorm";
import {Feet} from "./feet.entity";
import {catchError, from, Observable} from "rxjs";
import {FeetInterface} from "./feet.interface";

@Injectable()
export class FeetService {
  constructor(
    @InjectRepository(Feet)
    private usersRepository: Repository<Feet>
  ) {}

  createFeet(feet: FeetDto): Observable<FeetInterface> {
    return from(this.usersRepository.save(feet)).pipe(
      catchError(err => { throw err })
    );
  }

  getFeet(id: string): Observable<FeetInterface> {
    return from(this.usersRepository.findOne({ where: { id } })).pipe(
      catchError(err => { throw new HttpException('db didn\'t find those feet.', HttpStatus.NOT_FOUND) })
    )
  }

  allFeet(options: { where?: {[key: string]: string | {[key: string]: string }}, take?: number, skip?: number, relations?: string[] }): Observable<FeetInterface[]> {
    return from(this.usersRepository.find(options)).pipe(
      catchError(err => { throw new HttpException('db didn\'t not found feet.', HttpStatus.NOT_FOUND)})
    )
  }

  updateFeet(id: string, feet: FeetDto): Observable<UpdateResult> {
    return from(this.usersRepository.update({ id }, feet )).pipe(
      catchError(err => { throw new HttpException('Something went wrong.', HttpStatus.BAD_REQUEST)})
    )
  }

  deleteFeet(id: string): Observable<DeleteResult> {
    return  from(this.usersRepository.delete({ id })).pipe(
      catchError(err => { throw new HttpException('Something went wrong when delete feet.', HttpStatus.NOT_FOUND)})
    )
  }
}
