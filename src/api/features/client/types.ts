import {IJobTypesEnum, IPayDuration} from '@utils/enums';

export type IClientSliceInitialState = {
  jobs: {
    open: IJobPostTypes[];
    closed: IJobPostTypes[];
    drafts: IJobPostTypes[];
  };
};

export interface IJobPostTypes {
  id?: number;
  job_name?: string;
  city: string;
  required_certificates: string[] | null;
  postedBy: string;
  jobDuties: JSON | undefined;
  job_type: IJobTypesEnum;
  status: number;
  location: string;
  requiredEmployee: number;
  startShift: Date;
  Endshift: Date;
  description: JSON | undefined;
  gender: string;
  experience?: number | null;
  eventDate: Date;
  publishedAt: Date;
  salary: string;
  address: string;
  postalCode: string;
}

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
      jobDuties: JSON;
      job_type: IJobTypesEnum;
      location: string;
      requiredEmployee: number;
      startShift: Date;
      Endshift: Date;
      description: JSON;
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
