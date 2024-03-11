
# Architectural and other Design-Decisions

## Naming

The name of this software is *KIWI*, but in the program code the project name *VirtualKeyb* is used throughout.
project name *VirtualKeyb* is used throughout the program code.
Only the user interface refers to *KIWI* throughout.

## Structure

* The application, which is called *KIWI* on the GUI, is technically realized as a Vue application *virtkeyb-app*. Specifically, [Vue 2](https://vuejs.org/) and [Vueitfy 2](https://vuetifyjs.com/) were used.
* The application is subdivided into the following Vue views:
    * *App.vue*: App shell
    * *Main.vue*: Main screen

## Unicode-Handling

* For the decomposition of a Unicode string into so-called graphemes, an NPM module is used which supports the decomposition for *Unicode 13*: [Graphemer](https://www.npmjs.com/package/graphemer)
* Sorting according to Unicode was implemented using the browser API [Intl.Collator](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator).

## "Database" for character set

* The application presents a well-defined character set, which it loads in the form of an [XML file](public/model/stringlatin-v2.xml).
* The XML file, which has a well-defined content that satisfies an XML schema, acts as a read-only model or database on which the file performs the searches required for the function with the help of XPath.
* The character set (plus basic characters and profiles/regions) that the application presents to the user can be
  user can be customized by exchanging the XML file,
  This requires the application to be redeployed with the modified/adapted XML file.
  In order to avoid any additional work caused by testing the application, the application has two
  version numbers so that no application tests are necessary if only the data status changes:
    * The version of the application, which identifies the status of the application itself.
    * The data status, which identifies the status of the XML document containing the character set.
* The structure of the XML file is documented in the form of inline (XML) comments in the XML file itself and in [XMLSchema](public/model/stringlatin-v2.xsd).

## Fonts

The display of characters with diacritics is challenging for the browser's rendering engine due to the subtle differences.
Since HTML has required Unicode since version 2.0, browsers are very good at displaying characters with diacritics.
diacritics very well. In order for the render engine to fully exploit its strengths when displaying characters
the browser should not be too tightly constrained.
For this reason, the application uses a font stack for the components,
components where the correct visual display is essential, the application only uses the
(pseudo) font *sans-serif*.

## Licenses

* When selecting the components that are used in KIWI, care was taken to ensure
  that they are subject to free licenses that do not restrict their use in any way.
* The application displays licenses for the components that are used in the user interface (public/help/en/license.html).
  The basis for this static HTML file can be generated using a small Python3 script: [gen_licenses.py](tools/gen_licenses.py).

## Caching

* KIWI can basically be deployed on any web server that delivers files using HTTP/s certificates that are recognized by the browser.
* However, it is recommended to host KIWI on an Apache web server where the option *[AllowOverride](https://httpd.apache.org/docs/2.4/mod/core.html#allowoverride)* is set so that *.htaccess* is taken into account. In this way, the caching can be adjusted with the help of the [.htaccess file](.htaccess) contained in Kiwi. The aim is to adjust the caching duration of the application on the client without making changes to the server.
* The idea is that caching is shorter at the start of a new application (e.g. 24 hours) so that changes reach users quickly. Later, when the application is stabilized or the load on the web server increases significantly, the application can be cached for longer.

## Online-Help

Context-sensitive help is realized by programmatically determining the element with the focus and mapping the IDs to the URLs that correspond to the context using a [JSON file](public/help-mapping.json).

## PWA-Ability

In principle, KIWI can be expanded into an offline-capable app, but the service worker required for this is currently deactivated because it interferes with the caching settings.

## Configuration

* The application uses the *local storage* of the web browser for the persistent storage of configuration data.
* 
## Accessibility (a11y)

The application has been tested for accessibility:

* With the help of [Lighthouse in the Chrome browser](https://developers.google.com/web/tools/lighthouse/)
* By manually performing the [BITV test](https://www.bitvtest.de/) with level *A* and *AA*.

## GUI

* Basically, the current version does not focus on the (ergonomic) functioning of KIWI with touch operation (smartphone, etc.), but it has already been "thought through" where it is easily possible.
    * Each hot key can also be triggered via a different touch interaction.
* A space-saving GUI has been designed that is responsive. This means that the application can be made small on the screen without forcing more scrolling than necessary. Important parts, specifically the input buffer, are retained even when scrolling on the screen.
* The GUI is designed in such a way that it can be enlarged (string "+") and reduced (string "-") using the (well-known) browser keys.
* Keyboard-only operation has also been taken into account:
    * The usual keyboard shortcuts have been assigned analogously: Ctrl-C automatically copies the buffer to the clipboard.
    * Automatic focus control has been implemented, which speeds up the frequent jumping between keyboard and buffer. It can be switched off in the options to minimize barriers.

# Search logic when searching for basic characters

## Hints

* The search for characters is actually a search for *graphemes*. A *grapheme* is a sequence of characters that together occupy the (graphic) space of a character: For example, the sequence *a* is a grapheme consisting of one character. However, graphemes can also consist of more than one character: Base character plus 1 - n combining characters: *M̂* Is a grapheme consisting of two characters with code points 0x004D and 0x0302.
* If the search is not case-sensitive, the character to be searched for is normalized to lower case as the search set of characters. If a character already exists in lower case, then nothing needs to be done in this step.

## Algorithm

1. determine the base character based on the given character.
    * (Search) criteria
        * Character has a base character of type *real*.
    * Reduction
        * If exactly one character is found, then this is used.
        * If several characters are found, the first one is used according to the Unicode sorting.
        * If no character is found, the character is broken down into normal form D and the first character is used as the base character.
2. search for characters derived from the base character:
    * (Search) criteria combined with logical *and* are:
        * Profile, where for the profile *All* all characters are selected without viewing the profile.
        * Character is normative, i.e. normative = true.
        * Character has a given base character, whereby the type of base character (*pseudo* or *real*) is irrelevant for this step.
    * The characters that were filtered out as a hit list are sorted according to Unicode sorting with one exception: The first (leftmost) character is *always* the base character according to the technical concept.