import {
  IDocumentStatus,
  IEmployeeDetailsApiResponse,
  IEmployeeDocument,
  IOtherDocument,
} from '@api/features/user/types';
import moment from 'moment';
import {getImageUrl} from './constants';
import {STRINGS} from 'src/locales/english';
import {IDocumentNames} from './enums';

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
export const dateFormatterRev = (date: Date | null) => {
  if (!date) {
    return null;
  }
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

export const timeToLocalString = (date: Date | null) => {
  if (date) {
    let newDate = new Date(date);
    return newDate?.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else {
    return '';
  }
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

export const getTitleWithoutSpaces = (title: string) => {
  return title.replace(/\s+/g, '').trim();
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

export const getDocumentNameFromCode = (code: IDocumentNames) => {
  switch (code) {
    case IDocumentNames.SIN_DOCUMENT:
      return STRINGS.sinDocument;
    case IDocumentNames.DIRECT_DEPOSIT_VOID_CHEQUE:
      return STRINGS.directDeposit;
    case IDocumentNames.GOVT_ID:
      return STRINGS.Govt_ID;
    case IDocumentNames.SUPPORTING_DOCUMENT:
      return STRINGS.document;
    case IDocumentNames.SECURITY_DOCUMENT_ADV:
      return STRINGS.license_advance;
    case IDocumentNames.SECURITY_DOCUMENT_BASIC:
      return STRINGS.license_basic;
    default:
      return STRINGS.sinDocument;
  }
};

export const formatDocument = (response: IOtherDocument): IEmployeeDocument => {
  const docName = response.name;
  const docStatus = response.Docstatus;
  const docs = response.Document;
  return {
    docName,
    docStatus,
    doc: {
      url: getImageUrl(docs?.url) ?? '',
      id: docs?.id ?? 0,
      name: docs.name ?? '',
      mime: docs.mime ?? '',
      size: docs.size ?? 0,
    },
    docId: response.id ?? 0,
  };
};

export const extractDocumentRequestFromApiResponse = (
  response: IEmployeeDetailsApiResponse,
) => {
  const documents: IEmployeeDocument[] = [];
  response.document_requests.forEach(doc => {
    if (doc) {
      const docName = doc.name ?? '';
      const docStatus = doc?.status ?? IDocumentStatus.PENDING;
      const docs = doc.document;
      if (docs) {
        documents.push({
          docName,
          docStatus,
          doc: {
            url: getImageUrl(docs?.url),
            id: doc?.id ?? 0,
            name: docs?.name ?? '',
            mime: docs?.mime ?? '',
            size: docs?.size ?? 0,
          },
          docId: docs.id ?? 0,
        });
      }
    }
  });
  return documents;
};

export const salaryFormatter = (salary: string) => `$ ${salary}/hr`;
