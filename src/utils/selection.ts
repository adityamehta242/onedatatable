type selectedMode = 'single' | 'multiple';

export class RowSelector<T = string | number> {
    private mode: selectedMode;
    private selected: T[] | T | null;

    constructor(mode: selectedMode = 'single')
    {
        this.mode = mode;
        this.selected = mode === 'single' ? null : [];
    }

    selectRow(row : T) : void
    {
        if(this.mode ==='single')
        {
            this.selected = row;
        } else {
            const selected = this.selected as T[];
            if(!selected.includes(row))
            {
                selected.push(row);
            }
        }
    }

    isSelected(row : T) : boolean
    {
        if(this.mode === 'single')
        {
            return this.selected === row;
        } 
        return (this.selected as T[]).includes(row);
    }

    deselectRow(row : T): void
    {
        if(this.mode === 'single')
        {
            if(this.selected === row)
            {
                this.selected = null;
            }
        }else {
            this.selected = (this.selected as T[]).filter(item => item !== row);
        }
    }

    toggleSelection(row : T) : void{
        if(this.isSelected(row))
        {
            this.deselectRow(row);
        } else {
            this.selectRow(row);
        }
    }

    clearSelection() : void{
        this.selected = this.mode === 'single' ? null : [];
    }

    getSelected() : T | T[] | null
    {
        return this.selected;
    }

    getSelectedIds(): T[] {
        if (this.mode === 'single') {
          return this.selected ? [this.selected as T] : [];
        }
        return this.selected as T[];
      }

    setMode(mode: 'single' | 'multiple')  {
        if (this.mode === mode) return;
      
        this.mode = mode;
        if (mode === 'single') {
          const ids = this.getSelectedIds();
          this.selected = ids.length > 0 ? ids[0] : null;
        } else {
            this.selected = Array.isArray(this.selected) ? this.selected : (this.selected === null ? [] : [this.selected]);
        }
      }

}

