import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Label } from 'src/app/models/label';
import { PdfOptions } from 'src/app/models/pdf-options';
import { PrintData } from 'src/app/models/print-data';
import { PdfService } from 'src/app/services/pdf.service';

@Component({
  selector: 'app-print-page-four-labels',
  templateUrl: './print-page-four-labels.component.html'
})
export class PrintPageFourLabelsComponent {
  @Input() public label: Label;
  @Input() public printData: PrintData;
  @ViewChild('pdfContainer', { static: true }) public pdfContainer: ElementRef;

  public printStyles = `
  <style>
  @media print {
    @page {
      size: letter portrait;
    }

    html,
    body {
      font-family: "ariel", sans-serif !important;
      font-size: 28px !important;
      font-weight: 900 !important;
      text-transform: uppercase !important;
    }

    .print-font-small {
      font-size: 20px !important;;
    }

    .page {
      page-break-after: always;
    }
  }

  </style>
  `;

  public constructor(private pdfService: PdfService) {}

  public onMakePdf(): void {
    const options: PdfOptions = {
      filename: 'tramever-labels.pdf',
      jsPDF: { unit: 'in', format: [6, 4], orientation: 'portrait' }
    };

    this.pdfService.makePdf(options, this.pdfContainer.nativeElement);
  }

  public onPrint() {
    // const popupWin = window.open('', '_blank', 'top=0, left=0, height=100%, width=auto');
    // popupWin.document.write(`
    //         <html>
    //           <head>
    //           ${this.printStyles}
    //           </head>
    //           <body onload="window.print()" onafterprint="window.close()">${printContent}</body>
    //         </html>`);
    // popupWin.document.close();

    const printContent = document.getElementById('print-section').innerHTML;
    const popupWin = window.open('', '_blank', 'top=0, left=0, height=100%, width=auto');
    popupWin.document.write(`
            <html>
              <head>
              ${this.printStyles}
              </head>
              <body onload="window.print()" onafterprint="window.close()">${printContent}</body>
            </html>`);
    popupWin.document.close();
  }
}
