import { TestBed } from '@angular/core/testing';

import { PersonResolver } from './person.resolver';

describe('PersonResolver', () => {
  let resolver: PersonResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(PersonResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
