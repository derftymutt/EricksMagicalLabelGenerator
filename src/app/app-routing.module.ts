import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrdersComponent } from './components/orders/orders.component';
import { PrintComponent } from './components/print/print.component';

const routes: Routes = [
  { path: 'orders', component: OrdersComponent},
  { path: 'print', component: PrintComponent},
  { path: '', redirectTo: '/orders', pathMatch: 'full'},
  { path: '**', component: OrdersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
