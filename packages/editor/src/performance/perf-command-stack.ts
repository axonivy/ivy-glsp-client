import { GModelRoot, ICommand } from '@eclipse-glsp/client';
import { injectable } from 'inversify';
import { IvyGLSPCommandStack } from '../ivy-command-stack';

@injectable()
export class PerfCommandStack extends IvyGLSPCommandStack {
  protected counter = 0;

  override async execute(command: ICommand): Promise<GModelRoot> {
    const counter = ++this.counter;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const kind = (command as any).action?.kind;
    const perfmessage = kind ? `executeCommand-${kind}-${counter}` : `executeCommand-${counter}`;
    console.time(perfmessage);
    const result = await super.execute(command);
    console.timeEnd(perfmessage);
    return result;
  }
}
