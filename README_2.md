<div id="top"></div>

<!-- PROJECT SHIELDS -->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]


<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/it-at-m/UnicodeEingabeKiwi2">
    <img src="images/logo.png" alt="Logo" height="200">
  </a>

<h3 align="center">E-appointment Frontend</h3>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>


<!-- ABOUT THE PROJECT -->
## About The Project

The document is a README file for "KIWI V2.0," a virtual keyboard designed to make it easy to integrate and type Latin characters from the Unicode character set, including characters with diacritics and characters not of German origin, which are not typically found on standard German keyboards. It provides various functionalities that would otherwise have to be created by the user:

- Detailed configuration of the rollup-config
- Preconfigured build and release pipeline
- Dev server for local development
- Instructions to use the package locally with `npm pack`
- Integrated API Gateway

<p align="right">(<a href="#top">back to top</a>)</p>

### Built With

This project is built with:

* [Vue.js](https://vuejs.org)
* [Vuetify](https://vuetifyjs.com/en/)
* [Rollup](https://github.com/rollup/rollup)
* [vue-sfc-rollup](https://github.com/team-innovation/vue-sfc-rollup)
* [Sping API-Gateway](https://spring.io/guides/gs/gateway/)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

_Below is an example of how you can installing and setup up your service_

1. `git clone `
2. `mvn install`
3. `npm run build`

### Developing the library locally

1. Start the dev server with `npm run serve`
2. Start the Spring API-Gateway

### Use your library in another project locally

Run the following commands in your library:

1. `npm run build`
2. `npm run pack`

Make sure you have provided all the necessary dependencies in your vuetify project and add the library vai `file path`:

```
"UnicodeEingabeKiwi2": "file:../UnicodeEingabeKiwi2-1.0.1.tgz"
```

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

it@m - opensource@muenchendigital.io

<p align="right">(<a href="#top">back to top</a>)</p>

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