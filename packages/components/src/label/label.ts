import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nc-label, [nc-label]',
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-label',
  },
})
export class NcLabel {}
