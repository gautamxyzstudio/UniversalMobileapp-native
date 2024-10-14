import {apiMethodType} from '@api/apiConstants';
import {baseApi} from '@api/baseApi';
import {apiEndPoints} from '@api/endpoints';
import {
  IApplyForJobRequest,
  ICustomizedJobsResponse,
  IGetAppliedJobsResponse,
  IGetJobPostResponse,
  IJobTypes,
  IUpdateEmployeePrimaryDocumentRequest,
} from './types';
import {IErrorResponse, ICustomErrorResponse} from '@api/types';
import {STRINGS} from 'src/locales/english';
import {IJobPostStatus} from '@utils/enums';

const employeeApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    fetchJobs: builder.query({
      query: (pageNumber: number) => ({
        url: apiEndPoints.getJobsEmployee(pageNumber),
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
              client_details: job.client_details[0],
              required_certificates: job.required_certificates,
              postID: job.postID,
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
      IJobTypes[],
      {id: number; type: IJobPostStatus | null}
    >({
      query: ({id, type}) => ({
        url: apiEndPoints.getAppliedJobs(id, type),
        method: apiMethodType.get,
      }),
      transformResponse: (response: IGetAppliedJobsResponse): IJobTypes[] => {
        let jobs: IJobTypes[] = [];
        response.forEach(details => {
          jobs.push({
            id: details.id,
            ...details.jobs[0],
            status: details.status,
            client_details: details.jobs[0].client_details[0],
          });
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
    fetchScheduledJobs: builder.query<
      IJobTypes[],
      {id: number; type: IJobPostStatus | null}
    >({
      query: ({id, type}) => ({
        url: apiEndPoints.getAppliedJobs(id, type),
        method: apiMethodType.get,
      }),
      transformResponse: (response: IGetAppliedJobsResponse): IJobTypes[] => {
        let jobs: IJobTypes[] = [];
        response.forEach(details => {
          if (
            details.status === IJobPostStatus.CONFIRMED ||
            details.status === IJobPostStatus.COMPLETED
          ) {
            jobs.push({
              id: details.id,
              ...details.jobs[0],
              status: details.status,
              client_details: details.jobs[0].client_details[0],
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
      query: (body: {character: string; page: number; perPage: number}) => ({
        url: apiEndPoints.employeeJobsSearch(
          body.character,
          body.page,
          body.perPage,
        ),
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
              client_details: job.client_details[0],
              required_certificates: job.required_certificates,
              postID: job.postID,
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
