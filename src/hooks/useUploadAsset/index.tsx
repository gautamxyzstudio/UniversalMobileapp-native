import {
  IUploadAssetsArgs,
  IUploadAssetsProps,
  IUploadAssetsResponse,
} from './types';
import {apiEndPoints} from '@api/endpoints';
import {useSelector} from 'react-redux';

import axios, {AxiosResponse} from 'axios';
import {useReducer} from 'react';
import {IFile} from '@components/organisms/uploadPopup/types';
import {userBasicDetailsFromState} from '@api/features/user/userSlice';

const useUploadAssets = () => {
  const user = useSelector(userBasicDetailsFromState);
  const [state, updateState] = useReducer(
    (prev: IUploadAssetsProps, next: Partial<IUploadAssetsProps>) => {
      return {...prev, ...next};
    },
    {assets: null},
  );

  const uploadImage = async (
    args: IUploadAssetsArgs,
  ): Promise<IFile[] | null> => {
    try {
      const form = new FormData();
      args.asset.forEach(asset => {
        form.append('files', {
          name: asset.fileName,
          type: asset.extension,
          uri: asset.uri,
        } as any);
      });

      args.asset.forEach(asset => {
        asset.status = 'pending';
      });
      updateState({assets: args.asset});

      const uploadAsset: AxiosResponse<IUploadAssetsResponse> =
        await axios.post(apiEndPoints.upload, form, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        });

      if (uploadAsset?.data) {
        args.asset.forEach((item, index) => {
          item.id = uploadAsset.data[index]?.id;
          item.status = 'success';
        });
        updateState({assets: args.asset});
        return args.asset;
      }
      return null;
    } catch (error) {
      args.asset.forEach(asset => {
        asset.status = 'failed';
        asset.errorMessage = 'Image upload failed';
        return asset;
      });
      updateState({assets: args.asset});
      // Log the error
      console.error('Upload failed', error);
      throw error;
    }
  };

  return {
    uploadImage,
    assets: state.assets,
  };
};

export default useUploadAssets;
