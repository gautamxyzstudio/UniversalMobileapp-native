import {
  IDoc,
  IDocumentStatus,
  IEmployeeDetailsApiResponse,
  IEmployeeDocument,
} from '@api/features/user/types';
import moment from 'moment';
import {getImageUrl} from './constants';
import {STRINGS} from 'src/locales/english';
import {IEmployeeDocsApiKeys} from './enums';

export const minTwoDigits = (n: number) => {
  return (n < 10 ? '0' : '') + n;
};

export const capitalizeFirstLetter = (string: string | null) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return '';
};

export const capitalizeAndReturnFirstLetter = (name: string) => {
  let regex = /^[a-zA-Z]/;
  if (regex.test(name)) {
    return name.slice(0, 1).toUpperCase();
  } else {
    return null;
  }
};

export const dateFormatter = (date: Date) => {
  const UtcDate = moment(date);
  return UtcDate.format('DD-MM-YYYY');
};
export const dateFormatterRev = (date: Date) => {
  const UtcDate = moment(date);
  return UtcDate.format('YYYY-MM-DD');
};

export const timeFormatter = (date: Date) => {
  const UtcDate = moment(date);
  return UtcDate.format('hh:mm A');
};

export const jobRangeFormatter = (date: Date) => {
  const UtcDate = moment(date);
  return UtcDate.format('DD MMM YYYY');
};

export const fromNowOn = (date: Date) => {
  // Parse the input date string
  const parsedDate = moment(date, 'YYYY-MM-DD');

  // Format the date to extract the day and month
  return parsedDate.format('D MMMM'); // This will return "8 May" or similar
};

export const formatDateFromNow = (date: string | Date) => {
  return moment(date).fromNow();
};

export const monthYearGetter = (date?: string) => {
  if (date) {
    return moment(date).format('MMMM YYYY');
  } else {
    return moment(new Date()).format('MMMM YYYY');
  }
};

export const getJobStartAndEndTime = (
  startTime: Date | null,
  endTime: Date | null,
) => {
  if (startTime && endTime) {
    const formattedStartTime = timeFormatter(startTime);
    const formattedEndTime = timeFormatter(endTime);
    return `${formattedStartTime} - ${formattedEndTime}`;
  } else {
    return '';
  }
};

export const convertBytesToMB = (bytes: number) => {
  const mb = (bytes / (1024 * 1024)).toFixed(2);
  return `${mb} MB`;
};

export const getHistoryStartDate = () => {
  const startDate = new Date(new Date().getFullYear() - 1, 0, 1);

  return startDate;
};

export const getHistoryEndDate = () => {
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + 1);
  return endDate;
};

export const dateFormatterToMonthDate = (
  startDateStr: string | null,
  endDateStr: string | null,
) => {
  if (startDateStr && endDateStr) {
    const startDate = moment(startDateStr, 'YYYY-MM-DD');
    const endDate = moment(endDateStr, 'YYYY-MM-DD');

    let formattedRange;
    if (startDate.isSame(endDate, 'month')) {
      formattedRange = `${startDate.format('MMM D')} - ${endDate.format('D')}`;
    } else {
      formattedRange = `${startDate.format('MMM D')} - ${endDate.format(
        'MMM D',
      )}`;
    }
    return formattedRange;
  } else {
    return null;
  }
};

export const getFileExtension = (
  fileName: string | undefined,
): string | 'pdf' | 'docx' | undefined => {
  if (fileName) {
    const parts = fileName.split('.');
    return parts.length > 1 ? parts.pop()!.toLowerCase() : '';
  }
  return undefined;
};

export const extractEmployeeSecondaryDocumentsFromApiResponse = (
  response: IEmployeeDetailsApiResponse,
) => {
  const documents: IEmployeeDocument[] = [];
  response.other_documents.forEach(doc => {
    const docName = doc.name;
    const docStatus = doc.status;
    const docs = doc.Document;
    if (docs) {
      documents.push({
        docName,
        docStatus,
        doc: {
          url: getImageUrl(docs?.url),
          id: doc.id,
          name: doc.name,
          mime: docs.mime,
          size: docs.size,
        },
        docId: doc.id,
      });
    }
  });
  return documents;
};

