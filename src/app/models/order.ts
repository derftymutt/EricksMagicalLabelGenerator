import { LabelType } from './label-type.enum';
import { LabelField } from './label-field';

export interface Order {
  to: string;
  from: string;
  purchaseOrder: string;
  dept: string;
  labelCount: number;
  labelType: LabelType;
  labelFields: Array<LabelField[]>;
}
