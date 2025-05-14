import { CdkTree } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, ViewChild, ViewEncapsulation } from '@angular/core';

import { NcTreeNodeOutlet } from './outlet';

@Component({
  imports: [NcTreeNodeOutlet],
  selector: 'nc-tree, [nc-tree]',
  template: `<ng-container ncTreeNodeOutlet />`,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: CdkTree, useExisting: NcTree }],
  host: {
    class: 'nc-tree',
  },
})
export class NcTree<T> extends CdkTree<T> {
  @ViewChild(NcTreeNodeOutlet, { static: true }) override _nodeOutlet: NcTreeNodeOutlet = undefined!;
}
