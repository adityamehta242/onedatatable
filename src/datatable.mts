import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('data-table')
export class Datatable extends LitElement {
    @property({ type: Array })
    data: Array<Record<string, any>> = [];

    @property({ type: Array })
    columns: Array<{ field: string; header: string; width?: string }> = [];

    @property({ type: Number })
    pageSize: number = 10;

    @property({ type: Object })
    subtables: Record<string, {
        columns: Array<{ field: string; header: string; width?: string }>;
        subtables?: Record<string, any>;
    }> = {};

    @state()
    private sortColumn: string | null = null;

    @state()
    private sortDirection: 'asc' | 'desc' = 'asc';

    @state()
    private currentPage: number = 1;

    @state()
    private filter: string = '';

    @state()
    private expandedRows: Map<string, Set<string>> = new Map();

    static styles = css`
        :host {
            display: block;
            font-family: Arial, sans-serif;
        }
        .container {
            margin: 1rem 0;
        }
        .search-container {
            margin-bottom: 1rem;
        }
        input[type="text"] {
            padding: 8px;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #ccc;
            border-radius: 4px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            --table-border-color: #ddd;
            --header-bg-color: #f2f2f2;
            --row-hover-color: #f8f8f8;
            --subtable-level-1-bg: #f9f9f9;
            --subtable-level-2-bg: #f3f3f3;
            --subtable-border: 1px solid #e0e0e0;
        }
        th, td {
            border: 1px solid var(--table-border-color);
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: var(--header-bg-color);
            cursor: pointer;
            position: relative;
        }
        th:hover {
            background-color: #e8e8e8;
        }
        tr:hover {
            background-color: var(--row-hover-color);
        }
        .info {
            margin: 10px 0;
            font-size: 0.9rem;
            color: #666;
        }
        .pagination {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 1rem;
        }
        button {
            padding: 6px 12px;
            background: #f2f2f2;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
        }
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        button:not(:disabled):hover {
            background: #e0e0e0;
        }
        .expand-button {
            cursor: pointer;
            background: none;
            border: none;
            padding: 4px;
            margin-right: 8px;
            width: 24px;
            height: 24px;
            text-align: center;
            line-height: 1;
        }
        .subtable-container {
            padding-left: 20px;
        }
        .subtable {
            width: 100%;
            margin: 8px 0;
            border: var(--subtable-border);
        }
        .subtable-level-1 {
            background-color: var(--subtable-level-1-bg);
        }
        .subtable-level-2 {
            background-color: var(--subtable-level-2-bg);
        }
        .subtable-header {
            font-weight: bold;
            margin: 8px 0;
            text-transform: capitalize;
        }
        .sort-icon {
            display: inline-block;
            margin-left: 5px;
        }
    `;

