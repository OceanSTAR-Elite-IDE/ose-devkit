import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nc-pseudo-caret',
  template: '<ng-content></ng-content>',
  styles: `
    .nc-pseudo-caret {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      font-size: 1em;
      min-height: 1.5em;
      color: var(--nc-input-color-placeholder);
      pointer-events: none;
    }
  `,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-pseudo-caret',
  },
})
export class NcPseudoCaret {}
