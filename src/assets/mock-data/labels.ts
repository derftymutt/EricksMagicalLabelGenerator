import { LabelType } from '../../app/models/label-type.enum';

export class MockLabelData {
  labels = {
    rue21Retail: {
      labelType: LabelType.Rue21Retail,
      labelFields: [
        { name: 'VENDOR STYLE NUMBER', value: '' },
        { name: 'SIZE RATIO', value: '' },
        { name: 'COLOR', value: '' },
        { name: 'TOTAL UNITS', value: '' },
        { name: 'UNIVERSITY', value: '' }
      ]
    },
    rue21ECOM: {
      labelType: LabelType.Rue21ECOM,
      labelFields: [
        { name: 'VENDOR STYLE NUMBER', value: '' },
        { name: 'SIZE RATIO', value: '' },
        { name: 'COLOR', value: '' },
        { name: 'TOTAL UNITS', value: '' },
        { name: 'ECOM', value: '' }
      ]
    }
  };
}
