import '@vaadin/grid';
import { css, html, LitElement } from 'lit';
import { columnBodyRenderer } from '@vaadin/grid/lit';

export class GridVcfPopupIntegrationDemo extends LitElement {
  constructor() {
    super();

    this.idRenderer = (person) => {
      return html`
        <div>
          <vaadin-button
            focus-target="true"
            id="popupBtn${person.id}"
            role="button"
            tabindex="0"
            theme="tertiary-inline"
            >${person.id}
          </vaadin-button>
          <vcf-popup for="popupBtn${person.id}" header-title="${person.firstName} ${person.lastName} ">
            <template>
              <style>
                #container {
                  padding-left: var(--lumo-space-m);
                  padding-right: var(--lumo-space-m);
                  max-width: 400px;
                }
              </style>
              <div id="container">
                <p>Lorem ipsum dolor sit amet,<br />Lorem ipsum dolor sit amet,<br />Lorem ipsum dolor sit amet</p>
              </div>
            </template>
          </vcf-popup>
        </div>
      `;
    };
  }

  static get styles() {
    return css`
      vaadin-grid {
        max-height: 300px;
      }
    `;
  }

  static get properties() {
    return {
      _items: []
    };
  }

  firstUpdated() {
    this._items = [
      { id: '1', firstName: 'John', lastName: 'Doe1' },
      { id: '2', firstName: 'John', lastName: 'Doe2' },
      { id: '3', firstName: 'John', lastName: 'Doe3' },
      { id: '4', firstName: 'John', lastName: 'Doe4' },
      { id: '5', firstName: 'John', lastName: 'Doe5' },
      { id: '6', firstName: 'John', lastName: 'Doe6' },
      { id: '7', firstName: 'John', lastName: 'Doe7' },
      { id: '8', firstName: 'John', lastName: 'Doe8' },
      { id: '9', firstName: 'John', lastName: 'Doe9' },
      { id: '10', firstName: 'John', lastName: 'Doe10' },
      { id: '11', firstName: 'John', lastName: 'Doe11' },
      { id: '12', firstName: 'John', lastName: 'Doe12' },
      { id: '13', firstName: 'John', lastName: 'Doe13' },
      { id: '14', firstName: 'John', lastName: 'Doe14' }
    ];
  }

  render() {
    return html`
      <vaadin-grid .items="${this._items}">
        <vaadin-grid-column header="Id" ${columnBodyRenderer(this.idRenderer, [])}></vaadin-grid-column>
        <vaadin-grid-column header="First Name" path="firstName"></vaadin-grid-column>
        <vaadin-grid-column heade="Last Name" path="lastName"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }
}

customElements.define('grid-vcf-popup-integration-demo', GridVcfPopupIntegrationDemo);
