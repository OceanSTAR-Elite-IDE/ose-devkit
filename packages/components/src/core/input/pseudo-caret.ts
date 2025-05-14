import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nc-pseudo-caret',
  template: '<ng-content></ng-content>',
  styles: `
    .nc-pseudo-caret {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      right: var(--nc-pseudo-caret-padding);
      font-size: 1em;
      line-height: 1.5rem;
      color: var(--nc-input-color-placeholder);
      pointer-events: none;
    }
  `,
  encapsulation: ViewEncapsulation.None,
})
export class NcPseudoCaret {}
