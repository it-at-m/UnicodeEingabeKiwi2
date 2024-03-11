/* eslint-disable  @typescript-eslint/no-explicit-any */

/**
 * Static model (backend) for app
 */
export class StringLatinModelService {

    private _xmlnsRes: any; 

    private _collator: any;

    private _strComparator: any;

    private _xmlDom: any;
    private _xmlRequestCount: number;

    private _modellocation: string;

    private _lang: string;

    private _logXPath: boolean;

    /**
     * Ctor 
     * 
     * @param {*} modellocation URL for XML model data  
     * @param {*} lang Language to use
     */
    constructor(modellocation: string,lang = "de",logXPath = false) {

        this._xmlnsRes = (prefix: string) => {
            const xmlns: any = {
                "sl": "http://muenchen.de/stringlatin/",
            };
            return xmlns[prefix] || "";
        };

        this._collator = new Intl.Collator(lang, { sensitivity: "variant" });

        this._strComparator = (a: string, b: string) => this._collator.compare(a, b);

        this._xmlDom = null; // Lazy loading
        this._xmlRequestCount = 0;

        this._modellocation = modellocation;

        this._lang = lang;

        this._logXPath = logXPath;

        console.debug("Ctor completed");
    }

    /**
     * Return properties of model
     * 
     * @return {Promise} JSON with properties 
     * - name: E.g. "String.Latin V1.2"
     * - dataversion: "2018-09-25"
     */
    async getModelProperties(): Promise<{ name: string; dataversion: string }> {
        await this.__ensureData("getModelProperties()");

        const name = this.__getStringByXPath("/sl:stringlatin/@name", this._xmlDom);
        const dataversion = this.__getStringByXPath("/sl:stringlatin/@dataversion", this._xmlDom);
        return {
            "name": name,
            "dataversion": dataversion,
        };
    }

    /**
     * Return list of profiles in order inside the XML model
     * 
     * @return {Promise} Array of elements containing id, and name of profiles
     */
    async getAllProfiles(): Promise<{ seq: number; id: string; name: string; descr: string }[]> {

        await this.__ensureData("getAllProfiles()");

        const profileIds = this.__getMultiStringsByXPath("/sl:stringlatin/sl:profile/@id", this._xmlDom);
        const profiles = [];
        for (let i = 0; i < profileIds.length; i++) {
            const xpathName = "/sl:stringlatin/sl:profile[@id=" + this.__getStringLiteralForXPath(profileIds[i]) + "]/sl:name[@lang=\"" + this._lang + "\"]/text()";
            const profileName = this.__getStringByXPath(xpathName, this._xmlDom);
            const xpathDescr = "/sl:stringlatin/sl:profile[@id=" + this.__getStringLiteralForXPath(profileIds[i]) + "]/sl:description[@lang=\"" + this._lang + "\"]/text()";
            const profileDescr = this.__getStringByXPath(xpathDescr, this._xmlDom);
            profiles.push({
                "seq": i,
                "id": profileIds[i],
                "name": profileName,
                "descr": profileDescr,
            });
        }
        return profiles;
    }

    /**
     * Get chars filtered according to certain criteria
     * 
     * @param {string} profileid The profile or ""
     * @param {string} basechar The basechar 
     * @param {string} type The type of basechar: real, pseudo or ""
     * @param {string} cases One of "capital", "small", "undef"
     * @param {boolean} onlyNormative Flag only normative chars are selected
     * @return {Promise} Array of all chars
     */
    async getFilteredChars(profileid: string, basechar: string, type: string, cases: string, onlyNormative = true): Promise<{ id: string; name: string; info: string }[]> {

        await this.__ensureData("getFilteredChars()");

        const expr = [];
        if (profileid !== "__all") {
            expr.push("sl:profile/@ref=" + this.__getStringLiteralForXPath(profileid));
        }

        if (onlyNormative) {
            expr.push("@normative=\"true\"");
        }

        if (basechar) {
            //
            // Basechar existing -> Search for basechar war requested
            //
            expr.push("sl:basechar/@name-ci=" + this.__getStringLiteralForXPath(basechar.toLowerCase()));
            if ((type === "real") || (type === "pseudo")) {
                expr.push("sl:basechar/@type=\"" + type + "\"");
            }
        }

        if ((cases === "capital") || (cases === "small")) {
            expr.push("((@case=\"" + cases + "\") or (@case = \"undef\"))");
        }

        let xpath = "";
        if (expr.length === 0) {
            xpath = "/sl:stringlatin/sl:char";
        } else {
            xpath = "/sl:stringlatin/sl:char[" + expr.join(" and ") + "]";
        }

        const self = this; // eslint-disable-line @typescript-eslint/no-this-alias
        const charNodes = this.__getNodesByXPath(xpath, this._xmlDom);
        const chars = charNodes.map((n: any) => {
            const name = self.__getStringByXPath("@name", self._xmlDom, n);

            // Caution: For info we ignore the lang attr, we used the official names of Unicode chars 
            //          for every language, because char names are only defined in English.
            return {
                "id": self.__getId(name),
                "name": name,
                "info": self.__getStringByXPath("sl:info[@lang=\"de\"]/text()", self._xmlDom, n),
            };
        });

        chars.sort((a: any, b: any) => {
            return this._collator.compare(a.name, b.name);
        });

        return chars;
    }

