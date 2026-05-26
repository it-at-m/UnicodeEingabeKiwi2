// Types and interfaces
import { KEYBOARD_DIN_91379_ID } from "@/constants";
import characterDataDIN from "@/data/characters-DIN-SPEC-91379.json";
import {
  buildDinLocaleIdSets,
  DIN_LOCALE_FILES,
  isDinLocaleProfile,
} from "@/data/dinLocales";

interface Profile {
  seq: number;
  id: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
}

interface BaseChar {
  type: "real" | "pseudo";
  name: string;
  nameCaseInsensitive: string;
}

interface Character {
  id: string;
  name: string;
  info: Record<string, string>;
  profiles: string[];
  baseChars: BaseChar[];
  normative: boolean;
  case: "capital" | "small" | "undef";
  codePoint?: string; // Unicode code point (optional, for documentation)
}

interface CharacterData {
  characters: Character[];
}

interface IStringLatinModelService {
  getAllProfiles(): Promise<Profile[]>;
  getFilteredChars(
    profileId: string,
    basechar: string,
    type: string,
    cases: string,
    onlyNormative?: boolean,
    localeProfileId?: string
  ): Promise<Character[]>;
  getLocaleProfiles(): Promise<Profile[]>;
  getBasecharByChar(char: string): Promise<string[]>;
  getCaseOfChar(char: string): Promise<string>;
  getModelProperties(): Promise<{ dataversion: string; name: string }>;
  loadKeyboards(keyboardIds: string[]): Promise<void>;
}

// Implementation
class StringLatinModelServiceImpl implements IStringLatinModelService {
  private readonly modelProperties = {
    name: "DIN 91379:2022-08",
    dataversion: "DIN-202208",
  };

  private readonly baseProfiles: Profile[] = [
    {
      seq: 0,
      id: "__all",
      names: {
        de: "alle",
        en: "all",
      },
      descriptions: {
        de: "Alle Zeichen inkl. Buchstaben, Ziffern, etc.",
        en: "All characters incl. letters, digits, etc.",
      },
    },
    {
      seq: 1,
      id: "id0",
      names: {
        de: "Zeichen + Buchstaben",
        en: "Characters + letters",
      },
      descriptions: {
        de: "Verpflichtende/normative Zeichen, Ziffern und Buchstaben",
        en: "Mandatory/normative characters, numbers and letters",
      },
    },
    {
      seq: 2,
      id: "id1",
      names: {
        de: "Buchstaben",
        en: "Letters",
      },
      descriptions: {
        de: "Verpflichtende/normative Buchstaben",
        en: "Mandatory/normative letters",
      },
    },
  ];

  private readonly localeProfiles: Profile[] = Object.values(DIN_LOCALE_FILES)
    .map((file, index) => ({
      seq: 100 + index,
      id: file.id,
      names: file.names,
      descriptions: {
        de: `Buchstaben für ${file.names.de ?? file.id} (DIN-Anhang Länder)`,
        en: `Letters for ${file.names.en ?? file.id} (DIN annex countries)`,
      },
    }))
    .sort((a, b) =>
      (a.names.de ?? a.names.en ?? a.id).localeCompare(
        b.names.de ?? b.names.en ?? b.id,
        "de"
      )
    );

  private readonly profiles: Profile[] = this.baseProfiles;

  private readonly localeCharacterIds = buildDinLocaleIdSets();

  private characters: Character[] = [];

  constructor() {
    this.initializeCharacters();
  }

  private initializeCharacters(): void {
    // Load default keyboard data (copy to avoid mutating shared import)
    this.characters = [...(characterDataDIN as CharacterData).characters];
  }

