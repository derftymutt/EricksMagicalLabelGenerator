import { LabelsPerPageType } from './labels-per-page-type';

export interface PrintMetaData {
  labelCount: number;
  labelsPerPage: LabelsPerPageType;
  isCartonCountOnTop: boolean;
  isFromFirst: boolean;
  isShowFromAddress: boolean;
  isSmallFont: boolean;
}
