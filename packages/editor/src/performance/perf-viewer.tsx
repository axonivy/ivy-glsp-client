/** @jsx html */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Action, GModelRoot, ModelViewer, copyClassesFromElement, copyClassesFromVNode, html, setClass } from '@eclipse-glsp/client';
import { injectable } from 'inversify';

@injectable()
export class PerfModelViewer extends ModelViewer {
  protected counter = 0;
  update(model: Readonly<GModelRoot>, cause?: Action): void {
    const counter = ++this.counter;
    console.time(`Viewer update (vu) (${counter})`);
    this.logger.log(this, 'rendering', model);
    const newVDOM = <div id={this.options.baseDiv}>{this.renderer.renderElement(model)}</div>;
    if (this.lastVDOM !== undefined) {
      const hadFocus = this.hasFocus();
      copyClassesFromVNode(this.lastVDOM, newVDOM);
      this.lastVDOM = this.patcher.call(this, this.lastVDOM, newVDOM);
      this.restoreFocus(hadFocus);
    } else if (typeof document !== 'undefined') {
      let placeholder = null;
      if (this.options.shadowRoot) {
        const shadowRoot = document.getElementById(this.options.shadowRoot)?.shadowRoot;
        if (shadowRoot) {
          placeholder = shadowRoot.getElementById(this.options.baseDiv);
        }
      } else {
        placeholder = document.getElementById(this.options.baseDiv);
      }
      if (placeholder !== null) {
        if (typeof window !== 'undefined') {
          window.addEventListener('resize', () => {
            this.onWindowResize(newVDOM);
          });
        }
        copyClassesFromElement(placeholder, newVDOM);
        setClass(newVDOM, this.options.baseClass, true);
        this.lastVDOM = this.patcher.call(this, placeholder, newVDOM);
      } else {
        this.logger.error(this, 'element not in DOM:', this.options.baseDiv);
      }
    }
    this.renderer.postUpdate(cause);
    console.timeEnd(`Viewer update (vu) (${counter})`);
  }
}
