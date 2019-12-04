import { LabelField } from './label-field';
import { AddressLabelField } from './address-label-field';

export interface Label {
  to: AddressLabelField;
  from: LabelField;
  madeIn: LabelField;
  purchaseOrder: LabelField;
  dept: LabelField;
  fields: LabelField[];
  labelNumber: number;
}
