export default class FocusUtils {
  static readonly RENDER_DELAY = 100;
  static readonly RENDER_DELAY_SHORT = 10;

  static focus(element: HTMLElement | Window | null, delay = 0): void {
    if (!element) return;

    setTimeout(() => {
      if (element instanceof Window) {
        element.focus();
      } else {
        (element as HTMLElement).focus();
      }
    }, delay);
  }

  static getHTMElem(component: any, id: string, selector = ''): HTMLElement | null {
    const elem = document.getElementById(id);
    if (!elem) {
      console.debug(`Cannot find element with id="${id}".`);
      return null;
    }

    if (selector) {
      const selectedElem = elem.querySelector(selector);
      if (!selectedElem) {
        console.debug(`Cannot find element with selector="${selector}" in element with id="${id}".`);
        return null;
      }
      return selectedElem as HTMLElement;
    }

    return elem;
  }
} 