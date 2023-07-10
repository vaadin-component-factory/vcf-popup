import '@vaadin/vaadin-lumo-styles/spacing.js';
import { overlay } from '@vaadin/vaadin-lumo-styles/mixins/overlay.js';
import { css, registerStyles } from '@vaadin/vaadin-themable-mixin/vaadin-themable-mixin.js';

const popupOverlay = css`
  [part='overlay'] {
    outline: none;
  }

  [part='content'] {
    padding: 0;
  }

  :host(:is([has-header], [has-title])) [part='header'] + [part='content'] {
    padding-top: 0;
  }

  [part='header'],
  [part='header-content'],
  [part='footer'] {
    gap: var(--lumo-space-xs) var(--lumo-space-s);
    line-height: var(--lumo-line-height-s);
  }

  [part='header'] {
    padding: var(--lumo-space-s);
    background-color: var(--lumo-base-color);
    border-radius: var(--lumo-border-radius-l) var(--lumo-border-radius-l) 0 0; /* Needed for Safari */
  }

  [part='footer'] {
    padding: var(--lumo-space-s) var(--lumo-space-m);
    background-color: var(--lumo-contrast-5pct);
    border-radius: 0 0 var(--lumo-border-radius-l) var(--lumo-border-radius-l); /* Needed for Safari */
  }

  [part='title'] {
    font-size: var(--lumo-font-size-l);
    font-weight: 600;
    color: var(--lumo-header-text-color);
    margin-inline-start: calc(var(--lumo-space-l) - var(--lumo-space-m));
  }

  @media (min-height: 320px) {
    :host([overflow~='top']) [part='header'] {
      box-shadow: 0 1px 0 0 var(--lumo-contrast-10pct);
    }
  }

  :host([phone]) {
    top: 0 !important;
    right: 0 !important;
    bottom: var(--vaadin-overlay-viewport-bottom, 0) !important;
    left: 0 !important;
    align-items: stretch !important;
    justify-content: flex-end !important;
  }

  :host([phone]) [part='overlay'] {
    max-height: 50vh;
    width: 100vw;
    border-radius: 0;
    box-shadow: var(--lumo-box-shadow-xl);
  }

  /* The content part scrolls instead of the overlay part, because of the gradient fade-out */

  :host([phone]) [part='content'] {
    padding: 30px var(--lumo-space-m);
    max-height: inherit;
    box-sizing: border-box;
    -webkit-overflow-scrolling: touch;
    overflow: auto;
    -webkit-mask-image: linear-gradient(transparent, #000 20px, #000 calc(100% - 40px), transparent);
    mask-image: linear-gradient(transparent, #000 20px, #000 calc(100% - 40px), transparent);
  }

  :host([phone]) [part='backdrop'] {
    display: block;
  }

  :host([highlight-target]) [part='backdrop'] {
    background-color: var(--lumo-shade-50pct);
  }

  /* Animations */

  :host([opening][phone]) [part='overlay'] {
    animation: 0.2s lumo-mobile-menu-overlay-enter cubic-bezier(0.215, 0.61, 0.355, 1) both;
  }

  :host([closing][phone]),
  :host([closing][phone]) [part='backdrop'] {
    animation-delay: 0.14s;
  }

  :host([closing][phone]) [part='overlay'] {
    animation: 0.14s 0.14s lumo-mobile-menu-overlay-exit cubic-bezier(0.55, 0.055, 0.675, 0.19) both;
  }

  /* Pointer arrow theme */

  :host([theme~='pointer-arrow'][top-aligned][preferred-position='bottom']:not([phone])) {
    padding-top: 0.5rem;
  }

  :host([theme~='pointer-arrow'][top-aligned][preferred-position='bottom']:not([phone])) [part='pointer-arrow'] {
    position: absolute;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-bottom: 0.5rem solid var(--lumo-base-color);
    top: 0;
    height: 0;
    width: 0;

    filter: drop-shadow(0px -2px 1px var(--lumo-shade-10pct));
  }

  :host([theme~='pointer-arrow'][bottom-aligned][preferred-position='bottom']:not([phone])) {
    padding-bottom: 0.5rem;
  }

  /* the following will color the pointer arrow to the same color as the popup footer */
  :host([theme~='pointer-arrow'][has-footer][bottom-aligned][preferred-position='bottom']:not([phone]))
    [part='pointer-arrow']:after {
    content: '';
    display: block;
    position: absolute;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-top: 0.5rem solid var(--lumo-contrast-5pct);
    bottom: 0;
    left: -0.5rem;
    height: 0;
    width: 0;
  }

  :host([theme~='pointer-arrow'][bottom-aligned][preferred-position='bottom']:not([phone])) [part='pointer-arrow'] {
    position: absolute;
    border-left: 0.5rem solid transparent;
    border-right: 0.5rem solid transparent;
    border-top: 0.5rem solid var(--lumo-base-color);
    bottom: 0;
    height: 0;
    width: 0;

    filter: drop-shadow(0px 2px 1px var(--lumo-shade-10pct));
  }

  :host([theme~='pointer-arrow'][start-aligned][preferred-position='end']:not([phone])) {
    padding-inline-start: 0.5rem;
  }

  :host([theme~='pointer-arrow'][start-aligned][preferred-position='end']:not([phone])) [part='pointer-arrow'] {
    position: absolute;
    border-top: 0.5rem solid transparent;
    border-bottom: 0.5rem solid transparent;
    border-right: 0.5rem solid var(--lumo-base-color);
    left: 0;
    height: 0;
    width: 0;

    filter: drop-shadow(-2px 0 1px var(--lumo-shade-10pct));
  }

  :host([theme~='pointer-arrow'][end-aligned][preferred-position='end']:not([phone])) {
    padding-inline-end: 0.5rem;
  }

  :host([theme~='pointer-arrow'][end-aligned][preferred-position='end']:not([phone])) [part='pointer-arrow'] {
    position: absolute;
    border-top: 0.5rem solid transparent;
    border-bottom: 0.5rem solid transparent;
    border-left: 0.5rem solid var(--lumo-base-color);
    right: 0;
    height: 0;
    width: 0;

    filter: drop-shadow(2px 0 1px var(--lumo-shade-10pct));
  }
`;

registerStyles('vcf-popup-overlay', [overlay, popupOverlay], { moduleId: 'lumo-vcf-popup-overlay' });
