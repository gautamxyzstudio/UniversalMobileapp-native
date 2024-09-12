import {IJobPostStatus, IJobTypesEnum} from '@utils/enums';

export type IEmployeeSliceInitialState = {
  jobs: IJobTypes[];
};

export type IJobTypes = {
  id: number;
  job_name: string;
  required_certificates: string[];
  city: string;
  state: string;
  address: string;
  postalCode: string;
  postID: number | null;
  gender: string;
  salary: string;
  jobDuties: string;
  job_type: IJobTypesEnum;
  publishedAt: Date;
  location: string;
  description: string;
  eventDate: Date;
  endShift: Date;
  startShift: Date;
  client_details: {
    id: number;
    Name: string;
    companyname: string;
    Industry: string;
    Email: string;
    location: string;
  };
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

export type IGetJobsResponse = {
  data: {
    id: number;
    attributes: {
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
    };
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
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
};
