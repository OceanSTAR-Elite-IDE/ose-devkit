import { CdkTreeNodePadding } from '@angular/cdk/tree';
import { Directive } from '@angular/core';

@Directive({
  selector: '[ncTreeNodePadding]',
  providers: [{ provide: CdkTreeNodePadding, useExisting: NcTreeNodePadding }],
  inputs: ['level:ncTreeNodePadding', 'indent:ncTreeNodePaddingIndent'],
})
export class NcTreeNodePadding<T> extends CdkTreeNodePadding<T> {}
