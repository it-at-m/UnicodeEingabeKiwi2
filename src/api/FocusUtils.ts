import type { ComponentPublicInstance } from "vue";

export const RENDER_DELAY = 100;
export const RENDER_DELAY_SHORT = 10;

export function focus(element: HTMLElement | Window | null, delay = 0): void {
  if (!element) return;

  setTimeout(() => {
    if (element instanceof Window) {
      element.focus();
    } else {
      (element as HTMLElement).focus();
    }
  }, delay);
}

export function getHTMElem(
  _component: ComponentPublicInstance | null,
  id: string,
  selector = ""
): HTMLElement | null {
  const elem = document.getElementById(id);
  if (!elem) {
    console.debug(`Cannot find element with id="${id}".`);
    return null;
  }

  if (selector) {
    const selectedElem = elem.querySelector(selector);
    if (!selectedElem) {
      console.debug(
        `Cannot find element with selector="${selector}" in element with id="${id}".`
      );
      return null;
    }
    return selectedElem as HTMLElement;
  }

  return elem;
}
