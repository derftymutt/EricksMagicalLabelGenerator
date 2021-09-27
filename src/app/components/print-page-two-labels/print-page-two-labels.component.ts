import { Component, Input } from '@angular/core';
import { Label } from 'src/app/models/label';
import { PrintData } from 'src/app/models/print-data';

@Component({
  selector: 'app-print-page-two-labels',
  templateUrl: './print-page-two-labels.component.html'
})
export class PrintPageTwoLabelsComponent {
  @Input() public label: Label;
  @Input() public printData: PrintData;
}
