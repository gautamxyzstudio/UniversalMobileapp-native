import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {memo} from 'react';
import {CLOUD} from '@assets/exporter';
import CustomButton from '@components/molecules/customButton';
import {STRINGS} from 'src/locales/english';
import {Theme, useThemeAwareObject} from '@theme/index';
import {fonts} from '@utils/common.styles';
import {verticalScale} from '@utils/metrics';

type DocUploadViewPropTypes = {
  onPresUpload: () => void;
};

const DocUploadView: React.FC<DocUploadViewPropTypes> = ({onPresUpload}) => {
  const styles = useThemeAwareObject(getStyles);
  return (
    <View style={styles.containerMain}>
      <CLOUD />
      <Text style={styles.uploadText}>{STRINGS.upload_your_documents}</Text>
      <CustomButton
        disabled={false}
        buttonStyle={styles.button}
        title={'Choose'}
        titleStyles={styles.buttonText}
        onButtonPress={onPresUpload}
      />
    </View>
  );
};

export default memo(DocUploadView);

const getStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    containerMain: {
      // flex: 1,
      minHeight: verticalScale(100),
      justifyContent: 'center',
      alignItems: 'center',
    },
    uploadText: {
      marginVertical: 8,
      ...fonts.small,
      color: '#C5C5C5',
    },
    button: {
      backgroundColor: theme.color.purple,
      paddingVertical: Platform.OS === 'ios' ? 0 : verticalScale(6),
      height: verticalScale(28),
    },
    buttonText: {
      color: theme.color.textPrimary,
      lineHeight: 12,
      ...fonts.small,
    },
  });
  return styles;
};
