import { html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('pagination-controls')
export class PaginationControls extends LitElement {
  @property({ type: Number }) currentPage = 1;
  @property({ type: Number }) totalPages = 1;

  render() {
    return html`
      <div class="pagination">
        <button @click=${() => this.dispatchEvent(new CustomEvent('prev-page'))} ?disabled=${this.currentPage === 1}>Previous</button>
        <span>Page ${this.currentPage} of ${this.totalPages}</span>
        <button @click=${() => this.dispatchEvent(new CustomEvent('next-page'))} ?disabled=${this.currentPage === this.totalPages}>Next</button>
      </div>
    `;
  }
}
