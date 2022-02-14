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

  public constructor(private pdfService: PdfService) {}

  public onMakePdf(): void {
    const options: PdfOptions = {
      filename: 'tramever-labels.pdf',
      jsPDF: { unit: 'in', format: [6, 4], orientation: 'portrait' }
    };

    this.pdfService.makePdf(options, this.pdfContainer.nativeElement);
  }
}
