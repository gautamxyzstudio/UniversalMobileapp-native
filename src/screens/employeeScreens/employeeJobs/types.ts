export enum IJobStatus {
  APPLIED = 1,
  IN_PROGRESS = 2,
  DECLINED = 3,
  CANCELED = 4,
  CONFIRMED = 5,
  COMPLETED = 6,
}

export const getJobStatus = (status: IJobStatus) => {
  switch (status) {
    case IJobStatus.APPLIED:
      return 'Applied';
    case IJobStatus.IN_PROGRESS:
      return 'In Progress';
    case IJobStatus.DECLINED:
      return 'Declined';
    case IJobStatus.CANCELED:
      return 'Canceled';
    case IJobStatus.CONFIRMED:
      return 'Confirmed';
    case IJobStatus.COMPLETED:
      return 'Completed';
    default:
      return 'Applied';
  }
};
