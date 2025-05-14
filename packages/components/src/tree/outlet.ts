import { CDK_TREE_NODE_OUTLET_NODE, CdkTreeNodeOutlet } from '@angular/cdk/tree';
import { Directive, Inject, Optional, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ncTreeNodeOutlet]',
  providers: [{ provide: CdkTreeNodeOutlet, useExisting: NcTreeNodeOutlet }],
})
export class NcTreeNodeOutlet implements CdkTreeNodeOutlet {
  constructor(
    public viewContainer: ViewContainerRef,
    @Inject(CDK_TREE_NODE_OUTLET_NODE) @Optional() public _node?: any,
  ) {}
}
