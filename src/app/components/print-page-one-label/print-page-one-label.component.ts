import { Component, Input } from '@angular/core';
import { Label } from 'src/app/models/label';
import { PrintData } from 'src/app/models/print-data';

@Component({
  selector: 'app-print-page-one-label',
  templateUrl: './print-page-one-label.component.html'
})
export class PrintPageOneLabelComponent {
  @Input() public label: Label;
  @Input() public printData: PrintData;
}
