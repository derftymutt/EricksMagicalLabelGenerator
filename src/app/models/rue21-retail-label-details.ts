import { LabelType } from './label-type.enum';
import { LabelField } from './label-field';

export class Rue21RetailLabelDetails {
  labelType: LabelType.Rue21Retail;
  labelFields: LabelField[] = [
    { name: 'VENDOR STYLE NUMBER', value: '' },
    { name: 'SIZE RATIO', value: '' },
    { name: 'COLOR', value: '' },
    { name: 'TOTAL UNITS', value: '' },
    { name: 'UNIVERSITY', value: '' }
  ];
}
