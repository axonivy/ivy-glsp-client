import {
  ivyBreakpointModule,
  createIvyDiagramContainer,
  ivyThemeModule,
  ivyOpenInscriptionModule,
  ivyOpenDecoratorBrowserModule,
  ivyGoToSourceModule,
  ivyStartActionModule,
  ivyOpenDataClassModule
} from '@axonivy/process-editor';
import { Container } from 'inversify';
import { ConsoleLogger, LogLevel, TYPES } from '@eclipse-glsp/client';

import ivyOpenQuickOutlineModule from './open-quick-outline/di.config';
import ivyToolBarModule from './tool-bar/di.config';
import { IvyEclipseGLSPDiagramServer } from './ivy-eclipse-glsp-diagram-server';
import { eclipseCopyPasteModule, eclipseDeleteModule } from '@eclipse-glsp/ide';

export default function createContainer(widgetId: string): Container {
  const container = createIvyDiagramContainer(widgetId);
  container.bind(TYPES.ModelSource).to(IvyEclipseGLSPDiagramServer).inSingletonScope();
  container.rebind(TYPES.ILogger).to(ConsoleLogger).inSingletonScope();
  container.rebind(TYPES.LogLevel).toConstantValue(LogLevel.warn);

  container.load(eclipseCopyPasteModule);
  container.load(eclipseDeleteModule);
  container.load(ivyOpenInscriptionModule);
  container.load(ivyOpenDecoratorBrowserModule);
  container.load(ivyOpenQuickOutlineModule);
  container.load(ivyGoToSourceModule);
  container.load(ivyBreakpointModule);
  container.load(ivyStartActionModule);
  container.load(ivyOpenDataClassModule);
  container.load(ivyToolBarModule);
  container.load(ivyThemeModule);

  return container;
}