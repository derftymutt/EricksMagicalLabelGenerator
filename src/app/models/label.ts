import { LabelField } from './label-field';

export interface Label {
  to: string;
  from: string;
  purchaseOrder: string;
  dept: string;
  fields: LabelField[];
  labelNumber: number;
}
