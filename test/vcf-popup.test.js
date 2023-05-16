import { expect } from '@esm-bundle/chai';
import { fixtureSync, nextRender } from '@vaadin/testing-helpers';
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

  describe('opened', () => {
    let outsideElement, targetOne, popupOne, overlayOne, targetTwo, popupTwo;

    beforeEach(() => {
      const pageSetup = fixtureSync(`<div>
            <div id='outside-element'></div>
            <div id='target-element-one'></div>
            <vcf-popup for='target-element-one'></vcf-popup>
            <div id='target-element-two'></div>
            <vcf-popup for='target-element-two'></vcf-popup>
            <vcf-popup></vcf-popup>
        </div`);
      outsideElement = pageSetup.querySelector('#outside-element');
      targetOne = pageSetup.querySelector('#target-element-one');
      popupOne = pageSetup.querySelector('vcf-popup[for="target-element-one"]');
      overlayOne = popupOne.shadowRoot.querySelector('vcf-popup-overlay');
      targetTwo = pageSetup.querySelector('#target-element-two');
      popupTwo = pageSetup.querySelector('vcf-popup[for="target-element-two"]');
    });

    it('should open on target click', () => {
      targetOne.click();
      expect(popupOne.opened).to.be.true;
    });

    it('should hide on outside element click', async () => {
      targetOne.click();
      await nextRender();
      outsideElement.click();

      expect(popupOne.opened).to.be.false;
    });

    it('should hide on another target click', async () => {
      targetOne.click();
      await nextRender();
      targetTwo.click();
      await nextRender();

      expect(popupOne.opened).to.be.false;
      expect(popupTwo.opened).to.be.true;
    });

    it('should open on repeated click of target', async () => {
      targetOne.click();
      await nextRender();
      targetOne.click();
      await nextRender();
      targetOne.click();
      await nextRender();

      expect(popupOne.opened).to.be.true;
    });

    it('should hide on another click of target', async () => {
      targetOne.click();
      await nextRender();
      targetOne.click();
      await nextRender();

      expect(popupTwo.opened).to.be.false;
    });

    it('should hide on another click of target', async () => {
      targetOne.click();
      await nextRender();
      targetOne.click();
      await nextRender();

      expect(popupTwo.opened).to.be.false;
    });

    it('should not hide on overlay click', async () => {
      targetOne.click();
      await nextRender();
      overlayOne.click();
      await nextRender();

      expect(popupOne.opened).to.be.true;
    });
  });

  describe('closeOnClick true', () => {
    let popup, overlay;

    beforeEach(() => {
      popup = fixtureSync('<vcf-popup close-on-click><template>Something</template></vcf-popup>');
      overlay = popup.shadowRoot.querySelector('vcf-popup-overlay');
    });

    it('should close on popup click', async () => {
      popup.opened = true;
      await nextRender();
      overlay.click();
      await nextRender();

      expect(popup.opened).to.be.false;
    });
  });
});
