export interface IJobPostingStepOneFields {
  job_name: string;
  jobDuties: string;
  description: string;
  job_type: string;
}

export interface IJobPostingStepTwoFields {
  endDate: Date;
  startDate: Date;
  startShift: Date;
  Endshift: Date;
  location: string;
  city: string;
  address: string;
  postalCode: string;
}

export interface IJobPostingStepThreeFields {
  gender: string;
  salary: string;
  requiredEmployee: number;
  PaymentType: string;
  experience: number;
  required_certificates: string[];
}

export interface IJobPostInterface
  extends IJobPostingStepOneFields,
    IJobPostingStepTwoFields,
    IJobPostingStepThreeFields {}

export const getMinimumDateJobPost = (days: number) => {
  return new Date(new Date().setDate(new Date().getDate() + days));
};

export type IJobPostRef = {
  validate?: () => Promise<{
    fields: IJobPostingStepOneFields | null;
    isValid: boolean;
  }>;
};
