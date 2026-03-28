/**
 * Excel exporter utility
 * Creates a properly formatted Excel file from table data
 */

export const exportToExcel = (fileName, columns, data) => {
  // Create CSV content (Excel can read CSV)
  const headers = columns.map(col => col.label).join(',');
  
  const rows = data.map(row => {
    return columns.map(col => {
      let value = row[col.key];
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        return '';
      }
      
      // Handle dates
      if (col.key.includes('Date') || col.key.includes('At')) {
        if (typeof value === 'string') {
          value = new Date(value).toLocaleString();
        } else if (value instanceof Date) {
          value = value.toLocaleString();
        }
      }
      
      // Handle special values
      if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      
      // Escape quotes in string values
      value = String(value).replace(/"/g, '""');
      
      // Quote all values to handle commas
      return `"${value}"`;
    }).join(',');
  });
  
  const csv = [headers, ...rows].join('\n');
  
  // Create blob and download
  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export with Excel formatting (using simple XLSX JSON format)
 * For better formatting, this uses a simpler approach that Excel understands
 */
export const exportToExcelAdvanced = (fileName, columns, data) => {
  // Check if XLSX library is available, otherwise fallback to CSV
  if (typeof require !== 'undefined') {
    try {
      const XLSX = require('xlsx');
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      
      // Prepare data
      const wsData = [
        columns.map(col => col.label),
        ...data.map(row => 
          columns.map(col => {
            let value = row[col.key];
            if (value === null || value === undefined) return '';
            if (col.key.includes('Date') || col.key.includes('At')) {
              return new Date(value).toLocaleString();
            }
            if (typeof value === 'object') return JSON.stringify(value);
            return value;
          })
        )
      ];
      
      // Create sheet
      const ws = XLSX.utils.aoa_to_sheet(wsData);
      
      // Set column widths
      const colWidths = columns.map(col => ({ wch: Math.max(col.label.length + 2, 15) }));
      ws['!cols'] = colWidths;
      
      // Format header row
      for (let i = 0; i < columns.length; i++) {
        const cellRef = XLSX.utils.encode_col(i) + '1';
        if (ws[cellRef]) {
          ws[cellRef].s = {
            fill: { fgColor: { rgb: 'FF4472C4' } },
            font: { bold: true, color: { rgb: 'FFFFFFFF' } },
            alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
            border: { left: {}, right: {}, top: {}, bottom: {} }
          };
        }
      }
      
      XLSX.utils.book_append_sheet(wb, ws, 'Data');
      XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
      return;
    } catch (e) {
      // Fallback to CSV
    }
  }
  
  // Fallback: export as CSV
  exportToExcel(fileName, columns, data);
};
