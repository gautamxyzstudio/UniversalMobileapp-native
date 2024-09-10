import Geolocation, {
  GeolocationError,
  GeolocationResponse,
} from '@react-native-community/geolocation';

export const getCurrentLocation = async () => {
  const position: any = await new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      (sucess: GeolocationResponse) => {
        resolve({
          longitude: sucess.coords.longitude,
          latitude: sucess.coords.latitude,
        });
      },
      (error: GeolocationError) => {
        reject(error);
        return error;
      },
    );
  });
  return position;
};
