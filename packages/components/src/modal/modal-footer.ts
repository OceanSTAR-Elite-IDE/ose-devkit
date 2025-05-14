import { Component } from '@angular/core';

@Component({
  selector: 'nc-modal-footer',
  template: `<ng-content />`,
  host: {
    class: 'nc-modal-footer',
  },
})
export class NcModalFooter {}
