import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order';
import { PrintService } from '../../services/print.service';
import { PrintData } from '../../models/print-data';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html'
})
export class PrintComponent implements OnInit {
  public order: Order;
  public printData: PrintData;

  constructor(
    private orderService: OrderService,
    private printService: PrintService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    if (this.orderService.order) {
      this.order = this.orderService.order;

      this.printData = {
        pages: this.printService.buildPages(this.order),
        labelCount: this.order.labelCount
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
