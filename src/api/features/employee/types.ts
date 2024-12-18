import {IJobPostStatus, IJobTypesEnum} from '@utils/enums';

export type IEmployeeSliceInitialState = {
  jobs: IJobTypes[];
  myJobs: IJobTypes[];
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

export type IGetAppliedJobsResponse = {
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
