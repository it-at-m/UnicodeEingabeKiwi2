
import Vue from 'vue';

export const enum Levels {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error'
}

export class KiwiError extends Error {
    level: string;
  
    constructor({ level = Levels.ERROR, message = "Ein unbekannter Fehler ist aufgetreten, bitte den Administrator informieren und/oder später noch einmal probieren." }: { level?: string; message?: string }) {
		// Übergibt die verbleibenden Parameter (einschließlich Vendor spezifischer Parameter) dem Error Konstruktor
		super(message);
	
		// Behält den richtigen Stack-Trace für die Stelle bei, an der unser Fehler ausgelöst wurde
        this.stack = new Error().stack;
	
		// Benutzerdefinierte Informationen
		this.level = level;
		this.message = message;
    }
}

export class ThreadErrorHandler {

    static handleError(context: Vue, error: KiwiError): void {
        console.error("Error: '" + error.message);
        context.$store.dispatch("snackbar/showMessage", {
            message: "Ein unbekannter Fehler ist aufgetreten, bitte den Administrator informieren und/oder später noch einmal probieren. <br>" + 
                     "An unknown error has occurred, please inform the administrator and/or try again later.",
            level: error.level
        });
    }

}