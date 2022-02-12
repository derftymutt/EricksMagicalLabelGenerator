import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Label } from 'src/app/models/label';
import { PrintData } from 'src/app/models/print-data';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-print-page-one-label',
  templateUrl: './print-page-one-label.component.html'
})
export class PrintPageOneLabelComponent implements OnInit {
  @Input() public label: Label;
  @Input() public printData: PrintData;
  @ViewChild('pdfContainer', { static: true }) public pdfContainer: ElementRef;

  public ngOnInit(): void {
    this.makePdf();
  }

  public makePdf() {
    const options = {
      filename: 'tramever-labels.pdf',
      jsPDF: { unit: 'in', format: [6, 4], orientation: 'portrait' }
    };

    html2pdf().set(options).from(this.pdfContainer.nativeElement).save();
  }
}
