import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ncSum',
  standalone: true
})
export class NcSumPipe implements PipeTransform {
  transform(items: any[], attr?: string | ((item: any) => number)): any {

    if (!Array.isArray(items)) {
      return 0;
    }

    if(attr) {
      if(typeof attr === 'function') {
        return items.reduce((acc, item) => acc + attr(item), 0);
      } else if (typeof attr === 'string') {
        return items.reduce((acc, item) => acc + item[attr], 0);
      }
    } else {
      return items?.length || 0;
    }
  }
}

