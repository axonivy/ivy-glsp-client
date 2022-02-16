const COLLAPSED_CSS = 'collapsed';
import { PaletteItem } from '@eclipse-glsp/client';
import { matchesKeystroke } from 'sprotty/lib/utils/keyboard';
import { IconStyle, resolveIcon } from '../diagram/icon/icons';
import { changeCSSClass, compare, createIcon } from './tool-bar-helper';

export class ColorPickerMenu {
  protected paletteItems: PaletteItem[];
  protected paletteItemsCopy: PaletteItem[] = [];
  protected bodyDiv?: HTMLElement;
  protected itemsDiv?: HTMLElement;
  protected searchField: HTMLInputElement;

  constructor(
    paletteItems: PaletteItem[],
    readonly onClickElementPickerToolButton: (button: HTMLElement, item: PaletteItem) => void,
    readonly clearToolOnEscape: (event: KeyboardEvent) => void
  ) {
    this.paletteItems = paletteItems;
  }

  public createMenuBody(containerElement: HTMLElement): void {
    const bodyDiv = document.createElement('div');
    containerElement.appendChild(bodyDiv);
    bodyDiv.classList.add('color-palette-body', 'palette-body', 'collapsible-palette', COLLAPSED_CSS);
    bodyDiv.appendChild((this.searchField = this.createPaletteItemSearchField(containerElement.id)));
    this.bodyDiv = bodyDiv;
    this.createItemsDiv(bodyDiv);
  }

  public isMenuHidden(): boolean | undefined {
    return this.bodyDiv?.classList.contains(COLLAPSED_CSS);
  }

  public hideMenu(): void {
    this.bodyDiv!.classList.add(COLLAPSED_CSS);
  }

  public showMenu(): void {
    this.bodyDiv!.classList.remove(COLLAPSED_CSS);
  }

  public getPaletteItems(): PaletteItem[] {
    return this.paletteItems;
  }

  private createPaletteItemSearchField(containerElementId: string): HTMLInputElement {
    const searchField = document.createElement('input');
    searchField.classList.add('search-input');
    searchField.id = containerElementId + '_search_field';
    searchField.type = 'text';
    searchField.placeholder = ' Search...';
    searchField.onkeyup = () => this.requestFilterUpdate(this.searchField.value);
    searchField.onkeydown = ev => this.clearSearchInputOnEscape(ev);
    return searchField;
  }

  private clearSearchInputOnEscape(event: KeyboardEvent): void {
    if (matchesKeystroke(event, 'Escape')) {
      this.searchField.value = '';
      this.requestFilterUpdate('');
    }
  }

  private requestFilterUpdate(filter: string): void {
    // Initialize the copy if it's empty
    if (this.paletteItemsCopy.length === 0) {
      // Creating deep copy
      this.paletteItemsCopy = JSON.parse(JSON.stringify(this.paletteItems));
    }

    // Reset the paletteItems before searching
    this.paletteItems = JSON.parse(JSON.stringify(this.paletteItemsCopy));
    // Filter the entries
    const filteredPaletteItems: PaletteItem[] = [];
    for (const itemGroup of this.paletteItems) {
      if (itemGroup.children) {
        // Fetch the labels according to the filter
        const matchingChildren = itemGroup.children.filter(child => child.label.toLowerCase().includes(filter.toLowerCase()));
        // Add the itemgroup containing the correct entries
        if (matchingChildren.length > 0) {
          // Clear existing children
          itemGroup.children.splice(0, itemGroup.children.length);
          // Push the matching children
          matchingChildren.forEach(child => itemGroup.children!.push(child));
          filteredPaletteItems.push(itemGroup);
        }
      }
    }
    this.paletteItems = filteredPaletteItems;
    if (this.bodyDiv) {
      this.createItemsDiv(this.bodyDiv);
    }
  }

  private createItemsDiv(bodyDiv: HTMLElement): void {
    const itemsDiv = document.createElement('div');
    let tabIndex = 0;
    this.paletteItems.sort(compare).forEach(item => {
      if (item.children) {
        const group = this.createToolGroup(item);
        item.children.sort(compare).forEach(child => group.appendChild(this.createToolButton(child, tabIndex++)));
        itemsDiv.appendChild(group);
      } else {
        itemsDiv.appendChild(this.createToolButton(item, tabIndex++));
      }
    });
    if (this.paletteItems.length === 0) {
      const noResultsDiv = document.createElement('div');
      noResultsDiv.innerText = 'No results found.';
      noResultsDiv.classList.add('tool-button');
      itemsDiv.appendChild(noResultsDiv);
    }
    // Remove existing body to refresh filtered entries
    if (this.itemsDiv) {
      bodyDiv.removeChild(this.itemsDiv);
    }
    bodyDiv.appendChild(itemsDiv);
    this.itemsDiv = itemsDiv;
  }

  private createToolButton(item: PaletteItem, index: number): HTMLElement {
    const button = document.createElement('div');
    button.tabIndex = index;
    button.classList.add('tool-button');
    button.appendChild(this.appendPaletteIcon(button, item));
    button.insertAdjacentText('beforeend', item.label);
    button.onclick = (ev: MouseEvent) => this.onClickElementPickerToolButton(button, item);
    button.onkeydown = ev => this.clearToolOnEscape(ev);
    return button;
  }

  private appendPaletteIcon(button: HTMLElement, item: PaletteItem): Node {
    if (item.icon) {
      const icon = resolveIcon(item.icon);
      if (icon.style === IconStyle.FA) {
        return createIcon(['fa', 'fa-fw', icon.res]);
      }
      if (icon.style === IconStyle.SVG) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 10 10');
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', icon.res);
        svg.appendChild(path);
        return svg;
      }
      const span = document.createElement('span');
      span.style.backgroundColor = item.icon;
      span.classList.add('color-icon');
      return span;
    }
    return document.createElement('span');
  }

  private createToolGroup(item: PaletteItem): HTMLElement {
    const group = document.createElement('div');
    group.classList.add('tool-group');
    group.id = item.id;
    const header = document.createElement('div');
    header.classList.add('group-header');
    if (item.icon) {
      header.appendChild(createIcon([item.icon]));
    }
    header.insertAdjacentText('beforeend', item.label);
    header.ondblclick = _ev => {
      changeCSSClass(group, COLLAPSED_CSS);
      window!.getSelection()!.removeAllRanges();
    };

    group.appendChild(header);
    return group;
  }
}
