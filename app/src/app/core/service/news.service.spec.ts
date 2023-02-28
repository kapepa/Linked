import { TestBed } from '@angular/core/testing';
import { NewsService } from './news.service';
import {HttpService} from "./http.service";
import {HttpClient, HttpErrorResponse, HttpRequest, HttpResponse} from "@angular/common/http";
import {NewsClass} from "../../../utils/news-class";
import {NewsInterface} from "../interface/news.interface";
import {from, of, Subject} from "rxjs";
import {CUSTOM_ELEMENTS_SCHEMA} from "@angular/core";
import {RouterTestingModule} from "@angular/router/testing";
import {RouterModule} from "@angular/router";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {asyncError} from "../../../testing/async-observable-helpers";



describe('NewsService', () => {
  let service: NewsService;
  let spyHttpService: HttpService;
  let httpTestingController: HttpTestingController;

  let newsClass = NewsClass;

  let errorResponse = new HttpErrorResponse({error: 'test 404 error', status: 404, statusText: 'Not Found'});

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [
        NewsService,
        { provide: HttpService, useValue: { toForm: () => {}, handleError: (err: HttpErrorResponse) => {} } },
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    });

    service = TestBed.inject(NewsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    spyHttpService = TestBed.inject(HttpService) as jasmine.SpyObj<HttpService>;
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  describe('createNews', () => {

    it('should return expected news NewsInterface', (done: DoneFn) => {
      spyOn(spyHttpService, 'toForm').and.callFake( () => new FormData() );

      service.createNews(newsClass).subscribe({
        next: ( news: NewsInterface ) => {
          expect(news).toEqual(service.news);
          done();
        },
        error: fail
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/news/create`);
      expect(req.request.method).toEqual('POST');
      expect(spyHttpService.toForm).toHaveBeenCalledWith(newsClass);

      req.flush(newsClass);
    })

    it('should turn network error', (done: DoneFn) => {
      spyOn(spyHttpService, 'toForm').and.callFake( () => new FormData() );
      spyOn(spyHttpService, 'handleError').and.returnValue(asyncError(errorResponse))

      service.createNews(newsClass).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err).toEqual(errorResponse);
          done();
        }
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/news/create`);
      expect(req.request.method).toEqual('POST');
      expect(spyHttpService.toForm).toHaveBeenCalledWith(newsClass);

      req.flush('create news error', errorResponse);
    })
  })

  describe('getOneNews', () => {
    it('should be return one news on id', (done: DoneFn) => {
      service.getOneNews('newsID').subscribe({
        next: (news: NewsInterface) => {
          service.getNews.subscribe((getNews:NewsInterface) => {
            expect(news).toEqual(getNews);
            done();
          })
        },
        error: () => done.fail,
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/news/one/${newsClass.id}`);
      expect(req.request.method).toEqual('GET');

      req.flush(newsClass)
    })

    it('should be return error', (done: DoneFn) => {
      spyOn(spyHttpService, 'handleError').and.returnValue(asyncError(errorResponse));

      service.getOneNews(newsClass.id as string).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err).toEqual(errorResponse);
          done();
        }
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/news/one/${newsClass.id}`);
      expect(req.request.method).toEqual('GET');

      req.flush('create news error', errorResponse);
    })
  })

  describe('findTidings', () => {
    const query = {take: 5, skip: 0}

    it('should return array news', (done: DoneFn) => {
      const expectedResponse = new HttpResponse({ status: 200, body: [newsClass] })

      service.findTidings(query).subscribe({
        next: (news: NewsInterface[]) => {
          service.getTidings.subscribe((tidings: NewsInterface[]) => {
            expect(tidings).toEqual(news);
          })
          done();
        },
        error: () => done.fail,
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/news/find?take=${query.take}&skip=${query.skip}`);
      expect(req.request.method).toEqual('GET');
      req.event(expectedResponse);
    })

    it('should turn network error', (done: DoneFn) => {
      const errorEvent = new ProgressEvent('error');

      service.findTidings(query).subscribe({
        next: () => done.fail,
        error: (err: HttpErrorResponse) => {
          expect(err.status).toEqual(404);
          done();
        }
      })

      const req = httpTestingController.expectOne(`${service.configUrl}/api/news/find?take=${query.take}&skip=${query.skip}`);
      req.flush('error', errorResponse);
    })
  })

  describe('setNewsLoader, getNewsLoader', () => {
    it('set newsLoader, get getNewsLoader', () => {
      service.setNewsLoader = !service.newsLoader;

      expect(service.getNewsLoader).toBeTruthy();
    })
  })

  describe('setTidings, getTidings', () => {
    it('set new array news, get new array news', () => {
      let newsArray = [newsClass] as any[];
      service.setTidings = newsArray;

      service.getTidings.subscribe((news: NewsInterface[]) => {
        expect(news).toEqual(newsArray);
      })
    })
  })

  describe('setNews, getNews', () => {
    it('set news, get news', () => {
      let news = newsClass as any;
      service.setNews = news;

      service.getNews.subscribe((news: NewsInterface) => {
        expect(news).toEqual(news);
      })
    })
  })

});
