import { Subject } from 'rxjs';

import { Directive, Input, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';

export declare type NcFormOrientationType = 'vertical' | 'horizontal';

@Directive({
  selector: 'form[ncFormOrientation]',
})
export class NcFormOrientation implements OnChanges, OnDestroy {
  private readonly _typeChange = new Subject<NcFormOrientationType>();

  private _type!: NcFormOrientationType;

  @Input('ncFormOrientationType')
  get type() {
    return this._type;
  }
  set type(value: NcFormOrientationType) {
    this._type = value;
  }

  get typeChange() {
    return this._typeChange.asObservable();
  }

  ngOnChanges(changes: SimpleChanges) {
    const change = changes['type'];
    if (change.currentValue !== change.previousValue) {
      this._typeChange.next(change.currentValue);
    }
  }

  ngOnDestroy() {
    this._typeChange.complete();
  }
}
