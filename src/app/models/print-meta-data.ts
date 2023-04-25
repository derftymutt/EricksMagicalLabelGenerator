import { LabelsPerPageType } from './labels-per-page-type';

export interface PrintMetaData {
  labelCount: number;
  labelsPerPage: LabelsPerPageType;
  isCartonCountOnTop: boolean;
  isFromFirst: boolean;
  isShowFromVernonAddress: boolean;
  isShowFromSanDiegoAddress: boolean;
  isSmallFont: boolean;
  isVariety: boolean;
}
