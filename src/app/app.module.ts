import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { PrintComponent } from './components/print/print.component';
import { MockLabelData } from '../assets/mock-data/labels';

@NgModule({
  declarations: [AppComponent, HomeComponent, PrintComponent],
  imports: [BrowserModule, CommonModule, AppRoutingModule, ReactiveFormsModule],
  providers: [MockLabelData],
  bootstrap: [AppComponent]
})
export class AppModule {}
