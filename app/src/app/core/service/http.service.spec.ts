import { TestBed } from '@angular/core/testing';

import { HttpService } from './http.service';
import {PopoverController} from "@ionic/angular";
import {HttpErrorResponse} from "@angular/common/http";

describe('HttpService', () => {
  let service: HttpService;

  let mockPopoverController = {
    create: () => ({ present: () => {} }),
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PopoverController, useValue: mockPopoverController },
      ]
    });
    service = TestBed.inject(HttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('handle error', () => {
    spyOn(service,"presentPopover");
    const errorResponse = new HttpErrorResponse({
      error: 'test 404 error',
      status: 404,
      statusText: 'Not Found',
    });

    service.handleErrorFn(errorResponse).subscribe({
      error: (err) => {
        expect(err).toBeDefined();
        expect(service.presentPopover).toHaveBeenCalledOnceWith(errorResponse.error);
      },
    })
  })

});
