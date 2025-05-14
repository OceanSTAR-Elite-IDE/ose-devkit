import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ncSum',
})
export class NcSumPipe implements PipeTransform {
  transform(items: any[], attr: string): any {
    return items.reduce((a, b) => a + b[attr], 0);
  }
}
