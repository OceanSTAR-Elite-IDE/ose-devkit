import { Component } from '@angular/core';

@Component({
  selector: 'nc-modal-body',
  template: `<ng-content />`,
  host: {
    class: 'nc-modal-body',
  },
})
export class NcModalBody {}
