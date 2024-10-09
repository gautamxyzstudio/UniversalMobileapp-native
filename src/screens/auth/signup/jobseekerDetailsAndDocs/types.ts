import {IDocumentStatus} from '@api/features/user/types';

export type IOtherDocRequest = {
  name: string;
  Document: number;
  employee_detail: number;
  Docstatus: IDocumentStatus;
};
