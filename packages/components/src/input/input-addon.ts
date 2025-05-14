import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'nc-input-addon, [nc-input-addon]',
  template: `<ng-content />`,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'nc-input-addon',
  },
})
export class NcInputAddon {}
