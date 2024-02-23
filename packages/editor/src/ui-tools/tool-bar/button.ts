import { Action, EnableDefaultToolsAction, EnableToolsAction, RedoAction, UndoAction } from '@eclipse-glsp/client';
import { IvyMarqueeMouseTool } from './marquee-mouse-tool';
import { injectable, inject, optional } from 'inversify';
import { ShowToolBarOptionsMenuAction } from './options/action';
import { CustomIconToggleActionHandler } from './options/action-handler';
import { SwitchThemeActionHandler } from '../../theme/action-handler';
import { ShowGridActionHandler } from '../../diagram/grid/action-handler';
import { IvyIcons } from '@axonivy/ui-icons';

export interface ToolBarButtonProvider {
  button(): ToolBarButton;
}

export enum ToolBarButtonLocation {
  Left = 'left',
  Middle = 'middle',
  Right = 'right'
}

export interface ToolBarButton {
  icon: IvyIcons;
  title: string;
  sorting: string;
  action: () => Action;
  location: ToolBarButtonLocation;
  id?: string;
  readonly?: boolean;
  switchFocus?: boolean;
  showTitle?: boolean;
  isNotMenu?: boolean;
}

export function compareButtons(a: ToolBarButton, b: ToolBarButton): number {
  const sortStringBased = a.sorting.localeCompare(b.sorting);
  if (sortStringBased !== 0) {
    return sortStringBased;
  }
  return a.title.localeCompare(b.title);
}

export const DefaultSelectButton: ToolBarButton = {
  icon: IvyIcons.SelectionTool,
  title: 'Selection Tool',
  sorting: 'A',
  action: () => EnableDefaultToolsAction.create(),
  id: 'btn_default_tools',
  location: ToolBarButtonLocation.Left,
  readonly: true,
  switchFocus: true
};

export const MarqueeToolButton: ToolBarButton = {
  icon: IvyIcons.MultiSelection,
  title: 'Marquee Tool (Shift)',
  sorting: 'B',
  action: () => EnableToolsAction.create([IvyMarqueeMouseTool.ID]),
  id: 'btn_marquee_tools',
  location: ToolBarButtonLocation.Left,
  readonly: true,
  switchFocus: true
};

export const UndoToolButton: ToolBarButton = {
  icon: IvyIcons.Undo,
  title: 'Undo',
  sorting: 'C',
  action: () => UndoAction.create(),
  id: 'btn_undo_tools',
  location: ToolBarButtonLocation.Left
};

export const RedoToolButton: ToolBarButton = {
  icon: IvyIcons.Redo,
  title: 'Redo',
  sorting: 'D',
  action: () => RedoAction.create(),
  id: 'btn_redo_tools',
  location: ToolBarButtonLocation.Left
};

@injectable()
export class OptionsButtonProvider implements ToolBarButtonProvider {
  @inject(CustomIconToggleActionHandler) protected customIconHandler: CustomIconToggleActionHandler;
  @inject(ShowGridActionHandler) protected gridHandler: ShowGridActionHandler;
  @inject(SwitchThemeActionHandler) @optional() protected switchThemeHandler?: SwitchThemeActionHandler;

  button() {
    const customIconState = () => this.customIconHandler.isShowCustomIcons;
    const grid = () => this.gridHandler.isVisible();
    const theme = this.switchThemeHandler ? () => this.switchThemeHandler!.theme() : undefined;
    return {
      icon: IvyIcons.Settings,
      title: 'Settings',
      sorting: 'Y',
      action: () => ShowToolBarOptionsMenuAction.create({ customIconState, grid, theme }),
      id: 'btn_options_menu',
      location: ToolBarButtonLocation.Right,
      readonly: true,
      switchFocus: true
    };
  }
}
