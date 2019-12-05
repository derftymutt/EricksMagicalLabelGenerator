import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order } from '../../models/order';
import { PrintService } from '../../services/print.service';
import { PrintData } from '../../models/print-data';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html'
})
export class PrintComponent implements OnInit {
  public printData: PrintData;

  constructor(
    private printService: PrintService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    if (this.printService.order) {
      this.printData = {
        pages: this.printService.buildPages(this.printService.order),
        labelCount: this.printService.order.labelCount
      };

      // this.print();
    }
  }

  private print(): void {
    setTimeout(() => {
      window.print();
    }, 1000);

    window.addEventListener('afterprint', () => {
      // this.router.navigate([this.getBackRoute()], { queryParams: { isOverrideAutoRoute: true } });
    });
  }
}
