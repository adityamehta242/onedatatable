import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { EditableConfig } from '../utils/RowEditor';

@customElement('editable-row-popup')
export class EditableRowPopup<T extends Record<string, any>> extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: absolute;
      background: white;
      border: 1px solid #ccc;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      padding: 16px;
      z-index: 1000;
      border-radius: 4px;
    }
    
    .form-row {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
    }
    
    label {
      width: 120px;
      font-weight: bold;
      margin-right: 8px;
    }
    
    input, select {
      flex: 1;
      padding: 8px;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    
    .buttons {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    }
    
    button {
      padding: 8px 16px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button.save {
      background-color: #4CAF50;
      color: white;
    }
    
    button.cancel {
      background-color: #f44336;
      color: white;
    }
  `;
  
  @property({ type: Object })
  data: T | null = null;
  
  @property({ type: Array })
  editableFields: EditableConfig[] = [];
  
  @state()
  private editingData: T | null = null;
  
  constructor() {
    super();
  }
  
  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('data') && this.data) {
      this.editingData = { ...this.data };
    }
  }
  
  private handleInputChange(e: Event, field: string) {
    if (!this.editingData) return;
    
    const target = e.target as HTMLInputElement | HTMLSelectElement;
    const value = target.type === 'checkbox' ? (target as HTMLInputElement).checked : target.value;
    
    this.editingData = {
      ...this.editingData,
      [field]: target.type === 'number' ? Number(value) : value
    };
  }
  
  private save() {
    const event = new CustomEvent('save', {
      detail: { data: this.editingData },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
  
  private cancel() {
    const event = new CustomEvent('cancel', {
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(event);
  }
  
  render() {
    if (!this.editingData) return html``;
    
    return html`
      <div class="popup-editor">
        ${this.editableFields
          .filter(field => field.editable)
          .map(field => {
            const value = this.editingData?.[field.field];
            
            return html`
              <div class="form-row">
                <label for="${field.field}">${field.field}</label>
                ${this.renderInputByType(field, value)}
              </div>
            `;
          })}
        
        <div class="buttons">
          <button class="save" @click="${this.save}">Save</button>
          <button class="cancel" @click="${this.cancel}">Cancel</button>
        </div>
      </div>
    `;
  }
  
  private renderInputByType(field: EditableConfig, value: any) {
    const type = field.type || 'text';
    
    switch (type) {
      case 'select':
        return html`
          <select 
            id="${field.field}" 
            @change="${(e: Event) => this.handleInputChange(e, field.field)}"
          >
            ${field.options?.map(option => html`
              <option 
                value="${option.value}" 
                ?selected="${value === option.value}"
              >
                ${option.label}
              </option>
            `)}
          </select>
        `;
      case 'checkbox':
        return html`
          <input 
            type="checkbox" 
            id="${field.field}" 
            ?checked="${value}" 
            @change="${(e: Event) => this.handleInputChange(e, field.field)}"
          />
        `;
      case 'number':
        return html`
          <input 
            type="number" 
            id="${field.field}" 
            value="${value ?? ''}" 
            @input="${(e: Event) => this.handleInputChange(e, field.field)}"
          />
        `;
      case 'date':
        return html`
          <input 
            type="date" 
            id="${field.field}" 
            value="${value ?? ''}" 
            @input="${(e: Event) => this.handleInputChange(e, field.field)}"
          />
        `;
      default:
        return html`
          <input 
            type="text" 
            id="${field.field}" 
            value="${value ?? ''}" 
            @input="${(e: Event) => this.handleInputChange(e, field.field)}"
          />
        `;
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'editable-row-popup': EditableRowPopup<any>;
  }
}