import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { Storage } from "@ionic/storage-angular";
import { HttpClient } from "@angular/common/http";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe('StorageService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: StorageService;

  let mockStorage = {
    set: (key, val) => {},
    get: (key) => {},
    remove: (key) => {},
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: Storage, useValue: mockStorage },
      ],
      imports: [ HttpClientTestingModule ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('set value in storage', () => {
    spyOn(mockStorage, 'set').and.callFake((key, val) => {});

    service.set('key', 'val');
    expect(mockStorage.set).toHaveBeenCalledOnceWith('key', 'val');
  })

  it('set value in storage', async () => {
    spyOn(mockStorage, 'get').and.callFake((key) => 'value');

    expect(await service.get('key')).toEqual('value');
    expect(mockStorage.get).toHaveBeenCalledOnceWith('key');
  })

  it('set value in storage', () => {
    spyOn(mockStorage, 'remove').and.callFake((key) => {});

    service.remove('key');
    expect(mockStorage.remove).toHaveBeenCalledOnceWith('key');
  })
});
