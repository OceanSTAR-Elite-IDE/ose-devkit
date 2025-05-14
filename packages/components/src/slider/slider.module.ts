import { NgModule } from '@angular/core';

import { NcSliderInput } from './slider-input';
import { NcSliderRange } from './slider-range';
import { NcSlider } from './slider';

@NgModule({
  imports: [NcSlider, NcSliderRange, NcSliderInput],
  exports: [NcSlider, NcSliderRange, NcSliderInput],
})
export class NcSliderModule {}
