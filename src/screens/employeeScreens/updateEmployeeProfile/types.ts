import {IDoc} from '@api/features/user/types';
import {IWorkStatus} from '@utils/enums';

export type updateEmployeeProfileProfile = {
  name: string;
  nameError: string;
  email: string;
  emailError: string;
  selfie: number[] | IDoc | null;
  phone: string;
  phoneError: string;
  address: string;
  addressError: string;
  city: string;
  cityError: string;
  workStatus: IWorkStatus;
  gender: string;
};

export type IDefaultValues = {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  gender?: string;
  selfie: number[] | IDoc | null;
  city?: string;
  workStatus?: string;
};
