import { BoxDetail } from './box-detail';

export interface Order {
  to: string;
  from: string;
  purchaseOrder: string;
  dept: string;
  boxCount: number;
  boxDetails: BoxDetail[];

}
