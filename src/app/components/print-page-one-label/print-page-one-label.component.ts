import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Label } from 'src/app/models/label';
import { PrintData } from 'src/app/models/print-data';
import * as html2pdf from 'html2pdf.js';
import { PdfService } from 'src/app/services/pdf.service';
import { PdfOptions } from 'src/app/models/pdf-options';

@Component({
  selector: 'app-print-page-one-label',
  templateUrl: './print-page-one-label.component.html'
})
export class PrintPageOneLabelComponent implements OnInit {
  @Input() public label: Label;
  @Input() public printData: PrintData;
  @ViewChild('pdfContainer', { static: true }) public pdfContainer: ElementRef;

  public constructor(private pdfService: PdfService) {}

  public ngOnInit(): void {
    // this.makePdf();
  }

  public onMakePdf() {
    const options: PdfOptions = {
      filename: 'tramever-labels.pdf',
      jsPDF: { unit: 'in', format: [6, 4], orientation: 'portrait' }
    };

    this.pdfService.makePdf(options, this.pdfContainer.nativeElement);
  }
}
