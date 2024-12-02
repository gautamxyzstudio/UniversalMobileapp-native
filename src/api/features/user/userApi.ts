import {baseApi} from '../../baseApi';
import {
  IAddEmployeeDetailsCustomizedResponse,
  IAddEmployeeDetailsResponse,
  ICheckEmailVerificationStatus,
  IClientDetails,
  IDoc,
  IDocumentRequests,
  IDocumentStatus,
  IEmployeeBankDetails,
  IEmployeeDetails,
  IEmployeeDocument,
  IEmployeeUploadOtherDocumentsRequest,
  IGetUserResponse,
  ILoginArgs,
  IRegisterUserArgs,
  IRegisterUserResponse,
  ISendOtp,
  ISendOtpResponse,
  ISubmitOtherDocumentsResponse,
  IUpdateClientDetailsRequest,
  IUpdateClientDetailsResponse,
  IUpdateEmployeeDocumentsRequest,
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
import {ICustomErrorResponse, IErrorResponse} from '@api/types';
import {apiMethodType} from '@api/apiConstants';
import {getImageUrl} from '@utils/constants';
import {
  extractDocumentRequestFromApiResponse,
  extractEmployeeDocumentsFromApiResponse,
  extractEmployeeSecondaryDocumentsFromApiResponse,
  getDocumentNameFromCode,
} from '@utils/utils.common';
import {STRINGS} from 'src/locales/english';
import {
  IClientStatus,
  IDocumentNames,
  IEmployeeDocsApiKeys,
} from '@utils/enums';

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
      transformErrorResponse: (
        response: IErrorResponse,
      ): ICustomErrorResponse => {
        return {
          statusCode: response.status,
          message: response.data.error?.message ?? STRINGS.someting_went_wrong,
        };
      },
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
      transformErrorResponse: (
        response: IErrorResponse,
      ): ICustomErrorResponse => ({
        statusCode: response.status,
        message: response?.data?.error?.message ?? STRINGS.someting_went_wrong,
      }),
    }),
    sendEmailOtp: builder.mutation<ISendOtpResponse, ISendOtp>({
      query: body => ({
        url: apiEndPoints.sendEmail,
        method: apiMethodType.post,
        body,
      }),
      transformErrorResponse: (
        response: IErrorResponse,
      ): ICustomErrorResponse => ({
        statusCode: response.status,
        message: response?.data?.error?.message ?? STRINGS.someting_went_wrong,
      }),
    }),
    verifyOtpEmail: builder.mutation<IVerifyOtpResponse, IVerifyOtp>({
      query: body => ({
        url: apiEndPoints.verifyEmail,
        method: apiMethodType.post,
        body,
      }),
      transformErrorResponse: (
        response: IErrorResponse,
      ): ICustomErrorResponse => ({
        statusCode: response.status,
        message: response?.data?.error?.message ?? STRINGS.someting_went_wrong,
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
      transformResponse: (response: IAddEmployeeDetailsResponse) => {
        const employeeDetails = response.data.attributes;
        return {
          name: employeeDetails.name,
          email: employeeDetails.email,
          detailsId: response.data.id,
        };
      },
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

            // user banking details
            const bankingDetails: IEmployeeBankDetails = {
              bankAccountNumber: employeeDetails?.bankAcNo ?? '',
              transitNumber: employeeDetails?.trasitNumber ?? '',
              institutionNumber: employeeDetails?.institutionNumber ?? '',
              cheque: {
                docName: STRINGS.cheque,
                docId: employeeDetails?.directDepositVoidCheque?.id ?? 0,
                docStatus: employeeDetails?.directDepositVoidChequeStatus,
                doc: {
                  url: getImageUrl(
                    employeeDetails?.directDepositVoidCheque?.url ?? null,
                  ),
                  id: employeeDetails?.directDepositVoidCheque?.id ?? 0,
                  name: employeeDetails?.directDepositVoidCheque?.name ?? '',
                  size: employeeDetails?.directDepositVoidCheque?.size,
                  mime: employeeDetails?.directDepositVoidCheque?.mime,
                },
                apiKey: IEmployeeDocsApiKeys.CHEQUE,
              },
            };

            //primary certificates
            const primaryCertificates =
              extractEmployeeDocumentsFromApiResponse(employeeDetails);

            //secondary certificates
            const secondaryCertificates =
              extractEmployeeSecondaryDocumentsFromApiResponse(employeeDetails);

            const documentRequest =
              extractDocumentRequestFromApiResponse(employeeDetails);
            //user details
            const userDetails: IEmployeeDetails = {
              name: employeeDetails?.name ?? '',
              phone: employeeDetails?.phone ?? '',
              selfie: profilePic,
              gender: employeeDetails?.gender,
              sinNumber: employeeDetails?.sinNo ?? null,
              workStatus: employeeDetails?.workStatus,
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
              documents: {
                primary: primaryCertificates,
                secondary: secondaryCertificates,
                document_requests: documentRequest,
              },
              bankDetails: bankingDetails,
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
      transformErrorResponse: (
        response: IErrorResponse,
      ): ICustomErrorResponse => ({
        statusCode: response.status,
        message: response?.data?.error?.message ?? STRINGS.someting_went_wrong,
      }),
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
    updateEmployeeDetails: builder.mutation<any, IUpdateUserDetailsRequest>({
      query: body => ({
        url: apiEndPoints.updateEmployeeDetails(body.data.docId),
        method: apiMethodType.PUT,
        body: body.data,
      }),
      invalidatesTags: ['user'],
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
      transformErrorResponse: (
        response: IErrorResponse,
      ): ICustomErrorResponse => ({
        statusCode: response.status,
        message: response.data.error.message,
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
            docName: getDocumentNameFromCode(
              doc.DocName ?? IDocumentNames.NULL,
            ),
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
  useSubmitOtherDocumentsMutation,
  useSubmitUserDetailsMutation,
  useGetUpdatedEmployeeDocumentsQuery,
  useAddClientDetailsMutation,
  useLazyCheckEmailVerificationStatusQuery,
  useUpdateEmployeeDocumentsMutation,
  useLazyGetUpdatedEmployeeDocumentsRequestQuery,
  useCancelDocumentRequestMutation,
} = authApi;
