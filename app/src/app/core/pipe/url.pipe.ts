import { Pipe, PipeTransform } from '@angular/core';
import {environment} from "../../../environments/environment";

@Pipe({
  name: 'url'
})
export class UrlPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return `${environment.configUrl}/${value}`;
  }

}
