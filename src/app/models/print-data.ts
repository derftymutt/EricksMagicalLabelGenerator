import { Page } from './page';
import { PrintMetaData } from './print-meta-data';

export interface PrintData {
  pages: Page[];
  metaData: PrintMetaData;
}
