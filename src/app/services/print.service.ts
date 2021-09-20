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
  public isFromFirst = false;
  public isShowFromAddress = false;

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

  public isSmallFont(): boolean {
    let result = false;
    const lineLimit = 15;
    let lineCount = 0;
    let isWinnersMerchants = false;

    // quick fix to handle need for small font for WINNERS MERCHANTS INTERNATIONAL LP
    if (this.order) {
      isWinnersMerchants = this.order.to?.value?.name?.toLocaleLowerCase().includes('winner');

      if (isWinnersMerchants) {
        result = true;
      }
    }

    if (!isWinnersMerchants && this.order) {
      if (!this.order.to.isHidden) { lineCount++; }

      if (Object.keys(this.order.to.value).length > 0) {
        if (!this.order.to.isHidden) { lineCount++; }
        if (this.order.to.value.name) { lineCount++; }
        if (this.order.to.value.address.street1) { lineCount++; }
        if (this.order.to.value.address.street2) { lineCount++; }
        if (this.order.to.value.address.city) { lineCount++; }
      }

      if (this.order.madeIn.value) { lineCount++; }
      if (this.order.from.value) { lineCount++; }
      if (this.order.purchaseOrder.value) { lineCount++; }
      if (this.order.dept.value) { lineCount++; }

      if (this.order.labelFields.length > 0) {
        const fieldCount = this.order.labelFields[0].length;
        lineCount += fieldCount;
      }

      result = lineCount > lineLimit;
    }

    return result;
  }
}
