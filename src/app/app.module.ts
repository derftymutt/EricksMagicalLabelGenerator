import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { OrdersComponent } from './components/orders/orders.component';
import { PrintComponent } from './components/print/print.component';
import { CompanyModalComponent } from './components/company-modal/company-modal.component';
import { LabelTypeModalComponent } from './components/label-type-modal/label-type-modal.component';
import { SaveOrderModalComponent } from './components/save-order-modal/save-order-modal.component';
import { MainComponent } from './components/main/main.component';
import { OrdersSavedComponent } from './components/orders-saved/orders-saved.component';
import { OrderResolver } from './services/order.resolver';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    OrdersComponent,
    OrdersSavedComponent,
    PrintComponent,
    CompanyModalComponent,
    LabelTypeModalComponent,
    SaveOrderModalComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule
  ],
  providers: [OrderResolver],
  entryComponents: [
    CompanyModalComponent,
    LabelTypeModalComponent,
    SaveOrderModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
