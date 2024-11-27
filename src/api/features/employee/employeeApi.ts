import {apiMethodType} from '@api/apiConstants';
import {baseApi} from '@api/baseApi';
import {apiEndPoints} from '@api/endpoints';
import {
  IApplyForJobRequest,
  IClientDetailsResponse,
  ICompany,
  ICustomizedJobsResponse,
  ICustomJobPostTypesResponse,
  IGetAppliedJobsResponse,
  IGetJobPostResponse,
  IGetScheduledJobResponse,
  IJobTypes,
  IUpdateEmployeePrimaryDocumentRequest,
} from './types';
import {IErrorResponse, ICustomErrorResponse} from '@api/types';
import {STRINGS} from 'src/locales/english';
import {IJobPostStatus} from '@utils/enums';
import {getImageUrl} from '@utils/constants';
import {IDoc} from '../user/types';

const employeeApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    fetchJobs: builder.query<
      any,
      {
        pageNumber: number;
        event: 'event' | 'static' | null;
        startDate: string | null;
        endDate: string | null;
        location: string | null;
      }
    >({
      query: (body: {
        pageNumber: number;
        event: 'event' | 'static' | null;
        startDate: string | null;
        endDate: string | null;
        location: string | null;
      }) => ({
        url: apiEndPoints.getJobsEmployee(
          body.pageNumber,
          body.event,
          body.startDate,
          body.endDate,
          body.location,
        ),
        method: apiMethodType.get,
      }),
      transformResponse: (
        response: IGetJobPostResponse,
      ): ICustomizedJobsResponse => {
        let customizedJobs: IJobTypes[] = [];
        response.data.forEach(job => {
          if (
            job.status !== IJobPostStatus.CLOSED &&
            job.notAccepting !== true
          ) {
            let details: IJobTypes = {
              job_name: job.job_name,
              endShift: job.endShift,
              publishedAt: job.publishedAt,
              location: job.location,
              id: job.id,
              job_applications: job.job_applications,
              requiredEmployee: job.requiredEmployee,
              job_type: job.job_type,
              jobDuties: job.jobDuties,
              description: job.description,
              eventDate: job.eventDate,
              startShift: job.startShift,
              city: job.city,
              status: job.status,
              address: job.address,
              postalCode: job.postalCode,
              gender: job.gender,
              salary: job.salary,
              company: getCompanyFromClientDetails(job.client_details[0]),
              required_certificates: job.required_certificates,
              postID: job.postID,
              client_details: null,
            };
            customizedJobs.push(details);
          }
        });
        return {
          data: customizedJobs,
          pagination: response?.meta && {
            page: response?.meta?.page ?? 1,
            pageSize: response?.meta?.pageSize ?? 1,
            pageCount: response?.meta?.totalPages ?? 1,
            total: response?.meta?.totalPages ?? 1,
          },
        };
      },
      transformErrorResponse: (
        response: IErrorResponse,
      ): ICustomErrorResponse => {
        return {
          statusCode: response.status,
          message: response.data.error?.message ?? STRINGS.someting_went_wrong,
        };
      },
    }),
    applyForJob: builder.mutation<any, IApplyForJobRequest>({
      query: body => ({
        url: apiEndPoints.applyForJob,
        method: apiMethodType.post,
        body,
      }),
    }),
    fetchAppliedJobs: builder.query<
      ICustomJobPostTypesResponse,
      {id: number; type: IJobPostStatus | null; page: number}
    >({
      query: ({id, type, page}) => ({
        url: apiEndPoints.getAppliedJobs(id, type, page),
        method: apiMethodType.get,
      }),
      transformResponse: (
        res: IGetAppliedJobsResponse,
      ): ICustomJobPostTypesResponse => {
        let jobs: IJobTypes[] = [];
        res.data.forEach(details => {
          jobs.push({
            id: details.id,
            ...details.jobs[0],
            status: details.status,
            company: getCompanyFromClientDetails(
              details.jobs[0].client_details[0],
            ),
            postID: '0',
            client_details: null,
          });
        });
        return {
          data: jobs,
          pagination: res.pagination,
        };
      },
      transformErrorResponse: (
        response: IErrorResponse,
      ): ICustomErrorResponse => {
        return {
          statusCode: response.status,
          message: response.data.error?.message ?? STRINGS.someting_went_wrong,
        };
      },
    }),
    fetchScheduledJobs: builder.query<
      IJobTypes[],
      {id: number; type: IJobPostStatus | null}
    >({
      query: ({id}) => ({
        url: apiEndPoints.getScheduledJobs(id),
        method: apiMethodType.get,
      }),
      transformResponse: (response: IGetScheduledJobResponse): IJobTypes[] => {
        let jobs: IJobTypes[] = [];
        response.data.forEach(details => {
          if (
            details.status === IJobPostStatus.CONFIRMED ||
            details.status === IJobPostStatus.COMPLETED
          ) {
            jobs.push({
              ...details.jobs[0],
              id: details.id,
              status: details.status,
              postID: '0',
              company: null,
              client_details: null,
            });
          }
        });
        return jobs;
      },
      transformErrorResponse: (
        response: IErrorResponse,
      ): ICustomErrorResponse => {
        return {
          statusCode: response.status,
          message: response.data.error?.message ?? STRINGS.someting_went_wrong,
        };
      },
    }),
    getUpdateDocRequests: builder.query({
      query: () => ({
        url: apiEndPoints.updatePrimaryDocuments,
        method: apiMethodType.get,
      }),
    }),
    updateUserPrimaryDocuments: builder.mutation({
      query: (body: IUpdateEmployeePrimaryDocumentRequest) => ({
        url: apiEndPoints.updatePrimaryDocuments,
        method: apiMethodType.post,
        body,
      }),
    }),
    getJobPostsViaSearch: builder.query({
      query: (body: {
        character: string;
        page: number;
        perPage: number;
        event: 'event' | 'static' | null;
        startDate: string | null;
        endDate: string | null;
        location: string | null;
      }) => ({
        url: apiEndPoints.employeeJobsSearch(
          body.character,
          body.page,
          body.perPage,
          body.event,
          body.startDate,
          body.endDate,
          body.location,
        ),
      }),
      transformResponse: (
        response: IGetJobPostResponse,
      ): ICustomizedJobsResponse => {
        let customizedJobs: IJobTypes[] = [];

        response.data.forEach(job => {
          if (
            job.status !== IJobPostStatus.CLOSED &&
            job.status !== IJobPostStatus.APPLIED &&
            job.notAccepting !== true
          ) {
            let details: IJobTypes = {
              job_name: job.job_name,
              endShift: job.endShift,
              publishedAt: job.publishedAt,
              location: job.location,
              id: job.id,
              job_applications: job.job_applications,
              requiredEmployee: job.requiredEmployee,
              job_type: job.job_type,
              jobDuties: job.jobDuties,
              description: job.description,
              eventDate: job.eventDate,
              startShift: job.startShift,
              city: job.city,
              status: job.status,
              address: job.address,
              postalCode: job.postalCode,
              gender: job.gender,
              salary: job.salary,
              company: getCompanyFromClientDetails(job.client_details[0]),
              required_certificates: job.required_certificates,
              postID: job.postID,
              client_details: null,
            };
            customizedJobs.push(details);
          }
        });
        return {
          data: customizedJobs,
          pagination: response?.meta && {
            page: response?.meta?.page ?? 1,
            pageSize: response?.meta?.pageSize ?? 1,
            pageCount: response?.meta?.total ?? 1,
            total: response?.meta?.total ?? 1,
          },
        };
      },
    }),
  }),
});

export const {
  useLazyFetchJobsQuery,
  useApplyForJobMutation,
  useLazyFetchScheduledJobsQuery,
  useLazyGetJobPostsViaSearchQuery,
  useLazyFetchAppliedJobsQuery,
  useUpdateUserPrimaryDocumentsMutation,
} = employeeApi;

//extract company details from response
export const getCompanyFromClientDetails = (
  res: IClientDetailsResponse | null | undefined,
): ICompany | null => {
  if (res && res.company_detail) {
    let logo: IDoc | null = null;
    if (res.company_detail.companylogo) {
      logo = {
        url: getImageUrl(res.company_detail.companylogo?.url ?? ''),
        id: res.company_detail.companylogo?.id ?? 0,
        name: res.company_detail.companylogo?.name ?? '',
        size: res.company_detail.companylogo?.size ?? 0,
        mime: res.company_detail.companylogo?.mime ?? '',
      };
    }
    let company: ICompany = {
      name: res?.company_detail.companyname ?? '',
      id: res.company_detail.id ?? 0,
      logo: logo,
    };
    return company;
  }
  return null;
};
