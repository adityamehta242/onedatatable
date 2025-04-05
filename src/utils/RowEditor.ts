export type EditableConfig = {
    field: string;
    editable: boolean;
    type?: 'text' | 'number' | 'select' | 'date' | 'checkbox';
    options?: Array<{ value: any; label: string }>;
  };
  
export type EditMode = 'popup' | 'inline';
  
  export class RowEditor<T extends Record<string, any>> {
    private editMode: EditMode;
    private editableFields: EditableConfig[];
    private currentEditingRow: T | null = null;
    private originalData: T | null = null;
    private changedRows: Map<any, T> = new Map();
    private idField: keyof T;
    
    constructor(editMode: EditMode = 'popup', editableFields: EditableConfig[] = [], idField: keyof T = 'id') {
      this.editMode = editMode;
      this.editableFields = editableFields;
      this.idField = idField;
    }
    
    /**
     * Start editing a row
     */
    startEditing(row: T): void {
      this.currentEditingRow = { ...row };
      this.originalData = { ...row };
    }
    
    /**
     * End editing and save changes
     */
    saveEditing(): T | null {
      if (!this.currentEditingRow || !this.originalData) return null;
      
      // Check if there are actual changes
      let hasChanges = false;
      for (const field of this.getEditableFieldNames()) {
        if (this.currentEditingRow[field] !== this.originalData[field]) {
          hasChanges = true;
          break;
        }
      }
      
      if (hasChanges) {
        const id = this.currentEditingRow[this.idField];
        this.changedRows.set(id, { ...this.currentEditingRow });
      }
      
      const savedRow = { ...this.currentEditingRow };
      this.cancelEditing();
      return savedRow;
    }
    
    /**
     * Cancel editing and discard changes
     */
    cancelEditing(): void {
      this.currentEditingRow = null;
      this.originalData = null;
    }
    
    /**
     * Update a field value in the currently editing row
     */
    updateField(field: keyof T, value: any): void {
      if (!this.currentEditingRow) return;
      
      this.currentEditingRow = {
        ...this.currentEditingRow,
        [field]: value
      };
    }
    
    /**
     * Check if a row is being edited
     */
    isEditing(row: T): boolean {
      if (!this.currentEditingRow) return false;
      return this.currentEditingRow[this.idField] === row[this.idField];
    }
    
    /**
     * Check if a row has been modified
     */
    isModified(row: T): boolean {
      const id = row[this.idField];
      return this.changedRows.has(id);
    }
    
    /**
     * Get all rows that have been modified
     */
    getModifiedRows(): T[] {
      return Array.from(this.changedRows.values());
    }
    
    /**
     * Clear all modified rows history
     */
    clearModifiedRows(): void {
      this.changedRows.clear();
    }
    
    /**
     * Get the current editing row
     */
    getCurrentEditingRow(): T | null {
      return this.currentEditingRow;
    }
    
    /**
     * Get the edit mode
     */
    getEditMode(): EditMode {
      return this.editMode;
    }
    
    /**
     * Set the edit mode
     */
    setEditMode(mode: EditMode): void {
      this.editMode = mode;
    }
    
    /**
     * Get the editable fields
     */
    getEditableFields(): EditableConfig[] {
      return this.editableFields;
    }
    
    /**
     * Get only the names of editable fields
     */
    getEditableFieldNames(): string[] {
      return this.editableFields
        .filter(field => field.editable)
        .map(field => field.field);
    }
    
    /**
     * Check if a field is editable
     */
    isFieldEditable(fieldName: string): boolean {
      return this.editableFields.some(field => field.field === fieldName && field.editable);
    }
    
    /**
     * Set the editable fields
     */
    setEditableFields(fields: EditableConfig[]): void {
      this.editableFields = fields;
    }
  }