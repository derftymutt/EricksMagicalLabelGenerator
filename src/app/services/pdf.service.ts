import { Injectable } from '@angular/core';
import * as html2pdf from 'html2pdf.js';
import { PdfOptions } from '../models/pdf-options';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  public makePdf(pdfOptions: PdfOptions, htmlContainer: HTMLElement): void {
    if (pdfOptions == null || htmlContainer == null) {
      console.error('makePdf called with invalid data');
      return;
    }

    html2pdf().set(pdfOptions).from(htmlContainer).save();
  }
}
