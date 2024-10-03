import {IJobPostInterface} from '@screens/clientScreens/jobPosting/types';
import {IJobPostStatus, IJobTypesEnum} from '@utils/enums';
import {IDoc} from '../user/types';

export type IClientSliceInitialState = {
  jobs: {
    open: IJobPostTypes[];
    closed: IJobPostTypes[];
    drafts: IJobPostTypes[];
  };
  candidateList: ICandidateListTypes[];
};

export type ICandidateListTypes = {
  details: {
    jobId: number;
    jobName: string;
    jobPoster: string | null;
    eventDate: Date;
    location: string;
  };
  open: Map<number, ICandidateTypes> | null;
  shortlisted: Map<number, ICandidateTypes> | null;
  denied: Map<number, ICandidateTypes> | null;
};

export interface IJobPostTypes {
  id: number;
  job_name: string;
  required_certificates: string[] | null;
  city: string;
  address: string;
  postalCode: string;
  postID?: number | null;
  gender: string;
  salary: string;
  notAccepting?: boolean;
  jobDuties: string;
  job_type: IJobTypesEnum;
  publishedAt: Date;
  applicants?: ICandidateListTypes | null | undefined;
  location: string;
  description: string;
  eventDate: Date;
  endShift: Date;
  requiredEmployee?: number;
  status: IJobPostStatus;
  startShift: Date;
  client_details: {
    id: number;
    Name: string;
    companyname: string;
    Industry: string;
    Email: string;
    location: string;
  };
}

export interface ICandidateTypes {
  id: number;
  applicationDate: Date;
  status: IJobPostStatus;
  jobId: number;
  jobLocation: string;
  employeeDetails: ICandidateListEmployeeDetailsTypes;
}

export interface ICandidateListEmployeeDetailsTypes {
  id: number;
  name: string;
  selfie: IDoc | null;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  resume: IDoc | null;
}

export type IGetCandidateListResponse = {
  data:
    | {
        id: number;
        applicationDate: Date;
        status: IJobPostStatus;
        jobs: {
          id: number;
          location: string;
        }[];
        employee_details: {
          id: number;
          name: string;
          dob: string;
          gender: string;
          email: string;
          phone: string;
          selfie: IDoc[] | null;
          resume: IDoc | null;
          certificates: IDoc[] | null;
        }[];
      }[]
    | null;
};

export interface IJobPostCustomizedResponse {
  data: IJobPostTypes[] | null;
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  } | null;
}

export type IPostedJobsResponse = {
  data: {
    id: number;
    job_name: string;
    required_certificates: string[] | null;
    city: string;
    address: string;
    postalCode: string;
    gender: string;
    eventDate: Date;
    salary: string;
    createdAt: Date;
    notAccepting: boolean;
    updatedAt: Date;
    status: IJobPostStatus;
    publishedAt: Date;
    jobDuties: string;
    job_type: IJobTypesEnum;
    location: string;
    requiredEmployee: number;
    startShift: Date;
    endShift: Date;
    description: string;
    client_details: {
      id: number;
      Name: string;
      companyname: string;
      Industry: string;
      Email: string;
      location: string;
    };
  }[];

  meta: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  } | null;
};

export type IDraftResponse = {
  data: {
    id: number;
    attributes: {
      job_name: string;
      required_certificates: string[] | null;
      city: string;
      address: string;
      postalCode: string;
      gender: string;
      eventDate: Date;
      salary: string;
      createdAt: Date;
      updatedAt: Date;
      publishedAt: Date;
      jobDuties: string;
      job_type: IJobTypesEnum;
      location: string;
      requiredEmployee: number;
      startShift: Date;
      endShift: Date;
      description: string;
    } | null;
  }[];

  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  } | null;
};

export type INewPostedJobResponse = {
  data: {
    id: 21;
    attributes: {
      job_name: string;
      required_certificates: string[] | null;
      city: string;
      address: string;
      postalCode: string;
      gender: string;
      eventDate: Date;
      salary: string;
      createdAt: Date;
      updatedAt: Date;
      publishedAt: Date;
      jobDuties: string;
      job_type: IJobTypesEnum;
      location: string;
      requiredEmployee: number;
      startShift: Date;
      endShift: Date;
      description: string;
    } | null;
  };
};

export type IPatchADraft = {
  data: IJobPostInterface;
};
