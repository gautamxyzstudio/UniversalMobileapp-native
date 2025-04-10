import {baseApi} from '../../baseApi';
import {
  IAddEmployeeDetailsCustomizedResponse,
  ICheckEmailVerificationStatus,
  IClientDetails,
  IDoc,
  IDocumentRequests,
  IDocumentStatus,
  IEmployeeBankDetails,
  IEmployeeDetails,
  IEmployeeDocument,
  IEmployeeUploadOtherDocumentsRequest,
  IGetRaisedIssuesResponse,
  IGetUserResponse,
  ILoginArgs,
  IRaiseIssueArgs,
  IRegisterUserArgs,
  IRegisterUserResponse,
  IReplaceRejectedDocumentResponse,
  IReplaceUpdateDocumentRequestResponse,
  ISendOtp,
  ISendOtpResponse,
  Issue,
  ISubmitOtherDocumentsResponse,
  IUpdateClientDetailsRequest,
  IUpdateClientDetailsResponse,
  IUpdateEmployeeDocumentsRequest,
  IUpdateUserDetailsCustomResponse,
  IUpdateUserDetailsRequest,
  IUser,
  IUserDetailsRequest,
  IUserSendOtpMobile,
  IUserVerifyOtpMobile,
  IUserVerifyOtpResponse,
  IVerifyOtp,
  IVerifyOtpResponse,
} from './types';
import {apiEndPoints} from '@api/endpoints';
import {apiMethodType} from '@api/apiConstants';
import {getImageUrl} from '@utils/constants';
import {
  extractDocumentRequestFromApiResponse,
  formatDocument,
} from '@utils/utils.common';
import {STRINGS} from 'src/locales/english';
import {IClientStatus, IUserTypeEnum} from '@utils/enums';

const baseApiWithUserTag = baseApi.enhanceEndpoints({
  addTagTypes: ['user'],
});

