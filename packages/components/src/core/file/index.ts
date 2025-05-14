import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NcFileSelect } from './file-select';
import { NcFileSizePipe } from './file-size.pipe';

export * from './file-categories';
export * from './file-select-errors';
export * from './file-utils';
export * from './file-select';
export * from './file-size.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [NcFileSizePipe, NcFileSelect],
  exports: [NcFileSizePipe, NcFileSelect],
})
export class NcFileModule {}
