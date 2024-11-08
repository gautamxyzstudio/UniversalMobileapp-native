import {Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {ISelectImagePopupProps} from './types';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {getStyles} from './styles';
import {CAMERA_BLUE, GALLERY, GET} from '@assets/exporter';
import {captureImage} from '@utils/photomanager';
import {BaseBottomSheet} from '../bottomsheet';
import {verticalScale} from '@utils/metrics';
import {STRINGS} from 'src/locales/english';
import {documentPicker} from '@utils/doumentManager';
const SelectImagePopup: React.FC<ISelectImagePopupProps> = ({
  compRef,
  mediaType,
  selectionLimit,
  isDocumentMultiple,
  getSelectedImages,
  withCamera = true,
  withFiles = true,
  withGallery = true,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const modalDefaultHeight = verticalScale(226 + 74);
  const [modalHeight, setModalHeight] = useState(modalDefaultHeight);
  const snapPoints = useMemo(() => [0.01, modalHeight], [modalHeight]);

  useEffect(() => {
    if (!withCamera || !withFiles || !withGallery) {
      setModalHeight(modalDefaultHeight - verticalScale(63 + 16));
    }
  }, [modalDefaultHeight, withCamera, withFiles, withGallery]);

  const captureImageHandler = async (type: 'camera' | 'gallery') => {
    try {
      const images = await captureImage({
        type: type,
        configurations:
          type === 'camera'
            ? {
                mediaType: mediaType ?? 'photo',
                quality: 0.7,
                durationLimit: 60,
                videoQuality: 'low',
                maxHeight: 600,
                maxWidth: 600,
                assetRepresentationMode: 'current',
              }
            : {
                mediaType: mediaType ?? 'photo',
                quality: 0.5,
                maxHeight: 600,
                maxWidth: 600,
                selectionLimit: selectionLimit ?? 1,
                durationLimit: 60,
                videoQuality: 'low',
                assetRepresentationMode: 'current',
              },
      });
      if (images) {
        getSelectedImages({
          type: 'image',
          assets: images,
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  const pickDocument = async () => {
    try {
      const documents = await documentPicker({
        allowMultiSelection: isDocumentMultiple,
      });
      if (documents) {
        getSelectedImages({
          type: 'document',
          assets: [...documents],
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  const onClose = () => {
    // @ts-ignore
    compRef.current?.snapToIndex(0);
  };
  return (
    <BaseBottomSheet onClose={onClose} snapPoints={snapPoints} ref={compRef}>
      <View style={styles.mainView}>
        {withFiles && (
          <TouchableOpacity onPress={() => pickDocument()}>
            <View style={styles.innerView}>
              <View style={styles.imgBg}>
                <GET width={verticalScale(24)} height={verticalScale(24)} />
              </View>
              <Text style={styles.uploadText}>{STRINGS.upload_from_files}</Text>
            </View>
          </TouchableOpacity>
        )}
        {withGallery && (
          <TouchableOpacity onPress={() => captureImageHandler('gallery')}>
            <View style={styles.innerView}>
              <View style={styles.imgBg}>
                <GALLERY width={verticalScale(24)} height={verticalScale(24)} />
              </View>
              <Text style={styles.uploadText}>
                {STRINGS.upload_from_gallery}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {withCamera && (
          <TouchableOpacity onPress={() => captureImageHandler('camera')}>
            <View style={styles.innerView}>
              <View style={styles.imgBg}>
                <CAMERA_BLUE
                  width={verticalScale(24)}
                  height={verticalScale(24)}
                />
              </View>
              <Text style={styles.uploadText}>
                {STRINGS.take_photo_from_camera}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </BaseBottomSheet>
  );
};

export default SelectImagePopup;
