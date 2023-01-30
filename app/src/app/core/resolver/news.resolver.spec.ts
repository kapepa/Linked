import { TestBed } from '@angular/core/testing';

import { NewsResolver } from './news.resolver';

describe('NewsResolver', () => {
  let resolver: NewsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(NewsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