const authApi = baseApiWithUserTag.injectEndpoints({
  endpoints: builder => ({
    register: builder.mutation<IUser<'client' | 'emp'>, IRegisterUserArgs>({
      query: body => ({
        url: apiEndPoints.register,
        method: apiMethodType.post,
        body,
      }),
      transformResponse: (
        response: IRegisterUserResponse,
      ): IUser<'client' | 'emp'> => ({
        email: response.user?.email ?? 'anonymous',
        token: response.jwt,
        id: response.user?.id ?? 0,
        user_type: response.user?.user_type ?? 'client',
        details: null,
      }),
    }),
    login: builder.mutation<IUser<'client' | 'emp'>, ILoginArgs>({
      query: body => ({
        url: apiEndPoints.login,
        method: apiMethodType.post,
        body,
      }),
      transformResponse: (
        response: IRegisterUserResponse,
      ): IUser<'client' | 'emp'> => ({
        email: response.user?.email ?? 'anonymous',
        token: response.jwt,
        id: response.user?.id ?? 0,
        user_type: response.user?.user_type ?? 'client',
        details: null,
      }),
    }),
    sendEmailOtp: builder.mutation<ISendOtpResponse, ISendOtp>({
      query: body => ({
        url: apiEndPoints.sendEmail,
        method: apiMethodType.post,
        body,
      }),
    }),
    verifyOtpEmail: builder.mutation<IVerifyOtpResponse, IVerifyOtp>({
      query: body => ({
        url: apiEndPoints.verifyEmail,
        method: apiMethodType.post,
        body,
      }),
    }),
    checkEmailVerificationStatus: builder.query<
      ICheckEmailVerificationStatus,
      {email: string}
    >({
      query: body => ({
        url: apiEndPoints.checkVerificationStatus(body.email),
        method: apiMethodType.get,
      }),
    }),
    submitUserDetails: builder.mutation<
      IAddEmployeeDetailsCustomizedResponse,
      IUserDetailsRequest
    >({
      query: body => ({
        url: apiEndPoints.employeeDetails,
        method: apiMethodType.post,
        body,
      }),
    }),
    getUser: builder.query<IEmployeeDetails | IClientDetails | null, any>({
      query: () => ({
        url: apiEndPoints.getUser,
        method: apiMethodType.get,
      }),
      providesTags: ['user'],
      transformResponse: (
        response: IGetUserResponse,
      ): IEmployeeDetails | IClientDetails | null => {
        const userType = response.user_type;
        if (userType === 'emp') {
          const employeeDetails = response.euser_id;
          if (employeeDetails) {
            //user Profile Picture
            let profilePic = null;
            if (employeeDetails.selfie) {
              const userProfilePic: IDoc = {
                url: getImageUrl(employeeDetails.selfie[0].url ?? ''),
                id: employeeDetails.selfie[0].id,
                name: employeeDetails.selfie[0].name,
                size: employeeDetails.selfie[0].size,
                mime: employeeDetails.selfie[0].mime,
              };
              profilePic = userProfilePic;
            }

            let employeeDocs: IEmployeeDocument[] = [];
            let cheque: IEmployeeDocument | null = null;

            const update_requests =
              extractDocumentRequestFromApiResponse(employeeDetails);

            employeeDetails.other_documents.forEach(doc => {
              if (doc.name === STRINGS.cheque) {
                cheque = formatDocument(doc);
              } else {
                employeeDocs.push(formatDocument(doc));
              }
            });
            const formattedEmployeeDocs = getEmployeeDocs(
              employeeDocs,
              update_requests,
            );

            // user banking details
            const bankingDetails: IEmployeeBankDetails = {
              bankAccountNumber: employeeDetails?.bankAcNo ?? '',
              transitNumber: employeeDetails?.trasitNumber ?? '',
              institutionNumber: employeeDetails?.institutionNumber ?? '',
              cheque: cheque,
            };
            //user details
            const userDetails: IEmployeeDetails = {
              name: employeeDetails?.name ?? '',
              phone: employeeDetails?.phone ?? '',
              bankDetails: bankingDetails,
              selfie: profilePic,
              gender: employeeDetails?.gender ?? '',
              sinNumber: employeeDetails?.sinNo ?? null,
              resume: {
                docName: STRINGS.resume_title,
                docId: employeeDetails?.resume?.id ?? 0,
                docStatus: IDocumentStatus.APPROVED,
                doc: {
                  url: getImageUrl(employeeDetails?.resume?.url ?? null),
                  id: employeeDetails?.resume?.id ?? 0,
                  name: employeeDetails?.resume?.name ?? '',
                  size: employeeDetails?.resume?.size,
                  mime: employeeDetails?.resume?.mime,
                },
              },
              city: employeeDetails.city ?? '',
              address: employeeDetails.address ?? '',
              detailsId: employeeDetails.id ?? null,
              documents: formattedEmployeeDocs,
              update_requests: update_requests,
            };
            return userDetails;
          }
        } else {
          const clientDetails = response.cuser_id;
          let client: IClientDetails = {
            name: clientDetails?.Name ?? '',
            companyName: clientDetails?.companyname ?? '',
            contactNo: clientDetails?.contactno ?? '',
            industry: clientDetails?.Industry ?? '',
            detailsId: clientDetails?.id ?? 0,
            location: clientDetails?.location ?? '',
            status: clientDetails?.status ?? IClientStatus.PENDING,
            company: clientDetails?.company_detail
              ? {
                  companyname: clientDetails.company_detail.companyname,
                  companyemail: clientDetails.company_detail.companyemail,
                  companylogo: {
                    url: getImageUrl(
                      clientDetails.company_detail.companylogo?.url ?? '',
                    ),
                    id: clientDetails.company_detail.companylogo?.id ?? 0,
                    name: clientDetails.company_detail.companylogo?.name ?? '',
                    size: clientDetails.company_detail.companylogo?.size ?? 0,
                    mime: clientDetails.company_detail.companylogo?.mime ?? '',
                  },
                  id: clientDetails.company_detail.id,
                }
              : null,
          };
          return client;
        }
        return null;
      },
    }),
    getUserDetails: builder.query<any, IUserDetailsRequest>({
      query: body => ({
        url: apiEndPoints.employeeDetails,
        method: apiMethodType.post,
        body,
      }),
    }),
    verifyOptMobile: builder.mutation<
      IUserVerifyOtpResponse,
      IUserVerifyOtpMobile
    >({
      query: body => ({
        url: apiEndPoints.verifyOtpMobile,
        method: apiMethodType.post,
        body,
      }),
    }),
    sentOptMobile: builder.mutation<any, IUserSendOtpMobile>({
      query: body => ({
        url: apiEndPoints.sendOtpMobile,
        method: apiMethodType.post,
        body,
      }),
    }),
    updateEmployeeDetails: builder.mutation<
      IUpdateUserDetailsCustomResponse,
      IUpdateUserDetailsRequest
    >({
      query: body => ({
        url: apiEndPoints.updateEmployeeDetails(body.data.docId),
        method: apiMethodType.PUT,
        body: body.data,
      }),
    }),
    addClientDetails: builder.mutation<
      IUpdateClientDetailsResponse,
      IUpdateClientDetailsRequest
    >({
      query: body => ({
        url: apiEndPoints.clientDetails,
        method: apiMethodType.post,
        body: body,
      }),
    }),
    getUpdatedEmployeeDocuments: builder.query({
      query: () => ({
        url: apiEndPoints.updateEmployeeDocuments,
        method: apiMethodType.get,
      }),
    }),
    updateEmployeeDocuments: builder.mutation<
      any,
      IUpdateEmployeeDocumentsRequest
    >({
      query: body => ({
        url: apiEndPoints.updateEmployeeDocuments,
        method: apiMethodType.post,
        body,
      }),
    }),
    getUpdatedEmployeeDocumentsRequest: builder.query<
      IEmployeeDocument[],
      {id: number}
    >({
      query: ({id}) => ({
        url: apiEndPoints.getUpdateDocumentsRequests(id),
        method: apiMethodType.get,
      }),
      transformResponse: (
        response: IDocumentRequests[],
      ): IEmployeeDocument[] => {
        const documents: IEmployeeDocument[] = [];
        response.forEach(doc => {
          documents.push({
            doc: {
              url: getImageUrl(doc.document?.url ?? ''),
              id: doc.document?.id ?? 0,
              name: doc.document?.name ?? '',
              size: doc.document?.size ?? 0,
              mime: doc.document?.mime ?? '',
            },
            docName: doc?.name ?? '',
            docStatus: doc.status ?? IDocumentStatus.PENDING,
            docId: doc.id ?? 0,
          });
        });
        return documents;
      },
    }),
    cancelDocumentRequest: builder.mutation({
      query: (docId: number) => ({
        url: apiEndPoints.cancelDocumentUpdateRequest(docId),
        method: apiMethodType.delete,
      }),
    }),
    submitOtherDocuments: builder.mutation<
      ISubmitOtherDocumentsResponse,
      IEmployeeUploadOtherDocumentsRequest
    >({
      query: body => ({
        url: apiEndPoints.uploadOtherDocuments,
        method: apiMethodType.post,
        body: body,
      }),
    }),
    replaceRejectedDocument: builder.mutation<
      IEmployeeDocument,
      {
        prevID: number;
        args: {
          data: {
            Document: number;
            employee_detail: number;
            Docstatus: IDocumentStatus.PENDING;
          };
        };
      }
    >({
      query: body => ({
        url: apiEndPoints.replaceDocument(body.prevID),
        method: apiMethodType.patch,
        body: body.args,
      }),
      transformResponse: (response: IReplaceRejectedDocumentResponse) => {
        const document = formatDocument({
          id: response.data.id ?? 0,
          Docstatus: response.data.Docstatus ?? IDocumentStatus.PENDING,
          name: response.data.name ?? '',
          Document: {
            url: getImageUrl(response.data.Document?.url ?? ''),
            id: response.data.Document?.id ?? 0,
            name: response.data.Document?.name ?? '',
            size: response.data.Document?.size ?? 0,
            mime: response.data.Document?.mime ?? '',
          },
        });
        return document;
      },
    }),
    replaceUpdateDocRequest: builder.mutation<
      IEmployeeDocument,
      {
        prevID: number;
        args: {
          document: number;
          employee_detail: number;
          status: IDocumentStatus.PENDING;
        };
      }
    >({
      query: body => ({
        url: apiEndPoints.replaceUpdateDocumentRequest(body.prevID),
        method: apiMethodType.patch,
        body: body.args,
      }),
      transformResponse: (response: IReplaceUpdateDocumentRequestResponse) => {
        const document = formatDocument({
          id: response.id ?? 0,
          Docstatus: response.status ?? IDocumentStatus.PENDING,
          name: response.name ?? '',
          Document: {
            url: getImageUrl(response.document?.url ?? ''),
            id: response.document?.id ?? 0,
            name: response.document?.name ?? '',
            size: response.document?.size ?? 0,
            mime: response.document?.mime ?? '',
          },
        });
        return document;
      },
    }),
    raiseAnIssue: builder.mutation<any, IRaiseIssueArgs>({
      query: body => ({
        url: apiEndPoints.raiseAnIssue,
        method: apiMethodType.post,
        body,
      }),
    }),
    getIssues: builder.query<
      Issue[],
      {detailId: number; empType: IUserTypeEnum}
    >({
      query: body => ({
        url:
          body.empType === IUserTypeEnum.EMPLOYEE
            ? apiEndPoints.getIssuesByEmployee(body.detailId)
            : apiEndPoints.getIssuesByClient(body.detailId),
        method: apiMethodType.get,
      }),
      transformResponse: (response: IGetRaisedIssuesResponse) => {
        const issues: Issue[] = [];
        response.map(issue => {
          issues.unshift({
            Issue: issue.Issue,
            createdAt: issue.createdAt,
            id: issue.id,
            status: issue.status,
          });
        });
        return issues;
      },
    }),
  }),

  overrideExisting: false,
});

