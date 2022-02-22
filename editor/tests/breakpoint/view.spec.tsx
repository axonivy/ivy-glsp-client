import {
  configureView,
  defaultModule,
  graphModule,
  IVNodePostprocessor,
  ModelRenderer,
  ModelRendererFactory,
  moveModule,
  routingModule,
  selectModule,
  SGraph,
  SModelFactory,
  SNode,
  TYPES,
  ViewRegistry
} from '@eclipse-glsp/client';
import baseViewModule from '@eclipse-glsp/client/lib/views/base-view-module';
import { DefaultTypes } from '@eclipse-glsp/protocol';
import { expect } from 'chai';
import { Container } from 'inversify';

import { SBreakpointHandle } from '../../src/breakpoint/model';
import { SBreakpointHandleView } from '../../src/breakpoint/view';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const toHTML = require('snabbdom-to-html');

function createContainer(): Container {
  const container = new Container();
  container.load(defaultModule, baseViewModule, selectModule, moveModule, graphModule, routingModule);
  configureView(container, SBreakpointHandle.TYPE, SBreakpointHandleView);
  return container;
}

function createModel(graphFactory: SModelFactory): SGraph {
  const node = {
    id: 'node',
    type: DefaultTypes.NODE,
    position: { x: 100, y: 100 },
    size: { width: 200, height: 50 },
    children: [
      { id: 'breakpoint', condition: 'true', type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-disabled', disabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition', condition: 'bla', type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition-disabled', condition: 'bla', disabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-globaldisabled', globalDisabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-disabled-globaldisabled', disabled: true, globalDisabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition-globaldisabled', condition: 'bla', globalDisabled: true, type: SBreakpointHandle.TYPE },
      { id: 'breakpoint-condition-disabled-globaldisabled', condition: 'bla', disabled: true, globalDisabled: true, type: SBreakpointHandle.TYPE }
    ]
  };
  const graph = graphFactory.createRoot({ id: 'graph', type: 'graph', children: [node] }) as SGraph;
  return graph;
}

describe('GeneralView', () => {
  let context: ModelRenderer;
  let graphFactory: SModelFactory;
  let viewRegistry: ViewRegistry;
  let graph: SGraph;

  beforeEach(() => {
    const container = createContainer();
    const postprocessors = container.getAll<IVNodePostprocessor>(TYPES.IVNodePostprocessor);
    context = container.get<ModelRendererFactory>(TYPES.ModelRendererFactory)('hidden', postprocessors);
    graphFactory = container.get<SModelFactory>(TYPES.IModelFactory);
    viewRegistry = container.get<ViewRegistry>(TYPES.ViewRegistry);
    graph = createModel(graphFactory);
  });

  it('render breakpoint', () => {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    const vnode = view.render(graph.index.getById('breakpoint') as SNode, context);
    const expectation = '<g><circle class="ivy-breakpoint-handle" cx="-7" cy="7" r="5" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render disabled breakpoint', () => {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    const vnode = view.render(graph.index.getById('breakpoint-disabled') as SNode, context);
    const expectation = '<g><circle class="ivy-breakpoint-handle disabled" cx="-7" cy="7" r="5" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render condition breakpoint', () => {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    const vnode = view.render(graph.index.getById('breakpoint-condition') as SNode, context);
    const expectation = '<g><circle class="ivy-breakpoint-handle condition" cx="-7" cy="7" r="5" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render condition disabled breakpoint', () => {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    const vnode = view.render(graph.index.getById('breakpoint-condition-disabled') as SNode, context);
    const expectation = '<g><circle class="ivy-breakpoint-handle disabled condition" cx="-7" cy="7" r="5" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render (globalDisabled) breakpoint', () => {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    const vnode = view.render(graph.index.getById('breakpoint-globaldisabled') as SNode, context);
    const expectation = '<g><circle class="ivy-breakpoint-handle" cx="-7" cy="7" r="5" /><line class="ivy-breakpoint-handle-globaldisable" x1="-12" y1="2" x2="-2" y2="12" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render disabled (globalDisabled) breakpoint', () => {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    const vnode = view.render(graph.index.getById('breakpoint-disabled-globaldisabled') as SNode, context);
    const expectation =
      '<g><circle class="ivy-breakpoint-handle disabled" cx="-7" cy="7" r="5" /><line class="ivy-breakpoint-handle-globaldisable" x1="-12" y1="2" x2="-2" y2="12" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render condition (globalDisabled) breakpoint', () => {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    const vnode = view.render(graph.index.getById('breakpoint-condition-globaldisabled') as SNode, context);
    const expectation =
      '<g><circle class="ivy-breakpoint-handle condition" cx="-7" cy="7" r="5" /><line class="ivy-breakpoint-handle-globaldisable" x1="-12" y1="2" x2="-2" y2="12" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render condition disabled (globalDisabled) breakpoint', () => {
    const view = viewRegistry.get(SBreakpointHandle.TYPE);
    const vnode = view.render(graph.index.getById('breakpoint-condition-disabled-globaldisabled') as SNode, context);
    const expectation =
      '<g><circle class="ivy-breakpoint-handle disabled condition" cx="-7" cy="7" r="5" /><line class="ivy-breakpoint-handle-globaldisable" x1="-12" y1="2" x2="-2" y2="12" /></g>';
    expect(toHTML(vnode)).to.be.equal(expectation);
  });

  it('render full graph', () => {
    const vnode = context.renderElement(graph);
    const graphAndNode =
      '<svg id="sprotty_graph" class="sprotty-graph" tabindex="0"><g transform="scale(1) translate(0,0)">' +
      '<g id="sprotty_node" transform="translate(100, 100)"><rect class="sprotty-node" x="0" y="0" width="200" height="50" />';
    expect(toHTML(vnode))
      .to.contains(graphAndNode)
      .and.contains('<g id="sprotty_breakpoint"><circle')
      .and.contains('<g id="sprotty_breakpoint-disabled"><circle')
      .and.contains('<g id="sprotty_breakpoint-condition"><circle')
      .and.contains('<g id="sprotty_breakpoint-condition-disabled"><circle')
      .and.contains('<g id="sprotty_breakpoint-globaldisabled"><circle')
      .and.contains('<g id="sprotty_breakpoint-disabled-globaldisabled"><circle')
      .and.contains('<g id="sprotty_breakpoint-condition-globaldisabled"><circle')
      .and.contains('<g id="sprotty_breakpoint-condition-disabled-globaldisabled"><circle');
  });
});
