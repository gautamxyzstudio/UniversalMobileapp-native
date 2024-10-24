import {apiMethodType} from '@api/apiConstants';
import {baseApi} from '@api/baseApi';
import {apiEndPoints} from '@api/endpoints';
import {IJobPostInterface} from '@screens/clientScreens/jobPosting/types';
import {
  ICandidateTypes,
  IDraftResponse,
  IGetCandidateListResponse,
  IJobPostCustomizedResponse,
  IJobPostTypes,
  INewPostedJobResponse,
  IPatchADraft,
  IPostedJobsResponse,
} from './types';
import {ICustomErrorResponse, IErrorResponse} from '@api/types';
import {STRINGS} from 'src/locales/english';
import {IJobPostStatus, IJobTypesEnum} from '@utils/enums';
import {IJobTypes} from '../employee/types';

const baseApiWithTag = baseApi.enhanceEndpoints({
  addTagTypes: ['ClientSchedule'],
});

const clientApi = baseApiWithTag.injectEndpoints({
  endpoints: builder => ({
    postAJob: builder.mutation<IJobPostTypes, {data: IJobPostInterface}>({
      query: body => ({
        url: apiEndPoints.jobPost,
        method: apiMethodType.post,
        body,
      }),
      invalidatesTags: ['ClientSchedule'],
      transformResponse: (response: INewPostedJobResponse): IJobPostTypes => {
        return {
          id: response.data.id,
          job_name: response.data.attributes?.job_name ?? 'job Name',
          city: response.data.attributes?.city ?? '',
          required_certificates:
            response.data.attributes?.required_certificates ?? [],
          jobDuties: response.data.attributes?.jobDuties ?? '',
          job_type: response.data.attributes?.job_type ?? IJobTypesEnum.EVENT,
          status: IJobPostStatus.OPEN,
          notAccepting: false,
          location: response.data.attributes?.location ?? '',
          requiredEmployee: response.data.attributes?.requiredEmployee ?? 0,
          startShift: response.data.attributes?.startShift ?? new Date(),
          endShift: response.data.attributes?.endShift ?? new Date(),
          description: response.data.attributes?.description ?? '',
          gender: response.data.attributes?.gender ?? '',
          eventDate: response.data.attributes?.eventDate ?? new Date(),
          publishedAt: response.data.attributes?.publishedAt ?? new Date(),
          salary: response.data.attributes?.salary ?? '0',
          applicants: null,
          client_details: {
            id: 0,
            Name: '',
            companyname: '',
            Industry: '',
            Email: '',
            location: '',
          },
          address: response.data.attributes?.address ?? '0',
          postalCode: response.data.attributes?.postalCode ?? '0',
        };
      },
    }),
    getPostedJob: builder.query({
      query: client_id => ({
        url: apiEndPoints.getOpenJobPost(client_id),
        method: apiMethodType.get,
      }),
      transformResponse: (
        response: IPostedJobsResponse,
      ): IJobPostCustomizedResponse => {
        let data: IJobPostTypes[] = [];
        if (response.data) {
          response.data.forEach(job => {
            if (job.id) {
              data.push({
                ...job,
                id: job.id,
                status: IJobPostStatus.OPEN,
                notAccepting: job?.notAccepting ?? false,
                applicants: null,
                client_details: {
                  ...job.client_details,
                },
              });
            }
          });
        }

        return {
          data: data,
          pagination: response?.meta && {
            page: response.meta?.page ?? 1,
            pageSize: response?.meta.pageSize ?? 1,
            pageCount: response?.meta.total ?? 1,
            total: response?.meta.totalPages ?? 1,
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
    getClosedJobs: builder.query({
      query: client_id => ({
        url: apiEndPoints.getClosedJobPost(client_id),
        method: apiMethodType.get,
      }),
      transformResponse: (
        response: IPostedJobsResponse,
      ): IJobPostCustomizedResponse => {
        let data: IJobPostTypes[] = [];
        if (response.data) {
          response.data.forEach(job => {
            if (job.id) {
              data.push({
                ...job,
                id: job.id,
                status: IJobPostStatus.CLOSED,
                notAccepting: job?.notAccepting ?? false,
                applicants: null,
                client_details: {
                  ...job.client_details,
                },
              });
            }
          });
        }

        return {
          data: data,
          pagination: response?.meta && {
            page: response.meta?.page ?? 1,
            pageSize: response?.meta.pageSize ?? 1,
            pageCount: response?.meta.total ?? 1,
            total: response?.meta.totalPages ?? 1,
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
    saveAsDraft: builder.mutation<{data: IJobPostInterface}, any>({
      query: body => ({
        url: apiEndPoints.saveAsDraft,
        method: apiMethodType.post,
        body,
      }),
    }),
    getDrafts: builder.query({
      query: () => ({
        url: apiEndPoints.saveAsDraft,
        method: apiMethodType.get,
      }),
      transformResponse: (
        response: IDraftResponse,
      ): IJobPostCustomizedResponse => {
        let data: IJobPostTypes[] = [];
        if (response.data) {
          response.data.forEach(job => {
            if (job.id && job.attributes) {
              data.push({
                ...job.attributes,
                id: job.id,
                status: IJobPostStatus.OPEN,
                applicants: null,
                client_details: {
                  id: 0,
                  Name: '',
                  companyname: '',
                  Industry: '',
                  Email: '',
                  location: '',
                },
              });
            }
          });
        }

        return {
          data: data,
          pagination: response?.meta && {
            page: response.meta?.pagination?.page ?? 1,
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
    deleteADraft: builder.mutation<{id: number}, any>({
      query: ({id}) => ({
        url: apiEndPoints.patchADraft(id),
        method: apiMethodType.delete,
      }),
    }),
    patchADraft: builder.mutation<any, {id: number; body: IPatchADraft}>({
      query: ({id, body}) => ({
        url: apiEndPoints.patchADraft(id), // Use the id in the endpoint
        method: apiMethodType.PUT, // Specify the method as PUT
        body, // Pass the body
      }),
      transformResponse: (response: INewPostedJobResponse): IJobPostTypes => {
        return {
          id: response.data.id,
          job_name: response.data.attributes?.job_name ?? '',
          city: response.data.attributes?.city ?? '',
          required_certificates:
            response.data.attributes?.required_certificates ?? [],
          jobDuties: response.data.attributes?.jobDuties ?? '',
          job_type: response.data.attributes?.job_type ?? IJobTypesEnum.EVENT,
          status: IJobPostStatus.OPEN,
          location: response.data.attributes?.location ?? '',
          requiredEmployee: response.data.attributes?.requiredEmployee ?? 0,
          startShift: response.data.attributes?.startShift ?? new Date(),
          endShift: response.data.attributes?.endShift ?? new Date(),
          description: response.data.attributes?.description ?? '',
          gender: response.data.attributes?.gender ?? '',
          eventDate: response.data.attributes?.eventDate ?? new Date(),
          publishedAt: response.data.attributes?.publishedAt ?? new Date(),
          salary: response.data.attributes?.salary ?? '0',
          address: response.data.attributes?.address ?? '0',
          postalCode: response.data.attributes?.postalCode ?? '0',
          client_details: {
            id: 0,
            Name: '',
            companyname: '',
            Industry: '',
            Email: '',
            location: '',
          },
          applicants: null,
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
    getCandidatesList: builder.query({
      query: ({
        jobId,
        type,
      }: {
        type: 'open' | 'shortlisted' | 'denylist';
        jobId: number;
      }) => ({
        url: apiEndPoints.getCandidatesList(jobId, type),
        method: apiMethodType.get,
      }),
      transformResponse: (
        response: IGetCandidateListResponse,
      ): ICandidateTypes[] => {
        let candidates: ICandidateTypes[] = [];
        if (response.data) {
          response.data.forEach(candidate => {
            candidates.push({
              id: candidate.id,
              applicationDate: candidate.applicationDate,
              status: candidate.status,
              jobId: candidate.jobs[0]?.id ?? 0,
              jobLocation: candidate.jobs[0]?.location ?? '',
              employeeDetails: {
                id: candidate?.employee_details[0]?.id ?? 0,
                name: candidate?.employee_details[0]?.name ?? '',
                selfie:
                  (candidate?.employee_details[0]?.selfie &&
                    candidate?.employee_details[0]?.selfie[0]) ??
                  null,
                dob: candidate?.employee_details[0]?.dob ?? null,
                gender: candidate?.employee_details[0]?.dob ?? '',
                email: candidate?.employee_details[0]?.email ?? '',
                phone: candidate?.employee_details[0]?.phone ?? '',
                resume: candidate?.employee_details[0]?.resume ?? null,
              },
            });
          });
        }
        return candidates;
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
    stopAJobPost: builder.mutation({
      query: (body: {jobId: number}) => ({
        url: apiEndPoints.stopAJobPost(body.jobId),
        method: apiMethodType.patch,
        body: {
          notAccepting: true,
        },
      }),
    }),
    updateJobApplicationStatus: builder.mutation({
      query: (body: {applicationId: number; status: IJobPostStatus}) => ({
        url: apiEndPoints.updateJobApplicationStatus(body.applicationId),
        method: apiMethodType.patch,
        body: {
          status: body.status,
        },
      }),
    }),
    getClientSchedule: builder.query({
      query: (body: {clientId: number}) => ({
        url: apiEndPoints.getScheduleClient(body.clientId),
        method: apiMethodType.get,
      }),
      providesTags: ['ClientSchedule'],
      transformResponse: (response: IPostedJobsResponse): IJobTypes[] => {
        let jobs: IJobTypes[] = [];
        response.data.forEach(details => {
          jobs.push(details);
        });
        return jobs;
      },
    }),
  }),
});

export const {
  usePostAJobMutation,
  useGetClientScheduleQuery,
  useStopAJobPostMutation,
  usePatchADraftMutation,
  useLazyGetPostedJobQuery,
  useLazyGetCandidatesListQuery,
  useUpdateJobApplicationStatusMutation,
  useDeleteADraftMutation,
  useGetPostedJobQuery,
  useSaveAsDraftMutation,
  useLazyGetClosedJobsQuery,
  useLazyGetDraftsQuery,
} = clientApi;
