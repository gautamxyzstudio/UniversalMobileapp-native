import {apiMethodType} from '@api/apiConstants';
import {baseApi} from '@api/baseApi';
import {apiEndPoints} from '@api/endpoints';
import {
  IApplyForJobRequest,
  ICustomizedJobsResponse,
  IGetAppliedJobsResponse,
  IGetJobsResponse,
  IJobTypes,
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
        response: IGetJobsResponse,
      ): ICustomizedJobsResponse => {
        let customizedJobs: IJobTypes[] = [];
        response.data.forEach(job => {
          if (
            job.attributes.status !== IJobPostStatus.CLOSED &&
            job.attributes.notAccepting !== true
          ) {
            let details: IJobTypes = {
              job_name: job.attributes.job_name,
              endShift: job.attributes.endShift,
              publishedAt: job.attributes.publishedAt,
              location: job.attributes.location,
              id: job.id,
              job_type: job.attributes.job_type,
              job_applications: job.job_applications,
              jobDuties: job.attributes.jobDuties,
              description: job.attributes.description,
              eventDate: job.attributes.eventDate,
              startShift: job.attributes.startShift,
              city: job.attributes.city,
              status: job.attributes.status,
              address: job.attributes.address,
              postalCode: job.attributes.postalCode,
              gender: job.attributes.gender,
              salary: job.attributes.salary,
              client_details: job.client_details[0],
              required_certificates: job.attributes.required_certificates,
              postID: job.attributes.postID,
            };
            customizedJobs.push(details);
          }
        });
        return {
          data: customizedJobs,
          pagination: response?.meta && {
            page: response?.meta.pagination?.page ?? 1,
            pageSize: response?.meta.pagination?.pageSize ?? 1,
            pageCount: response?.meta.pagination?.pageCount ?? 1,
            total: response?.meta.pagination?.total ?? 1,
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
    fetchAppliedJobs: builder.query<IJobTypes[], number>({
      query: (id: number) => ({
        url: apiEndPoints.getAppliedJobs(id),
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
  }),
});

export const {
  useLazyFetchJobsQuery,
  useApplyForJobMutation,
  useLazyFetchAppliedJobsQuery,
} = employeeApi;

//  getPostedJob: builder.query({
//       query: () => ({
//         url: apiEndPoints.getJobPost,
//         method: apiMethodType.get,
//       }),
//       transformResponse: (
//         response: IPostedJobsResponse,
//       ): IJobPostCustomizedResponse => {
//         let data: IJobPostTypes[] = [];
//         response.data.forEach((job, index) => {
//           if (job.id && job.attributes) {
//             data.push({
//               ...job.attributes,
//               id: job.id,
//               postedBy: 'posted by Yash',
//               status: IJobPostStatus.OPEN,
//             });
//           }
//         });
//         return {
//           data: data,
//           pagination: response?.meta && {
//             page: response.meta?.pagination?.page ?? 1,
//             pageSize: response?.meta.pagination?.pageSize ?? 1,
//             pageCount: response?.meta.pagination?.pageCount ?? 1,
//             total: response?.meta.pagination?.total ?? 1,
//           },
//         };
//       },
//       transformErrorResponse: (
//         response: IErrorResponse,
//       ): ICustomErrorResponse => {
//         return {
//           statusCode: response.status,
//           message: response.data.error?.message ?? STRINGS.someting_went_wrong,
//         };
//       },
//     }),
