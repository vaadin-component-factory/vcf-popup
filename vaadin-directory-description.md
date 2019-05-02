# &lt;vcf-popup&gt;

[&lt;vcf-popup&gt;](https://vaadin.com/directory/component/vaadinvcf-popup) is a Web Component providing an easy way to hide extra content from your webpage and show them to the user whenever they need them.

[<img src="https://raw.githubusercontent.com/vaadin/vcf-popup/master/screenshot.png" width="200" alt="Screenshot of vcf-popup">](https://vaadin.com/components/vcf-popup)

## Example Usage

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

[Live Demo ↗](https://incubator.app.fi/vcf-popup-demo/)
