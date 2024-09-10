import appleAuth from '@invertase/react-native-apple-authentication';
import jwt_decode from 'jwt-decode';
type IAppleLoginReturnType = {
  fullName: string;
  email: string;
  identityToken: string;
};

export const appleSignInHandler = async (): Promise<IAppleLoginReturnType> => {
  try {
    const response = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    const decodeAuthToken: any = jwt_decode(response.identityToken ?? '');
    return {
      fullName: response.fullName?.givenName
        ? `${response.fullName?.givenName} ${response.fullName?.familyName}`
        : '',
      email: response.email ? `${response.email}` : decodeAuthToken.email ?? '',
      identityToken: response.identityToken ?? '',
    };
  } catch (error) {
    console.log('Apple LOGIN ERROR:', error);
    throw error;
  }
};
