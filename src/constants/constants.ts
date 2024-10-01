import {IJobPostStatus} from '@utils/enums';
import {STRINGS} from 'src/locales/english';

export const touchSlope = {
  top: 10,
  bottom: 10,
  let: 10,
  right: 10,
};

export type IJobFilters = {
  id: number;
  name: string;
  status: IJobPostStatus | null;
};

export const jobFilters: IJobFilters[] = [
  {
    id: 1,
    name: STRINGS.all,
    status: null,
  },
  {
    id: 2,
    name: STRINGS.applied,
    status: IJobPostStatus.APPLIED,
  },
  {
    id: 3,
    name: STRINGS.confirmed,
    status: IJobPostStatus.CONFIRMED,
  },
  {
    id: 4,
    name: STRINGS.completed,
    status: IJobPostStatus.COMPLETED,
  },
  {
    id: 5,
    name: STRINGS.declined,
    status: IJobPostStatus.DECLINED,
  },
];
