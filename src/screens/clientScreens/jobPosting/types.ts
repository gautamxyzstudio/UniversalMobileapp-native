import {IJobPostStatus} from '@utils/enums';

export interface IJobPostingStepOneFields {
  job_name: string;
  jobDuties: string;
  description: string;
  job_type: string;
}

export interface IJobPostingStepTwoFields {
  eventDate: Date;
  startShift: Date;
  endShift: Date;
  location: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface IJobPostingStepThreeFields {
  gender: string;
  salary: string;
  requiredEmployee: number;
  required_certificates: string[];
}

export interface IJobPostInterface
  extends IJobPostingStepOneFields,
    IJobPostingStepTwoFields,
    IJobPostingStepThreeFields {
  client_details: number;
  status: IJobPostStatus;
}

export const getMinimumDateJobPost = (days: number) => {
  return new Date(new Date().setDate(new Date().getDate() + days));
};

export type IJobPostRef = {
  validate?: () => Promise<{
    fields: IJobPostingStepOneFields | null;
    isValid: boolean;
  }>;
};
