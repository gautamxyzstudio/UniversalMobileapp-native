export type ISignUp = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  isPasswordVisible?: boolean;
  isConfirmPasswordVisible?: boolean;
  emailError?: string;
  passwordError?: string;
  confirmPasswordError?: string;
  isCheckedPrivacyPolicy?: boolean;
};

export type ISignUpParams = {
  route: {
    params: {
      user_type: 'emp' | 'client';
    };
  };
};
