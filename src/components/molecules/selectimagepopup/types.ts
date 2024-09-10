import {
  MediaType,
  PhotoQuality,
  AndroidVideoOptions,
  iOSVideoOptions,
} from 'react-native-image-picker';
import {LegacyRef} from 'react';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {IFile} from '@components/organisms/uploadPopup/types';
export interface ISelectImagePopupProps {
  compRef: LegacyRef<BottomSheetMethods>;
  mediaType?: MediaType;
  withCamera?: boolean;
  withGallery?: boolean;
  isDocumentMultiple?: boolean;
  withFiles?: boolean;
  getSelectedImages: (assets: ISelectedAsset) => void;
  photoQuality?: PhotoQuality;
  videoQuality?: AndroidVideoOptions | iOSVideoOptions;
  selectionLimit?: number;
}

export type ISelectedAsset = {
  type: 'image' | 'document';
  assets: IFile[];
};
