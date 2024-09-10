export type CardType = 'employee' | 'client';

export interface IEmployeeTypes {
  id: number;
  banner: string;
  rating: number;
  title: string;
  industry: string;
}

export interface INotification {
  title: string;
  icon: string;
  highlightText: string;
  isRead: boolean;
  time: string;
  id: number;
}

export interface IErrorResponse {
  status: number | string;
  data: {
    data: null;
    error: {
      status: number;
      name: string;
      message: string;
      details: {};
    };
  };
}

export interface ICustomErrorResponse {
  message: string;
  statusCode: number | string;
}

export interface ICompanyDetails {
  name: string;
  contactNumber: string;
  companyEmail: string;
  address: string;
  location: string;
  industry: string;
  poster: string;
}