      /**
       * Find basechars by char (example char "a")
       * /sl:stringlatin/sl:char/sl:basechar[ ../@normative="true" and @type="real" and ../@name="a" ]/@name
       *
       * @param {string} char The char
       * @param {String} type The type (real || pseudo)
       * @param {boolean} onlyNormative Flag only normative chars are selected
       * @return {Promise} Array of strings (basechars) sort according to unicode
       */
     async getBasecharByChar(char: string, type = "real", onlyNormative = true): Promise<string> {

        await this.__ensureData("getBasecharByChar()");

        const expr = [];

        if (type === "real" || type === "pseudo") {
            expr.push("@type=" + this.__getStringLiteralForXPath(type));
        }

        if (onlyNormative) {
            expr.push("../@normative=\"true\"");
        }

        expr.push("../@name=" + this.__getStringLiteralForXPath(char));
        const xpath = "/sl:stringlatin/sl:char/sl:basechar[" + expr.join(" and ") + "]/@name";

        let basechar = null;
        const basechars: string[] = this.__getMultiStringsByXPath(xpath, this._xmlDom);
        if (basechars.length === 1) {
            basechar = basechars[0];
        } else {
            if (basechars.length === 0) {
                // Fallback: Take first char, convert it to NFD and take this as basechar.
                console.warn("No basechar by reverse mapping found -- fallback to NFD coversion.");
                basechar = char.charAt(0).normalize("NFD").charAt(0);
            } else {
                basechars.sort(this._strComparator);
                basechar = basechars[0];
                console.warn("Basechar of char is not unique ([" + basechars.join(", ") + "]) -- choosing first in alphabetical order: \"" + basechar + "\".");
            }
        }

        return basechar;
      }

      /**
       * Find case of char 
       * /sl:stringlatin/sl:char[name="a"]/@case"
       *
       * @param {string} char The char sequence for the grapheme
       * @return {Promise} Strings constant describing the case
       */
    async getCaseOfChar(char: string): Promise<string> {

        await this.__ensureData("getCaseOfChar()");

        const xpath = "/sl:stringlatin/sl:char[@name=" + this.__getStringLiteralForXPath(char) + "]/@case";
        const casing = this.__getStringByXPath(xpath, this._xmlDom);

        return casing;
    }

    private __getStringByXPath(xpath: string, xmldom: any, context: any = null): string {
        if (this._logXPath) {
            console.debug("Running xpath query \"" + xpath + "\".");
        }
        let result = "";
        if (xmldom) {
            result = xmldom.evaluate(xpath, (context === null) ? xmldom : context, this._xmlnsRes, XPathResult.STRING_TYPE, null).stringValue;
        }
        return result;
    }

    private __getMultiStringsByXPath(xpath: string, xmldom: any, context: any = null): string[] {
        if (this._logXPath) {
            console.debug("Running xpath query \"" + xpath + "\".");
        }
        const result: string[] = [];
        if (xmldom) {
            const nodesSnapshot: any = xmldom.evaluate(xpath, (context === null) ? xmldom : context, this._xmlnsRes, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i =0; i < nodesSnapshot.snapshotLength; i++) {
                result.push(nodesSnapshot.snapshotItem(i).textContent);
            }
        }
        return result;
    }

    private __getNodesByXPath(xpath: string, xmldom: any): any {
        if (this._logXPath) {
            console.debug("Running xpath query \"" + xpath + "\".");
        }
        const results = [];
        if (xmldom) {
            const query = xmldom.evaluate(xpath, xmldom, this._xmlnsRes, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
            for (let i = 0; i < query.snapshotLength; i++) {
                results.push(query.snapshotItem(i));
            }
        }
        return results;
      }

    private __getStringLiteralForXPath(s: string): string {
        if (s.indexOf("\"") === -1) {
            return "\"" + s + "\"";
        }
        if (s.indexOf("'") === -1) {
            return "'" + s + "'";
        }
        return 'concat("' + s.replace(/("+)/g, '",\'$1\',"') + '")'; // eslint-disable-line quotes
    }

    private async __ensureData(tag: string): Promise<any> {
        if (this._xmlDom) {
            console.debug("__ensureData(): " + tag + ": Using cached model.");
            return;
        }
        
        //
        // Double checked locking with individual delay to avoid race conditions and hence concurrent requests
        //
        const counter = this._xmlRequestCount++; 
        await this.__sleep(tag,counter * 1000);
        if (this._xmlDom) {
            console.debug("__ensureData(): " + tag + ": Using cached model (2).");
            return;
        }
        
        console.debug("__ensureData(): " + tag + ": Fetching model.");
        const response = await fetch(this._modellocation, { 
            credentials: "same-origin",
        });
        if (! response.ok) {
            throw Error(response.statusText);
        }

        console.debug("__ensureData(): " + tag + ": loaded model successfully: statusCode=" + response.status + ".");
        const text = await response.text();
        const xmlDom = (new DOMParser()).parseFromString(text, "text/xml");
        console.debug("__ensureData(): " + tag + ": parsed model successfully.");
        this._xmlDom = xmlDom;
    }

    private __sleep(tag: string, millis: number): Promise<any> {
        console.debug("__sleep(): " + tag + ": Waiting " + millis + " millis.");
        return new Promise(resolve => setTimeout(resolve, millis));
    }

    private __getId(str: string): string {
        let result = "id";
        for (let i = 0; i < str.length; i++) {
            const cp: any = str.codePointAt(i);
            if (cp !== undefined) {
                result += cp.toString(16);                
            }
        }
        return result;
    }
}

//
// Singleton 
//
let model: StringLatinModelService;

export function getModel(): StringLatinModelService {
    if (! model) {
        model = new StringLatinModelService("model/stringlatin-v2.xml");
    }
    return model;
}
