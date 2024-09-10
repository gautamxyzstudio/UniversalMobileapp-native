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
  updateEmployeeDocuments: `${process.env.BASE_URL}/api/update-doc-requests`,
  jobPost: `${process.env.BASE_URL}/api/Jobs`,
  getJobPost: `${process.env.BASE_URL}/api/Jobs?sort=createdAt:desc`,
};
