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

export const getJobsEmployeeUrl = (
  pageNumber: number,
  event_type: null | 'static' | 'event',
  startDate: null | string,
  endDate: null | string,
  location: null | string,
) => {
  const baseUrl = `${process.env.BASE_URL}/api/Jobs`;
  const queryParams = new URLSearchParams();

  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  if (event_type) queryParams.append('job_type', event_type);
  if (location) queryParams.append('city', location);

  // Add fixed parameters
  queryParams.append('sort', 'createdAt:desc');
  queryParams.append('[page]', pageNumber.toString());
  queryParams.append('[pageSize]', '10');

  return `${baseUrl}?${queryParams.toString()}`;
};
