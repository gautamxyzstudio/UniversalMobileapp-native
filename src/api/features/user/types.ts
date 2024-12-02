import {
  IClientStatus,
  IDocumentNames,
  IEmployeeDocsApiKeys,
  IWorkStatus,
} from '@utils/enums';

export type IUserSliceInitialState = {
  user: IUser<'client' | 'emp'> | null;
  preferredLocations: string[];
  selectedFilters: string[];
  filtersDate: {
    startDate: string | null;
    endDate: string | null;
  };
  recentSearchesEmployee: string[];
  jobTypeFilter: 'event' | 'static' | null;
};

type UserDetailsMap = {
  client: IClientDetails | null;
  emp: IEmployeeDetails | null;
};

export interface IUser<T extends keyof UserDetailsMap> {
  id: number;
  email: string | null;
  token: string;
  user_type: 'emp' | 'client';
  details: UserDetailsMap[T] | null;
}

export interface IClientDetails {
  name: string | null;
  companyName: string | null;
  contactNo: string | null;
  industry: string;
  detailsId: number | null;
  location: string;
  status: IClientStatus;
  company: {
    id: number;
    companyname: string;
    companyemail: string;
    companylogo: IDoc | null;
  } | null;
}

export interface IEmployeeDetails {
  name: string | null;
  phone: string | null;
  selfie: IDoc | null;
  gender: string | null;
  sinNumber: string | null;
  workStatus: IWorkStatus;
  city: string | null;
  resume: IEmployeeDocument | null;
  address: string | null;
  detailsId: number | null;
  documents: IEmployeeDocumentsType | null;
  bankDetails: IEmployeeBankDetails | null;
}

export type IEmployeeDocumentsType = {
  primary: IEmployeeDocument[] | null;
  secondary: IEmployeeDocument[] | null;
  document_requests: IEmployeeDocument[] | null;
};

export interface IEmployeeDocument {
  docName: string;
  docStatus: IDocumentStatus;
  doc: IDoc | null;
  docId: number | null;
  apiKey?: IEmployeeDocsApiKeys;
}

export interface IEmployeeBankDetails {
  bankAccountNumber: string;
  transitNumber: string;
  institutionNumber: string;
  cheque: IEmployeeDocument;
}

//enums
export enum IDocumentStatus {
  PENDING = 's0',
  APPROVED = 's1',
  DENIED = 's2',
  UPDATE = 's3',
}

// requestsArgs and responses

export type IUpdateEmployeeDocumentsRequest = {
  data: {
    [key: string]: any;
    employee_details: number[];
  };
};

export type IRegisterUserArgs = {
  username: string;
  email: string;
  password: string;
  role: 'EmployeeUser' | 'ClientUser';
  user_type: 'emp' | 'client';
};

export type ILoginArgs = {
  identifier: string;
  password: string;
};

export type IRegisterUserResponse = {
  jwt: string;
  user:
    | {
        id: number;
        username: string;
        email: string;
        user_type: 'emp' | 'client';
      }
    | null
    | undefined;
};

export type ISendOtp = {
  email: string;
};

export type ISendOtpResponse = {
  message: string;
};

export type IVerifyOtp = {
  email: string;
  otp: string;
};
export type ICheckEmailVerificationStatus = {
  verified: boolean;
  message: string;
};

export type IGetUserResponse = {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  user_type: 'emp' | 'client';
  euser_id: null | IEmployeeDetailsApiResponse;
  cuser_id: null | IClientApiResponse;
};

export type IClientApiResponse = {
  id: number;
  Name: string;
  companyname: string;
  contactno: string;
  location: string;
  Industry: string;
  Email: string;
  status: IClientStatus;
  company_detail: {
    id: number;
    companyname: string;
    companyemail: string;
    companylogo: IDoc | null;
  } | null;
};

export type IVerifyOtpResponse = {
  approved: boolean;
  details: string[];
};

export type IUpdateClientDetailsRequest = {
  data: {
    Name: string;
    companyname: string;
    contactno: string;
    Industry: string;
    Email: string;
    location: string;
    jobs: [];
    clien_id: number;
    status: IClientStatus;
  };
};

export type IUpdateClientDetailsResponse = {
  data: {
    id: number;
    attributes: {
      Name: string;
      companyname: string;
      contactno: string;
      Industry: string;
      location: string;
      Email: string;
      status: IClientStatus;
    } | null;
  };
};

