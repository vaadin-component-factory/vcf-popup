[![Available in Vaadin_Directory](https://img.shields.io/vaadin-directory/v/vaadinincubator-popup.svg)](https://vaadin.com/directory/component/vaadinincubator-popup)
[![Stars in Vaadin_Directory](https://img.shields.io/vaadin-directory/stars/vaadinincubator-popup.svg)](https://vaadin.com/directory/component/vaadinincubator-popup)

# &lt;incubator-popup&gt;

[&lt;incubator-popup&gt;](https://vaadin.com/components/incubator-popup) is a Web Component providing an easy way to ask the user to confirm a choice, part of the [Vaadin components](https://vaadin.com/components).

[<img src="https://raw.githubusercontent.com/vaadin/incubator-popup/master/screenshot.png" width="200" alt="Screenshot of incubator-popup">](https://vaadin.com/components/incubator-popup)

## Example Usage

```html
  <incubator-popup header="Unsaved changes" confirm-text="Save" on-confirm="save"
    cancel on-cancel="cancel" reject reject-text="Discard" on-reject="discard">
    Do you want to save or discard your changes before navigating away?
  </incubator-popup>
```
