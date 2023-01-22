import { TestBed } from '@angular/core/testing';

import { PersonResolver } from './person.resolver';
import { PersonService } from "../service/person.service";
import {ActivatedRoute, ActivatedRouteSnapshot, convertToParamMap, RouterStateSnapshot} from "@angular/router";
import { of } from "rxjs";

describe('PersonResolver', () => {
  let resolver: PersonResolver;

  let mockPersonService = {
    getPerson: (feetID) => of(true),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PersonService, useValue: mockPersonService },
      ]
    });
    resolver = TestBed.inject(PersonResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return boolean PersonResolver', () => {
    spyOn(mockPersonService, "getPerson").and.returnValue(of(true));
    let feet = 'feetID';
    let route = {paramMap: { get: (id) => feet } } as ActivatedRouteSnapshot;

    resolver.resolve(route, {} as RouterStateSnapshot).subscribe((bol: boolean) => {
      expect(mockPersonService.getPerson).toHaveBeenCalledOnceWith(feet);
      expect(bol).toBeTruthy();
    });
  });
});
