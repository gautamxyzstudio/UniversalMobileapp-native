import {IDocumentNames, IJobPostStatus, IJobTypesEnum} from '@utils/enums';
import {IDocumentStatus} from '../user/types';

export type IEmployeeSliceInitialState = {
  jobs: IJobTypes[];
  myJobs: IJobTypes[];
};

export type ICustomJobPostTypesResponse = {
  data: IJobTypes[];
  pagination: IPagination | null;
};

export type IJobTypes = {
  id: number;
  job_name: string;
  required_certificates: string[] | null;
  city: string;
  address: string;
  postalCode: string;
  postID?: number | null;
  gender: string;
  salary: string;
  jobDuties: string;
  job_type: IJobTypesEnum;
  publishedAt: Date;
  location: string;
  description: string;
  eventDate: Date;
  endShift: Date;
  requiredEmployee?: number;
  startShift: Date;
  status: IJobPostStatus;
  client_details: {
    id: number;
    Name: string;
    companyname: string;
    Industry: string;
    Email: string;
    location: string;
  };
  job_applications?: {
    id: number;
    status: IJobPostStatus;
    employee_details: {
      id: number;
    }[];
  }[];
};

export type ICustomizedJobsResponse = {
  data: IJobTypes[];
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
};

export type IGetClientScheduleResponse = {
  data: {
    id: number;
    job_name: string;
    required_certificates: [];
    city: string;
    state: null;
    address: string;
    postalCode: string;
    postID: null;
    gender: string;
    salary: string;
    Event: null;
    createdAt: Date;
    updatedAt: Date;
    job_type: IJobTypesEnum;
    publishedAt: Date;
    location: string;
    description: string;
    eventDate: Date;
    requiredEmployee?: number;
    startShift: Date;
    status: IJobPostStatus;
    endShift: Date;
    notAccepting: true;
    client_details: {
      id: number;
      Name: string;
      companyname: string;
      Industry: string;
      Email: string;
      location: string;
    }[];
  }[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};

export type IApplyForJobRequest = {
  data: {
    applicationDate: Date;
    status: IJobPostStatus;
    employee_details: number;
    jobs: number;
  };
};

export type IPagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

export type IGetAppliedJobsResponse = {
  data: {
    id: number;
    status: IJobPostStatus;
    jobs: {
      job_name: string;
      required_certificates: string[];
      city: string;
      state: string;
      address: string;
      postalCode: string;
      postID: number | null;
      gender: string;
      salary: string;
      Event: string | null;
      createdAt: Date;
      updatedAt: Date;
      publishedAt: Date;
      jobDuties: string;
      job_type: IJobTypesEnum;
      location: string;
      description: string;
      delete: boolean;
      status: IJobPostStatus;
      eventDate: Date;
      endShift: Date;
      startShift: Date;
      client_details: {
        id: number;
        Name: string;
        companyname: string;
        contactno: string;
        Industry: string;
        Email: string;
        location: string;
      }[];
    }[];
  }[];
  pagination: IPagination;
};
export type IGetScheduledJobs = {
  id: number;
  status: IJobPostStatus;
  jobs: {
    job_name: string;
    required_certificates: string[];
    city: string;
    state: string;
    address: string;
    postalCode: string;
    postID: number | null;
    gender: string;
    salary: string;
    Event: string | null;
    createdAt: Date;
    updatedAt: Date;
    publishedAt: Date;
    jobDuties: string;
    job_type: IJobTypesEnum;
    location: string;
    description: string;
    delete: boolean;
    status: IJobPostStatus;
    eventDate: Date;
    endShift: Date;
    startShift: Date;
    client_details: {
      id: number;
      Name: string;
      companyname: string;
      contactno: string;
      Industry: string;
      Email: string;
      location: string;
    }[];
  }[];
}[];

export type IGetJobPostResponse = {
  data: {
    Event: null;
    address: string;
    city: string;
    client_details: {
      id: number;
      Name: string;
      companyname: string;
      Industry: string;
      Email: string;
      location: string;
    }[];
    createdAt: Date;
    delete: null;
    description: string;
    endShift: Date;
    eventDate: Date;
    gender: string;
    id: number;
    jobDuties: string;
    job_applications: {
      id: number;
      status: IJobPostStatus;
      employee_details: {
        id: number;
      }[];
    }[];
    job_name: string;
    job_type: IJobTypesEnum;
    location: string;
    notAccepting: boolean;
    postID: null;
    postalCode: string;
    publishedAt: Date;
    requiredEmployee: number;
    required_certificates: string[];
    salary: string;
    startShift: Date;
    state: null;
    status: IJobPostStatus;
    updatedAt: Date;
  }[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type IUpdateEmployeePrimaryDocumentRequest = {
  data: {
    document: number;
    DocName: IDocumentNames;
    status: IDocumentStatus;
    employee_detail: number;
  };
};
