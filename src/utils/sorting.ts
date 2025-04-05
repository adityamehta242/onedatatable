import { SortDirection } from '../types.js';

export function getSortedData(data: any[], sortColumn: string | null, sortDirection: SortDirection) {
  if (!sortColumn) return data;
  const direction = sortDirection === 'asc' ? 1 : -1;
  return [...data].sort((a, b) => {
    const aValue = a[sortColumn];
    const bValue = b[sortColumn];
    if (aValue < bValue) return -direction;
    if (aValue > bValue) return direction;
    return 0;
  });
}
