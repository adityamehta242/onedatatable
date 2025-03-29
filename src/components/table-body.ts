import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Column } from '../types.js';
import { myStyle } from '../css/style.js';

@customElement('table-body')
export class TableBody extends LitElement {
  @property({ type: Array }) data: any[] = [];
  @property({ type: Array }) columns: Column[] = [];

  static styles = myStyle;

  render() {
    return html`
      <tbody>
        ${this.data.map(row => html`
          <tr>
            ${this.columns.map(column => html`
              <td>${row[column.field]}</td>
            `)}
          </tr>
        `)}
      </tbody>
    `;
  }
}