export type IUserDetailsRequest = {
  data: IUserDetailsRequestParams;
};

export type IUserDetailsRequestParams = {
  name?: string;
  selfie?: number[];
  dob?: Date;
  gender?: string;
  email?: string;
  phone?: string;
  city?: string;
  resume?: number | null;
  govtid?: number;
  address?: string;
  sinNo?: string;
  directDepositVoidCheque?: number;
  workStatus?: string;
  supportingDocument?: number;
  securityDocumentBasic?: number | null;
  Emp_id?: number;
  bankAcNo?: string;
  institutionNumber?: string;
  trasitNumber?: string;
  sinDocument?: number;
  securityDocBasicStatus?: IDocumentStatus;
  securityDocumentAdv?: number | null;
  securityDocumentAdvStatus?: IDocumentStatus;
  govtidStaus?: IDocumentStatus;
  directDepositVoidChequeStatus?: IDocumentStatus;
  sinDocumentStatus?: IDocumentStatus;
  job_applications?: number[];
};

export type IUserDetailsAndDocsInitialState = {
  currentStep: 1 | 2 | 3;
  data: IEmployeeDetails | null;
};

export type IDoc = {
  url: string | null;
  mime?: string;
  id: number;
  name: string;
  size?: number;
};

export interface IEmployeeDetailsApiResponse {
  name: string;
  selfie: IDoc[] | null;
  id?: number;
  dob: Date;
  gender: string;
  email: string;
  phone: string;
  city: string;
  resume?: IDoc;
  securityDocumentBasic: IDoc;
  securityDocumentAdv: IDoc;
  licencesExpiry?: IDoc;
  securityDocumentAdvStatus: IDocumentStatus;
  securityDocBasicStatus: IDocumentStatus;
  sinDocumentStatus: IDocumentStatus;
  directDepositVoidChequeStatus: IDocumentStatus;
  govtidStaus: IDocumentStatus;
  supportingDocumentStatus: IDocumentStatus;
  govtid?: IDoc;
  address: string;
  sinNo: string;
  directDepositVoidCheque?: IDoc;
  workStatus: IWorkStatus;
  supportingDocument?: IDoc;
  bankAcNo?: string;
  institutionNumber?: string;
  trasitNumber?: string;
  sinDocument?: IDoc;
  Docstatus: IDocumentStatus;
  other_documents: IOtherDocument[];
  document_requests: IDocumentRequests[];
}

export type IDocumentRequests = {
  id: number | null | undefined;
  DocName: IDocumentNames | null | undefined;
  status: IDocumentStatus | null | undefined;
  document: IDoc | null | undefined;
};

export type INewDocument = {
  id: number;
  status: IDocumentStatus;
  name: string;
  Document: IDoc;
};
export type IOtherDocument = {
  id: number;
  Docstatus: IDocumentStatus;
  name: string;
  Document: IDoc;
};

export type IUserSendOtpMobile = {
  phoneNumber: string;
};

export type IUserVerifyOtpMobile = {
  phoneNumber: string;
  code: string;
};

export type IUserVerifyOtpResponse = {
  valid: boolean;
};

export type IUpdateUserDetailsRequest = {
  data: {
    data: {
      [key: string]: any;
    };
    docId: number;
  };
};

export type ISubmitOtherDocumentsResponse = {
  data: ISubmittedOtherDocument[];
};

export type ISubmittedOtherDocument = {
  Docstatus: IDocumentStatus;
  Document: IDoc;
  id: number;
  name: string;
};

export type IPatchUserDetailsRequest = {
  data: {
    data: {
      [key: string]: any;
      Emp_id: number;
    };
  };
};

export type IEmployeeUploadOtherDocumentsRequest = {
  data: {
    name: string;
    Document: number;
    employee_detail: number;
    Docstatus: IDocumentStatus;
  }[];
};
export type IAddEmployeeDetailsResponse = {
  data: {
    id: number;
    attributes: {
      name: string;
      dob: Date;
      gender: string;
      email: string;
      phone: string;
      city: string;
      address: string;
      sinNo: string;
      workStatus: string;
      createdAt: Date;
      updatedAt: Date;
      publishedAt: Date;
      bankAcNo: string;
      institutionNumber: string;
      trasitNumber: string;
    };
  };
};

export type IAddEmployeeDetailsCustomizedResponse = {
  name: string;
  email: string;
  detailsId: number;
};
