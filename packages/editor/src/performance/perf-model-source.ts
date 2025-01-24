import { Disposable, GLSPClient, GLSPModelSource } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class PerfGLSPModelSource extends GLSPModelSource {
  async configure(glspClient: GLSPClient): Promise<void> {
    console.time('GLSPModelSource.configure (MS)');
    this.glspClient = glspClient;
    if (!glspClient.initializeResult) {
      throw new Error('Could not configure model source. The GLSP client is not initialized yet!');
    }

    console.time('createInitializeClientSessionParameters (MS)');
    const initializeParams = this.createInitializeClientSessionParameters(glspClient.initializeResult);
    console.timeEnd('createInitializeClientSessionParameters (MS)');

    console.time('configureServerActions (MS)');
    this.configureServeActions(glspClient.initializeResult);
    console.timeEnd('configureServerActions (MS)');

    this.toDispose.push(
      glspClient.onActionMessage(message => this.messageReceived(message), this.clientId),
      Disposable.create(() => glspClient.disposeClientSession(this.createDisposeClientSessionParameters()))
    );

    console.time('initializeClientSession (MS)');
    const result = await glspClient!.initializeClientSession(initializeParams);
    console.timeEnd('initializeClientSession (MS)');
    console.timeEnd('GLSPModelSource.configure (MS)');
    return result;
  }
}
