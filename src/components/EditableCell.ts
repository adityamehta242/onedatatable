import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EditableConfig } from '../utils/RowEditor';

@customElement('editable-cell')
export class EditableCell extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    
    .cell {
      padding: 8px;
      min-height: 20px;
      cursor: pointer;
    }
    
    .editable {
      cursor: pointer;
    }
    
    .editable:hover {
      background-color: #f5f5f5;
    }
    
    .editing {
      padding: 0;
    }
    
    input, select {
      width: 100%;
      box-sizing: border-box;
      padding: 8px;
      border: 1px solid #2196F3;
      outline: none;
    }
  `;
  
  @property({ type: String })
  value: any = '';
  
  @property({ type: String })
  field: string = '';
  
  @property({ type: Object })
  fieldConfig: EditableConfig | null = null;
  
  @property({ type: Boolean })
  editable: boolean = false;
  
  @state()
  private editing: boolean = false;
  
  @state()
  private editValue: any = '';
  
  constructor() {
    super();
  }
  
  private handleDoubleClick() {
    if (!this.editable) return;
    
    this.editing = true;
    this.editValue = this.value;
  }
  
  private handleBlur() {
    this.saveEdit();
  }
  
  private handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.saveEdit();
    } else if (e.key === 'Escape') {
      this.cancelEdit();
    }
  }
  
  private handleChange(e: Event) {
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    this.editValue = target.type === 'checkbox' 
      ? (target as HTMLInputElement).checked 
      : (target.type === 'number' ? Number(target.value) : target.value);
  }
  
  private saveEdit() {
    if (!this.editing) return;
    
    const oldValue = this.value;
    if (oldValue !== this.editValue) {
      const event = new CustomEvent('cell-change', {
        detail: {
          field: this.field,
          oldValue,
          newValue: this.editValue
        },
        bubbles: true,
        composed: true
      });
      this.dispatchEvent(event);
    }
    
    this.editing = false;
  }
  
  private cancelEdit() {
    this.editing = false;
  }
  
  render() {
    if (this.editing && this.editable) {
      return this.renderEditor();
    }
    
    return html`
      <div 
        class="cell ${this.editable ? 'editable' : ''}"
        @dblclick="${this.handleDoubleClick}"
      >
        ${this.formatValue(this.value)}
      </div>
    `;
  }
  
  private renderEditor() {
    const type = this.fieldConfig?.type || 'text';
    
    switch (type) {
      case 'select':
        return html`
          <div class="cell editing">
            <select
              @blur="${this.handleBlur}"
              @keydown="${this.handleKeyDown}"
              @change="${this.handleChange}"
              .value="${this.editValue}"
              @click="${(e: Event) => e.stopPropagation()}"
            >
              ${this.fieldConfig?.options?.map(option => html`
                <option 
                  value="${option.value}" 
                  ?selected="${this.editValue === option.value}"
                >
                  ${option.label}
                </option>
              `)}
            </select>
          </div>
        `;
      case 'checkbox':
        return html`
          <div class="cell editing">
            <input
              type="checkbox"
              ?checked="${this.editValue}"
              @blur="${this.handleBlur}"
              @keydown="${this.handleKeyDown}"
              @change="${this.handleChange}"
              @click="${(e: Event) => e.stopPropagation()}"
            />
          </div>
        `;
      default:
        return html`
          <div class="cell editing">
            <input
              type="${type}"
              .value="${this.editValue}"
              @blur="${this.handleBlur}"
              @keydown="${this.handleKeyDown}"
              @input="${this.handleChange}"
              @click="${(e: Event) => e.stopPropagation()}"
            />
          </div>
        `;
    }
  }
  
  private formatValue(value: any): string {
    if (value === null || value === undefined) return '';
    
    const type = this.fieldConfig?.type || 'text';
    
    switch (type) {
      case 'checkbox':
        return value ? '✓' : '✗';
      case 'select':
        const option = this.fieldConfig?.options?.find(opt => opt.value === value);
        return option ? option.label : value.toString();
      default:
        return value.toString();
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'editable-cell': EditableCell;
  }
}