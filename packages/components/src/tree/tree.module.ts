import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NcNestedTreeNode, NcTreeNodeDef, NcTreeNode } from './node';
import { NcTreeNodeOutlet } from './outlet';
import { NcTreeNodePadding } from './padding';
import { NcTreeNodeToggle } from './toggle';
import { NcTree } from './tree';

const NC_TREE_DIRECTIVES = [
  NcNestedTreeNode,
  NcTreeNodeDef,
  NcTreeNodePadding,
  NcTreeNodeToggle,
  NcTree,
  NcTreeNode,
  NcTreeNodeOutlet,
];

@NgModule({
  imports: [CdkTreeModule, CommonModule, ...NC_TREE_DIRECTIVES],
  exports: NC_TREE_DIRECTIVES,
})
export class NcTreeModule {}
