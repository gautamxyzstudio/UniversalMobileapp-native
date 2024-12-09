export type IJobSeekerDetailsStepsOneStatePropsTypes = {
  validate?: () => Promise<{
    fields: userBasicDetails | null;
    isValid: boolean;
  }>;
};

export type jobSeekerRef = {
  validate?: () => Promise<{
    fields: userBasicDetails | null;
    isValid: boolean;
  }>;
};
export type IJobSeekerDetailsStepsOneState = {
  name: string;
  selfie: number[];
  email: string;
  phone: string;
  gender: string;
  dob?: Date | null;
  address: string;
  city: string;
  nameError: string;
  emailError: string;
  addressError: string;
  phoneError: string;
  dobError: string;
  cityError: string;
  genderError: string;
};

export type userBasicDetails = {
  name: string;
  phone: string;
  dob: Date;
  address: string;
  email: string;
  city: string;
  gender: string;
  selfie: number[];
};
