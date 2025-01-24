import { DiagramLoader, DiagramLoadingOptions, IDiagramStartup, ResolvedDiagramLoadingOptions, StatusAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class PerfDiagramLoader extends DiagramLoader {
  protected override async invokeStartupHook(hook: keyof Omit<IDiagramStartup, 'rank'>): Promise<void> {
    console.time('invokeStartupHook-' + hook);
    await super.invokeStartupHook(hook);
    console.timeEnd('invokeStartupHook-' + hook);
  }

  protected override async initialize(options: ResolvedDiagramLoadingOptions): Promise<void> {
    console.time('DiagramLoader.initialize (DI)');
    if (options.enableNotifications) {
      console.time('dispatchStatus - (DI)');
      await this.actionDispatcher.dispatch(StatusAction.create('Initializing...', { severity: 'INFO' }));
      console.timeEnd('dispatchStatus - (DI)');
    }

    console.time('getClient - (DI)');
    const glspClient = await this.options.glspClientProvider();
    console.timeEnd('getClient - (DI)');
    console.time('startClient - (DI)');
    await glspClient.start();
    console.timeEnd('startClient - (DI)');
    if (!glspClient.initializeResult) {
      console.time('initializeServer - (DI)');
      await glspClient.initializeServer(options.initializeParameters);
      console.timeEnd('initializeServer - (DI)');
    }
    console.time('configureModelSource - (DI)');
    this.modelSource.configure(glspClient);
    console.timeEnd('configureModelSource - (DI)');

    if (options.enableNotifications) {
      console.time('clearStatus - (DI)');
      this.actionDispatcher.dispatch(StatusAction.create('', { severity: 'NONE' }));
      console.timeEnd('clearStatus - (DI)');
    }
    console.timeEnd('DiagramLoader.initialize (DI)');
  }

  protected override async requestModel(options: ResolvedDiagramLoadingOptions): Promise<void> {
    console.time('DiagramLoader.requestModel');
    await super.requestModel(options);
    console.timeEnd('DiagramLoader.requestModel');
  }

  override async load(options: DiagramLoadingOptions = {}): Promise<void> {
    console.time('DiagramLoader.load');
    await super.load(options);
    console.timeEnd('DiagramLoader.load');
  }
}
