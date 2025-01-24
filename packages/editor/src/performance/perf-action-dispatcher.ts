import { Action, GLSPActionDispatcher, RequestAction, ResponseAction } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class PerfActionDispatcher extends GLSPActionDispatcher {
  protected counter = 0;

  override request<Res extends ResponseAction>(action: RequestAction<Res>): Promise<Res> {
    const counter = ++this.counter;
    console.time(`request-${action.kind}-${counter}`);
    const result = super.request(action);
    console.timeEnd(`request-${action.kind}-${counter}`);
    this.counter++;
    return result;
  }

  protected override async handleAction(action: Action): Promise<void> {
    const counter = ++this.counter;
    console.time(`handleAction-${action.kind}-${counter}`);
    console.log(`handleAction-${action.kind}-${counter}`, action);
    const result = await super.handleAction(action);
    console.timeEnd(`handleAction-${action.kind}-${counter}`);
    return result;
  }
}
