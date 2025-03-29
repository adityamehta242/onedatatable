import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Column } from '../types.js'; 
import { myStyle } from '../css/style.js'; 

@customElement('table-header')
export class TableHeader extends LitElement {
  @property({ type: Array }) columns: Column[] = []; 
  @property({ type: String }) sortColumn: string | null = null;
  @property({ type: String }) sortDirection: 'asc' | 'desc' = 'asc';

  static styles = myStyle;

  render() {
    return html`
      <thead>
        <tr>
          ${this.columns.map(column => html`
            <th 
              @click=${() => this.handleSort(column.field)}
              style=${column.width ? `width: ${column.width};` : ''}
              scope="col"
              role="button"
              aria-sort=${this.sortColumn === column.field ? this.sortDirection : 'none'}
            >
              ${column.header}
              <span class="sort-icon">
                ${this.sortColumn === column.field ? (this.sortDirection === 'asc' ? '↑' : '↓') : ''}
              </span>
            </th>
          `)}
        </tr>
      </thead>
    `;
  }

  private handleSort(field: string) {
    this.dispatchEvent(new CustomEvent('sort', { detail: field, bubbles: true, composed: true }));
  }
}