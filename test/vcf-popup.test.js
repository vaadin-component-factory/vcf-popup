import { expect } from '@esm-bundle/chai';
import { fixtureSync, listenOnce, nextRender } from '@vaadin/testing-helpers';
import { aTimeout } from '@vaadin/testing-helpers/dist/utils';
import { setViewport } from '@web/test-runner-commands';
import sinon from 'sinon';
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
    let target, popup, overlay, overlayPart;

    beforeEach(() => {
      const pageSetup = fixtureSync(`<div>
            <div id='target-element'></div>
            <vcf-popup for='target-element'></vcf-popup>
        </div`);
      target = pageSetup.querySelector('#target-element');
      popup = pageSetup.querySelector('vcf-popup[for="target-element"]');
      overlay = popup.shadowRoot.querySelector('vcf-popup-overlay');
      overlayPart = overlay.shadowRoot.children.overlay;
    });

    it('should open on target click', async () => {
      target.click();
      await nextRender();
      expect(popup.opened).to.be.true;
    });

    it('should disable pointer events', async () => {
      target.click();
      await nextRender();

      expect(getComputedStyle(target).pointerEvents).to.equal('none');
    });

    it('should not hide on overlay click', async () => {
      target.click();
      await nextRender();
      overlayPart.click();
      await nextRender();

      expect(popup.opened).to.be.true;
    });
  });

  describe('modeless', () => {
    let outsideElement, targetOne, popupOne, overlayOne, targetTwo, popupTwo;

    beforeEach(() => {
      const pageSetup = fixtureSync(`<div>
            <div id='outside-element'></div>
            <div id='target-element-one'></div>
            <vcf-popup modeless for='target-element-one'></vcf-popup>
            <div id='target-element-two'></div>
            <vcf-popup modeless for='target-element-two'></vcf-popup>
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

      expect(popupOne.opened).to.be.false;
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

  describe('popup-open-changed event', () => {
    let popup, overlay, spy;

    beforeEach(() => {
      popup = fixtureSync('<vcf-popup><template>Something</template></vcf-popup>');
      overlay = popup.shadowRoot.querySelector('vcf-popup-overlay');
      spy = sinon.spy();
      popup.addEventListener('popup-open-changed', spy);
    });

    it('should dispatch opened event', async () => {
      popup.opened = true;
      await nextRender();

      expect(spy.calledOnce).to.be.true;
      expect(spy.getCall(0).args[0].detail.opened).to.be.true;
    });

    it('should dispatch closed event', async () => {
      popup.show();
      await nextRender();
      document.body.click();
      await nextRender();

      expect(spy.callCount).to.equal(2);
      expect(spy.getCall(1).args[0].detail.opened).to.be.false;
    });

    describe('modeless', () => {
      beforeEach(() => {
        popup.modeless = true;
      });

      it('should dispatch opened event', async () => {
        popup.opened = true;
        await nextRender();

        expect(spy.calledOnce).to.be.true;
        expect(spy.getCall(0).args[0].detail.opened).to.be.true;
      });

      it('should dispatch closed event', async () => {
        popup.show();
        await nextRender();
        document.body.click();
        await nextRender();

        expect(spy.callCount).to.equal(2);
        expect(spy.getCall(1).args[0].detail.opened).to.be.false;
      });
    });
  });

  describe('phone', () => {
    let popup, overlay, backdrop;

    beforeEach(async () => {
      await setViewport({ width: 393, height: 850 });
      popup = fixtureSync('<vcf-popup><template>Something</template></vcf-popup>');
      overlay = popup.shadowRoot.querySelector('vcf-popup-overlay');
      backdrop = overlay.shadowRoot.querySelector('#backdrop');
    });

    it('should hide on backdrop click', async () => {
      popup.opened = true;
      await nextRender();
      backdrop.click();
      await nextRender();

      expect(popup.opened).to.be.false;
    });
  });

  describe('has-popup', () => {
    let target, anotherTarget, popup;

    beforeEach(() => {
      const pageSetup = fixtureSync(`<div>
            <div id='target-element'></div>
            <vcf-popup for='target-element'></vcf-popup>
            <div id='another-target'></div>
        </div`);
      target = pageSetup.querySelector('#target-element');
      anotherTarget = pageSetup.querySelector('#another-target');
      popup = pageSetup.querySelector('vcf-popup[for="target-element"]');
    });

    it('should have a has-popup when attached', async () => {
      expect(target.hasAttribute('has-popup')).to.be.true;
    });

    it('should remove has-popup when detached', async () => {
      popup.for = 'another-target';
      expect(target.hasAttribute('has-popup')).to.be.false;
    });

    it('should add has-popup when re-attached', async () => {
      popup.for = 'another-target';
      popup.for = 'target-element';
      expect(target.hasAttribute('has-popup')).to.be.true;
    });
  });

  describe('popup-opened', () => {
    let target, anotherTarget, popup;

    beforeEach(() => {
      const pageSetup = fixtureSync(`<div>
            <div id='target-element'></div>
            <vcf-popup for='target-element'></vcf-popup>
            <div id='another-target'></div>
        </div`);
      target = pageSetup.querySelector('#target-element');
      anotherTarget = pageSetup.querySelector('#another-target');
      popup = pageSetup.querySelector('vcf-popup[for="target-element"]');
    });

    it('should not have popup-opened initially', async () => {
      expect(popup.opened).to.be.false;
      expect(target.hasAttribute('popup-opened')).to.be.false;
    });

    it('should have popup-opened when popup is opened', async () => {
      popup.opened = true;
      await nextRender();
      expect(target.hasAttribute('popup-opened')).to.be.true;
    });

    it('should not have popup-opened when popup is closed', async () => {
      popup.opened = true;
      await nextRender();
      popup.opened = false;
      await nextRender();
      expect(target.hasAttribute('popup-opened')).to.be.false;
    });
  });
});
