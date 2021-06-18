import '../css/diagram.css';

import {
    boundsModule,
    buttonModule,
    configureDefaultModelElements,
    configureModelElement,
    ConsoleLogger,
    defaultGLSPModule,
    defaultModule,
    DeleteElementContextMenuItemProvider,
    edgeLayoutModule,
    expandModule,
    exportModule,
    fadeModule,
    GEdgeView,
    glspContextMenuModule,
    glspHoverModule,
    glspMouseToolModule,
    glspSelectModule,
    glspServerCopyPasteModule,
    glspViewportModule,
    layoutCommandsModule,
    LogLevel,
    markerNavigatorModule,
    modelHintsModule,
    modelSourceModule,
    overrideViewerOptions,
    paletteModule,
    routingModule,
    SLabel,
    toolFeedbackModule,
    toolsModule,
    TYPES,
    validationModule,
    zorderModule
} from '@eclipse-glsp/client';
import { Container, ContainerModule } from 'inversify';

import animateModule from './animate/di.config';
import ivyDecorationModule from './decorator/di.config';
import { AlternateGatewayNodeView, GatewayNodeView, TaskGatewayNodeView } from './diagram/gateviews';
import {
    Edge,
    EndEventNode,
    EventNode,
    GatewayNode,
    LaneNode,
    RotateLabel,
    StartEventNode,
    SubTaskNode,
    TaskNode
} from './diagram/model';
import { IvyGridSnapper } from './diagram/snap';
import {
    BoundaryErrorEventNodeView,
    BoundarySignalEventNodeView,
    ErrorEventNodeView,
    EventNodeView,
    ForeignLabelView,
    IntermediateEventNodeView,
    LaneNodeView,
    PoolNodeView,
    RotateLabelView,
    SignalEventNodeView,
    SubTaskNodeView,
    TaskNodeView,
    WorkflowEdgeView
} from './diagram/views';
import ivyJumpOutModule from './jump/di.config';
import ivySmartActionModule from './smart-action/di.config';

const ivyDiagramModule = new ContainerModule((bind, unbind, isBound, rebind) => {
    rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
    rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);
    bind(TYPES.ISnapper).to(IvyGridSnapper);
    bind(TYPES.IContextMenuItemProvider).to(DeleteElementContextMenuItemProvider);
    const context = { bind, unbind, isBound, rebind };

    configureDefaultModelElements(context);
    configureModelElement(context, 'event:start', StartEventNode, EventNodeView);
    configureModelElement(context, 'event:start:error', StartEventNode, ErrorEventNodeView);
    configureModelElement(context, 'event:start:signal', StartEventNode, SignalEventNodeView);
    configureModelElement(context, 'event:end', EndEventNode, EventNodeView);
    configureModelElement(context, 'event:end:error', EndEventNode, ErrorEventNodeView);
    configureModelElement(context, 'event:intermediate', EventNode, IntermediateEventNodeView);
    configureModelElement(context, 'event:intermediate:task', EventNode, IntermediateEventNodeView);
    configureModelElement(context, 'event:boundary:error', StartEventNode, BoundaryErrorEventNodeView);
    configureModelElement(context, 'event:boundary:signal', StartEventNode, BoundarySignalEventNodeView);
    configureModelElement(context, 'gateway', GatewayNode, GatewayNodeView);
    configureModelElement(context, 'gateway:task', GatewayNode, TaskGatewayNodeView);
    configureModelElement(context, 'gateway:alternative', GatewayNode, AlternateGatewayNodeView);
    configureModelElement(context, 'node:comment', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:script', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:hd', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:user', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:soap', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:rest', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:db', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:email', TaskNode, TaskNodeView);
    configureModelElement(context, 'node:subproc', TaskNode, SubTaskNodeView);
    configureModelElement(context, 'node:embeddedproc', SubTaskNode, SubTaskNodeView);
    configureModelElement(context, 'lanes:lane', LaneNode, LaneNodeView);
    configureModelElement(context, 'lanes:pool', LaneNode, PoolNodeView);
    configureModelElement(context, 'lanes:label', RotateLabel, RotateLabelView);
    configureModelElement(context, 'edge', Edge, WorkflowEdgeView);
    configureModelElement(context, 'edge:association', Edge, GEdgeView);
    configureModelElement(context, 'label', SLabel, ForeignLabelView);
});

export default function createContainer(widgetId: string): Container {
    const container = new Container();

    container.load(validationModule, defaultModule, glspMouseToolModule, defaultGLSPModule, glspSelectModule, boundsModule, glspViewportModule, toolsModule,
        glspHoverModule, fadeModule, exportModule, expandModule, buttonModule, modelSourceModule,
        ivyDiagramModule, toolFeedbackModule, modelHintsModule, glspServerCopyPasteModule, paletteModule, routingModule, ivyDecorationModule, edgeLayoutModule, zorderModule,
        layoutCommandsModule, ivySmartActionModule, glspContextMenuModule, ivyJumpOutModule, animateModule, markerNavigatorModule);

    overrideViewerOptions(container, {
        baseDiv: widgetId,
        hiddenDiv: widgetId + '_hidden'
    });

    return container;
}