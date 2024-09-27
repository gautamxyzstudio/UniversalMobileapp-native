import {IJobPostStatus} from '@utils/enums';

export enum IJobStatus {
  APPLIED = 1,
  IN_PROGRESS = 2,
  DECLINED = 3,
  CANCELED = 4,
  CONFIRMED = 5,
  COMPLETED = 6,
}

export const getJobStatus = (status: IJobPostStatus) => {
  switch (status) {
    case IJobPostStatus.APPLIED:
      return 'Applied';
    case IJobPostStatus.DECLINED:
      return 'Declined';
    case IJobPostStatus.CANCELED:
      return 'Canceled';
    case IJobPostStatus.CONFIRMED:
      return 'Confirmed';
    case IJobPostStatus.COMPLETED:
      return 'Completed';
    default:
      return 'Applied';
  }
};

export const getEventStatus = (status: IJobPostStatus) => {
  switch (status) {
    case IJobPostStatus.OPEN:
      return 'Applied';
    case IJobPostStatus.CLOSED:
      return 'Completed';
    case IJobPostStatus.CANCELED:
      return 'Canceled';
    default:
      return 'Applied';
  }
};
