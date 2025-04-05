import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { myStyle } from './css/style.js'; // Changed from .ts to .js
import { Column } from './types.js'; // Changed from .ts to .js
import { getFilteredData } from './utils/filtering.js'; // Changed from .ts to .js
import { getSortedData } from './utils/sorting.js'; // Changed from .ts to .js
import { getPaginatedData, getTotalPages } from './utils/pagination.js'; // Changed from .ts to .js
import './components/table-header.js'; // Changed from .ts to .js
import './components/table-body.js'; // Changed from .ts to .js
import './components/pagination.js'; // Changed from .ts to .js
import './components/search.js'; // Changed from .ts to .js
import { RowSelector } from './utils/selection.js';

@customElement('data-table')
export class Datatable extends LitElement {
  @property({ type: Array }) data: any[] = [];
  @property({ type: Array }) columns: Column[] = [];
  @property({ type: Number }) pageSize = 10;
  @property({ type: String }) selectionMode: 'single' | 'multiple' = 'single';

  @state() private sortColumn: string | null = null;
  @state() private sortDirection: 'asc' | 'desc' = 'asc';
  @state() private currentPage = 1;
  @state() private filter = '';

  private rowSelector = new RowSelector<any>(this.selectionMode);

  static styles = myStyle;

  private handleRowClick(rowId: any) {
    this.rowSelector.toggleSelection(rowId);
    this.dispatchEvent(new CustomEvent('selectionChanged', {
      detail: this.rowSelector.getSelected(),
      bubbles: true,
      composed: true
    }));
    this.requestUpdate(); // update render if selection affects visuals
  }
  

  render() {
    const filteredData = getFilteredData(this.data, this.filter, this.columns);
    const sortedData = getSortedData(filteredData, this.sortColumn, this.sortDirection);
    const paginatedData = getPaginatedData(sortedData, this.currentPage, this.pageSize);
  
    return html`
      <search-input @filter=${(e: any) => { this.filter = e.detail; this.currentPage = 1; }}></search-input>
      <table>
        <table-header 
          .columns=${this.columns} 
          .sortColumn=${this.sortColumn} 
          .sortDirection=${this.sortDirection} 
          @sort=${(e: any) => { this.sortColumn = e.detail; }}
        ></table-header>
        <table-body 
          .columns=${this.columns} 
          .data=${paginatedData}
          .isRowSelected=${(id: any) => this.rowSelector.isSelected(id)}
          @row-click=${(e: any) => this.handleRowClick(e.detail)}
        ></table-body>
      </table>
      <pagination-controls 
        .currentPage=${this.currentPage} 
        .totalPages=${getTotalPages(filteredData, this.pageSize)} 
        @prev-page=${() => { if (this.currentPage > 1) this.currentPage--; }} 
        @next-page=${() => { if (this.currentPage < getTotalPages(filteredData, this.pageSize)) this.currentPage++; }}
      ></pagination-controls>
    `;
  }
  
  updated(changedProps: Map<string, any>) {
    if (changedProps.has('selectionMode')) {
      this.rowSelector.setMode(this.selectionMode);
      this.requestUpdate(); // ensure re-render if mode switch affects view
    }
  }
  
}