import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ncTreeNodeToggle]',
  providers: [{ provide: CdkTreeNodeToggle, useExisting: NcTreeNodeToggle }],
  inputs: ['recursive: ncTreeNodeToggleRecursive'],
})
export class NcTreeNodeToggle<T> extends CdkTreeNodeToggle<T> {}
