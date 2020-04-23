import '@vaadin/vaadin-lumo-styles/spacing';
import '@vaadin/vaadin-lumo-styles/style';

const popupTheme = document.createElement('dom-module');
popupTheme.id = 'vcf-popup-lumo';
popupTheme.setAttribute('theme-for', 'vcf-popup');
popupTheme.innerHTML = `
    <template>
      <style>
        :host([phone]) {
          top: 0 !important;
          right: 0 !important;
          bottom: var(--vaadin-overlay-viewport-bottom, 0) !important;
          left: 0 !important;
          align-items: stretch !important;
          justify-content: flex-end !important;
        }

        :host([phone]) [part="overlay"] {
          max-height: 50vh;
          width: 100vw;
          border-radius: 0;
          box-shadow: var(--lumo-box-shadow-xl);
        }

        /* The content part scrolls instead of the overlay part, because of the gradient fade-out */

        :host([phone]) [part="content"] {
          padding: 30px var(--lumo-space-m);
          max-height: inherit;
          box-sizing: border-box;
          -webkit-overflow-scrolling: touch;
          overflow: auto;
          -webkit-mask-image: linear-gradient(transparent, #000 40px, #000 calc(100% - 40px), transparent);
          mask-image: linear-gradient(transparent, #000 40px, #000 calc(100% - 40px), transparent);
        }

        :host([phone]) [part="backdrop"] {
          display: block;
        }

        /* Animations */

        :host([opening][phone]) [part="overlay"] {
          animation: 0.2s lumo-mobile-menu-overlay-enter cubic-bezier(.215, .61, .355, 1) both;
        }

        :host([closing][phone]),
        :host([closing][phone]) [part="backdrop"] {
          animation-delay: 0.14s;
        }

        :host([closing][phone]) [part="overlay"] {
          animation: 0.14s 0.14s lumo-mobile-menu-overlay-exit cubic-bezier(.55, .055, .675, .19) both;
        }
      </style>
    </template>
  `;
popupTheme.register(popupTheme.id);

const overlayTheme = document.createElement('dom-module');
overlayTheme.id = 'vcf-vaadin-overlay-lumo';
overlayTheme.setAttribute('theme-for', 'vcf-popup-overlay');
overlayTheme.innerHTML = `
    <template>
      <style>
				:host {
					align-items: flex-start;
					justify-content: flex-start;
					right: auto;
					position: absolute;
					bottom: auto;
				}

				[part="content"] {
					padding: 0;
				}
      </style>
    </template>
  `;
overlayTheme.register(overlayTheme.id);
