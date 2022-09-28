import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { Observable, throwError } from "rxjs";
import { PostInterface } from "../interface/post.interface";
import { PostQueryDto } from "../dto/post-query.dto";
import { catchError, tap } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class PostService {
  configUrl = environment.configUrl;

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(`Backend returned code ${error.status}, body was: `, error.error);
    }
    return throwError(() => new Error('Something bad happened; please try again later.'));
  }

  getPosts({take, skip}: PostQueryDto): Observable<PostInterface[]> {
    return this.http.get<PostInterface[]>(`${this.configUrl}/api/feet`,{
      params: {take, skip}
    }).pipe(catchError(this.handleError))
  }
}
