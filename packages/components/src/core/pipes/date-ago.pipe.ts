import { Pipe, PipeTransform } from '@angular/core';

const INTERVALS: { [key: string]: number } = {
  年: 31536000,
  月: 2592000,
  周: 604800,
  天: 86400,
  小时: 3600,
  分钟: 60,
  秒: 1,
};

@Pipe({
  name: 'dateAgo',
  standalone: true,
})
export class DateAgoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 15)
        // less than 10 seconds ago will show as 'Just now'
        return '刚刚';

      let counter;
      for (const i in INTERVALS) {
        counter = Math.floor(seconds / INTERVALS[i]);
        if (counter > 0) {
          return counter + ' ' + i + '前'; // singular (1 day ago)
        }
      }
    }
    return value;
  }
}
