import {STRINGS} from 'src/locales/english';

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
  if (startDate && endDate && event_type && location) {
    return `${
      process.env.BASE_URL
    }/api/Jobs?startDate=${startDate}&endDate=${endDate}&job_type=${event_type}&city=${location}&sort=createdAt:desc&[page]=${
      pageNumber ?? 1
    }&[pageSize]=10`;
  } else if (startDate && endDate && event_type) {
    return `${
      process.env.BASE_URL
    }/api/Jobs?startDate=${startDate}&endDate=${endDate}&job_type=${event_type}&sort=createdAt:desc&[page]=${
      pageNumber ?? 1
    }&[pageSize]=10`;
  } else if (startDate && endDate && location) {
    return `${
      process.env.BASE_URL
    }/api/Jobs?startDate=${startDate}&endDate=${endDate}&city=${location}&sort=createdAt:desc&[page]=${
      pageNumber ?? 1
    }&[pageSize]=10`;
  } else if (event_type && location) {
    return `${process.env.BASE_URL}/api/Jobs?job_type=${event_type}&city=${location}&sort=createdAt:desc&[page]=${pageNumber}&[pageSize]=10`;
  } else if (startDate && endDate) {
    return `${
      process.env.BASE_URL
    }/api/Jobs?startDate=${startDate}&endDate=${endDate}&sort=createdAt:desc&[page]=${
      pageNumber ?? 1
    }&[pageSize]=10`;
  } else if (event_type) {
    return `${process.env.BASE_URL}/api/jobs?job_type=${event_type}&sort=createdAt:desc&[page]=${pageNumber}&[pageSize]=10`;
  } else if (location) {
    return `${process.env.BASE_URL}/api/jobs?city=${location}&sort=createdAt:desc&[page]=${pageNumber}&[pageSize]=10`;
  } else {
    return `${process.env.BASE_URL}/api/jobs?sort=createdAt:desc&[page]=${pageNumber}&[pageSize]=10`;
  }
};
export const getJobsEmployeeSearchUrl = (
  character: string,
  page: number,
  pageSize: number,
  event_type: null | 'static' | 'event',
  startDate: null | string,
  endDate: null | string,
  location: null | string,
) => {
  if (startDate && endDate && event_type && location) {
    return `${
      process.env.BASE_URL
    }/api/Jobs?search=${character}&startDate=${startDate}&endDate=${endDate}&job_type=${event_type}&city=${location}&sort=createdAt:desc&[page]=${
      page ?? 1
    }&[pageSize]=10`;
  } else if (startDate && endDate && event_type) {
    return `${
      process.env.BASE_URL
    }/api/Jobs?search=${character}&startDate=${startDate}&endDate=${endDate}&job_type=${event_type}&sort=createdAt:desc&[page]=${
      page ?? 1
    }&[pageSize]=10`;
  } else if (startDate && endDate && location) {
    return `${
      process.env.BASE_URL
    }/api/Jobs?search=${character}&startDate=${startDate}&endDate=${endDate}&city=${location}&sort=createdAt:desc&[page]=${
      page ?? 1
    }&[pageSize]=10`;
  } else if (event_type && location) {
    return `${process.env.BASE_URL}/api/Jobs?search=${character}&job_type=${event_type}&city=${location}&sort=createdAt:desc&[page]=${page}&[pageSize]=10`;
  } else if (startDate && endDate) {
    return `${
      process.env.BASE_URL
    }/api/Jobs?search=${character}&startDate=${startDate}&endDate=${endDate}&sort=createdAt:desc&[page]=${
      page ?? 1
    }&[pageSize]=10`;
  } else if (event_type) {
    return `${process.env.BASE_URL}/api/jobs?search=${character}&job_type=${event_type}&sort=createdAt:desc&[page]=${page}&[pageSize]=10`;
  } else if (location) {
    return `${process.env.BASE_URL}/api/jobs?search=${character}&city=${location}&sort=createdAt:desc&[page]=${page}&[pageSize]=10`;
  } else {
    return `${process.env.BASE_URL}/api/jobs?search=${character}&[page]=${page}&[pageSize]=10`;
  }
};

export const transformErrorResponse = (
  response: IErrorResponse,
): ICustomErrorResponse => {
  return {
    message: response?.data?.error?.message ?? STRINGS.something_went_wrong,
    statusCode: response?.status ?? 0,
  };
};
