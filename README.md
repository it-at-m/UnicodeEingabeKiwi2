<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]

# Virtual Keyboard (KIWI V2.1) #

## Demo

You can find a hosted demo version at [kiwi.muenchen.de](https://kiwi.muenchen.de).

For professional use, we recommend installation on your own dedicated server as we can not guarantee availability of this service.

## :england:󠁧 Background

*KIWI* (**Ki**nderleicht **W**ortbestandteile **i**ntegrieren) is an input aid which is used for the convenient and efficient input of characters from the character set *Latin characters in Unicode*.

Characters with diacritics (e.g. Ẫ, D̂, Ģ, and M̂) or of non-German origin (e.g. ð, ø or þ) are generally not found on conventional German keyboards. KIWI makes all characters from the character set *Latin characters in UNICODE* easy to find and enter.

In KIWI, names with diacritical characters, for example, can be easily entered using a conventional keyboard and then copied and pasted into any (specialist) application. The character set *Latin characters in UNICODE* is particularly relevant for names of natural and legal persons and for addresses.

*Latin characters in Unicode* is a standard created by the [Coordination Office for IT Standards (KOSIT)](https://www.xoev.de/) on behalf of the [IT Planning Council](https://www.it-planungsrat.de/).
In summary, it defines what is understood by Unicode-compliant processing as a minimum for the German public administration.

With [Decision 2014/04](http://www.it-planungsrat.de/DE/Entscheidungen/2014/13_Sitzung/13_Sitzung_Entscheidungen.html), the IT Planning Council at its 13th meeting defined the character set *Latin characters in UNICODE* that must be supported by IT processes in the Federal Republic of Germany.  The further development of this is [DIN SPEC 91379:2019-03](https://de.wikipedia.org/wiki/DIN_SPEC_91379), which differs in two points:

* Enlarged character set
* Non-normative characters (Greek and Cyrillic)

## :de: Hintergrund 

*KIWI* (**Ki**nderleicht **W**ortbestandteile **i**ntegrieren) ist eine Eingabehilfe, welche der komfortablen und effizienten Eingabe von Zeichen aus dem Zeichenvorrat *Lateinische Zeichen in Unicode* dient. 

Zeichen mit Diakritika (z.B. Ẫ, D̂, Ģ, und M̂) oder nicht deutschen Ursprungs (z.B. ð, ø oder þ) findet man auf herkömmlichen deutschen Tastaturen in der Regel nicht. KIWI macht alle Zeichen aus dem Zeichensatz *Lateinische Zeichen in UNICODE* leicht auffindbar und eingebbar. 

In KIWI können mittels herkömmlicher Tastatur z.B. Namen mit diakritischen Zeichen einfach eingegeben und dann mittels Copy & Paste in beliebige (Fach-)Anwendungen übernommen werden. Der Zeichensatz *Lateinische Zeichen in UNICODE* ist insbesondere für Namen natürlicher und juristischer Personen sowie bei Adressen relevant.

*Lateinische Zeichen in Unicode* ist ein Standard, der von der [Koordinierungsstelle für IT-Standards (KOSIT)](https://www.xoev.de/) im Auftrag des [IT-Planungsrats](https://www.it-planungsrat.de/) erstellt wurde. 
Zusammengefasst wird darin für die deutsche öffentliche Verwaltung verbindlich definiert, was unter Unicode-konformer Verarbeitung mindestens verstanden wird.

Mit der [Entscheidung 2014/04](http://www.it-planungsrat.de/DE/Entscheidungen/2014/13_Sitzung/13_Sitzung_Entscheidungen.html) hat der IT-Planungsrat in seiner 13. Sitzung den Zeichensatz *Lateinische Zeichen in UNICODE* festgelegt, der von IT-Verfahren in der Bundesrepublik Deutschland unterstützt werden muss. Die Fortentwicklung davon ist die [DIN SPEC 91379:2019-03](https://de.wikipedia.org/wiki/DIN_SPEC_91379), welche sich durch zwei Punkte unterscheidet:

* Vergrößerter Zeichenvorrat
* Nicht-normative Zeichen (griechisch und kyrillisch)

Siehe auch:

* [Wikipedia](https://de.wikipedia.org/wiki/Lateinische_Zeichen_in_Unicode)
* [KOSIT](https://www.xoev.de/detail.php?gsid=bremen83.c.4813)
* [DIN SPEC 91379](https://de.wikipedia.org/wiki/DIN_SPEC_91379)

# Development

## Prerequisites

The following tools are required as a minimum for a build:

1. [GIT](https://git-scm.com/)
2. [Node.js LTS](https://nodejs.org/)

The following tools are recommended for development purposes:

3. [license-checker](https://www.npmjs.com/package/license-checker)
4. [License Finder](https://github.com/pivotal/LicenseFinder)


## Build and Run

1. `npm install`
2. `npm run serve` 
3. Open the URL that's shown in the terminal

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

# Deployment

## Docker

`docker run --p 8081:8081 ghcr.io/it-at-m/unicodeeingabekiwi2:main`

## Build it yourself

1. `npm install`
2. `npm run build`
3. Copy `/dist`-Folder to a webserver of your choice.

## Running ##

### Log-Level ###

* KIWI loggt auf die JavaScript-Konsole des Browsers, wobei dort der angezeigt Log-Level eingestellt werden kann.

# Known Bugs

* On *Apple Safari* (only there!) there is currently a problem with the scrolling behavior of the app bar, which results from a currently open *Vuetify bug*: [#12573](https://github.com/vuetifyjs/vuetify/issues/12573).

# Licensing and Copyright

© Copyright 2019-2024 – it@M

*Kiwi* is licenced under [MIT](https://de.wikipedia.org/wiki/MIT-Lizenz).

---

Further technical information can be found [here](ADR.md).

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/it-at-m/UnicodeEingabeKiwi2.svg?style=for-the-badge
[contributors-url]: https://github.com/it-at-m/UnicodeEingabeKiwi2/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/it-at-m/UnicodeEingabeKiwi2.svg?style=for-the-badge
[forks-url]: https://github.com/it-at-m/UnicodeEingabeKiwi2/network/members
[stars-shield]: https://img.shields.io/github/stars/it-at-m/UnicodeEingabeKiwi2.svg?style=for-the-badge
[stars-url]: https://github.com/it-at-m/UnicodeEingabeKiwi2/stargazers
[issues-shield]: https://img.shields.io/github/issues/it-at-m/UnicodeEingabeKiwi2.svg?style=for-the-badge
[issues-url]: https://github.com/it-at-m/UnicodeEingabeKiwi2/issues
[license-shield]: https://img.shields.io/github/license/it-at-m/UnicodeEingabeKiwi2.svg?style=for-the-badge
[license-url]: https://github.com/it-at-m/UnicodeEingabeKiwi2/blob/master/LICENSE
[product-screenshot]: images/screenshot.png