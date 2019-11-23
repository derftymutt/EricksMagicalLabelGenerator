import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { Page } from '../models/page';
import { Label } from '../models/label';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
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
}
