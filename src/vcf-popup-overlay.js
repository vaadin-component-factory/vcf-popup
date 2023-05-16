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
import '@vaadin/overlay';
import { getAncestorRootNodes } from '@vaadin/component-base/src/dom-utils';
import { Overlay } from '@vaadin/overlay/src/vaadin-overlay';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin';

registerStyles(
  'vcf-popup-overlay',
  css`
    [part='header'],
    [part='header-content'],
    [part='footer'] {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      flex: none;
      pointer-events: none;
      z-index: 1;
    }

    [part='header'] {
      flex-wrap: nowrap;
    }

    ::slotted([slot='header-content']),
    ::slotted([slot='title']),
    ::slotted([slot='footer']) {
      display: contents;
      pointer-events: auto;
    }

    ::slotted([slot='title']) {
      font: inherit !important;
      overflow-wrap: anywhere;
    }

    [part='header-content'] {
      flex: 1;
    }

    :host([has-title]) [part='header-content'],
    [part='footer'] {
      justify-content: flex-end;
    }

    :host(:not([has-title]):not([has-header])) [part='header'],
    :host(:not([has-header])) [part='header-content'],
    :host(:not([has-title])) [part='title'],
    :host(:not([has-footer])) [part='footer'] {
      display: none !important;
    }

    :host(:is([has-title], [has-header], [has-footer])) [part='content'] {
      height: auto;
    }

    [part='content'] {
      min-width: 5em;
    }

    :host([has-bounds-set]) [part='overlay'] {
      max-width: none;
    }
  `,
  { moduleId: 'vcf-popup-overlay-styles' }
);

let memoizedTemplate;

class PopupOverlayElement extends Overlay {
  static get is() {
    return 'vcf-popup-overlay';
  }

  static get template() {
    if (!memoizedTemplate) {
      memoizedTemplate = super.template.cloneNode(true);
      const contentPart = memoizedTemplate.content.querySelector('[part="content"]');
      const overlayPart = memoizedTemplate.content.querySelector('[part="overlay"]');

      const headerContainer = document.createElement('header');
      headerContainer.setAttribute('part', 'header');
      overlayPart.appendChild(headerContainer, contentPart);

      const titleContainer = document.createElement('div');
      titleContainer.setAttribute('part', 'title');
      headerContainer.appendChild(titleContainer);

      const titleSlot = document.createElement('slot');
      titleSlot.setAttribute('name', 'title');
      titleContainer.appendChild(titleSlot);

      const headerContentContainer = document.createElement('div');
      headerContentContainer.setAttribute('part', 'header-content');
      headerContainer.appendChild(headerContentContainer);

      const headerSlot = document.createElement('slot');
      headerSlot.setAttribute('name', 'header-content');
      headerContentContainer.appendChild(headerSlot);

      overlayPart.appendChild(contentPart);

      const footerContainer = document.createElement('footer');
      footerContainer.setAttribute('part', 'footer');
      overlayPart.appendChild(footerContainer);

      const footerSlot = document.createElement('slot');
      footerSlot.setAttribute('name', 'footer');
      footerContainer.appendChild(footerSlot);
    }
    return memoizedTemplate;
  }

  static get properties() {
    return {
      /**
       * The element next to which this overlay should be aligned.
       */
      positionTarget: {
        type: Object,
        value: null
      },

      closeOnScroll: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      headerTitle: String,

      headerRenderer: Function,

      footerRenderer: Function
    };
  }

  static get observers() {
    return [
      '_headerFooterRendererChange(headerRenderer, footerRenderer, opened)',
      '_headerTitleChanged(headerTitle, opened)',
      '__overlayOpenedChanged(opened, positionTarget)'
    ];
  }

  constructor() {
    super();

    this.__onScroll = this.__onScroll.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();

    if (this.opened) {
      this.__addUpdatePositionEventListeners();
    }
  }

