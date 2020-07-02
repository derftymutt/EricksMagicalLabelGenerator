import { Company } from './company';

export interface AddressLabelField {
  id?: string;
  name: string;
  value: Company;
  isHidden: boolean;
}
