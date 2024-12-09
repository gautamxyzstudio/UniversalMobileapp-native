import {IJobPostStatus} from '@utils/enums';
import {getJobsEmployeeSearchUrl, getJobsEmployeeUrl} from './types';
export const apiEndPoints = {
  login: `${process.env.BASE_URL}/api/auth/local?populate=*`,
  register: `${process.env.BASE_URL}/api/auth/local/register`,
  upload: `${process.env.BASE_URL}/api/upload`,
  userDocsUpload: `${process.env.BASE_URL}/api/upload`,
  sendEmail: `${process.env.BASE_URL}/api/email/send-verification`,
  verifyEmail: `${process.env.BASE_URL}/api/email/verify`,
  employeeDetails: `${process.env.BASE_URL}/api/employee-details`,
  getUser: `${process.env.BASE_URL}/api/users/me`,
  checkVerificationStatus: (email: string) =>
    `${process.env.BASE_URL}/api/email/check-status?email=${email}`,
  sendOtpMobile: `${process.env.BASE_URL}/api/otp/send`,
  verifyOtpMobile: `${process.env.BASE_URL}/api/otp/verify`,
  updateEmployeeDetails: (id: number) =>
    `${process.env.BASE_URL}/api/employee-details/${id}`,
  clientDetails: `${process.env.BASE_URL}/api/client-details`,
  uploadOtherDocuments: `${process.env.BASE_URL}/api/other-documents/bulk-create`,
  replaceDocument: (docId: number) =>
    `${process.env.BASE_URL}/api/other-documents/${docId}`,
  updateEmployeeDocuments: `${process.env.BASE_URL}/api/update-doc-requests`,
  jobPost: `${process.env.BASE_URL}/api/Jobs`,
  getOpenJobPost: (detailsId: number) =>
    `${process.env.BASE_URL}/api/jobs/find-Openjob/${detailsId}`,
  getClosedJobPost: (detailsId: number) =>
    `${process.env.BASE_URL}/api/jobs/find-Closejob/${detailsId}`,
  getJobsEmployee: (
    pageNumber: number,
    event_type: null | 'static' | 'event',
    startDate: null | string,
    endDate: null | string,
    location: null | string,
  ) => getJobsEmployeeUrl(pageNumber, event_type, startDate, endDate, location),

  saveAsDraft: `${process.env.BASE_URL}/api/jobs-drafts`,
  patchADraft: (id: number) => `${process.env.BASE_URL}/api/jobs-drafts/${id}`,
  applyForJob: `${process.env.BASE_URL}/api/job-applications`,
  getAppliedJobs: (
    id: number,
    type: IJobPostStatus | null,
    pageNumber: number,
  ) =>
    type
      ? `${process.env.BASE_URL}/api/job-applications/employee/${id}?status=${type}&[page]=${pageNumber}&[pageSize]=10`
      : `${process.env.BASE_URL}/api/job-applications/employee/${id}?[page]=${pageNumber}&[pageSize]=10`,
  getCandidatesList: (
    jobId: number,
    type: 'open' | 'shortlisted' | 'denylist',
  ) => `${process.env.BASE_URL}/api/job-applications/${type}/${jobId}`,
  updateJobApplicationStatus: (applicationId: number) =>
    `${process.env.BASE_URL}/api/job-applications/${applicationId}/status`,
  stopAJobPost: (jobId: number) =>
    `${process.env.BASE_URL}/api/jobs/${jobId}/not-accepting`,
  getScheduleClient: (clientId: number) =>
    `${process.env.BASE_URL}/api/jobs/client/${clientId}`,
  employeeJobsSearch: (
    character: string,
    page: number,
    pageSize: number,
    event_type: null | 'static' | 'event',
    startDate: null | string,
    endDate: null | string,
    location: null | string,
  ) =>
    getJobsEmployeeSearchUrl(
      character,
      page,
      pageSize,
      event_type,
      startDate,
      endDate,
      location,
    ),
  updatePrimaryDocuments: `${process.env.BASE_URL}/api/document-requests`,
  getUpdateDocumentsRequests: (id: number) =>
    `${process.env.BASE_URL}/api/document-requests/employee/${id}`,
  checkInOutEmployee: (applicationId: number) =>
    `${process.env.BASE_URL}/api/job-applications/${applicationId}/checkin-checkout`,
  getScheduledJobs: (emplyeeId: number) =>
    `${process.env.BASE_URL}/api/job-applications/scheduled/${emplyeeId}`,
  updateClientDetails: (userId: number) =>
    `${process.env.BASE_URL}/api/client-details/${userId}`,
  getFaqs: `${process.env.BASE_URL}/api/faqs`,
  cancelDocumentUpdateRequest: (docId: number) =>
    `${process.env.BASE_URL}/api/document-requests/${docId}`,
  raiseIssues: `${process.env.BASE_URL}/api/issue-raiseds`,
};
