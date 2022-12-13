import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {FeetDto} from "./feet.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, FindOperator, Repository, UpdateResult} from "typeorm";
import {Feet} from "./feet.entity";
import {catchError, from, Observable, of, switchMap, tap} from "rxjs";
import {FeetInterface} from "./feet.interface";
import {UsersDto} from "../users/users.dto";
import {UsersInterface} from "../users/users.interface";

@Injectable()
export class FeetService {
  constructor(
    @InjectRepository(Feet)
    private feetRepository: Repository<Feet>
  ) {}

  createFeet(feet: FeetDto): Observable<FeetInterface | FeetDto> {
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
    return from(this.feetRepository.find({...options, order: { createdAt: 'DESC' }, relations: ['author', 'like']})).pipe(
      catchError(err => { throw new HttpException('db didn\'t not found feet.', HttpStatus.NOT_FOUND)})
    )
  }

  findFeetList(
    options: {
      where?: { [key: string]: string | FindOperator<string> | { [key: string]: string } },
      order?: { [key: string]: 'DESC' | 'ASC' | { [key: string]: 'DESC' | 'ASC' } },
      take?: number,
      skip?: number,
      relations?: string[],
    },
    user: UsersDto,
    ): Observable<FeetInterface[]> {
    return this.findFeet({...options, order: { createdAt: 'DESC' }, relations: ['author']}).pipe(
      switchMap((feetList: FeetInterface[]) => {
        // feetList.map((feet) => feet.like.filter(fe => fe.id === user.id));
        return of(feetList);
      }),
      catchError(err => { throw new HttpException('db didn\'t not found feet.', HttpStatus.NOT_FOUND)})
    )
  }

  updateFeet(id: string, feet: FeetDto): Observable<FeetInterface | FeetDto> {
    return from(this.feetRepository.update({ id }, feet )).pipe(
      switchMap(() => this.getFeet(id)),
      catchError(err => { throw new HttpException('Something went wrong when update feet.', HttpStatus.BAD_REQUEST)}),
    )
  }

  findOneFeet(options: {
    where?: { [key: string]: string | FindOperator<string> | { [key: string]: string } },
    order?: { [key: string]: 'DESC' | 'ASC' | { [key: string]: 'DESC' | 'ASC' } },
    relations?: string[],
  }) {
    return from(this.feetRepository.findOne(options))
  }

  findFeet(options: {
    where?: { [key: string]: string | FindOperator<string> | { [key: string]: string } },
    order?: { [key: string]: 'DESC' | 'ASC' | { [key: string]: 'DESC' | 'ASC' } },
    take?: number,
    skip?: number,
    relations?: string[],
  }) {
    return from(this.feetRepository.find(options))
  }

  likePost(feetID, user: UsersDto): Observable<FeetInterface> {
    return this.findOneFeet({ where: { id: feetID }, relations: ['like'] }).pipe(
      switchMap((feet: FeetInterface) => {
        feet.like.push(user as UsersInterface);
        return from(this.saveFeet(feet)).pipe(
          switchMap(() => {
            return this.findOneFeet({ where: { id: feetID }, relations: ['like'] }).pipe(
              switchMap((feet: FeetInterface) => {
                let myLike = feet.like.filter( person => person.id === user.id );
                feet.like_count = feet.like.length;
                return of({...feet, like: myLike}).pipe(
                  tap(() => this.saveFeet(feet).subscribe())
                );
              })
            )
          })
        )
      })
    )
  }

  deleteFeet(id: string): Observable<DeleteResult> {
    return  from(this.feetRepository.delete({ id })).pipe(
      catchError(err => { throw new HttpException('Something went wrong when delete feet.', HttpStatus.NOT_FOUND)})
    )
  }

  saveFeet(feet: FeetInterface | FeetDto): Observable<FeetInterface | FeetDto> {
    return from(this.feetRepository.save(feet));
  }
}
