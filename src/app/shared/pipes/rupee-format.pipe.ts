import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rupeeFormat'
})
export class RupeeFormatPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
