export interface PdfOptions {
  filename: string;
  jsPDF: {
    unit: string;
    format: string | number[];
    orientation: string;
  };
}