  /** @protected */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__removeUpdatePositionEventListeners();
  }

  /** @protected */
  ready() {
    super.ready();

    // Update overflow attribute on scroll
    this.$.content.addEventListener('scroll', () => {
      this.__updateOverflow();
    });
  }

  /** @private */
  __createContainer(slot) {
    const container = document.createElement('div');
    container.setAttribute('slot', slot);
    return container;
  }

  /** @private */
  __clearContainer(container) {
    container.innerHTML = '';
    // Whenever a Lit-based renderer is used, it assigns a Lit part to the node it was rendered into.
    // When clearing the rendered content, this part needs to be manually disposed of.
    // Otherwise, using a Lit-based renderer on the same node will throw an exception or render nothing afterward.
    delete container._$litPart$;
  }

  /** @private */
  __initContainer(container, slot) {
    if (container) {
      // Reset existing container in case if a new renderer is set.
      this.__clearContainer(container);
    } else {
      // Create the container, but wait to append it until requestContentUpdate is called.
      container = this.__createContainer(slot);
    }
    return container;
  }

  /** @private */
  _headerFooterRendererChange(headerRenderer, footerRenderer, opened) {
    const headerRendererChanged = this.__oldHeaderRenderer !== headerRenderer;
    this.__oldHeaderRenderer = headerRenderer;

    const footerRendererChanged = this.__oldFooterRenderer !== footerRenderer;
    this.__oldFooterRenderer = footerRenderer;

    const openedChanged = this._oldOpenedFooterHeader !== opened;
    this._oldOpenedFooterHeader = opened;

    // Set attributes here to update styles before detecting content overflow
    this.toggleAttribute('has-header', !!headerRenderer);
    this.toggleAttribute('has-footer', !!footerRenderer);

    if (headerRendererChanged) {
      if (headerRenderer) {
        this.headerContainer = this.__initContainer(this.headerContainer, 'header-content');
      } else if (this.headerContainer) {
        this.headerContainer.remove();
        this.headerContainer = null;
        this.__updateOverflow();
      }
    }

    if (footerRendererChanged) {
      if (footerRenderer) {
        this.footerContainer = this.__initContainer(this.footerContainer, 'footer');
      } else if (this.footerContainer) {
        this.footerContainer.remove();
        this.footerContainer = null;
        this.__updateOverflow();
      }
    }

    if (
      (headerRenderer && (headerRendererChanged || openedChanged)) ||
      (footerRenderer && (footerRendererChanged || openedChanged))
    ) {
      if (opened) {
        this.requestContentUpdate();
      }
    }
  }

  /** @private */
  _headerTitleChanged(headerTitle, opened) {
    this.toggleAttribute('has-title', !!headerTitle);

    if (opened && (headerTitle || this._oldHeaderTitle)) {
      this.requestContentUpdate();
    }
    this._oldHeaderTitle = headerTitle;
  }

  /** @private */
  _headerTitleRenderer() {
    if (this.headerTitle) {
      if (!this.headerTitleElement) {
        this.headerTitleElement = document.createElement('h3');
        this.headerTitleElement.setAttribute('slot', 'title');
        this.headerTitleElement.classList.add('draggable');
      }
      this.appendChild(this.headerTitleElement);
      this.headerTitleElement.textContent = this.headerTitle;
    } else if (this.headerTitleElement) {
      this.headerTitleElement.remove();
      this.headerTitleElement = null;
    }
  }

  requestContentUpdate() {
    super.requestContentUpdate();

    if (this.headerContainer) {
      // If a new renderer has been set, make sure to reattach the container
      if (!this.headerContainer.parentElement) {
        this.appendChild(this.headerContainer);
      }

      if (this.headerRenderer) {
        // Only call header renderer after the container has been initialized
        this.headerRenderer.call(this.owner, this.headerContainer, this.owner);
      }
    }

    if (this.footerContainer) {
      // If a new renderer has been set, make sure to reattach the container
      if (!this.footerContainer.parentElement) {
        this.appendChild(this.footerContainer);
      }

      if (this.footerRenderer) {
        // Only call header renderer after the container has been initialized
        this.footerRenderer.call(this.owner, this.footerContainer, this.owner);
      }
    }

    this._headerTitleRenderer();

    this.__updateOverflow();
  }

  /**
   * Updates the coordinates of the overlay.
   * @param {!DialogOverlayBoundsParam} bounds
   */
  setBounds(bounds) {
    const overlay = this.$.overlay;
    const parsedBounds = { ...bounds };

    if (overlay.style.position !== 'absolute') {
      overlay.style.position = 'absolute';
      this.setAttribute('has-bounds-set', '');
    }

    Object.keys(parsedBounds).forEach((arg) => {
      if (typeof parsedBounds[arg] === 'number') {
        parsedBounds[arg] = `${parsedBounds[arg]}px`;
      }
    });

    Object.assign(overlay.style, parsedBounds);
  }

  /**
   * Retrieves the coordinates of the overlay.
   */
  getBounds() {
    const overlayBounds = this.$.overlay.getBoundingClientRect();
    const containerBounds = this.getBoundingClientRect();
    const top = overlayBounds.top - containerBounds.top;
    const left = overlayBounds.left - containerBounds.left;
    const width = overlayBounds.width;
    const height = overlayBounds.height;
    return { top, left, width, height };
  }

  /** @private */
  __updateOverflow() {
    let overflow = '';

    // Only set "overflow" attribute if the popup has a header, title or footer.
    // Check for state attributes as extending components might not use renderers.
    if (this.hasAttribute('has-header') || this.hasAttribute('has-footer') || this.headerTitle) {
      const content = this.$.content;

      if (content.scrollTop > 0) {
        overflow += ' top';
      }

      if (content.scrollTop < content.scrollHeight - content.clientHeight) {
        overflow += ' bottom';
      }
    }

    const value = overflow.trim();
    if (value.length > 0 && this.getAttribute('overflow') !== value) {
      this.setAttribute('overflow', value);
    } else if (value.length === 0 && this.hasAttribute('overflow')) {
      this.removeAttribute('overflow');
    }
  }

  __addUpdatePositionEventListeners() {
    this.__positionTargetAncestorRootNodes = getAncestorRootNodes(this.positionTarget);
    this.__positionTargetAncestorRootNodes.forEach((node) => {
      node.addEventListener('scroll', this.__onScroll, true);
    });
  }

  /** @private */
  __removeUpdatePositionEventListeners() {
    if (this.__positionTargetAncestorRootNodes) {
      this.__positionTargetAncestorRootNodes.forEach((node) => {
        node.removeEventListener('scroll', this.__onScroll, true);
      });
      this.__positionTargetAncestorRootNodes = null;
    }
  }

  __overlayOpenedChanged(opened, positionTarget) {
    this.__removeUpdatePositionEventListeners();

    if (positionTarget && opened) {
      this.__addUpdatePositionEventListeners();
    }
  }

  /** @private */
  __onScroll(e) {
    // If the scroll event occurred inside the overlay, ignore it.
    if (!this.contains(e.target) && this.closeOnScroll) {
      this.opened = false;
    }
  }
}

customElements.define(PopupOverlayElement.is, PopupOverlayElement);
