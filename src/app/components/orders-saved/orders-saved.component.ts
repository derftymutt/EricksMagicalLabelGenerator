import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { Subscription } from 'rxjs';
import { Order } from 'src/app/models/order';

@Component({
  selector: 'app-orders-saved',
  templateUrl: './orders-saved.component.html'
})
export class OrdersSavedComponent implements OnInit, OnDestroy {
  public orders: Order[];
  private ordersSubscription: Subscription;

  constructor(private orderService: OrderService) { }

  public ngOnInit(): void {
    this.orderService.getOrders();
    this.subscribeToOrderUpdates();
  }

  public ngOnDestroy(): void {
    if (this.ordersSubscription) {
      this.ordersSubscription.unsubscribe();
    }
  }

  public onDeleteOrder(orderId: string): void {
    this.orderService.deleteOrder(orderId);
  }

  private subscribeToOrderUpdates(): void {
    this.ordersSubscription = this.orderService.getOrdersUpdatedListener().subscribe(orders => {
      this.orders = orders;
    });
  }
}
