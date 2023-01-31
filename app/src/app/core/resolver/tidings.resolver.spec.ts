import { TestBed } from '@angular/core/testing';

import { TidingsResolver } from './tidings.resolver';

describe('TidingsResolver', () => {
  let resolver: TidingsResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TidingsResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
