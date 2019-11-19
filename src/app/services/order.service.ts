import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import { LabelType } from '../models/label-type.enum';
import { MockLabelData } from '../../assets/mock-data/labels';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  public order: Order;

  constructor(private mockLabelData: MockLabelData) {}

  public getlabelFieldsData(labelType: LabelType) {
    switch (labelType) {
      case LabelType.Rue21Retail:
        return this.mockLabelData.labels.rue21Retail;

      case LabelType.Rue21ECOM:
        return this.mockLabelData.labels.rue21ECOM;
    }
  }
}
