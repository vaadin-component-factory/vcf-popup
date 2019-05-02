[![Build Status](https://travis-ci.org/vaadin/vcf-popup.svg?branch=master)](https://travis-ci.org/vaadin/vcf-popup)
[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/vaadin/web-components?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

# &lt;vcf-popup&gt;

[Live Demo ↗](https://incubator.app.fi/vcf-popup-demo/)


[&lt;vcf-popup&gt;](https://vaadin.com/directory/components/vaadinvcf-popup) is a Web Component providing an easy way to hide extra content from your webpage and show them to the user whenever they need them.

```html
  <vaadin-button theme="icon tertiary" id="more">
    <iron-icon icon="vaadin:ellipsis-dots-h"></iron-icon>
  </vaadin-button>
  <vcf-popup for="more" close-on-click>
    <template>
      <style>
        [part="container"] {
          padding: 5px 10px;
        }
      </style>
      <div part="container">
        <vaadin-button theme="icon">
          <iron-icon icon="vaadin:edit"></iron-icon>
        </vaadin-button>
        <vaadin-button theme="icon">
          <iron-icon icon="vaadin:close"></iron-icon>
        </vaadin-button>
        <vaadin-button theme="icon">
          <iron-icon icon="vaadin:plus"></iron-icon>
        </vaadin-button>
      </div>
    </template>
```

[<img src="https://raw.githubusercontent.com/vaadin/vcf-popup/master/screenshot.png" width="200" alt="Screenshot of vcf-popup">](https://vaadin.com/components/vcf-popup)


## Installation

The Vaadin Vcf components are distributed as Bower packages.

### Polymer 2 and HTML Imports compatible version

Install `vcf-popup`:

```sh
bower i vaadin/vcf-popup --save
```

Once installed, import it in your application:

```html
<link rel="import" href="bower_components/vcf-popup/vcf-popup.html">
```

## Getting Started

Vaadin components use the Lumo theme by default.

## The file structure for Vaadin components

- `src/vcf-popup.html`

  Unstyled component.

- `theme/lumo/vcf-popup.html`

  Component with Lumo theme.

- `vcf-popup.html`

  Alias for theme/lumo/vcf-popup.html


## Running demos and tests in browser

1. Fork the `vcf-popup` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vcf-popup` directory, run `npm install` and then `bower install` to install dependencies.

1. Run `polymer serve --open`, browser will automatically open the component API documentation.

1. You can also open demo or in-browser tests by adding **demo** or **test** to the URL, for example:

  - http://127.0.0.1:8080/components/vcf-popup/demo
  - http://127.0.0.1:8080/components/vcf-popup/test


## Running tests from the command line

1. When in the `vcf-popup` directory, run `polymer test`


## Following the coding style

We are using [ESLint](http://eslint.org/) for linting JavaScript code. You can check if your code is following our standards by running `gulp lint`, which will automatically lint all `.js` files as well as JavaScript snippets inside `.html` files.


## Contributing

  - Make sure your code is compliant with our code linters: `gulp lint`
  - Check that tests are passing: `polymer test`
  - [Submit a pull request](https://www.digitalocean.com/community/tutorials/how-to-create-a-pull-request-on-github) with detailed title and description
  - Wait for response from one of Vaadin components team members


## License

Commercial Vaadin Add-on License version 3 (CVALv3). For license terms, see LICENSE.

Vaadin collects development time usage statistics to improve this product. For details and to opt-out, see https://github.com/vaadin/vaadin-usage-statistics.
