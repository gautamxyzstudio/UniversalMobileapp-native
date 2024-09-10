import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {memo} from 'react';
import {UPLOAD} from '@assets/exporter';
import {Row} from '@components/atoms/Row';
import {Theme} from '@theme/Theme.type';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {verticalScale} from '@utils/metrics';
import {fonts} from '@utils/common.styles';
import UploadedAssetCard from './UploadedAssetCard';
import {IImage} from '@utils/photomanager';
import {IDocument} from '@utils/doumentManager';

type PredefinedCertificatesCardPropsTypes = {
  certificate: string;
  value: IImage | IDocument | null;
  onPressUpload: () => void;
  uploadStatus: 'pending' | 'success' | 'failed';
  onPressRetry: () => void;
  onPressCross: (certificate: string) => void;
};

const PredefinedCertificatesCard: React.FC<
  PredefinedCertificatesCardPropsTypes
> = ({
  certificate,
  onPressUpload,
  value,
  onPressCross,
  uploadStatus,
  onPressRetry,
}) => {
  const styles = useThemeAwareObject(getStyles);
  return (
    <View style={styles.certificateContainer}>
      <Row alignCenter spaceBetween>
        <Text style={styles.certificateTitle}>{certificate}</Text>
        {!value && (
          <TouchableOpacity onPress={onPressUpload}>
            <UPLOAD />
          </TouchableOpacity>
        )}
      </Row>
      {value && (
        <UploadedAssetCard
          containerStyles={styles.container}
          fileName={value.fileName}
          size={value.size}
          onPressCross={() => onPressCross(certificate)}
          uploadStatus={uploadStatus}
          retryOnFailure={onPressRetry}
        />
      )}
    </View>
  );
};

export default memo(PredefinedCertificatesCard);

const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    certificateTitle: {
      ...fonts.regular,
      color: theme.color.textPrimary,
    },
    certificateContainer: {
      padding: verticalScale(12),
      borderRadius: 4,
      backgroundColor: theme.color.ternary,
    },
    container: {
      backgroundColor: theme.color.primary,
      width: verticalScale(286),
      marginTop: verticalScale(16),
    },
  });
  return styles;
};
