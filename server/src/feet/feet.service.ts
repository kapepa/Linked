import {BadRequestException, HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {FeetDto} from "./feet.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, FindOperator, Repository, UpdateResult} from "typeorm";
import {Feet} from "./feet.entity";
import {catchError, from, Observable, of, switchMap, tap, toArray} from "rxjs";
import {FeetInterface} from "./feet.interface";
import {UsersDto} from "../users/users.dto";
import {UsersInterface} from "../users/users.interface";
import {CommentInterface} from "./comment.interface";
import {CommentEntity} from "./comment.entity";

@Injectable()
export class FeetService {
  constructor(
    @InjectRepository(Feet)
    private feetRepository: Repository<Feet>,
    @InjectRepository(CommentEntity)
    private commentRepository: Repository<CommentEntity>,
  ) {}

  createFeet(feet: FeetDto): Observable<FeetInterface | FeetDto> {
    return from(this.feetRepository.save(feet)).pipe(
      catchError(err => { throw err })
    );
  }

  getFeet(id: string): Observable<FeetInterface> {
    return this.findOneFeet({ where: { id }, relations: ['author', 'comments', 'comments.host'] }).pipe(
      switchMap((feet: FeetInterface) => {
        return this.findComment({
          where: { feet: { id: feet.id } },
          order: { createdAt: 'DESC' },
          relations: ['host'],
          take: 20,
          skip: 0,
        }).pipe(
          switchMap((comments: CommentInterface[]) => {
            return of({ ...feet, comments })
          })
        );
      })
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
    return this.findFeet({...options, order: { createdAt: 'DESC' }, relations: ['author', 'like']}).pipe(
      switchMap((feetList: FeetInterface[]) => {
        return of(feetList).pipe(
          switchMap((feet:FeetInterface[]) => {
            return from(feet)
              .pipe(
                switchMap(( feet: FeetInterface) => {
                  feet.like = feet.like.filter(person => person.id === user.id);
                  return of(feet);
                }),
                toArray(),
              )
          })
        )
      }),
      catchError(err => { throw new HttpException('db didn\'t not found feet.', HttpStatus.NOT_FOUND)})
    )
  }

  likePost(feetID, user: UsersDto): Observable<FeetInterface> {
    return this.findOneFeet({ where: { id: feetID }, relations: ['like'] }).pipe(
      switchMap((feet: FeetInterface) => {
        let index = feet.like.findIndex(person => person.id === user.id);
        index === -1 ?  feet.like.push(user as UsersInterface) : feet.like.splice(index, 1);
        return from(this.saveFeet(feet)).pipe(
          switchMap(() => {
            return this.findOneFeet({ where: { id: feetID }, relations: ['author', 'like'] }).pipe(
              switchMap((feet: FeetInterface) => {
                let myLike = feet.like.filter( person => person.id === user.id );
                feet.like_count = feet.like.length;
                return of({...feet, like: myLike}).pipe(
                  tap(() => this.saveFeet(feet).subscribe()),
                );
              })
            )
          })
        )
      })
    )
  }

  commentCreate(feetID: string, comment: CommentInterface, user: UsersDto): Observable<any> {
    return this.findOneFeet({ where: { id: feetID }, relations: ['comments'] }).pipe(
      switchMap((feet: FeetInterface) => {
        return this.saveComment({...comment, host: user as UsersInterface, feet }).pipe(
          switchMap((comment) => this.findOneComment({
            where: { id: comment.id },
            relations: ['host'],
          }))
        )
      })
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
  }): Observable<FeetInterface> {
    return from(this.feetRepository.findOne(options))
  }

  findOneComment(options?: {
    where?: { [key: string]: string | FindOperator<string> | { [key: string]: string } },
    relations?: string[],
  }): Observable<CommentInterface> {
    return from(this.commentRepository.findOne(options));
  }

  findComment(options?: {
    where?: { [key: string]: string | FindOperator<string> | { [key: string]: string } },
    order?: { [key: string]: 'DESC' | 'ASC' | { [key: string]: 'DESC' | 'ASC' } },
    relations?: string[],
    take?: number,
    skip?: number,
  }): Observable<CommentInterface[]> {
    return from(this.commentRepository.find(options));
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

  deleteFeet(id: string): Observable<DeleteResult> {
    return  from(this.feetRepository.delete({ id })).pipe(
      catchError(err => { throw new HttpException('Something went wrong when delete feet.', HttpStatus.NOT_FOUND)})
    )
  }

  deleteComment(commentID: string, user: UsersDto): Observable<DeleteResult> {
    return from(this.findOneComment({ where: { id: commentID }, relations: ['host'] })).pipe(
      switchMap((feet: CommentInterface) => {
        if(feet.host.id !== user.id) throw new HttpException('You didn\'t delete this comment', HttpStatus.FORBIDDEN);
        return from(this.commentRepository.delete({ id: commentID }));
      })
    );
  }

  saveFeet(feet: FeetInterface | FeetDto): Observable<FeetInterface | FeetDto> {
    return from(this.feetRepository.save(feet));
  }

  saveComment(comment: CommentInterface): Observable<CommentInterface>{
    return from(this.commentRepository.save(comment));
  }
}