  private getKeyboardData(keyboardId: string): Character[] {
    switch (keyboardId) {
      case KEYBOARD_DIN_91379_ID:
      case "characters-german":
        // Legacy: German 8-key keyboard removed; use DIN keyboard + Sprache (DIN) filter
        if (keyboardId === "characters-german") {
          console.debug(
            "characters-german is deprecated; using DIN 91379 keyboard"
          );
        }
        return [...(characterDataDIN as CharacterData).characters];
      default:
        console.debug(
          `Unknown keyboard ID: ${keyboardId}, falling back to DIN keyboard`
        );
        return [...(characterDataDIN as CharacterData).characters];
    }
  }

  private sortCharacters(chars: Character[]): Character[] {
    return chars.sort((a, b) => {
      // Helper function to get the primary base character type
      const getPrimaryBaseChar = (char: Character) => {
        const realBaseChar = char.baseChars.find((bc) => bc.type === "real");
        return realBaseChar ? realBaseChar.name : "";
      };

      const aBaseChar = getPrimaryBaseChar(a);
      const bBaseChar = getPrimaryBaseChar(b);

      // Special characters first (baseChar "!")
      if (aBaseChar === "!" && bBaseChar !== "!") return -1;
      if (bBaseChar === "!" && aBaseChar !== "!") return 1;

      // Numbers second (baseChar "1")
      if (aBaseChar === "1" && bBaseChar !== "1") return -1;
      if (bBaseChar === "1" && aBaseChar !== "1") return 1;

      // For all other cases, sort alphabetically by the character name
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });
  }

  async loadKeyboards(keyboardIds: string[]): Promise<void> {
    if (keyboardIds.length === 0) {
      // If no keyboards selected, use the default DIN keyboard
      this.characters = this.sortCharacters(
        this.getKeyboardData(KEYBOARD_DIN_91379_ID)
      );
      return;
    }

    // Merge characters from all selected keyboards
    const allCharacters = keyboardIds.flatMap((id) => this.getKeyboardData(id));

    // Remove duplicates based on character name and info
    const uniqueCharacters = allCharacters.reduce((acc, current) => {
      const isDuplicate = acc.some(
        (char) =>
          char.name === current.name &&
          JSON.stringify(char.info) === JSON.stringify(current.info) &&
          char.case === current.case &&
          JSON.stringify(char.baseChars) === JSON.stringify(current.baseChars)
      );
      if (!isDuplicate) {
        acc.push(current);
      }
      return acc;
    }, [] as Character[]);

    // Sort the characters
    this.characters = this.sortCharacters(uniqueCharacters);
  }

  async getAllProfiles(): Promise<Profile[]> {
    return this.profiles;
  }

  async getLocaleProfiles(): Promise<Profile[]> {
    return this.localeProfiles;
  }

  private normalizeForComparison(str: string): string {
    // Normalize to NFC form and remove variation selectors
    return str.normalize("NFC").replace(/[\uFE00-\uFE0F]/g, "");
  }

