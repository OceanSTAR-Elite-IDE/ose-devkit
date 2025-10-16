import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'lib-time-picker',
  imports: [CommonModule],
  template: `
    <div class="nc-time-picker h-full w-[180px] border-l border-gray-200 bg-white">
      <div class="flex h-full">
        <!-- 小时列 -->
        <div class="flex-1 border-r border-gray-200">
          <div class="scrollbar-thin scrollbar-thumb-gray-300 h-full overflow-y-auto" #hoursContainer>
            <div
              *ngFor="let h of hours; trackBy: trackByHour"
              class="flex h-8 cursor-pointer items-center justify-center text-sm transition-colors duration-150 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              [attr.aria-label]="'选择' + h + '时'"
              [ngClass]="[getHourButtonClass(h), hour === h ? 'hover:bg-blue-800' : '']"
              (click)="onHourSelect(h)"
              (keyup.enter)="onHourSelect(h)"
              (keyup.space)="onHourSelect(h)"
              role="button"
              tabindex="0">
              {{ h.toString().padStart(2, '0') }}
            </div>
          </div>
        </div>

        <!-- 分钟列 -->
        <div class="flex-1">
          <div class="scrollbar-thin scrollbar-thumb-gray-300 h-full overflow-y-auto" #minutesContainer>
            <div
              *ngFor="let m of minutes; trackBy: trackByMinute"
              class="flex h-8 cursor-pointer items-center justify-center text-sm transition-colors duration-150 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              [attr.aria-label]="'选择' + m + '分'"
              [ngClass]="[getMinuteButtonClass(m), minute === m ? 'hover:bg-blue-800' : '']"
              (click)="onMinuteSelect(m)"
              (keyup.enter)="onMinuteSelect(m)"
              (keyup.space)="onMinuteSelect(m)"
              role="button"
              tabindex="0">
              {{ m.toString().padStart(2, '0') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'nc-time-picker-container',
  },
})
export class NcTimePicker implements AfterViewInit {
  @Input() hour = 0;
  @Input() minute = 0;

  @Output() hourChange = new EventEmitter<number>();
  @Output() minuteChange = new EventEmitter<number>();
  @Output() timeChange = new EventEmitter<{ hour: number; minute: number }>();
  @Output() hourSelected = new EventEmitter<{ hour: number; minute: number }>();
  @Output() minuteSelected = new EventEmitter<{ hour: number; minute: number }>();

  @ViewChild('hoursContainer') hoursContainer!: ElementRef;
  @ViewChild('minutesContainer') minutesContainer!: ElementRef;

  hours = Array.from({ length: 24 }, (_, i) => i);
  minutes = Array.from({ length: 60 }, (_, i) => i);

  ngAfterViewInit() {
    // 滚动到选中的时间
    this.scrollToSelected();
  }

  onHourSelect(hour: number) {
    this.hour = hour;
    this.hourChange.emit(hour);
    this.timeChange.emit({ hour: this.hour, minute: this.minute });
    this.hourSelected.emit({ hour: this.hour, minute: this.minute });
    this.scrollSelectedIntoView('hour');
  }

  onMinuteSelect(minute: number) {
    this.minute = minute;
    this.minuteChange.emit(minute);
    this.timeChange.emit({ hour: this.hour, minute: this.minute });
    this.minuteSelected.emit({ hour: this.hour, minute: this.minute });
    this.scrollSelectedIntoView('minute');
  }

  getHourButtonClass(h: number): string {
    return h === this.hour ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700 hover:bg-blue-50';
  }

  getMinuteButtonClass(m: number): string {
    return m === this.minute ? 'bg-blue-600 text-white font-semibold' : 'text-gray-700 hover:bg-blue-50';
  }

  trackByHour(index: number, hour: number): number {
    return hour;
  }

  trackByMinute(index: number, minute: number): number {
    return minute;
  }

  private scrollToSelected() {
    setTimeout(() => {
      if (this.hoursContainer) {
        const hourElement = this.hoursContainer.nativeElement.children[this.hour];
        if (hourElement) {
          hourElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }

      if (this.minutesContainer) {
        const minuteElement = this.minutesContainer.nativeElement.children[this.minute];
        if (minuteElement) {
          minuteElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }, 100);
  }

  private scrollSelectedIntoView(type: 'hour' | 'minute') {
    setTimeout(() => {
      if (type === 'hour' && this.hoursContainer) {
        const hourElement = this.hoursContainer.nativeElement.children[this.hour];
        if (hourElement) {
          hourElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      } else if (type === 'minute' && this.minutesContainer) {
        const minuteElement = this.minutesContainer.nativeElement.children[this.minute];
        if (minuteElement) {
          minuteElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    }, 50);
  }
}
