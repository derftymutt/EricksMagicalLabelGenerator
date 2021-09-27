import { LabelField } from './label-field';
import { AddressLabelField } from './address-label-field';
import { LabelType } from './label-type';
import { LabelsPerPageType } from './labels-per-page-type';

export interface Order {
  id?: string;
  title?: string;
  createdAt?: Date;
  updatedAt?: Date;
  to: AddressLabelField;
  from: LabelField;
  madeIn: LabelField;
  purchaseOrder: LabelField;
  dept: LabelField;
  labelCount: number;
  labelType: LabelType;
  labelFields: Array<LabelField[]>;
  labelsPerPage: LabelsPerPageType;
}
