import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nc-avatar',
  template: '<img [src]="src" [alt]="alt">',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-avatar',
    '[class.rounded-full]': 'shape === "circle"',
  },
})
export class NcAvatar {
  @Input() size: string = '';

  private _shape: string = 'square';

  @Input()
  get shape() {
    return this._shape;
  }
  set shape(value: any) {
    value === 'circle' && (this._shape = value);
  }

  @Input() src: string = '';

  @Input() alt: string = '';
}
