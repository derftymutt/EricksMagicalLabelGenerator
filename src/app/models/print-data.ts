import { Page } from './page';

export interface PrintData {
  pages: Page[];
  labelCount: number;
  metaData?: any;
}
