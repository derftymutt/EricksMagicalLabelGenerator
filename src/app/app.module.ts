import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HomeComponent } from './components/home/home.component';
import { PrintComponent } from './components/print/print.component';
import { MockLabelData } from '../assets/mock-data/labels';
import { AddCompanyModal } from './components/add-company-modal/add-company-modal.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, PrintComponent, AddCompanyModal],
  imports: [BrowserModule, CommonModule, HttpClientModule, AppRoutingModule, ReactiveFormsModule, NgbModule],
  providers: [MockLabelData],
  entryComponents: [AddCompanyModal],
  bootstrap: [AppComponent]
})
export class AppModule { }
