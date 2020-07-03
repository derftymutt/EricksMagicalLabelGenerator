import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './components/orders/orders.component';
import { PrintComponent } from './components/print/print.component';
import { MainComponent } from './components/main/main.component';
import { OrdersSavedComponent } from './components/orders-saved/orders-saved.component';
import { OrderResolver } from './services/order.resolver';

const routes: Routes = [
  { path: 'orders', component: MainComponent, children: [
    { path: 'new', component: OrdersComponent },
    { path: 'saved', component: OrdersSavedComponent },
    { path: ':id', component: OrdersComponent, resolve: { order: OrderResolver} },
  ]},
  { path: 'print', component: PrintComponent },
  { path: '', redirectTo: '/orders', pathMatch: 'full'},
  { path: '**', component: MainComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
