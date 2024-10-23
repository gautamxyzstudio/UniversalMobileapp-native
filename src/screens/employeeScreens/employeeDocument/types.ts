import {IDocumentNames, IEmployeeDocsApiKeys} from '@utils/enums';
import {STRINGS} from 'src/locales/english';

export const getDocNameCodeThroughName = (
  docName: IEmployeeDocsApiKeys,
): {
  name: string;
  key: IDocumentNames;
} => {
  switch (docName) {
    case IEmployeeDocsApiKeys.GOVT_ID:
      return {
        name: STRINGS.Govt_ID,
        key: IDocumentNames.GOVT_ID,
      };
    case IEmployeeDocsApiKeys.SIN_DOCUMENT:
      return {
        name: STRINGS.sinDocument,
        key: IDocumentNames.SIN_DOCUMENT,
      };
    case IEmployeeDocsApiKeys.SUPPORTING_DOCUMENT:
      return {
        name: STRINGS.document,
        key: IDocumentNames.SUPPORTING_DOCUMENT,
      };
    case IEmployeeDocsApiKeys.LICENSE_BASIC:
      return {
        name: STRINGS.license_basic,
        key: IDocumentNames.SECURITY_DOCUMENT_BASIC,
      };
    case IEmployeeDocsApiKeys.LICENSE_ADVANCE:
      return {
        name: STRINGS.license_advance,
        key: IDocumentNames.SECURITY_DOCUMENT_ADV,
      };
    default:
      return {
        name: STRINGS.sinDocument,
        key: IDocumentNames.SIN_DOCUMENT,
      };
  }
};
