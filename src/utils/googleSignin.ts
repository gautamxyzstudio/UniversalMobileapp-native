import {GoogleSignin} from '@react-native-google-signin/google-signin';

type IGoogleSignInReturnType = {
  token: string;
  name: string | null | undefined;
  email: string | null | undefined;
  image: string | null | undefined;
};

export const googleSignInHandler =
  async (): Promise<IGoogleSignInReturnType> => {
    try {
      let userDetails = await GoogleSignin.signIn();
      let token = await GoogleSignin.getTokens();
      return {
        token: token.accessToken ?? '',
        name: userDetails.user.name ?? '',
        image: userDetails.user.photo ?? '',
        email: userDetails.user.email ?? '',
      };
    } catch (error) {
      console.log(error, 'GOOGLE SIGNIN ERROR');
      throw error;
    }
  };
