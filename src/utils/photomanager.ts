import {
  CameraOptions,
  ImageLibraryOptions,
  launchCamera,
  launchImageLibrary,
} from 'react-native-image-picker';

export interface IImage {
  status: 'pending' | 'success' | 'failed';
  url?: string;
  fileName: string;
  id: number;
  uri: string;
  size: number;
  extension: string;
}

export const captureImage = async ({
  type,
  configurations,
}: {
  type: 'camera' | 'gallery';
  configurations: CameraOptions | ImageLibraryOptions;
}): Promise<IImage[] | null> => {
  const response =
    type === 'camera'
      ? await launchCamera(configurations)
      : await launchImageLibrary(configurations);

  if (response.assets) {
    let updatedAssets: IImage[] = response.assets.map(asset => {
      return {
        uri: asset.uri ?? '',
        url: undefined,
        status: 'pending',
        size: asset.fileSize ?? 0,
        fileName: asset.fileName ?? 'unknown',
        extension: asset.type ?? 'unknown',
      };
    });

    return updatedAssets;
  } else if (response.errorCode === 'permission') {
    throw new Error('Permission denied');
  } else if (response.errorCode === 'camera_unavailable') {
    throw new Error('Camera not available');
  } else if (response.didCancel) {
    return null;
  } else {
    throw new Error('Something went wrong');
  }
};
