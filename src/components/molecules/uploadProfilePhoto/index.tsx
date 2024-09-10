/* eslint-disable react-hooks/exhaustive-deps */
import {
  ActivityIndicator,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {CAMERA, IC_EDIT, PERSON} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import SelectImagePopup from '../selectimagepopup';
import {BottomSheetMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {IImage} from '@utils/photomanager';
import CustomImageComponent from '@components/atoms/customImage';
import {STRINGS} from 'src/locales/english';
import useUploadAssets from 'src/hooks/useUploadAsset';
import {IDoc} from '@api/features/user/types';

type IUploadProfilePhotoPropTypes = {
  isEditable?: boolean;
  initialImage?: IDoc | undefined | null;
  getUploadedImageIds?: (ids: Array<number>) => void;
};

const UploadProfilePhoto: React.FC<IUploadProfilePhotoPropTypes> = ({
  isEditable = true,
  initialImage,
  getUploadedImageIds,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const compRef = useRef<BottomSheetMethods | null>(null);

  const {uploadImage} = useUploadAssets();
  const [pic, setPic] = useState<IImage | null>(null);

  useEffect(() => {
    if (initialImage && initialImage !== null) {
      if (initialImage) {
        if (typeof initialImage === 'object') {
          setPic({
            url: initialImage.url ?? '',
            uri: '',
            status: 'success',
            id: initialImage.id ?? 0,
            size: initialImage.size ?? 0,
            fileName: initialImage.name,
            extension: initialImage.mime ?? 'jpg',
          });
        }
      }
    }
  }, []);

  const onPressProfilePicture = () => {
    if (isEditable) {
      compRef.current?.snapToIndex(1);
    }
  };

  const onChooseImage = async (image: IImage) => {
    setPic(image);
    try {
      const response = await uploadImage({asset: [image]});
      if (response) {
        getUploadedImageIds && getUploadedImageIds([response[0].id ?? 0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Pressable onPress={onPressProfilePicture} style={styles.container}>
        {pic && (
          <View>
            {pic.status === 'pending' && (
              <View style={styles.loadingView}>
                <ActivityIndicator size={'small'} />
              </View>
            )}
            {pic.status === 'failed' && (
              <View style={styles.errorView}>
                <TouchableOpacity onPress={() => onChooseImage(pic)}>
                  <Text style={styles.retryText}>{STRINGS.retry}</Text>
                </TouchableOpacity>
              </View>
            )}
            <CustomImageComponent
              defaultSource={undefined}
              image={pic.url ? pic?.url : pic.uri}
              customStyle={[styles.main]}
            />
            {isEditable && pic.status === 'success' && (
              <View style={styles.iconView}>
                <IC_EDIT width={verticalScale(20)} height={verticalScale(20)} />
              </View>
            )}
          </View>
        )}
        {!pic && (
          <>
            <View>
              <View style={styles.main}>
                <PERSON width={verticalScale(40)} height={verticalScale(40)} />
              </View>
              {isEditable && (
                <CAMERA
                  width={verticalScale(24)}
                  height={verticalScale(24)}
                  style={styles.camera}
                />
              )}
            </View>
            {isEditable && (
              <Text style={styles.uploadText}>{STRINGS.upload_Photo}</Text>
            )}
          </>
        )}
        <SelectImagePopup
          withFiles={false}
          getSelectedImages={image => onChooseImage(image.assets[0])}
          compRef={compRef}
        />
      </Pressable>
      {pic?.status === 'failed' && (
        <Text style={styles.errorText}>{STRINGS.image_upload_failed}</Text>
      )}
    </>
  );
};

export default UploadProfilePhoto;
