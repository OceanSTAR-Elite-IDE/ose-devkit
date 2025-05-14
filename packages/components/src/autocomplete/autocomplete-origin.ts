import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[ncAutocompleteOrigin]',
  exportAs: 'ncAutocompleteOrigin',
})
export class NcAutocompleteOrigin {
  constructor(public elementRef: ElementRef<HTMLElement>) {}
}
