
import Vue from 'vue';

export default class FocusUtils {

    static focus(elem: HTMLElement | Window, delay = -1): void {
        const f = () => {
          elem.focus();
        };

        if (delay > 0) {
          // Caution workaround: Some things seem to be not fully initialized at this point
          // --> Execute things with a delay of 100 mills -- hopefully this is enough for slow browsers
          console.debug("Focusing delayed for " + delay + "ms.");
          setTimeout(f, delay);

        } else {
          console.debug("Focusing immediate.");
          f();

        }
    }

    static getHTMElem(vue: Vue, refname: string, xpath = "."): HTMLElement | null {
      // Get element with ref attribute.
      const elem = vue.$refs[refname];
      if (elem === undefined) {
        return null;
      }

      // Unwrap HTML element if necessary
      const htmlElem = (((elem as Vue).$el) ? (elem as Vue).$el : elem) as HTMLElement;

      // Run if xpath if requested
      return (xpath === ".") ? htmlElem : htmlElem.querySelector(xpath);
    }

    static readonly RENDER_DELAY = 300;  
    static readonly RENDER_DELAY_LONG = 500;  
    static readonly RENDER_DELAY_SHORT = 10;
}