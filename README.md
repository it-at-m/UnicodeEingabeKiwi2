# Virtuelles Keyboard (KIWI V2.0) #

## Hintergrund ##
*KIWI* (**Ki**nderleicht **W**ortbestandteile **i**ntegrieren) ist eine Eingabehilfe, welche der komfortablen und effizienten Eingabe von Zeichen aus dem Zeichenvorrat *Lateinische Zeichen in Unicode* dient. Zeichen mit Diakritika (z.B. Ẫ, D̂, Ģ, und M̂) oder nicht deutschen Ursprungs (z.B. ð, ø oder þ) findet man auf herkömmlichen deutschen Tastaturen in der Regel nicht. KIWI macht alle Zeichen aus dem Zeichensatz *Lateinische Zeichen in UNICODE* leicht auffindbar und eingebbar. In KIWI können mittels herkömmlicher Tastatur z.B. Namen mit diakritischen Zeichen einfach eingegeben und dann mittels Copy & Paste in beliebige (Fach-)Anwendungen übernommen werden. Der Zeichensatz *Lateinische Zeichen in UNICODE* ist insbesondere für Namen natürlicher und juristischer Personen sowie bei Adressen relevant. 


*Lateinische Zeichen in Unicode* ist ein Standard, der von der [Koordinierungsstelle für IT-Standards (KOSIT)](https://www.xoev.de/) im Auftrag des [IT-Planungsrats](https://www.it-planungsrat.de/) erstellt wurde. Zusammengefasst wird darin für die deutsche öffentliche Verwaltung verbindlich definiert, was unter Unicode-konformer Verarbeitung mindestens verstanden wird. Mit der [Entscheidung 2014/04](http://www.it-planungsrat.de/DE/Entscheidungen/2014/13_Sitzung/13_Sitzung_Entscheidungen.html) hat der IT-Planungsrat in seiner 13. Sitzung den Zeichensatz *Lateinische Zeichen in UNICODE* festgelegt, der von IT-Verfahren in der Bundesrepublik Deutschland unterstützt werden muss. Die Fortentwicklung davon ist die [DIN SPEC 91379:2022-08](https://de.wikipedia.org/wiki/DIN_SPEC_91379), welche sich durch zwei Punkte unterscheidet:
* Vergrößerter Zeichenvorrat
* Nicht-normative Zeichen (griechisch und kyrillisch)

Siehe auch:

* [Wikipedia](https://de.wikipedia.org/wiki/Lateinische_Zeichen_in_Unicode)
* [KOSIT](https://www.xoev.de/detail.php?gsid=bremen83.c.4813)
* [DIN SPEC 91379](https://de.wikipedia.org/wiki/DIN_SPEC_91379)

## Vorausetzungen für den Build ##
*Hinweise*: 

* Für die Entwicklung oder das Bauen der Anwendung ist Linux von Vorteil, da dort einige der notwendigen Tools über das Paketmanagement zur Verfügung stehen und nicht einzeln heruntergeladen werden müssen. 
* Alle Tools müssen im Pfad (Umgebungsvariable *PATH*) erreichbar sein. Unter Windows empfiehlt es sich darum den Build aus der GIT-Shell heraus aufzurufen.

Die folgenden Tools sind für einen Build mindestens notwendig:

1. Installation vom [GIT](https://git-scm.com/)
2. Installation von [Maven](https://maven.apache.org/) und [Java](https://www.java.com/)
3. Installation von [Node.js LTS](https://nodejs.org/)

Wenn eine Weiterentwicklung angestrebt wird, dann empfehlen sich darüber hinaus zusätzlich die folgenden Tools:

4. Installation von [license-checker](https://www.npmjs.com/package/license-checker)
5. Installation von Google Chrome oder Chromium, da dieser Web-Browser sich am besten zum Debuggen eignet.
6. Installation von [Python 3](https://www.python.org/), für die Hilfesskripte.
7. Installation von [License Finder](https://github.com/pivotal/LicenseFinder) für die Prüfung von Lizenzen verwendeter Komponenten.

## TL;DR ##
### Testen ###
Hier gibt es eine Demo, die kein offizieller Service der Stadt München ist, aber sich zum Ausprobieren trotzdem gut eignet: [kiwi.muenchen.de](https://kiwi.muenchen.de) Für eine professionelle Nutzung empfehlen wir eine Installation auf einem eigenen, dedizierten Server.


### Bauen zu Entwicklungszwecken oder zum Ansehen ##
*Hinweis*: Für das Deployment empfiehlt sich ein echter Build (siehe Kapitel *Für Deployment / Betrieb*), weil damit weitere Dinge automatisiert werden.

Vorgehen:

1. *npm install* ausführen, damit die Dependencies aufgelöst werden (Das Build-Ergebnis wird aber nicht direkt verwendet.)
2. *npm run serve* ausführen.


### Für Deployment / Betrieb ###
Vorgehen:

1. *npm install* ausführen.
2. *npm run build* ausführen
3. (Web-)Browser mit der URL aufrufen, die auf der Kommandozeile angegeben wird. Ein Webserver wird benötigt mit mod_deflate, mod_expires, mod_headers, mod_rewrite aktiviert, Option AllowOverride auf Einstellung All für Dokument-Root des Web-Servers.

## Bekannte Bugs ##
* Auf *Apple Safari* (nur dort!) gibt es derzeit ein Problem mit dem Scroll-Verhalten der App-Bar, das aus einem derzeit offene *Vuetify-Bug* resultiert: [#12573](https://github.com/vuetifyjs/vuetify/issues/12573).

## Lizenzierung und Copyright ##
© Copyright 2019-2024 – it@M

*Kiwi* ist lizenziert unter der [European Union Public Licence (EUPL)](https://de.wikipedia.org/wiki/European_Union_Public_Licence).

## Namen ##
Der Namen dieser Software ist *KIWI*, im Programmcode wird jedoch durchgängig der Projektname *VirtualKeyb* verwendet. Nur an der Benutzeroberfläche ist durchgängig von *KIWI* die Rede.

## Builds ##

Das Build-System basiert auf Maven und integriert die für einen erfolgreichen Build einer Anwendung notwendigen Schritte bzw. notwendigen Aufrufe der Tools. Damit verschiedene konkurrierende Ziele eines Builds bedient werden können sind verschiedene Maven-Profile definiert.

### Maven-Profile ###
* *with-tests*:
    * Startet einen Build, der anschließend Unit-Tests ausführt.
    * Wenn dieses Profil aktiviert wird, so muss gleichzeitig das Profil *with-build* deaktiviert werden.
* *with-es-lint*:
    * Integriert *eslint* in den Build.
* *with-check-license*:
    * Prüft, ob die Lizenzen der benutzten Komponenten den Regeln entsprechen. I.w. bedeutet das, dass ausschließlich Komponenten mit kostenfreien Lizenzen verwendet werden und welche, die mit der für KIWI verwendeten Lizenz EUPL kompatibel sind.
    * Wenn dieses Profil aktiviert wird, so muss gleichzeitig das Profil *with-build* aktiviert werden.
* *with-build*: (Standardmäßig aktiviert)
    * Führt auch Build aus.
* *with-alt-root*:
    * Erzeugt einen Build, der im *Nicht*-Root des Web-Servers deployt werden kann.
    * Wenn dieses Profil aktiviert wird, so muss gleichzeitig das Profil *with-build* aktiviert werden.
    * Durch das Setzen des Java-Properties *publicPath* beim Build mittels Maven (MVN-Kommandozeilenoption *-D*) wird dieses Profile aktiviert. 
    * Der Wert des Properties entspricht dem Pfad, unter dem KIWI von per Web-Server zu ereichen ist: Z.B. *-DpublicPath=test* erzeugt einen Build der unter der URL */test* erreichbar ist.  

### Release-Builds ###

### Tests ausführen ###
Ausführen Builds mit dem Maven-Profile *with-tests*.

### Dependencies ###
*npm* benutzet [semantic versioning](https://semver.org/lang/de/) und eine Syntax für Versionsbezeichnungen, die [hier](https://docs.npmjs.com/about-semantic-versioning) schön beschrieben ist.

#### *npm*-Dependendies ####

* Mit folgendem Kommando kann geprüft werden, ob *npm*-Dependencies veraltet sind:

    npm outdated

## Running ##

### Log-Level ###
* KIWI loggt auf die JavaScript-Konsole des Browsers, wobei dort der angezeigt Log-Level eingestellt werden kann.

### Lokaler Web-Server für Entwicklungs- und Testarbeiten ###
* Im Verzeichnis *VirtualKeyboard* das Kommand *npm run serve* ausführen.

### Deployment auf Web-Server ###
* Die Anwendung besteht nur aus statischen Dateien, die auf einem [Apache HTTPD](https://httpd.apache.org/) im *DocumentRoot* (Ausnahme: MVN-Profil *with-alt-root*, s.o.) gehostet werden können.
* Die Anwendung kann nach einem erfolgreichen Build der Zip-Datei *~/.m2/repository/de/muenchen/uc/kiwi2/1.0.0-SNAPSHOT/kiwi2-1.0.0-SNAPSHOT.jar* entnommen werden.
* Damit die Anwendung einfach das Caching steuern kann, muss der Apache Web-Server wie folgt konfiguriert werden:
    * HTTPS-Zertifikat passend zur Domain
    * [AllowOverride-Direktive](https://httpd.apache.org/docs/2.4/de/mod/core.html#allowoverride) auf *All* setzen.
        * Die lokale Konfiguration ist in der ZIP-Datei in *.htaccess* enthalten.
    * Die Module *[mod_expires](https://httpd.apache.org/docs/current/mod/mod_expires.html)*, *[mod_deflate](https://httpd.apache.org/docs/current/mod/mod_deflate.html)* und *[mod_rewrite](https://httpd.apache.org/docs/current/mod/mod_rewrite.html)* aktivieren.


## Design-Entscheidungen ##

### Struktur (Aufbau) der App ###
* Die Anwendung, die an der GUI *KIWI* heißt, ist technisch als Vue-Anwendung *virtkeyb-app* realisiert. Konkret wurde [Vue 2](https://vuejs.org/) und [Vueitfy 2](https://vuetifyjs.com/) verwendet.
* Die Anwendung untergliedert sich in folgende Vue-Views:
    * *App.vue*: App-Shell
    * *Main.vue*: Hauptbildschirm
* Server-seitig gibt es keine Anwendungslogik oder Datenbank. Die Anwendung benutzt den Web-Server, von dem sie geladen wird, wie eine Dateiablage.

### Poly-Fill für Copy & Paste ###
* Der Zugriff aus die Zwischenablage des ausführenden Systems aus einer Web-Anwendung heraus, die in einem Browser läuft, unterliegt diversen Problemen:
    * Unterschiedliche APIs in verschiendenen Browsern bzw. Browser-Versionen, z.T. auch abhängig von der Zielplattform.
    * Manche Zielplattformen (z.B. iOS) lassen Zugriff nur aus Code heraus zu, der von sogenannten "trusted event" getriggert wurde. Auf Desktop-Betriebssystemen gibt es i.d.R. - die richtige API vorausgesetzt - keine Probleme beim Zugriff auf die Zwischenablage. 
* Es wurde für den Zugriff auf die Zwischenablage ein Polyfill benutzt, dass i.d.R. sehr gut funktioniert: [clipboard-polyfill](https://www.npmjs.com/package/clipboard-polyfill) 

### Unicode-Verarbeitung ###
* Für die Zerlegung eines Unicode-Strings in sogenannte Grapheme wird ein NPM-Modul benutzt, das die Zerlegung für *Unicode 13* unterstützt: [Graphemer](https://www.npmjs.com/package/graphemer) 
* Die Sortierung gemäß Unicode wurde mit Hilfe der Browser-API [Intl.Collator](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/Collator) umgesetzt.

### Datenbank für Zeichenvorrat ###
* Die Anwendung präsentiert einen wohl-definierten Zeichenvorrat, den sie in Form einer [XML-Datei](public/model/stringlatin-v2.xml) lädt.
* Die XML-Datei, die einen wohldefinierten Inhalt hat, der einem XML-Schema genügt, fungiert als Readonly-Model bzw. -Datenbank, auf der die Datei mit Hilfe von XPath die für die Funktion notwendigen Suchen durchführt. 
* Der Zeichenvorrat (plus Basiszeichen und Profile/Regionen), den die Anwendung dem Benutzer gegenüber präsentiert, kann durch das Austauschen der XML-Datei angepasst werden, wozu die Anwendung mit der geänderten/angepassten XML-Datei neu deployed werden muss. Damit keine Zusatzaufwände durch Tests der Anwendung entstehen, weist die Anwendung zwei Versionsnummern aus, damit keine Anwendungstests notwendig sind, wenn sich nur der Datenstand ändert:
    * Die Version der Anwendung, die den Stand der Anwendung selbst identifiziert.
    * Den Datenstand, der den Stand des XML-Dokuments, das den Zeichenvorrat enthält, identifiziert.
* Der Aufbau der XML-Datei ist in Form von Inline-(XML-)Kommentaren in der XML-Datei selbst und im [XMLSchema](public/model/stringlatin-v2.xsd) dokumentiert.

### Fonts ###
Die Darstellung von Zeichen mit Diakritika ist aufgrund der feinen Unterschiede für die Render-Engine des Browsers anspruchsvoll. Nachdem HTML seit der Version 2.0 Unicode fordert, sind die Browser bei der Darstellung von Zeichen mit Diakritika sehr gut. Damit die Render-Engine bei der Darstellung von Zeichen ihre Stärken voll ausspielen kann, sollte man dem Browser keine all zu engen Vorgaben zu machen. Aus diesem Grund benutzt die Anwendung als Fontstack für die Komponenten, bei denen es unbedingt auf die korrekte optische Darstellung ankommt, nur den (Pseudo-)Font *sans-serif*.

### Lizenzen ###
* Bei der Auswahl der Komponenten, die in KIWI verwendet werden, wurde darauf geachtet, dass sie freien Lizenzen unterliegen, die die Verwendung / Nutzung in keiner Weise einschränken.
* Die Anwendung weist Lizenzen der Komponenten, die Verwendung finden in der Benutzeroberfläche [aus](public/help/de/license.html). Der Grundstock für diese statische HTML-Datei kann mit Hilfe eines kleine Python3-Scripts erzeugt werden: [gen_licenses.py](tools/gen_licenses.py).

### Caching ###
* KIWI kann grundsätzlich auf jedem Web-Server deployed werden, der Dateien mit Hilfe von HTTP/s-Zertifikaten ausliefert, die vom Browser anerkannt werden. 
* Es empfiehlt sich jedoch KIWI auf einem Apache-Web-Server zu hosten bei dem die Option *[AllowOverride](https://httpd.apache.org/docs/2.4/mod/core.html#allowoverride)* so gesetzt ist, dass *.htaccess* berücksichtigt wird. Auf diesen Weg, kann mit Hilfe der in Kiwi enthaltenen [.htaccess-Datei](.htaccess) das Caching angepasst werden. Ziel ist, ohne Änderungen am Server die Caching-Dauer der Anwendung auf dem Client anzupassen.
* Die Idee ist, dass das Caching zu Beginn einer neuen Anwendung kürzer ist (z.B. 24 Stunden), damit kurzfristig Änderungen zu den Nutzern gelangen. Wenn später die Anwendung stabilisiert ist oder die Last auf dem Web-Server stark zunimmt, dann kann die Anwendung länger gecacht werden. 

### Online-Hilfe ###
Die kontext-sensitive Hilfe ist dadurch realisiert, dass programmatisch das Element mit dem Fokus ermittelt wird und die IDs mit Hilfe einer [JSON-Datei](public/help-mapping.json) auf die URLs abgebildet werden, die dem Kontext entsprechen.

### Offline-Fähigkeit ###
Grundsätzlich kann KIWI zu einer Offline-fähigen App erweitert werden, aber derzeit ist der dafür notwendige Service-Worker deaktiviert, weil er die Caching-Einstellungen konterkariert.

### Konfiguration ###
* Die Anwendung benutzt für die persistente Ablage von Konfigurationsdaten den *Local storage* des Web-Browsers. 

### Accessibility (a11y) ###
Die Anwendung wurde auf Barrierearmut getestet:

* Mit Hilfe von [Lighthouse im Chrome Browser](https://developers.google.com/web/tools/lighthouse/)
* Durch manuelle Durchführung des [BITV-Test](https://www.bitvtest.de/) mit Level *A* und *AA*.

### GUI ###
* Grundsätzlich ist in der derzeitigen Version das (ergonomische) Funktionieren von KIWI mit Touch-Bedienung (Smartphone, etc.) nicht im Fokus, aber es wurde dort wo es leicht möglich ist, schon "mitgedacht".
    * Jeder Hot-Key kann auch über eine andere Touch-Interaktion ausgelöst werden.
* Es wurde eine platzsparende GUI entworfen, die responsive ist. D.h. die Anwendung lässt sich auf dem Bildschirm klein machen ohne dabei mehr Scrollen als notwendig zu erzwingen. Wichtige Teile, konkret der Eingabepuffer bleiben auch beim Scrollen auf dem Bildschirm erhalten.
* Die GUI ist so entworfen, dass sie mit den (wohlbekannten) Browser-Tasten vergrößert (String-"+") und verkleinert (String-"-") werden kann.
* Die reine Tastaturbedienung wurde auch berücksichtigt:
    * Die üblichen Tastatur-Shortcuts wurden analog belegt: Strg-C kopiert automatisch den Puffer in die Zwischenablage.
    * Es wurde eine automatische Fokussteuerung realisiert, die das häufige Springen zwischen Tastatur und Puffer beschleunigt. Sie ist für Barrierearmut in den Optionen abschaltbar.

### Error-Handling ###
* Die Anwendung wurde mit einem Error-Handing augestattet:
    * Wenn JavaScript ausgeschaltet ist, so funktioniert Kiwi (überhaupt) nicht. In diesem Fall wird der Benutzer aufgefordert es einzuschalten.
    * Im Fall von Fehlern wird in der JavaScript-Konsole protokolliert und dem Benutzer eine Fehlermeldung angezeigt.


## Suchlogik bei Suche nach Basiszeichen ##

### Hinweise ###
* Die Suche nach Zeichen ist eigentlich eine Suche nach *Graphemen*. Mit *Graphem* wir die Sequenz aus Zeichen bezeichnet, die zusammen den (graphischen) Raum eines Zeichens einnehmen: Beispielsweise ist die Sequenz *a* ein Graphem, das aus einem Zeichen besteht. Allerdings können Grapheme auch aus mehr aus einem Zeichen bestehen: Basiszeichen plus 1 - n kombinerende Zeichen: *M̂* Ist ein Graphem aus zwei Zeichen mit den Codepoints 0x004D und 0x0302.
* Wenn Nicht-Groß-Kleinschreibungssensitiv gesucht wird, dann wird das zu suchende Zeichen als die Suchmenge der Zeichen auf Kleinschreibung normiert. Wenn ein Zeichen bereits in Kleinschreibung vorliegt, dann ist bei diesem Schritt nichts zu tun.

### Algorithmus ###
1. Ermitteln des Basiszeichens anhand des gegebenen Zeichens.
    * (Such-)Kriterien
        * Zeichen hat ein Basiszeichen vom Typ *real*. 
    * Reduktion
        * Wenn genau ein Zeichen gefunden wird, dann wird dieses verwendet.
        * Wenn mehrere Zeichen gefunden werden, dann wird das Erste gemäß der Unicode-Sortierung verwendet.
        * Wenn kein Zeichen gefunden wird, dann wird das Zeichen in Normalform D zerlegt und das erste Zeichen als Basiszeichen benutzt.
2. Suchen der Zeichen, die vom Basiszeichen abgeleitet sind:
    * (Such-)Kriterien, die mit logischem *Und* kombiniert werden, sind: 
        * Profil, wobei beim Profil *Alle* alle Zeichen ohne ansehen des Profils selektiert werden.
        * Zeichen ist normativ, d.h. normativ = true.
        * Zeichen hat gegebenes Basiszeichen, wobei der Typ des Basiszeichens (*pseudo* oder *real*) für diesen Schritt irrelevant ist. 
    * Die Zeichen, die als Treffermenge herausgefiltert wurden, werden mit einer Ausnahme gemäß Unicode-Sortierung sortiert: Das erste (linkeste) Zeichen ist gemäß Fachkonzept *immer*  das Basiszeichen.


# Virtual Keyboard (KIWI V2.0)

## Background
KIWI (Easily Integrate Word Components) is an input aid for the comfortable and efficient input of characters from the Unicode Latin characters set. This includes characters with diacritics (e.g., Ẫ, D̂, Ģ, M̂) or those not of German origin (e.g., ð, ø, þ), which are typically not found on standard German keyboards. KIWI makes all characters from the Latin Characters in UNICODE set easily accessible and enterable. With KIWI, names containing diacritical marks can be easily entered using a standard keyboard and then transferred to any application via copy & paste. The Latin Characters in UNICODE set is particularly relevant for names of natural and legal persons as well as addresses.

The Latin Characters in Unicode is a standard that was created by the Coordination Office for IT Standards (KOSIT) on behalf of the IT Planning Council. It defines what is understood by Unicode-compliant processing in German public administration. The IT Planning Council, in its 13th session, made a decision to support the Latin Characters in UNICODE set in IT procedures within the Federal Republic of Germany. This development was furthered by DIN SPEC 91379, which differs by having an enlarged character set and including non-normative characters (Greek and Cyrillic).

## Prerequisites for the Build
- Linux is preferred for development or building of the application, as some necessary tools are available through package management and do not need to be downloaded individually.
- All tools must be accessible in the path (environment variable PATH). Under Windows, it is therefore recommended to initiate the build from the GIT shell.

The following tools are necessary for a build:
1. Installation of GIT
2. Installation of Maven and Java
3. Installation of Node.js LTS

If further development is sought, then the following tools are additionally recommended:
4. Installation of license-checker
5. Installation of Google Chrome or Chromium for debugging.
6. Installation of Python 3 for helper scripts.
7. Installation of License Finder for checking licenses of used components.

## Testing
There is a demo, which is not an official service of the city of Munich, but well-suited for trying out. For professional use, installation on a dedicated server is recommended.

## Building for Development Purposes or for Viewing
For deployment, a real build is recommended as it automates further tasks.

## For Deployment / Operation
A web server is required with specific modules activated. Known bugs include an issue with the scrolling behavior of the app bar on Apple Safari.

## Licensing and Copyright
Copyright 2019-2024 by it@M. KIWI is licensed under the European Union Public Licence (EUPL).

## Conclusion
This document covers the background, prerequisites for building, testing, deployment, known bugs, and licensing information for KIWI V2.0, a virtual keyboard application.