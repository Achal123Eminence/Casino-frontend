import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

/**
 * exportToExcel function.
 * @param {*} data - Parameter.
 * @param {*} fileName - Parameter.
 * @returns {*} Result.
 */
export function exportToExcel(data: any[], fileName: string) {
  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
  const workbook: XLSX.WorkBook = {
    Sheets: { 'data': worksheet },
    SheetNames: ['data'],
  };
  const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  /**
   * saveAs function.
   * @param {*} blob - Parameter.
   * @returns {*} Result.
   */
  saveAs(blob, `${fileName}.xlsx`);
}

/**
 * exportToPDF function.
 * @param {*} data - Parameter.
 * @param {*} fileName - Parameter.
 * @returns {*} Result.
 */
export function exportToPDF(data: any[], fileName: string) {
  const doc = new jsPDF('landscape');

  const headers = Object.keys(data[0] || {}).map((key) => key);
  const body = data.map((row) => headers.map((header) => row[header]));

  doc.setFontSize(14);
  doc.text(fileName, 14, 15);

  /**
   * autoTable function.
   * @param {*} doc - Parameter.
   * @param {*} arg1 - Parameter.
   * @param {*} arg1.startY - Parameter.
   * @param {*} arg1.head - Parameter.
   * @param {*} arg1.body - Parameter.
   * @param {*} arg1.styles - Parameter.
   * @returns {*} Result.
   */
  autoTable(doc, {
    startY: 20,
    head: [headers],
    body: body,
    styles: { fontSize: 8 },
  });

  doc.save(`${fileName}.pdf`);
}
