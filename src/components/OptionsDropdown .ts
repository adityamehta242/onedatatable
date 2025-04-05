// components/options-dropdown.ts
import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { exportPDF, exportCSV, printTable} from '../utils/Export';
import { changeTheme } from '../utils/changeTheme';

@customElement('options-dropdown')
export class OptionsDropdown extends LitElement {
  @state() private open = false;

  static styles = css`
    .dropdown {
      position: relative;
      display: inline-block;
    }
    .dropdown-content {
      display: none;
      position: absolute;
      background-color: white;
      box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
      z-index: 1;
    }
    .dropdown-content.show {
      display: block;
    }
    .dropdown-content button {
      padding: 8px 12px;
      width: 100%;
      border: none;
      background: none;
      cursor: pointer;
      text-align: left;
    }
    .icon-button {
      cursor: pointer;
    }
  `;

  toggleDropdown() {
    this.open = !this.open;
  }

  handleOption(action: string) {
    switch (action) {
      case 'pdf': exportPDF(); break;
      case 'csv': exportCSV(); break;
      case 'print': printTable(); break;
      case 'theme-dark': changeTheme('dark'); break;
      case 'theme-light': changeTheme('light'); break;
      case 'theme-default': changeTheme('default'); break;
    }
    this.open = false; // close dropdown after click
  }

  render() {
    return html`
      <div class="dropdown">
        <div class="icon-button" @click=${this.toggleDropdown}>⚙️</div>
        <div class="dropdown-content ${this.open ? 'show' : ''}">
          <button @click=${() => this.handleOption('pdf')}>Export as PDF</button>
          <button @click=${() => this.handleOption('csv')}>Export as CSV</button>
          <button @click=${() => this.handleOption('print')}>Print</button>
          <hr />
          <button @click=${() => this.handleOption('theme-dark')}>Dark Theme</button>
          <button @click=${() => this.handleOption('theme-light')}>Light Theme</button>
          <button @click=${() => this.handleOption('theme-default')}>Default Theme</button>
        </div>
      </div>
    `;
  }
}
