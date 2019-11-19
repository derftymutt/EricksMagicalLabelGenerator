import { LabelType } from './label-type.enum';

export interface Company {
  id?: number;
  name: string;
  address: string;
  labelTypes?: LabelType[];
}
