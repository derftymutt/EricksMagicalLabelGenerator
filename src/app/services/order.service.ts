import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Subject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';

const BACKEND_URL = environment.apiUrl + '/orders';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: Order[] = [];
  private ordersUpdated = new Subject<Order[]>();

  constructor(private http: HttpClient) { }

  public getOrdersUpdatedListener() {
    return this.ordersUpdated.asObservable();
  }

  public getOrder(id: string): Observable<Order> {
    return this.http.get<Order>(`${BACKEND_URL}/${id}`);
  }

  public getOrders(): void {
    this.http.get<any>(BACKEND_URL)
      .pipe(map((orderData) => {
        return orderData.map(order => {
          return {
            id: order._id,
            title: order.title,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            to: order.to,
            from: order.from,
            madeIn: order.madeIn,
            purchaseOrder: order.purchaseOrder,
            dept: order.dept,
            labelCount: order.labelCount,
            labelType: order.labelType,
            labelFields: order.labelFields
          };
        });
      }))
      .subscribe(orders => {
        this.orders = orders;
        this.ordersUpdated.next([...this.orders]);
      });
  }

  public addOrder(order: Order) {
    if (order) {
      this.http.post<{ orderId: string }>(BACKEND_URL, order).subscribe(result => {
        order.id = result.orderId;
        this.orders.push(order);
        this.ordersUpdated.next([...this.orders]);
        console.log('post success, new orders array', this.orders);
      });
    }
  }

  public deleteOrder(id: string) {
    this.http.delete(`${BACKEND_URL}/${id}`).subscribe(() => {
      this.orders = this.orders.filter(orders => orders.id !== id);
      this.ordersUpdated.next([...this.orders]);
    });
  }
}
