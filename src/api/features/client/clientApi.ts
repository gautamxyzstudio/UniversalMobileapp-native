import {apiMethodType} from '@api/apiConstants';
import {baseApi} from '@api/baseApi';
import {apiEndPoints} from '@api/endpoints';
import {IJobPostInterface} from '@screens/clientScreens/jobPosting/types';
import {
  ICandidateTypes,
  ICheckInOutEmployeesArgs,
  IClientBasic,
  ICustomizedClientResponse,
  IDraftResponse,
  IFaq,
  IGetCandidateListResponse,
  IGetFaqResponse,
  IJobPostCustomizedResponse,
  IJobPostTypes,
  INewPostedJobResponse,
  IPatchADraft,
  IPostedJobsResponse,
  IUpdateClientResponse,
} from './types';
import {IJobPostStatus, IJobTypesEnum} from '@utils/enums';
import {IClientDetailsResponse, ICompany, IJobTypes} from '../employee/types';
import {getImageUrl} from '@utils/constants';
import {getCompanyFromClientDetails} from '../employee/employeeApi';

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
          id: response.data?.id ?? 0,
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
          postID: response.data.attributes?.postID,
          description: response.data.attributes?.description ?? '',
          gender: response.data.attributes?.gender ?? '',
          eventDate: response.data.attributes?.eventDate ?? new Date(),
          publishedAt: response.data.attributes?.publishedAt ?? new Date(),
          salary: response.data.attributes?.salary ?? '0',
          applicants: null,
          client_details: null,
          company: null,
          address: response.data.attributes?.address ?? '0',
          postalCode: response.data.attributes?.postalCode ?? '0',
        };
      },
    }),
    getPostedJob: builder.query({
      query: company_id => ({
        url: apiEndPoints.getOpenJobPost(company_id),
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
                postID: job.postID,
                notAccepting: job?.notAccepting ?? false,
                applicants: null,
                client_details: populateClientDetails(job.client_details[0]),
                company: getCompanyFromClientDetails(job?.client_details[0]),
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
    }),
    getClosedJobs: builder.query({
      query: company_id => ({
        url: apiEndPoints.getClosedJobPost(company_id),
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
                client_details: populateClientDetails(job.client_details[0]),
                company: getCompanyFromClientDetails(job?.client_details[0]),
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
      transformResponse: (response: IDraftResponse): IJobPostTypes[] => {
        const data: IJobPostTypes[] = [];
        if (response.data) {
          response.data.forEach(job => {
            // Extract client details
            const clientDetails: IClientBasic | null = job.client_details
              ? {
                  id: job?.client_details[0]?.id ?? 0,
                  name: job?.client_details[0]?.Name ?? '',
                  email: job?.client_details[0]?.Email ?? '',
                  location: job?.client_details[0]?.location ?? '',
                }
              : null;

            // Extract company details
            const company: ICompany | null = job.client_details[0]
              ?.company_detail
              ? {
                  id: 0,
                  logo: job.client_details[0]?.company_detail?.companylogo
                    ? {
                        url: job.client_details[0]?.company_detail.companylogo
                          ?.url,
                        mime: job.client_details[0]?.company_detail.companylogo
                          ?.mime,
                        size: job.client_details[0]?.company_detail.companylogo
                          ?.size,
                        name: job.client_details[0]?.company_detail.companylogo
                          ?.name,
                      }
                    : null,
                  name:
                    job.client_details[0]?.company_detail?.companyname ?? '',
                }
              : null;

            // Add transformed job data to the array
            data.push({
              id: job.id,
              job_name: job.job_name,
              required_certificates: job.required_certificates,
              city: job.city,
              address: job.address,
              postalCode: job.postalCode,
              gender: job.gender,
              salary: job.salary,
              jobDuties: job.jobDuties,
              job_type: job.job_type,
              location: job.location,
              description: job.description,
              eventDate: job.eventDate,
              endShift: job.endShift,
              startShift: job.startShift,
              requiredEmployee: job.requiredEmployee,
              publishedAt: job.publishedAt,
              status: IJobPostStatus.OPEN, // Default status
              applicants: null, // Placeholder
              client_details: clientDetails,
              company: company,
            });
          });
        }

        return data;
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
          client_details: null,
          applicants: null,
          company: null,
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
              CheckIn: candidate?.CheckIn ?? null,
              CheckOut: candidate?.CheckOut ?? null,
              employeeDetails: {
                id: candidate?.employee_details[0]?.id ?? 0,
                name: candidate?.employee_details[0]?.name ?? '',
                selfie: candidate?.employee_details[0]?.selfie
                  ? {
                      url:
                        getImageUrl(
                          candidate?.employee_details[0]?.selfie[0]?.url,
                        ) ?? '',
                      mime:
                        candidate?.employee_details[0]?.selfie[0]?.mime ?? '',
                      id: candidate?.employee_details[0]?.selfie[0]?.id ?? 0,
                      name:
                        candidate?.employee_details[0]?.selfie[0]?.name ?? '',
                      size:
                        candidate?.employee_details[0]?.selfie[0]?.size ?? 0,
                    }
                  : null,
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
          jobs.push({...details, company: null, client_details: null});
        });
        return jobs;
      },
    }),
    checkInOutEmployees: builder.mutation<
      any,
      {args: ICheckInOutEmployeesArgs; applicationId: number}
    >({
      query: (body: {
        args: ICheckInOutEmployeesArgs;
        applicationId: number;
      }) => ({
        url: apiEndPoints.checkInOutEmployee(body.applicationId),
        method: apiMethodType.patch,
        body: body.args,
      }),
    }),
    updateClientDetails: builder.mutation<
      ICustomizedClientResponse,
      {
        userId: number;
        clientDetails: {
          Name: string;
          location: string;
          contactno: string;
        };
      }
    >({
      query: body => ({
        url: apiEndPoints.updateClientDetails(body.userId),
        method: apiMethodType.patch,
        body: body.clientDetails,
      }),
      transformResponse: (
        response: IUpdateClientResponse,
      ): ICustomizedClientResponse => {
        return {
          Name: response.data.Name,
          contactno: response.data.contactno,
          location: response.data.location,
        };
      },
    }),
    fetchFaqs: builder.query({
      query: () => ({
        url: apiEndPoints.getFaqs,
        method: apiMethodType.get,
      }),
      transformResponse: (response: IGetFaqResponse): IFaq[] => {
        return response.data.map(
          (faq: {
            id: number;
            attributes: {
              Title: string;
              FaqDsrc: string;
            };
          }) => ({
            id: faq.id,
            title: faq.attributes.Title,
            description: faq.attributes.FaqDsrc,
          }),
        );
      },
    }),
  }),
});

export const {
  usePostAJobMutation,
  useGetClientScheduleQuery,
  useFetchFaqsQuery,
  useStopAJobPostMutation,
  useUpdateClientDetailsMutation,
  usePatchADraftMutation,
  useLazyGetPostedJobQuery,
  useLazyGetCandidatesListQuery,
  useUpdateJobApplicationStatusMutation,
  useDeleteADraftMutation,
  useGetPostedJobQuery,
  useSaveAsDraftMutation,
  useLazyGetClosedJobsQuery,
  useCheckInOutEmployeesMutation,
  useLazyGetDraftsQuery,
} = clientApi;

//
const populateClientDetails = (
  res: IClientDetailsResponse,
): IClientBasic | null => {
  if (res) {
    return {
      id: res.id ?? 0,
      name: res.Name ?? '',
      email: res.Email ?? '',
      location: res.location ?? '',
    };
  }
  return null;
};
