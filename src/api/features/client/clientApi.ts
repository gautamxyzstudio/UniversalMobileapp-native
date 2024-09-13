import {apiMethodType} from '@api/apiConstants';
import {baseApi} from '@api/baseApi';
import {apiEndPoints} from '@api/endpoints';
import {IJobPostInterface} from '@screens/clientScreens/jobPosting/types';
import {
  IJobPostCustomizedResponse,
  IJobPostTypes,
  INewPostedJobResponse,
  IPatchADraft,
  IPostedJobsResponse,
} from './types';
import {ICustomErrorResponse, IErrorResponse} from '@api/types';
import {STRINGS} from 'src/locales/english';
import {IJobPostStatus, IJobTypesEnum} from '@utils/enums';
import {JOB_ID} from '@assets/exporter';

const clientApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    postAJob: builder.mutation<IJobPostTypes, {data: IJobPostInterface}>({
      query: body => ({
        url: apiEndPoints.jobPost,
        method: apiMethodType.post,
        body,
      }),
      transformResponse: (response: INewPostedJobResponse): IJobPostTypes => {
        console.log(response, 'API REs');
        return {
          id: response.data.id,
          job_name: response.data.attributes?.job_name,
          city: response.data.attributes?.city ?? '',
          required_certificates:
            response.data.attributes?.required_certificates ?? [],
          postedBy: 'Posted by yash',
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
        };
      },
    }),
    getPostedJob: builder.query({
      query: client_id => ({
        url: apiEndPoints.getJobPost(client_id),
        method: apiMethodType.get,
      }),
      transformResponse: (
        response: IPostedJobsResponse,
      ): IJobPostCustomizedResponse => {
        let data: IJobPostTypes[] = [];
        response.data.forEach((job, index) => {
          if (job.id && job.attributes) {
            data.push({
              ...job.attributes,
              id: job.id,
              postedBy: 'posted by Yash',
              status: IJobPostStatus.OPEN,
            });
          }
        });
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
        response: IPostedJobsResponse,
      ): IJobPostCustomizedResponse => {
        let data: IJobPostTypes[] = [];
        response.data.forEach((job, index) => {
          if (job.id && job.attributes) {
            data.push({
              ...job.attributes,
              id: job.id,
              postedBy: 'posted by Yash',
              status: IJobPostStatus.OPEN,
            });
          }
        });
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
          job_name: response.data.attributes?.job_name,
          city: response.data.attributes?.city ?? '',
          required_certificates:
            response.data.attributes?.required_certificates ?? [],
          postedBy: 'Posted by yash',
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
  }),
});

export const {
  usePostAJobMutation,
  usePatchADraftMutation,
  useLazyGetPostedJobQuery,
  useDeleteADraftMutation,
  useSaveAsDraftMutation,
  useLazyGetDraftsQuery,
} = clientApi;
