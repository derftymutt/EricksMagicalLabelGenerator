import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Page } from '../models/page';
import { Label } from '../models/label';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  public order: Order;
  public isDoubleLabels = false;
  public isCartonCountOnTop = false;

  public buildPages(order: Order): Page[] {
    const result = [];

    let labelsPerPageCount = 0;
    let page: Page = new Page();
    const orderLabelCount = +order.labelCount;

    for (let index = 0; index < orderLabelCount; index++) {
      // TODO: make labelcount dynamic
      if (labelsPerPageCount === 0) {
        page.labelCount = 4;
      }

      const label: Label = {
        to: order.to,
        from: order.from,
        madeIn: order.madeIn,
        purchaseOrder: order.purchaseOrder,
        dept: order.dept,
        fields: order.labelFields[index],
        labelNumber: index + 1
      };

      page.labels.push(label);
      labelsPerPageCount++;

      if (labelsPerPageCount === page.labelCount) {
        result.push(page);
        labelsPerPageCount = 0;
        page = new Page();
      } else if (index + 1 === orderLabelCount) {
        result.push(page);
      }
    }

    return result;
  }

  public doubleLabels(pages: Page[]): Page[] {
    const labelsPerPage = 4;
    const doubledLabels = [];
    let currentLabelCount = 0;

    pages.forEach(page => {
      page.labels.forEach(label => {
        doubledLabels.push(label);
        doubledLabels.push(label);
      });
    });

    const pagesWithDoubledLabels = [];
    let newPage: Page = new Page();

    doubledLabels.forEach((lbl, index) => {
      newPage.labels.push(lbl);
      currentLabelCount++;

      if (currentLabelCount === labelsPerPage) {
        pagesWithDoubledLabels.push(newPage);
        currentLabelCount = 0;
        newPage = new Page();
      } else if (index + 1 === doubledLabels.length) {
        pagesWithDoubledLabels.push(newPage);
      }
    });

    return pagesWithDoubledLabels;
  }
}
