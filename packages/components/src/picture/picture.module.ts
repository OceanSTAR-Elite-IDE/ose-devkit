import { NgModule } from '@angular/core';
import { NcFileModule } from '@oceanstar/components/core';

import { NcPicture } from './picture';

@NgModule({
  imports: [NcFileModule, NcPicture],
  exports: [NcFileModule, NcPicture],
})
export class NcPictureModule {}
