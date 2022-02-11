import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Label } from 'src/app/models/label';
import { PrintData } from 'src/app/models/print-data';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-print-page-one-label',
  templateUrl: './print-page-one-label.component.html'
})
export class PrintPageOneLabelComponent {
  @Input() public label: Label;
  @Input() public printData: PrintData;
  @ViewChild('pdfContainer', { static: true }) public pdfContainer: ElementRef;

  public onMakePdf() {
    // const element = document.getElementById('element-to-print');
    html2pdf(this.pdfContainer.nativeElement);
  }
}