    render(): TemplateResult {
        const filteredData = this.getFilteredData();
        const sortedData = this.getSortedData(filteredData);
        const paginatedData = this.getPaginatedData(sortedData);
        const totalRows = filteredData.length;
        const start = totalRows === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
        const end = Math.min(start + this.pageSize - 1, totalRows);

        const hasSubtables = Object.keys(this.subtables).length > 0;

        return html`
            <div class="container">
                <div class="search-container">
                    <input type="text" @input=${this.handleFilter} placeholder="Search..." />
                </div>
                
                <table>
                    <thead>
                        <tr>
                            ${hasSubtables ? html`<th style="width: 40px;"></th>` : ''}
                            ${this.columns.map(
                                (column) => html`
                                    <th
                                        @click=${() => this.handleSort(column.field)}
                                        style=${column.width ? `width: ${column.width};` : ''}
                                        aria-sort=${this.sortColumn === column.field ? this.sortDirection : 'none'}
                                    >
                                        ${column.header}
                                        <span class="sort-icon">
                                            ${this.sortColumn === column.field
                                                ? this.sortDirection === 'asc' ? '↑' : '↓'
                                                : ''}
                                        </span>
                                    </th>
                                `
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        ${paginatedData.length === 0 ? 
                            html`<tr><td colspan="${this.columns.length + (hasSubtables ? 1 : 0)}">No data available</td></tr>` :
                            paginatedData.map(
                                (row, rowIndex) => {
                                    const rowId = row.id || `index-${rowIndex}`;
                                    const rowKey = `row-${rowId}`;
                                    const isExpanded = this.isRowExpanded(rowKey);

                                    return html`
                                        <tr>
                                            ${hasSubtables ? html`
                                                <td style="width: 40px;">
                                                    <button 
                                                        class="expand-button" 
                                                        @click=${() => this.toggleRow(rowKey)}
                                                        aria-label="${isExpanded ? 'Collapse' : 'Expand'} row"
                                                    >
                                                        ${isExpanded ? '−' : '+'}
                                                    </button>
                                                </td>
                                            ` : ''}
                                            ${this.columns.map(
                                                (column) => html`
                                                    <td style=${column.width ? `width: ${column.width};` : ''}>
                                                        ${this.formatCellValue(row[column.field])}
                                                    </td>
                                                `
                                            )}
                                        </tr>
                                        ${isExpanded ?
                                            this.renderNestedSubtables(rowKey, row, this.subtables, 1) :
                                            ''}
                                    `;
                                }
                            )
                        }
                    </tbody>
                </table>
                
                <div class="info">
                    ${totalRows > 0 ? 
                        `Showing ${start} to ${end} of ${totalRows} entries` : 
                        'No entries to display'}
                </div>
                
                <div class="pagination">
                    <button
                        @click=${this.prevPage}
                        ?disabled=${this.currentPage === 1}
                        aria-label="Previous page"
                    >
                        Previous
                    </button>
                    <span>Page ${this.currentPage} of ${Math.max(1, this.getTotalPages(filteredData))}</span>
                    <button
                        @click=${this.nextPage}
                        ?disabled=${this.currentPage === Math.max(1, this.getTotalPages(filteredData)) || totalRows === 0}
                        aria-label="Next page"
                    >
                        Next
                    </button>
                </div>
            </div>
        `;
    }

    private formatCellValue(value: any): string | TemplateResult {
        if (value === undefined || value === null) {
            return '';
        }
        
        if (typeof value === 'boolean') {
            return value ? 'Yes' : 'No';
        }
        
        return String(value);
    }

    private isRowExpanded(rowKey: string): boolean {
        if (!this.expandedRows.has('root')) {
            this.expandedRows.set('root', new Set());
        }
        
        const expandedSet = this.expandedRows.get('root');
        return expandedSet?.has(rowKey) || false;
    }

    private toggleRow(rowKey: string) {
        if (!this.expandedRows.has('root')) {
            this.expandedRows.set('root', new Set());
        }
        
        const expandedSet = this.expandedRows.get('root')!;
        
        if (expandedSet.has(rowKey)) {
            expandedSet.delete(rowKey);
            
            // Also delete any child subtables when collapsing
            [...this.expandedRows.keys()].forEach(key => {
                if (key.startsWith(`${rowKey}-`)) {
                    this.expandedRows.delete(key);
                }
            });
        } else {
            expandedSet.add(rowKey);
        }
        
        this.requestUpdate();
    }

