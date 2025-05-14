import { NgModule } from '@angular/core';
import { NcOption } from '@oceanstar/components/core';
import { NcOverlay } from '@oceanstar/components/overlay';

import { NcAutocomplete } from './autocomplete';
import { NcAutocompleteOrigin } from './autocomplete-origin';
import { NC_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER, NcAutocompleteTrigger } from './autocomplete-trigger';

@NgModule({
  imports: [NcOption, NcOverlay, NcAutocomplete, NcAutocompleteTrigger, NcAutocompleteOrigin],
  exports: [NcOption, NcOverlay, NcAutocomplete, NcAutocompleteTrigger, NcAutocompleteOrigin],
  providers: [NC_AUTOCOMPLETE_SCROLL_STRATEGY_FACTORY_PROVIDER],
})
export class NcAutocompleteModule {}
