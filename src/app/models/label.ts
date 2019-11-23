import { LabelField } from './label-field';
import { Address } from './address';

export interface Label {
  to: Address;
  from: string;
  madeIn: string;
  purchaseOrder: string;
  dept: string;
  fields: LabelField[];
  labelNumber: number;
}