  async getFilteredChars(
    profileId: string,
    basechar: string,
    type: string,
    cases: string,
    onlyNormative = true,
    localeProfileId = ""
  ): Promise<Character[]> {
    let filteredChars = [...this.characters];

    if (profileId !== "__all") {
      filteredChars = filteredChars.filter((char) =>
        char.profiles.includes(profileId)
      );
    }

    // Language/region filter (separate JSON per locale; master DIN unchanged)
    if (localeProfileId && isDinLocaleProfile(localeProfileId)) {
      const allowedIds = this.localeCharacterIds.get(localeProfileId);
      if (allowedIds) {
        filteredChars = filteredChars.filter((char) => allowedIds.has(char.id));
      }
    }

    // Filter by normative status
    if (onlyNormative) {
      filteredChars = filteredChars.filter((char) => char.normative);
    }

    // Filter by basechar
    if (basechar) {
      console.debug("Searching for basechar:", basechar);
      console.debug(
        "Basechar codes:",
        Array.from(basechar).map((c) => c.codePointAt(0)?.toString(16))
      );

      const normalizedBasechar = this.normalizeForComparison(basechar);
      filteredChars = filteredChars.filter((char) => {
        // Try exact match first (for emojis and other special characters)
        const exactMatch = char.baseChars.some((bc) => {
          const matches =
            (type === "" || bc.type === type) &&
            this.normalizeForComparison(bc.name) === normalizedBasechar;
          if (matches) {
            console.debug(
              "Found exact match:",
              char.name,
              "baseChar:",
              bc.name
            );
            console.debug(
              "Match codes:",
              Array.from(bc.name).map((c) => c.codePointAt(0)?.toString(16))
            );
          }
          return matches;
        });
        if (exactMatch) return true;

        // Try case-insensitive match for regular characters
        const baseLower = normalizedBasechar.toLowerCase();
        const caseInsensitiveMatch = char.baseChars.some((bc) => {
          const matches =
            (type === "" || bc.type === type) &&
            this.normalizeForComparison(
              bc.nameCaseInsensitive
            ).toLowerCase() === baseLower;
          if (matches) {
            console.debug(
              "Found case-insensitive match:",
              char.name,
              "baseChar:",
              bc.nameCaseInsensitive
            );
            console.debug(
              "Match codes:",
              Array.from(bc.nameCaseInsensitive).map((c) =>
                c.codePointAt(0)?.toString(16)
              )
            );
          }
          return matches;
        });
        return caseInsensitiveMatch;
      });
    }

    // Filter by case
    if (cases === "capital" || cases === "small") {
      filteredChars = filteredChars.filter(
        (char) => char.case === cases || char.case === "undef"
      );
    }

    // Return sorted results
    return this.sortCharacters(filteredChars);
  }

  async getBasecharByChar(char: string): Promise<string[]> {
    console.debug("Getting base char for:", char);
    console.debug(
      "Character codes:",
      Array.from(char).map((c) => c.codePointAt(0)?.toString(16))
    );

    const normalizedChar = this.normalizeForComparison(char);
    const foundChars = this.characters.filter((c) => {
      const matches = this.normalizeForComparison(c.name) === normalizedChar;
      if (matches) {
        console.debug("Found exact match:", c.name);
        console.debug(
          "Match codes:",
          Array.from(c.name).map((ch) => ch.codePointAt(0)?.toString(16))
        );
      }
      return matches;
    });
    console.debug("Found chars:", foundChars);

    if (foundChars.length > 0) {
      // Get all unique real basechars from matching characters
      const realBaseChars = foundChars
        .flatMap((c) => c.baseChars)
        .filter((bc) => {
          const isReal = bc.type === "real";
          if (isReal) {
            console.debug("Real base char:", bc.name);
            console.debug(
              "Base char codes:",
              Array.from(bc.name).map((c) => c.codePointAt(0)?.toString(16))
            );
          }
          return isReal;
        })
        .map((bc) => bc.name);

      // Remove duplicates
      const uniqueBaseChars = [...new Set(realBaseChars)];
      console.debug("Found base chars:", uniqueBaseChars);
      console.debug(
        "Base char codes:",
        uniqueBaseChars.map((c) =>
          Array.from(c).map((ch) => ch.codePointAt(0)?.toString(16))
        )
      );

      if (uniqueBaseChars.length > 0) {
        return uniqueBaseChars;
      }
    }

    // If no character found or no real basechar, try to decompose the character
    const normalized = char.normalize("NFD");
    console.debug("Normalized char:", normalized[0]);
    console.debug(
      "Normalized codes:",
      Array.from(normalized[0]).map((c) => c.codePointAt(0)?.toString(16))
    );
    return [normalized[0]];
  }

  async getCaseOfChar(char: string): Promise<string> {
    const foundChar = this.characters.find((c) => c.name === char);
    return foundChar?.case || "undef";
  }

  async getModelProperties(): Promise<{ dataversion: string; name: string }> {
    return this.modelProperties;
  }
}

// Exports
export type {
  IStringLatinModelService as StringLatinModelService,
  Profile,
  Character,
  BaseChar,
};
export { StringLatinModelServiceImpl };

export function getModel(): IStringLatinModelService {
  return new StringLatinModelServiceImpl();
}
