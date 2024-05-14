import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PrintService } from '../../services/print.service';
import { PrintData } from '../../models/print-data';
import { LabelsPerPageType } from 'src/app/models/labels-per-page-type';

@Component({
  selector: 'app-print',
  templateUrl: './print.component.html'
})
export class PrintComponent implements OnInit {
  public printData: PrintData;
  public labelsPerPage = LabelsPerPageType;

  constructor(
    private printService: PrintService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    if (this.printService.order) {
      this.printData = {
        pages: this.printService.buildPages(this.printService.order),
        metaData: {
          labelCount: this.printService.order.labelCount,
          labelsPerPage: this.printService.order.labelsPerPage,
          isCartonCountOnTop: this.printService.isCartonCountOnTop,
          isFromFirst: this.printService.isFromFirst,
          isShowFromVernonAddress: this.printService.isShowFromVernonAddress, // TODO: remove
          isShowFromSanDiegoAddress: this.printService.isShowFromSanDiegoAddress, // TODO: remove
          isSmallFont: this.printService.isSmallFont(),
          isVariety: this.printService.isVariety,
          companyName: this.printService.companyName
        }
      };

      if (this.printService.isDoubleLabels) {
        this.printData = {
          pages: this.printService.doubleLabels(this.printData),
          metaData: {
            labelCount: this.printService.order.labelCount,
            labelsPerPage: this.printService.order.labelsPerPage,
            isCartonCountOnTop: this.printService.isCartonCountOnTop,
            isFromFirst: this.printService.isFromFirst,
            isShowFromVernonAddress: this.printService.isShowFromVernonAddress, // TODO: remove
            isShowFromSanDiegoAddress: this.printService.isShowFromSanDiegoAddress, // TODO: remove
            isSmallFont: this.printService.isSmallFont(),
            isVariety: this.printService.isVariety,
            companyName: this.printService.companyName
          }
        };
      }

      // this.print();
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
