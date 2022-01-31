import { Operation, SModelElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { Edge } from '../diagram/model';

import { QuickAction, QuickActionLocation, SingleQuickActionProvider } from '../quick-action/quick-action';

export class StraightenEdgeOperation implements Operation {
  static readonly KIND = 'straightenEdge';

  constructor(public readonly elementId: string, public readonly kind: string = StraightenEdgeOperation.KIND) {}
}

@injectable()
export class StraightenEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof Edge) {
      return new StraightenEdgeQuickAction(element.id);
    }
    return undefined;
  }
}

class StraightenEdgeQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-arrows-alt-h',
    public readonly title = 'Staighten',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'A',
    public readonly action = new StraightenEdgeOperation(elementId)
  ) {}
}

export class AutoBendEdgeOperation implements Operation {
  static readonly KIND = 'autoBendEdge';

  constructor(public readonly elementId: string, public readonly kind: string = AutoBendEdgeOperation.KIND) {}
}

@injectable()
export class AutoBendEdgeQuickActionProvider extends SingleQuickActionProvider {
  singleQuickAction(element: SModelElement): QuickAction | undefined {
    if (element instanceof Edge) {
      return new AutoBendEdgeQuickAction(element.id);
    }
    return undefined;
  }
}

class AutoBendEdgeQuickAction implements QuickAction {
  constructor(
    public readonly elementId: string,
    public readonly icon = 'fa-bolt',
    public readonly title = 'Bend',
    public readonly location = QuickActionLocation.BottomLeft,
    public readonly sorting = 'B',
    public readonly action = new AutoBendEdgeOperation(elementId)
  ) {}
}
