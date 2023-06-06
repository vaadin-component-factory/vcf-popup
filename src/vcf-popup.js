/*
 * Copyright 2000-2020 Vaadin Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import '@vaadin/polymer-legacy-adapter/template-renderer.js';
import '@polymer/iron-media-query';
import './vcf-popup-overlay';
import { html, PolymerElement } from '@polymer/polymer/polymer-element';
import { ElementMixin } from '@vaadin/component-base/src/element-mixin';
import { ThemableMixin } from '@vaadin/vaadin-themable-mixin';

class VcfPopup extends ElementMixin(ThemableMixin(PolymerElement)) {
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>

      <vcf-popup-overlay
        id="popupOverlay"
        header-title="[[headerTitle]]"
        opened="{{opened}}"
        theme$="[[theme]]"
        with-backdrop="[[_phone]]"
        phone$="[[_phone]]"
        position-target="[[target]]"
        no-vertical-overlap
        close-on-scroll="[[closeOnScroll]]"
        modeless="[[modeless]]"
        focus-trap
        restore-focus-on-close
      >
      </vcf-popup-overlay>

      <iron-media-query query="[[_phoneMediaQuery]]" query-matches="{{_phone}}"></iron-media-query>
    `;
  }

  static get is() {
    return 'vcf-popup';
  }

  static get version() {
    return '24.0.0';
  }

  /**
   * Object describing property-related metadata used by Polymer features
   */
  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: '_openedChanged'
      },

      /**
       * The id of the element used as a tooltip trigger.
       * The element should be in the DOM by the time when
       * the attribute is set, otherwise a warning is shown.
       */
      for: {
        type: String,
        observer: '__forChanged'
      },

      /**
       * Reference to the element used as a tooltip trigger.
       * The target must be placed in the same shadow scope.
       * Defaults to an element referenced with `for`.
       */
      target: {
        type: Object,
        observer: '__targetChanged'
      },

      closeOnClick: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Will close the popup if content outside of the popup is scrolled.
       *
       * Note: The popup has to be 'modeless' in order closeOnScroll to have any effect.
       */
      closeOnScroll: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * String used for rendering a popup title.
       *
       * If both `headerTitle` and `headerRenderer` are defined, the title
       * and the elements created by the renderer will be placed next to
       * each other, with the title coming first.
       *
       * When `headerTitle` is set, the attribute `has-title` is added to the overlay element.
       * @attr {string} header-title
       */
      headerTitle: String,

      /**
       * Custom function for rendering the popup header.
       * Receives two arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `popup` The reference to the `<vcf-popup>` element.
       *
       * If both `headerTitle` and `headerRenderer` are defined, the title
       * and the elements created by the renderer will be placed next to
       * each other, with the title coming first.
       *
       * When `headerRenderer` is set, the attribute `has-header` is added to the overlay element.
       */
      headerRenderer: Function,

      /**
       * Custom function for rendering the popup footer.
       * Receives two arguments:
       *
       * - `root` The root container DOM element. Append your content to it.
       * - `popup` The reference to the `<vcf-popup>` element.
       *
       * When `footerRenderer` is set, the attribute `has-footer` is added to the overlay element.
       */
      footerRenderer: Function,

      /**
       * When true the overlay won't disable the main content, showing
       * it doesn’t change the functionality of the user interface.
       */
      modeless: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      _phone: Boolean,

      _phoneMediaQuery: {
        value: '(max-width: 420px), (max-height: 420px)'
      }
    };
  }

  static get observers() {
    return ['_rendererChanged(headerRenderer, footerRenderer)'];
  }

  constructor() {
    super();

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
    this._handleOverlayClick = this._handleOverlayClick.bind(this);

    this.__targetVisibilityObserver = new IntersectionObserver(
      ([entry]) => {
        this.__onTargetVisibilityChange(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );
  }

  ready() {
    super.ready();
    this.__setOverlayContentFromTemplate();
    this.$.popupOverlay.addEventListener('click', this._handleOverlayClick);
  }

  __setOverlayContentFromTemplate() {
    let overlayContentTemplate = this.querySelector('template');
    if (overlayContentTemplate) {
      const content = overlayContentTemplate.innerHTML;
      this.$.popupOverlay.renderer = (root) => {
        root.innerHTML = content;
      };
    }
  }

  /**
   * Requests an update for the content of the popup.
   * While performing the update, it invokes the renderer passed in the `renderer` property,
   * as well as `headerRender` and `footerRenderer` properties, if these are defined.
   *
   * It is not guaranteed that the update happens immediately (synchronously) after it is requested.
   */
  requestContentUpdate() {
    if (this.$) {
      this.$.popupOverlay.requestContentUpdate();
    }
  }

  /** @private */
  _rendererChanged(headerRenderer, footerRenderer) {
    this.$.popupOverlay.setProperties({ owner: this, headerRenderer, footerRenderer });
  }

  connectedCallback() {
    super.connectedCallback();
    this._attachToTarget(this.target);

    // Restore opened state if overlay was opened when disconnecting
    if (this.__restoreOpened) {
      this.opened = true;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._detachFromTarget(this.target);

    // Close overlay to clear document listener; also memorize opened state
    this.__restoreOpened = this.opened;
    this.opened = false;
  }

  _openedChanged(opened, oldValue) {
    if (opened) {
      setTimeout(() => {
        document.addEventListener('click', this.hide);
      });
      this.__setPopupOpenedAttributeOnTarget();
    } else {
      document.removeEventListener('click', this.hide);
      this.__removePopupOpenedAttributeOnTarget();
    }

    // avoid dispatching event when setting initial value 'false'
    if (oldValue !== undefined) {
      this.dispatchEvent(
        new CustomEvent('popup-open-changed', {
          detail: {
            opened: opened
          }
        })
      );
    }
  }

  __setPopupOpenedAttributeOnTarget() {
    if (this.target) {
      this.target.setAttribute('popup-opened', '');
    }
  }

  __removePopupOpenedAttributeOnTarget() {
    if (this.target) {
      this.target.removeAttribute('popup-opened');
    }
  }
  __forChanged(forId) {
    if (forId) {
      const target = this.getRootNode().getElementById(forId);

      if (target) {
        this.target = target;
      } else {
        console.warn(`No element with id="${forId}" found to show popup.`);
      }
    }
  }

  __targetChanged(target, oldTarget) {
    if (oldTarget) {
      this._detachFromTarget(oldTarget);
    }

    if (target) {
      this._attachToTarget(target);
    }
  }

  show() {
    this.opened = true;
  }

  hide() {
    this.opened = false;
  }

  _handleOverlayClick(event) {
    if (!this.closeOnClick && !this._phone) {
      event.stopPropagation();
    }
  }

  _attachToTarget(target) {
    if (target) {
      target.addEventListener('click', this.show);
      target.setAttribute('has-popup', '');

      // Wait before observing to avoid Chrome issue.
      requestAnimationFrame(() => {
        this.__targetVisibilityObserver.observe(target);
      });
    }
  }

  _detachFromTarget(target) {
    if (target) {
      target.removeEventListener('click', this.show);
      target.removeAttribute('has-popup');
      this.__targetVisibilityObserver.unobserve(target);
    }
  }

  __onTargetVisibilityChange(isVisible) {
    // Close the overlay when the target is no longer fully visible.
    if (!isVisible) {
      this.hide();
    }
  }
}

customElements.define(VcfPopup.is, VcfPopup);

/**
 * @namespace Vaadin
 */
window.Vaadin.VcfPopup = VcfPopup;
