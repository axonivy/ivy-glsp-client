import { Action } from '@eclipse-glsp/client';
import { InscriptionContext } from '@axonivy/inscription-protocol';
import { Connection } from '@axonivy/jsonrpc';

export interface EnableInscriptionAction extends Action {
  kind: typeof EnableInscriptionAction.KIND;
  connection?: { server?: string; inscription?: Connection; ivyScript?: Connection };
  inscriptionContext?: InscriptionContext;
}

export namespace EnableInscriptionAction {
  export const KIND = 'enableInscription';

  export function is(object: any): object is EnableInscriptionAction {
    return Action.hasKind(object, KIND);
  }

  export function create(options: Omit<EnableInscriptionAction, 'kind'>): EnableInscriptionAction {
    return { kind: KIND, ...options };
  }
}

export interface ToggleInscriptionAction extends Action {
  kind: typeof ToggleInscriptionAction.KIND;
  force?: boolean;
}

export namespace ToggleInscriptionAction {
  export const KIND = 'showInscription';

  export function is(object: any): object is ToggleInscriptionAction {
    return Action.hasKind(object, KIND);
  }

  export function create(options: { force?: boolean }): ToggleInscriptionAction {
    return { kind: KIND, ...options };
  }
}
