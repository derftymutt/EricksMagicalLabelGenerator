import { LabelType } from './label-type.enum';
import { LabelField } from './label-field';
import { Address } from './address';

export interface Order {
  to: Address;
  from: string;
  madeIn: string;
  purchaseOrder: string;
  dept: string;
  labelCount: number;
  labelType: LabelType;
  labelFields: Array<LabelField[]>;
}
