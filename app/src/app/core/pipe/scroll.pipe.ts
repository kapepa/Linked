import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'scroll'
})
export class ScrollPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    console.log(value)
    return null;
  }

}