    // Handle nested subtables rendering
    private renderNestedSubtables(parentKey: string, data: Record<string, any>, subtablesConfig: Record<string, any>, level: number): TemplateResult {
        const colSpan = this.columns.length + (level === 1 ? 1 : 0); // +1 for the expand button column on first level
        
        return html`
            <tr>
                <td colspan="${colSpan}" class="subtable-level-${level}">
                    <div class="subtable-container">
                        ${Object.entries(subtablesConfig).map(([field, config]) => {
                            const nestedData = data[field];
                            if (!nestedData) {
                                return html``;
                            }
                            
                            return html`
                                <div class="subtable-header">
                                    ${field}
                                </div>
                                <table class="subtable subtable-level-${level}">
                                    <thead>
                                        <tr>
                                            ${(config as any).subtables && Object.keys((config as any).subtables).length > 0 ? 
                                                html`<th style="width: 40px;"></th>` : html``}
                                            ${(config as any).columns.map((col: { field: string; header: string }) => 
                                                html`<th>${col.header}</th>`
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${this.renderSubtableBody(parentKey, field, nestedData, config as any, level)}
                                    </tbody>
                                </table>
                            `;
                        })}
                    </div>
                </td>
            </tr>
        `;
    }

    private renderSubtableBody(parentKey: string, subtableField: string, data: any, config: any, level: number): TemplateResult {
        const hasNestedSubtables = config.subtables && Object.keys(config.subtables).length > 0;
        
        if (Array.isArray(data)) {
            if (data.length === 0) {
                const colspan = config.columns.length + (hasNestedSubtables ? 1 : 0);
                return html`<tr><td colspan="${colspan}">No data available</td></tr>`;
            }
            
            return html`
                ${data.map((item, itemIndex) => {
                    const itemKey = `${parentKey}-${subtableField}-${itemIndex}`;
                    const isItemExpanded = this.isSubtableRowExpanded(itemKey);
                    
                    return html`
                        <tr>
                            ${hasNestedSubtables ? html`
                                <td style="width: 40px;">
                                    <button 
                                        class="expand-button" 
                                        @click=${() => this.toggleSubtableRow(itemKey)}
                                        aria-label="${isItemExpanded ? 'Collapse' : 'Expand'} row"
                                    >
                                        ${isItemExpanded ? '−' : '+'}
                                    </button>
                                </td>
                            ` : ''}
                            ${config.columns.map((col: { field: string; header: string }) => 
                                html`<td>${this.formatCellValue(item[col.field])}</td>`
                            )}
                        </tr>
                        ${isItemExpanded && hasNestedSubtables ? 
                            this.renderNestedSubtables(itemKey, item, config.subtables, level + 1) : 
                            html``}
                    `;
                })}
            `;
        } else {
            // For object data type
            const itemKey = `${parentKey}-${subtableField}`;
            const isItemExpanded = this.isSubtableRowExpanded(itemKey);
            
            return html`
                <tr>
                    ${hasNestedSubtables ? html`
                        <td style="width: 40px;">
                            <button 
                                class="expand-button" 
                                @click=${() => this.toggleSubtableRow(itemKey)}
                                aria-label="${isItemExpanded ? 'Collapse' : 'Expand'} row"
                            >
                                ${isItemExpanded ? '−' : '+'}
                            </button>
                        </td>
                    ` : ''}
                    ${config.columns.map((col: { field: string; header: string }) => 
                        html`<td>${this.formatCellValue(data[col.field])}</td>`
                    )}
                </tr>
                ${isItemExpanded && hasNestedSubtables ? 
                    this.renderNestedSubtables(itemKey, data, config.subtables, level + 1) : 
                    html``}
            `;
        }
    }

    private isSubtableRowExpanded(rowKey: string): boolean {
        if (!this.expandedRows.has(rowKey)) {
            return false;
        }
        
        const expandedSet = this.expandedRows.get(rowKey);
        return expandedSet?.has(rowKey) || false;
    }

    private toggleSubtableRow(rowKey: string) {
        if (!this.expandedRows.has(rowKey)) {
            this.expandedRows.set(rowKey, new Set([rowKey]));
        } else {
            this.expandedRows.delete(rowKey);
            
            // Delete any child subtables
            [...this.expandedRows.keys()].forEach(key => {
                if (key.startsWith(`${rowKey}-`)) {
                    this.expandedRows.delete(key);
                }
            });
        }
        
        this.requestUpdate();
    }

    private getFilteredData() {
        if (!this.filter || this.filter.trim() === '') return this.data;
        
        const lowerFilter = this.filter.toLowerCase();
        return this.data.filter((row) =>
            this.columns.some((column) => {
                const value = row[column.field];
                return value !== undefined && 
                       value !== null && 
                       String(value).toLowerCase().includes(lowerFilter);
            })
        );
    }

    private getSortedData(data: Array<Record<string, any>>) {
        if (!this.sortColumn) return data;
        
        const direction = this.sortDirection === 'asc' ? 1 : -1;
        return [...data].sort((a, b) => {
            const aValue = a[this.sortColumn!];
            const bValue = b[this.sortColumn!];
            
            // Handle undefined and null values
            if (aValue === undefined || aValue === null) return direction;
            if (bValue === undefined || bValue === null) return -direction;
            
            // Sort numerically if both values are numbers
            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return (aValue - bValue) * direction;
            }
            
            // Sort alphabetically for strings
            const aString = String(aValue).toLowerCase();
            const bString = String(bValue).toLowerCase();
            
            if (aString < bString) return -direction;
            if (aString > bString) return direction;
            return 0;
        });
    }

    private getPaginatedData(data: any[]) {
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        return data.slice(start, end);
    }

    private getTotalPages(data: any[]) {
        return Math.max(1, Math.ceil(data.length / this.pageSize));
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