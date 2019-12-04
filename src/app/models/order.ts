import { LabelType } from './label-type.enum';
import { LabelField } from './label-field';
import { AddressLabelField } from './address-label-field';

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
