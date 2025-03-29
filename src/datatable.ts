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

@customElement('data-table')
export class Datatable extends LitElement {
  @property({ type: Array }) data: any[] = [];
  @property({ type: Array }) columns: Column[] = [];
  @property({ type: Number }) pageSize = 10;

  @state() private sortColumn: string | null = null;
  @state() private sortDirection: 'asc' | 'desc' = 'asc';
  @state() private currentPage = 1;
  @state() private filter = '';

  static styles = myStyle;

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
}