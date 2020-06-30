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

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    PrintComponent,
    CompanyModalComponent,
    LabelTypeModalComponent
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
  providers: [],
  entryComponents: [
    CompanyModalComponent,
    LabelTypeModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
