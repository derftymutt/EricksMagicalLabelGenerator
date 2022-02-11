import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OrderService } from './order.service';
import { Observable } from 'rxjs';

@Injectable()
export class OrderResolver implements Resolve<Order> {
  constructor(private orderService: OrderService) { }

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Order> {
    const id = route.params.id;

    return this.orderService.getOrder(id);
  }
}
