import { TestBed } from '@angular/core/testing';

import { PostService } from './post.service';
import { HttpService } from "./http.service";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { PostClass } from "../../../utils/post-class";

describe('PostService', () => {
  let service: PostService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let mockPost = PostClass;

  let mockHttpService = {
    handleError: (err) => {},
  };

  const mockDeleteResult = {
    raw: [],
    affected: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PostService,
        { provide: HttpService, useValue: mockHttpService },
      ],
      imports: [ HttpClientTestingModule ],
    });

    service = TestBed.inject(PostService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('get post PostInterface[], on query', () => {
    let url;
    let query = { take: 1, skip: 0 };

    beforeEach(() => {
      url = `${service.configUrl}/api/feet`
    })

    it('success get PostInterface[]', () => {
      service.getPosts(query).subscribe({
        next: posts => {
          expect(posts).toEqual(service.posts);
        },
        error: fail
      });

      const req = httpTestingController.expectOne(`${url}?take=${query.take}&skip=${query.skip}`);
      expect(req.request.method).toEqual('GET');
      req.flush([mockPost]);
    })

    it('should turn 404 into a posts[] error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);

      service.getPosts(query).subscribe({
        next: posts => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse),
      });

      const req = httpTestingController.expectOne(`${url}?take=${query.take}&skip=${query.skip}`);
      expect(req.request.method).toEqual('GET');
      req.flush(errorResponse, {...errorResponse});
    });
  })

  describe('create new post, createPost()', () => {
    let url;
    let mockBody = { body: 'Mock create new Body' }

    beforeEach(() => {
      url = `${service.configUrl}/api/feet/create`;
      service.posts = [mockPost];
    })

    it('should success create post', () => {
      service.createPost(mockBody).subscribe({
        next: post => {
          expect(service.posts.length).toEqual(2);
        },
        error: fail
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      req.flush({...mockPost, ...mockBody});
    })

    it('should turn 404 into a user-friendly error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);

      service.createPost(mockBody).subscribe({
        next: post => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse),
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('POST');
      req.flush(errorResponse, {...errorResponse});
    });
  })

  describe('update post, updatePost()', () => {
    let url;
    let mockUpdate = { body: 'Update body' };

    beforeEach(() => {
      url = `${service.configUrl}/api/feet/update/${mockPost.id}`;
      service.posts = [mockPost];
    })

    it('success update', () => {
      service.updatePost(service.posts.length - 1, mockPost.id, mockUpdate).subscribe({
        next: post => {
          expect([post]).toEqual(service.posts);
        },
        error: fail
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('PATCH');
      req.flush({...mockPost, ...mockUpdate});
    })

    it('should turn 404 into a user-friendly error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);

      service.updatePost(service.posts.length - 1, mockPost.id, mockUpdate).subscribe({
        next: post => fail('expected to fail'),
        error: error => console.log(error),
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('PATCH');
      req.flush(errorResponse,{...errorResponse});
    });
  })

  describe('delete post, deletePost()', () => {
    let url;

    beforeEach(() => {
      url = `${service.configUrl}/api/feet/${mockPost.id}`;
      service.posts = [mockPost];
    })

    it('success delete post on id', () => {
      service.deletePost(service.posts.length -1, mockPost.id).subscribe({
        next: res => {
          expect(res).toEqual(mockDeleteResult);
          expect(service.posts.length).toEqual(0);
        },
        error: fail,
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(mockDeleteResult);
    })

    it('should turn 404 into a delete post error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404, statusText: 'Not Found'
      });
      spyOn(mockHttpService, 'handleError').and.throwError(errorResponse);

      service.deletePost(service.posts.length -1, mockPost.id).subscribe({
        next: post => fail('expected to fail'),
        error: error => expect(error).toEqual(errorResponse)
      });

      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toEqual('DELETE');
      req.flush(errorResponse, {...errorResponse});
    });
  })

  describe('getter post length', () => {
    beforeEach(() => {
      service.posts$.next([mockPost]);
    })

    it('return length PostInterface[]', () => {
      service.postLength.subscribe((len: number) => {
        expect(len).toEqual(1);
      })
    })
  })
});
