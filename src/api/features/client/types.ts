import {IJobTypesEnum, IPayDuration} from '@utils/enums';

export interface IJobPostTypes {
  id?: number;
  job_name?: string;
  city: string;
  required_certificates: string[] | null;
  postedBy: string;
  jobDuties: JSON;
  job_type: IJobTypesEnum;
  status: number;
  location: string;
  requiredEmployee: number;
  PaymentType: IPayDuration;
  startShift: Date;
  Endshift: Date;
  description: JSON;
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
      experience: number | null;
      gender: string;
      startDate: Date;
      endDate: Date;
      salary: string;
      createdAt: Date;
      updatedAt: Date;
      publishedAt: Date;
      jobDuties: JSON;
      job_type: IJobTypesEnum;
      location: string;
      requiredEmployee: number;
      PaymentType: IPayDuration;
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
