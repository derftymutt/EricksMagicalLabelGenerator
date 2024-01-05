import { LabelsPerPageType } from './labels-per-page-type';

export interface PrintMetaData {
  labelCount: number;
  labelsPerPage: LabelsPerPageType;
  isCartonCountOnTop: boolean;
  isFromFirst: boolean;
  isShowFromVernonAddress: boolean; // TODO: remove
  isShowFromSanDiegoAddress: boolean; // TODO: remove
  isSmallFont: boolean;
  isVariety: boolean;
  companyName: string;
}
