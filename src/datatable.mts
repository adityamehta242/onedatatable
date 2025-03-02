import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('data-table')
export class Datatable extends LitElement {
  @property({ type: Array })
  data: Array<Record<string, any>> = [];

  @property({ type: Array })
  columns: Array<{ field: string; header: string; width?: string }> = [];

  @property({ type: Number })
  pageSize: number = 10;

  @state()
  private sortColumn: string | null = null;

  @state()
  private sortDirection: 'asc' | 'desc' = 'asc';

  @state()
  private currentPage: number = 1;

  @state()
  private filter: string = '';

  static styles = css`
    table {
      width: 100%;
      border-collapse: collapse;
      --table-border-color: #ddd;
      --header-bg-color: #f2f2f2;
    }
    th, td {
      border: 1px solid var(--table-border-color);
      padding: 8px;
    }
    th {
      background-color: var(--header-bg-color);
      cursor: pointer;
    }
    .info {
      margin-top: 10px;
    }
    .pagination {
      margin-top: 10px;
    }
  `;

  render() {
    const filteredData = this.getFilteredData();
    const sortedData = this.getSortedData();
    const paginatedData = this.getPaginatedData(sortedData);
    const totalRows = filteredData.length;
    const start = (this.currentPage - 1) * this.pageSize + 1;
    const end = Math.min(start + this.pageSize - 1, totalRows);

    return html`
      <input type="text" @input=${this.handleFilter} placeholder="Search..." />
      <table>
        <caption>Datatable</caption>
        <colgroup>
          ${this.columns.map((column) => html`<col ${column.width ? `style="width: ${column.width};"` : ''} />`)}
        </colgroup>
        <thead>
          <tr>
            ${this.columns.map(
              (column) => html`
                <th
                  @click=${() => this.handleSort(column.field)}
                  style=${column.width ? `width: ${column.width};` : ''}
                  scope="col"
                  role="button"
                  aria-sort=${this.sortColumn === column.field ? this.sortDirection : 'none'}
                >
                  ${column.header}
                  ${this.sortColumn === column.field
                    ? this.sortDirection === 'asc' ? '↑' : '↓'
                    : ''}
                </th>
              `
            )}
          </tr>
        </thead>
        <tbody>
          ${paginatedData.map(
            (row) => html`
              <tr>
                ${this.columns.map(
                  (column) => html`<td style=${column.width ? `width: ${column.width};` : ''}>${row[column.field]}</td>`
                )}
              </tr>
            `
          )}
        </tbody>
      </table>
      <div class="info">
        Showing ${start} to ${end} of ${totalRows} entries
      </div>
      <div class="pagination">
        <button
          @click=${this.prevPage}
          ?disabled=${this.currentPage === 1}
          aria-label="Previous page"
        >
          Previous
        </button>
        <span>Page ${this.currentPage} of ${this.getTotalPages(filteredData)}</span>
        <button
          @click=${this.nextPage}
          ?disabled=${this.currentPage === this.getTotalPages(filteredData)}
          aria-label="Next page"
        >
          Next
        </button>
      </div>
    `;
  }

  private getFilteredData() {
    if (!this.filter) return this.data;
    const lowerFilter = this.filter.toLowerCase();
    return this.data.filter((row) =>
      this.columns.some((column) =>
        String(row[column.field]).toLowerCase().includes(lowerFilter)
      )
    );
  }

  private getSortedData() {
    const data = this.getFilteredData();
    if (!this.sortColumn) return data;
    const direction = this.sortDirection === 'asc' ? 1 : -1;
    return [...data].sort((a, b) => {
      const aValue = a[this.sortColumn!]; 
      const bValue = b[this.sortColumn!]; 
      if (aValue < bValue) return -direction;
      if (aValue > bValue) return direction;
      return 0;
    });
  }

  private getPaginatedData(data: any[]) {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return data.slice(start, end);
  }

  private getTotalPages(data: any[]) {
    return Math.ceil(data.length / this.pageSize);
  }

  private handleSort(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
  }

  private handleFilter(e: Event) {
    this.filter = (e.target as HTMLInputElement).value;
    this.currentPage = 1;
  }

  private prevPage() {
    if (this.currentPage > 1) this.currentPage--;
  }

  private nextPage() {
    const totalPages = this.getTotalPages(this.getFilteredData());
    if (this.currentPage < totalPages) this.currentPage++;
  }
}