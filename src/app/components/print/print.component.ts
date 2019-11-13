import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from 'src/app/services/order.service';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html'
})
export class PrintComponent implements OnInit {
  public order: Order;

  constructor(private orderService: OrderService, private router: Router) {}

  public ngOnInit(): void {
    if (this.orderService.order) {
      // this.order = this.orderService.order;
      this.print();
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
