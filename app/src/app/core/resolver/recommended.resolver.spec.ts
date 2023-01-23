import { TestBed } from '@angular/core/testing';

import { RecommendedResolver } from './recommended.resolver';

describe('RecommendedResolver', () => {
  let resolver: RecommendedResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(RecommendedResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
