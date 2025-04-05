export function getPaginatedData(data: any[], currentPage: number, pageSize: number) {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }
  
  export function getTotalPages(data: any[], pageSize: number) {
    return Math.ceil(data.length / pageSize);
  }
  