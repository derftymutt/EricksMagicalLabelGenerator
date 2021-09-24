import { Component, Input } from '@angular/core';
import { Label } from 'src/app/models/label';
import { PrintData } from 'src/app/models/print-data';

@Component({
  selector: 'app-print-page-four-labels',
  templateUrl: './print-page-four-labels.component.html'
})
export class PrintPageFourLabelsComponent {
  @Input() public label: Label;
  @Input() public printData: PrintData;
}
