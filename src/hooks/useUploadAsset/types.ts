import {IFile} from '@components/organisms/uploadPopup/types';

export type IUploadAssetsProps = {
  assets: IFile[] | null;
};

export type IUploadAssetsArgs = {
  asset: IFile[];
};

export type IUploadAssetsResponse = Array<IFile>;
