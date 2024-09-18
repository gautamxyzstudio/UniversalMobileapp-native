import {StyleSheet, View} from 'react-native';
import React from 'react';
import {useThemeAwareObject} from '@theme/ThemeAwareObject.hook';
import {Theme} from '@theme/Theme.type';
import {verticalScale} from '@utils/metrics';
import CustomText, {textSizeEnum} from '@components/atoms/CustomText';
import {STRINGS} from 'src/locales/english';
import Spacers from '@components/atoms/Spacers';
import TextWithIcon from '@components/molecules/TextWithIcon';
import {IC_MAIL, IC_PHONE} from '@assets/exporter';

interface CandidatesContactDetailsPropsTypes {
  email: string;
  phoneNumber: string;
}

const CandidatesContactDetails: React.FC<
  CandidatesContactDetailsPropsTypes
> = ({email, phoneNumber}) => {
  const styles = useThemeAwareObject(createStyles);
  return (
    <View style={styles.container}>
      <CustomText
        value={STRINGS.contact_details}
        size={textSizeEnum.mediumBold}
      />
      <Spacers type="vertical" scalable size={16} />
      <TextWithIcon icon={IC_MAIL} value={email} size={textSizeEnum.regular} />
      <Spacers type="vertical" scalable size={16} />
      <TextWithIcon
        icon={IC_PHONE}
        value={phoneNumber}
        size={textSizeEnum.regular}
      />
    </View>
  );
};

export default CandidatesContactDetails;
const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.color.strokeLight,
      borderRadius: 8,
      padding: verticalScale(12),
    },
  });
