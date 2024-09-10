import {IFile} from '@components/organisms/uploadPopup/types';
import {STRINGS} from 'src/locales/english';

export type jobSeekerDetailsStepThreeState = {
  govtId: number | null;
  document: number | null;
  resume?: number | null;
  other?: number[] | null;
  licenseAdvanced?: number | null;
  licenseBasic?: number | null;
  govtIdError: string;
  documentError: string;
};

export type PredefinedCertificates = {
  name: string;
  value: IFile | null;
  id: number;
  isCustom?: boolean;
};

export const predefinedCertificatesAndLicenses: PredefinedCertificates[] = [
  {
    id: 1,
    name: STRINGS.advance,
    value: null,
  },
  {
    id: 2,
    name: STRINGS.basic,
    value: null,
  },
];
export type userDocuments = {
  govtid: number;
  other_documents: number[];
  resume: number | null;
  securityDocumentAdv: number | null;
  securityDocumentBasic: number | null;
  supportingDocument: number;
};

export type jobSeekerThirdRef = {
  validate?: () => Promise<{
    fields: userDocuments;
    isValid: boolean;
    otherDocs: IOtherDocSpecifications;
  }>;
};

export type IOtherDocSpecifications = {
  docId: number;
  name: string;
};
