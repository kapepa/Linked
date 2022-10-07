import { TestBed } from '@angular/core/testing';

import { PostsResolver } from './posts.resolver';

describe('PostsResolver', () => {
  let resolver: PostsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PostsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
