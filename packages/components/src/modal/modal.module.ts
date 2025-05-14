import { NgModule } from '@angular/core';

import { NcModalBody } from './modal-body';
import { NcModalFooter } from './modal-footer';
import { NcModalHeader } from './modal-header';
import { NcModal } from './modal';

const EXPORTS_DECLARATIONS = [NcModal, NcModalHeader, NcModalBody, NcModalFooter];

@NgModule({
  imports: EXPORTS_DECLARATIONS,
  exports: EXPORTS_DECLARATIONS,
})
export class NcModalModule {}
