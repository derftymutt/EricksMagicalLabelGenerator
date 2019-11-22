import { Address } from './address';

export interface Company {
  id?: string;
  name: string;
  address: Address;
  labelTypeIds?: number[];
}
