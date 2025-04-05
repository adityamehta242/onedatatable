import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('search-input')
export class SearchInput extends LitElement {
  render() {
    return html`
      <div class="search-container">
        <input type="text" @input=${(e: any) => 
          this.dispatchEvent(new CustomEvent('filter', { 
            detail: (e.target as HTMLInputElement).value 
          }))} 
          placeholder="Search..." />
      </div>
    `;
  }
}