export const {
  useRegisterMutation,
  useVerifyOptMobileMutation,
  useSentOptMobileMutation,
  useUpdateEmployeeDetailsMutation,
  useLazyGetUserQuery,
  useLoginMutation,
  useSendEmailOtpMutation,
  useVerifyOtpEmailMutation,
  useLazyGetIssuesQuery,
  useRaiseAnIssueMutation,
  useSubmitOtherDocumentsMutation,
  useSubmitUserDetailsMutation,
  useGetUpdatedEmployeeDocumentsQuery,
  useAddClientDetailsMutation,
  useLazyCheckEmailVerificationStatusQuery,
  useUpdateEmployeeDocumentsMutation,
  useLazyGetUpdatedEmployeeDocumentsRequestQuery,
  useCancelDocumentRequestMutation,
  useReplaceRejectedDocumentMutation,
  useReplaceUpdateDocRequestMutation,
} = authApi;

const getEmployeeDocs = (
  empDocs: IEmployeeDocument[],
  updateRequests: IEmployeeDocument[],
) => {
  if (updateRequests.length === 0) {
    return empDocs;
  }
  const updateRequestMap = new Map<string, IEmployeeDocument>(
    updateRequests.map(doc => [doc.docName, doc]),
  );
  return empDocs.map(doc => updateRequestMap.get(doc.docName) || doc);
};
