# &lt;vcf-popup&gt;

This is the npm version [vcf-popup](https://github.com/vaadin-component-factory/vcf-popup) developed using Polymer 3.

&lt;vcf-popup&gt; is a Web Component providing an easy way to hide extra content from your webpage and show them to the user whenever they need them.

## Demo

https://vcf-popup.netlify.com/

## Installation

Install `vcf-popup`:

```sh
npm i @vaadin-component-factory/vcf-popup --save
```

## Usage

Once installed, import it in your application:

```js
import '@vaadin-component-factory/vcf-popup';
```

Add `vcf-popup` to the page with attribute `for` that match `id` element to which popup should be bind to. Now after clicking on target element, popup will be shown.

```html
<vaadin-button theme="icon tertiary" id="more">
  <iron-icon icon="vaadin:ellipsis-dots-h"></iron-icon>
</vaadin-button>
<vcf-popup for="more" close-on-click>
  <template>
    <style>
      [part='container'] {
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
    </div> </template
></vcf-popup>
```

## Running demo

1. Fork the `vcf-popup` repository and clone it locally.

1. Make sure you have [npm](https://www.npmjs.com/) installed.

1. When in the `vcf-popup` directory, run `npm install` to install dependencies.

1. Run `npm start` to open the demo.

## Contributing

To contribute to the component, please read [the guideline](https://github.com/vaadin/vaadin-core/blob/master/CONTRIBUTING.md) first.

## License

Apache License 2.0
