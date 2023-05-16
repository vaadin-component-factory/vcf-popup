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
        modeless
      >
      </vcf-popup-overlay>

      <iron-media-query query="[[_phoneMediaQuery]]" query-matches="{{_phone}}"></iron-media-query>
    `;
  }

  static get is() {
    return 'vcf-popup';
  }

  static get version() {
    return '23.3.0';
  }

  /**
   * Object describing property-related metadata used by Polymer features
   */
  static get properties() {
    return {
      opened: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      for: {
        type: String
      },

      closeOnClick: {
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

      _targetElement: {
        type: Object
      },

      _phone: Boolean,

      _phoneMediaQuery: {
        value: '(max-width: 420px), (max-height: 420px)'
      }
    };
  }

  static get observers() {
    return ['_openedChanged(opened)', '_attachToTarget(for)', '_rendererChanged(headerRenderer, footerRenderer)'];
  }

  constructor() {
    super();
    this._boundShow = this.show.bind(this);
    this._boundHide = this.hide.bind(this);
    this._boundOverlayClickHandler = this._handleOverlayClick.bind(this);
  }

  ready() {
    super.ready();
    this.$.popupOverlay.template = this.querySelector('template');
    this.$.popupOverlay.addEventListener('vaadin-overlay-open', () => this._popupOpenChanged(true));
    this.$.popupOverlay.addEventListener('vaadin-overlay-close', () => this._popupOpenChanged(false));
    this.$.popupOverlay.addEventListener('click', this._boundOverlayClickHandler);
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

    if (!this._targetElement) {
      this._targetElement = this.parentNode.querySelector(`#${this.for}`);
    }
    this._attachToTarget();
    // Restore opened state if overlay was opened when disconnecting
    if (this.__restoreOpened) {
      this.opened = true;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._detachFromTarget();
    this.$.popupOverlay.removeEventListener('click', this._boundOverlayClickHandler);
    // Close overlay and memorize opened state
    this.__restoreOpened = this.opened;
    this.opened = false;
  }

  _openedChanged(opened) {
    this.$.popupOverlay.opened = opened;
    if (opened) {
      setTimeout(() => {
        document.addEventListener('click', this._boundHide);
      });
    } else {
      document.removeEventListener('click', this._boundHide);
    }
  }

  show() {
    this.opened = true;
    this._setPosition();
  }

  hide() {
    this.opened = false;
  }

  _handleOverlayClick(event) {
    if (!this.closeOnClick) {
      event.stopPropagation();
    }
  }

  _attachToTarget() {
    if (!this._targetElement) {
      return;
    }
    this._targetElement.addEventListener('click', this._boundShow);
  }

  _detachFromTarget() {
    if (this._targetElement) {
      this._targetElement.removeEventListener('click', this._boundShow);
    }
  }

  _setPosition() {
    const targetBoundingRect = this._targetElement.getBoundingClientRect();
    const overlayRect = this.$.popupOverlay.getBoundingClientRect();
    const positionLeft = targetBoundingRect.left;
    const positionTop = targetBoundingRect.top + targetBoundingRect.height + window.pageYOffset;

    if (positionLeft + overlayRect.width > window.innerWidth) {
      this.$.popupOverlay.style.right = '0px';
      this.$.popupOverlay.style.left = 'auto';
    } else {
      this.$.popupOverlay.style.left = `${Math.max(0, positionLeft)}px`;
      this.$.popupOverlay.style.right = 'auto';
    }

    if (positionTop + overlayRect.height > window.innerHeight + window.pageYOffset) {
      this.$.popupOverlay.style.top = `${positionTop - targetBoundingRect.height - overlayRect.height}px`;
    } else {
      this.$.popupOverlay.style.top = `${positionTop}px`;
    }
  }

  _popupOpenChanged(isOpened) {
    if (isOpened) {
      window.addEventListener('scroll', this._boundSetPosition, true);
    } else {
      window.removeEventListener('scroll', this._boundSetPosition, true);
    }
    this.dispatchEvent(
      new CustomEvent('popup-open-changed', {
        detail: {
          opened: isOpened
        }
      })
    );
  }
}

customElements.define(VcfPopup.is, VcfPopup);

/**
 * @namespace Vaadin
 */
window.Vaadin.VcfPopup = VcfPopup;
