import { LabelField } from './label-field';
import { AddressLabelField } from './address-label-field';
import { LabelType } from './label-type';

export interface Order {
  to: AddressLabelField;
  from: LabelField;
  madeIn: LabelField;
  purchaseOrder: LabelField;
  dept: LabelField;
  labelCount: number;
  labelType: LabelType;
  labelFields: Array<LabelField[]>;
}
