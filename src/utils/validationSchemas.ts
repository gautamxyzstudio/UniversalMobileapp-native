import moment, {Moment} from 'moment';
import {STRINGS} from 'src/locales/english';
import * as Yup from 'yup';

// Define regex for a valid username
const usernameRegex = /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/;

// Custom validation method to check if the value is either a valid username or a valid email
const usernameOrEmailSchema = Yup.string().test(
  'is-username-or-email',
  STRINGS.usernameOrEmailError,
  value => {
    if (!value) {
      return false;
    } // return false if the value is empty
    const isValidUsername = usernameRegex.test(value);
    const isValidEmail = Yup.string().email().isValidSync(value);
    return isValidUsername || isValidEmail;
  },
);
//login
export const loginSchema = Yup.object().shape({
  email: usernameOrEmailSchema.required(STRINGS.emailOrUsernameValid),
  password: Yup.string().required(STRINGS.passwordRequired),
});

//forgot
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required(STRINGS.emailRequired)
    .email(STRINGS.emailOrUsernameValid),
});

//client details
export const clientDetailsSchema = Yup.object().shape({
  name: Yup.string().required(STRINGS.name_required),
  phone: Yup.string().required(STRINGS.contact_required),
  company: Yup.string().required(STRINGS.company_required),
  industry: Yup.string().required(STRINGS.industry_required),
  location: Yup.string().required(STRINGS.location_required),
});

//confirm password
export const confirmPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required(STRINGS.passwordRequired)
    .min(8, STRINGS.passwordError)
    .matches(/[A-Z]/, STRINGS.passErrorAtLeastOneCaps),
  confirmPassword: Yup.string()
    .required(STRINGS.passwordRequired)
    .oneOf([Yup.ref('password')], STRINGS.passwordNotMatch),
});

//signup user simple
export const signupSchema = Yup.object().shape({
  email: Yup.string().required(STRINGS.emailRequired).email(STRINGS.emailError),
  password: Yup.string()
    .required(STRINGS.passwordRequired)
    .min(8, STRINGS.passwordError)
    .matches(/[A-Z]/, STRINGS.passErrorAtLeastOneCaps),
  confirmPassword: Yup.string()
    .required(STRINGS.passwordRequired)
    .oneOf([Yup.ref('password')], STRINGS.passwordNotMatch),
  isCheckedPrivacyPolicy: Yup.boolean().required(STRINGS.privacy_check),
});

//user details step 1;
export const userDetailsStep1Schema = Yup.object().shape({
  name: Yup.string().required(STRINGS.name_required),
  phone: Yup.string().required(STRINGS.contact_required),
  dob: Yup.date().required(STRINGS.date_of_birth_required),
  address: Yup.string().required(STRINGS.address_Required),
  city: Yup.string().required(STRINGS.city_required),
  gender: Yup.string().required(STRINGS.gender_required),
});

export const userDetailsStep2Schema = Yup.object().shape({
  backAccountNumber: Yup.string().matches(
    /^\d{5,12}$/,
    STRINGS.backAccountNumberValid,
  ),
  institutionNumber: Yup.string()
    .matches(/^\d{3}$/, STRINGS.institutionNumberValid)
    .required(STRINGS.institutionNumberError),
  transitNumber: Yup.string()
    .matches(/^\d{5}$/, STRINGS.transitNumberValid)
    .required(STRINGS.transitNumberError),
  cheque: Yup.number().min(1).required(STRINGS.chequeError),
  sinNumber: Yup.string().length(9).required(STRINGS.sinNumberError),
  sinDocument: Yup.number().min(1).required(STRINGS.chequeError),
});

export const userDetailsStep3Schema = Yup.object().shape({
  govtid: Yup.number().min(1).required(STRINGS.govtIdError),
  supportingDocument: Yup.number().min(1).required(STRINGS.documentError),
});

// supportingDocument: number | null;
export const getYearEndAndStartDate = (type: 'end' | 'start') => {
  const yearStart = moment().subtract(12, 'months');
  const yearEnd = moment().add(2, 'months');
  return type === 'end' ? yearEnd : yearStart;
};

export const getDateFromDuration = (): Moment => {
  const finaleDate = moment();

  return finaleDate;
};

// job post step 1;
export const jobPostStep1Schema = Yup.object().shape({
  jobType: Yup.string().required(STRINGS.address_Required),
  jobDuties: Yup.string()
    .required(STRINGS.job_duties_required)
    .min(20, STRINGS.jobDescription_min),
  jobDescription: Yup.string()
    .required(STRINGS.jobDescription)
    .min(20, STRINGS.jobDescription_min),
  jobTitle: Yup.string().required(STRINGS.job_title_required),
});

// job post step 2;
export const jobPostStep2Schema = Yup.object().shape({
  postalCode: Yup.string().required(STRINGS.postal_code_required),
  city: Yup.string().required(STRINGS.city_required),
  address: Yup.string().required(STRINGS.address),
  location: Yup.string().required(STRINGS.location_required),
  shiftEndTime: Yup.date().required(STRINGS.end_time_required),
  shiftStartTime: Yup.date().required(STRINGS.start_time_required),
  eventDate: Yup.date().required(STRINGS.end_date_required),
});

//job post step  3:
export const jobPostStep3Schema = Yup.object().shape({
  requiredEmployee: Yup.number().required(STRINGS.employee_required),
  salary: Yup.string().required(STRINGS.wage_required),
});

// salary: '',
// paymentDuration: '',
// requiredCertificates: '',
// gender: '',
