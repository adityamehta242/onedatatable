import { Column } from '../types.js';

export function getFilteredData(data: any[], filter: string, columns: Column[]) {
  if (!filter) return data;
  const lowerFilter = filter.toLowerCase();
  return data.filter(row =>
    columns.some(column =>
      String(row[column.field]).toLowerCase().includes(lowerFilter)
    )
  );
}
