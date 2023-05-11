import { expect } from '@esm-bundle/chai';
import { fixtureSync } from '@vaadin/testing-helpers';
import '../theme/lumo/vcf-popup.js';

describe('vcf-popup', () => {
  let popup, overlay;

  beforeEach(() => {
    popup = fixtureSync('<vcf-popup></vcf-popup>');
    overlay = popup.shadowRoot.querySelector('vcf-popup-overlay');
  });

  describe('custom element definition', () => {
    let tagName;

    beforeEach(() => {
      tagName = popup.tagName.toLowerCase();
    });

    it('should be defined in custom element registry', () => {
      expect(customElements.get(tagName)).to.be.ok;
    });

    it('should have a valid static "is" getter', () => {
      expect(customElements.get(tagName).is).to.equal(tagName);
    });
  });

  describe('overlay', () => {
    it('should propagate theme attribute to overlay', () => {
      popup.setAttribute('theme', 'foo');
      expect(overlay.getAttribute('theme')).to.equal('foo');
    });
  });
});