export const extractEmployeeDocumentsFromApiResponse = (
  response: IEmployeeDetailsApiResponse,
): IEmployeeDocument[] | [] => {
  //to merge doc details into one
  const addDocument = (
    document:
      | {name: string; doc: IDoc; id: number; key: IEmployeeDocsApiKeys}
      | undefined,
    status: IDocumentStatus | undefined,
  ): IEmployeeDocument | null => {
    return document && status
      ? {
          docName: document.name,
          docStatus: status,
          doc: {
            url: getImageUrl(document.doc.url),
            id: document.doc.id,
            name: document.doc.name,
            mime: document.doc.mime,
            size: document.doc.size,
          },
          docId: document.id,
          apiKey: document.key,
        }
      : null;
  };
  const documents: IEmployeeDocument[] = [];
  const employeeDetails = response;
  if (employeeDetails.sinDocument) {
    const sinDocument = addDocument(
      {
        name: STRINGS.sinDocument,
        id: employeeDetails.sinDocument.id,
        doc: {
          mime: employeeDetails.sinDocument.mime,
          url: employeeDetails.sinDocument.url,
          size: employeeDetails.sinDocument.size,
          id: employeeDetails.sinDocument.id,
          name: employeeDetails.sinDocument.name,
        },
        key: IEmployeeDocsApiKeys.SIN_DOCUMENT,
      },
      employeeDetails.sinDocumentStatus,
    );
    sinDocument && documents.push(sinDocument);
  }
  if (employeeDetails.govtid) {
    const govtID = addDocument(
      {
        name: STRINGS.Govt_ID,
        id: employeeDetails.govtid.id,
        doc: {
          mime: employeeDetails.govtid.mime,
          url: employeeDetails.govtid.url,
          size: employeeDetails.govtid.size,
          id: employeeDetails.govtid.id,
          name: employeeDetails.govtid.name,
        },
        key: IEmployeeDocsApiKeys.GOVT_ID,
      },
      employeeDetails.govtidStaus,
    );
    govtID && documents.push(govtID);
  }
  if (employeeDetails.supportingDocument) {
    const supportingDocument = addDocument(
      {
        name: STRINGS.document,
        id: employeeDetails.supportingDocument.id,
        doc: {
          mime: employeeDetails.supportingDocument.mime,
          url: employeeDetails.supportingDocument.url,
          size: employeeDetails.supportingDocument.size,
          id: employeeDetails.supportingDocument.id,
          name: employeeDetails.supportingDocument.name,
        },
        key: IEmployeeDocsApiKeys.SUPPORTING_DOCUMENT,
      },
      employeeDetails.supportingDocumentStatus,
    );
    supportingDocument && documents.push(supportingDocument);
  }

  if (employeeDetails.securityDocumentAdv) {
    const securityDocumentAdv = addDocument(
      {
        name: STRINGS.license_advance,
        id: employeeDetails.securityDocumentAdv.id,
        doc: {
          mime: employeeDetails.securityDocumentAdv.mime,
          url: employeeDetails.securityDocumentAdv.url,
          size: employeeDetails.securityDocumentAdv.size,
          id: employeeDetails.securityDocumentAdv.id,
          name: employeeDetails.securityDocumentAdv.name,
        },
        key: IEmployeeDocsApiKeys.LICENSE_ADVANCE,
      },
      employeeDetails.securityDocumentAdvStatus,
    );
    securityDocumentAdv && documents.push(securityDocumentAdv);
  }
  if (employeeDetails.securityDocumentBasic) {
    const securityDocumentBasic = addDocument(
      {
        name: STRINGS.license_basic,
        id: employeeDetails.securityDocumentBasic.id,
        doc: {
          mime: employeeDetails.securityDocumentBasic.mime,
          url: employeeDetails.securityDocumentBasic.url,
          size: employeeDetails.securityDocumentBasic.size,
          id: employeeDetails.securityDocumentBasic.id,
          name: employeeDetails.securityDocumentBasic.name,
        },
        key: IEmployeeDocsApiKeys.LICENSE_BASIC,
      },
      employeeDetails.securityDocBasicStatus,
    );
    securityDocumentBasic && documents.push(securityDocumentBasic);
  }

  return documents;
};

export const salaryFormatter = (salary: string) => `$ ${salary}/hr`;
