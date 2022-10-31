import { TestBed } from '@angular/core/testing';

import { PostsResolver } from './posts.resolver';
import { PostService } from "../service/post.service";
import { of } from "rxjs";
import {ActivatedRouteSnapshot, RouterStateSnapshot} from "@angular/router";

describe('PostsResolver', () => {
  let resolver: PostsResolver;

  let mockPostService = {
    getPosts: (query) => of(true),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PostService, useValue: mockPostService },
      ]
    });
    resolver = TestBed.inject(PostsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should resolve PostsResolver', () => {
    spyOn(mockPostService, 'getPosts').and.returnValue(of(true));

    resolver.resolve({} as ActivatedRouteSnapshot, {} as RouterStateSnapshot).subscribe((bol: boolean) => {
      expect(mockPostService.getPosts).toHaveBeenCalledOnceWith({take: 6, skip:0});
      expect(bol).toBeTruthy();
    })
  })

});
