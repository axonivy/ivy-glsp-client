import { SModelRoot } from '@eclipse-glsp/client';
import { expect } from 'chai';
import { QuickActionUI } from '../../src/ui-tools/quick-action/quick-action-ui';
import { assertMultiQuickActionUi, assertQuickAction, assertQuickActionUi, createContainer, createRoot, getQuickActionDiv, setupSprottyDiv } from './quick-action-ui-util';
import { IvyIcons } from '@axonivy/editor-icons/lib';

describe('QuickActionUi', () => {
  let quickActionUi: QuickActionUI;
  let root: SModelRoot;

  before(() => {
    setupSprottyDiv();
    const container = createContainer();
    quickActionUi = container.get<QuickActionUI>(QuickActionUI);
    root = createRoot(container);
  });

  it('ui is not rendered by default', () => {
    const uiDiv = getQuickActionDiv();
    expect(uiDiv).to.be.null;
  });

  it('ui is not rendered for node with disabled feature', () => {
    quickActionUi.show(root, 'noQuickActions');
    assertQuickActionUi(0);
  });

  it('ui is rendered for edges', () => {
    quickActionUi.show(root, 'edge');
    assertQuickActionUi(7, { x: 265, y: 215 });
    assertQuickAction(0, 'Delete', IvyIcons.Delete);
    assertQuickAction(1, 'Information (I)', IvyIcons.Information);
    assertQuickAction(2, 'Straighten (S)', IvyIcons.Straighten);
    assertQuickAction(3, 'Bend (B)', IvyIcons.Bend);
    assertQuickAction(4, 'Edit Label (L)', IvyIcons.Label);
    assertQuickAction(5, 'Select color', IvyIcons.Color);
    assertQuickAction(6, 'Reconnect (R)', IvyIcons.Reconnect);
  });

  it('ui is rendered for activity element', () => {
    quickActionUi.show(root, 'foo');
    assertQuickActionUi(8, { x: 200, y: 150 });
    assertQuickAction(0, 'Delete', IvyIcons.Delete);
    assertQuickAction(1, 'Information (I)', IvyIcons.Information);
    assertQuickAction(3, 'Select color', IvyIcons.Color);
    assertQuickAction(7, 'Connect', IvyIcons.Connector);
  });

  it('ui is rendered for activity embedded element', () => {
    quickActionUi.show(root, 'sub');
    assertQuickActionUi(9, { x: 400, y: 150 });
    assertQuickAction(0, 'Delete', IvyIcons.Delete);
    assertQuickAction(1, 'Information (I)', IvyIcons.Information);

    assertQuickAction(2, 'Jump (J)', IvyIcons.Jump);
    assertQuickAction(4, 'Select color', IvyIcons.Color);
    assertQuickAction(8, 'Connect', IvyIcons.Connector);
  });

  it('ui is rendered for event element', () => {
    quickActionUi.show(root, 'start');
    assertQuickActionUi(7, { x: 215, y: 230 });
    assertQuickAction(0, 'Delete', IvyIcons.Delete);
    assertQuickAction(1, 'Information (I)', IvyIcons.Information);
    assertQuickAction(2, 'Select color', IvyIcons.Color);
    assertQuickAction(6, 'Connect', IvyIcons.Connector);

    // no connection quick action if outgoing edge exists
    quickActionUi.show(root, 'startWithConnection');
    assertQuickActionUi(6);
  });

  it('ui is rendered for gateway element', () => {
    quickActionUi.show(root, 'alternative');
    assertQuickActionUi(7, { x: 116, y: 232 });
    assertQuickAction(0, 'Delete', IvyIcons.Delete);
    assertQuickAction(1, 'Information (I)', IvyIcons.Information);
    assertQuickAction(2, 'Select color', IvyIcons.Color);
    assertQuickAction(6, 'Connect', IvyIcons.Connector);

    // connection quick action even if outoging edge exists
    quickActionUi.show(root, 'alternativeWithConnection');
    assertQuickActionUi(7);
  });

  it('ui is rendered for pool', () => {
    quickActionUi.show(root, 'pool');
    assertQuickActionUi(3, { x: 250, y: 100 });
    assertQuickAction(0, 'Delete', IvyIcons.Delete);
    assertQuickAction(1, 'Select color', IvyIcons.Color);
    assertQuickAction(2, 'Create Lane', IvyIcons.LaneSwimlanes);
  });

  it('ui is rendered for lane', () => {
    quickActionUi.show(root, 'lane');
    assertQuickActionUi(2, { x: 250, y: 200 });
    assertQuickAction(0, 'Delete', IvyIcons.Delete);
    assertQuickAction(1, 'Select color', IvyIcons.Color);
  });

  it('multi selection ui is rendered', () => {
    quickActionUi.show(root, 'start', 'end');
    assertMultiQuickActionUi(4, { height: 40, width: 140 }, { x: 265, y: 230 });
    assertQuickAction(0, 'Delete', IvyIcons.Delete);
    assertQuickAction(1, 'Wrap to embedded process (W)', IvyIcons.WrapToSubprocess);
    assertQuickAction(2, 'Auto Align (A)', IvyIcons.AutoAlign);
    assertQuickAction(3, 'Select color', IvyIcons.Color);

    quickActionUi.show(root, 'start', 'end', 'foo');
    assertMultiQuickActionUi(4, { height: 140, width: 240 }, { x: 215, y: 230 });
  });
});