import {
  createIvyDiagramContainer,
  createPerformanceModule,
  ivyChangeBoundsToolModule,
  ivyConnectorModule,
  ivyKeyListenerModule,
  ivyLabelEditModule,
  ivyLabelEditUiModule,
  ivyLaneModule,
  ivyQuickActionModule,
  ivyThemeModule,
  ivyToolBarModule,
  ivyWrapModule,
  overrideIvyViewerOptions
} from '@axonivy/process-editor';
import type { ThemeMode } from '@axonivy/process-editor-protocol';
import type { IDiagramOptions } from '@eclipse-glsp/client';
import { createDiagramOptionsModule, deletionToolModule, edgeEditToolModule, nodeCreationToolModule } from '@eclipse-glsp/client';
import type { Container } from 'inversify';
import ivyViewerKeyListenerModule from './key-listener/di.config';
import ivyNavigationModule from './navigate/di.config';
import ivyViewerQuickActionModule from './quick-action/di.config';
import { ivyStartupDiagramModule } from './startup';

export interface IvyDiagramOptions extends IDiagramOptions {
  highlight: string;
  select: string | null;
  zoom: string;
  theme: ThemeMode;
  measurePerformance?: boolean;
}

export default function createContainer(options: IvyDiagramOptions): Container {
  // ivyNavigationModule is a replacement for navigationModule but it is already removed in the default IvyDiagramContainer
  const container = createIvyDiagramContainer(
    'sprotty',
    createDiagramOptionsModule(options),
    createPerformanceModule(options.measurePerformance),
    ivyThemeModule,
    ivyNavigationModule,
    ivyStartupDiagramModule,
    {
      remove: [
        ivyLabelEditModule,
        ivyLabelEditUiModule,
        ivyChangeBoundsToolModule,
        ivyWrapModule,
        ivyLaneModule,
        ivyConnectorModule,
        deletionToolModule,
        edgeEditToolModule,
        nodeCreationToolModule,
        ivyToolBarModule
      ]
    },
    { remove: ivyQuickActionModule, add: ivyViewerQuickActionModule },
    { remove: ivyKeyListenerModule, add: ivyViewerKeyListenerModule }
  );
  overrideIvyViewerOptions(container, { hideSensitiveInfo: true });
  return container;
}
