import { RectangularNodeView, RenderingContext, SShapeElement } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import * as snabbdom from 'snabbdom-jsx';
import { VNode } from 'snabbdom/vnode';

import { getActivityIconDecorator } from '../icon/views';
import { ActivityNode } from '../model';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JSX = { createElement: snabbdom.svg };

@injectable()
export class ActivityNodeView extends RectangularNodeView {
  render(node: ActivityNode, context: RenderingContext): VNode {
    const rcr = this.getRoundedCornerRadius(node);
    return <g>
      <rect class-sprotty-node={true} class-task={true} class-animate={node.animated}
        class-mouseover={node.hoverFeedback} class-selected={node.selected}
        x={0} y={0} rx={rcr} ry={rcr}
        width={Math.max(0, node.bounds.width)} height={Math.max(0, node.bounds.height)}></rect>
      {getActivityIconDecorator(node.icon)}
      {this.getNodeDecorator(node)}
      {context.renderChildren(node)}
    </g>;
  }

  protected getNodeDecorator(node: ActivityNode): VNode {
    return <g></g>;
  }

  protected getRoundedCornerRadius(node: SShapeElement): number {
    return 5;
  }
}

@injectable()
export class SubActivityNodeView extends ActivityNodeView {
  protected getNodeDecorator(node: ActivityNode): VNode {
    const diameter = 10;
    const radius = diameter / 2;
    const padding = 2;
    return <svg x={node.bounds.width / 2 - radius} y={node.bounds.height - diameter}>
      <rect class-sprotty-node={true} class-sprotty-task-node={true}
        width={diameter} height={diameter} />
      <line class-sprotty-node-decorator x1={radius} y1={padding} x2={radius} y2={diameter - padding} />
      <line class-sprotty-node-decorator x1={padding} y1={radius} x2={diameter - padding} y2={radius} />
    </svg>;
  }
}
