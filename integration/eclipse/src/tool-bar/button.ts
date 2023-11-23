import { ToolBarButtonProvider, ToolBarButtonLocation } from '@axonivy/process-editor';
import { OpenDataClassAction, OpenInscriptionAction, OpenInsertExtensionAction } from '@axonivy/process-editor-protocol';
import { IvyIcons } from '@axonivy/editor-icons/lib';
import { injectable } from 'inversify';

@injectable()
export class InscribeProcessButtonProvider implements ToolBarButtonProvider {
  button() {
    return {
      icon: IvyIcons.PenEdit,
      title: 'Inscribe Process',
      sorting: 'D',
      action: () => OpenInscriptionAction.create(''),
      location: ToolBarButtonLocation.Right,
      readonly: true
    };
  }
}

@injectable()
export class OpenDataClassButtonProvider implements ToolBarButtonProvider {
  button() {
    return {
      icon: IvyIcons.DatabaseLink,
      title: 'Open Data Class (C)',
      sorting: 'E',
      action: () => OpenDataClassAction.create(),
      location: ToolBarButtonLocation.Right,
      readonly: true
    };
  }
}

@injectable()
export class OpenInsertExtensionButtonProvider implements ToolBarButtonProvider {
  button() {
    return {
      icon: IvyIcons.Extension,
      title: 'Extensions',
      sorting: 'F',
      action: () => OpenInsertExtensionAction.create(),
      id: 'insertextensionbutton',
      location: ToolBarButtonLocation.Middle,
      switchFocus: true,
      showTitle: true,
      isNotMenu: true
    };
  }
}
