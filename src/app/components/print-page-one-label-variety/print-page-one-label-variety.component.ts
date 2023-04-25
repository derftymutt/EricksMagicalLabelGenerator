import { Component, Input } from '@angular/core';
import { Label } from 'src/app/models/label';
import { PrintData } from 'src/app/models/print-data';

@Component({
  selector: 'app-print-page-one-label-variety',
  templateUrl: './print-page-one-label-variety.component.html'
})
export class PrintPageOneLabelVarietyComponent {
  @Input() public label: Label;
  @Input() public printData: PrintData;
}
