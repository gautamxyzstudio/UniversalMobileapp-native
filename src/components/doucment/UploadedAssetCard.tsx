import {
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {memo} from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {IC_DOCUMENT, IC_CROSS} from '@assets/exporter';
import {verticalScale} from '@utils/metrics';
import {Theme} from '@theme/Theme.type';
import {fonts} from '@utils/common.styles';
import {convertBytesToMB} from '@utils/utils.common';
import {ActivityIndicator} from 'react-native-paper';
import {useTheme} from '@theme/Theme.context';

type UploadedAssetCardPropTypes = {
  fileName: string;
  size: number;
  uploadStatus: 'pending' | 'success' | 'failed';
  onPressCross: () => void;
  retryOnFailure: () => void;
  containerStyles?: StyleProp<ViewStyle>;
};

const UploadedAssetCard: React.FC<UploadedAssetCardPropTypes> = ({
  fileName,
  size,
  containerStyles,
  retryOnFailure,
  uploadStatus = 'pending',
  onPressCross,
}) => {
  const styles = useThemeAwareObject(getStyles);
  const theme = useTheme();
  return (
    <View style={[styles.documentUploadedContainer, containerStyles]}>
      <View style={styles.leftView}>
        <IC_DOCUMENT width={verticalScale(24)} height={verticalScale(24)} />
        <View style={styles.description}>
          <Text numberOfLines={1} ellipsizeMode="middle" style={styles.docName}>
            {fileName}
          </Text>
          <Text style={styles.size}>{convertBytesToMB(size)}</Text>
        </View>
      </View>
      {uploadStatus === 'failed' && (
        <TouchableOpacity onPress={retryOnFailure} style={styles.rightView}>
          <Text style={styles.retryButton}>Retry</Text>
        </TouchableOpacity>
      )}
      {uploadStatus === 'pending' && (
        <ActivityIndicator size={'small'} color={theme.theme.color.darkBlue} />
      )}
      {uploadStatus !== 'pending' && (
        <TouchableOpacity onPress={onPressCross} style={styles.rightView}>
          <IC_CROSS width={verticalScale(24)} height={verticalScale(24)} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(UploadedAssetCard);

export const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    documentUploadedContainer: {
      borderRadius: 4,
      backgroundColor: theme.color.ternary,
      width: verticalScale(310),
      paddingHorizontal: verticalScale(12),
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: verticalScale(56),
    },
    leftView: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    description: {
      marginLeft: verticalScale(12),
    },
    docName: {
      width: verticalScale(130),
      ...fonts.small,
      color: theme.color.textPrimary,
    },
    size: {
      marginTop: verticalScale(2),
      ...fonts.extraSmall,
      color: theme.color.disabled,
    },
    rightView: {direction: 'rtl', flexDirection: 'row'},
    retryButton: {
      color: theme.color.red,
    },
  });
  return styles;
};
