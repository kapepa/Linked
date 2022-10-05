import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: Storage,
  ) { }

  public set(key: string, value: any) {
    this.storage.set(key, value);
  }

  public async get(key: string) {
    return await this.storage.get(key);
  }

  public remove(key: string){
    this.storage.remove(key);
  }
}
