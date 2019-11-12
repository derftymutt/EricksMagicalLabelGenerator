import { LabelType } from './label-type.enum';
import { LabelField } from './label-field';

export interface Order {
  to: string;
  from: string;
  purchaseOrderNumber: string;
  dept: string;
  labelCount: number;
  labelType: LabelType;
  labelFields: LabelField[];
}
